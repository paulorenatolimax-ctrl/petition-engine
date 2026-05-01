# Auditoria de Persistência — Regressão 363→13

## Sumário Executivo

**Por que regride de 363 para 13?** O sistema tem **armazenamento persistente ROBUSTO** (211 regras em error_rules.json, 8 master_facts, personas, hard_blocks), mas **falha CRÍTICA no consumidor final**: `claude -p` (invocações locais do Claude) **NUNCA acessa error_rules.json**. A regra é escrita em disco/Supabase, mas o prompt de geração (`systems/pipelines/*.json`) é **estático** e não injeta as regras ativas. Resultado: cada nova sessão/geração é stateless — um novo `claude -p` não conhece as 210 regras que bloqueiam regressão.

---

## Inventário Completo de Memória

| Arquivo | Path | Tamanho | Modificado | Armazen. | Consumidor | Problema |
|---------|------|---------|------------|----------|-----------|----------|
| error_rules.json | `data/` | 120KB | Apr 30 23:03 | **ATIVO** | `buildRulesSection()` em `src/lib/rules/repository.ts` | ❌ **INJETO EM PROMPT MAS STATIC** |
| persona_bank.json | `data/` | 27KB | Apr 30 21:59 | **ATIVO** | `src/lib/pipelines/testimony-letters.ts` + `persona-bank.ts` | ✅ Lido por pipeline |
| master_facts/{case}.json | `data/master_facts/` | ~5KB x 8 | Apr 30 | **ATIVO** | `getMasterFacts()` + `checkAnchorsPresence()` | ✅ Injetado em `generic.ts` |
| hard_blocks/{case}.json | `data/hard_blocks/` | ~2KB x 4 | Apr 19 | **ATIVO** | `scanHardBlocks()` em `hard-blocks.ts` | ✅ Validação post-geração |
| clients.json | `data/` | 17KB | Apr 29 15:20 | **ATIVO** | `/api/` routes (dashboard, generate, etc) | ✅ Lido por API |
| systems.json | `data/` | 9.4KB | Apr 26 15:25 | **ATIVO** | Routes + pipelines (referência de systems) | ✅ Carregado |
| generations.json | `data/` | 307KB | Apr 30 23:53 | **ATIVO** | Dashboard + stats routes | ✅ Append-only log |
| regulated_professions_us.json | `data/` | 11KB | Apr 28 10:28 | **ATIVO** | Validators (anti-ATLAS, etc) | ✅ Validação |

**Total de estado persistente:** ~500KB. **Integridade:** Arquivos existem, são lidos, são escritos.

---

## Conexões Mortas — O Problema Central

### 1. error_rules.json: Escrito mas não Injetado

```
ESCRITA:
  ✅ auto-debugger-local.ts → quando Quality Gate detecta erro, adiciona regra em error_rules.json
  ✅ Timestamp: Apr 30 23:03 (regras RECENTES sendo criadas)
  ✅ 211 regras, 210 ativas — arquivo ESTÁ SENDO ALIMENTADO

MAS:
  ❌ claude -p NO RECEBE error_rules.json no prompt
  ❌ src/lib/rules/repository.ts::buildRulesSection() EXISTE e formata as regras
  ❌ MAS: Quando é chamado? Só em quality-local.ts (POST-geração para VALIDAR)
  
FLUXO REAL:
  1. Geração começa → claude -p chamado com systems/{pipeline}.json
  2. systems/{pipeline}.json é ESTÁTICO (não injecta regras)
  3. claude -p gera doc (sem conhecimento de 210 regras)
  4. Quality-local.ts roda buildRulesSection() e VALIDA documento ✓ (bloqueia se violar)
  5. Se violar → auto-debugger-local.ts ESCREVE nova regra ✓
  6. MAS: Próxima geração do MESMO cliente, novo claude -p again → VOLTA ao step 1
```

**Prova:** Grep em `systems/pipelines/` mostra que nenhum prompt JSON injeta `error_rules.json`:

```bash
grep -r "error_rules\|buildRulesSection" systems/ 2>/dev/null
# Retorna: NADA
```

---

### 2. Master_Facts + Hard_Blocks: Injetados sim, MAS Apenas se caseId Resolvido

