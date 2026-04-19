# FORMATTING SPEC — Résumé EB-1A

> **BENCHMARK**: Resume_Thiago_Fernandes_dos_Santos_EB1A.docx (61 imagens, 77 tabelas, 14K chars)
> **BENCHMARK**: VF_Resume_Andre_Cerbasi_V8.docx (37 imagens, 48 tabelas, 12K chars)
> **REGRA DE OURO**: Todo résumé DEVE ter miniaturas de evidência em CADA evidence block. Sem miniatura = résumé incompleto.

## Tipografia

| Elemento | Font | Tamanho | Peso | Cor |
|----------|------|---------|------|-----|
| Nome do beneficiário (header) | Arial | 14pt | Bold | Navy (#2D4F5F) |
| Título profissional (subheader) | Arial | 10pt | Italic | Cinza (#333333) |
| Título da seção (ALL CAPS) | Arial | 11pt | Bold | Navy (#2D4F5F) — fundo tabela header |
| Título do evidence block | Arial | 11pt | Bold | Preto (#000000) |
| Labels do evidence block (Criterion, Institution, etc.) | Arial | 10pt | Bold | Preto (#000000) |
| Valores do evidence block | Arial | 10pt | Regular | Preto (#000000) |
| Corpo (Description & Impact) | Arial | 10pt | Regular | Preto (#000000) |
| Box institucional | Arial | 9.5pt | Regular/Italic | Cinza (#333333) — fundo #F5F5F5 |
| Paginação ("Page X of Y") | Arial | 9pt | Regular | Cinza (#666666) |
| Contact info | Arial | 9pt | Regular | Cinza (#333333) |
| URL | Arial | 9pt | Regular | Preto (#000000) — SEM sublinhado azul |

## Cores Permitidas

| Uso | Cor | Hex |
|-----|-----|-----|
| Títulos de seção e nome | Navy | #2D4F5F |
| Texto principal | Preto | #000000 |
| Texto secundário (contact, boxes, pag.) | Cinza escuro | #333333 |
| Texto terciário (paginação) | Cinza médio | #666666 |
| Fundo de headers de tabela (seções) | Navy claro | #2D4F5F com texto branco |
| Fundo de boxes institucionais | Cinza claro | #F5F5F5 |
| Bordas de tabelas e evidence blocks | Cinza | #CCCCCC |
| Fundo da coluna de miniatura | Branco | #FFFFFF |

### Cores PROIBIDAS
- ❌ Azul brilhante (#0000FF, #0563C1, #1F3864)
- ❌ Vermelho (#FF0000)
- ❌ Qualquer cor vibrante no corpo do texto
- ❌ Preto puro (#000000) em títulos de seção — usar Navy (#2D4F5F)

## REGRA CRÍTICA: MINIATURAS OBRIGATÓRIAS

**CADA evidence block DEVE ter uma miniatura (thumbnail) da primeira página do documento de evidência.**

Procedimento:
1. Ler os PDFs de evidência na pasta do cliente
2. Gerar miniatura da 1ª página de cada PDF usando `thumbnail_generator.py` ou `fitz` (PyMuPDF)
3. Inserir a miniatura na coluna esquerda do evidence block (largura: 1.2in, borda #CCCCCC 0.5pt)
4. Se o PDF não existir, usar placeholder: "[THUMBNAIL — Evidence X]" em texto cinza itálico

**Résumé sem miniaturas = résumé INCOMPLETO. O benchmark tem 37-61 miniaturas.**

Comando para gerar miniaturas:
```python
import fitz  # PyMuPDF
doc = fitz.open("evidence.pdf")
pix = doc[0].get_pixmap(matrix=fitz.Matrix(150/72, 150/72))
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
img.thumbnail((800, 800), Image.LANCZOS)
img.save("thumbnail.jpg", "JPEG", quality=85)
```

## REGRA: CONCISÃO

**O résumé deve ter entre 12.000 e 18.000 caracteres de texto (excluindo tabelas).**
- Benchmark Thiago: 14K chars em 149 parágrafos
- Benchmark André: 12K chars em 98 parágrafos
- NÃO ultrapassar 20K chars — paredes de texto enfraquecem o documento
- Cada Description & Impact deve ter 2-3 parágrafos MÁXIMO (não 5-6)

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
