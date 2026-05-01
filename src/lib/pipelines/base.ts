/**
 * Pipeline Base — Shared utilities for all document generation pipelines.
 *
 * Extracted from execute/route.ts (lines 1-130) to eliminate duplication.
 * Applies Sandeco's layered architecture: shared infrastructure in one place.
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, existsSync, readdirSync, mkdirSync, statSync, writeFileSync, renameSync } from 'fs';
import path from 'path';
import { CLAUDE_BIN_CANDIDATES } from '@/lib/config/paths';

// ═══════════════════════════════════════════════════════════════
// DATA ACCESS
// ═══════════════════════════════════════════════════════════════

const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');
const GENERATIONS_FILE = path.join(process.cwd(), 'data', 'generations.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readGenerations(): any[] {
  if (!existsSync(GENERATIONS_FILE)) return [];
  try { return JSON.parse(readFileSync(GENERATIONS_FILE, 'utf-8')); } catch { return []; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function writeGenerations(gens: any[]) {
  writeFileSync(GENERATIONS_FILE, JSON.stringify(gens, null, 2), 'utf-8');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function upsertGeneration(gen: any) {
  const gens = readGenerations();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idx = gens.findIndex((g: any) => g.id === gen.id);
  if (idx >= 0) gens[idx] = { ...gens[idx], ...gen };
  else gens.push(gen);
  writeGenerations(gens);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readClients(): any[] {
  if (!existsSync(CLIENTS_FILE)) return [];
  return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8'));
}

// ═══════════════════════════════════════════════════════════════
// CLAUDE CLI
// ═══════════════════════════════════════════════════════════════

let _claudeBin: string | null = null;
export function findClaudeBin(): string | null {
  if (_claudeBin) return _claudeBin;
  for (const p of CLAUDE_BIN_CANDIDATES) {
    if (existsSync(p)) { _claudeBin = p; return p; }
  }
  try {
    const resolved = execSync('which claude', { encoding: 'utf-8' }).trim();
    if (resolved && existsSync(resolved)) { _claudeBin = resolved; return resolved; }
  } catch {}
  return null;
}

export interface RunClaudeOptions {
  /** Hard wall-clock timeout. Default 45min. */
  timeoutMs?: number;
  /** Idle timeout — kill if no stdout/stderr for this long. Default 10min. */
  idleTimeoutMs?: number;
}

export interface RunClaudeResult {
  code: number;
  stdout: string;
  stderr: string;
  /** True if killed by hard or idle timeout. */
  timedOut?: boolean;
  /** Which timeout fired: 'hard' (wall time) or 'idle' (no output). */
  timeoutKind?: 'hard' | 'idle';
}

export const RUN_CLAUDE_DEFAULT_TIMEOUT_MS = 60 * 60 * 1000; // 60min hard wall (was 45min)
export const RUN_CLAUDE_DEFAULT_IDLE_MS = 20 * 60 * 1000;    // 20min idle (was 10min) — Fase 1 lê RAGs+benchmarks pesados

