# FORMATTING SPECIFICATION — RÉSUMÉ EB-2 NIW (V2.0 — DNA Visual V4)

> Este arquivo define TODAS as constantes visuais e regras de formatação para o résumé EB-2 NIW.
> IDÊNTICO ao EB-1A em layout/design. Diferenças estão apenas na ESTRUTURA DE CONTEÚDO.

---

## 1. PALETA DE CORES — Idêntica ao EB-1A

| Constante | Hex | Uso |
|-----------|-----|-----|
| `NAVY` | `#2D3E50` | Headers, section bars, footer, accent labels |
| `TEAL` | `#3498A2` | Sub-headers, accent line, Gantt cells ativas |
| `WHITE` | `#FFFFFF` | Texto sobre navy/teal |
| `BLACK` | `#000000` | Texto principal, labels bold |
| `DARK_GRAY` | `#333333` | Corpo do texto, impacto italic |
| `MED_GRAY` | `#666666` | Placeholders, captions |
| `LIGHT_GRAY` | `#F5F5F5` | Company box background |
| `BORDER_GRAY` | `#CCCCCC` | Bordas de tabelas e evidence blocks |

**NENHUMA outra cor é permitida.**

---

## 2. TIPOGRAFIA

| Elemento | Fonte | Tamanho | Estilo |
|----------|-------|---------|--------|
| Nome no header | Garamond | 20pt | Bold, Branco |
| RÉSUMÉ label | Garamond | 11pt | Bold, Branco |
| E-mail / SOC | Garamond | 9pt | Regular, Branco |
| Section headers (navy bar) | Garamond | 11pt | Bold, Branco |
| Sub-headers (teal bar) | Garamond | 10pt | Bold, Branco |
| Body text | Garamond | 10.5pt | Regular, Preto |
| Evidence block metadata | Garamond | 10pt | Label Bold + Value Regular |
| Evidence block impact | Garamond | 9.5pt | Italic, #333333 |
| Impact label "Description & Impact" | Garamond | 9.5pt | Bold, #2D3E50 |
| Compact block metadata | Garamond | 9.5pt | Label Bold + Value Regular |
| Compact block impact | Garamond | 9pt | Italic, #333333 |
| Bullets (●) | Garamond | 10.5pt | Regular |
| Sub-bullets (○) | Garamond | 10pt | Regular, #333333 |
| Footer "Page X of Y" | Garamond | 9pt | Regular, Branco |
| Photo captions | Garamond | 9pt | Italic, #666666 |

**REGRA ABSOLUTA: 100% Garamond. ZERO Arial, ZERO Calibri, ZERO qualquer outra fonte.**

---

## 3. PAGE SETUP

```python
section.page_width      = Inches(8.5)   # US Letter
section.page_height     = Inches(11)    # US Letter
section.top_margin      = Inches(0)     # Header colado no topo
section.bottom_margin   = Inches(0.5)
section.left_margin     = Inches(0.65)  # Mais estreito que padrão 1"
section.right_margin    = Inches(0.65)
section.header_distance = Inches(0)
```

**PROIBIDO**: A4, margens de 1", margens de 0.5".

---

## 4. HEADER — 3 Rows x 2 Cols

```
Row 0: NAVY │ [NOME — 20pt Bold Branco]     │ [vazio]
Row 1: NAVY │ [RÉSUMÉ — 11pt Bold]           │ [E-mail — 9pt, right]
             │ SOC/O*Net: XX-XXXX | EB-2 NIW │
Row 2: TEAL │ [accent line — sem texto]       │ [accent line]
```

### Variação EB-2 NIW (vs. EB-1A):
- Row 1 inclui `EB-2 NIW` em vez de `EB-1A`
- SOC/O*Net code do beneficiário

---

## 5. EVIDENCE BLOCKS — Idênticos ao EB-1A

