# FORMATTING_SPEC — Especificações Técnicas de Formatação
## Cover Letter EB-1A — Padrão PROEX
## v2.1 — Atualizado com lições do Caso Andrea Justino (Fevereiro 2026)

---

## REGRA ZERO
Todo documento gerado DEVE usar estes valores EXATOS. Não aproximar, não arredondar, não "adaptar".

---

## Capa (Cover Page) — FORMATO CARTA (Lição Andrea)

**REGRA ABSOLUTA**: A capa NÃO é uma "title page" centrada. É um formato de CARTA FORMAL que flui diretamente para o conteúdo da Parte I, conforme o benchmark Carlos Avelino / Bruno Cipriano.

### Estrutura da Capa:
```
1. Data — alinhada à DIREITA: "[Month] [DD], [YYYY]."
2. Destinatário — alinhado à ESQUERDA:
   "To: USCIS"
   "Immigration Officer"
3. Bloco de metadados — fundo sage green (#C5E0B4):
   | Campo | Valor |
   |-------|-------|
   | Ref: | EB-1 Immigrant Petition for Permanent Residency with Extraordinary Ability |
   | Petitioner/Beneficiary: | [NOME COMPLETO EM MAIÚSCULAS] |
   | Nature of Submission: | ORIGINAL SUBMISSION |
   | Type of Petition: | I-140, EB-1 Extraordinary Ability |
   | Classification Sought: | Immigration and Nationality Act § 203(b)(1)(A) |
   | Field of Extraordinary Ability: | [Campo] (BLS O*NET [código]) |
4. Saudação: "Dear USCIS Officer,"
5. Texto introdutório — SEM page break antes do conteúdo da Parte I
```

### ERROS COMUNS (evitar):
```
❌ Capa centrada estilo "title page" com nome grande no meio
❌ Page break entre capa e conteúdo da Parte I
❌ Fundo azul escuro (#1F3864) no bloco de metadados
❌ Logo ou imagens na capa
✅ Formato carta simples, profissional, seguindo benchmark
```

---

## Página
```
page_width:    7772400 EMU  (8.5 inches — US Letter)
page_height:  10058400 EMU  (11 inches — US Letter)
top_margin:     539750 EMU  (1.5 cm)
bottom_margin:  539750 EMU  (1.5 cm)
left_margin:    720090 EMU  (2.0 cm — lado de encadernação)
right_margin:   539750 EMU  (1.5 cm)
```

## Tipografia — 100% Garamond

### Título do Critério (1 por documento)
```
font:       Garamond
size:       165100 EMU (13pt)
bold:       true
italic:     true
color:      #000000 (preto)
shading:    #C5E0B4 (sage green)
alignment:  JUSTIFY
spacing_after: 4pt
```
Formato: `Criterion X — [texto em inglês da regulamentação] (8 C.F.R. § XXX)`

### Subtítulo (Part A/B/C)
```
font:       Garamond
size:       152400 EMU (12pt)
bold:       true
italic:     true
color:      #808080 (gray)
shading:    nenhum
alignment:  CENTER
spacing_after: 8pt
```
Formato: `Part A: [descrição] (Evidence XX–YY) — REVISÃO 2`

### Header de Seção Principal
```
font:       Garamond
size:       177800 EMU (14pt)
bold:       true
italic:     false
color:      #000000
shading:    #C5E0B4
alignment:  LEFT
spacing_before: 18pt
spacing_after: 8pt
```
Usado para: Legal Framework, cada Evidence section, Synopsis, Conclusão

### Subsection (numeral romano)
```
font:       Garamond
size:       152400 EMU (12pt)
bold:       true
italic:     false
color:      #000000
shading:    nenhum
alignment:  LEFT
spacing_before: 12pt
spacing_after: 6pt
```
Formato: `I. Título da Subseção`

### Corpo do Texto
```
font:       Garamond
size:       152400 EMU (12pt)
bold:       false
italic:     false
color:      #000000
shading:    nenhum
alignment:  JUSTIFY
spacing_before: 0
spacing_after: 4pt
line_spacing: 14.5pt
```

### Evidence Title (dentro do evidence block)
```
font:       Garamond
size:       127000 EMU (10pt)
bold:       true
italic:     false
color:      #2E7D32 (green)
```
Formato: `Evidence XX. [Título Completo]`

### Evidence Metadata (dentro do evidence block)
```
font:       Garamond
size:       127000 EMU (10pt)
bold:       false
italic:     false
color:      #000000
```
Formato linhas:
```
Type: [tipo] | Source: [fonte]
Date: [data] | URL: [url]
Description & Impact/Relevance: [descrição]
```

### Texto de Tabela
```
font:       Garamond
size:       127000 EMU (10pt)
bold:       false (corpo) / true (header)
color:      #000000
```

### Footnotes
```
font:       Garamond
size:       127000 EMU (10pt)
color:      #000000
formato:    [N] texto da nota. URL.
```

### Footer
```
font:       Garamond
size:       101600 EMU (8pt)
color:      #808080
alignment:  CENTER
formato:    EB-1 | I-140 Petition — Cover Letter [NOME]    |    Page X of Y
```

