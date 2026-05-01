/**
 * AutoDebugger — LOCAL version (JSON, no Supabase).
 *
 * Closes the auto-learning loop: when Quality Gate detects a violation,
 * AutoDebugger classifies it and proposes a new rule. Rules are appended
 * to data/error_rules.json with source='auto_debugger' and active=true so
 * future generations are blocked from repeating the same mistake.
 *
 * This replaces the Supabase-backed src/agents/auto-debugger.ts for local
 * quality-local.ts flow. The Supabase version is kept for the /api/errors
 * endpoints that still speak to Supabase.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export interface ErrorSignal {
  errorDescription: string;
  docType?: string | null;
  violationPattern?: string | null;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  sourceGenId?: string;
}

export interface ClassifiedRule {
  id: string;
  rule_type: string;
  doc_type: string | null;
  rule_description: string;
  rule_pattern: string | null;
  rule_action: 'block' | 'warn' | 'auto_fix';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  active: boolean;
  times_triggered: number;
  created_at: string;
}

export interface AutoDebuggerResult {
  action: 'new_rule_created' | 'existing_rule_updated' | 'skipped_duplicate';
  rule_id: string;
  message: string;
  rule?: ClassifiedRule;
}

const ERROR_RULES_FILE = path.join(process.cwd(), 'data', 'error_rules.json');

function classifyErrorType(description: string): string {
  const d = description.toLowerCase();
  if (/forbidden|blocked word|proibido/.test(d)) return 'forbidden_term';
  if (/format|spacing|font|margin|bord/.test(d)) return 'formatting';
  if (/terminology|jurídic|legal|advocat|proex|consult/.test(d)) return 'terminology';
  if (/infrastructure|rag|obsidian|kortix|petition engine/.test(d)) return 'infrastructure_leak';
  if (/content|missing|ausente/.test(d)) return 'content';
  if (/hyperbole|unique|excepcional|best/.test(d)) return 'ai_pattern';
  if (/dhanasar|kazarian|prong/.test(d)) return 'legal';
  return 'content';
}

function classifySeverity(description: string, hint?: string): 'critical' | 'high' | 'medium' | 'low' {
  if (hint) return hint as 'critical' | 'high' | 'medium' | 'low';
  const d = description.toLowerCase();
  if (/hard block|rfe automático|critical/.test(d)) return 'critical';
  if (/hyperbole|template|pattern|tell/.test(d)) return 'high';
  if (/format|spacing/.test(d)) return 'medium';
  return 'medium';
}

function extractPatternHint(description: string, explicit?: string | null): string | null {
  if (explicit) return explicit;
  const quoted = description.match(/["']([^"']{3,60})["']/);
  if (quoted) return `\\b${quoted[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readRules(): any[] {
  if (!existsSync(ERROR_RULES_FILE)) return [];
  try { return JSON.parse(readFileSync(ERROR_RULES_FILE, 'utf-8')); } catch { return []; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeRules(rules: any[]) {
  writeFileSync(ERROR_RULES_FILE, JSON.stringify(rules, null, 2), 'utf-8');
}

function nextRuleId(rules: Array<{ id?: string }>): string {
  const maxN = rules.reduce((max, r) => {
    if (!r.id || !r.id.startsWith('r')) return max;
    const n = parseInt(r.id.slice(1), 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return `r${maxN + 1}`;
}

/**
 * Proposes a rule for the observed error. Avoids duplicates by description similarity.
 *
 * CHUNK 5 — Adicionado console.log estruturado pra observabilidade. Auditoria
 * 30/abr identificou que 0 de 211 regras foram criadas pelo auto-debugger
 * (sintoma silencioso). Agora cada decisão é logada.
 */
export function reportErrorLocal(signal: ErrorSignal): AutoDebuggerResult {
  const rules = readRules();

  // Fuzzy dedup: first 50 chars of description, case-insensitive
  const key = signal.errorDescription.slice(0, 50).toLowerCase();
  const existing = rules.find((r: { rule_description?: string }) =>
    (r.rule_description || '').toLowerCase().slice(0, 50) === key,
  );

  if (existing) {
    existing.times_triggered = (existing.times_triggered || 0) + 1;
    writeRules(rules);
    console.log(`[auto-debugger] DUP rule=${existing.id} times_triggered=${existing.times_triggered} desc=${signal.errorDescription.slice(0, 60)}`);
    return {
      action: 'existing_rule_updated',
      rule_id: existing.id,
      message: `Regra similar já existe (${existing.id}). Contador incrementado para ${existing.times_triggered}.`,
    };
  }

  const rule: ClassifiedRule = {
    id: nextRuleId(rules),
    rule_type: classifyErrorType(signal.errorDescription),
    doc_type: signal.docType || null,
    rule_description: signal.errorDescription,
    rule_pattern: extractPatternHint(signal.errorDescription, signal.violationPattern),
    rule_action: classifySeverity(signal.errorDescription, signal.severity) === 'critical' ? 'block' : 'warn',
    severity: classifySeverity(signal.errorDescription, signal.severity),
    source: 'auto_debugger' + (signal.sourceGenId ? `:${signal.sourceGenId}` : ''),
    active: true,
    times_triggered: 1,
    created_at: new Date().toISOString(),
  };

  rules.push(rule);
  writeRules(rules);
  console.log(`[auto-debugger] NEW rule=${rule.id} severity=${rule.severity} type=${rule.rule_type} doc_type=${rule.doc_type} desc=${rule.rule_description.slice(0, 80)}`);
  return {
    action: 'new_rule_created',
    rule_id: rule.id,
    message: `Nova regra criada: ${rule.id} [${rule.severity}/${rule.rule_type}]`,
    rule,
  };
}

/**
 * Batch: process multiple quality-gate violations at once.
 *
 * CHUNK 5 — Logs entrada/saída pra observabilidade do loop de aprendizado.
 */
export function reportBatch(signals: ErrorSignal[]): AutoDebuggerResult[] {
  console.log(`[auto-debugger] reportBatch — recebidos ${signals.length} signal(s)`);
  if (signals.length === 0) {
    console.log('[auto-debugger] reportBatch — exit early (0 signals)');
    return [];
  }
  const results = signals.map(reportErrorLocal);
  const newCount = results.filter(r => r.action === 'new_rule_created').length;
  const updCount = results.filter(r => r.action === 'existing_rule_updated').length;
  console.log(`[auto-debugger] reportBatch — done. new=${newCount} updated=${updCount}`);
  return results;
}
