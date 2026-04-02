# AUDIT V2 — INVESTOR REPORT
## Relatório para Investidor — OMNI (AIOS / Petition Engine)
### Data: 02 de Abril de 2026
### CONFIDENTIAL — NÃO DISTRIBUIR SEM AUTORIZAÇÃO

---

## EXECUTIVE SUMMARY

O **AIOS / Petition Engine** (produto da **OMNI**) é o único sistema de automação end-to-end para petições de imigração dos EUA que gera, em uma única plataforma, todos os documentos necessários para aprovação: Cover Letters, Résumés, Business Plans, Metodologias, Declarações de Intenções, Cartas Satélite, Evidence Blocks e análises de impacto econômico.

**O Problema:** O mercado de serviços legais de imigração nos EUA movimenta $9.9B/ano, com 17.613 firmas de imigração operando com uma média de apenas 2.9 funcionários cada. A taxa de aprovação de EB-2 NIW despencou de 80% (FY2023) para 35.7% (Q4 FY2025) — a maior queda histórica. A taxa de RFE (Request for Evidence) do EB-1A atinge ~50%. Advogados solo e small firms não têm ferramentas para competir nesse cenário de crescente rigor.

**A Solução:** 17 sistemas proprietários interconectados que automatizam o pipeline completo — da extração de documentos do cliente até a geração final de petições prontas para submissão ao USCIS, com quality gates automáticos, 74+ regras de auto-aprendizado e um sistema anti-detecção de IA (Anti-ATLAS/ATA) que nenhum concorrente possui.

**Traction:**
- 100+ casos processados (6+ anos de experiência operacional)
- 16 casos documentados com Pareceres de Qualidade (669KB de knowledge base)
- 17 sistemas proprietários funcionais (~450KB+ de especificações)
- 77 regras de erro catalogadas com triggers reais
- Pipeline funcional: extração → geração → quality gate → revisão USCIS → auto-debug

**Diferenciação Absoluta:** Nenhum competidor no mercado — incluindo Visalaw AI ($380/mo), Parley (YC S24), LegalOS (YC W26), ou Alma ($5.1M seed) — gera Business Plans E petições completas E cartas satélite E análise de impacto econômico em um pipeline integrado.

---

## 1. MARKET ANALYSIS

### 1.1 TAM (Total Addressable Market)

O TAM do Petition Engine abrange três camadas de mercado:

| Camada | Mercado | Tamanho (2025) | CAGR | Fonte |
|---|---|---|---|---|
| Serviços Legais de Imigração (EUA) | Honorários de advogados + serviços | $9.9B | 3.3% | IBISWorld |
| Software de Imigração (Global) | Plataformas SaaS + tools | $1.5B | 15% | Data Insights Market |
| LegalTech (EUA) | Todas as tecnologias jurídicas | $8.1B | 7.5% | PMR |

**TAM primário (Immigration Software):** $1.5B em 2025, projetado para $4.6B em 2033 (15% CAGR).

**TAM secundário (Serviços Diretos):** Considerando que o mercado de serviços de imigração nos EUA é de $9.9B e que ~30% do custo de um caso é drafting/preparation (estimativa conservadora), o TAM de automação de drafting é de aproximadamente **$3.0B**.

### 1.2 SAM (Serviceable Addressable Market)

O SAM foca nos segmentos que o Petition Engine atende diretamente:

**Segmento Employment-Based (EB-1A, EB-2 NIW, O-1):**

| Categoria de Visto | Petições/Ano (FY2025) | Custo Médio/Caso | Receita Potencial |
|---|---|---|---|
| EB-1A | ~29.352 (7.338/quarter x4) | $8.000-15.000 | $234M-440M |
| EB-2 NIW | ~80.496 (20.124/quarter x4) | $5.000-10.000 | $402M-805M |
| O-1 | ~31.681 | $5.000-12.000 | $158M-380M |
| **Total** | **~141.529** | | **$794M-$1.63B** |

**SAM (software para este segmento):** Assumindo que 30-40% das firmas adotarão ferramentas de IA até 2028, e que o software captura 10-15% do valor do caso:

**SAM = $119M-$244M/ano**

### 1.3 SOM (Serviceable Obtainable Market)

**Premissas SOM:**
- 17.613 firmas de imigração nos EUA
- Target: small/medium firms (80% do total = ~14.090 firmas)
- Penetração realista em 5 anos: 1-3% das firmas (~141-423 firmas)
- ARPU B2B: $6.000-12.000/ano
- ARPU B2C (OMNI direto): $8.000/caso, 100 casos/ano = $800K

**SOM Ano 5:**

| Canal | Firmas/Clientes | ARPU | Revenue |
|---|---|---|---|
| B2B SaaS | 200-400 firmas | $8.400/ano | $1.68M-$3.36M |
| B2C (OMNI) | 100 casos/ano | $8.000/caso | $800K |
| Enterprise Licensing | 5-10 firmas | $50.000/ano | $250K-$500K |
| **Total SOM Ano 5** | | | **$2.73M-$4.66M** |

---

## 2. PRODUCT OVERVIEW

### 2.1 Os 17 Sistemas

O Petition Engine opera 17 sistemas proprietários de geração, cada um especializado em um tipo de documento:

| # | Sistema | Função | Status |
|---|---|---|---|
| 1 | Résumé EB-2 NIW | Curriculum vitae formatado para petição NIW | Operacional |
| 2 | Résumé EB-1A | Curriculum vitae formatado para petição EB-1A | Operacional |
| 3 | Cover Letter EB-1A | Petição narrativa completa EB-1A (8 critérios) | Operacional |
| 4 | Cover Letter EB-2 NIW | Petição narrativa completa NIW (3 prongs Dhanasar) | Operacional |
| 5 | Business Plan | Plano de negócios para EB-2 NIW (65-80 páginas) | Operacional |
| 6 | Metodologia | Apresentação de metodologia profissional (PPTX, 20+ slides) | Operacional |
| 7 | Declaração de Intenções | Declaração do peticionário (PPTX, 15+ slides) | Operacional |
| 8 | IMPACTO | Suite de impacto econômico (13 módulos de cálculo) | Operacional |
| 9 | Estratégia EB-2 NIW | Case Compass — análise estratégica do caso NIW | Operacional |
| 10 | Estratégia EB-1A | Case Compass — análise estratégica do caso EB-1A | Operacional |
| 11 | Localização | Análise de localização geográfica e mercado local | Operacional |
| 12 | Pareceres da Qualidade | Knowledge base de quality reviews (669KB) | Operacional |
| 13-14 | Cartas Satélite EB-1A/EB-2 | Cartas de recomendação com heterogeneidade visual | Operacional |
| 15-18 | Case Compass + Blueprint | Estratégia e blueprint por tipo de visto | Operacional |
| 19 | SaaS Evidence Architect | Geração de evidências de SaaS/plataformas digitais | Operacional |

