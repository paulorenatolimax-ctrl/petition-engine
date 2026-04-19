# MEGA PROMPT V3 — BP Generator System Architecture & Section Prompts

## PURPOSE

Update the BP Generator app on Lovable to implement the complete BP System V3 architecture. This app generates Business Plans via sequential API calls to Claude Haiku (claude-haiku-4-5-20251001), section by section, assembling 42 sections across 6 blocks into a final DOCX document.

---

## PART 1: SYSTEM ARCHITECTURE

### 1.1 Generation Flow

The BP Generator produces 42 sections in **strict sequential order** across 6 blocks. Each block's output feeds as accumulated context into the next block's sections.

```
User Input (Company Data + Financial Spreadsheet + Research Pack)
        |
        v
[Block 1] Sumario Executivo (S1-S4) — Foundation
        |
        v
[Block 2] Analise Estrategica (S5-S16) — Market & Strategy
        |
        v
[Block 3] Marketing Plan (S17-S25) — Segmentation & 4Ps
        |
        v
[Block 4] Operational Plan (S26-S31) — Team & Resources
        |
        v
[Block 5] Financial Plan (S32-S37) — Projections & DRE
        |
        v
[Block 6] Conclusao (S38-S40) — Timeline & References
        |
        v
Quality Gates Validation (6 gates per section)
        |
        v
DOCX Assembly (charts + formatting)
```

### 1.2 Complete Section Map (42 Sections)

#### Block 1: Sumario Executivo
| Order | ID  | Section Name | Word Range | Notes |
|-------|-----|-------------|------------|-------|
| 01 | S1 | Sumario Executivo -- Oportunidade de Negocio | 800-1200 | 3 mandatory subsections, services table |
| 02 | S2 | Timeline do Negocio (Resumo) | 400-500 | Milestone table (months 1-60) |
| 03 | S3 | Visao, Missao e Valores | 300-400 | Short section, 5-7 corporate values |
| 04 | S4 | Enquadramento Juridico | 500-600 | LLC registration, EIN, licenses |

#### Block 2: Analise Estrategica
| Order | ID  | Section Name | Word Range | Notes |
|-------|-----|-------------|------------|-------|
| 05 | S5 | Perspectivas do Mercado | 600-700 | TAM, CAGR, web search required |
| 06 | S5b | Relevancia, Oportunidades e Perspectivas Futuras | 450-550 | Connect market to business |
| 07 | S6 | Cadeia de Suprimentos | 450-550 | Value chain table |
| 08 | S7 | Empregabilidade Esperada | 450-550 | EPI multiplier, SOC codes, BLS data |
| 09 | S8 | Gestao do Conhecimento | 450-550 | 100% prose, zero tables |
| 10 | S9 | Impactos ESG | 300-400 | Short section, E/S/G pillars |
| 11 | S10 | Analise SWOT | 450-550 | 2x2 matrix: 6S, 6O, 5W, 5T |
| 12 | S11 | SWOT Cruzada | 450-550 | FO, FA, DO, DA quadrants |
| 13 | S11b | Matriz ANSOFF | 450-550 | 4 growth strategies |
| 14 | S12 | Analise de Concorrentes | 450-550 | Real competitors only, web search |
| 15 | S13 | Ameaca de Novos Entrantes | 450-550 | Barrier analysis (Porter) |
| 16 | S14 | Poder de Negociacao dos Clientes | 450-550 | Porter force |
| 17 | S15 | Poder de Negociacao dos Fornecedores | 450-550 | Porter force |
| 18 | S16 | Produtos ou Servicos Substitutos | 450-550 | Porter force + 5-force synthesis |

#### Block 3: Marketing Plan
| Order | ID  | Section Name | Word Range | Notes |
|-------|-----|-------------|------------|-------|
| 19 | S17 | Segmentacao de Mercado | 400-500 | Census/BLS data, web search |
| 20 | S18 | Publico-Alvo B2C | 400-500 | 3-4 consumer groups |
| 21 | S19 | Setor-Alvo B2B | 400-500 | 3-4 business sectors |
| 22 | S20 | Posicionamento da Marca | 400-500 | Positioning statement formula |
| 23 | S21 | Produto -- Analise de Valor | 400-500 | B2C + B2B value matrices |
| 24 | S22 | Analise de Preco | 400-500 | Pricing model, spreadsheet data only |
| 25 | S23 | Praca -- Estrategia de Distribuicao | 400-500 | Distribution channels |
| 26 | S24 | Promocao -- Orcamento de Marketing | 400-500 | Budget allocation table |
| 27 | S25 | Estrategia de Marketing 4.0 | 400-500 | 5As journey, omnichannel |

#### Block 4: Operational Plan
| Order | ID  | Section Name | Word Range | Notes |
|-------|-----|-------------|------------|-------|
| 28 | S26 | Quadro de Funcionarios | 400-500 | SOC codes, BLS salaries, spreadsheet data |
| 29 | S27 | Layout do Empreendimento | 400-500 | Space requirements |
| 30 | S28 | Recursos Fisicos e Equipamentos | 400-500 | Equipment tables, spreadsheet values |
| 31 | S29 | Recursos Tecnologicos | 400-500 | Software, IT infrastructure |
| 32 | S30 | Localizacao do Negocio | 400-500 | Census data, economic profile |
| 33 | S31 | Capacidade Produtiva | 400-500 | Capacity vs utilization Y1-Y5 |

#### Block 5: Financial Plan
| Order | ID  | Section Name | Word Range | Notes |
|-------|-----|-------------|------------|-------|
| 34 | S32 | Premissas Financeiras | 500-600 | Revenue/cost assumptions from spreadsheet |
| 35 | S33 | Investimentos | 400-500 | Pre-operational investments, capital sources |
| 36 | S34 | Estimativa de Receitas e Custos | 600-900 | Revenue/cost projections Y1-Y5 |
| 37 | S35 | DRE -- Demonstrativo de Resultados | 600-900 | Full income statement Y0-Y5 |
| 38 | S36 | Indicadores de Retorno | 600-900 | NPV, IRR, Payback, ROI, ROE |
| 39 | S37 | Break Even Point | 600-900 | BEP in units and currency |

#### Block 6: Conclusao
| Order | ID  | Section Name | Word Range | Notes |
|-------|-----|-------------|------------|-------|
| 40 | S38 | Timeline de Implementacao | 500-700 | Gantt-style milestone table |
| 41 | S39 | Consideracoes Finais | 500-700 | 100% prose, zero tables |
| 42 | S40 | Referencias e Fontes | Auto | System-compiled bibliography |

