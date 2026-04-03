# ORQUESTRADOR DE RESPOSTA RFE EB-2 NIW — Petition Engine
## Pipeline Multi-Fase (Inferido de RFE EB-1A Marcelo + Cover Letter EB-2 NIW V3)
## Versão: 1.0 — Abril 2026

---

## BENCHMARK REAL: DENI RUBENS (EB-2 NIW RFE)

**VF:** `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Deni Rubens (Direto)/1. Pleito Inicial 2023 OS3210 Jhonathamn-Paulo CONSULAR/1.CARREGUE AQUI SEUS DOCUMENTOS/DOCS RFE/VF_Resposta RFE_Deni Rubens.docx`

| Métrica | Valor |
|---------|-------|
| Palavras | 27.852 |
| Páginas | ~92 |
| Tabelas | 19 |
| Imagens | 53 |
| Parágrafos | 811 |

**LIÇÃO DO DENI (Paulo):** As "novas evidências" NÃO devem ser apresentadas no meio do sumário/índice para não perder a numeração da petição inicial (cover letter originalmente enviada). Manter a mesma numeração da CL original e adicionar novas evidências ao FINAL da lista, com numeração contínua.

---

## FREQUÊNCIA DE QUESTIONAMENTO POR PRONG (dados Cowork)

| Prong | % de RFEs que questionam | Nota |
|-------|------------------------|------|
| Prong 1 | ~30% | "Endeavor lacks specificity" / "not national importance" |
| Prong 2 | ~50% | **MAIS QUESTIONADO** — credentials, track record, letters genéricas |
| Prong 3 | ~60% | **MAIS NEGADO** — "could obtain labor certification", "speculative benefits" |

**Prong 3 é o "poison pill" do EB-2 NIW** — análogo ao C9 no EB-1A.

---

## PIPELINE DE 7 FASES

```
Fase 0   — Análise da RFE (decomposição por Prong questionado)
Fase 0.5 — Plano Estratégico de Resposta
Fase 1   — Resposta por Prong Questionado (1 sessão por Prong)
Fase 2   — Novas Evidências + Deep Research
Fase 3   — Thumbnails + Merge
Fase 4   — Validação + Auditoria (6 rodadas como Marcelo)
Fase 5   — SOC 4 Agentes
```

---

## FASE 0 — ANÁLISE DA RFE

**Output:** `_rfe_analysis.json`

```
claude -p "
Leia a RFE traduzida: [RFE_PATH]
Leia a cover letter original: [ORIGINAL_CL_PATH]
Leia: sistema V3 EB-2 NIW

TAREFA: Decompor a RFE por Prong.

Para CADA Prong questionado:
1. Transcrever objeção EXATA do oficial (word-for-word)
2. Tipo: falta_evidencia | insuficiente | interpretacao_divergente | evidencia_ignorada
3. Evidências existentes que respondem
4. Evidências NOVAS necessárias
5. Força da resposta: FORTE / MÉDIA / FRACA

REGRA: NUNCA 'The officer erred' — usar 'The record contains...'

Salve: [OUTPUT_DIR]/_rfe_analysis.json
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 0.5 — PLANO ESTRATÉGICO

**Output:** `_rfe_strategic_plan.md` (APROVAÇÃO DO PAULO)

Conteúdo:
1. Quais Prongs foram questionados (1, 2, 3, ou combinação)
2. Priorização por força de resposta
3. Evidências novas a obter (BP atualizado, novas cartas, dados de mercado frescos)
4. Deep research tasks
5. Estimativa de páginas

---

## FASE 1 — RESPOSTA POR PRONG (1 sessão por Prong questionado)

### Se Prong 1 questionado:

```
claude -p "
Leia: sistema V3 (TEMPLATE_PRONG1, RESEARCH_AGENT, LEGAL_FRAMEWORK_NIW_2026)
Leia: [OUTPUT_DIR]/_rfe_analysis.json

[REGRAS TRANSVERSAIS + ANTI-CRISTINE]

TAREFA: Resposta RFE — Prong 1 (Substantial Merit & National Importance).

ESTRUTURA:
1. Reproduzir objeção do oficial WORD-FOR-WORD
2. Framework: Matter of Dhanasar, 26 I&N Dec. 884 (Prong 1)
3. Resposta ponto-por-ponto:
   - 'The record contains Evidence XX, which demonstrates...'
   - Dados de mercado ATUALIZADOS (BLS, Census — pesquisar na web)
   - Políticas federais alinhadas (com URLs verificadas)
   - Nexo causal: expertise → endeavor → interesse nacional
4. Evidências ignoradas pelo oficial = OURO
5. Evidence blocks com thumbnails

Tom: Respeitoso, técnico. NUNCA confrontativo.

Palavras alvo: 8.000-15.000
Salve: [OUTPUT_DIR]/RFE_NIW_PRONG1.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
```

### Se Prong 2 questionado (o MAIS COMUM):

```
claude -p "
[Mesmo setup]

TAREFA: Resposta RFE — Prong 2 (Well Positioned).