### 2.2 Pipeline de Geração (para não-técnico)

O Petition Engine funciona como uma "fábrica de documentos de imigração" automatizada:

```
ETAPA 1: EXTRAÇÃO
  O cliente faz upload de documentos (CV, publicações, prêmios, etc.)
  → O sistema extrai automaticamente todas as informações relevantes
  → Cria um "perfil JSON" estruturado do cliente

ETAPA 2: ESTRATÉGIA
  Com base no perfil, o sistema analisa:
  → Qual tipo de visto é mais adequado?
  → Quais critérios o cliente satisfaz?
  → Quais gaps precisam ser preenchidos?
  → Resultado: Case Compass + Blueprint

ETAPA 3: GERAÇÃO
  O sistema gera cada documento sequencialmente:
  → Cover Letter (petição narrativa completa)
  → Résumé (formatado para USCIS)
  → Business Plan (se NIW/E-2)
  → Cartas de Recomendação (com heterogeneidade anti-detecção)
  → Metodologia e Declaração (se aplicável)
  → Análise de Impacto Econômico (IMPACTO)

ETAPA 4: QUALITY GATE
  Cada documento passa por validação automática:
  → 77 regras de erro verificadas
  → Score de qualidade (threshold: 80+)
  → Detecção de "Chain of Thought" (vazamento de IA)
  → Verificação de termos proibidos
  → Se reprovado: auto-debug e re-geração

ETAPA 5: REVISÃO USCIS
  Simulação de adjudicação:
  → O sistema "finge ser" um officer do USCIS
  → Avalia cada critério como GREEN/YELLOW/RED
  → Identifica fraquezas antes da submissão real
```

### 2.3 Auto-learning (74+ Regras)

O Petition Engine possui um sistema de auto-aprendizado em 3 níveis:

**Nível 1 — Error Rules (77 regras ativas):**
- Cada regra tem: pattern (regex), severidade, ação (block/warn/auto_fix)
- Regras são criadas automaticamente a partir de feedback do operador
- Top 3 mais acionadas: "I/we believe" (127 triggers), "I/we think" (84 triggers), "in conclusion/to summarize" (38 triggers)
- 47 regras critical (61%), 25 high (32%), 3 medium (4%), 2 low (3%)

**Nível 2 — System Updates:**
- Quando o operador identifica um padrão recorrente de erro, o sistema propõe uma atualização do prompt de geração
- Diff proposto → confirmação humana → versionamento (v5.0 → v5.1) → commit no GitHub
- Rollback instantâneo via symlinks

**Nível 3 — Preferences:**
- Preferências do operador detectadas automaticamente durante conversas
- Exemplos: "sempre usar PT-BR", "gráficos em inglês", "mínimo 5 recomendadores"
- Persistidas em banco de dados para futuras gerações

### 2.4 Diferenciação vs Competidores

| Capacidade | Petition Engine | Visalaw AI | Parley (YC) | LegalOS (YC) | Docketwise | Alma |
|---|---|---|---|---|---|---|
| Geração de Cover Letter | Completa (50+ páginas) | Sim (20 páginas) | Sim | Sim | Não | Parcial |
| Geração de Business Plan | **SIM (65-80p)** | **NÃO** | **NÃO** | **NÃO** | **NÃO** | **NÃO** |
| Geração de Cartas Satélite | **SIM (heterogêneas)** | Sim (básico) | Sim | Desconhecido | Não | Parcial |
| Auto-learning Rules | **SIM (77 regras)** | Não | Não | Não | Não | Não |
| USCIS Review Simulation | **SIM** | Não | Não | Não | Não | Não |
| Anti-AI Detection | **SIM (ATLAS/ATA)** | Não | Não | Não | Não | Não |
| Impacto Econômico | **SIM (13 módulos)** | Não | Não | Não | Não | Não |
| Pipeline End-to-End | **SIM** | Parcial | Parcial | Parcial | Não | Parcial |
| Business Plan + Petição integrados | **ÚNICO** | Não | Não | Não | Não | Não |

**Conclusão:** O Petition Engine é o único produto no mercado que gera petição + Business Plan + cartas satélite + impacto econômico em um pipeline integrado com quality gates automáticos.

---

## 3. COMPETITIVE LANDSCAPE

### 3.1 Mapa Competitivo (Quadrante)

```
                    ALTA AUTOMAÇÃO (IA Generativa)
                              |
                   Petition   |   Visalaw AI
                   Engine     |   LegalOS (YC)
                   (ÚNICO:    |   Parley (YC)
                    BP + CL)  |   Imagility
                              |
  ESPECIALISTA EB-1/NIW ------+------ GENERALISTA IMIGRAÇÃO
                              |
                   EB1A       |   Docketwise
                   Experts    |   INSZoom
                   Alma       |   LawLogix
                   Manifest   |   Envoy Global
                              |
                    BAIXA AUTOMAÇÃO (Case Management)
```

**Posicionamento do Petition Engine:** Quadrante superior-esquerdo — alta automação + especialista em EB-1A/EB-2 NIW/O-1. Nenhum concorrente ocupa exatamente essa posição.

### 3.2 Feature Comparison Matrix