### Placeholder (quando thumbnail não disponível)
```
font:       Garamond
size:       101600 EMU (8pt)
color:      #999999
texto:      [THUMBNAIL]
```

---

## Cores

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| Sage Green | #C5E0B4 | 197, 224, 180 | Headers shading, table headers |
| Cream | #FFF2CC | 255, 242, 204 | Evidence blocks background |
| Evidence Green | #2E7D32 | 46, 125, 50 | "Evidence XX." texto |
| Black | #000000 | 0, 0, 0 | Todo texto, headers |
| Gray | #808080 | 128, 128, 128 | Subtítulos, footer, separadores |
| Placeholder | #999999 | 153, 153, 153 | [THUMBNAIL] |
| Yellow Highlight | (highlight) | — | Placeholders [VERIFICAR] |

**NUNCA**: azul (#0000FF ou qualquer variante) em headers ou texto.

---

## Evidence Block (Tabela)

### Estrutura
```
Tabela: 1 linha × 2 colunas
Largura col 0: ~3.5cm (para thumbnail)
Largura col 1: restante
Borders: nenhuma visível (ou hairline gray)
Shading ambas células: #FFF2CC
```

### Coluna 0 (Thumbnail)
- Imagem da primeira página do PDF, 160px largura
- Gerada via: `pdftoppm -f 1 -l 1 -png -r 150 arquivo.pdf thumb`
- Resize: `convert thumb-1.png -resize 160x thumb_final.png`
- Se não disponível: texto "[THUMBNAIL]" em 8pt gray #999999

### Coluna 1 (Metadata)
```
Linha 1: "Evidence XX. [Título]" — bold, #2E7D32
Linha 2: "Type: [tipo] | Source: [fonte]"
Linha 3: "Date: [data] | URL: [url]"
Linha 4: "Description & Impact/Relevance: [texto]"
```

---

## Bordas de Tabelas (Lição Andrea — CRÍTICO)

**REGRA**: Tabelas no corpo da cover letter usam APENAS bordas horizontais. NUNCA bordas laterais (box borders).

```
borders: {
  top:              SINGLE, 1pt, #000000
  bottom:           SINGLE, 1pt, #000000
  insideHorizontal: SINGLE, 1pt, #000000
  left:             NONE ← SEM borda lateral esquerda
  right:            NONE ← SEM borda lateral direita
  insideVertical:   NONE ← SEM bordas verticais internas
}
```

### EXCEÇÃO:
- Evidence blocks (tabela de thumbnail) — sem bordas visíveis (já é padrão)
- Bloco de metadados da capa — pode ter borda leve se necessário

```
❌ Tabela com box borders (parece Excel/planilha)
✅ Tabela com linhas horizontais apenas (visual limpo, profissional)
```

---

## Synopsis Table

### Header Row
```
shading:    #C5E0B4
font:       Garamond 10pt bold
color:      #000000
```

### Body Rows
```
shading:    nenhum (alternância branco/light gray opcional)
font:       Garamond 10pt regular
color:      #000000
```

---

## Separadores
```
caractere:  ─ (U+2500) × 60
font:       Garamond 8pt
color:      #B4B4B4
alignment:  CENTER
spacing:    6pt before, 6pt after
```

---

## Conversões EMU ↔ Pt ↔ Cm

| EMU | Pt | Cm | Uso |
|-----|-----|-----|-----|
| 101600 | 8pt | — | Footer, placeholder |
| 127000 | 10pt | — | Tabelas, evidence, footnotes |
| 139700 | 11pt | — | (evitar — inconsistência no C6) |
| 152400 | 12pt | — | Corpo, subtítulo, subsections |
| 165100 | 13pt | — | Título do critério |
| 177800 | 14pt | — | Headers de seção |
| 539750 | — | 1.5cm | Margens top/bottom/right |
| 720090 | — | 2.0cm | Margem left (encadernação) |

Fórmula: 1pt = 12700 EMU | 1cm ≈ 360000 EMU | 1 inch = 914400 EMU

---

## Prefixo de Evidência (Lição Andrea)

**REGRA**: Sempre "Evidence XX" por extenso. NUNCA abreviar como "Ev. XX".

```
❌ Ev. 16    Ev. 29    [Ev. 17, 19, 21]
✅ Evidence 16    Evidence 29    [Evidence 17, 19, 21]
```

Aplica-se a: índice de evidências, evidence blocks, referências inline, synopsis tables, footnotes, e qualquer menção no texto.

---

## Labeling: STEP 1 / STEP 2 (Lição Andrea)

**REGRA**: "STEP" sempre em MAIÚSCULAS quando referindo às fases de Kazarian.

```
❌ Step 1    Step 2    "análise do Step 2"
✅ STEP 1    STEP 2    "análise do STEP 2"
```

### Naming do documento STEP 2:
```
Header: "STEP 2 — Part [A/B/C]"
Seção: "STEP 2 — Avaliação Holística — Aclamação Sustentada (Sustained Acclaim)"
Footer: "EB-1 | I-140 Petition — Cover Letter [NOME] — STEP 2    |    Page X of Y"
```

---

*v2.1 — Atualizado em 26/02/2026 com lições do Caso Andrea Justino.*
