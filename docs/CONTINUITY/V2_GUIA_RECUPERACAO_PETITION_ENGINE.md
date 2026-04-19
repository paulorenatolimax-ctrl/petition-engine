# V2 — Guia de Recuperação — Petition Engine

**Criado:** 2026-04-19 · **Substitui em uso:** `GUIA_RECUPERACAO_PETITION_ENGINE.md` (V1 preservado ao lado como referência histórica)

> Este V2 é **atemporal** — não precisa ser atualizado toda semana. Ele aponta pro Continuity Kit do repo que se auto-atualiza a cada commit. Estado atual sempre está em `docs/CONTINUITY/STATE.md` (regenerado por git hook).

---

## Se a conversa cair — COLE ISTO no terminal novo

```
Leia /Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/docs/CONTINUITY/WAKE_UP.md e siga o checklist lá antes de responder qualquer coisa.

Quando terminar, responda APENAS com uma linha de status (commit, tests, daemon, próximo passo) e aguarde meu OK.
```

Só isso. Não precisa colar lista de 7 arquivos, não precisa atualizar contagens. O `WAKE_UP.md` faz o bot novo ler os 4 artefatos certos, rodar 2 comandos, e reportar estado em ~10 minutos.

---

## Como saber se o sistema está saudável (verifique sempre)

Comando único pra ver estado vivo:

```bash
cd "/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine" && cat docs/CONTINUITY/STATE.md | head -40
```

Mostra: último commit, se remote = local, daemon status, port 3000, contagens (regras, systems, clientes, personas, agentes, tests), flags vermelhas auto-detectadas.

---

## Onde tudo mora

### Repo principal (sempre atualizado no GitHub)
- **Local:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/`
- **GitHub:** `paulorenatolimax-ctrl/petition-engine` · branch `main`
- **Clonar de novo:** `git clone https://github.com/paulorenatolimax-ctrl/petition-engine.git`

### Continuity Kit (anti-Alzheimer — dentro do repo)
- `docs/CONTINUITY/STATE.md` — estado vivo, auto-atualizado a cada commit
- `docs/CONTINUITY/STEPLOG.md` — cronologia de passos (cada commit vira entrada)
- `docs/CONTINUITY/INVENTORY.md` — mapa de tudo: agentes, pipelines, doc_types, systems
- `docs/CONTINUITY/WAKE_UP.md` — prompt de recuperação que o terminal novo deve ler

### CLAUDE.md (raiz do repo)
- `CLAUDE.md` (v2) — carregado automaticamente pelo Claude Code toda sessão
- `CLAUDE_v1_legacy_2026-03.md` — versão antiga preservada
- Contém: princípios não-negociáveis, proibições, estrutura

### Sistemas originais (5 pastas externas — NÃO editar via repo)
| Pasta | O que tem |
|-------|-----------|
| `/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/` | cover EB-1A, cartas EB-1, estratégia EB-1/EB-2, anteprojeto, localização |
| `/Users/paulo1844/Documents/AIOS_Petition Engine/` | cover EB-2 NIW, resumé EB-1A, resumé EB-2 NIW |
| `/Users/paulo1844/Documents/3_OMNI/_SISTEMAS (Petition Engine)/` | Business Plan V3 |
| `/Users/paulo1844/Documents/5_Z GLOBAL/Z_PROMPTS/` | Metodologia, Declaração, SaaS |
| `/Users/paulo1844/Documents/5_Z GLOBAL/_PRODUTO NOVO/` | IMPACTO |

**Backup versionado** de tudo isso: `systems-source/` dentro do repo. Atualizado via `bash scripts/sync-external-systems.sh`.

### Documentação histórica (contexto e decisões passadas)
- `/Users/paulo1844/Documents/Claude/Projects/C.P./` — documentos estratégicos e auditorias
  - `RETROSPECTIVA_RICARDO_COWORK.md` — engenharia reversa das cartas do Ricardo (base do SKILL v5)
  - `PETITION_ENGINE_ESTADO_COMPLETO.md` — estado geral (pode estar desatualizado; consultar STATE.md pra valor vivo)

### Obsidian (este guia)
- `/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/V2_GUIA_RECUPERACAO_PETITION_ENGINE.md`

### RAGs jurídicos
- EB-1: `/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-1/`
- EB-2 NIW: `/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs/`
- Pareceres da Qualidade: `/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/Pareceres da Qualidade.md`

### Livro do Sandeco (referência arquitetural do código)
- `/Users/paulo1844/Documents/Tecnologia e IA/Sandeco/Livro/Versão Branca - Eng_software_agentes_inteligentes (1).pdf`
- Cap 4 é referenciado em `src/lib/pipelines/base.ts`, `registry.ts`, `rules/repository.ts`, `rules/transversal.ts`

---

## Comandos essenciais (atemporais)

```bash
# Entrar no repo (sempre o primeiro passo)
cd "/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine"

# Ver estado do sistema vivo
cat docs/CONTINUITY/STATE.md | head -40

# Ver cronologia (últimos passos)
head -60 docs/CONTINUITY/STEPLOG.md

# Ver mapa completo (inventário)
cat docs/CONTINUITY/INVENTORY.md

# Ver git
git log --oneline -15
git status
git fetch origin main && git status

# Daemon do dev server (localhost:3000 full-time)
launchctl list | grep petition              # verificar se está rodando
bash scripts/launchagent/install.sh         # reinstalar se caiu
lsof -i :3000                               # verificar se port responde
tail -50 ~/Library/Logs/petition-engine-dev.err.log   # diagnosticar erro

# Sincronizar sistemas externos para o backup versionado
bash scripts/sync-external-systems.sh

# Rodar testes
npx vitest run

# Ver regras ativas (rápido)
python3 -c "import json; d=json.load(open('data/error_rules.json')); print(len(d), 'regras')"

# Ver clientes
python3 -c "import json; d=json.load(open('data/clients.json')); [print(f'{c[\"id\"]}: {c[\"name\"]}') for c in d[:10]]"
```

