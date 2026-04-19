# RESEARCH PROTOCOL — EB-2 NIW
## Protocolo de Pesquisa Profunda na Web para Prong 1
### v1.0 — 28/02/2026

---

## CONTEXTO

O Prong 1 (National Importance) exige vinculação do Proposed Endeavor a prioridades federais documentadas. Este protocolo define as pesquisas OBRIGATÓRIAS que o agente deve executar antes de produzir o Prong 1.

**Mínimo**: 15 web searches
**Ideal**: 20-30 web searches
**Output**: Research Dossier (markdown) com TODAS as URLs e dados extraídos

---

## CATEGORIA 1: CRITICAL & EMERGING TECHNOLOGIES (CETs)

### Queries Obrigatórias
```
"Critical and Emerging Technologies List" 2024 site:whitehouse.gov
"Critical and Emerging Technologies" [CAMPO DO CLIENTE]
NSTC "critical technologies" [CAMPO]
```

### Fonte Principal
- **NSTC CET List (Feb 2024)**: https://www.whitehouse.gov/wp-content/uploads/2024/02/Critical-and-Emerging-Technologies-List-2024-Update.pdf
- Identificar subcategoria EXATA que corresponde ao campo do cliente
- Se o campo do cliente NÃO está diretamente na CET → buscar conexão indireta (ex: "cybersecurity" não está na CET, mas "Advanced Computing" e "Data Privacy" estão)

### Output Esperado
```
CET ALIGNMENT:
- Subcategoria: "[NOME EXATO]"
- URL: [URL]
- Conexão ao PE: [DESCRIÇÃO]
```

---

## CATEGORIA 2: EXECUTIVE ORDERS

### Queries Obrigatórias
```
Executive Order [CAMPO] 2023 2024 2025
"Executive Order" [ÁREA ESPECÍFICA] site:whitehouse.gov
Biden OR Trump executive order [CAMPO]
```

### EOs Relevantes Conhecidos (verificar vigência via web search)
| EO | Tema | Campos Aplicáveis |
|----|------|-------------------|
| EO 14110 | Safe, Secure, Trustworthy AI | AI, ML, data science, cybersecurity |
| EO 14017 | America's Supply Chains | Manufacturing, logistics, semiconductors |
| EO 14012 | Restoring Faith in Legal Immigration | Todos (NIW-friendly) |
| EO 14008 | Climate Crisis | Energy, environment, cleantech |
| EO 13985 | Advancing Racial Equity | Social services, education, health |

### Output Esperado
```
EXECUTIVE ORDER ALIGNMENT:
- EO [NÚMERO]: "[TÍTULO]" ([DATA])
- URL: [URL]
- Trecho relevante: "[PARÁFRASE]"
- Conexão ao PE: [DESCRIÇÃO]
```

---

## CATEGORIA 3: BUDGET PRIORITIES FY2026-27

### Queries Obrigatórias
```
"FY2027 R&D Budget Priorities" site:whitehouse.gov
"FY2026 Budget" [CAMPO] site:whitehouse.gov
OSTP budget priorities [CAMPO] 2026 2027
[AGÊNCIA] budget FY2026 [CAMPO]
"Technology Modernization Fund" [CAMPO]
```

### Fontes Principais
- **OSTP FY2027 R&D Memo**: (buscar URL atualizada)
- **FY2026 Discretionary Budget Request**: (arquivo no projeto: FiscalYear2026DiscretionaryBudgetRequest.pdf)
- **OSTP FY2027 Memo**: (arquivo no projeto: M2534NSTM2FiscalYearFY2027...)
- Buscar allocation específica para a agência/programa relevante

### Output Esperado
```
BUDGET ALIGNMENT:
- Documento: "[TÍTULO]" ([DATA])
- Agência/Programa: [NOME]
- Allocation: USD [VALOR] (se disponível)
- Prioridade citada: "[PARÁFRASE]"
- URL: [URL]
- Conexão ao PE: [DESCRIÇÃO]
```

---

## CATEGORIA 4: BLS / O*NET DATA

### Queries Obrigatórias
```
BLS "occupational outlook" [TÍTULO DA OCUPAÇÃO]
BLS OES [SOC CODE]
O*NET [SOC CODE]
[OCUPAÇÃO] employment projections 2024-2034
[OCUPAÇÃO] median salary United States
```

### Fontes Principais
- **BLS OOH**: https://www.bls.gov/ooh/
- **BLS OES**: https://www.bls.gov/oes/current/oes[SOC].htm
- **O*NET**: https://www.onetonline.org/link/summary/[SOC]

### Dados a Extrair
```
BLS/O*NET DATA:
- SOC Code: [CÓDIGO]
- Título: [TÍTULO]
- Emprego nacional: [N] profissionais
- Projeção de crescimento: [X]% (2024-2034)
- Qualificador: [Faster than average / Much faster / etc.]
- Salário médio: USD [VALOR]/ano
- Bright Outlook: [SIM/NÃO]
- URL OOH: [URL]
- URL OES: [URL]
- URL O*NET: [URL]
```

---

## CATEGORIA 5: CISA CRITICAL INFRASTRUCTURE

### Queries Obrigatórias
```
CISA "critical infrastructure" [SETOR]
CISA "critical infrastructure sectors" site:cisa.gov
```