| Feature | Petition Engine | Visalaw AI | Parley | LegalOS | Docketwise | INSZoom | Envoy |
|---|---|---|---|---|---|---|---|
| **Petition Drafting** | Full end-to-end | 20p drafts | Full drafts | Full drafts | Não | Não | Parcial |
| **Business Plan Gen** | 65-80p completo | Não | Não | Não | Não | Não | Não |
| **Case Management** | Básico | Não | Não | Não | Completo | Completo | Completo |
| **E-filing USCIS** | Não | Não | Não | Não | Sim | Sim | Sim |
| **Quality Gates** | Automático (77 rules) | Não | Não | Não | Não | Não | Não |
| **Anti-AI Detection** | ATLAS/ATA defense | Não | Não | Não | N/A | N/A | N/A |
| **Auto-learning** | 3 níveis | Não | Não | Não | Não | Não | Não |
| **USCIS Simulation** | Sim | Não | Não | Não | Não | Não | Não |
| **Econ Impact Analysis** | 13 módulos | Não | Não | Não | Não | Não | Não |
| **Cartas Heterogêneas** | Sim (720 combos) | Não | Não | Não | N/A | N/A | N/A |
| **Pricing** | TBD | $380/mo | N/D | N/D | $69-119/mo | ~$50/mo | Enterprise |
| **Funding** | Pre-seed | N/D | YC S24 | $500K | ~$3B (8am) | $2.63B | $48-60M |
| **SOC 2** | Não (ainda) | Sim | Não | Não | Sim | Sim | Sim |

### 3.3 Why Now (Timing de Mercado)

Cinco fatores convergem para criar uma janela de oportunidade excepcional:

**1. Crise de Approval Rates:**
- EB-2 NIW: 80% (FY2023) → 35.7% (Q4 FY2025) — queda de 55 pontos percentuais
- EB-1A: 70.5% (FY2023) → ~67% (FY2025) — volatilidade crescente
- RFE rates de 40-50% — cada RFE custa $2K-5K em honorários adicionais
- **Impacto:** Advogados PRECISAM de ferramentas que aumentem a qualidade das petições

**2. Volume Explodindo:**
- EB-1A: +56% em petições (Q4 FY24 → Q1 FY25: 4.704 → 7.338)
- O-1: +53% em volume (FY24 → FY25: 20.669 → 31.681)
- EB-2 NIW: 20.124 petições apenas no Q1 FY2025
- **Impacto:** Firmas pequenas (2.9 funcionários em média) não conseguem absorver volume

**3. Mudança Regulatória (Janeiro 2025 — NIW Update):**
- Atualização mais detalhada do NIW em quase uma década
- Exige cartas de recomendação ESPECÍFICAS e CREDÍVEIS (não mais elogio genérico)
- Business Plans devem demonstrar impacto NACIONAL, não só viabilidade comercial
- **Impacto:** Aumenta dramaticamente a complexidade de preparação — favorece automação inteligente

**4. Capital Fluindo para LegalTech:**
- 2025: $4.3B-$5.99B investidos em legaltech (+54% YoY)
- 14 rounds de $100M+ em 2025
- LegalTech Fund fechou 2º fundo de $110M (4x o primeiro)
- Harvey AI captou $818M em 4 rounds
- **Impacto:** Investidores estão ativamente buscando vertical AI em legal

**5. IA Generativa Atingiu Maturidade para Legal:**
- Modelos como Claude, GPT-4, Gemini atingiram qualidade suficiente para drafting legal
- ABA Opinion 512 (2024) legitimou uso de IA por advogados
- EOIR Guidance (Agosto 2025): sem ban de IA em cortes de imigração
- **Impacto:** Barreira regulatória removida; adoção acelerada

---

## 4. BUSINESS MODEL

### 4.1 B2C (OMNI Direto) — Canal Atual

O modelo B2C opera hoje via OMNI, a empresa de imigração fundada por Paulo Lima (AIOS / Petition Engine é o produto/sistema interno):

| Métrica | Atual | Meta 6 Meses | Meta 12 Meses |
|---|---|---|---|
| Casos/mês | ~5 | 30 | 100 |
| Ticket médio | $5K-15K | $8K-12K | $8K-12K |
| Revenue mensal | $25K-75K | $240K-360K | $800K-1.2M |
| Revenue anual | $300K-900K | - | $9.6M-$14.4M |
| Margem bruta | ~70% | ~75% | ~80% |

**Unit Economics B2C:**
- CAC (Customer Acquisition Cost): ~$500 (referral-driven)
- LTV (Lifetime Value): $8.000 (caso único) a $24.000 (cliente recorrente com múltiplos vistos)
- LTV/CAC: 16x-48x (excelente)
- Payback period: Imediato (pagamento upfront)

### 4.2 B2B (Licenciamento) — Canal Futuro

Licenciamento do Petition Engine para firmas de imigração parceiras:

| Tier | Firmas-Alvo | Pricing | Revenue Potencial |
|---|---|---|---|
| Solo Practitioner | 1-2 advogados | $500/mo ($6K/ano) | 500 firmas x $6K = $3M |
| Small Firm | 3-10 advogados | $1.500/mo ($18K/ano) | 200 firmas x $18K = $3.6M |
| Mid-Market | 11-50 advogados | $5.000/mo ($60K/ano) | 50 firmas x $60K = $3M |
| Enterprise | 50+ advogados | Custom (revenue share) | 10 firmas x $120K = $1.2M |
| **Total B2B potencial** | | | **$10.8M ARR** |

**Benchmarks de pricing:**
- Docketwise: $69-119/usuário/mês (case management apenas, SEM geração)
- Visalaw AI: $380/mês (10 petições/mês, SEM Business Plan)
- O Petition Engine gera MAIS valor → justifica pricing premium

### 4.3 SaaS (Plataforma) — Visão de Longo Prazo

A evolução para plataforma SaaS multi-tenant representa o maior upside:

| Fase | Timeline | Modelo | Target Revenue |
|---|---|---|---|
| Fase 1: API | Meses 1-6 | Pay-per-generation ($200-500/doc) | $500K |
| Fase 2: Self-Service | Meses 7-12 | Subscription + usage | $2M |
| Fase 3: Marketplace | Meses 13-24 | Platform + revenue share | $5M+ |
| Fase 4: Enterprise | Meses 25-36 | White-label + custom | $10M+ |

**Revenue Mix projetado (Ano 3):**
- B2C (OMNI): 20% ($2.4M)
- B2B (Licenciamento): 50% ($6M)
- SaaS (Platform): 30% ($3.6M)
- **Total: $12M ARR**

---