### 1.3 API Call Configuration

For EACH section, the Lovable app makes an API call to Claude Haiku with:

```typescript
const response = await anthropic.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 4096,
  temperature: 0.3,
  system: systemPrompt,   // Global rules + section-specific prompt
  messages: [
    {
      role: "user",
      content: userPrompt  // Section instruction + accumulated context
    }
  ]
});
```

### 1.4 Context Injection Pattern

Each section's system prompt is composed of:
1. **Global System Prompt** (rules 1-13, shared across ALL sections -- see Part 2)
2. **Project Data Block** (company name, services, location, formation, SOC code, etc.)
3. **Observations Injection** (case-specific notes from globalConfig.observationsInjection)
4. **Section-Specific Prompt** (unique instructions for that section -- see Part 3)

The user message includes:
1. **Accumulated Context** (markdown output from all previously generated sections in this generation run)
2. **Financial Spreadsheet Data** (JSON object with revenue, costs, DRE -- for financial sections)
3. **Research Pack Data** (market research results -- for market/strategy sections)

---

## PART 2: GLOBAL CONFIGURATION & INVIOLABLE RULES

### 2.1 Global Config Object

The app must maintain a `globalConfig` object with these fields:

```json
{
  "prohibitedTerms": [
    "consultoria", "consultor", "consulting",
    "EB-1", "EB-2", "NIW",
    "green card", "visto", "imigracao",
    "USCIS", "petition", "peticao"
  ],
  "defaultModel": "claude-haiku-4-5-20251001",
  "defaultLanguage": "pt-BR",
  "temperature": 0.3,
  "maxTokens": 4096,
  "observationsInjection": "",
  "systemPromptRaw": "[see below]"
}
```

### 2.2 Global System Prompt (Injected into EVERY Section)

This is the `systemPromptRaw` that prefixes every section's system prompt. It contains 13 inviolable rules:

```
REGRA DE TAMANHO (INVIOLAVEL): Cada secao deve ter entre [MIN] e [MAX] palavras. Este e um limite RIGIDO. Conte suas palavras mentalmente antes de finalizar. Se estiver acima do limite, CORTE paragrafos menos essenciais. NUNCA exceda o limite maximo.

Responda com a profundidade e densidade analitica adequadas a complexidade da secao. Priorize dados concretos sobre explicacoes genericas. Densidade > verbosidade.

REGRA ABSOLUTA DE OUTPUT: Nunca inclua em sua resposta qualquer processo de raciocinio, planejamento ou metacomentario. Proibido: 'Vou pesquisar...', 'Agora vou estruturar...', 'Contagem de palavras:', 'Excelente.', 'Tenho dados suficientes.', 'Analisando o contexto...', 'Let me...', 'I will now...', 'Word count:'. Responda APENAS com o conteudo da secao solicitada. Comece diretamente com o titulo (##) ou primeiro paragrafo da secao. NADA antes disso.

Voce e um redator senior de business plans com mais de 20 anos de experiencia, especializado em planos de negocio para empresas nos Estados Unidos. Seu trabalho e gerar secoes profissionais, densas em dados e analises, prontas para inclusao em um plano de negocios formal.

## REGRAS INVIOLAVEIS

### 1. ANTI-ALUCINACAO (MAIS IMPORTANTE)
- NUNCA invente dados numericos (precos, receitas, margens, salarios, quantidades)
- Se dados financeiros foram fornecidos no contexto, use EXCLUSIVAMENTE esses dados
- Se NAO tem dados especificos, diga "a ser definido pelo empreendedor" ou use faixas genericas do mercado citando a fonte
- NUNCA invente precos unitarios de servicos, taxas horarias, ou valores de contrato
- NUNCA invente nomes de empresas concorrentes -- descreva perfis genericos
- NUNCA invente URLs de fontes -- se nao tem certeza, omita a URL

### 2. TERMOS PROIBIDOS (CAUSA REJEICAO IMEDIATA)
- PROIBIDO: "consultoria", "consultor", "consulting" (use: "prestacao de servicos", "profissional", "especialista")
- MESMO QUE os dados de entrada contenham "consultoria", SEMPRE substitua por "assessoria", "prestacao de servicos especializados"
- PROIBIDO: qualquer termo de imigracao: EB-1, EB-2, NIW, green card, visto, imigracao, USCIS, petition, peticao
- PROIBIDO: dirigir-se a oficial de imigracao ou mencionar processo migratorio
- O documento e apresentado como se fosse para um INVESTIDOR SOFISTICADO

### 3. QUALIDADE DE ESCRITA
- Linguagem formal, profissional, impessoal (terceira pessoa)
- Tom expositivo: "sera realizado o registro...", NAO imperativo "registre..."
- TODA tabela DEVE ter: paragrafo introdutorio ANTES (minimo 2 frases) e paragrafo conclusivo DEPOIS (minimo 1 frase com insight)
- NUNCA apresente uma tabela seca, sem contexto
- Cada secao deve ter: introducao (2-3 frases), corpo (com tabelas e analise), conclusao (2-3 frases)
- NAO force tabela onde prosa funciona melhor

### 4. FORMATO DE OUTPUT
- Markdown com ## para titulos, ### para subtitulos
- Tabelas em formato Markdown: | Col1 | Col2 |
- **negrito** para termos-chave e nomes de empresas
- CITACAO: insira APENAS o superscript no texto: texto[1]. NAO liste referencias no corpo.
- NAO use emojis
- Escreva no idioma solicitado (portugues ou ingles)

### 4b. FORMATO DE TABELAS -- CRITICO
Formato EXATO:
[linha em branco]
Paragrafo introdutorio da tabela aqui.
[linha em branco]
| Coluna 1 | Coluna 2 |
|----------|----------|
| dado     | dado     |
[linha em branco]
Paragrafo conclusivo aqui.
[linha em branco]

### 5. CONTEXTO IMPLICITO
O business plan deve implicitamente demonstrar:
- Expertise excepcional do beneficiario no setor
- Impacto positivo para a economia e comunidades dos EUA
- Viabilidade e escalabilidade do negocio
- Geracao de empregos e transferencia de conhecimento
- Alinhamento com prioridades federais e estaduais
Tudo isso sem JAMAIS mencionar imigracao ou vistos.

### 6. ANTI-BOILERPLATE (CRITICO -- TAXA DE NEGACAO 60%)
- NUNCA use frases genericas sem dados concretos
- Use linguagem DEMONSTRATIVA, nao CONCLUSORIA
- CADA afirmacao de impacto DEVE ter metrica verificavel ou fonte citavel
- Varie estrutura de frases. Misture curtas e longas.
- EVITE superlativos vazios: "extraordinario", "excepcional", "incomparavel"
- PREFIRA dados objetivos
- CADA secao: pelo menos 1 referencia a documento oficial do governo
- O BP deve demonstrar implicitamente 3 criterios:
  (a) MERITO SUBSTANCIAL + IMPORTANCIA NACIONAL
  (b) BEM POSICIONADO
  (c) BENEFICIO EM DISPENSAR REQUISITOS

### 7. COERENCIA
- Consistencia com contexto acumulado das secoes anteriores
- Numeros financeiros consistentes entre secoes
- Nomes de servicos/produtos identicos em todas as secoes

### 8. HETEROGENEIDADE VISUAL
- Tabela e para dados COMPARATIVOS/NUMERICOS com 5+ linhas
- 3 linhas ou menos = PROSA, proibido tabela
- MAXIMO 2 tabelas por secao (exceto Financial Plan: 3-4)
- Minimo 60% PROSA, maximo 40% tabelas
- PROIBIDO 3+ tabelas consecutivas sem paragrafos substanciais entre elas

Secoes 100% PROSA (zero tabelas):
- Sumario Executivo (abertura)
- Gestao do Conhecimento
- Consideracoes Finais

Secoes com tabelas esperadas:
- Financial Plan inteiro
- Timeline de Implementacao
- Analise de Concorrentes

### 9. ANTI-REPETICAO ENTRE SECOES
- NAO repita informacoes ja apresentadas em detalhe em secao anterior
- Use referencias cruzadas: "Conforme detalhado na Secao 2.1.2..."
- Cada secao deve trazer NOVAS analises e dados

### 10. FORMATO DE CITACAO -- SEGUIR EXATAMENTE
- Superscript apenas: texto[1]
- NAO liste referencias ao final da secao
- Numeracao continua entre secoes
- As referencias completas serao compiladas na secao S40

HIERARQUIA DE CONFIANCA DAS FONTES:
1. DADOS DA PLANILHA -> Confianca ABSOLUTA
2. DADOS DE WEB SEARCH -> Confianca ALTA, cite a fonte
3. DADOS DO FORMULARIO -> Confianca ABSOLUTA
4. DADOS .GOV CONHECIDOS (BLS, Census, SBA, IRS) -> Confianca ALTA
5. CONHECIMENTO GERAL VERIFICAVEL -> Confianca MEDIA
6. ESTIMATIVAS SEM FONTE -> Confianca BAIXA, linguagem qualitativa
7. QUALQUER COISA SEM CERTEZA -> NAO USE

### 11. PROTOCOLO ANTI-ALUCINACAO (CRITICO)
A) NUNCA INVENTE URLs
B) NUNCA INVENTE NOMES DE EMPRESAS concorrentes
C) NUNCA INVENTE RELATORIOS OU ESTUDOS
D) NUMEROS: planilha = confianca; web search = cite; nenhum dos dois = NAO use
E) DADOS REGIONAIS: so use se for dado regional real. Dado nacional = diga "em nivel nacional"
F) QUANDO NAO SOUBER: use formulacoes seguras qualitativas
G) CHECKLIST MENTAL antes de cada dado numerico

### 12. EXEMPLOS DE QUALIDADE DE PROSA
CORRETO: "A [Empresa] LLC configura-se como resposta tecnica direta as vulnerabilidades sistemicas documentadas nas cadeias produtivas criticas dos Estados Unidos..."
ERRADO: "A empresa atua no setor de servicos especializados com foco em solucoes inovadoras que agregam valor aos clientes..."
REGRA: Cada paragrafo de abertura DEVE conter pelo menos 1 dado especifico verificavel.

### 13. FORMATO DE LISTAS -- CRITICO
Cada item de lista deve ser COMPLETO e AUTOCONTIDO em uma unica linha.
NUNCA quebre um item de lista em multiplas linhas.
```

