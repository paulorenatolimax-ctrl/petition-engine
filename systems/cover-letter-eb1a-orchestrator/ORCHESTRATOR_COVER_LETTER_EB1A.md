# ORQUESTRADOR DE COVER LETTER EB-1A — Petition Engine
## Pipeline Multi-Fase (Engenharia Reversa da VF Vitória Carolina)
## Versão: 1.0 — Abril 2026

---

## COMO ESTE ARQUIVO É USADO

O Petition Engine chama `claude -p` MÚLTIPLAS VEZES — uma por fase.
Cada fase gera um .docx separado. Ao final, consolida tudo em 1 documento.

NÃO tente gerar a Cover Letter inteira em 1 sessão.
Uma Cover Letter EB-1A tem 150-200 páginas. É IMPOSSÍVEL em 1 shot.

---

## PIPELINE DE 7 FASES

### FASE 0 — INVENTÁRIO E MAPEAMENTO
**Input:** Pasta do cliente com evidências (PDFs, DOCXs)
**Output:** `_inventory.json` com mapeamento evidência → critério

```
claude -p "
Leia TODOS os arquivos na pasta do cliente: [CLIENT_DOCS_PATH]
Leia o sistema em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/

TAREFA: Criar inventário de evidências.
1. Liste TODOS os PDFs/DOCXs na pasta do cliente
2. Para cada arquivo, identifique:
   - Tipo (certificado, carta, artigo, declaração, CV, etc.)
   - Critério(s) EB-1A aplicável(is) (C1-C10)
   - Título para o índice de evidências
3. Numere sequencialmente: Evidence 1, Evidence 2, ... Evidence N
4. Identifique o O*NET code do résumé do cliente
5. Identifique quais critérios C1-C10 são aplicáveis (mínimo 3)
6. Salve como JSON: [OUTPUT_DIR]/_inventory.json

Formato do JSON:
{
  \"client_name\": \"[NAME]\",
  \"onet_code\": \"XX-XXXX.XX\",
  \"onet_title\": \"[TITLE]\",
  \"field_of_endeavor\": \"[FIELD]\",
  \"criteria\": [\"C1\", \"C3\", \"C5\", \"C8\"],
  \"total_evidences\": N,
  \"evidences\": [
    {\"number\": 1, \"file\": \"resume.pdf\", \"title\": \"Résumé\", \"type\": \"resume\", \"criteria\": []},
    {\"number\": 2, \"file\": \"cert_award.pdf\", \"title\": \"Certificado Prêmio X\", \"type\": \"certificate\", \"criteria\": [\"C1\"]},
    ...
  ],
  \"cross_references\": {
    \"evidence_15\": [\"C1\", \"C7\"],
    \"evidence_23\": [\"C2\", \"C5\"]
  }
}
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

### FASE 1 — PARTE I (Introdução + Índice de Evidências)
**Input:** `_inventory.json` + sistema v5
**Output:** `CL_PART_I_Intro.docx` (~10-15% do total)

```
claude -p "
Leia o sistema em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/
Leia o inventário: [OUTPUT_DIR]/_inventory.json
Leia os arquivos de evidência do cliente: [CLIENT_DOCS_PATH]

TAREFA: Gerar a PARTE I da Cover Letter EB-1A.

CONTEÚDO OBRIGATÓRIO:
1. CAPA (formato carta):
   - Data à direita
   - 'To: U.S. Citizenship and Immigration Services'
   - Bloco metadata verde #D6E1DB: Ref, Petitioner/Beneficiary, Type of Petition, Classification, Field
   - NÃO fazer page break depois da capa

