# FORMATTING SPEC — Résumé EB-1A (V2.0 — Layout Premium)

> **ATENÇÃO**: Esta spec define o layout visual EXATO que todo résumé produzido deve seguir. Nenhum desvio é permitido — nem em fonte, nem em cor, nem em estrutura. A conformidade visual é ABSOLUTA.

---

## Tipografia — ALL GARAMOND

| Elemento | Font | Tamanho | Peso | Cor |
|----------|------|---------|------|-----|
| Nome do beneficiário (header bar) | Garamond | 20pt | Bold | Branco (#FFFFFF) sobre fundo Navy |
| "RÉSUMÉ" (subtítulo header) | Garamond | 11pt | Bold | Branco (#FFFFFF) sobre fundo Navy |
| E-mail (header bar, alinhado à direita) | Garamond | 9pt | Regular | Branco (#FFFFFF) sobre fundo Navy |
| Título de seção (navy bar) | Garamond | 11pt | Bold | Branco (#FFFFFF) sobre fundo Navy |
| Sub-header de categoria (teal bar) | Garamond | 10pt | Bold | Branco (#FFFFFF) sobre fundo Teal |
| Labels do evidence block (Key:) | Garamond | 10pt | Bold | Preto (#000000) |
| Valores do evidence block | Garamond | 10pt | Regular | Preto (#000000) |
| "Descrição / Impacto:" label | Garamond | 9.5pt | Bold | Navy (#2D3E50) |
| Texto de impacto (dentro do bloco) | Garamond | 9.5pt | Italic | Cinza escuro (#333333) |
| Corpo / parágrafos narrativos | Garamond | 10.5pt | Regular | Preto (#000000) |
| Bullets (●) | Garamond | 10.5pt | Regular | Preto (#000000) |
| Sub-bullets (○) | Garamond | 10pt | Regular | Cinza escuro (#333333) |
| Company box (sobre a empresa) | Garamond | 9.5pt | Italic | Cinza escuro (#333333) |
| Paginação ("Page X of Y") | Garamond | 9pt | Regular | Branco (#FFFFFF) sobre fundo Navy |
| Tabela header row | Garamond | 9.5pt | Bold | Branco (#FFFFFF) sobre fundo Navy |
| Tabela data cells | Garamond | 9.5pt | Regular | Preto (#000000) |

### REGRA ABSOLUTA DE FONTE
- **100% Garamond** — ZERO exceções
- ❌ Arial: PROIBIDO em qualquer elemento
- ❌ Calibri: PROIBIDO
- ❌ Times New Roman: PROIBIDO
- Se o sistema python-docx não tem Garamond disponível, usar `font.name = "Garamond"` e o Word aplicará ao abrir

---

## Paleta de Cores — Navy/Teal Premium

### Cores OBRIGATÓRIAS

| Uso | Nome | Hex | Onde |
|-----|------|-----|------|
| Header bar, footer bar, section headers, table headers | Navy | #2D3E50 | Background de barras |
| Accent line (header), sub-headers de categoria | Teal | #3498A2 | Background de barras finas |
| Texto sobre Navy/Teal | Branco | #FFFFFF | Text em headers/footers |
| Texto principal | Preto | #000000 | Corpo, labels, bullets |
| Texto secundário, impacto, sub-bullets | Cinza escuro | #333333 | Dentro de evidence blocks |
| Texto terciário (metadata, notas) | Cinza médio | #666666 | Placeholders, notas |
| Fundo company box, alternate table rows | Cinza claro | #F5F5F5 | Background |
| Bordas de evidence blocks, tabelas | Cinza borda | #CCCCCC | Borders |
| Label "Descrição / Impacto:" | Navy | #2D3E50 | Texto dentro do bloco |

### Cores PROIBIDAS
- ❌ Azul link (#0000FF, #0563C1) — NUNCA, em nenhum contexto
- ❌ Vermelho (#FF0000)
- ❌ Verde (#00FF00)
- ❌ Qualquer cor fora da tabela acima

---

## Layout de Página

| Propriedade | Valor | Código python-docx |
|-------------|-------|--------------------|
| Papel | US Letter | 8.5" × 11" |
| Margem superior | 0" (header table ocupa topo) | `Inches(0)` |
| Margem inferior | 0.5" | `Inches(0.5)` |
| Margem esquerda | 0.65" | `Inches(0.65)` |
| Margem direita | 0.65" | `Inches(0.65)` |
| Header distance | 0" | `Inches(0)` |
| Área útil de conteúdo | 7.0" (10,080 DXA) | `CONTENT_WIDTH = 10080` |
| Espaçamento padrão pós-parágrafo | 6pt | `Pt(6)` |
| Alinhamento padrão de texto | Justificado | `WD_ALIGN_PARAGRAPH.JUSTIFY` |

### POR QUE 0.65" de margem?
Margens mais estreitas que o padrão 1" maximizam a área útil sem sacrificar legibilidade. Isso permite evidence blocks mais largos com thumbnails maiores e mais visíveis — impacto visual significativamente superior.

---

## Header — Barra Navy com Nome + Accent Teal

O header é uma **tabela de 3 linhas × 2 colunas** inserida no header do documento:

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVY (#2D3E50) background                                       │
│  [NOME COMPLETO EM MAIÚSCULAS — 20pt Bold Branco]               │
├─────────────────────────────────────────────────────────────────┤
│  NAVY (#2D3E50) background                                       │
│  RÉSUMÉ [11pt Bold Branco]           E-mail: xxx [9pt Branco]   │
├─────────────────────────────────────────────────────────────────┤
│  TEAL (#3498A2) — linha fina de acento (altura mínima ~3pt)      │
└─────────────────────────────────────────────────────────────────┘
```

### Especificações:
- Largura total da tabela: 10,800 DXA (cobre toda a largura da página)
- Coluna esquerda (nome/résumé): 7,560 DXA
- Coluna direita (email): 3,240 DXA
- Sem bordas visíveis
- Padding: top=0, bottom=0, left=180, right=180

### VARIAÇÃO EB-1A
Para EB-1A, a Row 1 pode incluir o SOC/O*Net code e categoria de visto:
```
RÉSUMÉ                    SOC/O*Net: XX-XXXX.XX | EB-1A
```

---

## Footer — Barra Navy com Paginação

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVY (#2D3E50) background                                       │
│                                          Page X of Y [9pt Branco]│
└─────────────────────────────────────────────────────────────────┘
```

- Tabela 1×1, largura 10,800 DXA
- Texto alinhado à direita
- Padding: top=40, bottom=40, left=120, right=120
- Usa campos PAGE e NUMPAGES do Word

---

## Navy Section Header — Barra de Título de Seção

Cada seção principal (Prêmios, Contribuições, Artigos, etc.) é introduzida por uma barra Navy full-width:

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVY (#2D3E50) background                                       │
│  [TÍTULO DA SEÇÃO EM CAPS — 11pt Bold Branco, centralizado]     │
└─────────────────────────────────────────────────────────────────┘
```

- Tabela 1×1, largura `CONTENT_WIDTH` (10,080 DXA)
- Sem bordas visíveis
- Padding: top=60, bottom=60, left=120, right=120
- Espaçador de 4pt acima e abaixo

---

## Teal Sub-Header — Barra de Subcategoria

Para agrupar evidências dentro de uma seção (ex: categorias de artigos):

```
┌─────────────────────────────────────────────────────────────────┐
│  TEAL (#3498A2) background                                       │
│  [Título do grupo — 10pt Bold Branco, alinhado à esquerda]      │
└─────────────────────────────────────────────────────────────────┘
```

- Tabela 1×1, largura `CONTENT_WIDTH`
- Padding: top=40, bottom=40, left=120, right=120
- Espaçador de 3pt acima e abaixo

---

## Evidence Block — Layout Visual V2.0 (Impacto DENTRO do bloco)

O evidence block é o componente central do résumé. É uma **TABELA DE 2 COLUNAS** com metadata + impacto à esquerda e thumbnail à direita.

### CRÍTICO: Descrição/Impacto DENTRO do bloco
Diferente do layout anterior onde o impacto ficava ABAIXO da tabela, agora ele fica **DENTRO da célula esquerda**, criando um bloco visualmente coeso e profissional.

```
┌──────────────────────────────────────┬─────────────────────────┐
│                                      │                         │
│ Key1: Value1                         │                         │
│ Key2: Value2                         │     ┌──────────────┐   │
│ Key3: Value3                         │     │              │   │
│ Key4: Value4                         │     │  THUMBNAIL   │   │
│                                      │     │  da 1ª pág   │   │
│ Descrição / Impacto: [Navy bold]     │     │  do exhibit  │   │
│ Texto italic descritivo do impacto   │     │              │   │
│ com 4-6 linhas de profundidade       │     │  2.6" width  │   │
│ técnica e inferência causal...       │     │              │   │
│                                      │     └──────────────┘   │
└──────────────────────────────────────┴─────────────────────────┘
[4pt spacer]
```

### Dimensões do Evidence Block PADRÃO

| Elemento | Dimensão | DXA |
|----------|----------|-----|
| Coluna esquerda (metadata + impacto) | ~4.0" | 5,760 |
| Coluna direita (thumbnail) | ~3.0" | 4,320 |
| Total | ~7.0" | 10,080 |
| Bordas | Visíveis, finas #CCCCCC | sz="4" |
| Padding esquerda | top=80, bottom=80, left=120, right=120 | DXA |
| Padding direita | top=80, bottom=80, left=80, right=80 | DXA |
| Thumbnail width | 2.6 inches | `Inches(2.6)` |
| Thumbnail alignment | Centralizado vertical na célula | CENTER |

### Evidence Block COMPACTO (para listas de artigos, conferências)

| Elemento | Dimensão | DXA |
|----------|----------|-----|
| Coluna esquerda (metadata + impacto) | ~4.5" | 6,480 |
| Coluna direita (thumbnail) | ~2.5" | 3,600 |
| Total | ~7.0" | 10,080 |
| Thumbnail width | 2.0 inches | `Inches(2.0)` |

### Campos do Evidence Block

Cada evidence block DEVE conter (quando aplicável):

**Para EB-1A:**
- Related Criterion(s): Criterion [N] — [Name]
- Institution/Entity: [nome completo]
- Type of Evidence: [categoria]
- Date Issued: [DD Month YYYY]
- Title/Distinction: [se aplicável]
- Location: [cidade, estado, país]
- Website/URL: [link — sem sublinhado azul]

**NOTA**: Labels em bold (#000000), valores em regular (#000000). "Descrição / Impacto:" em bold Navy (#2D3E50), texto de impacto em italic cinza escuro (#333333).

---

## Thumbnail (Miniatura) — Especificação Técnica V2.0

### O que é
Print/screenshot da **PRIMEIRA PÁGINA** do PDF da evidência. Posicionada na **coluna DIREITA** do evidence block.

### Dimensões

| Propriedade | Evidence Block Padrão | Evidence Block Compacto |
|-------------|----------------------|------------------------|
| Width | 2.6 inches | 2.0 inches |
| Altura | Proporcional (auto) | Proporcional (auto) |
| Resolução fonte | 150 DPI (pdftoppm) | 150 DPI |
| Resize para disco | 400px (lado maior) | 400px (lado maior) |
| Formato | PNG | PNG |
| Posição | Coluna direita, centro vertical | Coluna direita, centro vertical |

### Como Gerar

```bash
# Passo 1: Extrair 1ª página do PDF
pdftoppm -f 1 -l 1 -png -r 150 evidence_XX.pdf /tmp/thumb

# Passo 2: Resize para 400px (lado maior) usando PIL
python3 -c "
from PIL import Image
img = Image.open('/tmp/thumb-1.png')
w, h = img.size
ratio = 400 / max(w, h)
img.resize((int(w*ratio), int(h*ratio)), Image.LANCZOS).save('thumb_evidence_XX.png')
"
```

### Mapa Explícito de Thumbnails (THUMB_MAP)
Para garantir que NENHUMA thumbnail se perca durante o build, usar um dicionário explícito que mapeia chaves lógicas a nomes de arquivo:

```python
THUMB_MAP = {
    "mvp_2018": "thumb_Most_Valuable_Professional.png",
    "ms_certified": "thumb_Microsoft_Certified.png",
    # ... etc
}

def get_thumb(key):
    filename = THUMB_MAP.get(key)
    if filename:
        path = os.path.join(THUMB_DIR, filename)
        if os.path.exists(path):
            return path
    return None
```

### Placeholder (quando PDF não disponível)
```
text:       "[THUMBNAIL]"
font:       Garamond 8pt
color:      #666666
```

### REGRA ABSOLUTA
- TODO evidence block DEVE ter thumbnail OU placeholder
- NUNCA omitir a coluna da thumbnail

---

## Company Box — Caixa de Contexto Institucional

Para apresentar empregadores e organizações:

```
┌─────────────────────────────────────────────────────────────────┐
│  LIGHT_GRAY (#F5F5F5) background, borda #CCCCCC                 │
│                                                                   │
│  Empresa: [Nome] [Bold 10.5pt]                                   │
│  Cargo: [Bold 10pt] [valor regular 10pt]                         │
│  Período: [Bold 10pt] [valor regular 10pt]                       │
│  Sobre a empresa: [Bold 10pt] [italic 9.5pt cinza #333333]      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

- Largura: `CONTENT_WIDTH` (10,080 DXA)
- Padding: top=80, bottom=80, left=120, right=120

---

## Gantt/Staircase Timeline — Histórico Profissional

Para o histórico profissional, usar uma tabela de timeline colorida:

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Emp │2008 │2010 │2012 │2014 │2016 │2018 │2020 │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│Emp1 │ ███ │ ███ │     │     │     │     │     │
│Emp2 │     │     │ ███ │ ███ │ ███ │     │     │
│Emp3 │     │     │     │     │     │ ███ │ ███ │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

- Header: Navy background, texto branco
- Células coloridas: Teal (#3498A2)
- Células vazias: Branco
- Bordas: #CCCCCC

---

## Tabelas de Dados

| Propriedade | Regra |
|-------------|-------|
| Largura | `CONTENT_WIDTH` (10,080 DXA) |
| Bordas | Finas #CCCCCC, sz="4" |
| Header row | Navy (#2D3E50) background, texto Bold Branco |
| Data rows | Alternando #F5F5F5 e #FFFFFF |
| Font | Garamond 9.5pt |
| Padding | top=30-40, bottom=30-40, left=80, right=80 |

---

## Quadro Comparativo (para seções com múltiplas propostas/entidades)

- Mesma estrutura de tabela com header Navy
- Colunas proporcionais ao conteúdo
- Font: Garamond 8.5pt
- Bordas #CCCCCC

---

## Constantes Python para Implementação

```python
# CORES
NAVY = "2D3E50"
TEAL = "3498A2"
WHITE = "FFFFFF"
BLACK = "000000"
DARK_GRAY = "333333"
MED_GRAY = "666666"
LIGHT_GRAY = "F5F5F5"
BORDER_GRAY = "CCCCCC"

# FONTES
BODY_FONT = "Garamond"
HEADER_FONT = "Garamond"

# LAYOUT (em DXA)
CONTENT_WIDTH = 10080
META_WIDTH = 5760        # Coluna esquerda do evidence block
THUMB_WIDTH = 4320       # Coluna direita do evidence block
HEADER_TABLE_WIDTH = 10800  # Largura total do header/footer

# MARGENS
TOP_MARGIN = 0           # Header table ocupa o topo
BOTTOM_MARGIN = 0.5      # Em inches
LEFT_MARGIN = 0.65       # Em inches
RIGHT_MARGIN = 0.65      # Em inches
```

---

## Regras de Espaçamento

| Contexto | Espaço |
|----------|--------|
| Após parágrafo narrativo | 6pt |
| Após bullet (●) | 4pt |
| Antes de bullet | 2pt |
| Após sub-bullet (○) | 2pt |
| Após evidence block (spacer) | 4pt acima + 4pt abaixo |
| Após navy section header (spacer) | 4pt acima + 4pt abaixo |
| Após teal sub-header (spacer) | 3pt acima + 3pt abaixo |
| Antes de seção (introdução) | 10pt |

---

## Page Break Rules

- ❌ NÃO forçar page break a cada critério (gasta muito espaço)
- ✅ O python-docx gerencia quebras naturais
- ✅ Se a parte for muito longa, dividir em múltiplos .docx e mergear

---

*Formatting Spec Résumé EB-1A V2.0 — Layout Premium — 03/mar/2026*
