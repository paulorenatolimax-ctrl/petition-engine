import { readFileSync, existsSync } from 'fs';
import path from 'path';
import type { LetterType } from '@/lib/rules/persona-bank';
import type { USTimeline } from '@/lib/validators/us-entry-date';

export interface AnchorSpec {
  value: string;
  aliases: string[];
  required_in_letter_types: LetterType[];
}

export interface MasterFacts {
  case_id: string;
  petitioner_name: string;
  visa_type: string;
  soc_target: string;
  description?: string;
  source?: string;
  us_timeline?: USTimeline;
  anchors: Record<string, AnchorSpec>;
  evidence_bank: Array<Record<string, unknown>>;
  validation_notes?: string[];
}

export interface AnchorPresenceResult {
  total_anchors: number;
  present_anchors: string[];
  missing_anchors: string[];
  present_count: number;
  coverage_ratio: number;
}

const MASTER_FACTS_DIR = path.join(process.cwd(), 'data', 'master_facts');

export function getMasterFacts(caseId: string): MasterFacts | null {
  const file = path.join(MASTER_FACTS_DIR, `${caseId}.json`);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Check which anchors appear in the text. An anchor is considered present if
 * either the canonical value OR any alias matches (case-insensitive).
 */
export function checkAnchorsPresence(text: string, caseId: string): AnchorPresenceResult | null {
  const facts = getMasterFacts(caseId);
  if (!facts) return null;
  const lower = text.toLowerCase();
  const entries = Object.entries(facts.anchors);
  const present: string[] = [];
  const missing: string[] = [];
  for (const [key, spec] of entries) {
    const candidates = [spec.value, ...(spec.aliases || [])];
    const found = candidates.some(c => lower.includes(c.toLowerCase()));
    if (found) present.push(key);
    else missing.push(key);
  }
  return {
    total_anchors: entries.length,
    present_anchors: present,
    missing_anchors: missing,
    present_count: present.length,
    coverage_ratio: entries.length > 0 ? Number((present.length / entries.length).toFixed(3)) : 0,
  };
}

/**
 * Per-letter check: is an anchor REQUIRED for this letter type and, if so, is it present?
 * Returns only the required-but-missing anchors for that type.
 */
export function requiredAnchorsMissing(text: string, caseId: string, letterType: LetterType): string[] {
  const facts = getMasterFacts(caseId);
  if (!facts) return [];
  const lower = text.toLowerCase();
  const missing: string[] = [];
  for (const [key, spec] of Object.entries(facts.anchors)) {
    if (!spec.required_in_letter_types.includes(letterType)) continue;
    const candidates = [spec.value, ...(spec.aliases || [])];
    const found = candidates.some(c => lower.includes(c.toLowerCase()));
    if (!found) missing.push(key);
  }
  return missing;
}
