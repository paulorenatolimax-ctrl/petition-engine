# Auditoria de Integridade de Cabeamento — Petition Engine
## Sistema Automatizado de Geração de Documentos de Imigração

**Data:** 30 de Abril de 2026  
**Auditor:** Paulo (Engenheiro Principal)  
**Objetivo:** Auditar todos os pipelines para identificar quais REALMENTE leem `system_path` canônico vs. quais só mencionam mas não leem.

---

## Sumário Executivo

**DESCOBERTA CRÍTICA:** O padrão do bug em `testimony-letters.ts` (mencionava SKILL_v5 em 1 linha mas não instruía sub-claude a ler) está **replicado em múltiplos lugares**:

1. **testimony-letters.ts** ✅ CORRIGIDO HOJE (commit `5b0a5e0`)
2. **cover-letter-eb1a.ts** ⚠️ Lê system_path mas falta **listagem de benchmarks** + **proibição anti-RAG explícita**
3. **cover-letter-eb2-niw.ts** ⚠️ Mesmo problema que EB1A
4. **generic.ts** ❌ **CRÍTICO** — Apenas interpola `{systemPath}` no template, NÃO embute conteúdo
5. **POST /api/generate** ❌ **CRÍTICO** — NÃO usa `getPipelineType()` e NÃO checa `MULTI_PHASE_DOC_TYPES`
6. **systems/ symlinks** ⚠️ 1 symlink QUEBRADO (impacto/)

**IMPACTO:** ~18 doc_types (resume, business_plan, anteprojeto, impacto, strategy, metodologia, declaration, saas_evidence, rfe_response, etc.) **caem no pipeline genérico sem roteamento explícito**. Se seus JSON specs (`systems/pipelines/*.json`) não instruem "Leia \${systemPath}", outputs saem **template-genéricos**.

---

## Tabela Mestra — 6 Pipelines × 6 Dimensões de Avaliação

| Pipeline | Lê system_path inteiro? | Embute conteúdo? | Benchmark explícito? | Anti-RAG proibição? | References/refs/? | Veredito |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **testimony-letters.ts** | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ **OK** |
| **cover-letter-eb1a.ts** | ✅ Sim | ✅ Sim | ❌ Não | ❌ Não | ✅ Sim | ⚠️ **PARCIAL** |
| **cover-letter-eb2-niw.ts** | ✅ Sim | ✅ Sim | ❌ Não | ❌ Não | ✅ Sim | ⚠️ **PARCIAL** |
| **generic.ts** | ❌ Não* | ❌ Não* | ❌ Não | ❌ Não | ❌ Não | ❌ **GAP** |
| **buildAnteprojetoInstruction** | ✅ Sim | ✅ Sim | ❌ Não | ✅ Sim | ❌ Não | ⚠️ **PARCIAL** |
| **POST /api/generate** | — | — | — | — | — | ❌ **GAP** |

*generic.ts só interpola `{systemPath}` como placeholder; espera sub-claude obedecer instruções do JSON spec.

---

## Gaps Críticos (Mencionam mas Não Leem)

### 1. **generic.ts** — Pipeline Genérico (CRÍTICO)
**Arquivo:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/lib/pipelines/generic.ts`  
**Linhas:** 97 (interpolate), 278 (runClaude call)

**Análise:**
```typescript
// L97 — Só interpola {systemPath}, não embute
function interpolate(template: string, params: PipelineParams): string {
  return template
    .replace(/\{systemPath\}/g, params.systemPath)  // ← Apenas string replacement
    // ... outros placeholders
}

