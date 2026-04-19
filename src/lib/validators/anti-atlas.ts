/**
 * Anti-ATLAS Validator — detects when multiple letters in the same case look
 * template-generated (same header geometry, same font, same date position).
 *
 * USCIS examiners with template-detection training flag these as mass-produced.
 * SKILL v5 Category A mandates heterogeneity.
 *
 * This validator operates on lightweight letter signatures — the caller is
 * responsible for extracting signatures from .docx via python-docx or similar.
 */

export type HeaderGeometry = 'top-left' | 'top-right' | 'centered' | 'unknown';
export type DatePosition = 'top-left' | 'top-right' | 'body' | 'closing' | 'unknown';

export interface LetterSignature {
  id: string;
  headerGeometry: HeaderGeometry;
  datePosition: DatePosition;
  fontFamily: string;
  tableCount: number;
  paragraphCount: number;
  /** Optional: hex color of primary accent (header, border). Used for paleta diversity. */
  accentColor?: string;
}

export interface AtlasViolation {
  kind: 'geometry' | 'date_position' | 'font' | 'table_count_uniformity' | 'accent_color';
  affected_letters: string[];
  shared_value: string;
  message: string;
}

export interface AtlasValidationResult {
  /** 0 (fully heterogeneous) → 1 (full ATLAS, all identical). */
  atlas_score: number;
  passed: boolean;
  violations: AtlasViolation[];
}

/** Threshold: violations above this = arsenal ATLAS. */
export const ATLAS_FAIL_THRESHOLD = 0.7;

/** Minimum letters sharing a signature to trigger a violation. */
export const MIN_CLUSTER_SIZE = 3;

function clusterBy<T>(items: T[], key: (t: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const existing = map.get(k);
    if (existing) existing.push(item);
    else map.set(k, [item]);
  }
  return map;
}

export function validateAntiAtlas(letters: LetterSignature[]): AtlasValidationResult {
  const total = letters.length;
  if (total < MIN_CLUSTER_SIZE) {
    return { atlas_score: 0, passed: true, violations: [] };
  }

  const violations: AtlasViolation[] = [];

  // Cluster by header geometry
  for (const [geom, group] of clusterBy(letters, l => l.headerGeometry)) {
    if (geom === 'unknown') continue;
    if (group.length >= MIN_CLUSTER_SIZE) {
      violations.push({
        kind: 'geometry',
        affected_letters: group.map(l => l.id),
        shared_value: geom,
        message: `${group.length} letters share header geometry '${geom}' — should be heterogeneous`,
      });
    }
  }

  // Cluster by date position
  for (const [pos, group] of clusterBy(letters, l => l.datePosition)) {
    if (pos === 'unknown') continue;
    if (group.length >= MIN_CLUSTER_SIZE) {
      violations.push({
        kind: 'date_position',
        affected_letters: group.map(l => l.id),
        shared_value: pos,
        message: `${group.length} letters share date position '${pos}' — randomize per SKILL v5 A2`,
      });
    }
  }

  // Cluster by font family
  for (const [font, group] of clusterBy(letters, l => l.fontFamily)) {
    if (!font || font === 'unknown') continue;
    if (group.length >= MIN_CLUSTER_SIZE) {
      violations.push({
        kind: 'font',
        affected_letters: group.map(l => l.id),
        shared_value: font,
        message: `${group.length} letters use font '${font}' — differentiate by cultural origin per SKILL v5 A4`,
      });
    }
  }

  // Cluster by accent color
  const withColor = letters.filter(l => l.accentColor);
  if (withColor.length >= MIN_CLUSTER_SIZE) {
    for (const [color, group] of clusterBy(withColor, l => l.accentColor!)) {
      if (group.length >= MIN_CLUSTER_SIZE) {
        violations.push({
          kind: 'accent_color',
          affected_letters: group.map(l => l.id),
          shared_value: color,
          message: `${group.length} letters share accent color '${color}' — distinct palettes per type (SKILL v5 A5)`,
        });
      }
    }
  }

  // Table count uniformity (every letter has 1-2 tables = GPT tell)
  const tableCounts = letters.map(l => l.tableCount);
  const uniqueCounts = new Set(tableCounts);
  if (uniqueCounts.size <= 2 && total >= 5) {
    violations.push({
      kind: 'table_count_uniformity',
      affected_letters: letters.map(l => l.id),
      shared_value: Array.from(uniqueCounts).join(','),
      message: `All ${total} letters have ${uniqueCounts.size} distinct table counts — SKILL v5 A8 expects 0-7 range`,
    });
  }

  // Atlas score: fraction of letters involved in any violation
  const affected = new Set<string>();
  for (const v of violations) v.affected_letters.forEach(id => affected.add(id));
  const atlas_score = affected.size / total;

  return {
    atlas_score: Number(atlas_score.toFixed(3)),
    passed: atlas_score < ATLAS_FAIL_THRESHOLD,
    violations,
  };
}

export function renderAtlasReport(result: AtlasValidationResult): string {
  const header = `## Anti-ATLAS Validation — score ${result.atlas_score} (${result.passed ? 'PASSED' : 'FAILED'})\n`;
  if (result.violations.length === 0) return header + '✓ No ATLAS patterns detected.\n';
  const lines = [header];
  for (const v of result.violations) {
    lines.push(`- **${v.kind}**: ${v.message}`);
    lines.push(`  - Affected: ${v.affected_letters.join(', ')}`);
  }
  return lines.join('\n') + '\n';
}
