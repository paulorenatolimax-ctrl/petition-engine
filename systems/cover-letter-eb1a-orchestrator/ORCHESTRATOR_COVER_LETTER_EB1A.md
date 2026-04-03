# ORQUESTRADOR DE COVER LETTER EB-1A — Petition Engine
## Pipeline Multi-Fase V2 (Validado pelo Cowork contra VF Vitória Carolina)
## Versão: 2.0 — Abril 2026

---

## COMO ESTE ARQUIVO É USADO

O Petition Engine chama `claude -p` MÚLTIPLAS VEZES — uma por fase/sub-fase.
Cada fase gera um .docx separado. Ao final, consolida tudo em 1 documento.

NÃO tente gerar a Cover Letter inteira em 1 sessão.
Uma Cover Letter EB-1A tem 150-200 páginas (~85.000 palavras). É IMPOSSÍVEL em 1 shot.

---

## PIPELINE DE 10 FASES

```
Fase 0   — Inventário e Mapeamento (evidências → JSON)
Fase 0.5 — Plano Estratégico (aprovação do Paulo ANTES de produzir)
Fase 1   — Parte I: Introdução + Índice de Evidências
Fase 2   — Step 1: Critérios (1 sessão POR critério, partes A/B/C para grandes)
Fase 3   — Step 2: Final Merits (3 sessões: A + B + C)
Fase 3.5 — Thumbnails (inserir ANTES do merge, em cada .docx individual)
Fase 4   — Consolidação (XML Merge — NÃO docxcompose)
Fase 4.5 — Validação Automatizada (validate_final_docx.py)
Fase 5   — Separation of Concerns (revisão cruzada em sessão limpa)
```

---

## REGRAS TRANSVERSAIS (incluir em TODOS os prompts claude -p)

Cada sessão `claude -p` é INDEPENDENTE — não herda contexto de sessões anteriores.
Por isso, CADA prompt DEVE incluir estas regras:

```
## REGRAS INVIOLÁVEIS (INCLUIR EM TODO PROMPT)

### PROTOCOLO DE INTERAÇÃO (8 regras):
R1: NUNCA avançar sem ter lido TODOS os arquivos necessários
R3: Listar o que leu ANTES de escrever (confirmação de leitura)
R4: NUNCA gerar critério inteiro com 9+ evidências de uma vez — dividir em partes
R5: Auto-check de densidade contra benchmarks (Carlos Avelino ~72pg, Bruno Cipriano ~27pg)
R6: Inventário exaustivo com contagem de evidências, tabelas, subseções
R7: Validação mecânica antes de entregar (forbidden content, evidence bold, cores, borders)
R8: Buscar nas evidências do cliente — NUNCA inventar dados

### FORBIDDEN CONTENT (11 categorias — ZERO TOLERANCE):
Cat 0:  NUNCA "satisfeito/satisfaz/satisfies" sobre critérios (juízo de valor)
Cat 1:  NUNCA nomes proibidos (PROEX, Carlos Avelino, Bruno Cipriano, Renato Silveira, "Loper Light")
Cat 2:  NUNCA 3ª pessoa no corpo argumentativo ("o beneficiário") — SEMPRE 1ª pessoa ("apresento", "meu")
Cat 3:  NUNCA seção explícita "Objeções Antecipadas" — costurar no texto argumentativo
Cat 3B: NUNCA "jurídico"/"adjudicativo"/"independentes"/"Ev." — usar "regulatório"/"probatório"/"Evidence"
Cat 3C: NUNCA linguagem de existência para empresas planejadas (NOT YET established)
Cat 4:  NUNCA azul (#0000FF proibido), evidence block SEMPRE antes do texto argumentativo
Cat 5:  NUNCA Currículo Lattes, dados inventados, holdings inexistentes
Cat 6:  NUNCA afirmar Mukherji v. Miller como vinculante (é persuasivo, distrito de Nebraska)
Cat 7:  TUDO em português brasileiro (exceto: INA §, C.F.R. §, Kazarian, Mukherji, USCIS, O*NET, EB-1A, I-140, Step 1/2)
Cat 8:  Proporções: Intro 8-18%, Step 1 35-55%, Step 2 ≥25% (mín 30% ideal)
Cat 9:  ZERO artefatos de produção (EXPANSÃO:, TODO:, ████, contagem de palavras, meta-instruções)
Cat 10: ZERO URLs inventadas/truncadas
Cat 11: Substituição NUNCA é cega — verificar contexto antes de substituir

### FORMATAÇÃO OBRIGATÓRIA:
- Garamond 100% (NUNCA Arial, Calibri, Times)
- Margens: L=2.0cm, R=1.5cm, T=1.5cm, B=1.5cm
- Evidence blocks: fundo #FFF8EE (creme), Evidence XX em bold #2E7D32 (verde)
- Headers de seção: shading #D6E1DB (verde PROEX)
- Tabelas: bordas APENAS horizontais (ZERO bordas verticais)
- Footnotes: nativos do Word (<w:footnoteReference> + footnotes.xml), em português
- Imagens: wp:anchor + wrapSquare (NUNCA wp:inline — quebra tabelas)
- cantSplit=true em rows de tabelas (impede quebra de evidence blocks entre páginas)
- Footer: "EB-1A | I-140 Petition — Cover Letter [CLIENT NAME] | Page X of Y"

### MAPA SEMÂNTICO (construir na Fase 0, usar em TODAS as fases):
Dicionário entidade→evidência que previne erros de referência cruzada:
- marca_evidencia: {"Nome da Marca®": número}
- pessoa_evidencia: {"Nome Completo": número}
- veiculo_evidencia: {"Nome do Veículo": [números]}
- empresa_evidencia: {"Nome da Empresa": número}
- credencial_evidencia: {"Diploma/Registro": número}
```

