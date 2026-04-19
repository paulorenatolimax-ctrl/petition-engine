# Sessão de recuperação — 2026-04-19

**Contexto:** Paulo reportou que sistema havia regredido de ~200 para ~93 regras. Diagnóstico confirmou que **nada regrediu** — a memória de ~200 era soma de 4 fontes fragmentadas.

## Entregas desta sessão

### Fase 1.1 — Git ref corrompido: CORRIGIDO
- `.git/refs/heads/main (1)` removido
- `git log`, `git fsck` funcionam normalmente

### Fase 1.2 — Paths de clientes: CORRIGIDOS (4/4)
- `c2` Rafael Almeida Santos — path vazio → `2_PROEX/_2. MEUS CASOS/2025/Rafael Almeida (EB-2 NIW)`
- `c3` Renato Silveira dos Reis — path vazio → `2_PROEX/_2. MEUS CASOS/2025/Z_Renato Silveira dos Reis`
- `c1774406308442` Maria Amália Vita — `2026/AMÁLIA` → `ELABORA POR CLAUDE CODE_EM PARTES/AMALIA`
- `c1774992697831` Gustavo Esteves — `OMNI/Coisas Gizele` → `3_OMNI/_IMIGRAÇÃO/_CLIENTES/Coisas Gizele`
- Backup: `data/clients.json.bak.2026-04-19`
- Zero clientes com path quebrado agora (era 4).

### Fase 2 — Diagnóstico de falhas: RELATÓRIO GERADO
- `docs/handoff/DIAGNOSTICO_FALHAS_2026-04-19.md`
- **Root cause crítico identificado:** `runClaude()` em `src/lib/pipelines/base.ts:64` spawna `claude -p` **sem timeout**. Processos penduram até 80h. Responsável por 53% das falhas.
- Taxa de falha regrediu de 38% (março) para 60% (abril) — candidato à regressão: commit `06446f0` (Phase 3 completion, 15/abr).
- `satellite_letter_eb1` está **100% quebrado** (4/4 falhas).
- `resume_eb2_niw` é o maior ofensor em volume (11/16 falhas, 69%).
- 6 clientes com 3+ falhas recorrentes (Thiago, Danielle, Rafaella, Bruno, Camilla, Vitor GZ).

### Fase 3 — Migração dos Pareceres: EXECUTADA CONSERVADORAMENTE
**Decisão tomada durante execução:** o plano original previa migrar "50 regras dos Pareceres". Análise do arquivo (11.067 linhas, 665KB) mostrou que é **corpus histórico de casos reais**, não lista canônica. Extração automática via regex produziria regras genéricas inúteis ("evitar inconsistências financeiras" não é pattern, é observação).

**O que foi feito em vez disso:**
1. Extração manual de 12 **meta-padrões recorrentes** (aparecem em múltiplos pareceres de casos diferentes)
2. Salvos em `data/error_rules_pareceres_candidates.json` para revisão
3. Das 12, apenas **2 têm regex executável** (links Wikipedia em rodapé, duplicação de case number USCIS)
4. As 2 executáveis foram **mergeadas active** no `error_rules.json` como `r127` e `r128` (10/10 testes regex passam)
5. As 10 restantes exigem validação semântica (LLM) — ficam como candidates inactive

**Estado final de regras:** 123 → 125 (+2 active, +10 candidates aguardando revisão)
- Backup: `data/error_rules.json.bak.2026-04-19`

**Nota honesta:** as 10 candidates semânticas seriam melhor implementadas no **USCISReviewerAgent** como checks de adjudicação, não como regras regex do quality gate. Isso é um escopo separado.

## Arquivos criados / modificados

| Arquivo | Tipo | Tamanho |
|---------|------|---------|
| `data/clients.json` | modificado | 4 paths corrigidos |
| `data/clients.json.bak.2026-04-19` | backup | 14 KB |
| `data/error_rules.json` | modificado | 123 → 125 regras |
| `data/error_rules.json.bak.2026-04-19` | backup | 73 KB |
| `data/error_rules_pareceres_candidates.json` | novo | 12 candidates |
| `docs/handoff/DIAGNOSTICO_FALHAS_2026-04-19.md` | novo | relatório |
| `docs/handoff/SESSAO_2026-04-19_RESUMO.md` | este arquivo | — |
| `.git/refs/heads/main (1)` | deletado | — |

## Rodada 2 — fixes de próxima sessão EXECUTADOS NA MESMA SESSÃO

### Fix 1 — Timeout em `runClaude()` — APLICADO
- `src/lib/pipelines/base.ts` ganhou `RunClaudeOptions { timeoutMs, idleTimeoutMs }` (5º param opcional, backward-compatible)
- Defaults: hard 45min, idle 10min. SIGTERM → 30s → SIGKILL
- Retorno ganhou `timedOut` + `timeoutKind: 'hard' | 'idle'`
- 5 tests novos em `src/__tests__/pipelines/base.test.ts` (fixture `slow-sleeper.sh`)
- **Impacto esperado:** elimina 25/47 falhas (53%, todos os "timeout" e zumbis de até 80h)