// L278 — Passa prompt ao runClaude
const result = await runClaude(claudeBin, prompt, ...)
```

**Problema:**
- generic.ts **NÃO lê arquivos** em `system.system_path`
- **Não embute conteúdo** dos .md/references/ no prompt
- Apenas substitui `{systemPath}` por string do path
- **Depende 100% do JSON spec** (`systems/pipelines/*.json`) instruir "Leia \${systemPath}"
- **Se o spec não instruir, output é template-genérico**

**Impacto:** Resume, Business Plan, Anteprojeto, Impacto, Strategy, etc. — **18+ doc_types caem aqui**

**Veredito:** ❌ **MENCIONA MAS NÃO LÊ**

---

### 2. **POST /api/generate** — Router Principal (CRÍTICO)
**Arquivo:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/app/api/generate/route.ts`  
**Linhas:** 363–700 (POST handler)

**Análise:**
```typescript
// NÃO há import de getPipelineType
// NÃO há import de MULTI_PHASE_DOC_TYPES
// NÃO há switch(doc_type)
// NÃO há verificação de qual pipeline usar

export async function POST(req: NextRequest) {
  const { client_id, doc_type, generation_instructions } = body;
  
  // ... valida client, procura system via systems.json ...
  
  // Depois apenas chama runClaude com o prompt genérico
  // sem roting explícito para cover_letter_eb1a / testimony_letters / etc.
}
```

**Problema:**
- POST /api/generate **NÃO chama `getPipelineType(doc_type)`**
- Não usa `MULTI_PHASE_DOC_TYPES` para detectar pipelines multi-fase
- Não rota para `src/lib/pipelines/*.ts` explicitamente
- Apenas gera prompt genérico + chama runClaude
- **Todos os doc_types caem no "generic" behavior** a menos que o spec JSON instrua diferente

**Esperado:** Algo como:
```typescript
const pipelineType = getPipelineType(doc_type);
if (MULTI_PHASE_DOC_TYPES.includes(doc_type)) {
  return await executePipeline(pipelineType, { client, doc_type, ... });
} else {
  return await genericPipeline(...);
}
```

**Veredito:** ❌ **GAP CRÍTICO — NÃO ROTA PARA PIPELINES EXPLÍCITOS**

---

## Gaps Médios (Leem Parcial)

### 1. **cover-letter-eb1a.ts** — Lê mas sem Benchmarks
**Arquivo:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/lib/pipelines/cover-letter-eb1a.ts`  
**Linhas:** 228–417 (prompt sections)

**OK:**
- ✅ Menciona `${EB1A_SYSTEM_PATH}/` explicitamente
- ✅ Instrui "Leia ESPECIFICAMENTE: SEMANTIC_CROSS_REFERENCE_MAP.md, ARCHITECT_*.md, FORMATTING_SPEC.md, FORBIDDEN_CONTENT.md"
- ✅ Lê references implicitamente via "Leia TODOS os arquivos"

**Gaps:**
- ❌ **Não lista exemplos aprovados** (Ricardo V5, Maçol V3, Tiago FS V1) — deixa vago "sem templates genéricos"
- ❌ **Não proíbe termos AI-like explicitamente** ("generated", "automated", "system", "AI")

**Veredito:** ⚠️ **MENCIONA E LÊ, MAS BENCHMARK E ANTI-RAG GAPS**

---

### 2. **cover-letter-eb2-niw.ts** — Idêntico ao EB1A
**Arquivo:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/lib/pipelines/cover-letter-eb2-niw.ts`  
**Linhas:** 169–359 (prompt sections)

**OK:**
- ✅ Lê `${EB2_NIW_SYSTEM_PATH}/` + `${RAGS_EB2}/`
- ✅ Instrui "Leia TODOS os documentos" + "Leia ESPECIFICAMENTE: ARCHITECT_*.md, TEMPLATE_PRONG*.md"
- ✅ References implícitas

**Gaps:**
- ❌ Sem benchmark listing
- ❌ Sem anti-RAG proibição explícita

**Veredito:** ⚠️ **MENCIONA E LÊ, MAS BENCHMARK E ANTI-RAG GAPS**

---

### 3. **buildAnteprojetoInstruction()** — Partial Read
**Arquivo:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/app/api/generate/route.ts:L150–220`

**OK:**
- ✅ Lê `system.system_path` (L179: "Leia TODOS os arquivos .md em:")
- ✅ Lê RAGs (L183: "Leia TODOS os arquivos em: ${ragsPath}")
- ✅ Instrui "Leia TODOS os documentos do cliente" (L211)
- ✅ Anti-RAG proibição presente via anti-RAG rules na seção de regras

**Gaps:**
- ❌ **Sem WebSearch obrigatório** (mencionado em comentários mas não no prompt)
- ❌ **Sem benchmark listing** (Ricardo Anteprojeto V7, etc.)
- ❌ **Sem references/ listing explícito**

**Veredito:** ⚠️ **MENCIONA E LÊ PARCIAL, MAS BENCHMARK/WEBSEARCH GAPS**

---

## Pipelines OK (Leem Integralmente)

### **testimony-letters.ts** ✅ CORRIGIDO HOJE
**Arquivo:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/lib/pipelines/testimony-letters.ts`  
**Commit:** `5b0a5e0 feat(testimony): pipeline LÊ system_path real (SKILL_v5 + references + benchmarks)`

**Verificado:**
- ✅ Lê `system_path` (Fase 1)
- ✅ Embute SKILL_v5 + references/ + benchmarks
- ✅ Lista exemplos aprovados (Mariana Kasza V10, etc.)
- ✅ Proíbe "generated", "AI", "automated", "system" explicitamente
- ✅ Instrui Atlas validation + hard-block scan

**Veredito:** ✅ **FUNCIONA INTEGRALMENTE** (modelo a seguir)

---

## Symlinks `systems/` — Status de Funcionalidade

**Total:** 16 symlinks + 3 diretórios  
**Funcionais:** 15 ✓  
**Quebrados:** 1 ✗

| Symlink | Alvo | Status |
|---|---|---|
| anteprojeto-eb1a | `/2_PROEX/.../TENTATIVA 2 - KORTIX` | ✓ |
| anteprojeto-eb2-niw | `/2_PROEX/.../EB-2 - ESTRATÉGIAS` | ✓ |
| business-plan | `/3_OMNI/.../BP_SYSTEM_V3` | ✓ |
| cover-letter-eb1a | `/2_PROEX/.../EB1A_SYSTEM_v5` | ✓ |
| cover-letter-eb2-niw | `/AIOS_Petition Engine/.../V3_Project Instructions` | ✓ |
| declaracao-intencoes | `/5_Z GLOBAL/.../Declaração de Intenções (PROMPTS)` | ✓ |
| estrategia-eb1 | `/2_PROEX/.../EB-1 - ESTRATÉGIA EB-1` | ✓ |
| estrategia-eb2 | `/2_PROEX/.../EB-2 - ESTRATÉGIAS` | ✓ |
| **impacto** | `/5_Z GLOBAL/_PRODUTO NOVO/agents` | **✗ QUEBRADO** |
| localizacao | `/2_PROEX/.../LOCALIZAÇÃO - PROMPT` | ✓ |
| metodologia | `/5_Z GLOBAL/Z_PROMPTS/.../Metodologia (PROMPTS)` | ✓ |
| resume-eb1a | `/AIOS_Petition Engine/EB1A_RESUME_SYSTEM` | ✓ |
| resume-eb2-niw | `/AIOS_Petition Engine/EB2_NIW_RESUME_SYSTEM` | ✓ |
| saas-evidence | `/5_Z GLOBAL/Z_PROMPTS/SAAS (PROMPTS)` | ✓ |
| satellite-letters-eb1 | `/2_PROEX/.../Sistema Produtor de Cartas EB-1` | ✓ |
| satellite-letters-eb2 | `/2_PROEX/.../Sistema Produtor de Cartas EB-1/` | ✓ |

**Symlink Quebrado:**
- **impacto** → `/Users/paulo1844/Documents/5_Z GLOBAL/_PRODUTO NOVO/agents` — Path NÃO é diretório válido

---

## TOP 5 Fixes em Ordem de Impacto

### 🔴 **#1 CRÍTICO: Fix POST /api/generate Router**
- **Impact:** ~18 doc_types corrigidos de uma vez
- **Ação:** Adicionar import + switch/case em route.ts:POST
- **Pseudo-código:**
  ```typescript
  import { getPipelineType, MULTI_PHASE_DOC_TYPES } from '@/lib/pipelines/registry';
  
  if (MULTI_PHASE_DOC_TYPES.includes(doc_type)) {
    const pipelineType = getPipelineType(doc_type);
    return await importPipeline(pipelineType).execute({ client, doc_type, ... });
  }
  ```
- **Arquivo:** `src/app/api/generate/route.ts` (linha ~365)
- **Esforço:** 2–4h (refactoring + tests)

---

### 🔴 **#2 CRÍTICO: Audit & Fix Todos os JSON Specs**
- **Impact:** Garante que generic.ts sub-claudes REALMENTE leem system_path
- **Ação:** Para cada `systems/pipelines/*.json`, verificar se Phase 1 (ou relevante) instrui:
  ```
  "Leia TODOS os arquivos .md em: {systemPath}"
  "Leia especificamente: references/, BENCHMARKS.md, etc."
  ```
- **Arquivos:** `systems/pipelines/*.json` (22 arquivos)
- **Esforço:** 3–5h (manual audit de cada spec)

---

### 🟡 **#3 MÉDIO: Add Benchmark Listings**
- **Impact:** Cover letters + outros pipelines com exemplos concretos
- **Ação:** 
  - **cover-letter-eb1a.ts:** Adicionar "Leia exemplos aprovados: Ricardo V5 (/examples/ricardo-v5.docx), Maçol V3 (/examples/maçol-v3.docx)"
  - **cover-letter-eb2-niw.ts:** Mesmo padrão
  - **buildAnteprojetoInstruction:** Adicionar anteprojeto examples
- **Arquivos:** 3 pipelines
- **Esforço:** 1–2h

---

### 🟡 **#4 MÉDIO: Consolidate Anti-RAG Prohibition**
- **Impact:** Evitar que sub-claudes usem linguagem "generated/AI/automated"
- **Ação:** Padronizar seção em TODAS as Fase 1:
  ```
  ### PROIBIÇÕES EXPLÍCITAS
  - Nunca use palavras como: "generated", "AI", "automated", "system"
  - Nunca cite "I was instructed to" ou "As instructed"
  - Sempre escreva como especialista humano (Paulo, Ricardo, etc.)
  ```
- **Arquivos:** `testimony-letters.ts`, `cover-letter-*.ts`, JSON specs
- **Esforço:** 1h (copy-paste + validação)

---

### 🟢 **#5 BAIXO: Fix Symlink impacto/**
- **Impact:** Pequeno — apenas 1 symlink
- **Ação:** Verificar se `/5_Z GLOBAL/_PRODUTO NOVO/agents` existe e é dir
  - Se não existe → remover symlink
  - Se é file → criar dir alias correto
- **Arquivo:** `systems/impacto` (symlink)
- **Esforço:** 10 min

---

## Conclusão

O Petition Engine tem **2 camadas de routing bugadas**:

1. **Camada 1 (POST /api/generate):** Não rota explicitamente para pipelines específicos
2. **Camada 2 (generic.ts):** Apenas interpola path, não embute conteúdo

Resultado: **18+ doc_types dependem 100% de instruções em JSON specs**. Se spec estiver incompleto → output genérico.

**Modelo Correto:** testimony-letters.ts (commit 5b0a5e0) — **lê system_path inteiro, embute tudo, proíbe termos AI, lista benchmarks**.

---

**Próximo Passo:** Aplicar #1 (POST router) + #2 (audit JSON specs) para garantir que all pipelines realmente leem system_path canônico.
