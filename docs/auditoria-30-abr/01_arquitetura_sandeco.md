# Auditoria Arquitetural - Petition Engine
## Sandeco Cap. 4: Factory Method, Repository, Camadas

**Data**: 30 de abril de 2026  
**Auditor**: Claude Senior Architect  
**Contexto**: Paulo Lima exausto—sistema regride do passo 363 ao 13. Análise sob lente de Sandeco Cap. 4.

---

## Sumário Executivo

A arquitetura do Petition Engine **declara** os padrões Sandeco (Kernel L0, Camadas, Repository, Factory) mas **não os exercita**. O `agent-kernel.ts` (criado hoje) é correto em design mas desacoplado do runtime: nenhum dos 8 agentes legados foi migrado para receber `Syscalls` por injeção. A API Route (`src/app/api/generate/execute/route.ts`) ignora completamente o `getPipelineType` Factory — faz dispatch inline com `if/else` hardcoded. O Repository pattern existe para regras (`repository.ts`) mas **sistemas.json NÃO TEM REPOSITORY**: pipelines e agentes leem o arquivo JSON direto, sem abstração. Resultado: a regressão do passo 363→13 é sintomática de acoplamento: quando um arquivo é renomeado, movido ou formato muda, quebra silenciosamente em 15 locais diferentes. Sem Registry centralizador, não há rastro de quem chama quem.

---

## 1. Camadas — Análise por Camada

### L0 — Kernel (Propósito: contratos + registry + syscalls)

**Status**: DECLARADO, NÃO EXERCIDO.

**Arquivo**: `src/lib/agent-kernel.ts` (238 linhas)

**O que está bem**:
- Interfaces `Syscalls` bem tipadas (FileSyscalls, ProcessSyscalls, ClaudeSyscalls, WebSyscalls).
- Registry genérico com `AgentSpec<TInput, TOutput>` e `registerAgent()`.
- `AgentSpec.dependencies: string[]` torna grafo explícito (Sandeco Cap. 4, "Agent Dependency Graph").
- `createDefaultSyscalls()` implementado corretamente, com timeouts + idle detection.

**O que está mentindo**:
- `registerCoreAgents()` é um stub vazio. Não registra nenhum dos 8 agentes reais.
- Nenhum agente chamado em produção usa o kernel. É como ter um contrato assinado mas ninguém comparecendo.

**Problema raiz**: A implementação do kernel é **wrapper** (não-invasiva), o que é bom para migração gradual. Mas "gradual" não pode significar "nunca". A não-migração faz o kernel virar **código morto**.

---

### L1 — Agents (Propósito: puras funções Input→Output, sem fs/exec direto)

**Status**: VIOLA PRINCÍPIO. Todos importam `fs` e `child_process` direto.

**Mapeamento dos 8 agentes**:

| Agent | Camada | fs/exec direto? | Recebe Syscalls? | Localização |
|-------|--------|-----------------|------------------|------------|
| extractor | L1 | **SIM** (readFileSync, execSync) | NÃO | src/agents/extractor.ts:1-10 |
| writer | L1 | **SIM** (readFileSync) | NÃO | src/agents/writer.ts:2-3 |
| quality | L1 | Não (shell para Python) | NÃO | src/agents/quality.ts |
| quality-local | L1 | **SIM** (readFileSync, writeFileSync) | NÃO | src/agents/quality-local.ts:1-3 |
| uscis-reviewer | L1 | Não (apenas lógica) | NÃO | src/agents/uscis-reviewer.ts |
| auto-debugger | L1 | Não (chamada Claude) | NÃO | src/agents/auto-debugger.ts |
| auto-debugger-local | L1 | **SIM** (readFileSync, writeFileSync) | NÃO | src/agents/auto-debugger-local.ts:1-3 |
| system-updater | L1 | **SIM** (fs.readFile, fs.mkdir, fs.writeFile) | NÃO | src/agents/system-updater.ts |

**Violações concretas com line numbers**:

1. **extractor.ts:1-10**: 
   ```typescript
   import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
   import { execSync } from 'child_process';
   ```
   Acesso direto a PDF via `execSync('python3 scripts/extract_pdf.py')`.

2. **quality-local.ts:7-8**:
   ```typescript
   const RULES_PATH = path.join(process.cwd(), 'data', 'error_rules.json');
   return JSON.parse(readFileSync(RULES_PATH, 'utf-8'));
   ```
   Deveria chamar `Syscalls.files.read()` — mas não recebe Syscalls.