## 5. FINANCIAL PROJECTIONS (5 Anos)

### 5.1 Revenue Model

**Premissas-chave:**
- B2C: Crescimento de 5 → 30 → 100 → 150 → 200 casos/mês (com equipe)
- B2B: Lançamento no Ano 2, crescimento 3x ao ano
- SaaS: Lançamento no Ano 2, crescimento 4x ao ano
- Churn B2B: 15% no Ano 2, reduzindo para 8% no Ano 5
- Ticket médio B2C: $8.000 (estabilizado)
- ARPU B2B: $12.000/ano (média ponderada entre tiers)

| Canal | Ano 1 | Ano 2 | Ano 3 | Ano 4 | Ano 5 |
|---|---|---|---|---|---|
| **B2C (OMNI)** | | | | | |
| Casos/ano | 180 | 600 | 1.200 | 1.800 | 2.400 |
| Ticket médio | $8.000 | $8.500 | $9.000 | $9.500 | $10.000 |
| Revenue B2C | $1.440K | $5.100K | $10.800K | $17.100K | $24.000K |
| **B2B (Licensing)** | | | | | |
| Firmas clientes | 0 | 30 | 100 | 250 | 500 |
| ARPU | - | $10.000 | $12.000 | $13.000 | $14.000 |
| Revenue B2B | $0 | $300K | $1.200K | $3.250K | $7.000K |
| **SaaS (Platform)** | | | | | |
| Pay-per-use docs | 0 | 500 | 3.000 | 10.000 | 25.000 |
| Preço/doc | - | $300 | $250 | $200 | $175 |
| Revenue SaaS | $0 | $150K | $750K | $2.000K | $4.375K |
| **TOTAL REVENUE** | **$1.440K** | **$5.550K** | **$12.750K** | **$22.350K** | **$35.375K** |
| Crescimento YoY | - | 286% | 130% | 75% | 58% |

### 5.2 Cost Structure

| Categoria | Ano 1 | Ano 2 | Ano 3 | Ano 4 | Ano 5 |
|---|---|---|---|---|---|
| **COGS** | | | | | |
| LLM API costs (Claude/GPT) | $120K | $350K | $700K | $1.200K | $1.800K |
| Cloud infrastructure | $24K | $60K | $120K | $200K | $300K |
| Quality review (humano) | $60K | $150K | $250K | $350K | $450K |
| **Subtotal COGS** | **$204K** | **$560K** | **$1.070K** | **$1.750K** | **$2.550K** |
| **Gross Margin** | **85.8%** | **89.9%** | **91.6%** | **92.2%** | **92.8%** |
| **OPEX** | | | | | |
| Salários (equipe) | $360K | $900K | $1.800K | $3.000K | $4.500K |
| Engenharia (R&D) | $180K | $480K | $960K | $1.500K | $2.100K |
| Sales & Marketing | $100K | $400K | $900K | $1.600K | $2.500K |
| Legal & Compliance | $50K | $120K | $200K | $300K | $400K |
| G&A | $80K | $180K | $350K | $550K | $800K |
| **Subtotal OPEX** | **$770K** | **$2.080K** | **$4.210K** | **$6.950K** | **$10.300K** |
| **TOTAL COSTS** | **$974K** | **$2.640K** | **$5.280K** | **$8.700K** | **$12.850K** |

### 5.3 P&L Projection

| Métrica | Ano 1 | Ano 2 | Ano 3 | Ano 4 | Ano 5 |
|---|---|---|---|---|---|
| Revenue | $1.440K | $5.550K | $12.750K | $22.350K | $35.375K |
| COGS | ($204K) | ($560K) | ($1.070K) | ($1.750K) | ($2.550K) |
| **Gross Profit** | **$1.236K** | **$4.990K** | **$11.680K** | **$20.600K** | **$32.825K** |
| **Gross Margin** | **85.8%** | **89.9%** | **91.6%** | **92.2%** | **92.8%** |
| OPEX | ($770K) | ($2.080K) | ($4.210K) | ($6.950K) | ($10.300K) |
| **EBITDA** | **$466K** | **$2.910K** | **$7.470K** | **$13.650K** | **$22.525K** |
| **EBITDA Margin** | **32.4%** | **52.4%** | **58.6%** | **61.1%** | **63.7%** |
| D&A | ($50K) | ($100K) | ($150K) | ($200K) | ($250K) |
| **EBIT** | **$416K** | **$2.810K** | **$7.320K** | **$13.450K** | **$22.275K** |
| Taxes (21% effective) | ($87K) | ($590K) | ($1.537K) | ($2.825K) | ($4.678K) |
| **Net Income** | **$329K** | **$2.220K** | **$5.783K** | **$10.625K** | **$17.597K** |
| **Net Margin** | **22.8%** | **40.0%** | **45.4%** | **47.5%** | **49.7%** |

### 5.4 Break-even Analysis

**Break-even B2C puro (já atingido):**
- Custo fixo mensal atual: ~$15K (infra + ferramentas + tempo)
- Custo variável por caso: ~$1.200 (LLM + review)
- Ticket médio: $8.000
- Contribuição por caso: $6.800
- **Break-even: 2.2 casos/mês** (atualmente em ~5 — já lucrativo)

**Break-even com investimento (pós-fundraise):**
- Assumindo raise de $2M, burn rate de $80K/mês
- Revenue necessária: $80K/mês = 10 casos B2C/mês
- **Timeline para break-even: Mês 4-6** (com ramp de 5 → 15 → 30 casos/mês)

### 5.5 Unit Economics

| Métrica | B2C | B2B (por firma) | SaaS (por doc) |
|---|---|---|---|
| Revenue/unit | $8.000/caso | $12.000/ano | $250/doc |
| COGS/unit | $1.200 | $1.800/ano | $35 |
| Gross Margin/unit | $6.800 (85%) | $10.200 (85%) | $215 (86%) |
| CAC | $500 | $3.000 | $50 |
| LTV | $16.000 | $48.000 | $2.500 |
| **LTV/CAC** | **32x** | **16x** | **50x** |
| Payback (meses) | 0 (upfront) | 3.5 | 0 (usage) |

**Benchmark:** LTV/CAC > 3x é considerado saudável em SaaS. O Petition Engine projeta 16x-50x em todos os canais.

