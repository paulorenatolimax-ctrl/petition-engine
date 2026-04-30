/**
 * Agent Kernel — contratos formais entre agentes do Petition Engine.
 *
 * Inspirado em:
 *   - Sandeco "Engenharia de Software com Agentes Inteligentes", Cap. 4
 *     (Factory Method, Repository, Camadas)
 *   - AIOS (Agent Operating System) — syscalls tipadas, registry
 *
 * Camadas:
 *   L0 — kernel (este arquivo): syscalls + registry + tipagem genérica
 *   L1 — agents (src/agents/*): puras funções Input → Promise<Output>
 *   L2 — pipelines (src/lib/pipelines/*): orquestração de múltiplos agents
 *   L3 — API routes (src/app/api/*): exposição HTTP
 *
 * Princípios:
 *   - Agentes NÃO importam fs, child_process, fetch, exec. Eles recebem
 *     `Syscalls` por injeção. Isso torna agentes testáveis sem mock global.
 *   - O Registry é uma fonte única de verdade sobre quem existe e quem chama
 *     quem. AgentSpec.dependencies torna o grafo explícito (Sandeco Cap. 4).
 *   - Migração é gradual: agentes legados continuam rodando, mas devem
 *     ser registrados via `registerAgent` para ganhar rastreabilidade.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
import { spawn, type SpawnOptions } from 'child_process';

// ────────────────────────────────────────────────────────────────────────────
// Syscalls — contratos abstratos para I/O e inferência
// ────────────────────────────────────────────────────────────────────────────

export interface FileSyscalls {
  read(filePath: string, encoding?: BufferEncoding): string;
  write(filePath: string, content: string): void;
  exists(filePath: string): boolean;
  mkdirp(dirPath: string): void;
  list(dirPath: string): string[];
}

export interface ProcessSyscalls {
  /**
   * Spawn a child process with timeout + idle timeout. Returns stdout/stderr
   * and a flag indicating which timeout (if any) fired.
   */
  spawn(
    cmd: string,
    args: string[],
    options?: SpawnOptions & { timeoutMs?: number; idleTimeoutMs?: number }
  ): Promise<{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }>;
}

export interface ClaudeSyscalls {
  /**
   * Run a Claude inference via the local CLI (`claude -p ...`). The prompt
   * file path is required so tooling can audit what was sent.
   */
  inference(promptFilePath: string, allowedTools?: string[]): Promise<{ stdout: string; exitCode: number; timedOut: boolean }>;
}

export interface WebSyscalls {
  fetch(url: string, init?: RequestInit): Promise<Response>;
}

