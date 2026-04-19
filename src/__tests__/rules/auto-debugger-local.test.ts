import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import path from 'path';
import { reportErrorLocal, reportBatch } from '@/agents/auto-debugger-local';

const RULES_FILE = path.join(process.cwd(), 'data', 'error_rules.json');
const BACKUP = path.join(process.cwd(), 'data', 'error_rules.json.test-backup');

describe('auto-debugger-local', () => {
  beforeEach(() => {
    copyFileSync(RULES_FILE, BACKUP);
  });

  afterEach(() => {
    copyFileSync(BACKUP, RULES_FILE);
  });

  it('creates a new rule from a novel error description', () => {
    const before = JSON.parse(readFileSync(RULES_FILE, 'utf-8')).length;
    const result = reportErrorLocal({
      errorDescription: `Test rule created at ${Date.now()} — random marker ${Math.random().toString(36).slice(2)}`,
      docType: 'resume_eb1a',
    });
    const after = JSON.parse(readFileSync(RULES_FILE, 'utf-8')).length;
    expect(result.action).toBe('new_rule_created');
    expect(after).toBe(before + 1);
    expect(result.rule!.source).toContain('auto_debugger');
    expect(result.rule!.active).toBe(true);
    expect(result.rule!.times_triggered).toBe(1);
  });

  it('updates times_triggered when duplicate detected', () => {
    const desc = `Unique test duplicate ${Date.now()} ${Math.random().toString(36).slice(2)}`;
    const first = reportErrorLocal({ errorDescription: desc });
    const rules1 = JSON.parse(readFileSync(RULES_FILE, 'utf-8'));
    const firstTriggers = rules1.find((r: { id: string }) => r.id === first.rule_id).times_triggered;

    const second = reportErrorLocal({ errorDescription: desc });
    expect(second.action).toBe('existing_rule_updated');
    const rules2 = JSON.parse(readFileSync(RULES_FILE, 'utf-8'));
    const updated = rules2.find((r: { id: string }) => r.id === first.rule_id);
    expect(updated.times_triggered).toBe(firstTriggers + 1);
  });

  it('classifies severity correctly', () => {
    const critical = reportErrorLocal({
      errorDescription: `Hyperbole test ${Date.now()} — hyperbole detected in cover letter`,
      severity: 'critical',
    });
    expect(critical.rule!.severity).toBe('critical');
    expect(critical.rule!.rule_action).toBe('block');
  });

  it('extracts quoted pattern from description', () => {
    const result = reportErrorLocal({
      errorDescription: `Forbidden quote test ${Date.now()} — proibido "padronizado" neste contexto`,
    });
    expect(result.rule!.rule_pattern).toContain('padronizado');
  });

  it('batch processes multiple signals', () => {
    const t = Date.now();
    const results = reportBatch([
      { errorDescription: `Batch A test ${t} - marker1 ${Math.random()}` },
      { errorDescription: `Batch B test ${t} - marker2 ${Math.random()}` },
    ]);
    expect(results.length).toBe(2);
    expect(results.every(r => r.action === 'new_rule_created')).toBe(true);
  });
});
