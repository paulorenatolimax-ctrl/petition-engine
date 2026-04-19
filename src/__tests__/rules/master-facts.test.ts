import { describe, it, expect } from 'vitest';
import { getMasterFacts, checkAnchorsPresence, requiredAnchorsMissing } from '@/lib/rules/master-facts';

describe('master-facts loader', () => {
  it('loads Ricardo Augusto facts', () => {
    const facts = getMasterFacts('ricardo_augusto');
    expect(facts).not.toBeNull();
    expect(facts!.petitioner_name).toContain('Ricardo');
    expect(facts!.soc_target).toBe('17-2051 Civil Engineers');
    expect(Object.keys(facts!.anchors).length).toBeGreaterThanOrEqual(4);
  });

  it('returns null for unknown case', () => {
    expect(getMasterFacts('nonexistent_case')).toBeNull();
  });
});

describe('checkAnchorsPresence', () => {
  it('detects 14+ years and FL License 34217 when both present', () => {
    const text = 'Mr. Pereira has 14+ years of Brazilian structural practice and works under FL License 34217.';
    const result = checkAnchorsPresence(text, 'ricardo_augusto');
    expect(result).not.toBeNull();
    expect(result!.present_anchors).toContain('years_experience');
    expect(result!.present_anchors).toContain('pe_channel');
    expect(result!.coverage_ratio).toBeGreaterThan(0);
  });

  it('matches aliases case-insensitively', () => {
    const text = 'catorze anos de experiência, Licença 34217';
    const result = checkAnchorsPresence(text, 'ricardo_augusto');
    expect(result!.present_anchors).toContain('years_experience');
    expect(result!.present_anchors).toContain('pe_channel');
  });

  it('reports all missing for empty text', () => {
    const result = checkAnchorsPresence('nothing relevant', 'ricardo_augusto');
    expect(result!.present_count).toBe(0);
    expect(result!.missing_anchors.length).toBe(result!.total_anchors);
  });

  it('returns null for unknown case', () => {
    expect(checkAnchorsPresence('any text', 'no_such_case')).toBeNull();
  });
});

describe('requiredAnchorsMissing', () => {
  it('flags missing PE channel in cliente_futuro letter', () => {
    const text = 'We would like to contract Mr. Pereira for our HOA project.';
    const missing = requiredAnchorsMissing(text, 'ricardo_augusto', 'cliente_futuro');
    expect(missing).toContain('pe_channel');
    expect(missing).toContain('years_experience');
  });

  it('does not flag irrelevant anchors for contador letter', () => {
    const text = 'Ricardo foi CEO da RBP Construtora entre 2015 e maio de 2025.';
    const missing = requiredAnchorsMissing(text, 'ricardo_augusto', 'contador');
    expect(missing).not.toContain('prior_role'); // present via "CEO" + "RBP" + "2015"
  });

  it('returns empty array for unknown case', () => {
    const missing = requiredAnchorsMissing('anything', 'no_such_case', 'cliente_futuro');
    expect(missing).toEqual([]);
  });
});