---

## FASE 0 — INVENTÁRIO E MAPEAMENTO
**Input:** Pasta do cliente com evidências
**Output:** `_inventory.json` + `_semantic_map.json`

```
claude -p "
Leia TODOS os arquivos na pasta do cliente: [CLIENT_DOCS_PATH]
Leia o sistema em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/
Leia ESPECIFICAMENTE: SEMANTIC_CROSS_REFERENCE_MAP.md, EVIDENCE_NAMING_CONVENTION.md

TAREFA 1: Criar inventário de evidências.
1. Liste TODOS os PDFs/DOCXs na pasta do cliente
2. Para cada arquivo, identifique tipo, critério(s) aplicável(is), título
3. Numere sequencialmente: Evidence 1, Evidence 2, ... Evidence N
4. Identifique O*NET code do résumé
5. Identifique critérios C1-C10 aplicáveis (mínimo 3)
6. Identifique cross-references (evidências que servem múltiplos critérios)
7. Salve: [OUTPUT_DIR]/_inventory.json

TAREFA 2: Construir mapa semântico.
Para CADA entidade mencionada nos documentos:
- Marcas registradas → número da evidência
- Pessoas (recomendadores, parceiros) → número da evidência
- Empresas/Organizações → número da evidência
- Veículos de mídia → números das evidências
- Credenciais/Diplomas → número da evidência
Salve: [OUTPUT_DIR]/_semantic_map.json

TAREFA 3: Relatório de gaps.
- Quais critérios têm evidências insuficientes (< 3)?
- Quais evidências não mapeiam a nenhum critério?
- O O*NET code é compatível com o perfil?
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 0.5 — PLANO ESTRATÉGICO
**Input:** `_inventory.json` + `_semantic_map.json`
**Output:** `_strategic_plan.md` (REQUER APROVAÇÃO DO PAULO)

```
claude -p "
Leia: [OUTPUT_DIR]/_inventory.json
Leia: [OUTPUT_DIR]/_semantic_map.json
Leia: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/CHECKLIST_PRE_PRODUCAO.md

TAREFA: Gerar Plano Estratégico para aprovação do Paulo.

