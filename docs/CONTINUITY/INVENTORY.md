# INVENTORY.md — Mapa completo do Petition Engine

**Auto-atualizado por `scripts/update-state.sh`.** Última revisão manual: 2026-04-19.

## Agentes (em `src/agents/`)

| # | Arquivo | Papel | Ativo no pipeline? |
|---|---------|-------|---------------------|
| 1 | `extractor.ts` | Lê pasta do cliente, extrai docs + scoring | Sim (via writer) |
| 2 | `writer.ts` | Monta prompt final (sistema + RAGs + regras) | Sim |
| 3 | `quality.ts` | Quality gate via Supabase | Parcial (legacy) |
| 4 | `quality-local.ts` | Quality gate via JSON local | **Sim (principal)** — Phase 1.5 |
| 5 | `uscis-reviewer.ts` | Simulação de adjudicação USCIS | **Sim** — Phase 1.65 (integrado 2026-04-19) |
| 6 | `auto-debugger.ts` | Converte erros em regras (Supabase) | Só endpoint manual `/api/errors/report` |
| 7 | `auto-debugger-local.ts` | Converte erros em regras (JSON) | **Sim** — Phase 1.55 auto (integrado 2026-04-19) |
| 8 | `system-updater.ts` | Propõe versões novas de systems | **Não** — standalone, não chamado |

## Pipelines (em `src/lib/pipelines/`)

| Arquivo | Doc types atendidos | Multi-fase? | Estado |
|---------|---------------------|-------------|--------|
| `base.ts` | (infraestrutura) | — | Core: `runClaude`, `findNewDocx`, `upsertGeneration` |
| `cover-letter-eb1a.ts` | cover_letter_eb1a | ✅ 10+ fases | Ativo |
| `cover-letter-eb2-niw.ts` | cover_letter_eb2_niw | ✅ multi-fase | Ativo |
| `generic.ts` | todos os outros (via JSON spec em `systems/pipelines/`) | ✅ spec-driven | Ativo |
| `testimony-letters.ts` | testimony_letter_eb1a, testimony_letter_eb2_niw | ✅ 6 fases (persona + master_facts + anti-atlas + hard_blocks) | **Ativo** (integrado 2026-04-19) |
| `registry.ts` | — | — | Factory Method (Sandeco Ch. 4.4) |

## doc_types registrados (em `src/lib/system-map.ts`)

| doc_type | System dir | Pipeline | Status |
|----------|-----------|----------|--------|
| `cover_letter_eb1a` | cover-letter-eb1a | custom eb1a | ✅ multi-fase |
| `cover_letter_eb2_niw` | cover-letter-eb2-niw | custom eb2 | ✅ multi-fase |
| `cover_letter_o1` | cover-letter-eb1a | custom eb1a | ✅ reaproveita |
| `resume` | resume-eb1a | generic | ✅ |
| `resume_eb1a` | resume-eb1a | generic | ✅ |
| `resume_eb2_niw` | resume-eb2-niw | generic spec `resume-eb2-niw.json` | ✅ multi-fase |
| `business_plan` | business-plan | generic spec `business-plan.json` | ✅ multi-fase 7 phases |
| `methodology` | metodologia | generic | ✅ |
| `declaration_of_intentions` | declaracao-intencoes | generic | ✅ |
| `anteprojeto` | estrategia-eb2 | generic | ✅ 9 prompts sequenciais |
| `location_analysis` | localizacao | generic | ✅ Gemini |
| `impacto_report` | impacto | generic | ✅ |
| `satellite_letter_eb1` | satellite-letters-eb1 | generic | ⚠️ funciona, mas testimony_letter_eb1a é superior |
| `satellite_letter_eb2` | satellite-letters-eb2 | generic | ⚠️ idem |
| `testimony_letter_eb1a` | satellite-letters-eb1 | **testimony-letters** | **✅ NOVO** (2026-04-19) |
| `testimony_letter_eb2_niw` | satellite-letters-eb2 | **testimony-letters** | **✅ NOVO** (2026-04-19) |
| `strategy_eb1` | estrategia-eb1 | generic | ✅ |
| `strategy_eb2` | estrategia-eb2 | generic | ✅ |
| `saas_evidence` | saas-evidence | generic | ✅ |
| `endeavor_assessment` | (none) | generic | ✅ |
| `rfe_response_eb1a` | rfe-eb1a-orchestrator | custom EB1A | **✅ fix 2026-04-19** (antes apontava errado) |
| `rfe_response_eb2_niw` | rfe-eb2niw-orchestrator | custom EB1A | ⚠️ stub (pasta vazia) |
| `rfe_response` (legacy) | → rfe_response_eb1a | alias | deprecated |

## Regras (em `data/error_rules.json`)

- **Total:** 148+ (cresce automaticamente via AutoDebugger)
- **Range IDs:** r1 – r151+ (com 3 gaps: r68, r70, r72)
- **Por severidade:** 82 critical, 38 high, 2+ medium, 1+ low
- **Por fonte:**
  - Seed inicial: r1-r128
  - Pareceres corpus (regex-executable): r127, r128
  - RETROSPECTIVA_RICARDO_COWORK AI-antipatterns: r129-r151 (23 regras)
  - AutoDebugger runtime: r152+ (cresce por geração)
