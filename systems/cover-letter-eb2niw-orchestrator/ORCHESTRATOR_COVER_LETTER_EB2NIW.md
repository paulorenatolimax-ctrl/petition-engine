# ORQUESTRADOR DE COVER LETTER EB-2 NIW — Petition Engine
## Pipeline Multi-Fase (Inferido de EB-1A Vitória + Sistema V3 Andrea Medeiros)
## Versão: 1.0 — Abril 2026

---

## SISTEMA BASE

O sistema V3 de Cover Letter EB-2 NIW está em:
`/Users/paulo1844/Documents/AIOS_Petition Engine/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions/`

**18 arquivos:** ARCHITECT, SISTEMA, FORMATTING_SPEC, FORBIDDEN_CONTENT, QUALITY_GATES,
LEGAL_FRAMEWORK, TEMPLATES (Eligibility + Prong 1/2/3), RESEARCH_AGENT, QUALITY_AGENT,
EVIDENCE_CONTENT_VALIDATION, EVIDENCE_NAMING, DOCX_PRODUCTION_PIPELINE, LICOES_TECNICAS_ANDREA, README, SKILL

**Benchmark:** VF_COVER_LETTER_ANDREA_EB2_NIW_V3.docx (Andrea Medeiros)

---

## DIFERENÇA FUNDAMENTAL: EB-1A vs EB-2 NIW

| EB-1A | EB-2 NIW |
|-------|----------|
| 10 critérios (escolher 3+) | 3 Prongs (TODOS obrigatórios) |
| Kazarian two-step | Dhanasar three-prong |
| Foco no PASSADO (conquistas) | Foco no FUTURO (endeavor) |
| Step 2 = totality analysis | Sem Step 2 — Prong 3 = waiver |
| ~80-111 evidências | ~30-50 evidências |
| 150-200 páginas | 50-80 páginas |
| Dados de mercado opcionais | Dados de mercado ESTRUTURAIS |
| NUNCA citar Dhanasar | NUNCA citar Kazarian |

---

## PIPELINE DE 8 FASES

```
Fase 0   — Inventário + Mapeamento (evidências → prongs)
Fase 0.5 — Plano Estratégico (aprovação do Paulo)
Fase 1   — Introdução + Elegibilidade EB-2
Fase 2   — Prong 1: Substantial Merit & National Importance (+ deep research)
Fase 3   — Prong 2: Well Positioned to Advance the Endeavor
Fase 4   — Prong 3: Balance of Equities (National Interest Waiver)
Fase 5   — Conclusão + Evidence Index
Fase 6   — Thumbnails + Merge + Validação
Fase 7   — Separation of Concerns (SOC 4 agentes)
```

---

## REGRAS TRANSVERSAIS (incluir em TODOS os prompts)

```
[INCLUIR regras transversais do Cover Letter EB-1A Orchestrator]

ADIÇÕES ESPECÍFICAS EB-2 NIW:
- NUNCA usar "extraordinary ability" (termo EB-1A)
- NUNCA citar Kazarian (framework EB-1A; usar DHANASAR)
- NUNCA dizer "top of the field" (EB-1A; NIW = "well positioned")
- NUNCA confundir "national importance" com "national acclaim"
- NUNCA prometer resultados específicos ("I WILL generate $X" → "projected/estimated")
- NUNCA omitir endereçamento do PERM no Prong 3 (omissão = denial)
- TODOS os 3 Prongs são CUMULATIVOS — falhar em 1 = denial total
- Dados de mercado COM FONTE em toda afirmação (BLS, Census, SBA, Statista)
- ANTI-CRISTINE: HARD BLOCKS (4 blocos) em todos os prompts
```

---

## FASE 0 — INVENTÁRIO E MAPEAMENTO

**Output:** `_inventory.json` mapeando evidências → prongs (não critérios)

