# SISTEMA BP - Business Plan Generation Architecture

## Overview

The BP System generates comprehensive business plans through a **6-block sequential generation flow**. Each block contains related sections that are generated in order, with context from previous blocks feeding into subsequent ones.

The system is designed to produce professional, research-based business plans for US companies. All output reads as a pure business plan — no immigration context is ever present.

## 6-Block Sequential Generation Flow

### Block 1: Sumario Executivo (Sections S1-S4)
**Purpose:** Establish the business identity, timeline, vision, and legal framework.

| Order | ID  | Section Name                              |
|-------|-----|-------------------------------------------|
| 01    | S1  | Sumario Executivo — Oportunidade de Negocio |
| 02    | S2  | Timeline do Negocio (Resumo)               |
| 03    | S3  | Visao, Missao e Valores                    |
| 04    | S4  | Enquadramento Juridico                     |

**Input Required:** Research Pack, company data, entrepreneur profile.
**Output:** Foundation context for all subsequent blocks.

### Block 2: Analise Estrategica (Sections S5-S16)
**Purpose:** Market analysis, competitive landscape, strategic frameworks.

| Order | ID   | Section Name                              |
|-------|------|-------------------------------------------|
| 05    | S5   | Perspectivas do Mercado                    |
| 06    | S5b  | Relevancia, Oportunidades e Perspectivas Futuras |
| 07    | S6   | Cadeia de Suprimentos                      |
| 08    | S7   | Empregabilidade Esperada                   |
| 09    | S8   | Gestao do Conhecimento                     |
| 10    | S9   | Impactos ESG                               |
| 11    | S10  | Analise SWOT                               |
| 12    | S11  | SWOT Cruzada                               |
| 13    | S11b | Matriz ANSOFF                              |
| 14    | S12  | Analise de Concorrentes                    |
| 15    | S13  | Ameaca de Novos Entrantes                  |
| 16    | S14  | Poder de Negociacao dos Clientes           |
| 17    | S15  | Poder de Negociacao dos Fornecedores       |
| 18    | S16  | Produtos ou Servicos Substitutos           |

**Input Required:** Block 1 context + market research data from Research Pack.
**Output:** Strategic analysis foundation for marketing and operations.

### Block 3: Marketing Plan (Sections S17-S25)
**Purpose:** Market segmentation, positioning, 4Ps, and digital marketing strategy.

| Order | ID  | Section Name                              |
|-------|-----|-------------------------------------------|
| 19    | S17 | Segmentacao de Mercado                     |
| 20    | S18 | Publico-Alvo B2C                           |
| 21    | S19 | Setor-Alvo B2B                             |
| 22    | S20 | Posicionamento da Marca                    |
| 23    | S21 | Produto — Analise de Valor                 |
| 24    | S22 | Analise de Preco                           |
| 25    | S23 | Praca — Estrategia de Distribuicao         |
| 26    | S24 | Promocao — Orcamento de Marketing          |
| 27    | S25 | Estrategia de Marketing 4.0               |

**Input Required:** Block 1-2 context + pricing/market data.
**Output:** Complete marketing strategy for operational planning.

### Block 4: Operational Plan (Sections S26-S31)
**Purpose:** Team structure, physical resources, technology, location, capacity.

| Order | ID  | Section Name                              |
|-------|-----|-------------------------------------------|
| 28    | S26 | Quadro de Funcionarios                     |
| 29    | S27 | Layout do Empreendimento                   |
| 30    | S28 | Recursos Fisicos e Equipamentos            |
| 31    | S29 | Recursos Tecnologicos                      |
| 32    | S30 | Localizacao do Negocio                     |
| 33    | S31 | Capacidade Produtiva                       |

**Input Required:** Block 1-3 context + operational data.
**Output:** Operational foundation for financial projections.

### Block 5: Financial Plan (Sections S32-S37)
**Purpose:** Financial projections, revenue estimates, DRE, ROI indicators, break-even.

