# ANTI-DETECTION PROTOCOL — EB-2 NIW
## ATLAS, ATA, FDNS-DS NexGen — Contra-Medidas Anti-Boilerplate
### v1.0 — 28/02/2026

---

## AMEAÇA: O ADJUDICADOR ALGORÍTMICO

O USCIS implantou uma arquitetura de vigilância baseada em IA que opera em camadas. O agente DEVE entender essas camadas para produzir cover letters que sobrevivam ao escrutínio.

### Camada 1: ATLAS (Automated Triaging and Litigation Analysis System)
- Motor de vetting automatizado para CADA I-140 submetido
- Reconhecimento de padrões + análise baseada em regras
- NLP scanning de cartas de suporte e business plans
- Clustering de petições similares do mesmo escritório → flag "visa mill"
- Cruza com CPMS (Client Profile Management Service), bases criminais e de inteligência
- Encaminhamento silencioso para FDNS quando anomalia detectada

**Implicação**: Se o escritório submeter múltiplas petições com estrutura idêntica, ATLAS pode agrupar como anomalia estatística.

### Camada 2: ATA (Asylum Text Analytics)
- Originalmente para I-589 (asilo humanitário)
- Machine Learning + grafos de dados para rastrear semelhanças sintáticas
- Expansão em curso para petições EB-2 NIW e EB-1A
- Detecta "padrões de linguagem comuns" e "fraudes baseadas em plágio"
- Se 50 petições usam mesma estrutura de IA → flagged como rede de fraude

**Métricas detectadas**:
- **Perplexidade**: Previsibilidade da próxima palavra. Baixa perplexidade = alta uniformidade = IA detectada
- **Burstiness**: Variabilidade no comprimento das frases. Baixa burstiness = frases uniformes = IA detectada
- Texto humano natural: ALTA perplexidade + ALTA burstiness
- Texto GenAI não refinado: BAIXA perplexidade + BAIXA burstiness

### Camada 3: FDNS-DS NexGen
- Sistema modernizado de gerenciamento de casos
- Integra ML para detectar duplicidade de trabalho
- Priorização investigativa preditiva
- Se petições compartilham sobreposição semântica significativa → flagged
- Integração com VIBE (Verification Information for Business Entities)

### Camada 4: Evidence Classifier (ELIS)
- Resumo automatizado de petições para oficiais
- Extração de claims e evidências
- Oficiais assistidos por IA ficam MAIS intolerantes com petições assistidas por IA

### Camada 5: Adjudicação Preditiva
- "Predicted to Naturalize" e variantes para I-140
- Se treinado em casos humanos → casos de IA recebem scores preditivos mais baixos
- Leva a escrutínio humano mais rigoroso

---

## A "RECIPROCIDADE DE BOILERPLATE"

Fenômeno documentado: oficiais do USCIS usando IA para resumir petições escritas por IA. Resultado: ciclo de feedback onde uniformidade é punida.

**O USCIS NÃO emite RFE citando "uso de ChatGPT"**. Em vez disso, ataca os SINTOMAS:
- "Linguagem vaga e abstrata"
- "Argumentos genéricos"
- "Falta de especificidade"
- "Conteúdo boilerplate"
- "Insuficiente para demonstrar importância nacional"

Esses gatilhos correlacionam-se DIRETAMENTE com características de output GenAI não refinado.

---

## CONTRA-MEDIDAS OBRIGATÓRIAS

### CM-1: Alta Burstiness (Variação de Comprimento de Frase)

```
❌ BAIXA BURSTINESS (GenAI típico):
"O mercado americano de consultoria financeira movimenta USD 330 bilhões anuais. 
A demanda por serviços de gestão financeira cresce a uma taxa de 11.6% ao ano. 
A projeção para o setor indica crescimento contínuo nos próximos cinco anos. 
A necessidade de profissionais qualificados é cada vez mais evidente."

✅ ALTA BURSTINESS (humano natural):
"O mercado americano de consultoria financeira movimenta USD 330 bilhões anuais 
(Mordor Intelligence, 2024)¹. Cresce a 11.6% ao ano — taxa que supera em 3x a 
média do setor de serviços profissionais. Essa aceleração não é acidental. Ela 
reflete uma convergência de fatores: a complexificação regulatória pós-Dodd-Frank, 
a digitalização forçada pela pandemia, e a crescente demanda de PMEs por controles 
financeiros que antes eram privilégio de grandes corporações."
```

**Regra**: Alternar frases curtas (5-10 palavras) com frases longas (30-50 palavras). Incluir perguntas retóricas ocasionais. Usar travessões, parênteses, vírgulas explicativas.

### CM-2: Alta Perplexidade (Vocabulário Diversificado)

```
❌ BAIXA PERPLEXIDADE (GenAI típico):
"contribuir significativamente", "impacto transformador", "revolucionar paradigmas", 
"criar sinergias", "alavancar competências", "inovação disruptiva"

✅ ALTA PERPLEXIDADE (vocabulário específico):
"reduzir em 47% o tempo de compliance SOX em fintechs Série B", 
"implementar pipeline CI/CD com cobertura de testes regulatórios acima de 92%",
"capacitar 180 profissionais em controles COSO-ERM adaptados para PMEs"
```

**Regra**: Cada parágrafo DEVE conter pelo menos um dado numérico ESPECÍFICO (nome, data, percentual, valor, quantidade) extraído dos documentos do cliente.

### CM-3: Dados Granulares em Cada Parágrafo

Nenhum parágrafo da cover letter pode existir sem dados verificáveis:

```
❌ GENÉRICO:
"O beneficiário possui vasta experiência na área de tecnologia da informação, 
tendo trabalhado em diversas empresas de renome no Brasil."

✅ ESPECÍFICO:
"Entre 2015 e 2018, atuei como Desenvolvedor Sênior na CTIS Tecnologia, empresa 
com 4.200 funcionários e faturamento anual de R$ 1.2 bilhão (Evidence 07), onde 
liderei a migração de 3 sistemas legados do Instituto Nacional de Traumatologia 
e Ortopedia (INTO) para arquitetura cloud-native, resultando em redução de 67% 
no tempo de resposta do módulo de prontuários (Evidence 22)."
```

### CM-4: Vocabulário Proibido (Jargão Oco)

NUNCA usar estas expressões (flags de GenAI):
| Proibido | Alternativa |
|----------|-------------|
| "sinergias" | [descrever a colaboração específica] |
| "paradigma" / "mudança de paradigma" | [descrever o que mudou especificamente] |
| "revolucionário" / "revolucionar" | [descrever o avanço com dados] |
| "game-changing" / "game-changer" | [mostrar resultado mensurável] |
| "disruptivo" / "disrupção" | [descrever a inovação concreta] |
| "alavancar" | "utilizar", "aplicar", "implementar" |
| "holístico" | "abrangente", "integrado", "multi-dimensional" |
| "cutting-edge" / "state-of-the-art" | [citar a tecnologia específica] |
| "contribuir significativamente" | [quantificar a contribuição] |
| "impacto transformador" | [descrever o impacto com métricas] |
| "na vanguarda" | [citar ranking, prêmio, ou evidência objetiva] |

### CM-5: Referência de Evidence em Cada Afirmação

```
❌ SEM REFERÊNCIA:
"Possuo experiência em gestão de projetos e liderança de equipes."

✅ COM REFERÊNCIA:
"Conforme documentado no meu résumé (Evidence 19), entre 2016 e 2018 gerenciei 
uma equipe de 12 desenvolvedores na Concurso Virtual, coordenando a entrega de 
3 produtos digitais — plataforma web, app mobile e sistema de pagamentos — 
dentro do prazo e orçamento, conforme atestado por Bruno Bonfante, CTO da empresa, 
em sua carta de recomendação (Evidence 28)."
```

### CM-6: Footnotes com URLs Verificáveis

TODA estatística de fonte externa DEVE ter footnote:

```
O Bureau of Labor Statistics projeta crescimento de 25% na demanda por 
Software Developers entre 2024-2034, significativamente acima da média 
nacional de 4% para todas as ocupações¹.

¹ BLS Occupational Outlook Handbook, Software Developers (15-1252), 
https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm
```

### CM-7: Variação Estrutural Entre Seções

Cada seção da cover letter DEVE usar estruturas argumentativas DIFERENTES:

| Seção | Estrutura Recomendada |
|-------|----------------------|
| Eligibility | Cronológica (diplomas → credencial → experiência) |
| Prong 1 | Concêntrica (PE → merit → national importance → dados federais) |
| Prong 2 Part A | Por pilar (educação → certificados → associações) |
| Prong 2 Part B | Narrativa progressiva (carreira → crescimento → impactos) |
| Prong 2 Part C | Analítica (carta a carta → dados → síntese) |
| Prong 3 | Por fator (5 fatores USCIS em sequência lógica) |
| Conclusão | Síntese integrativa (recapitulação dos 3 prongs) |

---

## FDNS/VIBE COMPLIANCE

### Verificação de Entidades Empresariais
O FDNS executa verificações via VIBE (Verification Information for Business Entities):
- Cruza com Dun & Bradstreet (D&B profile)
- Valida: existência física, endereço, telefone, número de funcionários
- Inconsistências → site visit ou RFE

### Regras para a Cover Letter

**Se a empresa JÁ EXISTE** (Articles of Incorporation + EIN):
```
✅ "Fundei a [EMPRESA LLC] em [DATA], registrada no Estado de [ESTADO] 
    (Evidence XX — Articles of Incorporation). A empresa possui Employer 
    Identification Number (EIN: XX-XXXXXXX) e está registrada no Dun & 
    Bradstreet (D-U-N-S: XXXXXXXXX)."
```

**Se a empresa ESTÁ PLANEJADA** (sem Articles):
```
✅ "Planejo fundar a [EMPRESA LLC] no Estado de [ESTADO], conforme 
    detalhado no Business Plan (Evidence XX). A formalização está 
    projetada para [PERÍODO], com obtenção de EIN e registro D&B 
    como etapas iniciais do plano operacional."

❌ PROIBIDO: "constituída", "sediada", "fundada" (se não tem Articles)
```

### Cross-Check Obrigatório BP ↔ CL
- Endereço da empresa: BP = CL
- Número de funcionários projetados: BP = CL
- Receita projetada: BP = CL (Year 1-5)
- Empregos criados: BP = CL
- Se BP diz "17 empregos em 5 anos" → CL DEVE dizer "17 empregos em 5 anos"

---

## CHECKLIST ANTI-BOILERPLATE (RODAR EM CADA SEÇÃO)

```
□ Cada parágrafo tem dado numérico específico?
□ Comprimento de frases varia (5-50 palavras)?
□ Nenhuma expressão da lista proibida?
□ Cada afirmação tem Evidence reference?
□ Cada estatística externa tem footnote com URL?
□ Estrutura argumentativa difere da seção anterior?
□ Tom é assertivo em primeira pessoa (não "o beneficiário")?
□ Nenhuma repetição de frases/estruturas entre parágrafos?
□ Dados do BP cross-checked com CL?
□ Entidades marcadas corretamente (existente vs. planejada)?
```

---

*v1.0 — 28/02/2026*