### 16 Setores CISA
Verificar se o campo do cliente se enquadra:
1. Chemical
2. Commercial Facilities
3. Communications
4. Critical Manufacturing
5. Dams
6. Defense Industrial Base
7. Emergency Services
8. Energy
9. Financial Services
10. Food and Agriculture
11. Government Facilities
12. Healthcare and Public Health
13. Information Technology
14. Nuclear
15. Transportation Systems
16. Water and Wastewater

### Output Esperado
```
CISA ALIGNMENT:
- Setor: "[NOME]"
- URL: https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience/critical-infrastructure-sectors/[SETOR]
- Conexão ao PE: [DESCRIÇÃO]
```

---

## CATEGORIA 6: DISTRESSED COMMUNITIES INDEX

### Queries Obrigatórias
```
"Distressed Communities Index" [CIDADE] [ESTADO]
EIG DCI [CIDADE]
[CIDADE] [ESTADO] economic indicators distressed
```

### Fonte Principal
- **EIG DCI**: https://eig.org/distressed-communities/
- Buscar classificação do ZIP code/condado da sede da empresa

### Output Esperado
```
DCI DATA:
- Localização: [CIDADE, ESTADO]
- Classificação DCI: [Prosperous/Comfortable/Mid-tier/At Risk/Distressed]
- Score: [0-100]
- Dados-chave: [taxa desemprego, renda mediana, pobreza, etc.]
- URL: [URL]
- Implicação: [Se distressed → forte argumento; se prosperous → focar outros aspectos]
```

---

## CATEGORIA 7: LEGISLAÇÃO VIGENTE

### Queries Obrigatórias
```
"Big Beautiful Bill" immigration [CAMPO]
H.R.1 119th Congress employment-based
CHIPS Act [CAMPO]
"Inflation Reduction Act" [CAMPO]
[CAMPO] federal legislation 2024 2025
```

### Output Esperado
```
LEGISLATION:
- Lei: "[NOME]" ([NÚMERO], [DATA])
- Relevância: [DESCRIÇÃO]
- Implicação para NIW: [DESCRIÇÃO]
- URL: [URL]
```

---

## CATEGORIA 8: DADOS DE MERCADO

### Queries Obrigatórias
```
[CAMPO] market size United States 2024 2025
[CAMPO] industry growth rate US
[CAMPO] workforce shortage 2025 2026
[NICHO ESPECÍFICO] market research United States
```

### Fontes Preferidas
- Mordor Intelligence, IBISWorld, Grand View Research (relatórios de mercado)
- Bureau of Economic Analysis (BEA) (dados econômicos)
- Census Bureau (dados demográficos)
- Agência federal relevante (DOE, HHS, DOD, etc.)

### Output Esperado
```
MARKET DATA:
- Mercado: [NOME]
- Tamanho: USD [VALOR] ([ANO])
- CAGR: [X]% 
- Fonte: [NOME DA FONTE]
- URL: [URL]
```

---

## CATEGORIA 9: NATIONAL SECURITY (se aplicável)

### Queries
```
"National Security Strategy" [CAMPO]
"National Defense Strategy" [CAMPO]
[CAMPO] national security United States
```

---

## CATEGORIA 10: WORKFORCE / TRAINING GAP

### Queries
```
[CAMPO] workforce development United States
[CAMPO] skills gap 2025
[CAMPO] training programs federal
```

**⚠️ ATENÇÃO**: Usar dados de gap APENAS como CONTEXTO, nunca como justificativa principal de national importance.

---

## FORMATO DO RESEARCH DOSSIER

```markdown
# RESEARCH DOSSIER — [NOME DO CLIENTE]
## Data: [DATA]
## Campo: [CAMPO]
## SOC Code: [CÓDIGO] — [TÍTULO]

### 1. CET ALIGNMENT
[Dados extraídos + URL]

### 2. EXECUTIVE ORDERS
[Dados + URL]

### 3. BUDGET PRIORITIES
[Dados + URL]

### 4. BLS/O*NET
[Dados + URLs]

### 5. CISA INFRASTRUCTURE
[Dados + URL]

### 6. DCI DATA
[Dados + URL]

### 7. LEGISLAÇÃO
[Dados + URL]

### 8. DADOS DE MERCADO
[Dados + URLs]

### 9. NATIONAL SECURITY
[Dados + URL se aplicável]

### 10. WORKFORCE/TRAINING
[Dados + URL — como contexto]

---

## MAPEAMENTO → PROPOSED ENDEAVOR

| Fonte Federal | Conexão ao PE | Força |
|--------------|--------------|-------|
| CET: [subcategoria] | [conexão] | FORTE/MÉDIO |
| EO [número] | [conexão] | FORTE/MÉDIO |
| OSTP FY2027 | [conexão] | FORTE/MÉDIO |
| BLS [SOC] | [dados] | CONTEXTO |
| CISA [setor] | [conexão] | FORTE/MÉDIO |
| DCI [score] | [dados] | FORTE/FRACO |

## TOTAL: [N] sources encontradas, [N] com conexão forte ao PE
```

---

## REGRAS

1. **CADA URL deve ser verificável** — se o link não funciona, buscar alternativa
2. **Preferir fontes .gov** sobre fontes privadas
3. **Dados mais recentes** — se há versão 2025 e 2024 de um dado, usar 2025
4. **NUNCA inventar URL** — se não encontrou, documentar no dossier
5. **Mínimo 15 searches** antes de considerar a pesquisa completa
6. **Salvar Research Dossier** como markdown para Paulo revisar

---

*v1.0 — 28/02/2026*