2. APRESENTAÇÃO DO CASO (~3 parágrafos):
   - 1ª pessoa (\"Apresento esta petição...\")
   - Nome completo, campo, O*NET code
   - Resumo da trajetória profissional (3-5 linhas)
   - Quantos critérios, quantas evidências

3. ENQUADRAMENTO LEGAL GERAL:
   - INA § 203(b)(1)(A)
   - 8 C.F.R. § 204.5(h)(3) — Kazarian two-step framework
   - PA-2025-16 (atualização 2025)
   - Mukherji v. Miller (District of Nebraska, 2024)
   - Explicar Step 1 (critérios) e Step 2 (totality analysis)

4. ÍNDICE DE EVIDÊNCIAS:
   - Listar Evidence 1 a N com título e tipo
   - Usar tabela com bordas APENAS horizontais
   - [THUMBNAIL — Exhibit X] placeholder para cada

5. SUMÁRIO DOS CRITÉRIOS:
   - Quadro mostrando quais critérios e quais evidências em cada

FORMATAÇÃO: Garamond 100%, margens L=2cm R/T/B=1.5cm, verde #D6E1DB, creme #FFF8EE
IDIOMA: Português brasileiro (exceto termos legais em inglês)
VOZ: 1ª pessoa sempre

Salvar como: [OUTPUT_DIR]/CL_PART_I_Intro.docx
Palavras alvo: 5.000-8.000
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

### FASE 2 — STEP 1: CRITÉRIOS (1 execução por critério)
**Input:** `_inventory.json` + templates C1-C10 + evidências
**Output:** `CL_C[N].docx` ou `CL_C[N]_A.docx`, `CL_C[N]_B.docx` para critérios grandes

Para CADA critério identificado no inventário, executar:

```
claude -p "
Leia o sistema em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/
Leia ESPECIFICAMENTE: TEMPLATE_C[N]_*.md, FORMATTING_SPEC.md, FORBIDDEN_CONTENT.md
Leia o inventário: [OUTPUT_DIR]/_inventory.json
Leia as evidências relevantes para o Critério [N]: [lista de PDFs do inventário]

TAREFA: Gerar o CRITÉRIO [N] — [NOME DO CRITÉRIO] da Cover Letter EB-1A.
Referência regulatória: 8 C.F.R. § 204.5(h)(3)([ALÍNEA])

ESTRUTURA OBRIGATÓRIA (do template):
1. Enquadramento Legal:
   - Citação do C.F.R. específico
   - USCIS Policy Manual requirements
   - PA-2025-16 + Mukherji v. Miller
   - Definição do campo + O*NET code

2. Tabela Sinóptica:
   - Evidence # | Tipo | Significância | Status
   - Bordas APENAS horizontais

3. Para CADA evidência (da mais forte à mais fraca):
   - 'Evidence XX.' em bold verde #2E7D32
   - (I) O que é / Contexto institucional
   - (II) O que demonstra / Relevância regulatória
   - (III) Defesa preemptiva (costurada no texto, NÃO seção separada)
   - [THUMBNAIL — Exhibit XX] placeholder
   - 150-400 palavras por evidence block

4. Conclusão do critério (~2-3 parágrafos)

REGRAS:
- Mínimo [MIN_EVIDENCES] evidence blocks para este critério
- 1ª pessoa sempre
- Português brasileiro
- NUNCA 'satisfeito/satisfaz' sobre critérios
- NUNCA seção 'Objeções Antecipadas' (costurar no texto)
- Evidence blocks com fundo #FFF8EE (creme)
- Garamond 100%
- Se critério tem [EVIDENCE_COUNT] evidências:
  - 4 ou menos → arquivo único
  - 5 a 8 → dividir em Parte A + Parte B
  - 9 ou mais → dividir em Parte A + B + C

Palavras alvo: [TARGET_WORDS] (calibrar pela tabela abaixo)
Salvar como: [OUTPUT_DIR]/CL_C[N].docx (ou _A.docx, _B.docx se dividido)
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

#### Calibração de palavras por critério (baseado na VF Vitória):

| Critério | Evidências típicas | Palavras alvo | % do total |
|----------|-------------------|---------------|-----------|
| C1 Premiações | 3-8 | 3.000-5.000 | 5-7% |
| C2 Associações | 3-8 | 2.000-4.000 | 3-5% |
| C3 Material Publicado | 5-12 | 8.000-12.000 | 10-15% |
| C4 Julgamento | 3-9 | 3.000-5.000 | 5-7% |
| C5 Contribuições Originais | 5-15 | 8.000-12.000 | 12-17% |
| C6 Artigos Acadêmicos | 3-8 | 3.000-6.000 | 5-8% |
| C7 Exposições | 3-9 | 3.000-8.000 | 5-10% |
| C8 Papel de Liderança | 3-10 | 5.000-10.000 | 8-15% |

---

### FASE 3 — STEP 2: DETERMINAÇÃO FINAL DE MÉRITO
**Input:** Todos os .docx de critérios gerados + `_inventory.json`
**Output:** `CL_STEP2.docx` (~30-50% do total, mínimo 25%)

```
claude -p "
Leia o sistema em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/
Leia ESPECIFICAMENTE: ARCHITECT_COVER_LETTER_EB1.md (seção STEP 2), LEGAL_FRAMEWORK_2026.md
Leia o inventário: [OUTPUT_DIR]/_inventory.json
Leia TODOS os .docx de critérios já gerados em: [OUTPUT_DIR]/CL_C*.docx
Leia as evidências do cliente: [CLIENT_DOCS_PATH]

TAREFA: Gerar o STEP 2 — DETERMINAÇÃO FINAL DE MÉRITO da Cover Letter EB-1A.

REGRA CRÍTICA: O Step 2 NÃO é resumo do Step 1. É análise HOLÍSTICA e INTEGRATIVA.
MÍNIMO: 25% do documento total. ALVO: 30-50%.

ESTRUTURA OBRIGATÓRIA (6 seções):

SEÇÃO A — Enquadramento Regulatório para a Etapa 2
- Kazarian v. USCIS (596 F.3d 1115, 9th Cir. 2010) — Step 2 completo
- PA-2025-16 — como afeta a determinação final
- Mukherji v. Miller — implicações para a totalidade das evidências

SEÇÃO B — Síntese Consolidada das Evidências
- Integração de TODOS os critérios aprovados
- NÃO repetir o Step 1 — fazer análise CRUZADA
- Demonstrar que as evidências formam um MOSAICO coerente

SEÇÃO C — Continuidade Temporal: Aclamação Sustentada
- Timeline cronológica da carreira (YYYY-YYYY)
- Demonstrar sustained acclaim ao longo de ANOS (não eventos isolados)
- Cada marco conectado a evidência específica

SEÇÃO D — Referência Cruzada Cumulativa das Evidências
- Tabela mostrando evidências que servem MÚLTIPLOS critérios
- 3+ pathways argumentativos (caminhos de prova cruzada)
- Mostrar que as evidências se REFORÇAM mutuamente

SEÇÃO E — Benefício Prospectivo aos Estados Unidos
- O*NET code com dados BLS (salário, crescimento, demanda)
- O que os EUA GANHAM com a permanência do beneficiário
- Políticas federais alinhadas
- Impacto nacional quantificável

SEÇÃO F — Integração da Declaração Pessoal
- Referência à Evidence [N] (declaração pessoal do cliente)
- Como a narrativa pessoal confirma a trajetória documentada
- Conclusão final solicitando aprovação

FORMATAÇÃO: Igual ao resto do documento (Garamond, verde, creme)
IDIOMA: Português brasileiro
VOZ: 1ª pessoa

Palavras alvo: 20.000-30.000 (MÍNIMO 15.000)
Salvar como: [OUTPUT_DIR]/CL_STEP2.docx (ou dividir em A/B/C se necessário)
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

### FASE 4 — CONSOLIDAÇÃO (XML Merge)
**Input:** Todos os .docx (Part I + C1-C8 + Step 2)
**Output:** `Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx`

```
claude -p "
TAREFA: Consolidar todos os .docx da Cover Letter em 1 documento único.

Arquivos a consolidar (NESTA ORDEM):
[OUTPUT_DIR]/CL_PART_I_Intro.docx
[OUTPUT_DIR]/CL_C1.docx (ou CL_C1_A.docx + CL_C1_B.docx)
[OUTPUT_DIR]/CL_C2.docx
[OUTPUT_DIR]/CL_C3_A.docx + CL_C3_B.docx (+ C se existir)
[OUTPUT_DIR]/CL_C4.docx
[OUTPUT_DIR]/CL_C5_A.docx + CL_C5_B.docx (+ C se existir)
[OUTPUT_DIR]/CL_C6.docx
[OUTPUT_DIR]/CL_C7.docx
[OUTPUT_DIR]/CL_C8.docx (ou A+B)
[OUTPUT_DIR]/CL_STEP2.docx (ou A+B+C)

REGRAS DE MERGE:
1. NÃO usar docxcompose — PERDE IMAGENS
2. Fazer merge no nível XML:
   a) Unzip todos os .docx
   b) Usar o primeiro como base
   c) Para cada .docx adicional:
      - Copiar word/media/* (renomear se conflito)
      - Atualizar rIds em document.xml.rels
      - Copiar <w:body> (exceto <w:sectPr> final)
      - Inserir page break entre documentos
   d) Repack como ZIP → .docx
3. Verificar contagem de imagens antes/depois

PÓS-MERGE:
- Paginação contínua
- Footer: 'EB-1A | I-140 Petition — Cover Letter [CLIENT NAME] | Page X of Y'
- Header: consistente em todas as páginas
- Verificar que TODAS as imagens sobreviveram ao merge

Salvar como: [OUTPUT_DIR]/Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

### FASE 5 — THUMBNAILS
**Input:** DOCX consolidado + pasta de evidências
**Output:** DOCX com thumbnails inseridos

```
python3 /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/insert_thumbnails.py \
  "[OUTPUT_DIR]/Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx" \
  "[CLIENT_DOCS_PATH]"
```

---

### FASE 6 — SEPARATION OF CONCERNS (Revisão Cruzada)
**Input:** DOCX com thumbnails
**Output:** REVIEW_*.md + DOCX_REVIEWED.docx

```
claude -p "
Leia /Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md
Execute revisão completa do documento:
[OUTPUT_DIR]/Cover_Letter_EB1A_[CLIENT]_CONSOLIDATED.docx

Use os padrões de qualidade em:
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
| Palavras por evidence block | 150-400 | 100 |
| Defesas preemptivas por critério | 3+ | 2 |
| Thumbnails | 90 | = número de evidências |

---

## REGRAS INVIOLÁVEIS

1. NUNCA gerar Cover Letter EB-1A em 1 único `claude -p`
2. SEMPRE dividir em fases (mínimo: Intro + Critérios + Step 2)
3. SEMPRE gerar critérios grandes em partes (A+B ou A+B+C)
4. NUNCA usar docxcompose pra merge (perde imagens)
5. SEMPRE rodar insert_thumbnails.py após consolidação
6. SEMPRE rodar Separation of Concerns em sessão limpa
7. STEP 2 NUNCA pode ser menos que 25% do documento
8. CADA evidence block DEVE ter [THUMBNAIL] placeholder
9. TODAS as defesas preemptivas costuradas no texto (NUNCA seção separada)
10. Português brasileiro 100% (exceto termos legais inglês)

---

*Orquestrador baseado na engenharia reversa da VF Vitória Carolina (200 páginas, 85.819 palavras)*
*Compilado em Abril 2026*
