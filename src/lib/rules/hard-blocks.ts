import { readFileSync, existsSync } from 'fs';
import path from 'path';

export type HardBlockSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface HardBlock {
  id: string;
  pattern: string;
  flags: string;
  reason: string;
  replacement: string | null;
  severity: HardBlockSeverity;
}

export interface HardBlockViolation {
  block: HardBlock;
  matches: string[];
  count: number;
}

export interface HardBlockScrubResult {
  cleaned: string;
  violations: HardBlockViolation[];
  criticalCount: number;
  totalMatches: number;
}

const HARD_BLOCKS_DIR = path.join(process.cwd(), 'data', 'hard_blocks');

function safeLoad(file: string): { blocks?: HardBlock[] } | null {
  const full = path.join(HARD_BLOCKS_DIR, file);
  if (!existsSync(full)) return null;
  try {
    return JSON.parse(readFileSync(full, 'utf-8'));
  } catch { return null; }
}

/**
 * Load hard blocks for a case. Always includes default.json.
 * If caseId is provided and hard_blocks/{caseId}.json exists, appends case-specific blocks.
 */
export function loadHardBlocks(caseId?: string): HardBlock[] {
  const all: HardBlock[] = [];
  const def = safeLoad('default.json');
  if (def?.blocks) all.push(...def.blocks);
  if (caseId) {
    const caseFile = safeLoad(`${caseId}.json`);
    if (caseFile?.blocks) all.push(...caseFile.blocks);
  }
  return all;
}

/**
 * Scan text for hard block violations WITHOUT modifying it.
 * Used by auditor and quality gate.
 */
export function scanHardBlocks(text: string, caseId?: string): HardBlockScrubResult {
  const blocks = loadHardBlocks(caseId);
  const violations: HardBlockViolation[] = [];
  let totalMatches = 0;
  let criticalCount = 0;
  for (const block of blocks) {
    try {
      const re = new RegExp(block.pattern, 'g' + (block.flags || ''));
      const matches = text.match(re);
      if (matches && matches.length > 0) {
        violations.push({ block, matches, count: matches.length });
        totalMatches += matches.length;
        if (block.severity === 'critical') criticalCount += matches.length;
      }
    } catch {
      // invalid regex — skip silently (logged in tests, not in prod)
    }
  }
  return { cleaned: text, violations, criticalCount, totalMatches };
}

/**
 * Scrub hard blocks from text by applying replacements where defined.
 * Blocks with replacement=null are flagged but left in place (the auditor must reject manually).
 */
export function scrubHardBlocks(text: string, caseId?: string): HardBlockScrubResult {
  const blocks = loadHardBlocks(caseId);
  const violations: HardBlockViolation[] = [];
  let cleaned = text;
  let totalMatches = 0;
  let criticalCount = 0;
  for (const block of blocks) {
    try {
      const re = new RegExp(block.pattern, 'g' + (block.flags || ''));
      const matches = cleaned.match(re);
      if (matches && matches.length > 0) {
        violations.push({ block, matches, count: matches.length });
        totalMatches += matches.length;
        if (block.severity === 'critical') criticalCount += matches.length;
        if (block.replacement !== null) {
          cleaned = cleaned.replace(re, block.replacement);
        }
      }
    } catch {}
  }
  return { cleaned, violations, criticalCount, totalMatches };
}

/**
 * Build a markdown report of violations for inclusion in the auditor output.
 */
export function renderHardBlockReport(result: HardBlockScrubResult): string {
  if (result.violations.length === 0) return '✓ No hard block violations.\n';
  const lines = [`## Hard Block Violations (${result.totalMatches} matches, ${result.criticalCount} critical)\n`];
  for (const v of result.violations) {
    lines.push(`- **${v.block.severity.toUpperCase()}** \`${v.block.id}\` — ${v.count} match(es): \`${v.matches.slice(0, 3).join(', ')}\``);
    lines.push(`  - Reason: ${v.block.reason}`);
    if (v.block.replacement) lines.push(`  - Suggested replacement: \`${v.block.replacement}\``);
  }
  return lines.join('\n') + '\n';
}