```
claude -p "
Leia o sistema em: /Users/paulo1844/Documents/AIOS_Petition Engine/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions/
Leia TODOS os documentos do cliente: [CLIENT_DOCS_PATH]

TAREFA: Inventário de evidências para EB-2 NIW.

Mapear cada evidência para:
- ELEGIBILIDADE: Advanced Degree ou Exceptional Ability
- PRONG 1: Mérito substancial + importância nacional
- PRONG 2: Qualificações, experiência, track record
- PRONG 3: Dados de impacto econômico, PERM impraticável
- CROSS: evidências que servem múltiplos prongs

Identificar:
- Proposed Endeavor (do Anteprojeto/Projeto-Base se existir)
- O*NET code
- Endeavor geography (cidade, estado, região)
- Business Plan (se existir)

Salve: [OUTPUT_DIR]/_inventory.json
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 0.5 — PLANO ESTRATÉGICO

**Output:** `_strategic_plan.md` (APROVAÇÃO DO PAULO)

O plano DEVE conter:
1. Pathway de elegibilidade (Advanced Degree vs Exceptional Ability)
2. Proposed Endeavor definido (do Anteprojeto)
3. Mapa de evidências por Prong
4. Estratégia por Prong (qual é o mais forte, qual precisa de reforço)
5. Deep research tasks (BLS, Census, políticas federais)
6. Estimativa de páginas por seção

---

## FASE 1 — INTRODUÇÃO + ELEGIBILIDADE (10% do total)

```
claude -p "
Leia: sistema V3 (ARCHITECT, FORMATTING_SPEC_NIW, TEMPLATE_ELIGIBILITY, LEGAL_FRAMEWORK_NIW_2026)
Leia: [OUTPUT_DIR]/_inventory.json, _strategic_plan.md

[REGRAS TRANSVERSAIS]

TAREFA: Gerar Parte 1 — Introdução + Elegibilidade EB-2.

CONTEÚDO:
1. CAPA (formato carta):
   - Data, USCIS Immigration Officer, bloco metadata verde #D6E1DB
   - Ref: I-140, Petitioner/Beneficiary, Classification: EB-2 NIW

2. INTRODUÇÃO (~2-3 parágrafos):
   - Nome, campo, O*NET, proposed endeavor (1 frase)
   - 'Apresento esta petição I-140 sob a classificação EB-2 NIW...'
   - Framework: Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016)

3. ELEGIBILIDADE EB-2 (seção que NÃO existe no EB-1A):
   - Advanced Degree pathway: GEO evaluation, WES, credenciais
   - OU Exceptional Ability: 6 fatores (8 C.F.R. § 204.5(k)(2))
   - Evidence blocks com documentação acadêmica

4. TRANSIÇÃO para Prong 1

Palavras alvo: 4.000-6.000
Salve: [OUTPUT_DIR]/CL_NIW_PART1_Intro.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 2 — PRONG 1: SUBSTANTIAL MERIT & NATIONAL IMPORTANCE (30% do total)

O Prong 1 é a SEÇÃO MAIS DENSA — concentra dados de mercado, políticas, e nexo causal.