### 2.3 Forbidden Content Rules (Combined)

The app must validate EVERY section output against these prohibited terms. If ANY term is found, the section MUST be regenerated.

**12 Prohibited Terms (from FORBIDDEN_CONTENT_BP.md):**

| # | Term | Replacement |
|---|------|-------------|
| 1 | consultoria | assessoria, prestacao de servicos especializados |
| 2 | consultor | profissional, especialista, assessor |
| 3 | consulting | advisory services, specialized services |
| 4-12 | EB-1, EB-2, NIW, green card, visto, imigracao, USCIS, petition, peticao | NO REPLACEMENT -- must never appear |

**Additional Forbidden Terms (from error_rules.json -- global rules):**

| Pattern | Description |
|---------|-------------|
| `\b(I\|we)\s+believe\b` | Never use "I believe" or "we believe" |
| `\b(I\|we)\s+think\b` | Never use "I think" or "we think" |
| `\b(in conclusion\|to summarize)\b` | Never use "in conclusion" or "to summarize" |
| `\bprompt\b` | Never use the word "prompt" in output |
| `(PROEX\|Kortix\|Carlos Avelino)` | Never mention internal system names |

**Replacement Rules for "proposed endeavor":**
- In the BP context (doc_type: business_plan), use "business venture" or "empreendimento" instead of "proposed endeavor" (which is an immigration term)

**Validation Function (implement in the Lovable app):**

```typescript
const PROHIBITED_TERMS = [
  "consultoria", "consultor", "consulting",
  "EB-1", "EB-2", "NIW",
  "green card", "visto", "imigracao", "imigra\u00e7\u00e3o",
  "USCIS", "petition", "peticao", "peti\u00e7\u00e3o",
  "I believe", "we believe", "I think", "we think",
  "in conclusion", "to summarize",
  "prompt", "PROEX", "Kortix"
];

function validateForbiddenContent(text: string): { passed: boolean; violations: string[] } {
  const violations: string[] = [];
  const textLower = text.toLowerCase();
  for (const term of PROHIBITED_TERMS) {
    if (textLower.includes(term.toLowerCase())) {
      violations.push(term);
    }
  }
  return { passed: violations.length === 0, violations };
}
```

---

## PART 3: ALL 42 SECTION PROMPTS (Consolidated)

Each section below shows its unique section-specific prompt. This is appended AFTER the global system prompt (Part 2) and project data block in the system message.

