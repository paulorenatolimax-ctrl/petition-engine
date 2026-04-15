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

export function runClaude(
  claudeBin: string,
  instruction: string,
  onStdout?: (chunk: string) => void,
  onStderr?: (chunk: string) => void,
): Promise<{ code: number; stdout: string; stderr: string }> {
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
    proc.stdout.on('data', (d: Buffer) => {
      const chunk = d.toString();
      stdout += chunk;
      if (onStdout) onStdout(chunk);
    });
    proc.stderr.on('data', (d: Buffer) => {
      const chunk = d.toString();
      stderr += chunk;
      if (onStderr) onStderr(chunk);
    });
    proc.on('close', (code: number | null) => resolve({ code: code ?? 1, stdout, stderr }));
    proc.on('error', (err: Error) => resolve({ code: 1, stdout: '', stderr: `spawn error: ${err.message}` }));
  });
}

// ═══════════════════════════════════════════════════════════════
// FILE UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Find newly created documents (docx, pptx, md) in a directory.
 */
export function findNewDocx(dir: string, afterMs: number): string[] {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.docx') || f.endsWith('.pptx') || f.endsWith('.md'))
      .filter(f => !f.startsWith('REVIEW_') && !f.startsWith('.'))
      .map(f => path.join(dir, f))
      .filter(f => { try { return statSync(f).mtimeMs > afterMs; } catch { return false; } });
  } catch { return []; }
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