OBJEÇÕES TÍPICAS DE PRONG 2:
- 'Education/experience not in field of endeavor'
- 'No track record of success in the endeavor'
- 'Letters are generic / do not address specific contributions'

RESPOSTA:
1. Reproduzir objeção EXATA
2. Demonstrar que educação + experiência CONVERGEM no endeavor
3. Track record com MÉTRICAS CONCRETAS (números, não adjetivos)
4. Cartas: citar trechos ESPECÍFICOS (não genéricos)
5. Metodologia proprietária (se houver) — ANTI-CRISTINE: dependente do beneficiário
6. Novas cartas (se obtidas) com análise detalhada

Palavras alvo: 10.000-18.000
Salve: [OUTPUT_DIR]/RFE_NIW_PRONG2.docx (ou _A + _B)
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

### Se Prong 3 questionado (o MAIS NEGADO):

```
claude -p "
[Mesmo setup]

TAREFA: Resposta RFE — Prong 3 (Waiver / Balance of Equities).

OBJEÇÕES TÍPICAS DE PRONG 3:
- 'Could obtain labor certification through conventional PERM'
- 'Benefits are speculative/projected, not demonstrated'
- 'No evidence that waiver serves national interest beyond personal benefit'

RESPOSTA EM 4 FRENTES:

A. IMPRATICABILIDADE DO PERM:
   - Self-employment / empreendedorismo
   - Escopo multi-empregador
   - Timeline PERM (2-3 anos) vs urgência
   - 'How would I be my own sponsor?'

B. BENEFÍCIO NACIONAL > PROTEÇÃO:
   - Empregos projetados (dados REAIS do BP)
   - Receita / impostos (projeções conservadoras)
   - Multiplicador NAICS (fonte: BEA)
   - 'Os EUA GANHAM mais aprovando'

C. PRECEDENTES:
   - Dhanasar: 'impractical to require labor certification'
   - NYSDOT: endeavors de interesse público
   - Casos AAO recentes favoráveis

D. URGÊNCIA + UNICIDADE:
   - Skill shortage (BLS JOLTS, OEWS)
   - Competição internacional (Canadá Express Entry, UK Global Talent)
   - Expertise INSUBSTITUÍVEL no mercado americano
   - ANTI-CRISTINE: beneficiário é o MOTOR, não peça substituível

Palavras alvo: 8.000-12.000
Salve: [OUTPUT_DIR]/RFE_NIW_PRONG3.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
```

---

## FASE 2 — NOVAS EVIDÊNCIAS + DEEP RESEARCH

Após gerar as respostas, pesquisar na web:
- Dados BLS/Census atualizados (2025-2026)
- Políticas federais recentes (Executive Orders)
- Cobertura do setor do cliente em mídia
- Casos AAO EB-2 NIW recentes (aprovações/negações)

Incorporar nos .docx gerados.

---

## FASE 3 — THUMBNAILS + MERGE

**Ordem (diferente da Cover Letter — Step 2/Sumário pode ir no início ou fim):**
```
1. RFE_NIW_PRONG1.docx (se questionado)
2. RFE_NIW_PRONG2.docx (se questionado)
3. RFE_NIW_PRONG3.docx (se questionado)
```

Se TODOS os 3 Prongs foram questionados, considerar adicionar seção introdutória + conclusiva.

---

## FASE 4-5 — VALIDAÇÃO + SOC 4 AGENTES

Mesma mecânica do RFE EB-1A (Marcelo):
- 6 rodadas de auditoria
- SOC 4 agentes (Officer avalia sob DHANASAR)
- Persona 1 foco: "A resposta refuta TODAS as objeções do Prong?"

---

## FORBIDDEN CONTENT ESPECÍFICO RFE EB-2 NIW

Além das regras transversais + anti-Cristine:
- NUNCA citar Kazarian (framework EB-1A)
- NUNCA dizer "extraordinary ability" (EB-1A)
- NUNCA dizer "top of the field" (EB-1A)
- NUNCA prometer resultados absolutos ("I WILL create 100 jobs")
- NUNCA omitir endereçamento do PERM (Prong 3 exige)
- NUNCA tratar Prongs como opcionais (todos cumulativos)
- NUNCA confrontar oficial
- NUNCA mencionar refile/denial anterior (anti-Cristine BLOCO 2)

---

## MÉTRICAS DE CALIBRAÇÃO (inferido — sem benchmark real)

| Métrica | Valor Estimado | Notas |
|---------|---------------|-------|
| Total palavras | 20.000-35.000 | Menor que RFE EB-1A (39K) |
| Total páginas | 60-100 | Depende dos Prongs questionados |
| Evidências | 20-40 | Reuso + novas |
| Por Prong | 8.000-18.000 palavras | Varia por força |
| Fontes primárias | 15+ | BLS, Census, SBA obrigatórios |

---

*Orquestrador de RFE EB-2 NIW — INFERIDO, sem benchmark real*
*Deve ser atualizado após primeiro caso real produzido*
*Abril 2026*