```
claude -p "
Leia: sistema V3 (TEMPLATE_PRONG1, RESEARCH_AGENT, LEGAL_FRAMEWORK_NIW_2026)
Leia: [OUTPUT_DIR]/_inventory.json
Leia evidências Prong 1: [lista]
PESQUISE NA WEB: BLS, Census, SBA, políticas federais relevantes

[REGRAS TRANSVERSAIS + ANTI-CRISTINE HARD BLOCKS]

TAREFA: Gerar Prong 1 — Substantial Merit & National Importance.

ESTRUTURA:
1. DEFINIÇÃO DO PROPOSED ENDEAVOR:
   - Descrição técnica detalhada (NÃO genérica)
   - Campo de atuação + O*NET code
   - Geografia (cidade, estado, região)
   - Público-alvo + vazio competitivo

2. DEEP RESEARCH — DADOS DE MERCADO:
   - TAM, SAM, SOM com fontes (BLS, Census, IBISWorld, Statista)
   - Dados de emprego/crescimento do setor (BLS Occupational Outlook)
   - Gap documentado que o endeavor resolve
   - 15+ fontes primárias com URLs

3. POLÍTICAS FEDERAIS ALINHADAS (mínimo 3):
   - Executive Orders, Acts, Programs federais
   - Para CADA política: como o TRABALHO DO BENEFICIÁRIO contribui
   - Cadeia: Expertise → Endeavor → Política → Interesse Nacional

4. NEXO CAUSAL:
   - Por que o endeavor tem MÉRITO SUBSTANCIAL (qualidade intrínseca)
   - Por que tem IMPORTÂNCIA NACIONAL (escopo além do local)

5. EVIDENCE BLOCKS com thumbnails

ANTI-CRISTINE: Todo parágrafo sobre o endeavor DEVE responder:
'Por que isso não acontece sem ESTA PESSOA?'

Palavras alvo: 12.000-18.000 (mínimo 10.000)
Dividir em A + B se > 15.000 palavras
Salve: [OUTPUT_DIR]/CL_NIW_PRONG1.docx (ou _A + _B)
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
```

---

## FASE 3 — PRONG 2: WELL POSITIONED (35% do total)

```
claude -p "
Leia: sistema V3 (TEMPLATE_PRONG2)
Leia: [OUTPUT_DIR]/_inventory.json
Leia: [OUTPUT_DIR]/CL_NIW_PRONG1.docx (continuidade)
Leia evidências Prong 2: [lista]

[REGRAS TRANSVERSAIS]

TAREFA: Gerar Prong 2 — Well Positioned to Advance the Endeavor.

ESTRUTURA:
1. EDUCAÇÃO + CREDENCIAIS:
   - Graus acadêmicos com instituições
   - Certificações profissionais (SAP, PMI, etc.)
   - Treinamentos especializados

2. EXPERIÊNCIA PROFISSIONAL DETALHADA:
   - Para CADA posição: cargo, empresa, datas, MÉTRICAS de impacto
   - Quantificar: receita, projetos, equipes, clientes
   - NÃO genérico — números REAIS das evidências

3. PUBLICAÇÕES E CONTRIBUIÇÕES:
   - Artigos, livros, palestras
   - Métricas de impacto (citações, downloads, alcance)

4. METODOLOGIA PROPRIETÁRIA (se houver):
   - Descrever o que é ÚNICO no approach do beneficiário
   - ANTI-CRISTINE: metodologia DEPENDE do beneficiário, não é transferível

5. CARTAS DE RECOMENDAÇÃO (6+ típicas):
   - Para CADA carta: quem, credenciais do recomendador, o que diz
   - Tom FUTURO: 'O beneficiário está posicionado para...'
   - Evidence blocks com thumbnail da carta

6. PLANO DE EXECUÇÃO:
   - Como o beneficiário vai implementar o endeavor
   - Timeline (1-3-5 anos)
   - Milestones mensuráveis

Palavras alvo: 15.000-20.000 (mínimo 12.000)
Dividir em A + B se necessário
Salve: [OUTPUT_DIR]/CL_NIW_PRONG2.docx (ou _A + _B)
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 4 — PRONG 3: NATIONAL INTEREST WAIVER (20% do total)

```
claude -p "
Leia: sistema V3 (TEMPLATE_PRONG3, LEGAL_FRAMEWORK_NIW_2026)
Leia: [OUTPUT_DIR]/_inventory.json
Leia: Prong 1 e 2 gerados

[REGRAS TRANSVERSAIS + ANTI-CRISTINE HARD BLOCKS]

TAREFA: Gerar Prong 3 — Balance of Equities (Waiver).

ESTRUTURA (4 FRENTES OBRIGATÓRIAS):