```
generic.ts (linha ~50-80):
  - Injeta hard_blocks + master_facts quando caseId é passado
  - MAS: Qual pipeline PASSA caseId?
  
Route evidence:
  src/app/api/generate/execute/route.ts:
    // Resolve caseId so generic pipeline can inject hard_blocks + master_facts.
```

**Questão:** Se user não especifica `case_id`, ou se é geração de documento SEM cliente específico (ex: BP genérico), então caseId = null e hard_blocks/master_facts NÃO são injetados.

---

### 3. Claude -p: Invocação Stateless

```typescript
// src/app/api/generate/route.ts
const claudeCommand = `claude -p "Leia ${promptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep`;
```

**Problema:** Cada `claude -p` é:
- Uma sessão **INDEPENDENTE** (sem acesso a memory do claudemai anterior)
- Recebe APENAS o arquivo de prompt específico (ex: `phases/phase_1_cover_letter.txt`)
- Esse arquivo é **GERADO DINAMICAMENTE** em cada pipeline phase, mas **não injeta error_rules**

---

## Continuity Files — Funcionam Parcialmente

### STATE.md
- **Atualizado:** Apr 30 23:04 (post-commit hook? Conferir abaixo)
- **Contém:** Contadores (regras: 210, systems: 22, clientes: 39, personas: 23)
- **Consumidor:** Humano manual (Paulo lê) + WAKE_UP.md instrui novo Claude a ler
- **Problema:** ❌ **Não é consultado automaticamente por nenhuma geração. Apenas humano.**

### STEPLOG.md
- **Atualizado:** Apr 30 23:04
- **Últimas entradas:** Datadas de Apr 19 (10+ dias atrás!)
- **Problema:** ❌ **STALE. Não reflete gerações recentes de Apr 29-30.**

### WAKE_UP.md
- **Instrua:** Claude novo deve ler 4 arquivos (CLAUDE.md, STATE.md, STEPLOG.md, handoff)
- **Problema:** ❌ **Executado manualmente. Não há hook que force novo Claude a seguir.**

---

## Comparação com AIOS Principles

| Princípio AIOS | Petition Engine | Status |
|---|---|---|
| **Persistent Memory** | error_rules.json + master_facts | ✅ Arquivo existe |
| **...Acumulação Entre Sessões** | Regras acumulam em disco | ❌ **Não consumidas por new claude -p** |
| **Tool Registry** | agent-kernel.ts (agent invocations) | ✅ Existe |
| **Self-Improvement Loop** | auto-debugger-local.ts | ⚠️ Escreve regra, but ciclo quebrado |
| **Sandbox Isolada** | Cada `claude -p` é stateless | ✅ Correto design |
| **Bootstrap na Sandbox** | Prompt injecta contexto? | ❌ **NÃO injeta regras ativas** |

---

## 5 Hipóteses de Regressão 363→13

### Hipótese (a): Cada `claude -p` é Stateless
**Status:** ✅ **CONFIRMADA**
- claude -p subprocesso não tem acesso a memory anterior
- Cada invocação é sessão independent
- Evidência: src/lib/pipelines/generic.ts L~90

### Hipótese (b): Pipelines NÃO Injetam Regras Ativas no Prompt
**Status:** ✅ **CONFIRMADA — CRÍTICO**
- `systems/pipelines/*.json` é estático
- `buildRulesSection()` existe mas NÃO é chamado em pre-generation
- Evidência: Grep no `src/app/api/generate/execute/route.ts` mostra buildRulesSection() NUNCA chamado

### Hipótese (c): Auto-Debugger Cria Regra, MAS Ciclo Quebrado
**Status:** ✅ **CONFIRMADA**
- auto-debugger-local.ts escreve em error_rules.json ✓
- Quality-local.ts valida usando buildRulesSection() ✓
- MAS: Próxima geração não injeta essas regras no prompt
- Ciclo fecha parcialmente (bloqueia regressão dentro MESMA sessão) but quebra entre sessões

### Hipótese (d): Memory Humano vs error_rules Conflitante
**Status:** ❌ **Improvável**
- Claude memory (`.claude/projects/.../memory/MEMORY.md`) é separado
- Não interfere com error_rules.json

### Hipótese (e): STATE.md / STEPLOG Stale Entre Commits
**Status:** ✅ **CONFIRMADA**
- STEPLOG última entrada: Apr 19 (10+ dias ago)
- Gerações recentes (Apr 29-30) NÃO foram registradas
- Novo Claude não sabe onde parou

---

## TOP 3 Fixes para Fechar o Ciclo

### FIX 1: Injete error_rules.json no Prompt PRÉ-GERAÇÃO [CRÍTICO]

**Onde:** `src/app/api/generate/execute/route.ts` ou `src/lib/pipelines/generic.ts`

**O que fazer:**
```typescript
// ANTES de chamar runClaude(), injete:
const activeRules = readActiveRules(); // Já existe em repository.ts
const rulesSection = buildRulesSection(docType); // Já existe
const promptWithRules = promptContent + "\n\n## REGRAS CRÍTICAS APRENDIDAS\n" + rulesSection;
// Passe promptWithRules para claude -p
```

**Impacto:** Cada nova sessão/cliente herda as 210 regras. Regressão 363→13 vira 363→362→363.

---

### FIX 2: Auto-Update STEPLOG com Cada Geração [MÉDIO]

**Onde:** `src/agents/auto-debugger-local.ts` ou pipeline end-hook

**O que fazer:**
```typescript
// Quando geração termina (success ou failure):
appendToSteplog({
  timestamp: new Date().toISOString(),
  gen_id: genId,
  case_id: caseId,
  doc_type: docType,
  status: "complete" | "failed",
  rules_created: newRuleCount,
  rules_active: totalActiveRules,
});
```

**Impacto:** STEPLOG reflete realidade. Novo Claude sabe onde Paulo parou (último step, não step de 10 dias atrás).

---

### FIX 3: Hook PRÉ-GERAÇÃO: Checa WAKE_UP [BAIXO ESFORÇO]

**Onde:** `src/app/api/generate/route.ts` (início)

**O que fazer:**
```typescript
// Se é primeira geração de uma NOVA sessão (ou 24h+ passaram):
if (isNewSession()) {
  const wakeUpMsg = readWakeUpPrompt();
  // Prepend ao prompt inicial
  prompt = wakeUpMsg + prompt;
}
```

**Impacto:** Garante que até mesmo novo claude -p tem contexto de CONTINUITY.

---

## Evidências Técnicas Citadas

1. **error_rules.json:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/data/error_rules.json` (211 regras, 2761 linhas, Apr 30 23:03 modificado)

2. **buildRulesSection():** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/lib/rules/repository.ts` — existe, formata regras, NUNCA chamado pre-generation

3. **Generic Pipeline Injection:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/lib/pipelines/generic.ts` — injecta hard_blocks/master_facts quando caseId presente, MAS NÃO error_rules

4. **Auto-Debugger Write:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/agents/auto-debugger-local.ts` — escreve regra em error_rules.json com writeFileSync()

5. **Quality-Local Validate:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/agents/quality-local.ts` — lê rules via buildRulesSection() e bloqueia violações

6. **Claude -p Invocation:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/src/app/api/generate/route.ts` — execSync("claude -p ...") com prompt estático, sem error_rules injecção

7. **STEPLOG Stale:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/docs/CONTINUITY/STEPLOG.md` — última entrada Apr 19, gerações Apr 29-30 não registradas

---

## Conclusão

**Raiz da regressão 363→13:** Separação entre escrita (auto-debugger escreve regra) e leitura (claude -p não a recebe). O sistema **aprende** (FIX 1 melhora para FIX 2+3), mas o aprendizado é **armazenado** (error_rules.json cresce), mas **nunca consumido** no pré-geração.

Implementar FIX 1 é **suficiente** para fecha ciclo. FIX 2+3 melhoram contexto humano.

**Metáfora:** Sistema é um aluno que estuda (cria regras), passa provas (bloqueia violações), MAS no dia seguinte esquece tudo porque ninguém releu as regras para ele. Precisa de **injecção diária** (FIX 1) para reter conhecimento.