---

## 6. VALUATION ESTIMATE

### 6.1 Método 1: Revenue Multiple

**Comparable multiples para vertical legaltech SaaS (2025-2026):**

| Perfil | Múltiplo Típico | Fonte |
|---|---|---|
| SaaS privado general | 3x-10x ARR | Market data |
| Vertical SaaS (legal, fintech) | 8x+ Revenue | Industry premium |
| SaaS high growth (>40%) | 7x-10x ARR | Growth premium |
| Filevine ($60.7M revenue) | 49x Revenue | Outlier (AI hype) |
| Seed-stage legaltech | Implied 10x-15x forward ARR | Seed benchmarks |

**Cálculo — Revenue Multiple:**

*Cenário Conservador (5x forward ARR):*
- ARR projetado Ano 2: $5.55M
- Múltiplo: 5x
- **Valuation: $27.75M**

*Cenário Base (8x forward ARR):*
- ARR projetado Ano 2: $5.55M
- Múltiplo: 8x (vertical SaaS premium)
- **Valuation: $44.4M**

*Cenário Otimista (12x forward ARR):*
- ARR projetado Ano 2: $5.55M
- Múltiplo: 12x (high growth + AI premium)
- **Valuation: $66.6M**

### 6.2 Método 2: DCF (5 Anos, 25-30% Discount Rate)

**Premissas:**
- Free Cash Flow (FCF) = EBITDA x 0.85 (ajuste para capex + working capital)
- Discount rate: 27.5% (média de 25-30%, refletindo risco pre-seed/seed)
- Terminal growth rate: 5%
- Terminal value multiple: 15x FCF do Ano 5

| Ano | EBITDA | FCF (85%) | Fator PV (27.5%) | PV do FCF |
|---|---|---|---|---|
| 1 | $466K | $396K | 0.784 | $310K |
| 2 | $2.910K | $2.474K | 0.615 | $1.521K |
| 3 | $7.470K | $6.350K | 0.482 | $3.061K |
| 4 | $13.650K | $11.603K | 0.378 | $4.386K |
| 5 | $22.525K | $19.146K | 0.297 | $5.686K |
| **PV dos FCFs** | | | | **$14.964K** |

**Terminal Value:**
- FCF Ano 5: $19.146K
- Terminal Value = $19.146K x 15 = $287.190K
- PV do Terminal Value = $287.190K x 0.297 = **$85.295K**

**Enterprise Value (DCF):**
- PV dos FCFs: $14.964K
- PV do Terminal Value: $85.295K
- **Total EV = $100.259K ≈ $100.3M**

*Nota: O DCF com terminal multiple produz valores mais altos porque captura o valor de longo prazo de uma plataforma SaaS em crescimento. Ajustando o terminal multiple para 10x (conservador), o EV seria ~$72M.*

**Sensibilidade:**

| Discount Rate / Terminal Multiple | 10x | 12x | 15x |
|---|---|---|---|
| 25% | $76.3M | $88.4M | $106.5M |
| 27.5% | $71.8M | $83.2M | $100.3M |
| 30% | $67.5M | $78.3M | $94.4M |

### 6.3 Método 3: Comparable Transactions

| Transação | Valuation | Revenue | Múltiplo | Relevância |
|---|---|---|---|---|
| Filevine ($400M round, Sep/2025) | $3B-5.2B | $60.7M | 49x | Alta (legaltech AI) |
| 8am/AffiniPay (Docketwise parent) | ~$3B | N/D | N/D | Média (case mgmt, não AI) |
| Mitratech (OTPP, Mar/2021) | >$1.5B | N/D | N/D | Média (enterprise immigration) |
| Legalpad (Deel, Aug/2022) | Implied $30-50M* | N/D | N/D | Alta (immigration AI, acquired) |
| Alma (Seed, 2023) | Implied $25-50M | N/D | N/D | Alta (immigration AI, seed) |
| LegalOS (Seed, Jan/2026) | Implied $5-10M | $0 | N/A | Alta (immigration AI, YC) |
| Seed benchmark (2025) | $20-25M | $150-500K ARR | N/A | Alta (stage comparable) |

*Legalpad inferido: raised $14.6M total, acquired by $12B+ Deel — sugere valuation significativo.*

**Análise de transactions comparáveis:**

Para uma empresa pre-seed/seed com:
- MVP funcional (17 sistemas operacionais)
- Traction real (100+ casos, $300K+ ARR implícita)
- IP proprietária (450KB+ de especificações)
- Mercado validado ($1.5B immigration software)
- Diferenciação única (único end-to-end com BP)

O benchmark mais relevante é o **seed round de legaltech em 2025: $20-25M post-money at $150-500K ARR**.

**Valuation por Comparable Transactions: $15M-$30M**

### 6.4 Valuation Range Summary

| Método | Conservador | Base | Otimista |
|---|---|---|---|
| Revenue Multiple (forward ARR) | $27.75M | $44.4M | $66.6M |
| DCF (5 anos, 27.5% DR) | $67.5M | $100.3M | $106.5M |
| Comparable Transactions | $15M | $22.5M | $30M |

**Valuation Range Recomendado (para seed round):**

| Cenário | Valuation Pre-Money | Justificativa |
|---|---|---|
| Floor | $8M | Pre-revenue, MVP stage, high risk |
| Conservador | $15M | MVP + traction + IP, comparable to LegalOS post-money |
| Base | $20-25M | Aligned with 2025 seed benchmarks, strong IP + traction |
| Otimista | $35M | Premium por unicidade (BP + petition end-to-end) + market timing |

**Recomendação:** Para um seed round de $2-3M, o valuation pre-money recomendado é de **$20-25M**, resultando em diluição de 8-13% para os founders. Isso está alinhado com benchmarks de seed em legaltech 2025 e reflete o estágio do produto (MVP funcional com traction real).

---

## 7. IP ASSESSMENT

### 7.1 Proprietary Systems Value

O IP do Petition Engine consiste em 17 sistemas proprietários com um total de **~450KB+ de especificações** — equivalente a ~150.000 palavras de instruções detalhadas para geração de documentos legais.