A. IMPRATICABILIDADE DO PERM:
   - Self-employment / empreendedorismo proprietário
   - Escopo multi-empregador / multi-cliente
   - Timeline PERM (2-3 anos) vs. urgência do endeavor
   - 'Como eu seria meu próprio sponsor?'

B. BENEFÍCIO NACIONAL > PROTEÇÃO DO MERCADO:
   - Empregos projetados (quantificar)
   - Receita estimada / impostos
   - Multiplicador econômico (NAICS, BEA)
   - 'Os EUA ganham mais aprovando do que negando'

C. PRECEDENTES:
   - Dhanasar: 'it would be impractical to require labor certification'
   - NYSDOT: endeavors de interesse público
   - Casos AAO recentes (se pesquisados)

D. URGÊNCIA:
   - Janela de oportunidade fechando
   - Skill shortage documentado (BLS JOLTS data)
   - Competição internacional (Canadá, UK, Austrália)
   - Gap que se agrava enquanto espera PERM

ANTI-CRISTINE OBRIGATÓRIO:
- Expertise do beneficiário é INSUBSTITUÍVEL
- Endeavor NÃO funciona sem esta pessoa
- NUNCA 'standardized', 'self-sustaining', 'plug-and-play'

Palavras alvo: 8.000-12.000
Salve: [OUTPUT_DIR]/CL_NIW_PRONG3.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 5 — CONCLUSÃO + EVIDENCE INDEX (5% do total)

```
claude -p "
Leia: Prongs 1, 2, 3 gerados
Leia: [OUTPUT_DIR]/_inventory.json

TAREFA: Gerar Conclusão + Evidence Index.

1. SÍNTESE DOS 3 PRONGS (2-3 parágrafos):
   - Prong 1: endeavor tem mérito e importância nacional
   - Prong 2: beneficiário está posicionado pra avançar
   - Prong 3: waiver serve ao interesse nacional

2. PEDIDO DE APROVAÇÃO:
   - Solicitar aprovação da petição I-140

3. EVIDENCE INDEX:
   - Tabela: Evidence # | Título | Tipo | Prong(s)
   - [THUMBNAIL — Exhibit XX] pra cada
   - Bordas APENAS horizontais

Salve: [OUTPUT_DIR]/CL_NIW_CONCLUSION.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 6 — THUMBNAILS + MERGE + VALIDAÇÃO

**Ordem de merge (Cover Letter EB-2 NIW):**
```
1. CL_NIW_PART1_Intro.docx (Intro + Elegibilidade)
2. CL_NIW_PRONG1.docx (ou A+B)
3. CL_NIW_PRONG2.docx (ou A+B)
4. CL_NIW_PRONG3.docx
5. CL_NIW_CONCLUSION.docx
```

Mesma mecânica do EB-1A: thumbnails → merge XML → validação.

---

## FASE 7 — SOC 4 AGENTES

Mesma mecânica do EB-1A/RFE, mas Persona 1 (Officer) avalia sob DHANASAR, não Kazarian.

---

## MÉTRICAS DE CALIBRAÇÃO (inferido de Andrea + Deni + sistema V3)

| Métrica | Valor Alvo | Mínimo |
|---------|-----------|--------|
| Total palavras | 25.000-40.000 | 20.000 |
| Total páginas | 50-80 | 40 |
| Evidências | 30-50 | 20 |
| Prong 1 % | 30% | 25% |
| Prong 2 % | 35% | 30% |
| Prong 3 % | 20% | 15% |
| Intro+Elegibilidade % | 10% | 5% |
| Conclusão+Index % | 5% | 3% |
| Fontes primárias | 15+ | 10 |
| Cartas de recomendação | 5-7 | 3 |

---

*Orquestrador de Cover Letter EB-2 NIW — inferido do sistema V3 (18 arquivos) + respostas do Cowork*
*Abril 2026*