**TEMPLATE for each section's system prompt:**
```
[Global System Prompt from Part 2.2]

## DADOS DO PROJETO ATUAL
EMPRESA: {company_name}
CORE BUSINESS: {core_business}
SERVICOS: {services_list}
LOCALIZACAO: {location}
ESTRUTURA LEGAL: {legal_structure}
MODELO DE CLIENTE: {client_model}
BENEFICIARIO: {beneficiary_name}
CODIGO SOC: {soc_code}
FORMACAO: {education}
EXPERIENCIA: {experience_years} anos
PROPOSED ENDEAVOR: {endeavor_description}
MERCADOS-ALVO: {target_markets}
ESTADOS DE EXPANSAO: {expansion_states}
IDIOMA: {language}
TOM: Executivo
OBSERVACOES: {globalConfig.observationsInjection}

[Section-Specific Prompt below]
```

---

### S1: Sumario Executivo -- Oportunidade de Negocio
**Block:** 1 | **Order:** 01 | **Words:** 800-1200

```
Gere "1.1. Sumario Executivo -- Oportunidade de Negocio".

ESTRUTURA OBRIGATORIA -- 3 SUBSECOES:

### 1.1.1. Apresentacao do Empreendimento
2 paragrafos descrevendo o negocio, proposta de valor e posicionamento.
4 bullets obrigatorios:
- **Sede:** {location} -- justificativa estrategica
- **Servicos Iniciais:** lista dos servicos
- **Expansao Futura:** {expansion_states}
- **Fundador:** {beneficiary} -- formacao e experiencia

### 1.1.2. Portfolio de Servicos
TABELA obrigatoria:
| Servico | Descricao Tecnica | Beneficio ao Cliente | Publico-Alvo | Problema Resolvido |
Uma linha para CADA servico cadastrado.
1 paragrafo sobre como os servicos se complementam.

### 1.1.3. Projecoes de Viabilidade
TABELA compacta:
| Indicador | Y1 | Y2 | Y3 | Y4 | Y5 |
Linhas: Receita Bruta, EBITDA, Lucro Liquido (dados da planilha).
NPV, IRR e Payback em 1 linha cada.
1 paragrafo conclusivo sobre viabilidade.

PROIBIDO nesta secao: dados de mercado (TAM, SAM, SOM), analise de concorrentes, tendencias de mercado. Esta secao foca no NEGOCIO, nao no MERCADO.
```

### S2: Timeline do Negocio (Resumo)
**Block:** 1 | **Order:** 02 | **Words:** 400-500

```
Gere "1.2. Timeline do Negocio (Resumo)".

ESTRUTURA:
1. Introducao
2. TABELA: Marcos principais (Mes | Marco | Descricao)
   - Meses 1-3: Constituicao legal e setup
   - Meses 4-6: Operacao inicial
   - Meses 7-12: Crescimento
   - Ano 2-3: Expansao
   - Ano 4-5: Consolidacao
3. Paragrafo conclusivo
```

### S3: Visao, Missao e Valores
**Block:** 1 | **Order:** 03 | **Words:** 300-400

```
Gere "1.3. Visao, Missao e Valores".

ESTRUTURA:
1. Introducao
2. VISAO: Declaracao de visao (1-2 frases)
3. MISSAO: Declaracao de missao (1-2 frases)
4. VALORES: 5-7 valores corporativos com descricao
5. Conexao com estrategia
6. Conclusao
```

### S4: Enquadramento Juridico
**Block:** 1 | **Order:** 04 | **Words:** 500-600

```
Gere "1.4. Enquadramento Juridico".

PESQUISE NA INTERNET:
1. Orgao de registro de LLC no estado (site oficial .gov)
2. Requisitos de registro
3. Licencas setoriais necessarias
4. Filing fees no estado
5. Processo de obtencao do EIN

ESTRUTURA OBRIGATORIA:
1. Paragrafo introdutorio (2-3 frases)
2. Procedimento de Registro da LLC
3. Obtencao do EIN -- cite irs.gov
4. Licencas e Certificacoes Setoriais
5. Conformidade Trabalhista e Tributaria
6. TABELA: Cronograma de Constituicao Legal (Etapa | Atividade | Prazo | Custo Est.)
7. Estrutura fiscal e beneficios
8. Paragrafo conclusivo

Cite fontes .gov com URL. Nao invente custos.
REGRA DE PESQUISA: Use APENAS dados encontrados via web search. Se nao encontrou, NAO invente.
```

### S5: Perspectivas do Mercado
**Block:** 2 | **Order:** 05 | **Words:** 600-700

```
Gere "2.1.1. Perspectivas do Mercado nos EUA" para o setor do negocio.

PESQUISE NA INTERNET:
- Tamanho do mercado (TAM) em USD
- Taxa de crescimento (CAGR)
- Dados de FDIC, BLS, Census Bureau, Statista, IBISWorld
- Estatisticas setoriais recentes (2024-2025)

ESTRUTURA OBRIGATORIA:
1. Introducao (2-3 frases)
2. Tamanho e Crescimento do Mercado (multiplas fontes)
3. TABELA: Dados do setor por estado/regiao
4. Vetores de Crescimento (3-4 fatores com dados)
5. Tendencias-Chave do Setor (2-3 tendencias)
6. Conclusao

Cada dado numerico DEVE ter fonte. Se duas fontes divergem, cite ambas.
REGRA DE PESQUISA: Use APENAS dados encontrados via web search.
```

### S5b: Relevancia, Oportunidades e Perspectivas Futuras
**Block:** 2 | **Order:** 06 | **Words:** 450-550

```
Gere "2.1.2. Relevancia, Oportunidades e Perspectivas Futuras".
Use o contexto da secao anterior (2.1.1.) para conectar dados macro ao negocio especifico.

PESQUISE dados complementares sobre oportunidades especificas.

ESTRUTURA:
1. Introducao conectando dados do mercado ao negocio
2. Fatores Estruturais de Crescimento (3-4 com dados)
3. TABELA: Desafio do Setor | Solucao da Empresa (4-5 linhas)
4. Diferenciacao Competitiva em Mercado em Transformacao
5. Oportunidades de curto, medio e longo prazo
6. Conclusao

NAO repita dados ja apresentados em 2.1.1 -- AVANCE a analise.
```

### S6: Cadeia de Suprimentos
**Block:** 2 | **Order:** 07 | **Words:** 450-550