---

## Princípios invioláveis (cláusulas pétreas — se violar, pare)

1. **PROEX é consultoria**, não escritório de advocacia. Nunca usar terminologia jurídica. USCIS é processo **administrativo**, não judicial.
2. **Nunca expor infraestrutura** em artefato de cliente: sem menção a PROEX, Kortix, Petition Engine, Obsidian, RAGs, prompts, versionamento, nomes de outros clientes.
3. **Anteprojeto = ZERO juízo de valor.** 3 endeavors apresentados neutralmente, cliente escolhe. Nunca ranquear, recomendar ou elogiar um sobre outro.
4. **Sistemas são genéricos.** 598+ clientes — nome de cliente jamais em path/arquivo de sistema. Ex.: `RFE_MARCELO_GOIS.md` é proibido; `RFE_EB1A_V1.md` é correto. Benchmarks ficam no conteúdo, não no caminho.
5. **V prefix SEMPRE na frente** (`V5_arquivo.md`, nunca `arquivo_V5.md`). **Nunca deletar versão anterior** — renomear se precisar.
6. **DOCX** passa obrigatoriamente por `scripts/fix_docx_formatting.py`. **Output `.md`** apenas para anteprojetos/projetos-base internos.
7. **Cada fix = commit + push no GitHub.** Rollback só existe se estiver versionado.
8. **localhost:3000 é daemon** via LaunchAgent (`com.paulo.petitionengine.dev`). Se cair, diagnosticar o daemon antes de sugerir `npm run dev` manual.
9. **Livro do Sandeco é a referência arquitetural.** Antes de novo pattern, consultar Cap 4 (Factory Method, Repository, Camadas).
10. **Honestidade brutal.** Se algo não foi feito, dizer "NÃO FEITO". Nunca "registrado mas não implementado", "meio pronto", "quase funcionando".

---

## Conceitos-chave do domínio

| Termo | Significado |
|-------|-------------|
| **Separation of Concerns** | Protocolo: sessão que escreve nunca é sessão que revisa. Revisão cruzada em sessão limpa. |
| **Cirúrgico** | Feedback específico (seção X, página Y, este parágrafo). Oposto de cascalho. |
| **Cascalho** | Rejeição total de um bloco/seção. Refazer inteiro. |
| **Indutivo** | Do particular pro geral (erro específico vira regra universal). |
| **Squad / Esquadrão** | Os agentes do AIOS trabalhando juntos (hoje 7+1: extractor, writer, quality, quality-local, uscis-reviewer, auto-debugger, auto-debugger-local, system-updater) |
| **Ikaro com K** | Benchmark visual de Business Plan (67 páginas) |
| **Anteprojeto** | Fase pré-projeto: 3 endeavors neutros, 3 SOC codes. Cliente escolhe 1. |
| **Projeto-Base** | Projeto completo após escolha do endeavor. |
| **ATLAS / anti-ATLAS** | Sistema USCIS de detecção de templates. Cartas do mesmo caso precisam ser heterogêneas (fonte, cor, layout, data, tabelas). |
| **Hard Block** | Termo cuja presença = RFE automático. Configurável por caso (SOC). Ex.: "advisory" em case do Ricardo (SOC 17-2051 civil engineer). |
| **Persona Bank** | Registro de vozes engineered para cartas-testemunho. Cada autor tem signature_verb, opening_variants, expertise_lock. |
| **Master Facts** | Anchors canônicos por caso: years_experience, prior_role, current_role, pe_channel, soc_target. Cartas ecoam ≥3. |
| **Kazarian 2-step** | Análise EB-1A: step 1 (evidências por critério), step 2 (totalidade). |
| **Dhanasar 3 prongs** | EB-2 NIW: (1) mérito + importância nacional, (2) bem posicionado, (3) balanço favorece o waiver. |
| **RFE** | Request for Evidence — USCIS pede mais provas antes de decidir. Sistema dedicado em `systems/rfe-eb1a-orchestrator/`. |

---

## Diferenças V1 → V2 (changelog)

- **V1 (25/mar/2026):** hardcode de 17 regras, 18 sistemas, 14 commits, 7 agentes. Paths em `OMNI/`, `_PROEX/`. Precisava update manual a cada mudança. Lista de 7 arquivos para colar.
- **V2 (19/abr/2026):** atemporal. Aponta pro Continuity Kit (`docs/CONTINUITY/`) que se auto-atualiza a cada commit via `scripts/update-state.sh` + post-commit hook. Paths corrigidos para `3_OMNI/`, `2_PROEX/`. Contagens vêm do STATE.md vivo. Prompt de recuperação = 2 linhas.

**Mudanças arquiteturais relevantes desde V1:**
- 148+ error rules (cresce automaticamente via AutoDebugger pós-QualityGate)
- 25 systems registrados, com SKILL v5 de cartas (57 regras invisíveis + 23 anti-padrões IA + persona_bank)
- 8 agentes (era 7; AutoDebugger local foi o "8º" que o Paulo lembrava)
- Testimony letters pipeline multi-fase com anti-ATLAS validator
- USCIS Reviewer integrado no pipeline (Phase 1.65)
- LaunchAgent daemon mantém localhost:3000 full-time
- Backup versionado de todos sistemas externos em `systems-source/`
- Livro do Sandeco lido e referenciado como base arquitetural

---

**Fim do V2.** Se algo neste guia conflitar com `docs/CONTINUITY/STATE.md`, o STATE.md é a verdade (ele é regenerado a cada commit).
