# AUDITORIA: Por que o Sistema de Qualidade NUNCA Acumula

## Sumário Executivo

O sistema foi **projetado para acumular**, mas **está completamente órfão**. De 211 regras em `error_rules.json`:
- **0% criadas pelo auto-debugger-local** — nenhuma regra foi gerada automaticamente desde a implementação
- **100% criadas manualmente** — todas as 211 regras foram inseridas por humanos (Paulo, técnicos, feedback de clientes)
- **92% nunca foram acionadas** (194 de 211 com times_triggered = 0)

O loop desenhado no `execute/route.ts` fase 1.55 (AutoDebugger) **existe no código mas nunca produz efeito observável**. Cada geração que falha não vira regra. Cada erro é descoberto, mas não é persistido. O sistema regride porque **não há feedback automático que feche o ciclo**.

---

## I. Loop Intended vs Real

### Fluxo Desenhado (PRETENDIDO)

```
GERAÇÃO (execute/route.ts)
    ↓
PHASE 1.5: Quality Gate (runQualityLocal)
    ├─ Lê error_rules.json (regras ativas)
    ├─ Valida documentText contra padrões
    └─ Retorna: score, passed, violations[]
    ↓
PHASE 1.55: AutoDebugger (reportBatch)
    ├─ Se violations.length > 0
    ├─ Filtra violations que NÃO vêm de r* (já em error_rules)
    ├─ Cria ErrorSignal para cada violação nova
    └─ Salva nova regra em error_rules.json com source='auto_debugger'
    ↓
PRÓXIMA GERAÇÃO
    ├─ buildRulesSection() lê error_rules.json (INCLUINDO novas)
    ├─ Injeta regras no prompt do writer
    └─ Writer EVITA o erro descoberto antes
    ↓
SOBE DE NÍVEL (362 → 363 → 364...)
```

### Fluxo Real (OBSERVADO)

```
GERAÇÃO (execute/route.ts)
    ↓
PHASE 1.5: Quality Gate (runQualityLocal) — FUNCIONA ✓
    ├─ Lê error_rules.json
    ├─ Valida documentText
    └─ Retorna violations[] com IDs de regras
    ↓
PHASE 1.55: AutoDebugger (reportBatch) — EXECUTADO ✓
    ├─ Verifica violations.length > 0
    ├─ Filtra violations que não começam com 'r'
    └─ Chama reportBatch(signals)
    ↓
    ❌ NENHUMA REGRA É PERSISTIDA
    └─ Error signals desaparecem; error_rules.json não muda
    ↓
PRÓXIMA GERAÇÃO
    ├─ buildRulesSection() lê error_rules.json (IDEM)
    ├─ MESMAS regras antigas + NENHUMA nova
    └─ Writer ignora erro anterior (não está em rules)
    ↓
REGRIDE (362 → 360 → 13) OU ESTACIONA NO MESMO ERRO
```

---

## II. Disparos de Quality — Automáticos ou Manuais?

### Quality É OBRIGATÓRIO na Pipeline

**Arquivo:** `src/app/api/generate/execute/route.ts:PHASE 1.5`

A Quality Gate roda **automaticamente** em TODA geração:
1. Palavra-chave `PHASE_1.5` é disparo automático
2. Não depende de ação manual em `/qualidade`
3. Toda geração que entra em `execute/route.ts` passa por Quality

### Quality É TAMBÉM Acessível Manualmente

- **URL:** `GET /api/quality/validate` (remoto via Claude API)
- **URL:** `GET /api/quality/validate-local` (local via quality-local.ts)
- **UI:** `http://localhost:3000/qualidade` (página React que mostra stats)

**Conclusão:** Quality é executado 2 vezes:
1. **Automático** durante geração (PHASE 1.5) ✓ FUNCIONA
2. **Manual** via UI `/qualidade` (dashboard read-only, sem ação)

---

## III. Auto-Debugger — Vivo ou Órfão?

### ACHADO CRÍTICO: AutoDebugger está COMPLETAMENTE ÓRFÃO

**Evidência #1: Zero Regras Criadas**
```
error_rules.json — Análise de 211 regras
  Auto-Debugger: 0 regras (0%)
  Manual/Humano: 211 regras (100%)
    - paulo_feedback: 31
    - retrospectiva_ricardo_cowork_2026-04-19: 23
    - anteprojeto V2 travas (Márcio Elias): 17
    - quality_calibration: 10
    - (mais 37 fontes manuais)
```