### Standard Evidence Block (2 colunas):
- Coluna esquerda (META_WIDTH = 5760 dxa): Metadata + Impact DENTRO
- Coluna direita (THUMB_WIDTH = 4320 dxa): Thumbnail 2.6" width
- Borda: #CCCCCC, sz=4

### Compact Evidence Block:
- Coluna esquerda: 6480 dxa
- Coluna direita: 3600 dxa, Thumbnail 2.0" width

### REGRA CRÍTICA: Impact DENTRO do bloco, nunca abaixo.

---

## 6. COMPONENTES ESPECÍFICOS EB-2 NIW

### 6.1 Proposed Endeavors Section

Cada Proposed Endeavor usa:
1. **Teal Sub-Header** com título da proposta
2. **Parágrafo introdutório** (4-6 linhas mínimo)
3. **Evidence blocks** com dados de mercado, códigos BLS, políticas governamentais
4. **Bullets** com dados quantitativos

### 6.2 Tabela Comparativa de Propostas

```
┌─── NAVY HEADER ─────────────────────────────────────────────────┐
│ Dimensão │ Proposta A │ Proposta B │ Proposta C                   │
├──────────┼────────────┼────────────┼────────────────────────────┤
│ Mercado  │ ...        │ ...        │ ...         │ alt rows     │
│ BLS Code │ ...        │ ...        │ ...                         │
│ Política │ ...        │ ...        │ ...                         │
└──────────┴────────────┴────────────┴────────────────────────────┘
```

- Header row: Navy bg, White text
- Alternate rows: #F5F5F5 / #FFFFFF
- All Garamond 9.5pt

### 6.3 Dhanasar Framework Reference

Parágrafo conclusivo referenciando os 3 prongs de Dhanasar:
1. Substantial merit and national importance
2. Well positioned to advance the endeavor
3. Balance of equities (benefit to US)

---

## 7. SEÇÕES ESPECÍFICAS EB-2 NIW (vs. EB-1A)

### Seções que existem em AMBOS:
- Header, Síntese Profissional, Histórico (Gantt), Experiência
- Formação Acadêmica, Cartas de Recomendação

### Seções que existem APENAS no EB-2 NIW:
- **PROJETO EB-2 NIW — PROPOSED ENDEAVORS** (seção principal diferenciadora)
- **Qualificações Técnicas** (mais detalhado que EB-1A)

### Seções que existem APENAS no EB-1A:
- Seções por Critério (C1-C10)
- Prêmios, Membership, Published Material, etc.

### Seções que MUDAM de nome/enfoque:
| EB-1A | EB-2 NIW |
|-------|----------|
| Original Contributions of Major Significance | Contribuições Técnicas e Profissionais |
| Leading or Critical Role | Experiência e Liderança |
| Scholarly Articles | Publicações e Artigos |

---

## 8. CHECKLIST DE FORMATAÇÃO

Antes de entregar qualquer résumé EB-2 NIW:

- [ ] 100% Garamond — zero Arial
- [ ] Paleta: Navy, Teal, White, Black, Grays (#333, #666, #F5F5F5, #CCC)
- [ ] Margins: 0.65" left/right
- [ ] Paper: US Letter 8.5" x 11"
- [ ] Header: Navy bar + nome + RÉSUMÉ + EB-2 NIW + Teal accent
- [ ] Footer: Navy bar + Page X of Y
- [ ] Evidence blocks com impact DENTRO
- [ ] Thumbnails na coluna DIREITA (2.6" padrão, 2.0" compacto)
- [ ] Proposed Endeavors com Teal sub-headers
- [ ] Tabela comparativa com Navy header
- [ ] Referência ao framework Dhanasar
- [ ] Zero R$ (exceto se Paulo autorizar)
- [ ] Mínimo 4 linhas por parágrafo de impacto

---

*Formatting Spec Résumé EB-2 NIW V2.0 — DNA Visual V4 — 03/mar/2026*
