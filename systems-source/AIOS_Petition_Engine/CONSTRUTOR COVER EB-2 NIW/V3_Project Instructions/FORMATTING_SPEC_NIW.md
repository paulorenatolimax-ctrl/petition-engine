# FORMATTING_SPEC_NIW — Especificações Técnicas de Formatação
## Cover Letter EB-2 NIW — Padrão PROEX
## v3.0 — 18/03/2026 — Nova paleta PROEX + evidence block v4 + pipeline DOCX

---

## REGRA ZERO
Todo documento gerado DEVE usar estes valores EXATOS. Não aproximar, não arredondar, não "adaptar".

---

## IDIOMA
100% PT-BR. Termos técnicos de imigração em *italic* (ex: *proposed endeavor*, *substantial merit*, *national importance*, *labor certification*). Citações legais em inglês entre aspas.

---

## Capa (Cover Page) — FORMATO CARTA (Lição Andrea)

**REGRA ABSOLUTA**: A capa NÃO é uma "title page" centrada. É um formato de CARTA FORMAL que flui diretamente para o conteúdo da Parte I, conforme o benchmark Carlos Avelino / Bruno Cipriano.

### Estrutura da Capa:
```
1. Data — alinhada à DIREITA: "[DD] de [Mês] de [AAAA]"
2. Destinatário — alinhado à ESQUERDA:
   "To: USCIS"
   "Immigration Officer"
   "[Service Center Address]"
3. Bloco de metadados — fundo verde PROEX (#D6E1DB):
   | Campo | Valor |
   |-------|-------|
   | Ref: | EB-2 National Interest Waiver — Immigrant Petition (I-140) |
   | Beneficiário: | [NOME COMPLETO EM MAIÚSCULAS] |
   | Nacionalidade: | [País] |
   | Natureza: | ORIGINAL SUBMISSION |
   | Classificação: | INA § 203(b)(2)(B) — National Interest Waiver |
   | Código SOC: | [código] — [título] (BLS/O*NET) |
4. Saudação: "Prezado(a) Oficial de Imigração,"
5. Texto introdutório — SEM page break antes do conteúdo da Parte I

**ZERO EMPLOYER/SPONSOR NO BLOCO DE METADADOS**
```