O plano DEVE conter:
1. CRITÉRIOS SELECIONADOS: Quais C1-C10 serão argumentados + justificativa
2. CRITÉRIOS DESCARTADOS: Quais NÃO serão argumentados + por quê
3. MAPA DE EVIDÊNCIAS: Para cada critério, quais evidências e em qual ordem
4. CAMPO DEFINIDO: Field of endeavor + O*NET code + validação
5. RISCOS: Pontos fracos do caso + estratégia de mitigação
6. ESTIMATIVA: Páginas e palavras por critério (usar tabela de calibração)
7. CROSS-REFERENCES: Evidências compartilhadas entre critérios

Salve: [OUTPUT_DIR]/_strategic_plan.md

⚠️ PRODUÇÃO SÓ COMEÇA APÓS APROVAÇÃO DESTE PLANO.
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 1 — PARTE I (Introdução + Índice de Evidências)
**Input:** `_inventory.json` + `_strategic_plan.md` (aprovado)
**Output:** `CL_PART_I_Intro.docx` (8-18% do total)

```
claude -p "
Leia o sistema em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/
Leia: ARCHITECT_COVER_LETTER_EB1.md, FORMATTING_SPEC.md, FORBIDDEN_CONTENT.md, LEGAL_FRAMEWORK_2026.md
Leia: [OUTPUT_DIR]/_inventory.json, [OUTPUT_DIR]/_strategic_plan.md
Leia evidências do cliente: [CLIENT_DOCS_PATH]

[INCLUIR REGRAS TRANSVERSAIS AQUI]

TAREFA: Gerar PARTE I da Cover Letter EB-1A em python-docx.

CONTEÚDO OBRIGATÓRIO:
1. CAPA (formato carta):
   - Data à direita: '[Month] [DD], [YYYY]'
   - 'To: U.S. Citizenship and Immigration Services / Immigration Officer'
   - Bloco metadata verde #D6E1DB: Ref, Petitioner/Beneficiary, Type, Classification, Field, O*NET

2. APRESENTAÇÃO (~3-4 parágrafos, 1ª pessoa):
   - Nome completo, campo, O*NET code
   - Trajetória profissional condensada
   - Quantos critérios (N) e quantas evidências (M)
   - 'Apresento esta petição Form I-140...'

3. ENQUADRAMENTO LEGAL (substancial, NÃO resumo):
   - INA § 203(b)(1)(A) — definição EB-1A completa
   - 8 C.F.R. § 204.5(h)(3) — os 10 critérios
   - Kazarian v. USCIS (596 F.3d 1115, 9th Cir. 2010) — two-step framework DETALHADO
   - PA-2025-16 (2025) — mudança para non-discretionary
   - Mukherji v. Miller (D. Neb. 2024) — implicações (persuasivo, não vinculante)
   - Step 1 vs Step 2 explicados com clareza

4. ÍNDICE DE EVIDÊNCIAS:
   - Tabela: Evidence # | Título | Tipo | Critério(s)
   - Bordas APENAS horizontais
   - [THUMBNAIL — Exhibit XX] placeholder para CADA evidência
   - Numeração sequencial sem gaps

5. SUMÁRIO DOS CRITÉRIOS:
   - Quadro: Critério | Evidências (faixas) | Descrição
   - Ex: 'C1 Premiações | Evidence 8-15 | 8 evidências documentais'

6. PARÁGRAFO DE TRANSIÇÃO para Step 1

Palavras alvo: 6.000-8.000
Salve: [OUTPUT_DIR]/CL_PART_I_Intro.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 2 — STEP 1: CRITÉRIOS (1+ sessão POR critério)

Para CADA critério no plano estratégico, executar:

### Critérios pequenos (≤4 evidências) — 1 sessão:
```
claude -p "
Leia: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/TEMPLATE_C[N]_*.md
Leia: FORMATTING_SPEC.md, FORBIDDEN_CONTENT.md, LEGAL_FRAMEWORK_2026.md
Leia: [OUTPUT_DIR]/_inventory.json, [OUTPUT_DIR]/_semantic_map.json
Leia evidências C[N]: [LISTA DE PDFs DO INVENTÁRIO]

[INCLUIR REGRAS TRANSVERSAIS AQUI]

TAREFA: Gerar CRITÉRIO [N] — [NOME] da Cover Letter EB-1A.
Referência: 8 C.F.R. § 204.5(h)(3)([ALÍNEA])