**Evidência #2: Código Existe, Lógica Simples**

Arquivo: `src/agents/auto-debugger-local.ts` (147 linhas)
- Função `reportBatch(signals)` percorre ErrorSignal[]
- Para cada sinal, chama `createRule()`
- `createRule()` faz escrever em disco com `writeRules(rules)`

**Evidência #3: Chamada é Executada (em PHASE 1.55)**

Arquivo: `src/app/api/generate/execute/route.ts:1520+`

O código para chamar reportBatch existe e está no pipeline.

**MAS:** Não há nenhuma regra com `source: 'auto_debugger'` em error_rules.json.

**Hipótese mais provável:**
- `reportBatch` é chamado
- Dentro, `report()` executa lógica para cada sinal
- **Alguma falha silenciosa** impede que `writeRules()` ou o push em rules[] funcione
- Ou a chamada é filtrada (signals.length === 0 porque todas violações começam com 'r')

---

## IV. Memory Cross-Session — Existe ou Não?

### Sim, Memory Existe. NÃO é o Problema.

Arquivo: `src/lib/rules/repository.ts`
```typescript
export function readAllRules(): ErrorRule[] {
  try {
    if (!existsSync(RULES_FILE)) return [];
    return JSON.parse(readFileSync(RULES_FILE, 'utf-8'));  // Leitura a cada geração
  } catch {
    return [];
  }
}
```

**Como funciona:**
1. Toda geração que entra em `/api/generate` chama `buildRulesSection(doc_type)`
2. `buildRulesSection` lê `error_rules.json` DO DISCO (não cache em memória)
3. Se uma regra nova foi escrita em error_rules.json, ela será lida na próxima chamada

**Conclusão:** Memory cross-session funciona se o AutoDebugger ESCREVER a regra. Como não escreve, não há efeito.

---

## V. UI /qualidade — O que faz, O que NÃO faz

### /qualidade/page.tsx — Dashboard Read-Only

**URL:** `http://localhost:3000/qualidade`

**O que mostra:**
- Total de documentos validados
- % Passou vs Falhou
- Score médio
- Breakdown por doc_type
- Gráficos de barras (% de aprovação por tipo)

**O que NÃO faz:**
- ❌ Não cria regras novas
- ❌ Não edita regras existentes
- ❌ Não dispara ações de remediação
- ❌ Não tem botão "Criar Regra" ou "Aceitar Violação"
- ❌ Não mostra histórico temporal de melhoria
- ❌ Não permite "aprovar" erros detectados para transformá-los em regra

**Endpoints chamados:**
- `GET /api/quality/stats` — retorna agregados

**Conclusão:** UI `/qualidade` é **observatório, não painel de comando**. Não há mecanismo pra converter violação em regra via clique.

---

## VI. 5 Hipóteses da Regressão 362→13 — Com Evidência

### Hipótese A: AutoDebugger é Completamente Silencioso

**Status:** ✓ CONFIRMADO

**Evidência:**
- 0 regras com source 'auto_debugger' em 211 total
- `auto-debugger-local.ts` tem try/catch que swallows errors em execute/route.ts
- Nenhum log forçado de nova regra criada

**Impacto:** CRÍTICO — todo aprendizado automático é nulo.

---

### Hipótese B: Violations Estão Sendo Filtradas (v.rule.startsWith('r'))

**Status:** ⚠️ POSSÍVEL (parcial)

**Evidência:**
```typescript
// Em execute/route.ts PHASE 1.55:
const signals = qualityResult.violations
  .filter(v => !v.rule.startsWith('r'))  // Ignora violations já mapeadas a regras
  .map(...);
```

Se a Quality local detecta uma violação E essa violação **já está** em error_rules.json (com id 'r*'), a violação é filtrada. AutoDebugger nunca vê ela.

**Problema:** Se uma regra ANTIGA foi criada manualmente mas tem vez_triggered alta, uma nova violação similar seria ignorada.

**Impacto:** MÉDIO — limita aprendizado de variações de erros conhecidos.

---

### Hipótese C: error_rules.json Não É Consultado Antes da Geração

**Status:** ❌ REFUTADO

**Evidência:**
- `buildRulesSection()` é chamado em `/api/generate/route.ts` antes do prompt
- Lê o arquivo COM `readFileSync` (I/O real, não cache)
- Injeta regras ativas no prompt

