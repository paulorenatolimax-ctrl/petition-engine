# FORMATTING_SPEC_NIW — Especificações Técnicas de Formatação
## Cover Letter EB-2 NIW — Padrão PROEX
## v1.0 — 01/03/2026 (herda EB-1A v2.1 + adaptações NIW)

---

## REGRA ZERO
Todo documento gerado DEVE usar estes valores EXATOS. Não aproximar, não arredondar, não "adaptar".

## IDIOMA
100% PT-BR. Termos técnicos de imigração em *italic* (ex: *proposed endeavor*, *substantial merit*, *national importance*, *labor certification*). Citações legais em inglês entre aspas.

---

## Capa (Cover Page) — FORMATO CARTA

### Estrutura:
```
1. Data — alinhada à DIREITA: "[DD] de [Mês] de [AAAA]"
2. Destinatário — alinhado à ESQUERDA:
   "To: USCIS"
   "Immigration Officer"
   "[Service Center Address]"
3. Bloco de metadados — fundo sage green (#C5E0B4):
   | Campo | Valor |
   |-------|-------|
   | Ref: | EB-2 National Interest Waiver — Immigrant Petition (I-140) |
   | Beneficiário: | [NOME COMPLETO EM MAIÚSCULAS] |
   | Nacionalidade: | [País] |
   | Natureza: | ORIGINAL SUBMISSION |
   | Classificação: | INA § 203(b)(2)(B) — National Interest Waiver |
   | Código SOC: | [código] — [título] (BLS/O*NET) |
4. Saudação: "Prezado(a) Oficial de Imigração,"
5. Texto introdutório — SEM page break

**ZERO EMPLOYER/SPONSOR NO BLOCO DE METADADOS**
```

### ERROS COMUNS:
```
❌ Capa centrada "title page"
❌ Page break entre capa e conteúdo
❌ Fundo azul no bloco metadata
❌ "Employer: [nome]" ou "Sponsor: [nome]"
❌ Texto em inglês no corpo
✅ Formato carta, sage green, PT-BR, zero employer
```

---

## Página
```
page_width:    Inches(8.5)   — US Letter
page_height:   Inches(11)
top_margin:    Cm(1.5)
bottom_margin: Cm(1.5)
left_margin:   Cm(2.0)       — lado de encadernação
right_margin:  Cm(1.5)
```

## Tipografia — 100% Garamond

| Elemento | Size | Bold | Italic | Color | Shading | Align |
|----------|------|------|--------|-------|---------|-------|
| Título seção (ELIGIBILITY, PRONG X) | 14pt | ✓ | | #000 | #C5E0B4 | LEFT |
| Subtítulo (Part A/B) | 13pt | ✓ | ✓ | #000 | #C5E0B4 | JUSTIFY |
| Subsection (I. II. III.) | 12pt | ✓ | | #000 | — | LEFT |
| Corpo | 12pt | | | #000 | — | JUSTIFY |
| Evidence title | 10pt | ✓ | | #2E7D32 | — | LEFT |
| Evidence metadata | 10pt | | | #000 | — | LEFT |
| Tabela header | 10pt | ✓ | | #000 | #C5E0B4 | LEFT |
| Tabela corpo | 10pt | | | #000 | — | LEFT |
| Footnotes | 10pt | | | #000 | — | LEFT |
| Footer | 8pt | | | #808080 | — | CENTER |
| Placeholder | 8pt | | | #999999 | — | LEFT |

Spacing corpo: before=0, after=4pt, line_spacing=14.5pt

---

## Cores

| Nome | Hex | Uso |
|------|-----|-----|
| Sage Green | #C5E0B4 | Headers shading, table headers |
| Cream | #FFF2CC | Evidence cards background |
| Evidence Green | #2E7D32 | "Evidence XX." texto |
| Black | #000000 | Todo texto, headers |
| Gray | #808080 | Footer, separadores |
| Placeholder | #999999 | [THUMBNAIL] |
| Yellow Highlight | (highlight) | [VERIFICAR] |

**NUNCA**: azul (#0000FF, #0563C1, #1F3864) em nada.

---

## Evidence Card (Tabela 1×2)

```
Tabela: 1 linha × 2 colunas
Col 0 largura: ~3.5cm (thumbnail)
Col 1 largura: restante
Borders: nenhuma visível (hairline gray opcional)
Shading ambas células: #FFF2CC

Col 0 (Thumbnail):
- Imagem da 1ª página do PDF, 160px largura
- Gerar via: pdftoppm -f 1 -l 1 -png -r 150 arquivo.pdf thumb
- Resize: convert thumb-1.png -resize 160x thumb_final.png
- Se não disponível: "[THUMBNAIL]" em 8pt gray #999999

Col 1 (Metadata):
- Linha 1: "Evidence XX. [Título]" — bold, #2E7D32
- Linha 2: "Tipo: [tipo] | Fonte: [fonte]"
- Linha 3: "Data: [data] | URL: [url]"
- Linha 4: "Descrição e Relevância: [texto]"
```

Evidence card SEMPRE ANTES do texto argumentativo. NUNCA depois.

---

## Bordas de Tabelas
```
borders: {
  top:              SINGLE, 1pt, #000000
  bottom:           SINGLE, 1pt, #000000
  insideHorizontal: SINGLE, 1pt, #000000
  left:             NONE
  right:            NONE
  insideVertical:   NONE
}
```
EXCEÇÃO: Evidence cards = sem bordas visíveis.

---

## Synopsis Table
Header: #C5E0B4, Garamond 10pt bold preto
Corpo: Garamond 10pt regular
Bordas: horizontais apenas

## Separadores
`─` × 60, Garamond 8pt, #B4B4B4, CENTER, 6pt before/after

## Footer
`EB-2 NIW | I-140 Petition — Cover Letter [NOME] | Page X of Y`
Garamond 8pt, #808080, CENTER

## Prefixo de Evidência
SEMPRE "Evidence XX" por extenso. NUNCA "Ev. XX".

---
*v1.0 — 01/03/2026*