ESTRUTURA (do template C[N]):
1. Enquadramento Legal (INA + C.F.R. + Policy Manual + Kazarian + PA-2025-16 + Mukherji + O*NET)
2. Tabela sinóptica (Evidence # | Tipo | Significância | Status)
3. Para CADA evidência (da mais forte à mais fraca):
   - 'Evidence XX.' bold verde #2E7D32
   - Contexto institucional (quem, o quê, relevância)
   - Análise regulatória (como atende o requisito)
   - 3+ defesas preemptivas COSTURADAS no texto (NÃO seção separada)
   - [THUMBNAIL — Exhibit XX]
   - 500-1.500 palavras por evidence block + argumentação
4. Conclusão do critério (2-3 parágrafos)

AUTO-CHECK antes de entregar:
- [ ] Todas as evidências do inventário para C[N] foram cobertas
- [ ] Forbidden content: 0 violações
- [ ] Evidence XX. em bold #2E7D32
- [ ] Tabelas com bordas APENAS horizontais
- [ ] 1ª pessoa consistente
- [ ] Garamond 100%

Palavras alvo: [TARGET] (ver tabela de calibração)
Salve: [OUTPUT_DIR]/CL_C[N].docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

### Critérios grandes (5-8 evidências) — 2 sessões:
- Sessão A: Legal framework + Evidence 1 a [metade]
- Sessão B: Evidence [metade+1] a N + Synopsis + Conclusão
- **Prompt da Sessão B DEVE incluir:** `Leia [OUTPUT_DIR]/CL_C[N]_A.docx para manter continuidade`

### Critérios muito grandes (9+ evidências) — 3 sessões:
- Sessão A: Legal framework + Evidence 1 a [⅓]
- Sessão B: Evidence [⅓+1] a [⅔]
- Sessão C: Evidence [⅔+1] a N + Synopsis + Conclusão
- **Cada sessão lê output da anterior para continuidade**

#### Tabela de calibração (VF Vitória):

| Critério | Evidências típicas | Palavras alvo | % do total | Sessões |
|----------|-------------------|---------------|-----------|---------|
| C1 Premiações | 3-8 | 3.000-5.000 | 5-7% | 1-2 |
| C2 Associações | 3-8 | 2.000-4.000 | 3-5% | 1-2 |
| C3 Material Publicado | 5-12 | 8.000-12.000 | 10-15% | 2-3 |
| C4 Julgamento | 3-9 | 3.000-5.000 | 5-7% | 1-2 |
| C5 Contribuições Originais | 5-15 | 8.000-12.000 | 12-17% | 2-3 |
| C6 Artigos Acadêmicos | 3-8 | 3.000-6.000 | 5-8% | 1-2 |
| C7 Exposições | 3-9 | 3.000-8.000 | 5-10% | 1-2 |
| C8 Papel de Liderança | 3-10 | 5.000-10.000 | 8-15% | 2-3 |

---

## FASE 3 — STEP 2: DETERMINAÇÃO FINAL DE MÉRITO (3 sessões)

O Step 2 tem ~20.000-30.000 palavras. IMPOSSÍVEL em 1 sessão. Dividir em 3:

### Sessão 3A — Seções A + B (~8.000-10.000 palavras):
```
claude -p "
Leia: sistema v5 (ARCHITECT, LEGAL_FRAMEWORK_2026.md)
Leia: [OUTPUT_DIR]/_inventory.json, [OUTPUT_DIR]/_semantic_map.json
Leia TODOS os .docx de critérios: [OUTPUT_DIR]/CL_C*.docx

[INCLUIR REGRAS TRANSVERSAIS AQUI]

TAREFA: Gerar STEP 2 — PARTE A (Seções A + B).

SEÇÃO A — Enquadramento Regulatório para a Etapa 2:
- Kazarian Step 2 DETALHADO (totality of evidence, não mero checklist)
- PA-2025-16 — implicações para determinação final
- Mukherji v. Miller — como fortalece o caso (persuasivo)

SEÇÃO B — Síntese Consolidada das Evidências:
- NÃO repetir Step 1 — fazer análise CRUZADA e INTEGRATIVA
- Demonstrar que as evidências formam MOSAICO coerente
- Cada critério contribui para a narrativa global

REGRA: Step 2 NÃO é resumo. É análise HOLÍSTICA onde 1+1=3.
Palavras alvo: 8.000-10.000
Salve: [OUTPUT_DIR]/CL_STEP2_A.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

### Sessão 3B — Seções C + D (~8.000-10.000 palavras):
```
claude -p "
Leia: [OUTPUT_DIR]/CL_STEP2_A.docx (continuidade)
Leia: [OUTPUT_DIR]/_inventory.json, _semantic_map.json
Leia critérios: [OUTPUT_DIR]/CL_C*.docx

[INCLUIR REGRAS TRANSVERSAIS AQUI]

SEÇÃO C — Continuidade Temporal: Aclamação Sustentada:
- Timeline cronológica YYYY-YYYY com marcos conectados a evidências
- Demonstrar sustained acclaim ao longo de ANOS (não eventos isolados)

SEÇÃO D — Referência Cruzada Cumulativa:
- Tabela: evidências que servem MÚLTIPLOS critérios
- 3+ pathways argumentativos (caminhos de prova cruzada)
- Demonstrar que evidências se REFORÇAM mutuamente

Palavras alvo: 8.000-10.000
Salve: [OUTPUT_DIR]/CL_STEP2_B.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

### Sessão 3C — Seções E + F (~8.000-10.000 palavras):
```
claude -p "
Leia: [OUTPUT_DIR]/CL_STEP2_A.docx, CL_STEP2_B.docx (continuidade)
Leia: [OUTPUT_DIR]/_inventory.json
Leia evidências do cliente: [CLIENT_DOCS_PATH]

[INCLUIR REGRAS TRANSVERSAIS AQUI]

SEÇÃO E — Benefício Prospectivo aos Estados Unidos:
- O*NET code com dados BLS (salário mediano, crescimento, demanda)
- Políticas federais alinhadas (mínimo 3)
- Impacto nacional QUANTIFICÁVEL
- O que os EUA PERDEM se esta pessoa não ficar

SEÇÃO F — Integração da Declaração Pessoal:
- Evidence [N] (declaração pessoal)
- Como narrativa pessoal confirma trajetória documentada
- Conclusão final solicitando aprovação

Palavras alvo: 8.000-10.000
Salve: [OUTPUT_DIR]/CL_STEP2_C.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 3.5 — THUMBNAILS (ANTES do merge)
**Input:** Cada .docx individual + pasta de evidências do cliente
**Output:** .docx com thumbnails inseridos nos evidence blocks

Para CADA .docx de critério que tenha [THUMBNAIL] placeholders:
```
python3 insert_thumbnails.py "[OUTPUT_DIR]/CL_C[N].docx" "[CLIENT_DOCS_PATH]"
```

Regras do script:
- Detecta certificados de tradução na página 1 → usa página 2
- Gera thumbnail da 1ª página útil do PDF
- Insere na coluna 0 do evidence block (tabela 1×2)
- Converte wp:inline → wp:anchor + wrapSquare

---

## FASE 4 — CONSOLIDAÇÃO (XML Merge)
**Input:** Todos os .docx (com thumbnails)
**Output:** `Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx`

```
claude -p "
TAREFA: Consolidar todos os .docx em 1 documento único.

ORDEM DE MERGE:
[OUTPUT_DIR]/CL_PART_I_Intro.docx
[OUTPUT_DIR]/CL_C1.docx (ou A+B)
[OUTPUT_DIR]/CL_C2.docx
[OUTPUT_DIR]/CL_C3_A.docx + CL_C3_B.docx (+ C)
[...todos os critérios na ordem...]
[OUTPUT_DIR]/CL_STEP2_A.docx + CL_STEP2_B.docx + CL_STEP2_C.docx

REGRAS DE MERGE:
1. NÃO usar docxcompose — PERDE IMAGENS
2. Merge XML:
   a) Unzip todos os .docx
   b) Primeiro = base
   c) Para cada adicional: copiar media/ (renomear se conflito), atualizar rIds, copiar body (exceto sectPr final)
   d) Page break entre documentos (APENAS antes de CRITÉRIO e STEP 2)
   e) Repack ZIP → .docx