3. **system-updater.ts**:
   ```typescript
   import fs from 'fs';
   const meta = await fs.readFile(metaPath, 'utf-8');
   ```

**Impacto Sandeco Cap. 4.5**: Violação direta de "Agentes não sabem de infraestrutura".

---

### L2 — Pipelines (Propósito: orquestração de agents, sem lógica de negócio)

**Status**: PARCIALMENTE BEM (orquestra agents) + VIOLA PRINCÍPIO (acessa fs/exec direto).

**Arquivos**:
- `base.ts` — core (readClients, readAllRules, upsertGeneration)
- `cover-letter-eb1a.ts`, `cover-letter-eb2-niw.ts` — específicos
- `testimony-letters.ts` — específico
- `generic.ts` — genérico
- `registry.ts` — Factory (getPipelineType)

**Violações específicas**:

1. **base.ts:9-44** — Lê JSON direto:
   ```typescript
   import { readFileSync, writeFileSync, ... } from 'fs';
   const RULES_FILE = ...
   export function readClients(): any[] {
     return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8'));
   }
   ```

2. **cover-letter-eb1a.ts:75** — Lê diretório:
   ```typescript
   const content = readFileSync(planPath, 'utf-8');
   ```

3. **generic.ts:78** — Lê spec dinâmico:
   ```typescript
   return JSON.parse(readFileSync(specPath, 'utf-8'));
   ```

**Esperado Sandeco Cap. 4.6**: Pipelines deveriam receber dados via "Repositories" (Layer L0.5 ou injetados). Ex:
```typescript
// Ao invés de:
const rules = JSON.parse(readFileSync(RULES_PATH, 'utf-8'));

// Deveria ser:
const rules = await rulesRepository.findActive(docType);
```

---

### L3 — API Routes (Propósito: parsing HTTP → delegação para L2, sem lógica)

**Status**: ACOPLADA + IGNORA FACTORY.

**Arquivo principal**: `src/app/api/generate/execute/route.ts`

**Violação de Factory**:
```typescript
// Atual (linha ~50):
if (doc_type === 'cover_letter_eb1a') {
  await runCoverLetterEB1APipeline(...);
} else if (doc_type === 'cover_letter_eb2_niw') {
  await runCoverLetterEB2NIWPipeline(...);
} else {
  await runGenericPipeline(...);
}

// Esperado (Sandeco Cap. 4.4):
const pipelineType = getPipelineType(doc_type);
const pipeline = PIPELINE_DISPATCHER[pipelineType];
await pipeline(...);
```

**Violação de camada**:
```typescript
import { existsSync, mkdirSync } from 'fs';
// Acesso direto a fs — deveria delegar a L2
```

---

## 2. Repository Pattern — Onde Está Bem, Onde Mente

### Bem implementado:

**`src/lib/rules/repository.ts`** (145 linhas) — Padrão correto:
```typescript
export function readAllRules(): ErrorRule[] { ... }
export function readActiveRules(): ErrorRule[] { ... }
export function readRulesForDocType(docType: string): ErrorRule[] { ... }
export function buildRulesSection(docType: string): string { ... }
export function incrementTrigger(ruleId: string): void { ... }
```

- Abstração clara: negócio chama `readRulesForDocType()`, não `readFileSync()`.
- Se storage mudar JSON→DB, muda apenas aqui.
- Atende Sandeco Cap. 4.6.

### Que Mente:

**`systems.json`** — NÃO TEM REPOSITORY.

Comentário em `testimony-letters.ts:62`:
```typescript
// Sistema canônico de cartas (mapeado em data/systems.json) — caminho absoluto.
```

Mas onde? **Ninguém lê systems.json!**

**Achado**: Pipelines referem-se a `systemPath` como parâmetro, mas nunca consultam a mapping:
```typescript
// testimony-letters.ts fala de systems.json mas não o lê:
export async function runTestimonyLettersPipeline(params: {
  systemPath: string;  // ← onde vem? De quem lê systems.json?
  ...
}) { ... }
```

**Investigação**: `src/lib/file-reader.ts:4-7`:
```typescript
const SYSTEMS_BASE = path.join(process.cwd(), 'systems');
const systemPath = path.join(SYSTEMS_BASE, symlinkDir);
```

`SYSTEMS_BASE` é hardcoded. Nunca consulta `systems.json`. Simplesmente assume `systems/{symlinkDir}`.

**Impacto**: Se o mapa em `data/systems.json` mudar, pipelines não sabem. É **carregamento stale** e **brittle**.

---