| Order | ID  | Section Name                              |
|-------|-----|-------------------------------------------|
| 34    | S32 | Premissas Financeiras                      |
| 35    | S33 | Investimentos                              |
| 36    | S34 | Estimativa de Receitas e Custos            |
| 37    | S35 | DRE — Demonstrativo de Resultados          |
| 38    | S36 | Indicadores de Retorno                     |
| 39    | S37 | Break Even Point                           |

**Input Required:** Block 1-4 context + financial data from entrepreneur.
**Output:** Complete financial analysis.

### Block 6: Conclusao (Sections S38-S40)
**Purpose:** Implementation timeline, final considerations, references.

| Order | ID  | Section Name                              |
|-------|-----|-------------------------------------------|
| 40    | S38 | Timeline de Implementacao                  |
| 41    | S39 | Consideracoes Finais                       |
| 42    | S40 | Referencias e Fontes                       |

**Input Required:** All previous blocks context.
**Output:** Final document sections + bibliography.

## Research Pack Requirement

Every business plan generation **requires a Research Pack** before section generation begins. The Research Pack provides:

1. **Market Data:** Industry statistics, market size, growth rates from verified sources (BLS, Census, IBISWorld)
2. **Regulatory Framework:** Applicable federal/state regulations, licensing requirements
3. **Competitive Landscape:** Real competitor profiles (never fabricated)
4. **Financial Benchmarks:** Industry-standard margins, salary ranges, cost structures
5. **Location Data:** Demographics, economic indicators for target market areas
6. **Technology Assessment:** Relevant technology trends and adoption rates

**Research Pack Sources (preferred):**
- Bureau of Labor Statistics (BLS)
- U.S. Census Bureau
- IBISWorld Industry Reports
- OSHA / CDC / HHS / HRSA (.gov sources)
- SEC EDGAR (for public competitor data)
- State-specific regulatory databases

**Anti-Hallucination Rule:** If the Research Pack does not contain specific data points, sections must use "to be defined by the entrepreneur" or cite generic market ranges with source attribution. **Never fabricate data.**

## Generation Flow

```
Research Pack Assembly
        |
        v
[Block 1] Sumario Executivo (S1-S4)
        |
        v
[Block 2] Analise Estrategica (S5-S16)
        |
        v
[Block 3] Marketing Plan (S17-S25)
        |
        v
[Block 4] Operational Plan (S26-S31)
        |
        v
[Block 5] Financial Plan (S32-S37)
        |
        v
[Block 6] Conclusao (S38-S40)
        |
        v
Quality Gates Validation
        |
        v
DOCX Assembly (generate_bp_v2.py)
```

## Section Prompt Structure

Each section's system prompt includes:

1. **Size Rule:** 500-700 words per section (inviolable). Financial sections (DRE, Indicators, BEP) may go up to 900 words. Short sections (ESG, Vision/Mission) can be 400 words.
2. **Output Rule:** No metacommentary, reasoning, or planning text. Start directly with the section title (##) or first paragraph.
3. **Anti-Hallucination Rules:** Never fabricate numbers, competitor names, or source URLs.
4. **Prohibited Terms:** See `FORBIDDEN_CONTENT_BP.md`.
5. **Writing Quality:** Formal, professional, impersonal (third person). Expository tone.
6. **Table Rules:** Every table requires an introductory paragraph before and a conclusive paragraph after.
7. **Citation Format:** Superscript only in text (e.g., text[1]). No inline references.
8. **Format:** Markdown with ## for titles, ### for subtitles, **bold** for key terms.

## Configuration

- **Default Model:** claude-haiku-4-5-20251001
- **Default Language:** pt-BR (configurable per generation)
- **Source JSON:** `bp-system-export-2026-03-22.json`
- **Section Files:** `BP_SYSTEM_V3/sections/` (42 .md files)