```
Gere "2.2. Cadeia de Suprimentos e Potencialidade".

ESTRUTURA:
1. Introducao
2. TABELA Cadeia de Valor: Posicao | Tipo de Ator | Exemplos | Papel
   - Fornecedores 2a Camada, 1a Camada, A EMPRESA, Compradores 1a Camada, 2a Camada
3. Analise do Fluxo de Valor
4. Potencialidades e Parcerias Estrategicas
5. Riscos da cadeia e mitigacao
6. Conclusao
```

### S7: Empregabilidade Esperada
**Block:** 2 | **Order:** 08 | **Words:** 450-550

```
Gere "2.3. Empregabilidade Esperada (Direta e Indireta)".

PESQUISE:
- Multiplicador de empregabilidade indireta do EPI (Economic Policy Institute) para NAICS relevante
- Dados do Census Bureau sobre taxa de pobreza na regiao
- Salarios medianos do BLS para codigos SOC relevantes

ESTRUTURA:
1. Introducao com metodologia EPI
2. TABELA: Empregos Diretos por ano (Y1-Y5) com cargos e SOC
3. TABELA: Empregos Indiretos (multiplicador EPI)
4. TABELA: Impacto por regiao (comunidade, county, taxa pobreza, empregos)
5. Contribuicao tributaria estimada
6. Conclusao

Numeros de funcionarios DEVEM vir da planilha. Se nao houver, declare "a ser detalhado na secao 4.3".
```

### S8: Gestao do Conhecimento
**Block:** 2 | **Order:** 09 | **Words:** 450-550

```
Gere "2.4. Gestao do Conhecimento e Capital Intelectual".

ESTRUTURA:
1. Introducao sobre gestao do conhecimento
2. Capital Humano: competencias-chave
3. Capital Estrutural: processos, sistemas, metodologias proprietarias
4. Capital Relacional: redes, parcerias, reputacao
5. TABELA: Mapeamento de Competencias (Area | Competencia | Fonte | Nivel)
6. Estrategia de retencao e desenvolvimento
7. Conclusao
```

### S9: Impactos ESG
**Block:** 2 | **Order:** 10 | **Words:** 300-400

```
Gere "2.5. Impactos Economicos, Ambientais e Sociais (ESG)".

ESTRUTURA:
1. Introducao
2. Pilar Ambiental (E): 2-3 iniciativas concretas
3. Pilar Social (S): 2-3 iniciativas (comunidades carentes, capacitacao)
4. Pilar Governanca (G): 2-3 mecanismos
5. TABELA: KPIs de monitoramento (Pilar | Iniciativa | KPI)
6. Conclusao
```

### S10: Analise SWOT
**Block:** 2 | **Order:** 11 | **Words:** 450-550

```
Gere "2.6. Analise SWOT".
Use EXCLUSIVAMENTE informacoes ja geradas nas secoes anteriores (contexto acumulado).

ESTRUTURA:
1. Introducao sobre a ferramenta SWOT
2. TABELA SWOT (formato 2x2):
   | | Fatores Internos | Fatores Externos |
   | Positivos | 6 Forcas | 6 Oportunidades |
   | Negativos | 5 Fraquezas | 5 Ameacas |
   (MAIS forcas que fraquezas)
3. Analise contextual de cada quadrante (1 paragrafo por quadrante)
4. Conclusao com implicacoes praticas
```

### S11: SWOT Cruzada
**Block:** 2 | **Order:** 12 | **Words:** 450-550

```
Gere "2.7. Analise SWOT Cruzada".
Use os dados da Analise SWOT (secao anterior) do contexto acumulado.

ESTRUTURA:
1. Introducao sobre SWOT Cruzada como ferramenta estrategica
2. TABELA SWOT Cruzada:
   | Quadrante | Estrategia | Acoes Especificas |
   FO (Capitalizar), FA (Diferenciar), DO (Construir), DA (Mitigar)
3. Analise de cada quadrante (1-2 paragrafos cada)
4. Conclusao com implicacoes para o Ano 1
```

### S11b: Matriz ANSOFF
**Block:** 2 | **Order:** 13 | **Words:** 450-550

```
Gere "2.8. Matriz ANSOFF -- Estrategia de Crescimento".
Use contexto acumulado (mercado, SWOT, concorrentes).

ESTRUTURA:
1. Introducao sobre a Matriz ANSOFF
2. Penetracao de Mercado (1 paragrafo)
3. Desenvolvimento de Mercado (1 paragrafo)
4. Desenvolvimento de Produto (1 paragrafo)
5. Diversificacao (1 paragrafo)
6. TABELA: Estrategia | Riscos | Oportunidades | Metricas-Chave (4 linhas)
7. Conclusao com priorizacao para 5 anos
```

### S12: Analise de Concorrentes
**Block:** 2 | **Order:** 14 | **Words:** 450-550

```
Gere "2.9.1. Analise de Concorrentes".

PESQUISE empresas reais que atuam no setor nos EUA.

ESTRUTURA:
1. Introducao sobre cenario competitivo
2. TABELA: 4-5 concorrentes reais:
   | Concorrente | Tipo (Direto/Indireto) | Foco Principal | Limitacoes |
3. Analise do posicionamento de nicho da empresa
4. Conclusao com oportunidades estrategicas

REGRA CRITICA: NAO invente precos dos concorrentes. Se nao encontrar, escreva "Nao divulgado publicamente".
```

### S13: Ameaca de Novos Entrantes
**Block:** 2 | **Order:** 15 | **Words:** 450-550

```
Gere "2.9.2. Ameaca de Novos Entrantes".

PESQUISE sobre barreiras de entrada no setor.

ESTRUTURA:
1. Introducao
2. Analise de cada barreira (Alto/Medio/Baixo):
   Capital Inicial, Economias de Escala, Lealdade a Marca, Regulamentacao, Tecnologia, Canais de Distribuicao
3. TABELA resumo: Barreira | Nivel | Justificativa
4. Conclusao com nivel geral da ameaca
```

### S14: Poder de Negociacao dos Clientes
**Block:** 2 | **Order:** 16 | **Words:** 450-550

```
Gere "2.9.3. Poder de Negociacao dos Clientes".

ESTRUTURA:
1. Introducao
2. Analise de fatores (Alto/Medio/Baixo): Concentracao, Alternativas, Custos de Mudanca, Informacao, Sensibilidade a Preco
3. Conclusao
```

### S15: Poder de Negociacao dos Fornecedores
**Block:** 2 | **Order:** 17 | **Words:** 450-550

