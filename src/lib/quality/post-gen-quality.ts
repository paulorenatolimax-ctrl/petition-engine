/**
 * Post-generation Quality Gate + AutoDebugger learning loop.
 *
 * CHUNK 6+7 (F2.5+F2.2) — Auditoria 30/abr identificou que pipelines DEDICADOS
 * (testimony-letters, cover-letter-*) NÃO chamavam Quality Gate. Apenas o
 * generic dispatcher chamava (PHASE 1.5/1.55 inline em execute/route.ts).
 * Resultado: cartas e cover letters nunca passavam por validação automática,
 * e auto-debugger nunca recebia signals — daí "0 de 211 regras criadas pelo
 * auto-debugger" (auditoria 02_qualidade_acumulativa).
 *
 * Este helper consolida Quality Gate + AutoDebugger num único ponto chamável
 * por TODOS os pipelines após gerar cada arquivo. Resolve o sintoma central
 * da regressão "passo 363 → 13".
 *
 * Observabilidade: emite eventos SSE detalhados sobre score, violações,
 * regras criadas/atualizadas, e logs explícitos quando algo falha.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import type { SendFn } from '@/lib/pipelines/base';

export interface PostGenQualityParams {
  docxPath: string;        // arquivo gerado (absolute path)
  docType: string;         // doc_type (testimony_letter_eb2_niw, cover_letter_eb1a, etc)
  caseId?: string;         // case_id pra master_facts/hard_blocks
  clientName?: string;
  visaType?: string;
  genId: string;
  send: SendFn;
  /**
   * Severity threshold pra rejeitar (não entregar) o documento.
   * Default 'critical' — só bloqueia em violações críticas.
   * Pra 'high' ou superior, todas violações high+critical bloqueiam.
   */
  blockThreshold?: 'critical' | 'high' | 'medium' | 'low';
}

export interface PostGenQualityResult {
  ok: boolean;
  score: number;
  violations_total: number;
  violations_critical: number;
  rules_created: number;
  rules_updated: number;
  rejected: boolean;
  rejection_reason?: string;
}

const SEVERITY_RANK: Record<string, number> = {
  low: 1, medium: 2, high: 3, critical: 4,
};

/**
 * Extract plain text from a .md or .docx file. Falls back to '' on failure
 * (Quality Gate then runs against empty string and likely flags absence,
 * but we don't crash the pipeline).
 */
function extractText(filePath: string): string {
  if (filePath.endsWith('.md')) {
    try { return readFileSync(filePath, 'utf-8'); } catch { return ''; }
  }
  try {
    return execSync(
      `python3 -c "from docx import Document; doc=Document('${filePath}'); print('\\n'.join(p.text for p in doc.paragraphs))"`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024, timeout: 30_000 },
    );
  } catch {
    return '';
  }
}

