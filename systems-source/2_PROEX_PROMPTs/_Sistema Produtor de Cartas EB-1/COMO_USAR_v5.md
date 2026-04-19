# COMO USAR — SKILL v5

## Quando este sistema é invocado

Invocado via Petition Engine quando `doc_type ∈ {testimony_letter_eb1a, testimony_letter_eb2_niw, satellite_letter_eb1, satellite_letter_eb2}`. Também usável standalone (ler `SKILL_v5.md` em sessão Claude).

## Pré-requisitos do caso

Antes de gerar, garantir que existem:

1. **Pasta de evidências do cliente** com CV, ARTs, DOIs, publicações, contratos, certificados
2. **`persona_bank.json`** com ≥5 signatários distintos para o caso (nome, credencial, relação temporal, cenas técnicas)
3. **`master_facts/{case_id}.json`** com anchors canônicos (years_experience, prior_role, current_role, pe_channel, soc_target)
4. **`hard_blocks/{case_id}.json`** com bloqueios SOC-específicos (default + override do caso)

Sem esses 4 artefatos, o arsenal fica incompleto e vira ATLAS.

## Fluxo de geração (6 fases)

1. **Phase 1 — Load personas:** lê `persona_bank.json` filtrado por `case_id`
2. **Phase 2 — Draft per letter:** gera 1 letter por persona usando prompt master da SEÇÃO 5 do SKILL
3. **Phase 3 — Anti-ATLAS validation:** compara cartas do mesmo caso; falha se `atlas_score > 0.7`
4. **Phase 4 — Hard-block scrub:** aplica regex de `hard_blocks/{case_id}.json`
5. **Phase 5 — Adversarial audit:** 8 critérios; bloqueia promoção se `critical_count > 0`
6. **Phase 6 — Final pass:** APÊNDICE contador, envelope investidor em USD, data top-position sorteada, Page X of Y só onde `paragraph_count ≥ 25`

## Sinais de arsenal quebrado

- Todas as cartas abrem com "I write to express" / "É com grande satisfação que" → **ATLAS textual**, revisar Categoria C (persona engineering)
- Mesma fonte em todas as cartas → **ATLAS visual**, revisar Categoria A (heterogeneidade)
- Zero ocorrência de "14+ anos" (ou anchor equivalente do caso) no arsenal → **master facts não aplicados**
- Aparição de "advisory", "consulting" (caso Ricardo) → **HARD BLOCK ativo, RFE automático**
- Aparição de "Dhanasar", "EB-2", "USCIS" em qualquer carta → **forbidden vocab**, revisar Categoria B7

## Versões preservadas

- `SKILL.md` (v1 original, 2026-03-24)
- `SKILL_v3.md` (2026-03-30)
- `SKILL_v4.md` (2026-04-18)
- `SKILL_v5.md` (2026-04-19, **current**)

Symlink `current.md` aponta para v5. Versões antigas NUNCA são deletadas — rollback é trocar o symlink.
