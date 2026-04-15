import { describe, it, expect } from 'vitest';
import {
  SOC_PATH, CP_DIR, QUALITY_PATH, EB1A_SYSTEM_PATH, EB2_NIW_SYSTEM_PATH,
  INSERT_THUMBNAILS_PATH, RAGS_EB1, RAGS_EB2,
  BENCHMARK_THAYSE, BENCHMARK_THIAGO, DEFAULT_CASES_DIR,
  CLAUDE_BIN_CANDIDATES,
} from '@/lib/config/paths';

describe('Centralized Paths', () => {
  it('all path constants are non-empty strings', () => {
    const paths = [
      SOC_PATH, CP_DIR, QUALITY_PATH, EB1A_SYSTEM_PATH, EB2_NIW_SYSTEM_PATH,
      INSERT_THUMBNAILS_PATH, RAGS_EB1, RAGS_EB2,
      BENCHMARK_THAYSE, BENCHMARK_THIAGO, DEFAULT_CASES_DIR,
    ];
    for (const p of paths) {
      expect(p).toBeTruthy();
      expect(typeof p).toBe('string');
      expect(p.length).toBeGreaterThan(10);
    }
  });

  it('all paths are absolute (start with /)', () => {
    const paths = [
      SOC_PATH, CP_DIR, QUALITY_PATH, EB1A_SYSTEM_PATH,
      RAGS_EB1, RAGS_EB2, DEFAULT_CASES_DIR,
    ];
    for (const p of paths) {
      expect(p.startsWith('/')).toBe(true);
    }
  });

  it('CLAUDE_BIN_CANDIDATES is a non-empty array', () => {
    expect(Array.isArray(CLAUDE_BIN_CANDIDATES)).toBe(true);
    expect(CLAUDE_BIN_CANDIDATES.length).toBeGreaterThan(0);
  });
});
