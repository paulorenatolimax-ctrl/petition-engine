import { describe, it, expect } from 'vitest';
import {
  readAllRules,
  readActiveRules,
  readRulesForDocType,
  buildRulesSection,
} from '@/lib/rules/repository';

describe('Rules Repository', () => {
  it('readAllRules returns an array', () => {
    const rules = readAllRules();
    expect(Array.isArray(rules)).toBe(true);
  });

  it('readAllRules has 100+ rules', () => {
    const rules = readAllRules();
    expect(rules.length).toBeGreaterThanOrEqual(100);
  });

  it('readActiveRules filters to active only', () => {
    const all = readAllRules();
    const active = readActiveRules();
    expect(active.length).toBeLessThanOrEqual(all.length);
    for (const r of active) {
      expect(r.active).toBe(true);
    }
  });

  it('readRulesForDocType returns global + specific rules', () => {
    const rules = readRulesForDocType('resume_eb2_niw');
    const global = rules.filter(r => !r.doc_type);
    const specific = rules.filter(r => r.doc_type === 'resume_eb2_niw');
    expect(global.length).toBeGreaterThan(0);
    // Should have some resume-specific rules (r105, r122, etc.)
    expect(specific.length).toBeGreaterThan(0);
  });

  it('readRulesForDocType does NOT include other doc_type rules', () => {
    const rules = readRulesForDocType('resume_eb2_niw');
    const wrongType = rules.filter(r => r.doc_type && r.doc_type !== 'resume_eb2_niw');
    expect(wrongType.length).toBe(0);
  });

  it('buildRulesSection returns a string with anti-hallucination protocol', () => {
    const section = buildRulesSection('resume_eb2_niw');
    expect(section).toContain('PROTOCOLO ANTI-ALUCINACAO');
    expect(section).toContain('INVENTARIO DE EVIDENCIAS');
    expect(section).toContain('VERIFICACAO DE CREDENCIAIS');
    expect(section).toContain('CODIGO SOC ESCAMOTEADO');
  });

  it('buildRulesSection includes rule count', () => {
    const section = buildRulesSection('resume_eb2_niw');
    expect(section).toContain('REGRAS DE ERRO ATIVAS');
    expect(section).toMatch(/Total: \d+ regras/);
  });

  it('each rule has required fields', () => {
    const rules = readAllRules();
    for (const r of rules.slice(0, 10)) {
      expect(r.id).toBeTruthy();
      expect(r.rule_type).toBeTruthy();
      expect(r.rule_description).toBeTruthy();
      expect(r.severity).toBeTruthy();
      expect(r.active).toBeDefined();
    }
  });
});