**Impacto:** NÃO APLICÁVEL — this part works.

---

### Hipótese D: Regras Criadas Estão Inativas (active: false)

**Status:** ❌ REFUTADO

**Evidência:**
```typescript
// Em auto-debugger-local.ts createRule():
const rule: ClassifiedRule = {
  // ...
  active: true,  // Sempre ativado
  // ...
};
```

**Impacto:** NÃO APLICÁVEL — regras são ativadas.

---

### Hipótese E: Sistema Usa Um Snapshot Antigo de error_rules.json

**Status:** ❌ REFUTADO (mas há um detalhe)

**Evidência:**
- `readAllRules()` usa `readFileSync(RULES_FILE)` — leitura do disco, não cache
- Cada `/api/generate` é uma nova chamada, novo readAllRules()

**Detalhe:** Há uma cópia local de `buildRulesSection` em `/generate/route.ts` que relê o arquivo. Sequência entre `/generate/route.ts` e `/generate/execute/route.ts` pode causar race condition.

**Impacto:** BAIXO — ambos lêem do disco, mas sequência pode causar inconsistência.

---

## RAIZ: Onde Exatamente Quebra o Loop

### Checkpoint 1: Quality Detects Violation ✓

Quality identifica erros. Status: **FUNCIONA**

### Checkpoint 2: Violations São Processadas ✓

Violations são montadas em signals. Status: **FUNCIONA**

**MAS:** Se signals.length === 0 (porque todos os violation IDs começam com 'r'), reportBatch nunca é acionado.

### Checkpoint 3: reportBatch() Escreve em Disco ❓

Código existe para escrever. Status: **DESCONHECIDO — NUNCA PRODUZIU EFEITO**

**Conclusão:** Ou reportBatch nunca é chamado (signals.length === 0) OU há uma falha silenciosa dentro de report() que causa uma regra a não ser adicionada a rules[].

---

## VII. TOP 3 Fixes pra Fechar o Loop

### FIX #1: Forçar Logs / Debugging em AutoDebugger (URGENTE)

**Arquivo:** `src/agents/auto-debugger-local.ts`

Adicionar logs estruturados em:
- Entrada de `reportBatch()` com `signals.length`
- Cada iteração de `report()` com ação tomada
- Saída de `writeRules()` com confirmação de disco

**Resultado esperado:** Ver em logs do servidor qual é o bloqueio real.

---

### FIX #2: Separar Violações "Já em Rules" de "Novas"

**Arquivo:** `src/app/api/generate/execute/route.ts` (PHASE 1.55)

**Problema:** Filtro `v.rule.startsWith('r')` é muito simples. Violations têm formato `"Termo proibido 'X'"`, não `"r123"`.

**Resultado esperado:** Violações realmente novas são capturadas; não há double-filtering.

---

### FIX #3: Dashboard /qualidade com "Aceitar Violação → Criar Regra"

**Arquivo:** `src/app/qualidade/page.tsx` + novo `/api/quality/accept-violation/route.ts`

Adicionar botão para converter violação detectada em regra nova via UI.

**Resultado esperado:** Operador pode ver violação no dashboard e transformá-la em regra com 1 clique, sem editar JSON.

---

## CONCLUSÃO

**O sistema NÃO acumula porque:**

1. **AutoDebugger é órfão** — 0 de 211 regras vieram dele
2. **Loop está desenhado** — mas não produz efeito observável (falha silenciosa)
3. **UI é read-only** — não há interface pra converter violação → regra
4. **Logging é opaco** — não há visibilidade de por que reportBatch falha

**Referência de código crítica:**
- `src/agents/auto-debugger-local.ts` — onde rule seria criada (MAS NÃO ESTÁ)
- `src/app/api/generate/execute/route.ts:PHASE_1.55` — onde reportBatch é chamado (MAS SIGNALS PODEM SER 0)
- `src/app/qualidade/page.tsx` — dashboard que observa mas não age

**Próximos passos:**
1. Adicionar logs em auto-debugger-local.ts + execute/route.ts
2. Verificar se signals.length é sempre 0 (violações já mapeadas?)
3. Se sim, refinar filtro de "violations já em rules"
4. Se não, investigar dentro report() por que rule não é adicionada a rules[]
5. Considerar botão em /qualidade pra forçar criação de regra manual
