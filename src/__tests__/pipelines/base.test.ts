import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import {
  runClaude,
  findNewDocx,
  RUN_CLAUDE_DEFAULT_TIMEOUT_MS,
  RUN_CLAUDE_DEFAULT_IDLE_MS,
} from '@/lib/pipelines/base';

// Fixture script: ignores injected args (-p, --allowedTools) and sleeps $SLEEPER_DURATION seconds.
const SLEEPER = path.join(process.cwd(), 'src/__tests__/fixtures/slow-sleeper.sh');

describe('runClaude — timeouts', () => {
  it('exports sane defaults (60min hard, 20min idle)', () => {
    expect(RUN_CLAUDE_DEFAULT_TIMEOUT_MS).toBe(60 * 60 * 1000);
    expect(RUN_CLAUDE_DEFAULT_IDLE_MS).toBe(20 * 60 * 1000);
  });

  it('hard timeout kills a hung process and reports timeoutKind=hard', async () => {
    process.env.SLEEPER_DURATION = '30';
    const result = await runClaude(SLEEPER, 'ignored', undefined, undefined, {
      timeoutMs: 500,
      idleTimeoutMs: 60_000,
    });
    expect(result.timedOut).toBe(true);
    expect(result.timeoutKind).toBe('hard');
    expect(result.stderr).toContain('hard timeout');
  }, 10_000);

  it('idle timeout fires when no output for configured window', async () => {
    process.env.SLEEPER_DURATION = '30';
    const result = await runClaude(SLEEPER, 'ignored', undefined, undefined, {
      timeoutMs: 60_000,
      idleTimeoutMs: 500,
    });
    expect(result.timedOut).toBe(true);
    expect(result.timeoutKind).toBe('idle');
    expect(result.stderr).toContain('idle timeout');
  }, 10_000);

  it('spawn error resolves gracefully with code 1', async () => {
    const result = await runClaude('/nonexistent/binary/path', 'anything');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('spawn error');
    expect(result.timedOut).toBeUndefined();
  }, 5_000);

  it('backward-compat: call without options returns cleanly when process exits fast', async () => {
    process.env.SLEEPER_DURATION = '0.05';
    const result = await runClaude(SLEEPER, 'ignored');
    expect(result.code).toBe(0);
    expect(result.timedOut).toBeUndefined();
  }, 5_000);
});

describe('findNewDocx — recursive scan', () => {
  let tmp: string;
  let baseTime: number;

  beforeAll(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'pe-findnewdocx-'));
    baseTime = Date.now() - 1000; // everything below counts as "new"

    // Root-level docs (original behavior)
    writeFileSync(path.join(tmp, 'root.docx'), 'x');
    writeFileSync(path.join(tmp, 'REVIEW_skipme.docx'), 'x'); // must be skipped
    writeFileSync(path.join(tmp, '.hidden.docx'), 'x');       // must be skipped

    // Subdirectory that mimics Claude's CARTAS/ pattern (this is the bug fix)
    mkdirSync(path.join(tmp, 'CARTAS'));
    writeFileSync(path.join(tmp, 'CARTAS', '01_Kennedy.docx'), 'x');
    writeFileSync(path.join(tmp, 'CARTAS', '02_Nivaldo.docx'), 'x');

    // Deeper nesting
    mkdirSync(path.join(tmp, 'CARTAS', 'versions'));
    writeFileSync(path.join(tmp, 'CARTAS', 'versions', 'V1_old.docx'), 'x');

    // Noise dirs that MUST be skipped
    mkdirSync(path.join(tmp, 'node_modules', 'pkg'), { recursive: true });
    writeFileSync(path.join(tmp, 'node_modules', 'pkg', 'README.md'), 'x');
    mkdirSync(path.join(tmp, '.next', 'cache'), { recursive: true });
    writeFileSync(path.join(tmp, '.next', 'cache', 'stale.md'), 'x');
  });

  afterAll(() => { rmSync(tmp, { recursive: true, force: true }); });

  it('finds root-level docs', () => {
    const found = findNewDocx(tmp, baseTime);
    expect(found.some(f => f.endsWith('/root.docx'))).toBe(true);
  });

  it('finds docs in subfolders (the CARTAS bug)', () => {
    const found = findNewDocx(tmp, baseTime);
    expect(found.some(f => f.endsWith('/CARTAS/01_Kennedy.docx'))).toBe(true);
    expect(found.some(f => f.endsWith('/CARTAS/02_Nivaldo.docx'))).toBe(true);
  });

  it('finds docs in deeper nesting up to max depth', () => {
    const found = findNewDocx(tmp, baseTime);
    expect(found.some(f => f.endsWith('/CARTAS/versions/V1_old.docx'))).toBe(true);
  });

  it('skips REVIEW_ and hidden files', () => {
    const found = findNewDocx(tmp, baseTime);
    expect(found.some(f => f.includes('REVIEW_skipme'))).toBe(false);
    expect(found.some(f => f.includes('.hidden.docx'))).toBe(false);
  });

  it('skips node_modules, .next, and other noise dirs', () => {
    const found = findNewDocx(tmp, baseTime);
    expect(found.some(f => f.includes('/node_modules/'))).toBe(false);
    expect(found.some(f => f.includes('/.next/'))).toBe(false);
  });

  it('respects afterMs — returns empty if nothing is new enough', () => {
    const future = Date.now() + 60_000;
    const found = findNewDocx(tmp, future);
    expect(found).toEqual([]);
  });
});
