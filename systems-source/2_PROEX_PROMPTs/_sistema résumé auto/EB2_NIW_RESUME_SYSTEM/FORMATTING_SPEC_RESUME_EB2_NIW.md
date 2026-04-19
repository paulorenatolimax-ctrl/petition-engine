# FORMATTING SPEC — Résumé EB-2 NIW

## Tipografia

| Elemento | Font | Tamanho | Peso | Cor |
|----------|------|---------|------|-----|
| Nome do beneficiário (header) | Arial | 18pt | Bold | Preto (#000000) |
| Título da seção (ALL CAPS) | Arial | 14pt | Bold | Preto (#000000) |
| Subtítulo / Nome da empresa | Arial | 12pt | Bold | Preto (#000000) |
| Labels (Role, Period, Location, etc.) | Arial | 10pt | Bold | Preto (#000000) |
| Valores dos labels | Arial | 10pt | Regular | Preto (#000000) |
| Corpo (Key Responsibilities, Impacts, Summaries) | Arial | 10.5pt | Regular | Preto (#000000) |
| Bullet points no Summary | Arial | 10.5pt | Regular | Preto (#000000) |
| About da empresa (descrição institucional) | Arial | 9.5pt | Italic | Cinza escuro (#333333) |
| Paginação | Arial | 9pt | Regular | Cinza (#666666) |
| URL | Arial | 9pt | Regular | Preto (#000000) — SEM sublinhado azul |
| Caption de foto | Arial | 9pt | Italic | Cinza escuro (#333333) |

## Cores Permitidas

| Uso | Cor | Hex |
|-----|-----|-----|
| Texto principal | Preto | #000000 |
| Texto secundário (about, captions, paginação) | Cinza escuro | #333333 ou #666666 |
| Fundo de boxes institucionais | Cinza claro | #F5F5F5 |
| Linhas divisórias | Cinza médio | #CCCCCC |
| Fundo de headers de tabela (timeline) | Cinza azulado | #D5E8F0 |
| Células ativas na timeline | Azul corporativo | #2E75B6 |

### Cores PROIBIDAS
- ❌ Azul em texto (#0000FF, #0563C1, #1F3864)
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

Formato: `Page [N] of [Total] — Résumé [Nome do Beneficiário] — EB-2 NIW`

Posição: Footer, alinhado à esquerda ou centralizado.

Exemplo: `Page 1 of 65 — Résumé Derick Araujo Sobral — EB-2 NIW`

## Timeline Visual — Especificação

| Propriedade | Valor |
|-------------|-------|
| Largura | 100% da área útil (6.5") |
| Bordas | Finas (#CCCCCC, 0.5pt) |
| Header row | Fundo #D5E8F0, bold, anos |
| Coluna 0 | Nome da empresa (2-3") |
| Colunas de anos | Iguais (~0.5-0.8" cada) |
| Célula ativa | Fundo #2E75B6, texto branco ou vazio |
| Célula inativa | Vazio |
| Padding | Top/Bottom: 4pt, Left/Right: 6pt |
| Font | Arial 9pt |

## Evidence Block — Layout Visual

### Para Certificados/Cursos/Eventos (COM THUMBNAIL)

```
┌──────────────────┬─────────────────────────────────────────────────┐
│                  │ [TÍTULO — Bold 11pt]                              │
│                  │                                                    │
│   ┌──────────┐  │ Institution: [Bold] Nome                           │
│   │          │  │ Duration: [Bold] X hours                            │
│   │THUMBNAIL │  │ Date: [Bold] Período                                │
│   │1ª pág.   │  │ Location: [Bold] Local                              │
│   │do PDF    │  │ Website: [Bold] URL                                 │
│   │          │  │                                                      │
│   │ 160px    │  │                                                      │
│   └──────────┘  │                                                      │
│   borda #CCCCCC │                                                      │
└──────────────────┴─────────────────────────────────────────────────┘

Summary:
Texto descritivo em largura total...
```

### Para Experiência Profissional (SEM tabela de 2 colunas)

```
🏢 [NOME DA EMPRESA — Bold 12pt]

Role: [Bold] Cargo
Period: [Bold] Data – Data
Location: [Bold] Local
Website: [Bold] URL
About: [Italic 9.5pt] Descrição institucional

[THUMBNAIL se disponível — 160px, borda #CCCCCC]

KEY RESPONSIBILITIES & ACHIEVEMENTS: [Bold 11pt]
• Bullet 1 (10.5pt regular)
• Bullet 2
• Bullet 3

STRATEGIC IMPACTS & RESULTS: [Bold 11pt]
• Impact 1 (10.5pt regular)
• Impact 2
```

### Dimensões da Tabela do Evidence Block (quando tabela 2 colunas)

| Elemento | Dimensão | DXA |
|----------|----------|-----|
| Coluna 0 (Thumbnail) | 1.1" (~2.8cm) | 1584 |
| Coluna 1 (Metadata) | 5.4" (~13.7cm) | 7776 |
| Total | 6.5" (área útil) | 9360 |
| Bordas da tabela | Nenhuma (invisíveis) | — |
| Padding cells | Top/Bottom: 4pt, Left/Right: 6pt | — |

## Thumbnail — Especificação Técnica

| Propriedade | Valor |
|-------------|-------|
| Largura | 160px (~1.1" / ~2.8cm) |
| Altura | Proporcional (auto) |
| Resolução | 150 DPI |
| Formato | PNG ou JPEG |
| Borda | Fina (#CCCCCC, 0.5pt) |
| Posição | Coluna esquerda (evidence blocks) ou inline (experiência) |
| Alinhamento | Centralizado vertical na célula |

### Como Gerar
```bash
# Extrair 1ª página do PDF como imagem
pdftoppm -f 1 -l 1 -png -r 150 certificate.pdf thumb
# Redimensionar para 160px largura
convert thumb-1.png -resize 160x thumb_certificate.png
```

### Placeholder (quando PDF não disponível)
```
font:       Arial
size:       8pt
color:      #999999
texto:      [THUMBNAIL]
fundo:      #F5F5F5
borda:      #CCCCCC, 0.5pt
dimensão:   1.1" x ~1.5"
```

## Fotos Profissionais

| Propriedade | Regra |
|-------------|-------|
| Posição | Inline, centralizada ou alinhada à direita |
| Largura máxima | 3" (inline lateral) ou 6.5" (centralizada) |
| Resolução mínima | 150 DPI |
| Formato | JPEG ou PNG |
| Caption | OBRIGATÓRIA — abaixo em italic 9pt |
| Borda | Fina (#CCCCCC, 0.5pt) |
| Uso | Fotos de cerimônias, eventos, projetos, entregas, equipes |

## Tabelas Gerais

| Propriedade | Regra |
|-------------|-------|
| Largura | 100% da área útil (6.5") |
| Bordas | Finas (#CCCCCC, 0.5pt) |
| Header row | Fundo #D5E8F0, bold |
| Padding | Top/Bottom: 4pt, Left/Right: 6pt |
| Font | Arial 10pt |
| Width type | SEMPRE DXA (nunca percentagem) |

## Separadores

- Linha horizontal fina (#CCCCCC, 0.5pt) entre seções
- Page break OBRIGATÓRIO antes de cada nova seção principal
- Cada seção começa em página nova
- Sub-blocos dentro de Professional Experience NÃO precisam de page break entre si

## Ícones de Seção (OPCIONAIS)

Os emojis usados nos títulos do template (🏢, 🎓, 🏅, 📸, 👥, 🤝) são OPCIONAIS.
- Se o documento será impresso: NÃO usar emojis
- Se o documento será digital/PDF: emojis podem ser mantidos para navegabilidade
- O padrão é SEM emojis (mais profissional)

---

*Formatting Spec Résumé EB-2 NIW v1.0 — 22/03/2026*
