# FORMATTING SPEC — Résumé EB-1A

## Tipografia

| Elemento | Font | Tamanho | Peso | Cor |
|----------|------|---------|------|-----|
| Nome do beneficiário (header) | Arial | 18pt | Bold | Preto (#000000) |
| Título da seção (ALL CAPS) | Arial | 14pt | Bold | Preto (#000000) |
| Subtítulo da seção | Arial | 12pt | Bold | Preto (#000000) |
| Título do evidence block | Arial | 11pt | Bold | Preto (#000000) |
| Labels do evidence block (Criterion, Institution, etc.) | Arial | 10pt | Bold | Preto (#000000) |
| Valores do evidence block | Arial | 10pt | Regular | Preto (#000000) |
| Corpo (Description & Impact) | Arial | 10.5pt | Regular | Preto (#000000) |
| Paginação ("Page X of Y") | Arial | 9pt | Regular | Cinza (#666666) |
| Box institucional | Arial | 9.5pt | Regular/Italic | Cinza escuro (#333333) |
| URL | Arial | 9pt | Regular | Preto (#000000) — SEM sublinhado azul |

## Cores Permitidas

| Uso | Cor | Hex |
|-----|-----|-----|
| Texto principal | Preto | #000000 |
| Texto secundário (boxes, paginação) | Cinza escuro | #333333 ou #666666 |
| Fundo de boxes institucionais | Cinza claro | #F5F5F5 |
| Linhas divisórias | Cinza médio | #CCCCCC |
| Fundo de headers de tabela | Cinza azulado | #D5E8F0 |

### Cores PROIBIDAS
- ❌ Azul em qualquer texto (#0000FF, #0563C1, #1F3864)
- ❌ Vermelho (#FF0000)
- ❌ Qualquer cor vibrante no corpo do texto

## Layout de Página

| Propriedade | Valor |
|-------------|-------|
| Papel | US Letter (8.5" x 11") |
| Margens | Top: 1", Bottom: 1", Left: 1", Right: 1" |
| Espaçamento entre linhas | 1.15 |
| Espaço após parágrafo | 6pt |
| Espaço antes de seção | 24pt |
| Espaço após título de seção | 12pt |

## Paginação

Formato: `Page [N] of [Total] [Nome do Beneficiário] – EB-1`

Posição: Header ou footer, alinhado à esquerda ou centralizado.

Exemplo: `Page 1 of 54 Résumé Renato Silveira dos Reis – EB-1`

## Evidence Block — Layout Visual (COM MINIATURA OBRIGATÓRIA)

O evidence block é uma **TABELA DE 2 COLUNAS** seguida de texto em largura total:

```
┌──────────────────┬─────────────────────────────────────────────────┐
│                  │ [TÍTULO DA EVIDÊNCIA — Bold 11pt]                │
│                  │                                                   │
│   ┌──────────┐  │ Related Criterion(s): [Bold] Criterion N — Name   │
│   │          │  │ Institution/Entity: [Bold] Nome da Entidade       │
│   │ MINIATURA│  │ Type of Evidence: [Bold] Tipo                     │
│   │ 1ª pág.  │  │ Date Issued: [Bold] DD Month YYYY                 │
│   │ do PDF   │  │ Title/Distinction: [Bold] Título                  │
│   │          │  │ Location: [Bold] Cidade, Estado, País             │
│   │ 160px    │  │ Website/URL: [Bold] https://...                   │
│   └──────────┘  │                                                   │
│   borda #CCCCCC │                                                   │
└──────────────────┴─────────────────────────────────────────────────┘

Description & Impact/Relevance: [Bold heading — largura total]
Texto do parágrafo 1 em corpo normal...
Texto do parágrafo 2...

┌────────────────────────────────────────────────────────────────────┐
│ [BOX INSTITUCIONAL — fundo #F5F5F5, borda #CCCCCC]                │
│ Nome da Entidade is... [texto em 9.5pt italic]                     │
└────────────────────────────────────────────────────────────────────┘
```

### Dimensões da Tabela do Evidence Block

| Elemento | Dimensão | DXA |
|----------|----------|-----|
| Coluna 0 (Miniatura) | 1.1" (~2.8cm) | 1584 |
| Coluna 1 (Metadata) | 5.4" (~13.7cm) | 7776 |
| Total (6.5" = área útil) | 6.5" | 9360 |
| Bordas da tabela | Nenhuma (invisíveis) | — |
| Padding cells | Top/Bottom: 4pt, Left/Right: 6pt | — |

## Miniatura (Thumbnail) — Especificação Técnica

### O que é
Print/screenshot da **PRIMEIRA PÁGINA** do PDF da evidência que será enviado ao USCIS como exhibit. É o elemento visual que abre cada evidence block.

### Por que é obrigatória
O oficial do USCIS analisa centenas de petições. A miniatura:
1. Permite identificação visual instantânea do documento
2. Faz cross-reference rápida entre résumé e exhibits físicos
3. Demonstra profissionalismo e organização

### Especificação

| Propriedade | Valor |
|-------------|-------|
| Largura | 160px (~1.1" / ~2.8cm) |
| Altura | Proporcional (auto) |
| Resolução | 150 DPI |
| Formato | PNG ou JPEG |
| Borda | Fina (#CCCCCC, 0.5pt) |
| Posição | Coluna esquerda da tabela do evidence block |
| Alinhamento | Centralizado vertical na célula |

### Como Gerar

```bash
# Extrair 1ª página do PDF como imagem
pdftoppm -f 1 -l 1 -png -r 150 evidence_XX.pdf thumb

# Redimensionar para 160px largura (mantém proporção)
convert thumb-1.png -resize 160x thumb_evidence_XX.png
```

### Placeholder (quando PDF não disponível)

```
font:       Arial
size:       8pt
color:      #999999
texto:      [THUMBNAIL]
fundo:      #F5F5F5
borda:      #CCCCCC, 0.5pt
dimensão:   mesma célula (1.1" x ~1.5")
```

### Regra Absoluta
- **TODO evidence block DEVE ter miniatura OU placeholder**
- NUNCA omitir a coluna da miniatura
- Se o PDF é confidencial (ex: IRPF), usar miniatura com tarja: "Confidential — Original attached as Evidence XX"

## Imagens Adicionais (além das miniaturas)

| Propriedade | Regra |
|-------------|-------|
| Posição | Inline com texto, alinhada à direita ou centralizada |
| Largura máxima | 3" (para inline lateral) ou 6.5" (para centralizada) |
| Resolução mínima | 150 DPI |
| Formato | JPEG ou PNG |
| Caption | Obrigatória — abaixo da imagem em italic 9pt |
| Borda | Fina (#CCCCCC, 0.5pt) ao redor de screenshots |
| Uso | Fotos de cerimônias, capturas de tela de métricas, logos de entidades |

## Tabelas

| Propriedade | Regra |
|-------------|-------|
| Largura | 100% da área útil (6.5") |
| Bordas | Finas (#CCCCCC, 0.5pt) |
| Header row | Fundo #D5E8F0, bold |
| Padding | Top/Bottom: 4pt, Left/Right: 6pt |
| Font | Arial 10pt |

## Separadores de Seção

Linha horizontal fina (#CCCCCC, 0.5pt) antes de cada nova seção de critério.

Page break OBRIGATÓRIO antes de cada nova seção de critério (cada critério começa em página nova).

---

*Formatting Spec Résumé EB-1A v1.0 — 21/02/2026*