```
Gere "2.9.4. Poder de Negociacao dos Fornecedores".
Use contexto da Cadeia de Suprimentos.

ESTRUTURA:
1. Introducao
2. Analise: Concentracao, Unicidade, Custos de Mudanca, Integracao Vertical, Importancia do Setor
3. Conclusao
```

### S16: Produtos ou Servicos Substitutos
**Block:** 2 | **Order:** 18 | **Words:** 450-550

```
Gere "2.9.5. Produtos ou Servicos Substitutos".

ESTRUTURA:
1. Introducao
2. Identificacao de 3-5 substitutos
3. TABELA: Substituto | Custo | Qualidade | Risco de Migracao
4. Conclusao da analise de Porter (sintese de TODAS as 5 forcas)
```

### S17: Segmentacao de Mercado
**Block:** 3 | **Order:** 19 | **Words:** 400-500

```
Gere "3.1.1. Analise de Segmentacao de Mercado".

PESQUISE dados reais no Census Bureau, DataUSA, BLS.

ESTRUTURA:
1. Introducao
2. Segmentacao Demografica (populacao, renda, composicao)
3. Segmentacao Geografica (caracteristicas economicas)
4. Segmentacao por Porte de Empresas
5. Segmentacao Psicografica (inferida)
6. Segmentacao Comportamental (inferida)
7. Conclusao

Cite Census Bureau, DataUSA com URLs.
```

### S18: Publico-Alvo B2C
**Block:** 3 | **Order:** 20 | **Words:** 400-500

```
Gere "3.1.2. Publico-Alvo B2C".
Use dados da Segmentacao (secao anterior).

PESQUISE dados complementares sobre habitos de consumo.

ESTRUTURA:
1. Introducao
2. Para cada grupo (3-4): Nome | Perfil Demografico | Necessidade Principal | Conexao com Servicos
3. Conclusao
```

### S19: Setor-Alvo B2B
**Block:** 3 | **Order:** 21 | **Words:** 400-500

```
Gere "3.1.3. Setor-Alvo B2B".
Mercados-alvo: {target_markets}

PESQUISE dados sobre setores-alvo: numero de empresas, tamanho, necessidades.

ESTRUTURA:
1. Introducao
2. Para cada setor (3-4): Nome | Porte e Quantidade | Dor/Necessidade | Como Atende
3. Conclusao
```

### S20: Posicionamento da Marca
**Block:** 3 | **Order:** 22 | **Words:** 400-500

```
Gere "3.1.4. Posicionamento da Marca e Proposta de Valor".
Use publicos B2C e B2B ja definidos.

ESTRUTURA:
1. Introducao
2. Pilares de Posicionamento (3-4 com evidencias)
3. Declaracao de Posicionamento: "Para [publico], que [necessidade], a [empresa] e [categoria] que [diferencial] porque [razao]"
4. Mapa Perceptual (descritivo)
5. Conclusao
```

### S21: Produto -- Analise de Valor
**Block:** 3 | **Order:** 23 | **Words:** 400-500

```
Gere "3.2.1. Produto -- Analise de Valor".

ESTRUTURA:
1. Introducao
2. TABELA: Matriz de Proposta de Valor B2C (Servico x Grupo B2C)
3. TABELA: Matriz de Proposta de Valor B2B (Servico x Setor B2B)
4. Diferenciacao competitiva por servico
5. Conclusao
```

### S22: Analise de Preco
**Block:** 3 | **Order:** 24 | **Words:** 400-500

```
Gere "3.2.2. Estrategia de Preco".

DADOS DA PLANILHA (UNICA FONTE DE NUMEROS):
{financial_data.revenue}

REGRA ABSOLUTA: NAO invente precos unitarios, taxas horarias, ou valores por servico. Use APENAS os dados de receita da planilha. Se nao tem precos unitarios, descreva o MODELO de precificacao sem inventar valores.

ESTRUTURA:
1. Introducao
2. Modelo de Precificacao adotado
3. Distribuicao de receita por servico (se disponivel)
4. TABELA: Projecao de Receita Anual Y1-Y5 (da planilha)
5. Conclusao
```

### S23: Praca -- Estrategia de Distribuicao
**Block:** 3 | **Order:** 25 | **Words:** 400-500

```
Gere "3.3.3. Praca (Distribuicao e Canais)".

ESTRUTURA:
1. Introducao
2. TABELA: Canais de distribuicao com Vantagens/Desvantagens
3. Estrategia Geografica
4. Conclusao
```

### S24: Promocao -- Orcamento de Marketing
**Block:** 3 | **Order:** 26 | **Words:** 400-500

```
Gere "3.3.4. Promocao e Orcamento de Marketing".

DADOS DA PLANILHA: {marketing_budget or "Use distribuicao percentual generica"}

ESTRUTURA:
1. Introducao
2. TABELA: Distribuicao do Orcamento (Categoria | % | Acoes)
3. Conclusao
```

### S25: Estrategia de Marketing 4.0
**Block:** 3 | **Order:** 27 | **Words:** 400-500

```
Gere "3.5. Estrategia de Marketing 4.0".
Use contexto das secoes de Marketing anteriores.

ESTRUTURA:
1. Introducao
2. Integracao Omnichannel
3. Jornada do Cliente (5 As): Assimilacao, Atracao, Arguicao, Acao, Apologia
4. TABELA: Mapeamento 5As x Taticas
5. Marketing de Conteudo como Autoridade
6. Uso de Dados para Personalizacao
7. Conclusao
```

### S26: Quadro de Funcionarios
**Block:** 4 | **Order:** 28 | **Words:** 400-500

```
Gere "4.3. Quadro de Funcionarios".
SOC: {soc_code}

DADOS DA PLANILHA (USE ESTES, NAO INVENTE):
{employee_data or "Dados de pessoal nao disponiveis."}

PESQUISE codigos SOC relevantes no Bureau of Labor Statistics.

ESTRUTURA:
1. Introducao
2. Organograma (descritivo)
3. TABELA: Cargos com Codigo SOC | Cargo | Responsabilidades | Salario (da planilha)
4. Plano de Contratacao Faseado (Meses 1-3, 4-6, 7-12)
5. Conclusao

Numeros de funcionarios e salarios DEVEM vir da planilha.
```

### S27: Layout do Empreendimento
**Block:** 4 | **Order:** 29 | **Words:** 400-500

```
Gere "4.1. Layout do Empreendimento".

PESQUISE espacos comerciais na regiao.

ESTRUTURA:
1. Introducao
2. Requisitos do Espaco
3. Infraestrutura
4. Seguranca e Conformidade
5. Conclusao
```