### ERROS COMUNS (evitar):
```
❌ Capa centrada estilo "title page" com nome grande no meio
❌ Page break entre capa e conteúdo da Parte I
❌ Fundo azul escuro (#1F3864) no bloco de metadados
❌ Fundo sage green (#C5E0B4) — PALETA ANTIGA, DESCONTINUADA
❌ Logo ou imagens na capa
❌ "Employer: [nome]" ou "Sponsor: [nome]" no bloco metadata
❌ Texto em inglês no corpo principal
✅ Formato carta simples, profissional, verde PROEX (#D6E1DB), PT-BR, zero employer
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

---

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

### Subtítulo (Part A/B)
```
font:       Garamond
size:       152400 EMU (12pt)
bold:       true
italic:     true
color:      #F2F5D7 (amarelo suave)
shading:    nenhum
alignment:  CENTER
spacing_after: 8pt
```
Formato: `Part A: [descrição] (Evidence XX–YY) — REVISÃO X`

### Header de Seção Principal (ELIGIBILITY, PRONG X, Legal Framework)
```
font:       Garamond
size:       177800 EMU (14pt)
bold:       true
italic:     false
color:      #000000
shading:    #D6E1DB (verde PROEX)
alignment:  LEFT
spacing_before: 18pt
spacing_after: 8pt
```
Usado para: ELIGIBILITY, PRONG X, PRONG II, Legal Framework, Synopsis, Conclusão

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
Tipo: [tipo] | Fonte: [fonte]
Data: [data] | URL: [url]
Descrição e Relevância: [descrição]
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
formato:    EB-2 NIW | I-140 Petition — Cover Letter [NOME] | Page X of Y
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
| Bege/Marrom | #E3DED1 | 227, 222, 209 | Sub-headers (Part A/B), headlines de tabelas/quadros, synopsis table header |
| Cinza Claro | #F2F2F2 | 242, 242, 242 | Terceiro nível (sub-sub-itens), linhas alternadas de tabelas |
| Amarelo Suave | #F2F5D7 | 242, 245, 215 | H4 subtitle color (Part A/B em PT-BR) |
| Creme Evidence | #FFF8EE | 255, 248, 238 | Evidence blocks — APENAS coluna de metadados (coluna 1) |
| Evidence Green | #2E7D32 | 46, 125, 50 | "Evidence XX." texto |
| Black | #000000 | 0, 0, 0 | Todo texto, headers |
| Gray | #808080 | 128, 128, 128 | Subtítulos, footer, separadores |
| Placeholder | #999999 | 153, 153, 153 | "[THUMBNAIL]" |
| Yellow Highlight | (highlight) | — | Placeholders [VERIFICAR] |

### Hierarquia de cores:
```
Nível 1 (principal): #D6E1DB (verde PROEX) — títulos de critério, headers de seção
Nível 2 (sub-item):  #E3DED1 (bege/marrom) — headers de tabela
Nível 3 (detalhe):   #F2F2F2 (cinza claro) — linhas alternadas, sub-sub-itens
Subtitle (H4):       #F2F5D7 (amarelo suave) — Part A/B
Evidence blocks:     #FFF8EE (creme suave) — APENAS na coluna de metadados
```

### PROIBIÇÕES:
```
❌ #C5E0B4 (sage green — paleta ANTIGA v1/v2, DESCONTINUADA)
❌ #0000FF ou qualquer variante azul em headers ou texto
❌ #FFF2CC (cream antigo — substitua por #FFF8EE)
```

---

## Evidence Block (Tabela) — v4

### Estrutura
```
Tabela: 1 linha × 2 colunas
Largura col 0: ~3.5cm (para thumbnail)
Largura col 1: restante
Borders: nenhuma visível (ou hairline gray)
Shading coluna 0 (thumbnail): NENHUM (fundo branco — sem cor)
Shading coluna 1 (metadata):  #FFF8EE (creme suave)
Row property: cantSplit = true (OBRIGATÓRIO — impede quebra entre páginas)
```

### Coluna 0 (Thumbnail)
- Imagem da primeira página do PDF, 160px largura
- **REGRA DE PAGINAÇÃO**: Antes de extrair thumbnail, verificar a página 1
  - Se página 1 = "AFFIDAVIT OF TRANSLATION ACCURACY" ou "CERTIFIED TRANSLATION" ou "TMS Translations" ou "CERTIFICADO DE TRADUÇÃO" — **PULAR para página 2**
  - Caso contrário, usar página 1
- Gerada via: `pdftoppm -f 1 -l 1 -png -r 150 arquivo.pdf thumb`
- Resize: `convert thumb-1.png -resize 160x thumb_final.png`
- Se não disponível: texto "[THUMBNAIL]" em 8pt gray #999999

### Coluna 1 (Metadata)
```
Linha 1: "Evidence XX. [Título]" — bold, #2E7D32
Linha 2: "Tipo: [tipo] | Fonte: [fonte]"
Linha 3: "Data: [data] | URL: [url]"
Linha 4: "Descrição e Relevância: [texto]"
```

**ORDEM CRÍTICA**: Evidence block SEMPRE ANTES do texto argumentativo. NUNCA depois.

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

### EXCEÇÕES:
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
shading:    #D6E1DB (verde PROEX)
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
| 139700 | 11pt | — | (evitar — inconsistência) |
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

## Estrutura NIW — Dhanasar (3 Prongs)

### Organização Obrigatória:
```
I. ELEGIBILIDADE (Prong I — Qualificações do Beneficiário)
   A. [Subseção conforme I-140 Instructions]
   B. [Subseção]

