# Diagnóstico de Falhas — Petition Engine
**Data:** 2026-04-19
**Fonte:** `data/generations.json` (84 gerações totais)

## Resumo executivo

| Métrica | Valor |
|---------|-------|
| Total de gerações | 84 |
| Completadas | 34 (40%) |
| **Falhadas** | **47 (56%)** |
| Bloqueadas por quality gate | 3 (4%) |

**Regressão detectada:** taxa de falha saltou de 38% em março para 60% em abril.

| Mês | Falhas / Total | Taxa |
|-----|----------------|------|
| 2026-03 | 6 / 16 | 38% |
| 2026-04 | 41 / 68 | 60% |

Algo introduzido em abril piorou significativamente a taxa de falha. Candidato: commit `06446f0` (15/abr — Phase 3 completion: tests, registry, transversal rules, dedup) introduziu mudanças no pipeline.

---

## Top-5 causas-raiz

### 1. Timeout / processos zumbis (53% — 25/47 falhas)

**Diagnóstico:** A função `runClaude()` em `src/lib/pipelines/base.ts:64` spawna `claude -p` **sem timeout nenhum**. Quando o processo trava (rede, tool-use em loop, prompt muito grande), fica pendurado indefinidamente até morrer por causa externa.

**Evidência:**
- Duração mediana de falhas: **411 minutos (6.8 h)**
- Duração máxima: **4.818 minutos (80 horas)**
- Duração mediana de sucessos: 25.5 min
- 7 gerações foram auto-killed pelo "cleanup sweep 2026-04-18" após >50h penduradas

**Fix recomendado (próxima sessão):** Adicionar timeout configurável no `spawn()` de `runClaude`, com default ~45min e kill via `SIGTERM` → `SIGKILL` após 30s. Código-alvo: `src/lib/pipelines/base.ts:71-78`.

### 2. Exit 0 sem documento criado (21% — 10/47)

**Diagnóstico:** Claude termina normal (exit 0) mas não cria arquivo. Causas conhecidas:
- Prompt genérico demais → Claude faz meta-análise em vez de gerar
- Instrução ambígua sobre output path
- Claude tenta gerar mas bate em erro silencioso e continua

**Fix recomendado:** Adicionar validação pós-geração — se exit 0 mas `findNewDocx()` vazio, reclassificar como `failed` com mensagem específica `"generation_silent_failure"` e capturar stdout tail pra análise.

### 3. Exit 1 — erro CLI (9% — 4/47)

Erro padrão do Claude Code CLI. Não há amostragem suficiente pra subagrupar.

### 4. Processo morto externamente (4% — 2/47)

"Servidor ou sessão foram fechados" — usuário fechou o terminal mid-geração. Baixa prioridade.

### 5. Quality gate blocked (não entra em `failed`, vira status próprio)

3 gerações bloqueadas pelo quality gate (critical violations) — status `quality_blocked`, não `failed`. Funcionando conforme desenhado.

---

## Sistemas mais problemáticos

| doc_type | Falhas / Total | Taxa |
|----------|----------------|------|
| **satellite_letter_eb1** | 4 / 4 | **100%** |
| cover_letter_eb1a | 3 / 4 | 75% |
| resume_eb2_niw | 11 / 16 | 69% |
| projeto_base_eb1a | 6 / 9 | 67% |
| saas_evidence | 5 / 8 | 62% |
| business_plan | 3 / 5 | 60% |
| cover_letter_eb2_niw | 2 / 4 | 50% |
| declaration_of_intentions | 1 / 2 | 50% |
| projeto_base_eb2_niw | 6 / 13 | 46% |
| resume_eb1a | 2 / 5 | 40% |
| anteprojeto_eb2_niw | 3 / 9 | 33% |
| methodology | 1 / 4 | 25% |

**Crítico:** `satellite_letter_eb1` está 100% quebrado. Toda geração falha. Requer investigação específica do pipeline — prompt, symlinks, paths.

**resume_eb2_niw** é o doc_type mais usado (16 tentativas) e tem 69% de falha. Provavelmente o maior ofensor em volume absoluto.

---

## Clientes com mais falhas recorrentes

| Cliente | Falhas |
|---------|--------|
| Thiago Fernandes dos Santos | 5 |
| Danielle Cecília Franco Maia | 4 |
| Rafaella Cristina Telles de Oliveira | 4 |
| Bruno da Silva Ucella | 4 |
| Camilla Santana Pereira Paes de Barros | 3 |
| Vitor GZ | 3 |

Clientes com 3+ falhas podem indicar problemas sistêmicos nas pastas deles: docs faltando, paths quebrados, evidências em formatos não esperados. Priorizar auditoria das pastas desses 6 clientes antes de retentar.

---

## Pipeline — estado de `fix_docx_formatting.py`

**Verificado:** `scripts/fix_docx_formatting.py` existe e é chamado em `src/app/api/generate/execute/route.ts:640` (Phase 1.8) com timeout 60s.

