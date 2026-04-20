# STATE.md — Estado atual do Petition Engine

**Auto-atualizado por `scripts/update-state.sh`.** Última atualização: 2026-04-20T18:05:26Z

> Esta página é regenerada a cada commit (via git hook post-commit). Para ver cronologia, consultar `STEPLOG.md`. Para o mapa completo do que existe, `INVENTORY.md`.

## Estado do repo

| Métrica | Valor |
|---------|-------|
| Último commit | `76336dacfcc1b6493d3a128264907002fac6e948` — feat(impacto): 5-phase multi-agent pipeline spec + node builder wrapper |
| Autor | paulorenatolimax-ctrl |
| Total de commits | 118 |
| Sincronização | ✅ local = remote |
| Último handoff | SESSAO_2026-04-19_RESUMO.md |

## Saúde operacional

| Métrica | Valor |
|---------|-------|
| Daemon `com.paulo.petitionengine.dev` | ✅ running |
| Port 3000 | ✅ serving |

## Números do sistema

| Métrica | Valor |
|---------|-------|
| error_rules.json | 148 regras |
| systems.json | 25 entries |
| clients.json | 41 clientes cadastrados |
| persona_bank.json | 12 personas |
| master_facts/ | 2 casos |
| hard_blocks/ | 3 configs (default + por caso) |
| Agentes | 8 em src/agents/ |
| Test files | 10 |

## Em andamento (última mão)

Ver `STEPLOG.md` seção "Pendências ativas" e o handoff mais recente em `docs/handoff/SESSAO_2026-04-19_RESUMO.md`.

## Flags vermelhas conhecidas

(auto-detecção simples — revisar manualmente se algo aparecer)


## Pointers rápidos (quando precisar encontrar algo)

- **Regras ativas:** `data/error_rules.json` (via `readActiveRules` em `src/lib/rules/repository.ts`)
- **Pipeline testimony letters:** `src/lib/pipelines/testimony-letters.ts`
- **Pipeline Cover EB-1A:** `src/lib/pipelines/cover-letter-eb1a.ts`
- **Quality gate local:** `src/agents/quality-local.ts`
- **USCIS reviewer:** `src/agents/uscis-reviewer.ts`
- **AutoDebugger (fecha loop):** `src/agents/auto-debugger-local.ts`
- **Hard-blocks por caso:** `src/lib/rules/hard-blocks.ts` + `data/hard_blocks/{case_id}.json`
- **Master facts por caso:** `src/lib/rules/master-facts.ts` + `data/master_facts/{case_id}.json`
- **Personas por caso:** `src/lib/rules/persona-bank.ts` + `data/persona_bank.json`
- **Anti-ATLAS:** `src/lib/validators/anti-atlas.ts`
- **Route principal da geração:** `src/app/api/generate/execute/route.ts`
- **LaunchAgent plist:** `scripts/launchagent/com.paulo.petitionengine.dev.plist`