II. PRONG 2 — MÉRITO SUBSTANCIAL (Substantial Merit)
   A. [Subseção]
   B. [Subseção]

III. PRONG 3 — INTERESSE NACIONAL (National Interest Waiver)
   A. [Subseção]
   B. [Subseção]

CONCLUSÃO / ENCERRAMENTO
```

### Headers NIW:
```
"PRONG X" sempre com "PRONG" em maiúsculas.
Cores: #D6E1DB (verde PROEX) para section headers.
"Prong X — [Descrição]" ou "PRONG X — Avaliação de [Tópico]"
```

---

## Footnotes Nativos — Regra Obrigatória (Lição Renato Silveira v19→v23)

> **Lição:** Seções "Notas / Sources" como texto no corpo consomem horas em conversão manual. Footnotes órfãs criam inconsistências.

**PROIBIDO:** Gerar seções de texto "Notas", "Sources", "Referências", "Notas de Rodapé" no corpo do documento.

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
        <w:sz w:val="20"/>  <!-- 10pt -->
        <w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/>
      </w:rPr>
      <w:t xml:space="preserve"> [Texto da fonte]</w:t>
    </w:r>
  </w:p>
</w:footnote>
```

**Estilo:** 10pt Garamond, estilo "Refdenotaderodap"

---

## Lógica de Extração de Thumbnails (Lição Renato Silveira v19→v23)

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
convert thumb-$START_PAGE.png -resize 160x thumb_final.png
```

---

## Largura de Tabelas — Regra de Proporção (Lição Renato Silveira v19→v23)

> **Lição:** Quadro G (ABRASCI) tinha 4 colunas de largura igual (2564 twips), tornando labels ilegíveis.

### Para tabelas com label + dados:
- Coluna de label (coluna 0): 20-25% da largura total
- Colunas de dados: dividir os 75-80% restantes igualmente

### Para evidence boxes (2 colunas: thumbnail + metadata):
- Coluna thumbnail (col 0): ~2500 twips (fixo)
- Coluna metadata (col 1): restante da largura total
- **cantSplit = true obrigatório**

---

## Espaçamento — Limpeza Automática (Lição Renato Silveira v19→v23)

> **Lição:** 2 instâncias de espaço duplo encontradas no texto, mais 10 sequências de 3+ parágrafos vazios consecutivos (artefatos de edição).

**PÓS-GERAÇÃO, aplicar automaticamente:**

1. **Espaços duplos:** Em todo `<w:t>`, substituir `  +` por ` ` (regex)
2. **Parágrafos vazios:** Máximo de 2 consecutivos. Se 3+, reduzir para 2.
3. **Smart quotes:** Verificar que não há aspas retas (`"` `'`) — usar `"` `"` `'`

---

## Estrutura do Documento — Pipeline DOCX

### Ordem obrigatória de seções:
```
1. Capa (Cover Letter formal)
2. Table of Contents (opcional, mas recomendado)
3. Part I — Introdução e Síntese Executiva
4. Part II — Elegibilidade (Prong I)
5. Part III — Mérito Substancial (Prong II)
6. Part IV — Interesse Nacional (Prong III)
7. Conclusão
8. Índice de Evidências (se houver)
9. Apêndices (se houver)
```

### Geração do DOCX:
- Usar `python-docx` ou equivalente
- Garantir que TODOS os footnotes são nativos (não texto)
- Validar cores HEX exatas antes de salvar
- Rodar limpeza de espaçamento pós-geração
- Testar abertura em Word 2016+ para compatibilidade

---

*v3.0 — 18/03/2026 — Nova paleta PROEX + evidence block v4 + pipeline DOCX. Incorpora lições dos casos Andrea Justino (capa, borders, prefixo Evidence, STEP capitalization) e Renato Silveira v19→v23 (thumbnail logic, footnotes nativos, limpeza de espaçamento, largura de tabelas).*