export async function runQualityGateAndLearn(params: PostGenQualityParams): Promise<PostGenQualityResult> {
  const { docxPath, docType, clientName, visaType, genId, send } = params;
  const blockThreshold = params.blockThreshold ?? 'critical';

  send('stage', { stage: 'phase', phase: 1.5, message: `Quality Gate — ${docxPath.split('/').pop()}` });

  const docText = extractText(docxPath);
  if (!docText) {
    send('stage', { stage: 'warning', phase: 1.5, message: `extração de texto falhou em ${docxPath.split('/').pop()} — Quality Gate skip` });
    return { ok: false, score: 0, violations_total: 0, violations_critical: 0, rules_created: 0, rules_updated: 0, rejected: false };
  }

  // ═══ PHASE 1.5 — Quality Gate ═══
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let qualityResult: any;
  try {
    const { runQualityLocal } = await import('@/agents/quality-local');
    qualityResult = await runQualityLocal({
      documentText: docText,
      docType,
      clientName: clientName || '',
    });
    void visaType; // reservado pra futura extensão de QualityInput
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    send('stage', { stage: 'warning', phase: 1.5, message: `Quality Gate falhou: ${msg.slice(0, 200)}` });
    return { ok: false, score: 0, violations_total: 0, violations_critical: 0, rules_created: 0, rules_updated: 0, rejected: false };
  }

  const violations = qualityResult.violations || [];
  const score = qualityResult.score ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blockingViolations = violations.filter((v: any) => SEVERITY_RANK[v.severity || 'medium'] >= SEVERITY_RANK[blockThreshold]);

  if (blockingViolations.length > 0) {
    send('stage', { stage: 'warning', phase: 1.5, message: `Quality Gate REPROVADO (${score}/100). ${blockingViolations.length} violação(ões) ${blockThreshold}+.` });
  } else if (violations.length > 0) {
    send('stage', { stage: 'info', phase: 1.5, message: `Quality Gate OK (${score}/100). ${violations.length} violação(ões) abaixo do threshold ${blockThreshold}.` });
  } else {
    send('stage', { stage: 'info', phase: 1.5, message: `Quality Gate OK (${score}/100). Nenhuma violação.` });
  }

  // ═══ PHASE 1.55 — AutoDebugger feedback loop ═══
  let rules_created = 0;
  let rules_updated = 0;

  if (violations.length > 0) {
    send('stage', { stage: 'phase', phase: 1.55, message: `AutoDebugger — processando ${violations.length} signal(s)` });
    try {
      const { reportBatch } = await import('@/agents/auto-debugger-local');
      // Filtro: signals que NÃO vêm de regras existentes (rule_description começa com letra,
      // não com 'r123' que seria id de regra). Auditoria descobriu que o filtro original
      // estava OK mas signals nunca chegavam pq Quality Gate não rodava em pipelines
      // dedicados. Esse helper resolve isso.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const signals = violations
        .filter((v: any) => !/^r\d+$/.test(v.rule || ''))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((v: any) => ({
          errorDescription: `${v.rule}: ${v.match || ''}`.slice(0, 180),
          docType: docType || null,
          severity: v.severity || 'medium',
          sourceGenId: genId,
        }));

      send('stage', { stage: 'info', phase: 1.55, message: `AutoDebugger: ${signals.length} signal(s) qualificado(s) pra aprendizado` });

      if (signals.length > 0) {
        const learnResults = await reportBatch(signals);
        rules_created = learnResults.filter(r => r.action === 'new_rule_created').length;
        rules_updated = learnResults.filter(r => r.action === 'existing_rule_updated').length;
        const skipped = learnResults.filter(r => r.action === 'skipped_duplicate').length;
        send('stage', { stage: 'info', phase: 1.55, message: `AutoDebugger: ${rules_created} novas, ${rules_updated} atualizadas, ${skipped} skipped (duplicatas)` });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      send('stage', { stage: 'warning', phase: 1.55, message: `AutoDebugger falhou: ${msg.slice(0, 200)}` });
    }
  }

  // ═══ PHASE 1.6 — Resume vs benchmark (CHUNK 13 / F3.5) ═══
  // Para resume_eb1a / resume_eb2_niw, rodar validate_resume_against_benchmark.py
  // e reportar violações estruturais (anti-template, anti-RAG-pollution, etc).
  if (docType === 'resume_eb1a' || docType === 'resume_eb2_niw') {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'validate_resume_against_benchmark.py');
      if (!existsSync(scriptPath)) {
        send('stage', { stage: 'info', phase: 1.6, message: 'validate_resume_against_benchmark.py não encontrado — skip' });
      } else {
        const out = execSync(
          `python3 ${JSON.stringify(scriptPath)} --file ${JSON.stringify(docxPath)} --json`,
          { encoding: 'utf-8', maxBuffer: 5 * 1024 * 1024, timeout: 30_000 },
        ) || '';
        try {
          const parsed = JSON.parse(out);
          const score = parsed.score ?? 0;
          const passed = parsed.passed ?? 0;
          const total = parsed.total ?? 0;
          const blocking = (parsed.blocking_failures || []) as string[];
          if (blocking.length > 0) {
            send('stage', { stage: 'warning', phase: 1.6, message: `Resume benchmark FALHA score=${score}/100 (${passed}/${total}). Bloqueantes: ${blocking.join(', ')}` });
          } else {
            send('stage', { stage: 'info', phase: 1.6, message: `Resume benchmark OK score=${score}/100 (${passed}/${total})` });
          }
        } catch {
          // ignore parse error
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      send('stage', { stage: 'warning', phase: 1.6, message: `validate_resume_against_benchmark falhou: ${msg.slice(0, 200)}` });
    }
  }

  return {
    ok: true,
    score,
    violations_total: violations.length,
    violations_critical: blockingViolations.length,
    rules_created,
    rules_updated,
    rejected: false, // helper não bloqueia entrega — caller decide com base em blocking_violations
  };
}
