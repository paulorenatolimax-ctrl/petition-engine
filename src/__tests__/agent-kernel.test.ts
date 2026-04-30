import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerAgent,
  getAgent,
  listAgents,
  clearRegistry,
  runAgent,
  registerCoreAgents,
  buildDependencyGraph,
  createDefaultSyscalls,
  type AgentSpec,
  type Syscalls,
} from '@/lib/agent-kernel';

describe('Agent Kernel — registry', () => {
  beforeEach(() => clearRegistry());

  it('registers and retrieves an agent by id', () => {
    const spec: AgentSpec<{ x: number }, { y: number }> = {
      id: 'echo.v1',
      name: 'Echo',
      layer: 'extractor',
      version: '1.0',
      description: 'Returns y = x.',
      dependencies: [],
      source_path: 'src/__tests__/agent-kernel.test.ts',
      handler: async (input) => ({ y: input.x }),
    };
    registerAgent(spec);
    expect(getAgent('echo.v1')?.name).toBe('Echo');
    expect(listAgents()).toHaveLength(1);
  });

  it('refuses to re-register an existing id', () => {
    const spec: AgentSpec = {
      id: 'dup.v1', name: 'Dup', layer: 'extractor', version: '1.0',
      description: '', dependencies: [], source_path: '',
      handler: async () => null,
    };
    registerAgent(spec);
    expect(() => registerAgent(spec)).toThrow(/already registered/);
  });

  it('runAgent invokes handler with injected syscalls', async () => {
    let receivedRoot: string | null = null;
    registerAgent({
      id: 'inspect.v1', name: 'Inspect', layer: 'extractor', version: '1.0',
      description: '', dependencies: [], source_path: '',
      handler: async (_input, sys) => { receivedRoot = sys.repoRoot; return 'ok'; },
    });
    const fakeSys: Syscalls = createDefaultSyscalls('/tmp/fake-root');
    const r = await runAgent<unknown, string>('inspect.v1', null, fakeSys);
    expect(r).toBe('ok');
    expect(receivedRoot).toBe('/tmp/fake-root');
  });

  it('throws for unregistered agent', async () => {
    await expect(runAgent('nope', null)).rejects.toThrow(/not registered/);
  });
});

describe('Agent Kernel — core agents + dependency graph', () => {
  beforeEach(() => clearRegistry());

  it('registers all 8 core agents from src/agents/', () => {
    registerCoreAgents();
    const ids = listAgents().map(a => a.id).sort();
    expect(ids).toEqual([
      'auto-debugger-local.v1',
      'auto-debugger.v1',
      'extractor.v1',
      'quality-local.v1',
      'quality.v1',
      'system-updater.v1',
      'uscis-reviewer.v1',
      'writer.v1',
    ]);
  });

  it('dependency graph is acyclic and writer depends on extractor', () => {
    registerCoreAgents();
    const g = buildDependencyGraph();
    const writerEdges = g.edges.filter(e => e.from === 'writer.v1');
    expect(writerEdges).toEqual([{ from: 'writer.v1', to: 'extractor.v1' }]);
    const extractorEdges = g.edges.filter(e => e.from === 'extractor.v1');
    expect(extractorEdges).toHaveLength(0);
  });

  it('runAgent on un-migrated core agent throws explicit migration error', async () => {
    registerCoreAgents();
    await expect(runAgent('extractor.v1', {})).rejects.toThrow(/Migrar para Syscalls/);
  });
});

describe('Default Syscalls', () => {
  it('exposes file/process/claude/web modules', () => {
    const s = createDefaultSyscalls('/tmp/x');
    expect(s.repoRoot).toBe('/tmp/x');
    expect(typeof s.files.read).toBe('function');
    expect(typeof s.process.spawn).toBe('function');
    expect(typeof s.claude.inference).toBe('function');
    expect(typeof s.web.fetch).toBe('function');
  });
});
