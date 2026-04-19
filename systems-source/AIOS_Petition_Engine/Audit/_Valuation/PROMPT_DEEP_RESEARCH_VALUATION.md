# Deep Research — Validação de Valuation AIOS/Petition Engine

## CONTEXTO
Estou validando um valuation de $15-30M para uma startup de automação de petições de imigração (EB-1A, EB-2 NIW, O-1) usando IA generativa. Produto: 17 sistemas proprietários que geram Cover Letters, Résumés, Business Plans, Cartas de Recomendação e análise de impacto econômico em pipeline end-to-end. Pré-revenue em escala (~5 casos/mês, target 30). Preciso de dados REAIS para fundamentar.

---

## PESQUISA 1: Comparable Seed Rounds em LegalTech (2023-2026)

Encontre TODOS os seed rounds em legaltech vertical SaaS de 2023 a 2026. Para cada um, preciso:

| Campo | Detalhe |
|-------|---------|
| Empresa | Nome |
| Produto | O que faz |
| Round | Seed, Pre-seed, Series A |
| Valor levantado | Em USD |
| Valuation (pre ou post-money) | Se disponível |
| Data | Mês/Ano |
| Investidores | Lead + participantes |
| ARR no momento do round | Se disponível |
| Fonte | URL do Crunchbase, TechCrunch, etc. |

**Empresas-alvo para pesquisar (se seed rounds existem):**
- Parley (YC S24) — immigration AI
- Alma Immigration — raised $5.1M
- LegalOS (YC W26) — trained on 12K petitions
- Visalaw AI — immigration petition drafting
- Lighthouz AI — legal AI
- EvenUp — injury demand letters AI
- Casetext (antes da aquisição Thomson Reuters)
- Harvey AI — legal AI
- Spellbook — contract AI
- Ironclad — CLM
- Checkbox — legal workflow
- Josef — legal automation
- Lawyaw — document assembly
- Smokeball — practice management
- Docketwise (quando foi seed, antes da 8am)
- Robin AI — contract review
- Klarity — contract analysis
- Luminance — AI legal
- Ontra — legal ops

**Também buscar:**
- Qualquer startup de "immigration tech" ou "immigration AI" que levantou capital
- Rounds em "document automation" + legal
- Rounds em "petition generation" ou "legal drafting AI"

---

## PESQUISA 2: Aquisições em LegalTech/ImmigrationTech

Encontre TODAS as aquisições relevantes:

| Campo | Detalhe |
|-------|---------|
| Target | Empresa adquirida |
| Acquirer | Quem comprou |
| Valor | Em USD |
| Revenue múltiplo implícito | Se calculável |
| Data | Mês/Ano |
| Fonte | URL |

**Aquisições conhecidas para detalhar:**
- Casetext por Thomson Reuters ($650M, 2023)
- INSZoom por Mitratech (2020, valor?)
- LawLogix por Hyland (valor?)
- Legalpad — status? Adquirida?
- Docketwise por AffiniPay/8am (valor?)
- SimpleCitizen (immigration) — status?
- Boundless Immigration — status/funding?

---

## PESQUISA 3: Métricas de Valuation para Vertical SaaS Seed (2024-2026)

Preciso de benchmarks de mercado:

1. **Revenue múltiplos medianos** para legaltech SaaS (seed, Series A, Series B)
2. **ARR mediano no seed** para vertical SaaS em 2024-2025
3. **Valuation mediano pre-money no seed** para vertical AI SaaS
4. **LTV/CAC benchmarks** para legaltech
5. **Churn benchmarks** para legaltech SMB vs Enterprise

Fontes ideais:
- Carta (ex-eShares) — dados de rounds
- PitchBook — legaltech market map
- SaaS Capital — valuation multiples
- OpenView Partners — SaaS benchmarks
- Bessemer Venture Partners — cloud index
- Jason Lemkin / SaaStr — seed benchmarks
- Tomasz Tunguz — SaaS metrics
- Kyle Poyar (OpenView) — usage-based pricing data

---

## PESQUISA 4: Mercado de Imigração — Dados USCIS Oficiais

Preciso de dados atualizados do USCIS para fundamentar o TAM:

1. **Petições EB-1A filed/approved/denied** — FY2023, FY2024, Q1-Q2 FY2025
2. **Petições EB-2 NIW filed/approved/denied** — mesmos períodos
3. **Petições O-1 filed/approved/denied** — mesmos períodos
4. **RFE rates** por categoria e Service Center
5. **Processing times** atuais
6. **Total de I-140 petitions** filed por ano
7. **Número de firmas de imigração** registradas nos EUA (AILA membership, ou Census NAICS 54111)

Fontes:
- USCIS Quarterly Reports (uscis.gov)
- USCIS Annual Reports
- AILA InfoNet
- National Foundation for American Policy (NFAP) reports
- Cato Institute immigration reports
- Migration Policy Institute (MPI)

---

## PESQUISA 5: Metodologias de Valuation para Pre-Revenue

Encontre referências acadêmicas e práticas sobre como VCs avaliam startups pre-revenue:

1. **Berkus Method** — valores típicos por milestone em 2024-2025
2. **Scorecard Method** — fatores e pesos padrão
3. **Risk Factor Summation** — 12 categorias
4. **Cost-to-Recreate** — como calcular para IP de software/prompts
5. **Venture Capital Method** — exit multiples típicos em legaltech
6. **First Chicago Method** — 3 cenários (bull/base/bear)

---

## OUTPUT ESPERADO

1. **Tabela de Comparable Transactions** — mínimo 15 rounds, com valuation e ARR quando disponível
2. **Tabela de Aquisições** — mínimo 5, com múltiplos implícitos
3. **Benchmark de Métricas** — medianas de seed legaltech
4. **Dados USCIS** — números reais com fonte
5. **Recomendação de Metodologia** — qual método usar dado o estágio (pre-revenue, 17 sistemas, 100+ casos)
6. **Range de Valuation Fundamentado** — com cálculo visível

Todos os dados com fonte e URL. Sem inventar números.
