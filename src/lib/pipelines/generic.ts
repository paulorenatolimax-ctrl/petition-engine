/**
 * Generic Multi-Phase Pipeline — Executes any document type
 * using a JSON spec from systems/pipelines/*.json
 *
 * Replaces the single-session handler that generated everything
 * in one massive prompt (which Claude partially ignored).
 *
 * Each phase has a SHORT, FOCUSED prompt → verified output → next phase.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import path from 'path';
import {
  upsertGeneration, runClaude, findNewDocx, autoVersionExisting,
  SendFn, PhaseResult,
} from './base';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface PipelinePhase {
  id: string;
  name: string;
  type: 'python' | 'claude';
  script?: string;
  args?: string[];
  prompt?: string;
  output?: string;
  skip_if_exists?: string;
  validation?: {
    type: 'word_count' | 'contains' | 'exists';
    min?: number;
    patterns?: string[];
    file?: string;
  };
  fail_action?: 'warn' | 'block' | 'retry';
}

interface PipelineSpec {
  doc_type: string;
  name: string;
  version: string;
  description: string;
  phases: PipelinePhase[];
}

interface PipelineParams {
  clientDocsPath: string;
  outputDir: string;
  phasesDir: string;
  systemPath: string;
  clientSlug: string;
  clientName: string;
}

// ═══════════════════════════════════════════════════════════════
// SPEC LOADER
// ═══════════════════════════════════════════════════════════════

const PIPELINES_DIR = path.join(process.cwd(), 'systems', 'pipelines');

export function loadPipelineSpec(docType: string): PipelineSpec | null {
  // Map doc_type to filename
  const filename = docType.replace(/_/g, '-') + '.json';
  const specPath = path.join(PIPELINES_DIR, filename);

  if (!existsSync(specPath)) return null;

  try {
    return JSON.parse(readFileSync(specPath, 'utf-8'));
  } catch {
    return null;
  }
}

export function hasMultiPhaseSpec(docType: string): boolean {
  return loadPipelineSpec(docType) !== null;
}

// ═══════════════════════════════════════════════════════════════
// INTERPOLATION
// ═══════════════════════════════════════════════════════════════

function interpolate(template: string, params: PipelineParams): string {
  return template
    .replace(/\{clientDocsPath\}/g, params.clientDocsPath)
    .replace(/\{outputDir\}/g, params.outputDir)
    .replace(/\{phasesDir\}/g, params.phasesDir)
    .replace(/\{systemPath\}/g, params.systemPath)
    .replace(/\{clientSlug\}/g, params.clientSlug)
    .replace(/\{clientName\}/g, params.clientName);
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════

function validatePhaseOutput(phase: PipelinePhase, params: PipelineParams): { passed: boolean; message: string } {
  if (!phase.validation) return { passed: true, message: 'No validation configured' };

  const v = phase.validation;
  const filePath = v.file ? interpolate(v.file, params) : '';

  switch (v.type) {
    case 'exists': {
      if (!filePath || !existsSync(filePath)) {
        return { passed: false, message: `Output file not found: ${filePath}` };
      }
      return { passed: true, message: `File exists: ${path.basename(filePath)}` };
    }

    case 'word_count': {
      if (!filePath || !existsSync(filePath)) {
        return { passed: false, message: `File not found for word count: ${filePath}` };
      }
      const content = readFileSync(filePath, 'utf-8');
      const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
      const min = v.min || 0;
      if (wordCount < min) {
        return { passed: false, message: `Word count ${wordCount} < minimum ${min}` };
      }
      return { passed: true, message: `Word count: ${wordCount} (min: ${min})` };
    }

    case 'contains': {
      if (!filePath || !existsSync(filePath)) {
        return { passed: false, message: `File not found for contains check: ${filePath}` };
      }
      const text = readFileSync(filePath, 'utf-8');
      const missing = (v.patterns || []).filter(p => !text.includes(p));
      if (missing.length > 0) {
        return { passed: false, message: `Missing required patterns: ${missing.join(', ')}` };
      }
      return { passed: true, message: `All ${v.patterns?.length} patterns found` };
    }

    default:
      return { passed: true, message: 'Unknown validation type' };
  }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTOR
// ═══════════════════════════════════════════════════════════════

export async function runMultiPhasePipeline(
  spec: PipelineSpec,
  claudeBin: string,
  params: PipelineParams,
  send: SendFn,
  genId: string,
  startTime: number,
): Promise<{
  success: boolean;
  phaseResults: PhaseResult[];
  allFiles: string[];
}> {
  const phaseResults: PhaseResult[] = [];
  const allFiles: string[] = [];
  const totalPhases = spec.phases.length;

  // Ensure directories exist
  if (!existsSync(params.phasesDir)) mkdirSync(params.phasesDir, { recursive: true });
  if (!existsSync(params.outputDir)) mkdirSync(params.outputDir, { recursive: true });

  send('stage', { stage: 'info', phase: 0, message: `Pipeline multi-fase: ${spec.name} (${totalPhases} fases)` });

  for (let i = 0; i < spec.phases.length; i++) {
    const phase = spec.phases[i];
    const phaseStart = Date.now();
    const progress = Math.round(((i + 1) / totalPhases) * 100);

    // Check skip condition
    if (phase.skip_if_exists) {
      const skipPath = interpolate(phase.skip_if_exists, params);
      if (existsSync(skipPath)) {
        send('stage', { stage: 'info', phase: phase.id, message: `Fase ${phase.id} pulada — ${path.basename(skipPath)} já existe` });
        phaseResults.push({
          phase: phase.id,
          label: phase.name,
          success: true,
          duration_seconds: 0,
          files_created: [],
        });
        continue;
      }
    }

    send('stage', { stage: 'phase', phase: phase.id, message: `FASE ${phase.id}: ${phase.name}`, progress });
    upsertGeneration({ id: genId, current_phase: `phase_${phase.id}`, current_phase_label: phase.name });

    let success = false;
    let errorMsg = '';

    if (phase.type === 'python') {
      // ═══ PYTHON PHASE ═══
      const scriptPath = path.join(process.cwd(), phase.script || '');
      if (!existsSync(scriptPath)) {
        send('stage', { stage: 'warning', phase: phase.id, message: `Script não encontrado: ${phase.script}` });
        errorMsg = `Script not found: ${phase.script}`;
      } else {
        const args = (phase.args || []).map(a => `"${interpolate(a, params)}"`).join(' ');
        try {
          const result = execSync(`python3 "${scriptPath}" ${args}`, {
            encoding: 'utf-8',
            timeout: 300000,
            maxBuffer: 10 * 1024 * 1024,
          });
          send('stage', { stage: 'gen_complete', phase: phase.id, message: `✅ ${phase.name}: ${result.trim().split('\n').pop()}` });
          success = true;
        } catch (err: unknown) {
          const errOutput = (err as { stderr?: string })?.stderr || String(err);
          send('stage', { stage: 'warning', phase: phase.id, message: `⚠️ ${phase.name}: ${errOutput.slice(0, 300)}` });
          errorMsg = errOutput.slice(0, 500);
          // Python quality gate failure = warn, not block
          if (phase.fail_action === 'warn') success = true;
        }
      }
    } else if (phase.type === 'claude') {
      // ═══ CLAUDE PHASE ═══
      const prompt = interpolate(phase.prompt || '', params);
      send('stage', { stage: 'generating', phase: phase.id, message: `Executando claude -p (fase ${phase.id})...` });

      let lastChunkTime = Date.now();
      const result = await runClaude(claudeBin, prompt,
        (chunk) => {
          const now = Date.now();
          if (now - lastChunkTime > 8000) {
            const preview = chunk.trim().slice(0, 150).replace(/\n/g, ' ');
            if (preview) send('stage', { stage: 'stdout', phase: phase.id, message: preview });
            lastChunkTime = now;
          }
        },
        (chunk) => {
          const preview = chunk.trim().slice(0, 150);
          if (preview) send('stage', { stage: 'stderr', phase: phase.id, message: preview });
        },
      );

      if (result.code === 0) {
        success = true;
        send('stage', { stage: 'gen_complete', phase: phase.id, message: `✅ Fase ${phase.id} concluída` });
      } else {
        errorMsg = `Exit code ${result.code}: ${result.stderr.slice(0, 300)}`;
        send('stage', { stage: 'error', phase: phase.id, message: `❌ Fase ${phase.id} falhou: ${errorMsg.slice(0, 200)}` });
      }
    }

    // Validate output
    if (success && phase.validation) {
      const validation = validatePhaseOutput(phase, params);
      if (!validation.passed) {
        send('stage', { stage: 'warning', phase: phase.id, message: `⚠️ Validação falhou: ${validation.message}` });
        if (phase.fail_action !== 'warn') {
          success = false;
          errorMsg = validation.message;
        }
      } else {
        send('stage', { stage: 'info', phase: phase.id, message: `✅ Validação: ${validation.message}` });
      }
    }

    // Collect new files
    const newFiles = [
      ...findNewDocx(params.phasesDir, phaseStart),
      ...findNewDocx(params.outputDir, phaseStart),
    ].filter((v, idx, a) => a.indexOf(v) === idx);
    allFiles.push(...newFiles);

    const duration = Math.round((Date.now() - phaseStart) / 1000);
    phaseResults.push({
      phase: phase.id,
      label: phase.name,
      success,
      duration_seconds: duration,
      files_created: newFiles.map(f => path.basename(f)),
      ...(errorMsg ? { error: errorMsg } : {}),
    });

    // If a blocking phase fails, stop
    if (!success && phase.fail_action !== 'warn') {
      send('stage', { stage: 'error', phase: phase.id, message: `Pipeline interrompido na fase ${phase.id}` });
      break;
    }
  }

  return {
    success: phaseResults.filter(p => p.success).length >= phaseResults.length / 2,
    phaseResults,
    allFiles: allFiles.filter((v, i, a) => a.indexOf(v) === i),
  };
}
