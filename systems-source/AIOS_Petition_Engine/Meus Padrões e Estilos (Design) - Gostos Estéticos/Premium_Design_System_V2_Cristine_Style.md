# Premium Design System V2 — Estilo Cristine (Anteprojeto EB-2 NIW)

> **Owner:** Paulo (paulorenatolima@yahoo.com.br)
> **Referência:** Anteprojeto Estratégico — Cristine Correa — EB-2 NIW (Refile)
> **Status:** Extraído do documento aprovado — alternativa premium ao Estilo Antônio (V1)
> **Last Updated:** 2026-04-02

---

## Overview

Design system extraído do Anteprojeto da Cristine Correa. Mais sóbrio, profissional e "corporate" que o Estilo Antônio (V1). Usa Calibri em vez de Garamond, paleta Navy escuro + Warm Beige, e dividers Bronze (#8B7355) em vez de Gold (#C9A96E). Ideal para Anteprojetos, Projetos-Base, e documentos estratégicos.

**Quando usar cada estilo:**

| Estilo | Tipo de documento | Vibe |
|--------|-------------------|------|
| **V1 (Antônio)** | Evidence documents, Résumés, Cover Letters, SaaS Evidence | Premium elegante — Garamond + Gold + titleBar |
| **V2 (Cristine)** | Anteprojetos, Projetos-Base, Análises Estratégicas, Relatórios | Corporate sóbrio — Calibri + Bronze + dividers |

---

## Color Scheme

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| NavyDark | `#1B2A3D` | 27,42,61 | Table headers bg, section titles, headings |
| WarmBeige | `#EDE8DF` | 237,232,223 | Table label cells bg (first column) |
| Bronze | `#8B7355` | 139,115,85 | Horizontal dividers, section borders |
| DeepBrown | `#5A5550` | 90,85,80 | Subtitle text, secondary info |
| WineRed | `#5C2028` | 92,32,40 | Accent (sparingly — emphasis markers) |
| White | `#FFFFFF` | 255,255,255 | Text on dark backgrounds |
| Black | `#000000` | 0,0,0 | Body text |

### Diferenças vs. V1 (Antônio):
- NavyDark #1B2A3D (mais escuro que V1 #1B2A4A — sutil mas perceptível)
- Bronze #8B7355 no lugar de Gold #C9A96E (mais sóbrio)
- WarmBeige #EDE8DF no lugar de LightGray #F7F7F7 (mais quente)
- WineRed #5C2028 como accent (V1 não tem accent vermelho)

---

## Typography

| Element | Font | Size | Color | Weight | Notes |
|---------|------|------|-------|--------|-------|
| Document Title | Calibri | 20pt | #1B2A3D | Bold | Centralizado |
| Visa Type Label | Calibri | 18pt | #1B2A3D | Normal | "EB-2 NIW — National Interest Waiver" |
| Client Name | Calibri | 13pt | #1B2A3D | Bold | Centralizado |
| Subtitle (cover) | Calibri | 11pt | #5A5550 | Normal | "Modelagem de Proposed Endeavors" |
| Section Heading (H1) | Calibri | Inherit | #1B2A3D | Bold | ALL CAPS, with Bronze bottom border |
| Subsection (H2) | Calibri | Inherit | #1B2A3D | Bold | Numbered: "4.1 Descrição Técnica" |
| Sub-subsection (H3) | Calibri | Inherit | #1B2A3D | Bold | "Prong 1 —", "Política 1 —" |
| Body text | Calibri | 11pt | Black | Normal | Justified |
| List items | Calibri | 11pt | Black | Normal | Bullet style |
| Table header | Calibri | 9pt | #FFFFFF | Bold | On NavyDark #1B2A3D bg |
| Table label cell | Calibri | 9pt | Black | Bold | On WarmBeige #EDE8DF bg |
| Table data cell | Calibri | 9pt | Black | Normal | White bg |
| Header | Calibri | 8pt | #5A5550 | Normal | Centered, with bullet separators |
| Footer | Calibri | 8pt | #5A5550 | Normal | With pipe separators |
| Confidential note | Calibri | 9pt | #5A5550 | Normal | Centered, italic |
| Date | Calibri | 9pt | #5A5550 | Normal | "Março de 2026" (month/year only) |

### Diferenças vs. V1 (Antônio):
- **Calibri em tudo** (V1 usa Garamond)
- Tamanhos menores e mais uniformes (V1 tem 36pt/28pt/24pt hierarchy)
- Sem letter-spacing exagerado (V1 usa spc=200/300/400)
- Mais "corporate report" e menos "luxury certificate"

---

## Page Setup

| Property | Value |
|----------|-------|
| Page size | US Letter (8.5 × 11 inches) |
| Top margin | 1.00 inch |
| Bottom margin | 1.00 inch |
| Left margin | 1.10 inch |
| Right margin | 1.00 inch |
| Orientation | Portrait |

### Diferenças vs. V1:
- Margens simétricas e tradicionais (V1 tem margens estreitas 0.7/0.6/0.8/0.6)
- V2 é mais espaçoso, menos "cramped"

---

## Cover Page Structure

```
[Bronze divider line bottom — 6pt — #8B7355]

                    (spacer)

            ANTEPROJETO ESTRATÉGICO           (20pt, NavyDark, Bold, center)
        EB-2 NIW — National Interest Waiver   (18pt, NavyDark, center)

                ───────────────               (text divider, Bronze)

                [CLIENT NAME]                 (13pt, NavyDark, Bold, center)
         Modelagem de Proposed Endeavors      (11pt, DeepBrown, center)
                Caso IOE0933872608            (9pt, DeepBrown, center)

      Documento Preliminar — Versão para      (9pt, DeepBrown, center)
              Revisão do Cliente

                Março de 2026                 (9pt, DeepBrown, center)

[Bronze divider line top — 6pt — #8B7355]

            DOCUMENTO CONFIDENCIAL            (9pt, DeepBrown, italic, center)
```

### Diferenças vs. V1:
- Sem "PRODUCT DOSSIER" ou "PETITION" no topo
- Dividers Bronze (não Gold)
- Divider de texto "───────────────" em vez de barra horizontal
- Mais informação na capa (caso#, tipo de documento)
- Sem URL (anteprojeto não tem site)
- Sem "CONFIDENTIAL — FOR INSTITUTIONAL REVIEW ONLY" gritado — usa "Documento Confidencial" discreto

---

## Section Headers (H1)

```
NOTA METODOLÓGICA                             (Bold, NavyDark)
──────────────────────────────────────────    (Bronze bottom border, 4pt, #8B7355)
```

Padrão: Heading 1 text em ALL CAPS (ou title case com numeração romana: "I. QUADRO COMPARATIVO"), seguido de uma border Bronze no bottom do parágrafo.

### Numeração de seções:
```
I. QUADRO COMPARATIVO DOS PROPOSED ENDEAVORS
II. CONTEXTUALIZAÇÃO DA PETICIONÁRIA E DO REFILE
III. ARCABOUÇO DE ADJUDICAÇÃO: MATTER OF DHANASAR
IV. PROPOSED ENDEAVOR 1 — WORKFORCE BEHAVIORAL INTELLIGENCE
V. PROPOSED ENDEAVOR 2 — ORGANIZATIONAL CLIMATE & RETENTION
VI. PROPOSED ENDEAVOR 3 — INCLUSIVE WORKFORCE DEVELOPMENT
VII. ANÁLISE LEGAL COMPARATIVA POR ESTADO
VIII. CÓDIGOS DE OCUPAÇÃO BLS (SOC CODES)
IX. CONSIDERAÇÕES OPERACIONAIS E FINANCEIRAS INICIAIS
X. POSICIONAMENTO ESTRATÉGICO NA PETIÇÃO EB-2 NIW
XI. PRÓXIMAS ETAPAS
```

---

## Subsections (H2, H3)

**H2:** `4.1 Descrição Técnica do Empreendimento` — NavyDark, Bold, sem border
**H3:** `Prong 1 — Mérito Substancial e Importância Nacional` — NavyDark, Bold, sem border
**H3 (Política):** `Política 1 — WIOA/MASA e Workforce Development` — NavyDark, Bold, sem border

Hierarquia clara: I → 4.1 → Política 1 (sem decoração excessiva)

---

## Tables

### Header Row
- Background: NavyDark `#1B2A3D`
- Text: White `#FFFFFF`, Bold, Calibri 9pt
- Alignment: Left

### Label Column (first column)
- Background: WarmBeige `#EDE8DF`
- Text: Black, Bold, Calibri 9pt

### Data Cells
- Background: White
- Text: Black, Normal, Calibri 9pt

### Table Borders
- Standard table borders (thin, gray)
- NO zebra striping (alternating rows)
- Clean, corporate look

### Tabela Comparativa (exemplo — 16×4):
```
┌─────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ [NavyDark bg]   │ [NavyDark bg]    │ [NavyDark bg]    │ [NavyDark bg]    │
│ Proposed Endeav │ PE 1 — Behav...  │ PE 2 — Climate   │ PE 3 — Inclusive │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ [Beige bg BOLD] │ [White bg]       │ [White bg]       │ [White bg]       │
│ Descrição       │ Instituto de...  │ Plataforma de... │ Consultoria...   │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ [Beige bg BOLD] │ [White bg]       │ [White bg]       │ [White bg]       │
│ TAM             │ US$ 50.6B        │ US$ 14.4B        │ US$ 4.2B         │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

## Header (running, all pages)

```
ANTEPROJETO ESTRATÉGICO   •   Cristine Correa   •   EB-2 NIW
```

- Font: Calibri 8pt
- Color: DeepBrown #5A5550
- Alignment: Centered
- Separators: Bullet `•` (not pipe `|`)
- NO border (clean)

### Template:
```
[DOC_TYPE]   •   [CLIENT_NAME]   •   [VISA_TYPE]
```

---

## Footer (running, all pages)

```
Documento Confidencial   |   Março 2026   |   p. 1
```

- Font: Calibri 8pt
- Color: DeepBrown #5A5550
- Alignment: Centered
- Separators: Pipe `|`
- Page number: `p. X` format

### Template:
```
Documento Confidencial   |   [Month Year]   |   p. [PAGE]
```

### Diferenças vs. V1:
- Centralizado (V1 tem left + right com tab)
- Sem "CONFIDENTIAL" gritado em Gold
- Sem borda Gold top (mais limpo)
- Com numeração de página

---

## Horizontal Dividers

- Color: Bronze `#8B7355`
- Weight: 4pt (sections) ou 6pt (cover page)
- Style: `single`
- Position: Bottom border do parágrafo (w:pBdr → w:bottom)
- Applied to: ALL Heading 1 paragraphs + cover page separators

---

## Document Structure Pattern (Anteprojeto EB-2 NIW)

```
1. COVER PAGE
   - Title, visa type, dividers, client name, subtitle, date, confidential

2. NOTA METODOLÓGICA
   - Fontes de dados, metodologia, escopo geográfico

3. QUADRO COMPARATIVO (Table 16×4)
   - 3 Proposed Endeavors lado a lado
   - 16 critérios comparados

4. CONTEXTUALIZAÇÃO
   - 4.1 Perfil da Peticionária
   - 4.2 Contexto do Refile
   - 4.3 Cenário de Adjudicação 2025-2026

5. ARCABOUÇO JURÍDICO (Dhanasar)
   - Prong 1, 2, 3 explicados

6-8. PROPOSED ENDEAVORS (1 seção por PE)
   - Descrição Técnica
   - Dimensionamento de Mercado e Vazio Competitivo
   - Enquadramento Legal
   - Políticas Públicas (4 por PE)
   - Nexo Causal com Prong 1

9. ANÁLISE LEGAL COMPARATIVA POR ESTADO (Table)

10. CÓDIGOS BLS (Table comparativa)

11. CONSIDERAÇÕES FINANCEIRAS
    - Modelo Asset-Light
    - Projeções (Table)
    - Estratégia de Lançamento (12 meses)

12. POSICIONAMENTO ESTRATÉGICO (Table Prongs × PEs)

13. PRÓXIMAS ETAPAS
```

---

## Comparação V1 vs V2

| Dimensão | V1 (Antônio/EB-1A) | V2 (Cristine/EB-2 NIW) |
|----------|---------------------|------------------------|
| **Fonte** | Garamond | Calibri |
| **Vibe** | Luxury certificate | Corporate report |
| **Dividers** | Gold #C9A96E | Bronze #8B7355 |
| **Navy** | #1B2A4A | #1B2A3D (mais escuro) |
| **Table header bg** | Navy gradient | NavyDark solid |
| **Table label bg** | LightGray #F7F7F7 | WarmBeige #EDE8DF |
| **Header style** | Name bold left + category right | Centered with bullet separators |
| **Footer style** | Left bold + CONFIDENTIAL right | Centered with pipe separators |
| **Title sizes** | 36pt → 28pt → 24pt | 20pt → 18pt → 13pt |
| **Letter-spacing** | Heavy (spc=200-400) | None |
| **Margens** | Estreitas (0.7/0.6/0.8/0.6) | Standard (1.0/1.0/1.1/1.0) |
| **Tech stack** | Node.js + docx-js | python-docx ou docx-js |
| **Ideal para** | Evidence docs, Résumés, SaaS | Anteprojetos, Estratégia, Relatórios |

---

## Regra de Seleção

Quando o Petition Engine gerar um documento, usar:

```
if (doc_type in ['anteprojeto', 'projeto_base', 'strategy', 'impacto_report', 'location_analysis']):
    use V2 (Cristine Style) — corporate sóbrio
else if (doc_type in ['resume', 'cover_letter', 'saas_evidence', 'business_plan']):
    use V1 (Antônio Style) — luxury premium
else if (doc_type in ['methodology', 'declaration_of_intentions']):
    use PPTX Engineering Spec — slides
else:
    use V1 (default)
```

---

*Design System V2 extraído do Anteprojeto Estratégico — Cristine Correa — EB-2 NIW*
*Medidas exatas extraídas via python-docx analysis em 2 de abril de 2026*