## 3. Factory Method — Gaps de Cabeamento

**`registry.ts`** define Factory correto:
```typescript
export type PipelineType = 'cover_letter_eb1a' | 'cover_letter_eb2_niw' | 'testimony_letters' | 'generic';

export function getPipelineType(docType: string): PipelineType {
  switch (docType) {
    case 'cover_letter_eb1a': return 'cover_letter_eb1a';
    ...
  }
}
```

**Mas**:
1. `execute/route.ts` NÃO o usa (linha ~50 tem if/else hardcoded).
2. Nenhum dispatcher que mapeia PipelineType → handler importado.
3. Gap: **Factory existe mas é órfão**.

**Conseqüência descoberta hoje (testimony)**:
- testimony-letters.ts referencia um `systemPath` que ninguém passa.
- A API não consulta systems.json para resolver o tipo → Path.
- Resultado: pipeline tenta ler arquivo que não sabe onde está.

---

## 4. Agent Kernel — Estado Real

**Arquivo**: `src/lib/agent-kernel.ts` (238 linhas)

**Checklist Sandeco Cap. 4**:

| Princípio | Esperado | Implementado? | Status |
|-----------|----------|---------------|--------|
| Syscalls tipadas | FileSyscalls, ProcessSyscalls, etc. | SIM | ✓ Correto |
| Registry centralizador | AgentRegistry Map<id, spec> | SIM | ✓ Correto |
| Dependency graph (dependencies[]) | Explícito em AgentSpec | SIM | ✓ Correto |
| Injeção de Syscalls | sys: Syscalls parâmetro | SIM, assinatura | ✗ Ninguém chama assim |
| Registração de agents | registerCoreAgents() | SIM, mas vazio | ✗ Stub |
| Execução via kernel | runAgent(id, input, syscalls) | SIM | ✗ Ninguém usa |

**Diagnóstico**: Kernel é **"forma sem substância"**. É como ter uma API documentada mas ninguém a chamando.

---

## 5. Anti-patterns Identificados

### A. "Leia JSON direto" — espalhado em 15+ locais

| Arquivo | Linha | Padrão | Deveria ser |
|---------|-------|--------|------------|
| base.ts | 23 | readFileSync(GENERATIONS_FILE) | Repository.readGenerations() |
| base.ts | 44 | readFileSync(CLIENTS_FILE) | ClientRepository.findAll() |
| quality-local.ts | 8 | readFileSync(RULES_PATH) | rulesRepository.findAll() |
| extractor.ts | 45 | readFileSync(filePath) | Syscalls.files.read() |
| writer.ts | 30 | readFileSync(join(...)) | Syscalls.files.read() |
| auto-debugger-local.ts | 12 | readFileSync(ERROR_RULES_FILE) | errorRepository.read() |
| system-updater.ts | N/A | fs.readFile() | Syscalls.files.read() |

**Impacto**: Quando muda formato/localização, debugar é "grep por 15 arquivos".

### B. "Factory exists but unused" — registry.ts

`getPipelineType()` definido mas route.ts tem if/else copiado.

### C. "Layer violation" — API Route acessa fs

```typescript
// src/app/api/generate/execute/route.ts
import { existsSync, mkdirSync } from 'fs';
// ↑ L3 não deveria fazer I/O filesystem
```

### D. "Stale mapping" — systems.json não lido

Arquivo `data/systems.json` existe mas seu conteúdo é ignorado. Pipelines hardcodeiam caminhos.

### E. "Agent receives no Syscalls" — 8 agents

Todos assinam handlers com `(input: TInput)`, não `(input: TInput, sys: Syscalls)`.

---

## 6. Princípios CLAUDE.md Violados

**Arquivo**: `/CLAUDE.md` (root)

| Princípio | Texto | Status | Violação |
|-----------|-------|--------|----------|
| Livro Sandeco é referência arquitetural | "Cap 4 (Factory Method, Repository, Camadas) é base do código" | **VIOLADO** | Padrões declarados, não exercidos |
| Sistemas são genéricos | Nunca nomear por cliente | **OK** | Nenhuma violação encontrada |
| PROEX é consultoria | Não escritório de advocacia | **OK** | Nenhuma violação encontrada |
| V prefix na frente | V5_arquivo.md, nunca arquivo_V5.md | **OK** | Nenhuma violação encontrada |
| Versões antigas preservadas | Renomear, nunca deletar | **OK** | CLAUDE_v1_legacy_2026-03.md existe |