**Condição de execução:** `mainDocx.endsWith('.docx') && existsSync(FIX_FORMATTING_PATH)` — só roda se o output é DOCX.

**Conclusão:** Regra crítica (memória Paulo) está sendo respeitada. Anteprojetos/projetos-base em .md não passam por fix (correto — formatação Word não se aplica). Warning silencioso se falha.

---

## Recomendações priorizadas (próxima sessão)

| # | Ação | Impacto | Esforço |
|---|------|---------|---------|
| 1 | Adicionar timeout configurável em `runClaude()` | Elimina 53% das falhas (zumbis) | Baixo |
| 2 | Detectar "exit 0 silent failure" no pipeline | Elimina 21% das falhas | Baixo |
| 3 | Investigar `satellite_letter_eb1` (100% falha) | Desbloqueia doc_type crítico | Médio |
| 4 | Debug `resume_eb2_niw` (69% falha, volume alto) | Melhora fluxo principal | Médio |
| 5 | Bisect `main` entre `06446f0` (Phase 3) e HEAD | Identifica regressão de abril | Médio |
| 6 | Auditar pastas de Thiago, Danielle, Rafaella, Bruno | Reduz falhas por caso quebrado | Baixo |

## Arquivos relacionados

- `src/lib/pipelines/base.ts:64` — `runClaude()` (fix do timeout)
- `src/app/api/generate/execute/route.ts:388` — primeira chamada runClaude na geração
- `src/app/api/generate/execute/route.ts:640-653` — FIX DOCX FORMATTING (ok)
- `data/generations.json` — fonte desta análise
- `data/error_rules.json.bak.2026-04-19` — backup pré-migração (Fase 3)
- `data/clients.json.bak.2026-04-19` — backup pré-fix de paths

---

## Update — fixes aplicados nesta mesma sessão (pós-relatório)

### Fix 1 — Timeout em `runClaude()` — APLICADO
`src/lib/pipelines/base.ts:64-158`. Agora `runClaude` aceita `{ timeoutMs, idleTimeoutMs }` via 5º parâmetro opcional.
Defaults: hard 45min, idle 10min. SIGTERM → 30s → SIGKILL. Exporta `RUN_CLAUDE_DEFAULT_TIMEOUT_MS`/`_IDLE_MS`.
Resultado inclui `timedOut: boolean` e `timeoutKind: 'hard' | 'idle'`. 5 novos testes cobrindo os cenários (33/33 passam).

### Fix 2 — Detecção de silent failure integrada com timeout — APLICADO
`src/app/api/generate/execute/route.ts:403-500`. Agora:
- Consolida dirs de busca em `allSearchDirs` (outputDir, clientBaseDir, _Forjado, docs_folder_path) para success E failure paths
- Quando `gen.timedOut`, error_message vira `Timeout ${timeoutKind} (${duration}s) — processo morto` (não mais genérico)
- Persiste `stdout_tail`, `stderr_tail`, `timed_out`, `timeout_kind`, `dirs_checked` no `generations.json` para debug histórico
- `error_message` novo: `silent_failure_exit_0_no_docx` (categorizável)

### Fix 3 — `findNewDocx` recursivo — APLICADO
`src/lib/pipelines/base.ts:100-142`. Agora busca até 4 níveis de profundidade, skip de `node_modules/.git/.next/dist/build/__pycache__/venv/.venv/.cache/.pytest_cache`.
**Root cause confirmado:** `satellite_letter_eb1` falhou 100% porque Claude cria subpasta `CARTAS/` com 13 DOCXes e a versão anterior de `findNewDocx` só olhava a raiz. 6 novos testes cobrindo recursão e skip de noise dirs.

### Fix 4 — Bisect da "regressão" — CONCLUÍDO (não é regressão de código)
Correlação entre commits de abril (06446f0..b34336c) e falhas mostra que **não há commit culpado**. As 10 falhas de `resume_eb2_niw` em abril são **11/11 timeout** — mesma raiz que o Fix 1.
A percepção de "regressão 38%→60%" é efeito de amostra pequena em março (16 gens) vs abril (68 gens) expondo mais vezes o bug de timeout pré-existente. Com Fix 1 em produção, a taxa deve cair drasticamente sem precisar reverter commit algum.

## Impacto projetado dos fixes

| Fix | Categoria de falha atacada | Falhas no histórico |
|-----|----------------------------|---------------------|
| 1 (timeout) | `timeout` + zumbis >1h | 25/47 (53%) |
| 2 (silent + timeout info) | `silent_failure_exit_0_no_docx` | 10/47 (21%) |
| 3 (findNewDocx recursive) | subpasta não vista | ≥1 confirmado (Thiago), possivelmente mais |
| 4 (bisect) | nenhum — investigação | — |

**Cobertura combinada estimada:** ~75% das falhas históricas terão causa raiz eliminada. Taxa atual de 56% deve cair para 15-25% no próximo ciclo de gerações.

---

*Relatório gerado 2026-04-19 em sessão de recuperação após queda de conversa. Atualizado no mesmo dia com fixes aplicados.*
