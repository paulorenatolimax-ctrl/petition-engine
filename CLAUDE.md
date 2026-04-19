# CLAUDE.md — Petition Engine (raiz do repo)

**Versão:** 2 · **Desde:** 2026-04-19 · **Predecessor preservado:** `CLAUDE_v1_legacy_2026-03.md`

Este arquivo é carregado AUTOMATICAMENTE pelo Claude Code toda sessão que trabalha neste repo. Por isso é curto por design — fica sempre no contexto.

## O que isto é

**Petition Engine:** plataforma Next.js 14 que automatiza geração de documentos de imigração USCIS (EB-1A, EB-2 NIW, O-1) usando Claude Code CLI (`claude -p`) como motor de geração.

- Repo GitHub: `paulorenatolimax-ctrl/petition-engine` · branch `main`
- Dev server daemon: `com.paulo.petitionengine.dev` (LaunchAgent) serve `localhost:3000` full-time
- Dono: Paulo Lima · PROEX · 598+ clientes atendidos historicamente

## Você chegou agora — LEIA NESTA ORDEM

**ANTES** de escrever código, ler arquivo ou responder qualquer pergunta sobre estado:

1. **`docs/CONTINUITY/STATE.md`** — estado atual: o que funciona, o que quebrou, em andamento. Auto-atualizado por git hook a cada commit.
2. **`docs/CONTINUITY/STEPLOG.md`** — cronologia de passos. Aqui você descobre ONDE paramos.
3. **`docs/CONTINUITY/INVENTORY.md`** — inventário de tudo: agentes, pipelines, doc_types, systems, tests.
4. **`docs/handoff/`** (o `SESSAO_*_RESUMO.md` mais recente) — último handoff detalhado.

Total: 15-20 min de leitura. Aí sim você está a par.

Se a conversa anterior caiu e o usuário disse apenas "continue", responda:
> Li CONTINUITY. Paramos em [passo N — ler STATE.md]. Posso prosseguir com [próximo passo — do STEPLOG]?

## Princípios não-negociáveis

- **Nunca expor infraestrutura** em artefatos de cliente: sem PROEX, Kortix, RAGs, Petition Engine, Obsidian, nomes de outros clientes
- **PROEX é consultoria**, NÃO escritório de advocacia. USCIS é processo **administrativo**, não judicial
- **Sistemas são genéricos.** 598+ clientes — NUNCA nomear sistema/arquivo por cliente (ex.: `RFE_MARCELO_GOIS.md` é PROIBIDO; `RFE_EB1A_V1.md` é correto). Benchmarks ficam no CONTEÚDO, nunca no path.
- **Anteprojeto = ZERO juízo de valor.** 3 endeavors neutros. Cláusula pétrea.
- **V prefix NA FRENTE.** `V5_arquivo.md`, nunca `arquivo_V5.md`. Versões antigas preservadas SEMPRE (renomear, nunca deletar).
- **DOCX** passa por `scripts/fix_docx_formatting.py`. **Output `.md`** só para anteprojetos/projetos-base internos.
- **`localhost:3000` roda full-time** via LaunchAgent. Se cair, diagnosticar o daemon (`launchctl list | grep petition`), nunca sugerir `npm run dev` como primeiro recurso.
- **Livro do Sandeco** (`/Users/paulo1844/Documents/Tecnologia e IA/Sandeco/Livro/Versão Branca - Eng_software_agentes_inteligentes (1).pdf`) é a referência arquitetural. Cap 4 (Factory Method, Repository, Camadas) é base do código.

## Anti-Alzheimer: se a conversa cair

Numa sessão nova, o usuário cola:

> Leia `docs/CONTINUITY/WAKE_UP.md` e siga o checklist antes de responder qualquer coisa.

WAKE_UP.md te dá uma sequência de 7 leituras que em 10 minutos te levam ao ponto exato. **Não pule o WAKE_UP.md.** Ele existe especificamente pra evitar que retrocedamos 20 passos quando a conversa cai.

## NÃO faça

- ❌ `git push --force` em main sem autorização explícita
- ❌ Renomear/mover arquivos de `systems-source/` (é snapshot, não o original)
- ❌ Deletar arquivos em `2_PROEX/PROMPTs/`, `AIOS_Petition Engine/`, `5_Z GLOBAL/`, `3_OMNI/_SISTEMAS/` — são os originais
- ❌ Commit em `data/generations.json` ou `data/prompts/` (gitignored por design — runtime data)
- ❌ Responder "tudo certo" sem ter verificado no código ou no STATE.md
- ❌ Aceitar memória do usuário como fato sem confirmar via `grep`, `ls`, ou `git log`

## FAÇA

- ✅ Ler `STATE.md` antes de fazer qualquer suposição sobre o estado
- ✅ Rodar `npx vitest run` antes de declarar feature completa
- ✅ Ao final de sessão longa: escrever `docs/handoff/SESSAO_YYYY-MM-DD_RESUMO.md` com entregas + pendências + próximos passos
- ✅ Ser **honesto brutal** sobre o que ficou pendente. "Meio feito" é inaceitável — usuário confia na sua resposta e depois descobre que mentimos. Diga "NÃO FEITO" em vez de "registrado mas não implementado"
- ✅ Atualizar STEPLOG.md manualmente se fizer algo grande sem commit (ou deixar post-commit hook fazer)

## Estrutura do projeto

```
petition-engine/
├── CLAUDE.md                 ← você está aqui
├── CLAUDE_v1_legacy_2026-03.md  ← versão anterior preservada
├── docs/
│   ├── CONTINUITY/           ← sistema anti-Alzheimer
│   │   ├── STATE.md          ← ESTADO ATUAL (auto-updated)
│   │   ├── STEPLOG.md        ← cronologia de passos
│   │   ├── INVENTORY.md      ← mapa completo do sistema
│   │   └── WAKE_UP.md        ← prompt de recuperação pós-queda
│   └── handoff/              ← relatórios de fim-de-sessão
├── src/
│   ├── agents/               ← 7+ agentes (Extractor, Writer, Quality, QualityLocal, USCIS Reviewer, AutoDebugger, AutoDebuggerLocal, SystemUpdater)
│   ├── lib/pipelines/        ← base.ts (core), cover-letter-eb1a.ts, cover-letter-eb2-niw.ts, testimony-letters.ts, generic.ts, registry.ts
│   ├── lib/rules/            ← repository.ts, hard-blocks.ts, persona-bank.ts, master-facts.ts, transversal.ts
│   ├── lib/validators/       ← anti-atlas.ts
│   └── app/api/generate/     ← orquestrador REST + SSE
├── data/
│   ├── error_rules.json      ← 148+ regras (auto-cresce via AutoDebugger)
│   ├── systems.json          ← 25+ entries, sistemas registrados
│   ├── clients.json          ← clientes cadastrados
│   ├── persona_bank.json     ← personas por caso (para testimony letters)
│   ├── master_facts/{case_id}.json  ← anchors canônicos por caso
│   ├── hard_blocks/{case_id}.json   ← blocos SOC-específicos
│   └── generations.json      ← runtime (gitignored)
├── systems/                  ← symlinks pros sistemas externos + orchestradores dentro do repo
├── systems-source/           ← SNAPSHOT versionado dos 5 diretórios externos (backup via rsync)
└── scripts/
    ├── launchagent/          ← plist + install.sh pro daemon
    ├── sync-external-systems.sh ← atualiza systems-source/ a partir dos originais
    └── hooks/                ← post-commit, etc
```