export interface Syscalls {
  files: FileSyscalls;
  process: ProcessSyscalls;
  claude: ClaudeSyscalls;
  web: WebSyscalls;
  /**
   * Repository root. Agents must derive ALL paths from this — never use
   * process.cwd() inside an agent.
   */
  repoRoot: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Default Syscalls — impl concreta para produção
// ────────────────────────────────────────────────────────────────────────────

export function createDefaultSyscalls(repoRoot: string = process.cwd()): Syscalls {
  return {
    repoRoot,
    files: {
      read: (p, encoding = 'utf-8') => readFileSync(p, { encoding }),
      write: (p, content) => writeFileSync(p, content, 'utf-8'),
      exists: (p) => existsSync(p),
      mkdirp: (p) => { if (!existsSync(p)) mkdirSync(p, { recursive: true }); },
      list: (p) => readdirSync(p),
    },
    process: {
      async spawn(cmd, args, opts = {}) {
        const timeoutMs = opts.timeoutMs;
        const idleMs = opts.idleTimeoutMs;
        return new Promise((resolve) => {
          const proc = spawn(cmd, args, opts);
          let stdout = '';
          let stderr = '';
          let timedOut = false;
          let lastOutput = Date.now();
          const hardTimer = timeoutMs ? setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, timeoutMs) : undefined;
          const idleInterval = idleMs ? setInterval(() => {
            if (Date.now() - lastOutput > idleMs) { timedOut = true; proc.kill('SIGKILL'); }
          }, Math.min(idleMs, 5000)) : undefined;
          proc.stdout?.on('data', (d) => { stdout += d.toString(); lastOutput = Date.now(); });
          proc.stderr?.on('data', (d) => { stderr += d.toString(); lastOutput = Date.now(); });
          proc.on('close', (code) => {
            if (hardTimer) clearTimeout(hardTimer);
            if (idleInterval) clearInterval(idleInterval);
            resolve({ stdout, stderr, exitCode: code ?? -1, timedOut });
          });
        });
      },
    },
    claude: {
      async inference(promptFilePath, allowedTools = ['Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep']) {
        const args = ['-p', `Leia ${promptFilePath} e execute tudo.`, '--allowedTools', allowedTools.join(',')];
        const proc = spawn('claude', args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let stdout = '';
        return new Promise((resolve) => {
          proc.stdout?.on('data', (d) => { stdout += d.toString(); });
          proc.on('close', (code) => resolve({ stdout, exitCode: code ?? -1, timedOut: false }));
        });
      },
    },
    web: {
      fetch: (url, init) => fetch(url, init),
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// AgentSpec — contrato declarativo de cada agente
// ────────────────────────────────────────────────────────────────────────────

export type AgentLayer = 'extractor' | 'writer' | 'quality' | 'reviewer' | 'debugger' | 'updater';

export interface AgentSpec<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  layer: AgentLayer;
  version: string;
  description: string;
  /** IDs de outros agents que este consome (grafo explícito de dependência). */
  dependencies: string[];
  /** Caminho relativo do arquivo onde o handler vive (rastreabilidade). */
  source_path: string;
  handler: (input: TInput, sys: Syscalls) => Promise<TOutput>;
}

// ────────────────────────────────────────────────────────────────────────────
// AgentRegistry — Factory Method (Sandeco Cap. 4)
// ────────────────────────────────────────────────────────────────────────────

const REGISTRY = new Map<string, AgentSpec<unknown, unknown>>();

export function registerAgent<TInput, TOutput>(spec: AgentSpec<TInput, TOutput>): void {
  if (REGISTRY.has(spec.id)) {
    throw new Error(`Agent ${spec.id} already registered. Each id must be unique.`);
  }
  REGISTRY.set(spec.id, spec as AgentSpec<unknown, unknown>);
}

export function getAgent<TInput = unknown, TOutput = unknown>(id: string): AgentSpec<TInput, TOutput> | null {
  const spec = REGISTRY.get(id);
  return (spec as AgentSpec<TInput, TOutput> | undefined) ?? null;
}

export function listAgents(): AgentSpec<unknown, unknown>[] {
  return Array.from(REGISTRY.values());
}

export function clearRegistry(): void {
  // For tests only.
  REGISTRY.clear();
}

export async function runAgent<TInput, TOutput>(id: string, input: TInput, sys?: Syscalls): Promise<TOutput> {
  const spec = REGISTRY.get(id);
  if (!spec) throw new Error(`Agent ${id} not registered. Available: ${Array.from(REGISTRY.keys()).join(', ')}`);
  const syscalls = sys ?? createDefaultSyscalls();
  return (await spec.handler(input as unknown, syscalls)) as TOutput;
}

// ────────────────────────────────────────────────────────────────────────────
// Default registrations — agents existentes (wrappers, não reescrita)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Registra os agentes do diretório src/agents/* como specs canônicos.
 * Wrap fino — não muda o comportamento, só ganha tipagem + rastreabilidade.
 *
 * Migração progressiva: cada agent legado pode ser refatorado pra usar
 * `Syscalls` internamente em vez de fs/child_process direto. Quando todos
 * estiverem migrados, vira o caminho único.
 */
export function registerCoreAgents(): void {
  // Lazy require — agentes legados ainda usam fs/child_process direto e
  // injection seria uma migração. Aqui apenas referenciamos os entry points.
  const baseDir = path.join('src', 'agents');
  const core: Array<Omit<AgentSpec, 'handler'>> = [
    { id: 'extractor.v1', name: 'Extractor', layer: 'extractor', version: '1.0', description: 'Extrai dados estruturados de PDFs/DOCX do cliente.', dependencies: [], source_path: path.join(baseDir, 'extractor.ts') },
    { id: 'writer.v1', name: 'Writer', layer: 'writer', version: '1.0', description: 'Escreve documentos baseados em prompts + benchmarks.', dependencies: ['extractor.v1'], source_path: path.join(baseDir, 'writer.ts') },
    { id: 'quality.v1', name: 'Quality (remote)', layer: 'quality', version: '1.0', description: 'Quality gate via Claude API remota.', dependencies: ['writer.v1'], source_path: path.join(baseDir, 'quality.ts') },
    { id: 'quality-local.v1', name: 'Quality (local)', layer: 'quality', version: '1.0', description: 'Quality gate determinístico local.', dependencies: ['writer.v1'], source_path: path.join(baseDir, 'quality-local.ts') },
    { id: 'uscis-reviewer.v1', name: 'USCIS Reviewer', layer: 'reviewer', version: '1.0', description: 'Build prompt de revisão consoante USCIS PM e Dhanasar.', dependencies: ['writer.v1'], source_path: path.join(baseDir, 'uscis-reviewer.ts') },
    { id: 'auto-debugger.v1', name: 'AutoDebugger (remote)', layer: 'debugger', version: '1.0', description: 'Aprende novas regras a partir de erros recorrentes (remote).', dependencies: ['quality.v1'], source_path: path.join(baseDir, 'auto-debugger.ts') },
    { id: 'auto-debugger-local.v1', name: 'AutoDebugger (local)', layer: 'debugger', version: '1.0', description: 'Aprende novas regras localmente, sem rede.', dependencies: ['quality-local.v1'], source_path: path.join(baseDir, 'auto-debugger-local.ts') },
    { id: 'system-updater.v1', name: 'System Updater', layer: 'updater', version: '1.0', description: 'Propõe atualizações ao próprio sistema (rules, prompts).', dependencies: ['auto-debugger-local.v1'], source_path: path.join(baseDir, 'system-updater.ts') },
  ];
  for (const meta of core) {
    if (REGISTRY.has(meta.id)) continue;
    REGISTRY.set(meta.id, {
      ...meta,
      handler: async () => {
        throw new Error(`${meta.id} ainda usa import direto em src/agents/${path.basename(meta.source_path)}. Migrar para Syscalls antes de invocar via runAgent.`);
      },
    } as AgentSpec<unknown, unknown>);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Helper: dependency graph
// ────────────────────────────────────────────────────────────────────────────

export interface DependencyGraph {
  nodes: Array<{ id: string; layer: AgentLayer; version: string }>;
  edges: Array<{ from: string; to: string }>;
}

export function buildDependencyGraph(): DependencyGraph {
  const nodes: DependencyGraph['nodes'] = [];
  const edges: DependencyGraph['edges'] = [];
  for (const spec of Array.from(REGISTRY.values())) {
    nodes.push({ id: spec.id, layer: spec.layer, version: spec.version });
    for (const dep of spec.dependencies) edges.push({ from: spec.id, to: dep });
  }
  return { nodes, edges };
}