export function runClaude(
  claudeBin: string,
  instruction: string,
  onStdout?: (chunk: string) => void,
  onStderr?: (chunk: string) => void,
  options?: RunClaudeOptions,
): Promise<RunClaudeResult> {
  const timeoutMs = options?.timeoutMs ?? RUN_CLAUDE_DEFAULT_TIMEOUT_MS;
  const idleTimeoutMs = options?.idleTimeoutMs ?? RUN_CLAUDE_DEFAULT_IDLE_MS;

  return new Promise((resolve) => {
    const proc = spawn(claudeBin, [
      '-p', instruction,
      '--allowedTools', 'Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch',
    ], {
      shell: false,
      env: { ...process.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let settled = false;
    let timeoutKind: 'hard' | 'idle' | undefined;
    let idleTimer: NodeJS.Timeout | undefined;
    let hardTimer: NodeJS.Timeout | undefined;
    let killFollowup: NodeJS.Timeout | undefined;

    const clearTimers = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (hardTimer) clearTimeout(hardTimer);
      if (killFollowup) clearTimeout(killFollowup);
    };

    const killCascade = (kind: 'hard' | 'idle', reason: string) => {
      if (settled || timeoutKind) return;
      timeoutKind = kind;
      stderr += `\n[runClaude] ${reason} — sending SIGTERM\n`;
      try { proc.kill('SIGTERM'); } catch {}
      killFollowup = setTimeout(() => {
        if (settled) return;
        stderr += `[runClaude] SIGTERM did not settle after 30s — sending SIGKILL\n`;
        try { proc.kill('SIGKILL'); } catch {}
      }, 30_000);
      killFollowup.unref();
    };

    const resetIdle = () => {
      if (settled) return;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(
        () => killCascade('idle', `idle timeout — no output for ${idleTimeoutMs}ms`),
        idleTimeoutMs,
      );
      idleTimer.unref();
    };

    hardTimer = setTimeout(
      () => killCascade('hard', `hard timeout — ${timeoutMs}ms wall time exceeded`),
      timeoutMs,
    );
    hardTimer.unref();
    resetIdle();

    proc.stdout.on('data', (d: Buffer) => {
      const chunk = d.toString();
      stdout += chunk;
      if (onStdout) onStdout(chunk);
      resetIdle();
    });
    proc.stderr.on('data', (d: Buffer) => {
      const chunk = d.toString();
      stderr += chunk;
      if (onStderr) onStderr(chunk);
      resetIdle();
    });
    proc.on('close', (code: number | null) => {
      if (settled) return;
      settled = true;
      clearTimers();
      const result: RunClaudeResult = { code: code ?? 1, stdout, stderr };
      if (timeoutKind) { result.timedOut = true; result.timeoutKind = timeoutKind; }
      resolve(result);
    });
    proc.on('error', (err: Error) => {
      if (settled) return;
      settled = true;
      clearTimers();
      resolve({ code: 1, stdout: '', stderr: `spawn error: ${err.message}` });
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// FILE UTILITIES
// ═══════════════════════════════════════════════════════════════

/** Directories never worth scanning when hunting for generated documents. */
const FIND_DOCX_SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', '.cache', 'dist', 'build',
  '__pycache__', '.venv', 'venv', '.pytest_cache',
]);

/** Max recursion depth when scanning for new docs. 4 is enough for CARTAS/, thumbs/, etc. */
const FIND_DOCX_MAX_DEPTH = 4;

/**
 * Find newly created documents (docx, pptx, md) in a directory.
 *
 * Recursive: Claude often creates subdirectories like CARTAS/ for satellite letters,
 * thumbs/ for Business Plan charts, versions/ for drafts. Non-recursive scan misses
 * those — responsible for a large share of "exit 0 but no docx" false-failures.
 * Skips well-known noise directories (node_modules, .git, .next, etc).
 */
export function findNewDocx(dir: string, afterMs: number, maxDepth: number = FIND_DOCX_MAX_DEPTH): string[] {
  if (!existsSync(dir) || maxDepth < 0) return [];
  const results: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (FIND_DOCX_SKIP_DIRS.has(entry.name)) continue;
        results.push(...findNewDocx(full, afterMs, maxDepth - 1));
        continue;
      }
      if (!entry.isFile()) continue;
      if (!(entry.name.endsWith('.docx') || entry.name.endsWith('.pptx') || entry.name.endsWith('.md'))) continue;
      if (entry.name.startsWith('REVIEW_')) continue;
      try {
        if (statSync(full).mtimeMs > afterMs) results.push(full);
      } catch {}
    }
  } catch {}
  return results;
}

/**
 * Auto-version existing files with V[N]_ PREFIX.
 * Convention: V1_arquivo.docx, V2_arquivo.docx (prefix, never suffix).
 */
export function autoVersionExisting(dir: string) {
  if (!existsSync(dir)) return;
  try {
    const files = readdirSync(dir).filter(f =>
      (f.endsWith('.docx') || f.endsWith('.pptx') || f.endsWith('.md') || f.endsWith('.json')) &&
      !f.startsWith('REVIEW_') && !f.startsWith('.') && !f.startsWith('V')
    );
    for (const f of files) {
      const fullPath = path.join(dir, f);
      let v = 1;
      while (existsSync(path.join(dir, `V${v}_${f}`))) v++;
      const versionedPath = path.join(dir, `V${v}_${f}`);
      try { renameSync(fullPath, versionedPath); } catch {}
    }
  } catch {}
}

/**
 * Ensure a directory exists, creating it if necessary.
 */
export function ensureDir(dir: string): boolean {
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// SSE HELPERS
// ═══════════════════════════════════════════════════════════════

export type SendFn = (event: string, data: object) => void;

export interface PhaseResult {
  phase: string;
  label: string;
  success: boolean;
  duration_seconds: number;
  files_created: string[];
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// CASE ID
// ═══════════════════════════════════════════════════════════════

export function deriveCaseId(clientName: string): string {
  return clientName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// ═══════════════════════════════════════════════════════════════
// EVIDENCE PREFLIGHT (rule r220 — text extraction before any prompt)
// ═══════════════════════════════════════════════════════════════

export interface EvidencePreflightEntry {
  filename: string;
  relative_path: string;
  absolute_path: string;
  sha256: string;
  type: string;
  char_count: number;
  ocr_used: boolean | null;
  status: 'ok' | 'starved';
}

export interface EvidencePreflightResult {
  ok: boolean;
  manifestPath: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: any | null;
  summary: string;
  starved: EvidencePreflightEntry[];
  error?: string;
}

const PREFLIGHT_SCRIPT = path.join(process.cwd(), 'scripts', 'preflight_extract_evidence.py');
const EVIDENCE_EXTRACTED_DIR = path.join(process.cwd(), 'data', 'evidence_extracted');

export function runEvidencePreflight(opts: {
  clientId: string;
  evidenceDir: string;
  forceRerun?: boolean;
}): EvidencePreflightResult {
  const outputDir = path.join(EVIDENCE_EXTRACTED_DIR, opts.clientId);
  const manifestPath = path.join(outputDir, 'manifest.json');
  const empty: EvidencePreflightResult = {
    ok: false, manifestPath, manifest: null, summary: '', starved: [],
  };

  if (!existsSync(opts.evidenceDir)) {
    return { ...empty, error: `evidence dir not found: ${opts.evidenceDir}` };
  }
  if (!existsSync(PREFLIGHT_SCRIPT)) {
    return { ...empty, error: `preflight script not found: ${PREFLIGHT_SCRIPT}` };
  }

  const needsRun = opts.forceRerun || !existsSync(manifestPath);
  if (needsRun) {
    try { mkdirSync(outputDir, { recursive: true }); } catch {}
    try {
      execSync(
        `python3 "${PREFLIGHT_SCRIPT}" --client-id "${opts.clientId}" --evidence-dir "${opts.evidenceDir}" --output-dir "${outputDir}"`,
        { encoding: 'utf-8', timeout: 30 * 60 * 1000, maxBuffer: 64 * 1024 * 1024 },
      );
    } catch {
      // Non-zero exit means starvation; manifest is still written. Fall through to read it.
    }
  }

  if (!existsSync(manifestPath)) {
    return { ...empty, error: 'manifest not generated by preflight' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let manifest: any;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    return { ...empty, error: `failed to parse manifest: ${(err as Error).message}` };
  }

  const entries: EvidencePreflightEntry[] = manifest.entries || [];
  const starved = entries.filter(e => e.status === 'starved');

  const lines: string[] = [
    '',
    '## EVIDENCE MANIFEST (preflight extracted — rule r220)',
    `Client: ${opts.clientId} · Total: ${entries.length} · OK: ${manifest.ok_count ?? entries.length - starved.length} · Starved: ${starved.length}`,
    'Use APENAS conteúdo extraído em data/evidence_extracted/{client_id}/{sha256}.txt — NUNCA inferir do filename.',
    '',
  ];
  for (const e of entries) {
    const flag = e.status === 'ok' ? '✓' : '✗';
    const note = e.status === 'ok' ? `${e.char_count} chars` : `STARVED (${e.char_count} chars)`;
    lines.push(`- ${flag} ${e.relative_path} [${e.type}] ${note}${e.ocr_used ? ' (OCR)' : ''}`);
  }
  lines.push('');

  return {
    ok: starved.length === 0,
    manifestPath,
    manifest,
    summary: lines.join('\n'),
    starved,
    error: starved.length
      ? `${starved.length} evidence file(s) starved (< 50 chars): ${starved.slice(0, 5).map(s => s.filename).join(', ')}${starved.length > 5 ? '...' : ''}`
      : undefined,
  };
}

// CHUNK 3 (F1.2) — Helper central para injetar regras ATIVAS de error_rules.json
// em qualquer prompt antes de despachar ao claude. Sem isto, pipelines não
// consomem o aprendizado acumulado em error_rules.json — sintoma chave da
// regressão "passo 363 → passo 13" identificada na auditoria 30/abr.
//
// Uso (em qualquer pipeline):
//   import { buildRulesSectionForDocType } from './base';
//   const rulesBlock = buildRulesSectionForDocType(docType);
//   const fullPrompt = rulesBlock + originalPrompt;
//
// Lê data/error_rules.json a cada chamada (sem cache) — o file é pequeno
// (~120 KB) e a frequência de chamada é baixa (1× por geração); sem
// otimização prematura.
export function buildRulesSectionForDocType(docType: string): string {
  const RULES_FILE = path.join(process.cwd(), 'data', 'error_rules.json');
  if (!existsSync(RULES_FILE)) return '';
  let rules: Array<Record<string, unknown>> = [];
  try {
    rules = JSON.parse(readFileSync(RULES_FILE, 'utf-8'));
  } catch { return ''; }
  const active = rules.filter(r => r.active === true);
  const isGlobal = (r: Record<string, unknown>) => {
    const dt = r.doc_type;
    return !dt || dt === '*' || (Array.isArray(dt) && dt.length === 0);
  };
  const isSpecific = (r: Record<string, unknown>) => {
    const dt = r.doc_type;
    if (Array.isArray(dt)) return dt.includes(docType);
    if (typeof dt === 'string' && dt !== '*') return dt === docType;
    return false;
  };
  const global = active.filter(isGlobal);
  const specific = active.filter(isSpecific);
  const all = [...global, ...specific];
  if (all.length === 0) return '';

  const lines: string[] = [
    '',
    '## REGRAS DE ERRO ATIVAS — auto-learning (INJETADAS PELO PIPELINE)',
    `Total: ${all.length} regras (${global.length} globais + ${specific.length} específicas para ${docType})`,
    'RESPEITE TODAS. Violação de regra com severidade BLOCK = rejeição automática.',
    '',
  ];
  for (const r of all) {
    const rawAction = ((r.rule_action ?? r.action ?? 'warn') as string).toString().toLowerCase();
    const prefix = rawAction === 'block' ? 'BLOCK' : rawAction === 'auto_fix' ? 'AUTO-FIX' : 'WARN';
    const severity = ((r.severity as string) || 'medium').toUpperCase();
    const desc = ((r.rule_description ?? r.message ?? '') as string);
    const pat = (r.rule_pattern ?? r.pattern) as string | undefined;
    const checkSuffix = r.check ? ` [check:${r.check as string}]` : '';
    lines.push(`- [${severity}/${prefix}] ${desc}${pat ? ` (regex: ${pat})` : ''}${checkSuffix}`);
  }
  lines.push('');
  return lines.join('\n');
}