- **Doc-type-specific:** ~70% das regras. **Global (doc_type=null):** ~30%.

## Systems registrados (em `data/systems.json`)

- **Total:** 25 entries (múltiplos para mesma pasta às vezes, e.g. Cartas EB-1 v2.0 e v5.0 coexistem)
- **Ativos:** 23
- **Inativos:** 2 (rfe_response_eb2_niw stub; Cartas v3.1 superseded)

## Dados por caso (Ricardo Augusto é o único casado atualmente)

| Arquivo | Conteúdo |
|---------|----------|
| `data/persona_bank.json` | 5 personas para `case_id=ricardo_augusto` (Ademar Hirata, Carlos Eduardo, Antônio Claret, Thiago Avelino, David Karins) |
| `data/master_facts/ricardo_augusto.json` | anchors: years_experience "14+", prior_role CEO RBP, current_role Karins Tampa FL, pe_channel FL License 34217, soc_target 17-2051 |
| `data/hard_blocks/ricardo_augusto.json` | 8 blocks SOC 17-2051 (advisory, consulting, sub-consulting, assessoria, padronizado, turnkey, autossuficiente, consultoria-servico) |
| `data/hard_blocks/default.json` | blocks globais (PROEX, Kortix, Petition Engine, Obsidian, RAGs, immigration jargon) |

**Pendência para outros casos:** cadastrar persona_bank + master_facts + hard_blocks para cada novo caso que for usar testimony_letters.

## Testes

- **Suite:** Vitest, 71 tests em 10 test files (2026-04-19)
- **Arquivos:**
  - `pipelines/base.test.ts` — runClaude timeouts + findNewDocx recursive (11)
  - `pipelines/registry.test.ts` — routing + MULTI_PHASE (7)
  - `rules/repository.test.ts` — readAllRules, buildRulesSection (8)
  - `rules/transversal.test.ts` — SHARED/EB1A/EB2 composition (5)
  - `rules/hard-blocks.test.ts` — loader, scan, scrub, report (11)
  - `rules/persona-bank.test.ts` — load/filter (6)
  - `rules/master-facts.test.ts` — anchors presence (9)
  - `rules/auto-debugger-local.test.ts` — classify + dedup + batch (5)
  - `validators/anti-atlas.test.ts` — clustering + thresholds (6)
  - `config/paths.test.ts` — constants (3)

## Sistemas externos (originais — NUNCA editar via repo)

| Pasta | Conteúdo | Referenciado pelo symlink |
|-------|----------|---------------------------|
| `/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/` | cover EB-1A, satellite EB-1, estratégia EB-1/EB-2, anteprojeto, localização | 6 symlinks |
| `/Users/paulo1844/Documents/AIOS_Petition Engine/` | cover EB-2 NIW, resumé EB-1A, resumé EB-2 NIW | 3 symlinks |
| `/Users/paulo1844/Documents/3_OMNI/_SISTEMAS (Petition Engine)/` | Business Plan V3 | 1 symlink |
| `/Users/paulo1844/Documents/5_Z GLOBAL/Z_PROMPTS/` | Metodologia, Declaração, SaaS | 3 symlinks |
| `/Users/paulo1844/Documents/5_Z GLOBAL/_PRODUTO NOVO/` | IMPACTO | 1 symlink |

**Backup versionado:** `systems-source/` (167MB, 594 arquivos, ex-PDFs >50MB). Atualizado via `bash scripts/sync-external-systems.sh`.

## Infraestrutura operacional

- **Dev server:** LaunchAgent `com.paulo.petitionengine.dev` → `npm run dev` → `localhost:3000`
- **Logs:** `~/Library/Logs/petition-engine-dev.{out,err}.log`
- **Git hooks:** `scripts/hooks/post-commit` atualiza STATE.md e STEPLOG.md
- **Memória Claude:** `.claude/projects/...MEU-SISTEMA-AUTO--Petition-Engine-/memory/MEMORY.md` + arquivos por tópico

## Lacunas conhecidas (para STEPLOG)

- [ ] Testimony letters: cadastrar personas dos 6 autores L06-L11 do Ricardo (atualmente só 5 para L01-L05)
- [ ] Pipelines de `resume_eb2_niw`, `business_plan`, `saas_evidence`, etc usam generic — seria útil estender pra usar persona_bank quando aplicável
- [ ] RFE EB-2 NIW orchestrator vazio (pasta criada, conteúdo pendente de reverse engineering)
- [ ] SystemUpdater agent existe mas não é chamado por ninguém
- [ ] 10 candidate rules semânticas dos Pareceres aguardando integração com USCIS Reviewer
- [ ] Pareceres da Qualidade (~50 regras em corpus) ainda 80% não-migradas (só 2 regex-executable entraram)
- [ ] Git repo tem zero tags — seria útil tag por release (v0.1.0, etc)
