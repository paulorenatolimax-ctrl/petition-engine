import { describe, it, expect } from 'vitest';
import { scanHardBlocks, scrubHardBlocks, loadHardBlocks, renderHardBlockReport } from '@/lib/rules/hard-blocks';

describe('hard-blocks loader', () => {
  it('loads default blocks', () => {
    const blocks = loadHardBlocks();
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.some(b => b.id === 'global_proex')).toBe(true);
  });

  it('adds case-specific blocks on top of default', () => {
    const defaultOnly = loadHardBlocks();
    const withCase = loadHardBlocks('ricardo_augusto');
    expect(withCase.length).toBeGreaterThan(defaultOnly.length);
    expect(withCase.some(b => b.id === 'ricardo_advisory_en')).toBe(true);
    expect(withCase.some(b => b.id === 'global_proex')).toBe(true);
  });

  it('returns default-only when caseId does not exist', () => {
    const fallback = loadHardBlocks('nonexistent_case');
    const defaultOnly = loadHardBlocks();
    expect(fallback.length).toBe(defaultOnly.length);
  });
});

describe('hard-blocks scan', () => {
  it('detects PROEX globally', () => {
    const result = scanHardBlocks('This document was produced by PROEX consultants.');
    expect(result.totalMatches).toBeGreaterThan(0);
    expect(result.criticalCount).toBeGreaterThan(0);
    expect(result.violations.some(v => v.block.id === 'global_proex')).toBe(true);
  });

  it('detects immigration jargon', () => {
    const result = scanHardBlocks('This letter supports the EB-2 NIW petition under Dhanasar.');
    expect(result.criticalCount).toBeGreaterThanOrEqual(2);
  });

  it('detects Ricardo-specific "advisory" only with case context', () => {
    const text = 'Our advisory practice supports engineering projects.';
    const defaultOnly = scanHardBlocks(text);
    const withCase = scanHardBlocks(text, 'ricardo_augusto');
    const caseOnlyHits = withCase.totalMatches - defaultOnly.totalMatches;
    expect(caseOnlyHits).toBeGreaterThan(0);
    expect(withCase.violations.some(v => v.block.id === 'ricardo_advisory_en')).toBe(true);
  });

  it('returns clean for clean text', () => {
    const result = scanHardBlocks('The engineer signed 17 ARTs between 2015 and 2025.');
    expect(result.totalMatches).toBe(0);
    expect(result.violations).toEqual([]);
  });
});

describe('hard-blocks scrub', () => {
  it('replaces advisory → engineering engagement when case=ricardo_augusto', () => {
    const text = 'We offer advisory services.';
    const result = scrubHardBlocks(text, 'ricardo_augusto');
    expect(result.cleaned).not.toContain('advisory');
    expect(result.cleaned).toContain('engineering engagement');
  });

  it('flags but does not remove blocks with replacement=null', () => {
    const text = 'PROEX helps immigrants.';
    const result = scrubHardBlocks(text);
    expect(result.cleaned).toContain('PROEX'); // still there — replacement is null
    expect(result.violations.length).toBeGreaterThan(0);
  });
});

describe('hard-blocks report', () => {
  it('renders markdown with violations', () => {
    const result = scanHardBlocks('PROEX and Kortix and advisory.', 'ricardo_augusto');
    const md = renderHardBlockReport(result);
    expect(md).toContain('## Hard Block Violations');
    expect(md).toContain('CRITICAL');
  });

  it('renders clean message when no violations', () => {
    const result = scanHardBlocks('Clean professional engineering text.');
    const md = renderHardBlockReport(result);
    expect(md).toContain('No hard block violations');
  });
});