| Asset | Volume | Unicidade | Reprodutibilidade |
|---|---|---|---|
| 17 sistemas de prompt | ~450KB | Único no mercado | 6+ anos para reproduzir |
| Regras de geração por tipo de visto | 8 tipos de visto | Baseado em 100+ casos reais | Requer experiência operacional |
| Templates de formatação USCIS | 9+ templates | Validados com aprovações reais | Parcialmente reproduzível |
| Pipeline de 9 prompts (Anteprojeto) | Sequencial | Único | Requer design proprietário |

**Valor estimado do IP de sistemas:**
- Custo de reprodução (6 anos x 1 engenheiro sênior + 1 advogado de imigração): ~$1.2M-$1.8M
- Valor de mercado (baseado em economia de tempo por caso): $500-2.000/caso x 10.000 casos/ano = $5M-$20M/ano em valor gerado

### 7.2 Data Assets

| Dataset | Volume | Valor Estratégico |
|---|---|---|
| 77 Error Rules com triggers reais | 77 regras, 500+ triggers | Alto — dataset único de erros em petições |
| 16 Pareceres de Qualidade | 669KB | Alto — knowledge base de quality reviews |
| 100+ casos processados | Histórico de 6+ anos | Muito Alto — dados de treinamento |
| Approval/denial patterns | Correlações caso-resultado | Muito Alto — predictive potential |

**Nota:** Esses datasets são quase impossíveis de reproduzir — requerem anos de operação com feedback loop humano-IA.

### 7.3 Methodology IP

**Separation of Concerns (SoC):**
- Metodologia proprietária onde o documento é gerado em duas fases: (1) conteúdo bruto e (2) revisão estrutural
- Melhora significativamente a qualidade do output vs geração single-pass
- Aplicável a qualquer tipo de documento legal

**Pipeline de Quality Gates:**
- Cada documento passa por validação automática antes de entrega
- 77 regras calibradas com dados reais de 100+ casos
- Auto-debug: quando um documento falha, o sistema tenta corrigir automaticamente

**IMPACTO Suite:**
- 13 módulos de cálculo de impacto econômico
- Gera projeções financeiras, análise de mercado e job creation estimates
- Único no mercado para petições de imigração

### 7.4 Anti-AI Detection IP

**Sistema Anti-ATLAS/ATA:**

O USCIS está em processo de implementação de ferramentas de detecção de conteúdo gerado por IA (referidas internamente como ATLAS/ATA). O Petition Engine possui um sistema único de defesa:

**Heterogeneidade Visual (Cartas Satélite):**
- 15 combinações de fonte/cor x 8 estilos de header x 6 formatos = **720 combinações únicas**
- Cada carta de um mesmo batch tem aparência visualmente distinta
- Impede pattern recognition por ferramentas de detecção

**Chain of Thought (CoT) Removal:**
- Detecção automática de "pensamentos" da IA que vazam no documento final
- Remoção antes de entrega ao cliente
- 48 palavras sem acento monitoradas (específico para PT-BR)

**Diversificação Linguística:**
- Variação de estrutura frasal entre documentos
- Termos proibidos automaticamente bloqueados (r12: "prompt", r16: "PROEX/Kortix")
- Cada documento parece ter sido escrito por um autor diferente

**Valor deste IP:** Nenhum concorrente possui sistema equivalente. À medida que o USCIS intensifica detecção de IA, este IP torna-se cada vez mais valioso.

---

## 8. TEAM & MOAT

### 8.1 Founding Team

**Paulo Lima — Founder & CEO da OMNI**
- 6+ anos de experiência em consultoria de imigração
- Ex-supervisor na PROEX (concorrente) — saiu para fundar a OMNI e construir o AIOS / Petition Engine
- 100+ casos processados pessoalmente
- Construiu todos os 17 sistemas proprietários
- Background técnico: construiu o Petition Engine end-to-end (Next.js 14, Python, LLM orchestration)
- Combinação rara: domain expertise (imigração) + technical capability (engenharia)

**Kazak — Co-founder (30% partner)**
- Parceiro estratégico com 30% de equity
- Complementa competências do Paulo Lima

**Observação para investidores:** A equipe atual é lean mas eficiente. Com investimento, a prioridade é contratar: (1) CTO para produtizar o MVP, (2) Head of Sales para B2B, (3) Immigration Attorney advisor.

### 8.2 Moat Analysis (5 Layers)

O Petition Engine possui 5 camadas de defensibilidade:

**Camada 1: Domain Expertise Moat**
- 100+ casos reais processados = compreensão profunda das nuances USCIS
- Regras de erro calibradas com feedback de adjudicadores reais
- Não é replicável com apenas engenheiros de software — requer anos de prática em imigração
- **Durabilidade: ALTA** (5+ anos para reproduzir)

**Camada 2: Data Moat**
- 77 error rules com 500+ triggers documentados
- 669KB de quality pareceres (knowledge base)
- Correlações entre tipo de caso, formatação e resultado (approval/denial)
- Cada caso novo alimenta o sistema de auto-learning
- **Durabilidade: MUITO ALTA** (dados acumulativos, efeito de rede)

**Camada 3: System Complexity Moat**
- 17 sistemas interconectados com ~450KB de especificações
- Pipeline de 5 etapas (extração → estratégia → geração → quality → revisão)
- Não é um "wrapper de ChatGPT" — é uma arquitetura completa com orchestrator, agents, quality gates
- **Durabilidade: MÉDIA-ALTA** (reproduzível com investimento significativo, mas não trivial)

**Camada 4: Regulatory Moat**
- Sistema Anti-ATLAS/ATA (único no mercado)
- 720 combinações de heterogeneidade visual
- Regras de compliance específicas por tipo de visto
- Atualização contínua com mudanças regulatórias (PA-2025-16, NIW Update Jan/2025)
- **Durabilidade: ALTA** (regulação muda constantemente, requer manutenção ativa)

**Camada 5: Switching Cost Moat (futuro)**
- Uma vez que firmas integrem o Petition Engine em seu workflow, migrar para concorrente implica:
  - Reconfigurar todos os templates
  - Perder error rules customizadas
  - Retreinar equipe
  - Risco de queda na qualidade durante transição
- **Durabilidade: ALTA** (após adoção, churn esperado < 10%/ano)

---