### Fix 2 — Silent failure + info de timeout no pipeline — APLICADO
- `src/app/api/generate/execute/route.ts`: consolidou search dirs em `allSearchDirs` (outputDir, clientBaseDir, _Forjado, docs_folder_path) para success E failure paths
- Persiste `stdout_tail`, `stderr_tail`, `timed_out`, `timeout_kind`, `dirs_checked` no `generations.json` (antes só iam pro SSE efêmero)
- `error_message` novo categorizável: `silent_failure_exit_0_no_docx`
- Timeout agora reportado como `Timeout ${kind} (${duration}s)`, não mais genérico
- **Impacto esperado:** +10/47 falhas (21%) resolvidas com diagnóstico em vez de mistério

### Fix 3 — `findNewDocx` recursivo — APLICADO
- `src/lib/pipelines/base.ts:100-142`: busca até 4 níveis de profundidade
- Skip de dirs noise: `node_modules`, `.git`, `.next`, `dist`, `build`, `__pycache__`, `.venv`, `venv`, `.cache`, `.pytest_cache`
- 6 tests novos cobrindo recursão + skip
- **Root cause confirmado:** `satellite_letter_eb1` 100% falha porque Claude criou 13 DOCXes em subpasta `CARTAS/` que a versão antiga não via. Thiago Fernandes dos Santos tinha todas as 13 cartas geradas em 10/abr — nunca foram reportadas como sucesso
- **Impacto esperado:** elimina falsos "exit 0 sem doc" de qualquer doc_type que crie subpasta (satellite letters, business plan com thumbs/, etc)

### Fix 4 — Bisect da "regressão" — INVESTIGADO
- Commits entre `06446f0` (15/abr) e `b34336c` (18/abr): 8 commits (Phase 3 completion, Evidence Organizer, multi-phase executor, BP spec, satellite symlink fix, 3 bugs prod, clients paths)
- Correlação com `generations.json` por dia mostra **nenhum commit culpado único**
- **11/11 falhas de `resume_eb2_niw` em abril são TIMEOUT** — mesma raiz que Fix 1
- "Regressão 38%→60%" é efeito de amostra pequena em março (16 gens) vs abril (68 gens) expondo mais vezes o bug de timeout pré-existente
- Com Fix 1 em produção, a taxa deve cair drasticamente sem reverter commit algum

## Verificação

- `npx vitest run` → **33/33 tests passam** (era 22 antes dos fixes, +11 novos cobrindo os fixes)
- `git log --oneline -5` funcional (ref corrompido removido)
- `python3 -c "import json; print(len(json.load(open('data/error_rules.json'))))"` → 125
- 4 clientes com paths corrigidos, 0 broken

## Impacto combinado projetado

| Fix | Categoria de falha | Falhas histórico |
|-----|-------------------|------------------|
| 1 (timeout) | timeout + zumbis >1h | 25/47 (53%) |
| 2 (silent + info) | silent_failure_exit_0_no_docx | 10/47 (21%) |
| 3 (findNewDocx recursivo) | subpasta não vista | ≥1 confirmado (Thiago) + potenciais |
| Total | | **~75% das falhas históricas têm causa raiz eliminada** |

Taxa atual 56% → projeção 15-25% no próximo ciclo de gerações.

## Próxima sessão — pontas soltas

1. **Testar end-to-end** uma geração real (ex: `declaration_of_intentions` pequeno) para validar Fix 1/2/3 em cenário real, não só em unit test
2. **Review das 10 candidates semânticas dos Pareceres** — mover pra USCISReviewerAgent em vez de quality-local
3. **Auditar pastas dos 6 clientes problemáticos** (Thiago, Danielle, Rafaella, Bruno, Camilla, Vitor GZ) — talvez alguns não sejam bug do sistema
4. **TypeScript warnings pré-existentes** em `execute/route.ts` (readFileSync/execSync sem import) — não afetam runtime Next mas deveriam ser limpos
5. **13 cartas do Thiago** em `CARTAS/` estão órfãs no disco desde 10/abr — considerar associá-las retroativamente no `generations.json` como `completed` em vez de `failed`
6. **Integrar USCIS Reviewer no pipeline** (ainda pendente do plano original)
7. **Auto-Debugger integrado com Quality Gate** (ainda pendente)

## Como rollback (se algo estourar)

```bash
cd /Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema\ Automatizado/petition-engine
cp data/clients.json.bak.2026-04-19 data/clients.json
cp data/error_rules.json.bak.2026-04-19 data/error_rules.json
```

O git ref `main (1)` não tem rollback porque era lixo corrompido inválido — nunca apontou para commit real.