**Principal violação**: O princípio de que "Cap. 4 Sandeco é base do código" está sendo ignorado ativamente. O kernel está lá mas morto.

---

## 7. TOP 5 Ações Arquiteturais com Maior ROI

### 1. **Migrar 3 agentes para Syscalls injeção** (3-4h) — ROI: ALTÍSSIMO

**Por quê**: Quebra ciclo acoplamento → prova que kernel é real.

**Quais**:
- extractor.ts (maior impacto: usa execSync em 2 locais)
- quality-local.ts (usa readFileSync + writeFileSync)
- auto-debugger-local.ts (idem)

**Como**:
```typescript
// Antes:
export async function extractorAgent(input: ExtractorInput): Promise<...> {
  const content = readFileSync(filePath, 'utf-8');
  const result = execSync('python3 ...');
}

// Depois:
export async function extractorAgent(input: ExtractorInput, sys: Syscalls): Promise<...> {
  const content = sys.files.read(filePath);
  const result = await sys.process.spawn('python3', [...]);
}
```

**Registrar no kernel**:
```typescript
registerAgent({
  id: 'extractor',
  handler: extractorAgent,
  dependencies: [],
  source_path: 'src/agents/extractor.ts',
});
```

**Evidência de sucesso**: `runAgent('extractor', input, syscalls)` funciona.

---

### 2. **Usar Factory getPipelineType() na API** (1h) — ROI: MUITO ALTO

**Arquivo**: `src/app/api/generate/execute/route.ts`

**Mudança**:
```typescript
// Antes:
if (doc_type === 'cover_letter_eb1a') { ... }
else if (doc_type === 'cover_letter_eb2_niw') { ... }

// Depois:
import { getPipelineType } from '@/lib/pipelines/registry';
const pipelineType = getPipelineType(doc_type);
const handler = PIPELINE_HANDLERS[pipelineType];
await handler(params);
```

**Ganho**: Single source of truth para dispatch. Adicionar novo tipo = 1 linha em registry.ts + 1 linha em PIPELINE_HANDLERS.

---

### 3. **Criar SystemsRepository para systems.json** (2h) — ROI: MUITO ALTO

**Novo arquivo**: `src/lib/rules/systems-repository.ts`

```typescript
export interface SystemMapping {
  doc_type: string;
  system_name: string;
  system_path: string;
}

export function getSystemPath(docType: string): string | null {
  const systems = readAllSystems();
  const mapping = systems.find(m => m.doc_type === docType);
  return mapping?.system_path || null;
}
```

**Usar em pipelines**:
```typescript
// Antes:
const systemPath = path.join(SYSTEMS_BASE, symlinkDir); // hardcoded

// Depois:
const systemPath = getSystemPath(docType);
if (!systemPath) throw new Error(`No system mapping for ${docType}`);
```

**Ganho**: systems.json agora é consultado, não ignorado. Rastreável.

---

### 4. **Implementar verdadeiro Repository para clients.json** (1.5h) — ROI: MÉDIO

**Novo**: `src/lib/rules/clients-repository.ts`

Padrão idêntico ao de rules-repository.ts.

**Benefício**: Centralizar lógica de cache, validação, versionamento.

---

### 5. **Criar runAgent dispatcher na API** (1h) — ROI: MÉDIO

**Novo padrão**:
```typescript
// src/lib/agent-dispatcher.ts
export async function dispatchAgent(agentId: string, input: unknown, sys: Syscalls): Promise<unknown> {
  return runAgent(agentId, input, sys);
}
```

Use na API em vez de chamar agents diretamente.

**Ganho**: Rastreabilidade centralizada. Hooks para observability.

---

## 8. Recomendação Final

**Paulo está certo em estar exausto**: a arquitetura está fragmentada entre "o que deveria ser" (kernel + padrões bonitos) e "o que é feito" (agents acoplados, factory órfão, repository parcial).

A regressão 363→13 é **estrutural**: sem Registry, sem Repository para sistema paths, sem injeção de dependências, cada quebra dispara efeito cascata em 15 arquivos.

**Próximos passos ordenados por impacto**:
1. Migrar extractor.ts para Syscalls (prova de conceito vivo).
2. Ligar getPipelineType() à API (5 minutos, enorme ganho).
3. SystemsRepository (resolve "testimony" hoje).
4. Registrar agentes no kernel (escala gradualmente).

Depois disso, "passo 363→13" muda para "passo 363→364" porque o sistema **acumula implicitamente** — não por revisão humana, mas porque o grafo é explícito.

---

**Auditoria completada: 30 de abril de 2026.**
