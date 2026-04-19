# FORMATTING_SPEC — Especificações Técnicas de Formatação
## Cover Letter EB-1A — Padrão PROEX
## v4.0 — Atualizado 17/03/2026 — Nova paleta de cores PROEX, evidence block com thumbnail branco

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
3. Bloco de metadados — fundo verde PROEX (#D6E1DB):
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
shading:    #D6E1DB (verde PROEX)
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
shading:    #D6E1DB
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
| Verde PROEX | #D6E1DB | 214, 225, 219 | Headers de seção principal, shading de título de critério, bloco metadados da capa |
| Bege/Marrom | #E3DED1 | 227, 222, 209 | Sub-headers (Part A/B/C), headlines de tabelas/quadros, synopsis table header |
| Cinza Claro | #F2F2F2 | 242, 242, 242 | Terceiro nível (sub-sub-itens), linhas alternadas de tabelas |
| Creme Evidence | #FFF8EE | 255, 248, 238 | Evidence blocks — APENAS coluna de metadados (coluna 1) |
| Evidence Green | #2E7D32 | 46, 125, 50 | "Evidence XX." texto |
| Black | #000000 | 0, 0, 0 | Todo texto, headers |
| Gray | #808080 | 128, 128, 128 | Subtítulos, footer, separadores |
| Placeholder | #999999 | 153, 153, 153 | "PDF pendente" |
| Yellow Highlight | (highlight) | — | Placeholders [VERIFICAR] |

### Hierarquia de cores:
```
Nível 1 (principal): #D6E1DB (verde PROEX) — títulos de critério, headers de seção
Nível 2 (sub-item):  #E3DED1 (bege/marrom) — Part A/B/C, headers de tabela
Nível 3 (detalhe):   #F2F2F2 (cinza claro) — linhas alternadas, sub-sub-itens
Evidence blocks:      #FFF8EE (creme suave) — APENAS na coluna de metadados
```

**NUNCA**: azul (#0000FF ou qualquer variante) em headers ou texto.
**NUNCA**: #C5E0B4 (paleta antiga, descontinuada na v4).

---

## Evidence Block (Tabela)

### Estrutura
```
Tabela: 1 linha × 2 colunas
Largura col 0: ~3.5cm (para thumbnail)
Largura col 1: restante
Borders: nenhuma visível (ou hairline gray)
Shading coluna 0 (thumbnail): NENHUM (fundo branco)
Shading coluna 1 (metadata):  #FFF8EE (creme suave)
Row property: cantSplit = true (impede quebra entre páginas)
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
shading:    #D6E1DB
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

---

## ADIÇÕES v3.0 — Lições Caso Renato Silveira v19→v23

### Lógica de Extração de Thumbnails

> **Lição:** Evidence 52 usou automaticamente a página 1 do PDF como thumbnail, que era o certificado do tradutor TMS — não o documento real. Acontece com TODOS os documentos traduzidos profissionalmente.

**REGRA: Antes de extrair thumbnail, verificar a página 1.**

| Conteúdo da Página 1 | Ação |
|---|---|
| Texto normal do documento | Usar página 1 como thumbnail |
| "AFFIDAVIT OF TRANSLATION ACCURACY" | **PULAR** — usar página 2 |
| "CERTIFIED TRANSLATION" / "TMS Translations" | **PULAR** — usar página 2 |
| "CERTIFICADO DE TRADUÇÃO" / "ATA" | **PULAR** — usar página 2 |
| Capa genérica/logo institucional | Confirmar com Paulo; default = página 2 |

**Comando padrão:**
```bash
# PASSO 1: Verificar se página 1 é certificado de tradução
PAGE1_TEXT=$(pdftotext -f 1 -l 1 "Evidence_XX.pdf" - 2>/dev/null)
if echo "$PAGE1_TEXT" | grep -qi "affidavit\|translation accuracy\|TMS Translations\|certified translation"; then
    START_PAGE=2
else
    START_PAGE=1
fi

# PASSO 2: Extrair thumbnail da página correta
pdftoppm -png -f $START_PAGE -l $START_PAGE -r 150 "Evidence_XX.pdf" thumb
```

---

### Footnotes Nativos — Regra Obrigatória

> **Lição:** O sistema gerou 5 seções "Notas / Sources" como texto no corpo do documento. A conversão manual para 43 footnotes nativos do Word gerou 6 footnotes órfãs e consumiu horas de trabalho.

**PROIBIDO:** Gerar seções de texto "Notas", "Sources", "Referências" no corpo do documento.

**OBRIGATÓRIO:** Toda referência bibliográfica/fonte DEVE ser footnote nativo do Word desde a geração:

```xml
<!-- NO CORPO: referência ao footnote -->
<w:r>
  <w:rPr>
    <w:rStyle w:val="Refdenotaderodap"/>
  </w:rPr>
  <w:footnoteReference w:id="[ID]"/>
</w:r>

<!-- EM footnotes.xml: conteúdo do footnote -->
<w:footnote w:id="[ID]">
  <w:p>
    <w:r>
      <w:rPr>
        <w:rStyle w:val="Refdenotaderodap"/>
      </w:rPr>
      <w:footnoteRef/>
    </w:r>
    <w:r>
      <w:rPr>
        <w:sz w:val="18"/>  <!-- 9pt -->
        <w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/>
      </w:rPr>
      <w:t xml:space="preserve"> [Texto da fonte]</w:t>
    </w:r>
  </w:p>
</w:footnote>
```

**Estilo:** 9pt Garamond, estilo "Refdenotaderodap"

---

### Espaçamento — Limpeza Automática

> **Lição:** 2 instâncias de espaço duplo encontradas no texto, mais 10 sequências de 3+ parágrafos vazios consecutivos (artefatos de edição).

**PÓS-GERAÇÃO, aplicar automaticamente:**

1. **Espaços duplos:** Em todo `<w:t>`, substituir `  +` por ` ` (regex)
2. **Parágrafos vazios:** Máximo de 2 consecutivos. Se 3+, reduzir para 2.
3. **Smart quotes:** Verificar que não há aspas retas (`"` `'`) — usar `"` `"` `'`

---

### Largura de Tabelas — Regra de Proporção

> **Lição:** Quadro G (ABRASCI) tinha 4 colunas de largura igual (2564 twips), tornando labels ilegíveis.

**Regra para tabelas com label + dados:**
- Coluna de label (coluna 0): 20-25% da largura total
- Colunas de dados: dividir os 75-80% restantes igualmente

**Regra para evidence boxes (2 colunas: thumbnail + metadata):**
- Coluna thumbnail: ~2500 twips (fixo)
- Coluna metadata: restante da largura

---

*v3.0 — 09/03/2026 — Adicionadas regras de thumbnail, footnotes nativos, limpeza de espaçamento, e largura de tabelas com base nas lições do Caso Renato Silveira v19→v23.*
