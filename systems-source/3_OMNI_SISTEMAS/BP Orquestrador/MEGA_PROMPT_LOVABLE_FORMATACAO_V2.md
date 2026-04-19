# INSTRUÇÕES PARA O LOVABLE — Ajuste de Formatação do BP Generator

## CONTEXTO

O BP Generator no Lovable já funciona — gera 42 seções via API Haiku usando os prompts do `bp-system-export-2026-03-22.json`. O conteúdo que sai é BOM. O problema é a FORMATAÇÃO do DOCX final. O documento sai com:

- Títulos sem negrito
- Notas de rodapé no meio do texto em vez de no final da seção
- Tabelas com zebra verde (linha sim, linha não) — precisa ser TODO branco
- Bordas laterais nas tabelas — precisa ser SEM bordas laterais
- Footer errado ou ausente
- Header ausente
- Parágrafos muito longos sem quebra
- Margens erradas

O conteúdo está correto. A formatação precisa ser ajustada para o padrão Ikaro.

---

## O QUE PRECISA MUDAR NO GERADOR DOCX

### 1. MARGENS (atualizar de 1" para Ikaro)
```
Top: 0.7"
Bottom: 0.6"
Left: 0.8"
Right: 0.6"
```

### 2. FONTE
- **Garamond** em TODO o documento (não Times New Roman)
- Corpo: 11pt regular
- H1 (bloco/categoria): 16-18pt bold, cor #584D42 (marrom escuro)
- H2 (seção): 13pt bold, cor #000000
- H3 (sub-seção): 11pt bold + italic
- Legenda de tabela: 10pt italic centralizado
- Footer: 8pt bold branco
- Header: 9pt italic cinza

### 3. TABELAS (mudança crítica)
**ANTES (errado):**
- Header cinza/verde
- Corpo com zebra (linha verde alternada)
- Bordas em todos os lados

**DEPOIS (correto — padrão Ikaro):**
- Header: fundo #DEDACB (marrom claro), texto bold 10pt
- Corpo: fundo 100% BRANCO (sem zebra, sem alternância)
- Bordas: SOMENTE top e bottom (SEM bordas laterais), cor #CCCCCC, finas
- Parágrafo introdutório (mínimo 2 frases) ANTES de cada tabela
- Parágrafo analítico (mínimo 1 frase) DEPOIS de cada tabela

### 4. FOOTER (TODAS as páginas exceto capa)
- Barra sólida cor #584D42 em toda a largura
- Texto em branco bold: "CONFIDENTIAL — [NOME DA EMPRESA] — Business Plan 2026"
- Número de página à direita: "Page X of Y"

### 5. HEADER (TODAS as páginas exceto capa)
- Texto italic 9pt alinhado à direita: nome da empresa
- Linha fina cinza (#999999) abaixo

### 6. NOTAS DE RODAPÉ
**ANTES (errado):** Notas aparecem como texto inline no meio dos parágrafos

**DEPOIS (correto):**
- Referências numéricas no texto: ¹ ² ³ (superscript)
- Notas no FINAL de cada seção (não no meio do texto)
- Separadas por linha horizontal fina cinza
- Formato: ¹ Fonte, Título do Relatório, Ano.

### 7. PARÁGRAFOS
- Máximo 200 palavras por parágrafo
- Se maior, QUEBRAR em dois na fronteira de frase mais próxima do meio
- Espaçamento: 6pt depois
- Line spacing: 1.15
- Alinhamento: justificado

### 8. PAGE BREAKS
- Page break ANTES de cada bloco (6 blocos)
- Cada bloco começa com H1 (16-18pt bold marrom #584D42) + linha marrom abaixo

### 9. GRÁFICOS (matplotlib)
- TODOS os labels em INGLÊS (Year 1, Gross Revenue, Net Income, Employees, etc.)
- Cores: #584D42 (barras), #D0DDD6 (EBITDA), #C0392B (negativo)
- DPI: 200
- Largura no DOCX: 5.5 inches, centralizado

### 10. CAPA
- "BUSINESS PLAN" em 42pt bold marrom (#584D42)
- Subtítulo em 12pt
- "PROPOSED BY:" + Nome + Email + Localização + Data
- SEM header/footer na capa

---

## PALETA DE CORES COMPLETA

```
#584D42  — Marrom escuro (footer, H1, barras de gráfico)
#DEDACB  — Marrom claro (header de tabela)
#D0DDD6  — Verde claro (NÃO usar em tabelas — apenas em gráficos EBITDA)
#000000  — Texto principal
#666666  — Texto secundário, legendas
#CCCCCC  — Bordas de tabela (finas)
#999999  — Linha do header
#F5F5F5  — Fundo de caixas institucionais (se aplicável)
#FFFFFF  — Fundo de corpo de tabela (SEMPRE branco)
```

---

## BENCHMARK VISUAL

O padrão-ouro é o BP do Ikaro:
`/Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/BP Orquestrador/VF_business plan_ikaro ferreira souza.pdf`

Abra, analise cada página, e replique o estilo visual.

---

## SISTEMA DE GERAÇÃO (já funcional)

O export JSON com 42 prompts está em:
`/Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/BP Orquestrador/bp-system-export-2026-03-22.json`

Cada seção tem:
- `id`: S1 a S40
- `name`: nome da seção
- `category`: bloco ao qual pertence
- `systemPrompt`: prompt completo (~27-30K chars) com todas as regras

O Lovable chama a API Haiku com cada prompt → recebe conteúdo markdown → monta DOCX.

A parte do conteúdo FUNCIONA. O que precisa mudar é COMO o DOCX é montado a partir do markdown recebido.

---

## FORMATTING_SPEC ATUALIZADA

O arquivo `FORMATTING_SPEC_BP.md` no sistema precisa ser atualizado com as especificações acima. As mudanças principais são:

1. Times New Roman → **Garamond**
2. Margens 1" → **0.7/0.6/0.8/0.6**
3. Tabelas com zebra → **corpo branco, sem bordas laterais**
4. Footer genérico → **barra marrom com CONFIDENTIAL**
5. Header ausente → **nome da empresa italic à direita**

---

## REGRAS DE CONTEÚDO (já estão nos prompts, mas reforçar)

- Output 100% em PORTUGUÊS (texto corrido)
- Gráficos 100% em INGLÊS (labels, títulos, eixos)
- NUNCA "consultoria", "consultor", "consulting"
- NUNCA "EB-1", "EB-2", "NIW", "green card", "visto", "imigração", "USCIS", "petition"
- NUNCA "I believe", "we believe", "I think", "we think"
- NUNCA "in conclusion", "to summarize"
- NUNCA "pé quadrado" — usar "metro quadrado"
- "proposed endeavor" → "business venture"
- Dados financeiros = planilha (NUNCA inventar números)
- Cada seção: 500-700 palavras
- Target total: 60-75 páginas

---

## CHECKLIST PRÉ-ENTREGA

- [ ] Garamond em TUDO
- [ ] Margens 0.7/0.6/0.8/0.6
- [ ] Tabelas: header marrom, corpo branco, sem bordas laterais
- [ ] Footer marrom com CONFIDENTIAL em TODAS as páginas
- [ ] Header italic com nome da empresa
- [ ] Notas de rodapé NO FINAL de cada seção (não no meio)
- [ ] Gráficos com labels em INGLÊS
- [ ] Parágrafos máximo 200 palavras
- [ ] Page break entre blocos
- [ ] Zero termos proibidos
- [ ] 60-75 páginas total