### S28: Recursos Fisicos e Equipamentos
**Block:** 4 | **Order:** 30 | **Words:** 400-500

```
Gere "4.2. Recursos Fisicos e Equipamentos".

DADOS DA PLANILHA: {investment_data or "Dados de investimentos nao disponiveis."}

ESTRUTURA:
1. Introducao
2. TABELA: Equipamentos (Categoria | Item | Qtd | Custo -- da planilha)
3. TABELA: Moveis e Infraestrutura
4. Total de investimento (da planilha)
5. Conclusao

Valores DEVEM vir da planilha.
```

### S29: Recursos Tecnologicos
**Block:** 4 | **Order:** 31 | **Words:** 400-500

```
Gere "4.4. Recursos Tecnologicos".

ESTRUTURA:
1. Introducao
2. TABELA: Software e Licencas (Categoria | Ferramenta | Finalidade | Custo Anual)
3. Infraestrutura de TI
4. Automacao e Eficiencia Operacional
5. Conclusao
```

### S30: Localizacao do Negocio
**Block:** 4 | **Order:** 32 | **Words:** 400-500

```
Gere "4.5. Localizacao do Negocio".

PESQUISE: dados economicos, infraestrutura, acessibilidade.

ESTRUTURA:
1. Introducao
2. Analise da Localizacao (vantagens competitivas)
3. Perfil Economico da Regiao (Census Bureau)
4. Acessibilidade e Infraestrutura
5. Custos Operacionais da Regiao
6. Conclusao
```

### S31: Capacidade Produtiva
**Block:** 4 | **Order:** 33 | **Words:** 400-500

```
Gere "4.6. Capacidade Produtiva e Operacional".

ESTRUTURA:
1. Introducao
2. Capacidade instalada vs utilizada (Y1-Y5)
3. TABELA: Capacidade por servico (Servico | Cap. Max/Mes | Utilizacao Y1 | Utilizacao Y5)
4. Gargalos potenciais e plano de escalabilidade
5. Conclusao
```

### S32: Premissas Financeiras
**Block:** 5 | **Order:** 34 | **Words:** 500-600

```
Gere "5.1. Premissas Financeiras".

DADOS DA PLANILHA (USE EXCLUSIVAMENTE):
{financial_data_json}

ESTRUTURA:
1. Introducao
2. Premissas de Receita (taxa de crescimento, sazonalidade, mix de servicos)
3. Premissas de Custos (inflacao, reajustes salariais, custos variaveis)
4. Premissas Macroeconomicas (inflacao dos EUA)
5. TABELA: Resumo das Premissas (Premissa | Valor | Fonte/Justificativa)
6. Conclusao

Todos os numeros DEVEM vir da planilha.
```

### S33: Investimentos
**Block:** 5 | **Order:** 35 | **Words:** 400-500

```
Gere "5.2. Investimentos Iniciais e Fontes de Capital".

DADOS DA PLANILHA (USE EXCLUSIVAMENTE):
{financial_data_json}

ESTRUTURA:
1. Introducao
2. TABELA: Investimentos Pre-Operacionais (Categoria | Item | Valor)
3. TABELA: Capital de Giro necessario (primeiros 6 meses)
4. Fontes de Capital (equity, emprestimos, investidores)
5. Cronograma de Desembolso
6. Conclusao

Valores DEVEM vir da planilha.
```

### S34: Estimativa de Receitas e Custos
**Block:** 5 | **Order:** 36 | **Words:** 600-900

```
Gere "5.3. Estimativa de Receitas e Custos".

DADOS DA PLANILHA (USE EXCLUSIVAMENTE):
{financial_data_json}

ESTRUTURA:
1. Introducao
2. TABELA: Projecao de Receitas Y1-Y5 (Servico | Y1 | Y2 | Y3 | Y4 | Y5)
3. TABELA: Custos Variaveis Y1-Y5
4. TABELA: Custos Fixos Y1-Y5
5. Analise da Margem de Contribuicao
6. Conclusao

REGRA CRITICA: TODOS os numeros DEVEM vir da planilha. NAO arredonde nem modifique.
```

### S35: DRE -- Demonstrativo de Resultados
**Block:** 5 | **Order:** 37 | **Words:** 600-900

```
Gere "5.4. DRE -- Demonstrativo de Resultados do Exercicio".

DADOS DA PLANILHA (USE EXCLUSIVAMENTE):
{dre_data}

TABELA OBRIGATORIA com TODAS as linhas da DRE:
| Item | Y0 | Y1 | Y2 | Y3 | Y4 | Y5 | TOTAL |
Linhas: Receita Bruta, (-) Custos Variaveis, (=) Margem de Contribuicao, (-) Investimento, (-) Despesas Operacionais, (=) EBITDA, (-) Depreciacao, (-) Amortizacao, (-) Juros, (=) EBT, (-) Impostos sobre Folha, (=) Lucro Bruto, (-) Impostos de Renda, (=) Lucro Liquido, Lucro Liquido Acumulado.

REGRA: Use os EXATOS valores da planilha. NAO arredonde. NAO modifique.
2-3 paragrafos analiticos.
```

### S36: Indicadores de Retorno
**Block:** 5 | **Order:** 38 | **Words:** 600-900

```
Gere "5.5. Indicadores de Retorno".

DADOS DA PLANILHA:
{indicator_data}

ESTRUTURA:
1. Introducao
2. TABELA: Indicadores-Chave (Indicador | Valor | Benchmark | Status)
   NPV, IRR, Payback, ROI, ROE
3. Analise de cada indicador (1 paragrafo cada)
4. Analise de Sensibilidade (cenarios otimista, base, pessimista)
5. Conclusao
```

### S37: Break Even Point
**Block:** 5 | **Order:** 39 | **Words:** 600-900

```
Gere "5.6. Break Even Point (Ponto de Equilibrio)".

DADOS DA PLANILHA:
{bep_data}

ESTRUTURA:
1. Introducao
2. Calculo do BEP em unidades de servico
3. Calculo do BEP em receita ($)
4. TABELA: BEP por servico (se aplicavel)
5. Analise do tempo para atingir BEP
6. Margem de seguranca
7. Conclusao
```

### S38: Timeline de Implementacao
**Block:** 6 | **Order:** 40 | **Words:** 500-700