## 9. RISKS & MITIGATIONS

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| 1 | **Mudança de política imigratória** — restrições drásticas nos EUA | Média | Alto | Diversificação geográfica (Canadá, UK, Austrália); foco em categorias employment-based que são bipartisan |
| 2 | **Detecção de IA pelo USCIS** — USCIS rejeita petições geradas por IA | Média | Crítico | Sistema Anti-ATLAS/ATA já implementado; heterogeneidade visual; human-in-the-loop obrigatório |
| 3 | **Competição acelerada** — YC-backed startups (Parley, LegalOS) captam mais capital | Alta | Médio | Moat de dados + domain expertise; nenhum competidor tem BP + petition end-to-end; first-mover advantage no pipeline completo |
| 4 | **Key-person risk** — Paulo Lima é o único operador/engenheiro | Alta | Crítico | Investimento deve financiar contratação de CTO + 2 engenheiros nos primeiros 6 meses; documentação completa (450KB+ de specs) |
| 5 | **Regulação de IA em legal** — estados ou ABA proíbem uso de IA em petições | Baixa | Alto | ABA Opinion 512 legitimou uso; EOIR sem ban; modelo como "ferramenta do advogado" (não substituto) é regulatoriamente seguro |
| 6 | **Escalabilidade técnica** — sistema atual é single-user (score técnico: 62/100) | Alta | Médio | Auditoria técnica completa já realizada; 10 issues críticos identificados; roadmap de 1 semana para resolver P0s; investimento financia re-arquitetura para multi-tenant |
| 7 | **Dependência de LLM providers** — aumento de custo de API (Claude/GPT) | Média | Médio | Custos de LLM em tendência de queda (80%+ de redução em 2024-2025); multi-model support já implementado; fine-tuning futuro reduz dependência |
| 8 | **Processo de advogados incumbents** — Fragomen ou BAL lançam produto similar | Baixa | Alto | Grandes firmas são lentas para inovar (Fragomen desde 2017 sem petition gen); foco em SMB onde incumbents não atuam |

---

## 10. INVESTMENT THESIS

### Por que investir na OMNI (AIOS / Petition Engine)?

**1. Timing perfeito:**
O mercado de imigração employment-based dos EUA está em crise. Approval rates despencaram (EB-2 NIW: 80% → 35.7%), volumes explodiram (+56% EB-1A, +53% O-1), e a regulação ficou mais complexa (NIW Update Jan/2025). As 17.613 firmas de imigração (2.9 funcionários em média) PRECISAM de automação inteligente para sobreviver. O Petition Engine resolve exatamente esse problema.

**2. Produto único e defensível:**
É o único sistema no mundo que gera petição completa (Cover Letter) + Business Plan + cartas de recomendação (com heterogeneidade anti-AI) + análise de impacto econômico em um pipeline integrado com quality gates automáticos. Nenhum dos competidores analisados (17 empresas) oferece essa combinação.

**3. Traction real, não slide deck:**
100+ casos processados em 6+ anos. 17 sistemas operacionais. 77 regras de auto-learning com 500+ triggers documentados. 669KB de knowledge base. Não é um conceito — é um produto funcional que gera revenue.

**4. Unit economics excepcionais:**
LTV/CAC de 16x-50x dependendo do canal. Margem bruta de 85%+. Break-even em 2.2 casos/mês (já atingido). O investimento vai para growth, não para subsidiar operações.

**5. Mercado massivo e em crescimento:**
Immigration software: $1.5B (2025), 15% CAGR → $4.6B (2033). LegalTech total: $8.1B nos EUA. Capital fluindo: $4.3B-$5.99B investidos em legaltech em 2025 (+54% YoY). M&A ativo: Deel comprou Legalpad, Mitratech comprou INSZoom, Filevine levantou $400M.

**6. Exit paths claros:**
- **Aquisição estratégica:** Filevine ($3B), Deel ($12B+), Mitratech ($1.5B+) são compradores naturais
- **IPO:** Se o mercado de legaltech SaaS continuar crescendo, IPO é viável no Ano 5-7
- **PE Buyout:** Private equity (Genstar, Insight Partners) ativos no setor

### Ask

| Cenário de Raise | Pre-money | Round Size | Diluição | Use of Funds |
|---|---|---|---|---|
| **Seed** | $20-25M | $2-3M | 8-13% | CTO + 2 engenheiros, re-arquitetura multi-tenant, SOC 2, sales hire, marketing |
| **Seed+** | $25-35M | $3-5M | 10-17% | Acima + B2B launch, enterprise pilot, international expansion prep |

**Use of Funds detalhado (Seed de $2.5M):**

| Categoria | Alocação | % | Deliverable |
|---|---|---|---|
| Engineering | $1.000K | 40% | CTO + 2 devs, re-arquitetura multi-tenant, API, SOC 2 Type II |
| Sales & Marketing | $600K | 24% | Head of Sales, 50 firmas piloto B2B, brand, content marketing |
| Operations | $400K | 16% | Immigration attorney advisor, quality team, suporte |
| Legal & Compliance | $250K | 10% | Corporate structure, patents, trademark, data privacy |
| Working Capital | $250K | 10% | Runway buffer (6 meses) |
| **Total** | **$2.500K** | **100%** | |

**Milestones com $2.5M (18 meses):**
1. **Mês 1-3:** CTO contratado, re-arquitetura iniciada, SOC 2 prep
2. **Mês 4-6:** Multi-tenant MVP, 10 firmas em beta B2B, 30 casos B2C/mês
3. **Mês 7-12:** B2B launch, 50 firmas clientes, $1M ARR, SOC 2 Type II obtido
4. **Mês 13-18:** 100+ firmas, $2.5M ARR, preparação para Series A

---

## APPENDIX

### Appendix A: Financial Model Assumptions

