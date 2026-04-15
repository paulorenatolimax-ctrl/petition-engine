import { describe, it, expect } from 'vitest';
import {
  SHARED_RULES,
  EB1A_SPECIFIC_RULES,
  EB2_NIW_SPECIFIC_RULES,
  buildTransversalRules,
} from '@/lib/rules/transversal';

describe('Transversal Rules', () => {
  it('SHARED_RULES contains forbidden content', () => {
    expect(SHARED_RULES).toContain('PROEX');
    expect(SHARED_RULES).toContain('Garamond');
    expect(SHARED_RULES).toContain('wp:anchor');
  });

  it('EB1A_SPECIFIC_RULES contains EB-1A terms', () => {
    expect(EB1A_SPECIFIC_RULES).toContain('português brasileiro');
    expect(EB1A_SPECIFIC_RULES).toContain('Kazarian');
    expect(EB1A_SPECIFIC_RULES).toContain('Step 1');
  });

  it('EB2_NIW_SPECIFIC_RULES contains EB-2 NIW terms', () => {
    expect(EB2_NIW_SPECIFIC_RULES).toContain('INGLÊS');
    expect(EB2_NIW_SPECIFIC_RULES).toContain('Dhanasar');
    expect(EB2_NIW_SPECIFIC_RULES).toContain('anti-Cristine');
  });

  it('buildTransversalRules for eb1a includes shared + eb1a specific', () => {
    const rules = buildTransversalRules('eb1a');
    expect(rules).toContain('REGRAS INVIOLÁVEIS');
    expect(rules).toContain('PROEX');           // shared
    expect(rules).toContain('Kazarian');         // eb1a specific
    expect(rules).not.toContain('Dhanasar');     // NOT eb2 niw
  });

  it('buildTransversalRules for eb2_niw includes shared + eb2 specific', () => {
    const rules = buildTransversalRules('eb2_niw');
    expect(rules).toContain('REGRAS INVIOLÁVEIS');
    expect(rules).toContain('PROEX');           // shared
    expect(rules).toContain('Dhanasar');         // eb2 specific
    expect(rules).not.toContain('Step 1');       // NOT eb1a
  });
});