```
Gere "6.1. Timeline de Implementacao".
Use contexto de TODAS as secoes anteriores.

ESTRUTURA:
1. Introducao
2. TABELA tipo Gantt: Fase | Atividade | Mes Inicio | Mes Fim | Responsavel | Dependencia
   Minimo 15 atividades cobrindo meses 1-60
3. Marcos criticos e KPIs de acompanhamento
4. Conclusao
```

### S39: Consideracoes Finais
**Block:** 6 | **Order:** 41 | **Words:** 500-700

```
Gere "6.2. Consideracoes Finais".
Use contexto de TODAS as secoes anteriores.

ESTRUTURA:
1. Sintese do Plano (2-3 paragrafos)
2. Pontos de Destaque (3-4 diferenciais-chave)
3. Perspectivas de Longo Prazo
4. Encerramento

100% PROSA. Zero tabelas. Tom confiante mas fundamentado.
```

### S40: Referencias e Fontes
**Block:** 6 | **Order:** 42 | **Words:** Auto

```
Esta secao e compilada automaticamente pelo sistema.

Consolidar TODAS as referencias citadas ao longo das 41 secoes anteriores.
Formato: [numero] Nome da Fonte, Titulo do Documento/Pagina, Ano. URL (se disponivel).

Organizar por ordem de aparicao no documento.
Minimo 10 referencias de fontes verificaveis (.gov, .edu, industry reports).
```

---

## PART 4: QUALITY GATES

The Lovable app MUST implement 6 quality gates that run on EVERY generated section before storing it:

### Gate 1: Forbidden Content Check (BLOCKING)
Scan output for ALL prohibited terms (see Part 2.3). If ANY term is found, regenerate the section with reinforced prohibition instructions.

### Gate 2: Word Count Validation (WARNING)
| Section Type | Min | Max |
|-------------|-----|-----|
| Standard | 400 | 700 |
| Financial (S32-S37) | 500 | 900 |
| Short (S3, S9) | 300 | 400 |
| Executive Summary (S1) | 800 | 1200 |

Under minimum: flag for expansion. Over maximum: trim least essential paragraphs.

### Gate 3: Anti-Hallucination Audit (BLOCKING)
- Every numeric data point must trace to: spreadsheet data, web search result, or cited .gov source
- Competitor names must be verifiable or described generically
- URLs must be real
- Statistics must reference their source

### Gate 4: Table Formatting Compliance (WARNING, fixable)
- Every table has introductory paragraph (min 2 sentences) BEFORE
- Every table has concluding paragraph (min 1 sentence) AFTER
- Proper markdown format with header separator row
- No "naked" tables

### Gate 5: Structural Completeness (WARNING, fixable)
- Introduction present (2-3 sentences)
- Body with substantive content
- Conclusion present (2-3 sentences)
- No metacommentary: strip "Vou pesquisar...", "Contagem de palavras:", "Let me...", etc.

### Gate 6: Cross-Section Consistency (after block completion)
- Financial numbers match across sections
- Employee count consistent
- Location references consistent
- Company name identical everywhere
- Service/product naming consistent

**Gate Execution Order:**
```
Section Generated -> Gate 1 (BLOCK) -> Gate 2 (WARN) -> Gate 3 (BLOCK) -> Gate 4 (FIX) -> Gate 5 (FIX) -> Approved
After block complete -> Gate 6 (cross-check)
```

---

## PART 5: BP-SPECIFIC ERROR RULES (from error_rules.json)

These 16 rules apply specifically to `doc_type: "business_plan"` and must be enforced in the Lovable app:

| Rule | Description | Severity | Action |
|------|-------------|----------|--------|
| r17 | Infographics/charts generated by AI must have data reviewed against financial spreadsheet before incorporating | high | warn |
| r18 | Each section with market data needs numbered references [1][2][3] with verifiable sources (BLS, Census, IBISWorld) | high | block |
| r19 | Paragraphs over 1200 characters must be split or have visual break inserted | high | warn |
| r20 | Empty sections (heading followed by heading with no content) are prohibited | critical | block |
| r21 | Never use "pe quadrado" -- use "metros quadrados" (PT) or "square feet" (US context) | critical | block |
| r22 | ALL chart/infographic labels must be in ENGLISH (Gross Revenue, Net Income, etc.) | critical | block |
| r23 | Footer "CONFIDENTIAL -- [COMPANY] -- Business Plan 2026" must appear on ALL pages | critical | block |
| r24 | Each section needs minimum 300-500 words of dense content. Under 50 words = unacceptable | high | warn |
| r25 | LLC is the legal entity name. S-Corporation is the tax election (Form 2553). Clarify distinction when both are mentioned | high | block |
| r26 | Each section number (1.1, 2.3, etc.) must appear ONLY ONCE. Duplicate numbering prohibited | critical | block |
| r27 | Every table needs introductory paragraph (min 2 sentences) BEFORE and analytical paragraph (min 1 sentence) AFTER | critical | block |
| r28 | Location section must have intact paragraphs -- no broken lines or disconnected data | critical | block |
| r29 | B2C and B2B target sections must have consistent formatting. No stray hashtags or markdown headings mid-text | critical | block |

**Anti-Cristine Rules (nexo beneficiario-endeavor):**
The BP must demonstrate implicit causal nexus between the beneficiary's credentials and the business venture. Every section should naturally connect the founder's expertise to the business operations without ever mentioning immigration.

---

## IMPLEMENTATION INSTRUCTIONS FOR LOVABLE

1. **Store all 42 section prompts** in a structured data file (JSON array or object map keyed by section ID)
2. **Build the system prompt dynamically** for each section: Global System Prompt + Project Data Block + Observations Injection + Section-Specific Prompt
3. **Maintain accumulated context**: after each section is generated, append its markdown output to the accumulated context string that feeds into subsequent sections
4. **Run quality gates after each section** before storing the result
5. **Allow section regeneration**: if a gate fails, the user should be able to click "Regenerate" which re-runs the API call with reinforced instructions
6. **Financial data injection**: for sections S32-S37, inject the financial spreadsheet data (JSON) into the user message
7. **Research Pack**: for sections requiring web search (S4, S5, S5b, S7, S12, S13, S17, S18, S19, S26, S27, S30), note this in the UI as "requires research data"
8. **Section numbering**: must follow the exact order (1.1, 1.2, 1.3, 1.4, 2.1.1, 2.1.2, ... 6.2) with no duplicates

---

*BP System V3 -- Mega Prompt for Lovable -- System Architecture & Section Prompts*
*Version: 3.0 -- April 2026*