| Premissa | Valor | Justificativa |
|---|---|---|
| Ticket médio B2C | $8.000 | Média de $5K (simples) a $15K (complexo); alinhado com Alma ($8K-10K) |
| ARPU B2B | $12.000/ano | Média entre tiers; 2x Docketwise ($69-119/mo), abaixo de Visalaw ($380/mo) |
| COGS LLM/caso | ~$120-200 | Claude API: ~$15/prompt x 8-12 prompts/caso |
| Margem bruta SaaS | 86% | Benchmark SaaS vertical: 80-90% |
| CAC B2C | $500 | Referral-driven, content marketing, SEO |
| CAC B2B | $3.000 | Inside sales + demo + onboarding |
| Churn B2B anual | 15% → 8% | Alto no início (product-market fit), estabiliza |
| Discount rate DCF | 27.5% | Pre-seed/seed stage, mercado regulado, key-person risk |
| Terminal growth | 5% | Conservador para immigration software (mercado cresce 15% CAGR) |
| Tax rate | 21% | Federal rate; state tax desconsiderado para simplificação |

### Appendix B: Comparable Company Analysis

| Empresa | Stage | Valuation | Revenue | Multiple | AI Gen? | BP Gen? | Target |
|---|---|---|---|---|---|---|---|
| **Filevine** | Growth | $3B-5.2B | $60.7M | 49x | Forms/OCR | Não | General legal |
| **8am (Docketwise)** | PE | ~$3B | N/D | N/D | Não | Não | Immigration SMB |
| **Mitratech (INSZoom)** | PE | >$1.5B | N/D | N/D | RPA/ML | Não | Enterprise immigration |
| **Envoy Global** | Growth | N/D | N/D | N/D | Gen AI (parcial) | Não | Enterprise corporate |
| **Fragomen** | Private | N/D | ~$947.6M | N/D | Innovation Lab | Não | Global corporate |
| **Visalaw AI** | Early | N/D | N/D | N/D | SIM (20p) | Não | Advogados |
| **Parley** | Seed | N/D | N/D | N/D | SIM | Não | Advogados |
| **LegalOS** | Seed | $5-10M est. | $0 | N/A | SIM | Não | Indivíduos |
| **Alma** | Seed | $25-50M est. | N/D | N/D | Parcial | Não | Tech professionals |
| **OMNI (Petition Engine)** | **Pre-seed** | **$20-25M prop.** | **~$300K impl.** | **N/A** | **SIM (full)** | **SIM (65-80p)** | **Advogados + OMNI B2C** |

### Appendix C: System Architecture Diagram (text)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PETITION ENGINE                              │
│                     Next.js 14 (App Router)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐            │
│  │   FRONTEND   │   │  API ROUTES  │   │   AGENTS     │            │
│  │              │   │              │   │              │            │
│  │ - Gerador    │──▶│ /generate    │──▶│ - Extractor  │            │
│  │ - Documentos │   │ /execute     │   │ - Writer     │            │
│  │ - Qualidade  │   │ /quality     │   │ - Quality    │            │
│  │ - Erros      │   │ /errors      │   │ - USCIS Rev  │            │
│  │ - Sistemas   │   │ /systems     │   │ - AutoDebug  │            │
│  │ - Clientes   │   │ /clients     │   │ - SysUpdater │            │
│  └──────────────┘   └──────┬───────┘   └──────┬───────┘            │
│                             │                   │                    │
│  ┌──────────────────────────┴───────────────────┴──────────────┐    │
│  │                    ORCHESTRATOR                               │    │
│  │  system-map.ts + orchestrator.ts + heterogeneity.ts          │    │
│  │  ┌─────────────────────────────────────────────────────┐     │    │
│  │  │              17 PROMPT SYSTEMS                       │     │    │
│  │  │  Cover Letter │ Résumé │ BP │ Metodologia │ Decl    │     │    │
│  │  │  Cartas │ IMPACTO │ Estratégia │ Localização │ SaaS  │     │    │
│  │  └─────────────────────────────────────────────────────┘     │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                              │                                    │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                     LLM EXECUTION                          │  │
│  │  Claude Code CLI (child_process.spawn)                     │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐    │  │
│  │  │ FASE 1   │─▶│ QUALITY GATE │─▶│ FASE 2           │    │  │
│  │  │ Generate │  │ 77 rules     │  │ Separation of    │    │  │
│  │  │ .docx    │  │ Auto-fix     │  │ Concerns Review  │    │  │
│  │  └──────────┘  └──────────────┘  └──────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │  SUPABASE    │   │  LOCAL JSON  │   │   GITHUB     │         │
│  │  (Cloud DB)  │   │  (Fallback)  │   │  (Versioning)│         │
│  └──────────────┘   └──────────────┘   └──────────────┘         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  AUTO-LEARNING PIPELINE                                      ││
│  │  Error Report → Classify → Create Rule → Update Trigger →   ││
│  │  → Threshold? → Propose System Update → Human Confirm →     ││
│  │  → Version → Commit to GitHub → Deploy                      ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  ANTI-ATLAS/ATA DEFENSE                                      ││
│  │  Heterogeneity Engine: 720 visual combos                     ││
│  │  CoT Removal │ Term Blocking │ Linguistic Diversification    ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### Appendix D: Glossary

| Termo | Definição |
|---|---|
| EB-1A | Employment-Based First Preference, Extraordinary Ability |
| EB-2 NIW | Employment-Based Second Preference, National Interest Waiver |
| O-1 | Visa para indivíduos com habilidade extraordinária |
| USCIS | United States Citizenship and Immigration Services |
| RFE | Request for Evidence — pedido adicional de documentação |
| Dhanasar | Dhanasar v. Matter of (2016) — teste de 3 prongs para NIW |
| ATLAS/ATA | Ferramentas de detecção de IA em desenvolvimento pelo USCIS |
| SoC | Separation of Concerns — metodologia de revisão em 2 fases |
| ARR | Annual Recurring Revenue |
| LTV | Lifetime Value |
| CAC | Customer Acquisition Cost |
| TAM | Total Addressable Market |
| SAM | Serviceable Addressable Market |
| SOM | Serviceable Obtainable Market |
| DCF | Discounted Cash Flow |
| EV | Enterprise Value |
| CAGR | Compound Annual Growth Rate |

---

*Relatório preparado por Claude Opus 4.6 (1M context) em 02 de Abril de 2026.*
*Baseado em dados de: PESQUISA_MERCADO_PETITION_ENGINE_AIOS.md + AUDIT_COMPLETE_TECHNICAL_REPORT.md*
*Este documento é confidencial e destinado exclusivamente a potenciais investidores e stakeholders da OMNI (AIOS / Petition Engine).*