3. wp:inline → wp:anchor + wrapSquare (todas as imagens)
4. cantSplit=true em todas as rows de tabelas
5. tblW w='5000' type='pct' + jc val='center' (tabelas 100% largura)
6. Verificar contagem imagens antes/depois (DEVE ser igual)
7. Paginação contínua
8. Footer: 'EB-1A | I-140 Petition — Cover Letter [CLIENT NAME] | Page X of Y'

Salve: [OUTPUT_DIR]/Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 4.5 — VALIDAÇÃO AUTOMATIZADA
**Input:** DOCX consolidado
**Output:** Relatório de validação

```
python3 validate_final_docx.py "[OUTPUT_DIR]/Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx"
```

Verifica:
- Forbidden content (11 categorias)
- Proporções (Intro 8-18%, Step 1 35-55%, Step 2 ≥25%)
- Fonts (Garamond 100%)
- Cores (verde #D6E1DB, creme #FFF8EE, evidence verde #2E7D32, ZERO azul)
- Contagem de imagens/tabelas/footnotes
- Artefatos de produção (TODO:, EXPANSÃO:, ████)
- Evidence numbering (sequencial, sem gaps)

Se FALHAR → voltar à fase relevante e corrigir.

---

## FASE 5 — SEPARATION OF CONCERNS (Revisão Cruzada)
**Input:** DOCX validado
**Output:** `REVIEW_*.md` + DOCX corrigido

**NOTA:** Esta fase NÃO existia no sistema v5/v6 original. É feature nova que complementa o validate_final_docx.py com revisão semântica por 4 personas.

```
claude -p "
Leia /Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md
Execute revisão completa do documento:
[OUTPUT_DIR]/Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx

Use padrões de qualidade:
/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## MÉTRICAS DE CALIBRAÇÃO (VF Vitória Carolina)

| Métrica | Valor Referência | Mínimo Aceitável |
|---------|-----------------|------------------|
| Total palavras | 85.819 | 50.000 |
| Total páginas | ~200 | ~120 |
| Evidence blocks | 83 | 30+ |
| Critérios documentados | 8 | 3 (mínimo legal) |
| Step 2 % do total | 26,9% | 25% |
| Part I % do total | 7,4% | 5% |
| Palavras por evidence block + argumentação | 500-1.500 | 300 |
| Defesas preemptivas por critério | 3+ | 2 |
| Thumbnails | = evidências com PDF | — |
| Sessões claude -p (caso 8 critérios) | ~15-20 | 10 |

---

## REGRAS INVIOLÁVEIS

1. NUNCA gerar Cover Letter EB-1A em 1 único `claude -p`
2. SEMPRE Fase 0.5 (Plano Estratégico) ANTES de produzir
3. SEMPRE dividir critérios grandes em partes A/B/C (cada parte = 1 sessão)
4. SEMPRE dividir Step 2 em 3 sessões (A/B/C)
5. SEMPRE inserir thumbnails ANTES do merge (Fase 3.5)
6. NUNCA usar docxcompose pra merge (perde imagens)
7. SEMPRE rodar validate_final_docx.py após consolidação (Fase 4.5)
8. STEP 2 NUNCA pode ser menos que 25% do documento
9. CADA evidence block DEVE ter [THUMBNAIL] placeholder
10. TODAS as defesas preemptivas costuradas no texto (NUNCA seção separada)
11. Português brasileiro 100% (exceto termos legais inglês)
12. Cada sessão B/C DEVE ler output da sessão A/B anterior para continuidade
13. Mapa semântico construído na Fase 0, usado em TODAS as fases
14. FORBIDDEN_CONTENT (11 categorias) incluído em CADA prompt

---

*Orquestrador V2 — validado pelo Cowork contra VF Vitória Carolina*
*Incorpora 6 correções críticas + 5 importantes + 4 desejáveis da revisão*
*Abril 2026*
