import { describe, it, expect } from 'vitest';
import { validateAntiAtlas, LetterSignature, ATLAS_FAIL_THRESHOLD } from '@/lib/validators/anti-atlas';

function sig(overrides: Partial<LetterSignature> & { id: string }): LetterSignature {
  return {
    headerGeometry: 'top-left',
    datePosition: 'top-right',
    fontFamily: 'Calibri',
    tableCount: 1,
    paragraphCount: 20,
    ...overrides,
  };
}

describe('validateAntiAtlas', () => {
  it('passes trivially for < MIN_CLUSTER_SIZE letters', () => {
    const result = validateAntiAtlas([sig({ id: 'L1' }), sig({ id: 'L2' })]);
    expect(result.passed).toBe(true);
    expect(result.atlas_score).toBe(0);
    expect(result.violations).toEqual([]);
  });

  it('detects full ATLAS when all 5 letters are identical', () => {
    const letters = ['L1', 'L2', 'L3', 'L4', 'L5'].map(id => sig({ id }));
    const result = validateAntiAtlas(letters);
    expect(result.passed).toBe(false);
    expect(result.atlas_score).toBeGreaterThan(ATLAS_FAIL_THRESHOLD);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('passes when geometry, font, date position all vary', () => {
    const letters: LetterSignature[] = [
      sig({ id: 'L1', headerGeometry: 'top-left', datePosition: 'top-right', fontFamily: 'Times New Roman', tableCount: 0, paragraphCount: 10 }),
      sig({ id: 'L2', headerGeometry: 'top-right', datePosition: 'body', fontFamily: 'Calibri', tableCount: 3, paragraphCount: 15 }),
      sig({ id: 'L3', headerGeometry: 'centered', datePosition: 'closing', fontFamily: 'Garamond', tableCount: 7, paragraphCount: 30 }),
      sig({ id: 'L4', headerGeometry: 'top-left', datePosition: 'top-left', fontFamily: 'Helvetica', tableCount: 2, paragraphCount: 12 }),
      sig({ id: 'L5', headerGeometry: 'top-right', datePosition: 'top-right', fontFamily: 'Arial', tableCount: 5, paragraphCount: 25 }),
    ];
    const result = validateAntiAtlas(letters);
    expect(result.atlas_score).toBeLessThan(ATLAS_FAIL_THRESHOLD);
  });

  it('flags cluster of 3+ letters with same font', () => {
    const letters: LetterSignature[] = [
      sig({ id: 'L1', fontFamily: 'Calibri' }),
      sig({ id: 'L2', fontFamily: 'Calibri', headerGeometry: 'top-right' }),
      sig({ id: 'L3', fontFamily: 'Calibri', headerGeometry: 'centered', datePosition: 'body' }),
      sig({ id: 'L4', fontFamily: 'Times New Roman', headerGeometry: 'top-right' }),
      sig({ id: 'L5', fontFamily: 'Garamond', headerGeometry: 'centered', datePosition: 'body' }),
    ];
    const result = validateAntiAtlas(letters);
    const fontViolation = result.violations.find(v => v.kind === 'font');
    expect(fontViolation).toBeDefined();
    expect(fontViolation!.affected_letters).toEqual(['L1', 'L2', 'L3']);
  });

  it('flags table_count_uniformity when all letters have 1-2 tables', () => {
    const letters: LetterSignature[] = Array.from({ length: 6 }, (_, i) =>
      sig({ id: `L${i}`, tableCount: i % 2 === 0 ? 1 : 2,
             headerGeometry: (['top-left','top-right','centered','top-left','top-right','centered'] as const)[i],
             datePosition: (['top-left','top-right','body','closing','top-left','top-right'] as const)[i],
             fontFamily: ['A','B','C','D','E','F'][i] }),
    );
    const result = validateAntiAtlas(letters);
    expect(result.violations.some(v => v.kind === 'table_count_uniformity')).toBe(true);
  });

  it('ignores "unknown" geometry from clustering', () => {
    const letters: LetterSignature[] = Array.from({ length: 5 }, (_, i) =>
      sig({ id: `L${i}`, headerGeometry: 'unknown' }),
    );
    const result = validateAntiAtlas(letters);
    expect(result.violations.some(v => v.kind === 'geometry')).toBe(false);
  });
});
