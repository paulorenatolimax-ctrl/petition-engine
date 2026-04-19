---
name: eb1-letter-system-v4
description: "Sistema universal de produção de cartas de apoio para petições EB-1A (Habilidade Extraordinária), EB-1B (Pesquisador Excepcional), EB-1C (Executivo Multinacional) e também aplicável a EB-2 NIW pelos protocolos transversais. Versão 4.0 é SUPERCONJUNTO PURO da V3.1 — preserva 100% das regras #1-#15 e adiciona 8 protocolos críticos (#16-#23) extraídos por engenharia reversa retrospectiva dos casos Ricardo Augusto (11 cartas satélite, auditoria adversarial 53-issues) e Mariana Kasza (11 docs, 8 formatos distintos). Novos protocolos: Persona Engineering explícito (#16), MASTER_FACTS Anchors enforcement (#17), HARD_BLOCKs por SOC code (#18), Regex Suite Anti-GPT (#19), Anti-ATLAS Validator (#20), Adversarial Auditor consolidado (#21), Final-Pass Cycle formal (#22), Declaração de Contador com APÊNDICE legal (#23). MANDATORY TRIGGERS: EB-1 letter, EB-1A, EB-1B, EB-1C, EB-2 NIW satellite letters, extraordinary ability letter, outstanding researcher letter, multinational executive letter, carta EB-1, carta EB-2 NIW, carta de recomendação EB-1, expert opinion letter, satellite letter, support letter for extraordinary ability, Kazarian letter, Dhanasar satellite letter, carta satélite, carta de opinião especializada, carta de testemunho, carta de cliente futuro, carta de parceiro estratégico, carta de investidor, declaração de contador, recommendation letter immigration, heterogeneous letters EB-1, anti-ATLAS letter generation, signature verb dictionary, MASTER_FACTS enforcement, persona engineering."
---

# Sistema Produtor de Cartas EB-1 — Versão 4.0 (Abril/2026)

Gerar cartas de apoio profissionais, visualmente heterogêneas e juridicamente blindadas para petições EB-1A, EB-1B, EB-1C e, pelos protocolos transversais, também EB-2 NIW. Cada carta deve parecer única, escrita por pessoa diferente, com identidade visual, voz textual e padrão probatório próprios, para sobreviver aos sistemas USCIS ATLAS/ATA de detecção anti-boilerplate, aos RFEs automatizados por IA e à auditoria adversarial interna deste sistema.

> **UNIVERSAL** — funciona para qualquer cliente, qualquer área. O operador fornece os dados do caso; o sistema entrega cartas prontas para o dossiê.

> **V4.0 É SUPERCONJUNTO DA V3.1** — Tudo que valia na V3.1 continua valendo. V4 apenas ADICIONA protocolos; não MODIFICA nem REMOVE nada. Se um protocolo V4 parecer conflitar com V3.1, o mais rigoroso prevalece.

> **V4.0 UPGRADE** — Incorpora aprendizados de 2 engenharias reversas retrospectivas:
> 1. **Caso Ricardo Augusto (EB-2 NIW, 11 cartas)** — Cowork Ricardo (57 regras invisíveis em 8 categorias, 23 anti-padrões IA com regex, 8 critérios de adversarial auditor, MASTER_FACTS anchors, HARD_BLOCKs por SOC 17-2051)
> 2. **Caso Mariana Kasza (EB-2 NIW, 11 docs em 8 formatos)** — 8 letter formats distintos, vocabulary banks setoriais, KPI baseline-meta-timeline, strength scoring 7-9.5/10
>
> Novos protocolos adicionados: RULE #16 a #23 + Verificações 8-11 no Passo 7 + Ciclo Final-Pass formal + MASTER_FACTS schema + HARD_BLOCKs por SOC + Regex Suite Anti-GPT + Tipo 7 (Declaração de Contador).

---

## ⚠️ PASSO ZERO — LEITURA OBRIGATÓRIA DE RAGs

**ANTES de escrever qualquer carta, o operador (IA ou humano) DEVE ler os seguintes documentos de estratégia na íntegra:**

1. **RAG 1 — Análise de Critérios de Aprovação e Negação EB-1 (2023-2025)**
   - Caminho padrão: `[pasta RAGs]/Análise Aprofundada dos Critérios de Aprovação e Negação para Petições EB-1 (A, B, C) e Tendências de Dados (Anos Fiscais 2025, 2024, 2023).pdf`
   - **Por que é obrigatório:** Contém jurisprudência AAO caso a caso, taxonomia de motivos de aprovação/negação, padrões que separam aprovados de negados, insights sobre "generic letters have little weight"

2. **RAG 2 — O que os Oficiais Esperam Ver em uma Petição EB-1A**
   - Caminho padrão: `[pasta RAGs]/O que os Oficiais de Imigração Esperam Ver em uma Petição EB-1A (Habilidade Extraordinária).pdf`
   - **Por que é obrigatório:** Perspectiva do adjudicador — o que faz o oficial pensar "Uau, isso se destaca". Qualidade sobre quantidade, narrativa coerente, reconhecimento independente, cadeias lógicas explícitas

3. **RAG 3 — Pesquisa de Escritórios de Elite (WeGreened, Manifest, Lison Bee)**
   - Caminho padrão: `[pasta RAGs]/Pesquisas do que os outros escritórios estão fazendo - EB-1.pdf`
   - **Por que é obrigatório:** Estratégias de elite firms com 88-91% de aprovação: "Pílula Venenosa" (Critério 9), Divisão 40/60 (Step 1 vs Step 2), "Declaração de Intenção Futura" vs business plan, salary Forex/PPP trap, organização física de exhibits, CV como "catálogo de evidências"

4. **RAG 4 — Atualização de Dados EB-1 2026**
   - Caminho padrão: `[pasta RAGs]/Atualização de Dados EB-1 2026.docx`
   - **Por que é obrigatório:** Mukherji v. Miller (Step 2 declarado ilegal), Trump Gold Card (I-140G), RFEs gerados por IA com "alucinações", EB-1A a 66.6% (Q3 FY2025), colapso do NIW a 54%, Premium Processing como "pagar por negação rápida"

5. **NOVO V4 — RAG 5 — Retrospectivas de Engenharia Reversa (Cowork Ricardo + Mariana Kasza)**
   - Caminho padrão: `[pasta do projeto]/RETROSPECTIVA_RICARDO_COWORK.md` + `[pasta C.P.]/ENGENHARIA_REVERSA_CARTAS_MARIANA_KASZA.md`
   - **Por que é obrigatório:** Documentação empírica de 57+20 regras extraídas de 22 cartas reais aprovadas. Alimenta diretamente as RULES #16-#23. Fonte canônica de MASTER_FACTS anchors, HARD_BLOCKs por SOC, anti-padrões IA, signature verb dictionary.

**Se os RAGs não estiverem no caminho padrão, PERGUNTAR ao operador onde estão. Não prosseguir sem ler.**

---

## Framework Legal — Conheça TUDO Antes de Escrever

### EB-1A: Matter of Kazarian — Análise em 2 Etapas (COM ATUALIZAÇÃO MUKHERJI 2026)

**Etapa 1 (Contagem de Critérios — ~40% da petição):** Verificar se o peticionário atende pelo menos **3 dos 10 critérios regulatórios** OU possui prêmio internacional de grande prestígio (Nobel, Pulitzer, Oscar, Fields Medal).

**Etapa 2 (Determinação de Mérito Final — ~45-60% da petição):** Avaliação qualitativa de TODO o dossiê: aclamação sustentada, posicionamento no topo absoluto do campo, evidências em conjunto demonstrando habilidade extraordinária.

> **🔴 ATUALIZAÇÃO CRÍTICA 2026 — MUKHERJI v. MILLER:**
> Em 28 de janeiro de 2026, a Corte Distrital de Nebraska declarou que o Step 2 (Determinação de Mérito Final) é uma "regra substantiva" criada sem o processo legislativo de "notice-and-comment" exigido pelo APA (Administrative Procedure Act). O tribunal ordenou a **aprovação imediata** da petição, sinalizando tolerância zero com a arbitrariedade. Implicações:
> - O USCIS **NÃO** emitiu memorando formal revogando o Step 2 (até fev/2026), mas qualquer negação baseada puramente em "mérito final" é altamente reversível em litígio
> - Requisitos extra-legais inventados por oficiais (aclamação "recente", permanecer "indefinidamente no topo") foram atacados pelo tribunal
> - **Para nossas cartas:** AINDA devemos endereçar Step 2 (nem todo advogado vai litigar), mas sabemos que a tendência é de enfraquecimento desta barreira

### Os 10 Critérios EB-1A (8 CFR 204.5(h)(3))

| # | Critério | O que a carta deve demonstrar | Armadilhas |
|---|----------|-------------------------------|------------|
| 1 | Prêmios/premiações | Seletividade, # candidatos, prestígio do prêmio | **ATUALIZAÇÃO 2024:** Prêmios de EQUIPE agora aceitos (desde que papel individual seja comprovado) |
| 2 | Associações seletivas | Critérios de admissão rigorosos, processo seletivo | **ATUALIZAÇÃO:** Filiações PRETÉRITAS agora consideradas |
| 3 | Material publicado SOBRE o peticionário | Mídia, circulação, audiência | **ATUALIZAÇÃO:** Removida exigência de que matéria "demonstre o valor" — basta ser sobre o candidato e seu trabalho |
| 4 | Julgador do trabalho de outros | Convites, bancas, peer review | Demonstrar que foi CONVIDADO (não voluntário) |
| 5 | Contribuições originais de grande significância | **CRITÉRIO MAIS CONTESTADO** — nexo causal, adoção por terceiros, impacto no campo | Patentes sozinhas ≠ contribuições; necessário demonstrar adoção/impacto |
| 6 | Autoria de artigos acadêmicos | Publicações, citações, fator de impacto | Citações sem benchmark do campo são inúteis |
| 7 | Exposição artística | Venues de prestígio, curadoria | N/A para maioria dos casos |
| 8 | Papel de liderança/crítico | Escopo, relevância da organização | Precisa ser organização "distinguida", não qualquer empresa |
| 9 | Remuneração alta | Comparação com pares, dados de mercado | **🔴 "PÍLULA VENENOSA"** — ver seção abaixo |
| 10 | Sucesso comercial | Bilheteria, vendas, rankings | Métricas objetivas obrigatórias |

### 🔴 A Teoria da "Pílula Venenosa" — Critério 9 (Salário)

Escritórios de elite (WeGreened, Lison Bee) identificaram que incluir o Critério 9 para candidatos de moedas fracas (BRL, INR, etc.) pode ENVENENAR toda a petição durante o Step 2. Razões:

1. **Distorção Forex:** USD 150K/ano no Brasil pode ser salário de CEO, mas convertido diretamente é "mediano" nos EUA
2. **Trap da PPP:** Mesmo usando Paridade de Poder de Compra, o oficial pode questionar a metodologia
3. **"Razão de Potência":** Comparar salário do peticionário com mediana do setor NO PAÍS onde trabalhou (ex: "7.2x acima da mediana nacional para gerentes de projeto no Brasil segundo IBGE/RAIS") é a ÚNICA forma aceitável
4. **Recomendação:** Só incluir Critério 9 se o candidato ganhar comprovadamente >4x a mediana do campo no país de trabalho. Caso contrário, **OMITIR** — um critério fraco a menos é melhor que um critério que gera dúvida sobre TODO o caso

### EB-1B: 6 Critérios (precisa de 2+)

| # | Critério |
|---|----------|
| 1 | Prêmios por conquistas excepcionais |
| 2 | Associações que exigem conquistas excepcionais |
| 3 | Material publicado sobre o peticionário |
| 4 | Participação como julgador |
| 5 | Contribuições originais de pesquisa |
| 6 | Autoria de livros/artigos acadêmicos |

**Requisitos adicionais EB-1B:** Mínimo 3 anos experiência em ensino/pesquisa + reconhecimento internacional + cargo tenured/tenure-track (universidade) ou pesquisa permanente (empresa).

### EB-1C: Executivo/Gerente Multinacional

**Taxa de aprovação 2026: 97.6%** — a rota mais segura do sistema EB-1.

Requisitos: capacidade gerencial/executiva (não "first-line supervisor"), camadas organizacionais documentadas, 1 ano de emprego no exterior em posição gerencial, empresa operando nos EUA por >1 ano.

**Alerta EB-1C 2026:** Ressurgimento de RFEs sobre "Capacidade de Pagamento" (Ability to Pay). Empresas com margens baixas devem preparar documentação financeira suplementar.

### EB-2 NIW — Matter of Dhanasar (para cartas satélite cross-category)

As RULES transversais V4 (#16-#23) também se aplicam a cartas satélite de EB-2 NIW, onde os 3 prongs Dhanasar (national importance, well-positioned, balance/waiver) devem ser endereçados **sempre de forma IMPLÍCITA** — jamais nomear "Dhanasar", "NIW", "national interest" ou "prong" na carta. Ver RULE #19 para anti-padrões que frequentemente rompem essa invisibilidade.

---

## Regras Críticas — NUNCA Violar

### 1. NUNCA mencionar termos de imigração
**LISTA PROIBIDA (tolerância ZERO):**
`consultoria` · `assessoria` · `imigração` · `visto` · `visa` · `USCIS` · `RFE` · `NIW` · `EB-1` · `EB-2` · `green card` · `petição` · `petition` · `extraordinary ability` · `outstanding researcher` · `Kazarian` · `Dhanasar` · `I-140` · `adjudicador` · `adjudicator` · `beneficiário` · `patrocinador` · `waiver` · `priority date` · `labor certification` · `concurrent filing` · `I-485` · `EAD` · `advance parole`

As cartas são documentos profissionais entre colegas/parceiros. O contexto imigratório é **INVISÍVEL**. Se o leitor conseguir inferir que é carta de imigração, a carta **falhou**.

### 2. NUNCA usar "consultoria" ou "assessoria" como descrição de serviço
O sistema VIBE do USCIS valida empresas contra Dun & Bradstreet. NAICS code "consultoria geral" dispara RFE instantâneo. Substitua SEMPRE por termos específicos: "gestão de projetos", "implementação de sistemas", "treinamento corporativo", "arquitetura empresarial", "transformação digital", "desenvolvimento organizacional", etc.

**Exceção:** "Consultoria" na razão social de empresa (ex: "Hirata e Associados Consultoria e Projetos Estruturais") é aceitável — é nome registrado em junta comercial, não descrição de serviço prestado.

### 3. Identidade visual única OBRIGATÓRIA por carta
Fontes, cores, estrutura de seções, formato de tabelas — tudo diferente. O ATLAS agrupa documentos por similaridade visual E textual. Cluster = "visa mill" = negação. Ver RULE #20 (V4) para validador automatizado.

### 4. Flexibilidade de Linguagem (ATUALIZADO V3)
**ANTES (V2):** 100% em português brasileiro.

**AGORA (V3):**
- **Default:** Idioma natural do país de residência do recomendador
- **Recomendadores nos EUA:** Inglês
- **Recomendadores no Brasil:** Português
- **Recomendadores em outros países:** Idioma do país (espanhol na Argentina, francês na Suíça, etc.)
- **Casos mistos:** Seguir instrução explícita do operador
- **Exceção:** Termos técnicos em inglês SEMPRE aceitáveis independentemente da língua da carta (Scrum, SAFe, CRM, ERP, FP&A, etc.)
- **REGRA CRÍTICA:** NUNCA misturar idiomas dentro de uma mesma carta (exceto termos técnicos consagrados)
- **Implicação para petições nos EUA:** Maioria das cartas será em INGLÊS (recomendadores EUA-based), não português

### 5. Métricas quantificáveis OBRIGATÓRIAS (EXPANDIDA V4 com estrutura baseline-meta-timeline)

Cada carta DEVE conter **no mínimo 4 dados quantificáveis** com fonte/inferência verificável. Sem números, a carta é fraca. Ver `references/metricas-e-nexos-causais.md`.

**EXPANSÃO V4 — Quando o tipo de carta admite projeções (Testemunho, Attestação, Carta de Intenção, Satélite):**

Preferir estrutura **baseline → meta → timeline** sempre que houver KPI projetado:

| Componente | Exemplo PT | Exemplo EN |
|---|---|---|
| Baseline | "No-show rate de 52% em 2023" | "45-day average processing time in 2024" |
| Meta | "Redução para <30% até o final de 2026" | "Target of <20 days within 18 months" |
| Timeline | "Horizonte de 18 meses, revisão trimestral" | "Milestones at Q1 2026, Q3 2026, Q1 2027" |

**Origem:** Mariana v1 — cada uma das 11 cartas tem KPI estruturado (no-show 52→<30%, time 45→20-25 days, closings +30%, revenue +US$ 2M).

### 6. Cadeias causais explícitas (O CORAÇÃO DO SISTEMA)
Cada afirmação relevante segue:
```
FATO VERIFICÁVEL
  → INFERÊNCIA TÉCNICA (por que é significativo tecnicamente)
    → IMPACTO MENSURÁVEL (o que mudou em números)
      → NEXO CAUSAL COM O CAMPO (por que importa para o campo)
        → CONTEXTUALIZAÇÃO COM PARES (como se compara — top X%)
```

**Exemplo completo:**
"A metodologia de implementação desenvolvida por [NOME] reduziu o ciclo de go-live de ERP de 14 para 8 meses em 3 organizações distintas (↓43%). Essa redução indica domínio excepcional da tríade de fatores críticos em implementação de ERP — gestão de mudança organizacional, configuração de processos e transferência de conhecimento — três áreas que, quando mal gerenciadas, respondem por 67% dos fracassos (Panorama Consulting, 2024). Em termos financeiros, a aceleração de 6 meses gera economia direta estimada entre USD 180K-450K por projeto. A replicação em 3 setores diferentes demonstra contribuição transferível ao campo, posicionando [NOME] no percentil 95+ segundo o Standish Group CHAOS Report 2024 (apenas 31% dos projetos de TI são on-time on-budget)."

### 7. Diferenciação rigorosa entre tipos de carta (ATUALIZADO V4 — 7 TIPOS)

| Tipo | Quem escreve | Tempo verbal | Relação com peticionário |
|------|-------------|-------------|------------------------|
| **Recomendação** | Profissional que CONHECE pessoalmente | Passado + presente | Colaboração direta |
| **Expert Opinion** | Autoridade no campo SEM colaboração | Analítico | Independência declarada |
| **Satélite** | Empresa que QUER contratar/parceria | Futuro/condicional | Sem serviço prestado ainda |
| **Testemunho** | Cliente que JÁ recebeu serviços | Passado | Serviços concluídos |
| **Attestação do Cliente** (V3) | Cliente/stakeholder que recebeu serviços | Passado + analítico | Impacto operacional direto |
| **Carta de Intenção** (V3) | Executivo em empresa prestigiosa | Presente + futuro | Demanda de mercado |
| **Declaração de Contador** (NOVO V4) | Contador registrado (CRC) responsável pela escrituração | Passado histórico, 1ª pessoa do contador | Testemunha técnica documental |

Ver RULE #23 para o protocolo completo da Declaração de Contador.

### 8. Endereçar AMBAS as etapas de Kazarian
Mesmo com Mukherji enfraquecendo o Step 2, as cartas devem:
- **Step 1:** Mapear evidências precisamente aos critérios (sem nomear os critérios!)
- **Step 2:** Explicar POR QUE é extraordinário no contexto do campo, com comparação a pares, reconhecimento SUSTENTADO ao longo do tempo

### 9. Heterogeneidade textual e perplexidade alta (EXPANDIDA V4 — vocabulary banks setoriais)

O ATLAS mede perplexidade textual (diversidade vocabular). Cartas formulaicas recebem score alto de "boilerplate". Ver tabela de sinônimos em `references/metricas-e-nexos-causais.md`.

**EXPANSÃO V4 — Vocabulary Banks Setoriais (Mariana v1):**

Cada carta DEVE conter **no mínimo 8 termos setoriais próprios** do domínio do signatário ou do peticionário, não repetidos em outras cartas do mesmo batch. Exemplos validados empiricamente:

| Setor | Termos-âncora característicos |
|---|---|
| Engenharia estrutural (Ricardo) | "cordoalhas", "pós-tração aderente", "ART 10-digits", "fibra de carbono", "CFRP", "reforço longitudinal", "consoles metálicos", "patologia em concreto", "NBR 6118", "PTI Journal" |
| AdTech / DOOH (Mariana) | "analytics programática", "dwell time", "inventário de telas", "rollout", "CAGR", "CPM", "viewability" |
| Dental multi-spec (Mariana) | "no-show rate", "receita por hora de operatório", "teledentistry", "HIPAA", "multiespecializado", "tabela nacional CROs" |
| Mortgage (Mariana) | "originação", "pipeline de empréstimos", "abandon rate", "pré-qualificação digital", "LTV ratio" |
| Cleantech / Water (Mariana) | "escalabilidade", "readiness nível TRL", "sprints semanais", "OPEX/CAPEX ratio" |
| Real Estate internacional (Mariana) | "integração econômica", "nutrição de leads", "segmentação inteligente", "NAR data" |
| Legal services (Mariana) | "parecer técnico", "maturidade digital", "attorney-client privilege", "ementa" |
| Training / Mastermind (Mariana) | "capital humano", "retenção de talentos", "mentalidade Agile", "Net Promoter Score" |

Se o setor do caso não estiver acima, construir vocabulário próprio a partir de literatura técnica + terminologia regulatória específica.

### 10. "Próximos Passos" como header em NO MÁXIMO 1 carta do batch
Variar: "Perspectivas de Colaboração", "Oportunidades Identificadas", "Escopo Proposto", "Áreas de Interesse", "Horizontes de Parceria", "Caminhos Propostos", etc.

### 11. Otimização para leitura por máquina (NOVO 2026)
RFEs automatizados por IA do USCIS cometem "alucinações" (solicitam documentos já presentes). As cartas devem:
- Usar palavras-chave exatas dos regulamentos (evitar sinônimos criativos para termos regulatórios)
- Ser estruturadas com seções claras e nomeadas
- Referência cruzada explícita a exhibits do dossiê quando apropriado (ex: "conforme documentado no Anexo [X]")

### 12. Protocolo de Verificação de Credenciais (V3)

**Problema Descoberto em Produção Real:** Em ciclo de 7 cartas para cliente real, 5 de 5 cartas iniciais continham credenciais ALUCINADAS:
- MBA em universidade errada (Columbia vs. Harvard, Wharton vs. UCLA Anderson)
- Certificações fictícias (CPA, PMP, certs SAP/AWS que não existiam)
- Títulos incorretos (VP ao invés de SVP)
- Filiações inventadas (SAICA, Deloitte)
- Experiência compilada errada

**Risco:** Uma única credencial falsificada pode DESTRUIR a credibilidade de todo o dossiê e gerar RFE de verificação de autenticidade.

**PROTOCOLO OBRIGATÓRIO — ANTES de escrever qualquer carta:**

1. **LEITURA COMPLETA:** Ler o LinkedIn profile/CV do recomendador na íntegra, salvando screenshot/cópia
2. **EXTRAÇÃO DE CREDENCIAIS:** Listar TODAS as credenciais:
   - Nome completo exato
   - Título atual EXATO (copiar do LinkedIn)
   - Empresa atual EXATA (copiar de LinkedIn)
   - Educação: escola + grau + ano (ex: "University of Queensland, PhD Physics, 2015")
   - Certificações: APENAS as listadas (CPA, PMP, etc.)
   - Empregadores anteriores: APENAS os confirmados no perfil
   - Anos de experiência: Calcular das datas reais
3. **CHECKLIST POR RECOMENDADOR:**
   ```
   [ ] Nome completo matches CV/LinkedIn
   [ ] Título current = exato ao visto no LinkedIn
   [ ] Company = confirmado no LinkedIn
   [ ] MBA/Degree = exato (escola + ano) ou omitir
   [ ] Certifications = ZERO inferências, só o que está listado
   [ ] Prior employers = só se no perfil
   [ ] Years of experience = calculado (ano atual - ano início)
   ```
4. **INTEGRAÇÃO COM PASSO 7:** Adicionar "Verificação 4 — Credenciais" ao workflow de validação

**Consequência de Violar:** Se uma credencial não puder ser verificada contra LinkedIn/CV, flagar como `[UNVERIFIED]` e NÃO incluir na carta. Perguntar ao operador antes de prosseguir.

### 13. Endosso Técnico — Alavancagem de Autoridade do Recomendador (V3)

**Problema Descoberto:** Cartas iniciais não aproveitavam credenciais únicas do recomendador para VALIDAR as afirmações sobre o peticionário.

**NOVO CONCEITO: "Endosso Técnico"** — Usar a credencial/experiência ESPECÍFICA do recomendador para demonstrar POR QUE sua opinião tem peso especial.

**PROTOCOLO OBRIGATÓRIO:**

Para cada recomendador, identificar:
- **O que faz ESTA pessoa única qualificada para opinar?** (PhD em X, 15 anos em Y, publicação em Z)
- **Que experiências específicas dão autoridade extra?** (lidera equipes de N pessoas, publicou em Nature, respondeu a crise X)
- **Como essas credenciais ENDOSSAM as afirmações sobre o peticionário?**

**REGRA:** Cada letra DEVE conter pelo menos UM parágrafo onde:
1. A credencial específica do recomendador é explicitada
2. Essa credencial é conectada à avaliação do peticionário
3. A conexão demonstra por que THIS person's opinion matters

**Exemplo ANTES (fraco):** "[Peticionário] é excelente em modelagem financeira. Trabalhei com ele por 3 anos."

**Exemplo DEPOIS:** "Como autoridade em transformação de modelos de previsão — meu PhD em estatística aplicada e 17 anos liderando implementações de FP&A em 12 organizações Fortune 500 — posso atestar que a metodologia de modelagem multidimensional desenvolvida por [NOME] representa uma inovação técnica significativa. A capacidade de reconciliar dados de múltiplas fontes EOD enquanto mantém integridade de auditoria é rara; apenas 3 profissionais em minha rede de 200+ especialistas em transformação financeira demonstram esse nível de sofisticação técnica. [NOME] está entre eles."

### 14. Heterogeneidade Estrutural (V3 — formalizada explicitamente em V4)

Além da heterogeneidade **visual** (RULE #3) e **textual** (RULE #9), o batch DEVE ter heterogeneidade **estrutural**: distribuição controlada de elementos de layout entre as cartas. Foi referenciada no changelog V3 mas sem heading de regra próprio — V4 formaliza:

**Máximo por batch de N cartas:**
- Tabelas: ≤ ⌈N/3⌉ cartas (ex: 6 cartas → máx 2 com tabelas; e tabelas DEVEM ser de TIPOS DIFERENTES — T1 vs T2 vs T4)
- Listas com bullet points: ≤ ⌈N/5⌉ cartas (ex: 6 cartas → máx 1)
- Listas numeradas: ≤ 1 carta
- Pull-quotes: ≤ 1 carta
- Blocos "value proposition" (caixa destacada com proposta): ≤ 1 carta
- Estrutura de artigos numerados (Art. 1, Art. 2...): ≤ ⌈N/4⌉ cartas
- Bordas duplas/bottom-border como divisor: distribuídos, ≤ 2 cartas do mesmo estilo

**Enforcement:** Matriz 4 (Ângulos + Estrutura) do Passo 3 documenta explicitamente os elementos de cada carta. Não começar a escrita até a Matriz 4 estar fechada.

### 15. Protocolo de Anexos/Apêndices de Evidência (V3)

**Problema Descoberto em Produção Real:** Cartas de testemunho/attestação frequentemente mencionam resultados mensuráveis (KPIs, dashboards, relatórios) mas não anexam a evidência documental que comprova esses resultados. Quando há documentos reais de suporte disponíveis, mencioná-los e anexá-los fortalece enormemente a credibilidade da carta — MAS inventar ou assumir a existência de documentos é DESTRUTIVO para o dossiê.

**RISCO CRÍTICO:** Mencionar um anexo que NÃO EXISTE ou que contém informação diferente da descrita é PIOR do que não mencionar nenhum anexo. O adjudicador VERIFICARÁ a consistência entre a menção na carta e o documento físico.

**PROTOCOLO OBRIGATÓRIO — ANTES de mencionar qualquer anexo:**

1. **SCAN COMPLETO DA PASTA DE EVIDÊNCIAS:** Antes de escrever qualquer carta do batch, executar `ls -la` (ou equivalente) na pasta de evidências/documentos do caso. Catalogar TODOS os arquivos disponíveis com nome, tipo e tamanho.

2. **AVALIAÇÃO DE RELEVÂNCIA:** Para cada documento encontrado, avaliar:
   - Qual recomendador tem relação DIRETA com este documento?
   - O documento CORROBORA afirmações feitas na carta desse recomendador?
   - O documento é compreensível sem contexto excessivo?

3. **REGRA DE DISTRIBUIÇÃO — HETEROGENEIDADE:**
   - **MÁXIMO 1-2 cartas** por batch devem conter menção a anexos
   - **NUNCA** todas as cartas com anexos — isso é irrealista
   - Priorizar anexos em **Testemunho**, **Attestação do Cliente**, **Declaração de Contador**
   - **Expert Opinion** e **Carta de Intenção** tipicamente NÃO têm anexos
   - **Recomendação** pode OCASIONALMENTE ter anexo

4. **RENOMEAÇÃO PROFISSIONAL DOS ARQUIVOS:**
   - Padrão: `Anexo [Numeral Romano] — [Título Descritivo].[ext]`
   - O numeral romano é sequencial DENTRO de cada carta (Anexo I, Anexo II...)
   - O título deve refletir o CONTEÚDO REAL do documento

5. **TEXTO DE MENÇÃO — INSERÇÃO NA CARTA:**
   - Posicionar ANTES do bloco de assinatura
   - Formato padrão em inglês: `In support of the statements made herein, I attach the following documentary evidence: • Annex I — [Título] ([formato]): [1 linha descrevendo conteúdo].`
   - Formato padrão em português: `Em suporte às declarações aqui prestadas, anexo a seguinte evidência documental: • Anexo I — [Título] ([formato]): [1 linha descrevendo conteúdo].`

6. **GUARDA ANTI-ALUCINAÇÃO (CRÍTICO):**
   - ❌ PROIBIDO mencionar documento que NÃO foi encontrado no scan
   - ❌ PROIBIDO inferir conteúdo de documento sem tê-lo lido
   - ❌ PROIBIDO inventar nomes descritivos
   - ❌ PROIBIDO assumir que "provavelmente existe"
   - ✅ Se não houver documentos: NÃO MENCIONAR ANEXOS
   - ✅ Rastreabilidade: `[ARQUIVO VERIFICADO: nome_original.ext → Anexo N — Título Novo.ext]`

---

## 🆕 RULES NOVAS V4 — Protocolos das Retrospectivas Cowork + Mariana

### 16. 🆕 Persona Engineering Explícito (RULE #16 — V4)

**Origem:** Cowork Ricardo, Categoria C (C1-C7) — 7 regras de persona engineering validadas empiricamente em 11 cartas reais.

**Problema que resolve:** RULE #13 (Endosso Técnico) cuida das CREDENCIAIS do signatário. RULE #16 cuida da VOZ AUTORAL — a forma como ele fala, o vocabulário que ele usa, o ritmo das frases, a distribuição de pronomes. Duas cartas com credenciais distintas mas VOZ IGUAL são um tell imediato de mass production.

**PROTOCOLO OBRIGATÓRIO — ANTES de escrever cada carta do batch, construir um `persona_bank[author_id]` com seis campos:**

**C1. `signature_verb`** — Verbo assinatura próprio do autor, usado em momento-chave da carta (ex: abertura, declaração formal, fechamento). Cada autor do batch deve ter um verbo DIFERENTE.

Exemplos validados:
- Ademar Toyonori Hirata (engenheiro sênior BR): "registre-se", "subscrevo", "manifesto"
- Carlos Eduardo Rocha (engenheiro civil BR): "emito o presente endosso", "firmo as considerações"
- Antônio Claret (jurista técnico): "subscrevo", "atesto", "certifico"
- Thiago (testemunha direta): "testemunho", "declaro que observei", "presenciei"
- Karins (US PE): "I hereby attest", "I certify in my professional capacity", "it is my considered opinion"

**C2. `opening_template_variants`** — Mínimo 3 variantes de abertura por autor; nunca repetir abertura entre duas cartas do mesmo batch.

Exemplos:
- Trajetória ("Atuo há 50+ anos em estrutural em Goiás...")
- Formação ("Formado em 2013 pela UFMG, concluí o doutorado em 2019 pela UFG...")
- Referencial institucional ("Escrevendo na condição de Fundador da Hirata e Associados...")
- Credencial única ("As a Florida-licensed Professional Engineer holding License #34217...")
- Observação temporal direta ("Entre 2014 e 2017, atuei como engenheiro-associado ao lado do Sr. ...")

**C3. `emotional_register`** — Tom dominante explicitamente codificado. Opções canônicas:
- `personal-collegial` (testemunho direto de colega/amigo profissional)
- `technical-forensic` (jurista-perito, análise fria)
- `cold-commercial` (B2B, futuro cliente, general contractor)
- `narrative-reflexive` (testemunho de impacto, história)
- `ultra-formal-legal` (declaração em artigos, WHEREAS/ARTICLE)
- `financial-analytic` (PPM, investidor, TAM/SAM/SOM)
- `academic-diagnostic` (parecer técnico, análise quasi-acadêmica)

Distribuição: em batch de 6+ cartas, não repetir `emotional_register` mais de 2x.

**C4. `expertise_domain_lock`** — Delimitação estrita do domínio que o autor pode opinar. Autor opina DENTRO do lock. Fora disso, é inferência indevida.

Exemplos:
- Ademar (engenheiro estrutural 50y): pode opinar sobre pós-tração, patologia em concreto, reforço; NÃO opina sobre real estate, finanças, AdTech.
- Karins (FL PE): pode opinar sobre capacidade de mercado dos EUA, licenciamento, IIJA; NÃO opina sobre engenharia estrutural brasileira (papel de co-signatário estrutural cabe a Ademar).

**Enforcement:** se a carta tem julgamento FORA do lock, é sinal de alucinação ou cartel — cortar.

**C5. `sentence_length_distribution`** — Ritmo das frases. Distribuição variada por autor:
- `long-enumerative` (frases longas, 80-120 palavras, enumerativas, estilo jornalístico-brasileiro dos anos 80)
- `short-engineer` (frases curtas, 12-22 palavras, estilo engenheiro direto)
- `terse-business-us` (frases curtas, telegráficas, estilo executivo US)
- `mixed-analytical` (mistura curtas + frase longa explicativa a cada 3-4)

Em batch de 6+ cartas, pelo menos 3 distribuições diferentes aparecem.

**C6. `pronoun_distribution`** — Dominância de pronomes por tipo de carta:
- Testemunho: "I" / "eu" dominante (60%+ das frases pessoais)
- Cliente futuro B2B: "we" institucional ("we understand...", "our firm has...")
- Investidor: "our family office" / "our investment thesis" (institucional com agência)
- Parceiro estratégico: misto "I" (fundador) + "we" (firma)

**C7. `autobiographical_fragments`** — 1-2 fragmentos autobiográficos curtos por carta, que humanizam sem forçar. Exemplos: "five decades in the field", "age 23, fresh graduate at the time", "ex-TCI, responsible for bridge inspection in 2014". Nunca MAIS de 2 por carta.

**SCHEMA persona_bank[author_id] (JSON):**
```json
{
  "author_id": "ademar_hirata",
  "full_name": "Ademar Toyonori Hirata",
  "signature_verb": "registre-se",
  "opening_template_variants": [
    "Atuo há 50+ anos em engenharia estrutural no Estado de Goiás...",
    "Como fundador e responsável técnico da Hirata e Associados...",
    "Em minhas cinco décadas dedicadas à engenharia estrutural..."
  ],
  "emotional_register": "technical-forensic",
  "expertise_domain_lock": ["pós-tração aderente", "patologia em concreto", "reforço estrutural", "engenharia forense"],
  "sentence_length_distribution": "long-enumerative",
  "pronoun_distribution": "I-dominant",
  "autobiographical_fragments": ["cinco décadas de atuação", "formação 1973 FCT-UFG"]
}
```

**Validação (Verificação 8 do Passo 7):** para cada carta, confirmar que o texto contém C1 (signature_verb), que a abertura é uma das variantes de C2, que o registro emocional está alinhado com C3, que nenhum julgamento sai do domínio de C4, etc.

---

### 17. 🆕 MASTER_FACTS Anchors — Enforcement Cross-Letter (RULE #17 — V4)

**Origem:** Cowork Ricardo, Seção 4 — na v3 do batch Ricardo, a âncora "14+ anos de prática estrutural" estava AUSENTE em TODAS as 11 cartas. Só foi detectada pelo adversarial auditor manualmente. Risco: dossiê inteiro sem fato-âncora central = perda de Prong 2.

**Problema que resolve:** sem um registro central dos FATOS-ÂNCORA do caso (anos de experiência, licença, canal PE, SOC, valores-chave), cada carta é gerada em isolamento e o adjudicador percebe inconsistências ou ausências quando lê o dossiê inteiro.

**PROTOCOLO OBRIGATÓRIO:**

**17.1 Construir MASTER_FACTS.json por caso** — ANTES de começar a escrever qualquer carta, criar este arquivo com o schema abaixo:

```json
{
  "case_id": "nome completo do peticionário",
  "soc_target": "código SOC primário (ex: 17-2051 Civil Engineers)",
  "primary_category": "EB-1A | EB-1B | EB-1C | EB-2 NIW",
  "anchors": {
    "years_experience": "14+ (ou valor exato)",
    "current_role": "cargo atual com empresa + data início",
    "prior_role": "cargo anterior com empresa + período",
    "pe_channel_or_license": "ex: David Karins PE, FL License 34217",
    "jurisdiction_markers": ["FL", "GO-BR", ...]
  },
  "prong_1_or_criterion_anchors": [
    "ARTBA 373B (deficit infraestrutura EUA)",
    "IIJA 40B (investimento federal)",
    "FEMA 11:1 (multiplier)"
  ],
  "prong_2_or_track_record_anchors": [
    "ART 10-dígitos registradas por ano",
    "Publicações em peer-reviewed (PTI Journal Vol. 13)",
    "Projetos marco: Complexo Trabalhista Goiânia 2016"
  ],
  "prong_3_or_exclusivity_anchors": [
    "Parceria exclusiva L09 (Hirata) — transfer of know-how",
    "JV L10 (Karins) — signing authority",
    "Seed capital L11 (family office) — US$ 50,000"
  ],
  "hard_numbers": {
    "RBP Construtora faturamento 2024": "[VERIFICAR: R$]",
    "projetos assinados 2015-2025": "[VERIFICAR: N]",
    "colaboradores no pico": "90"
  }
}
```

**17.2 Declaração obrigatória em cada carta** — Cada âncora de `anchors.*` (obrigatórias) deve aparecer DECLARADA (literalmente ou em paráfrase rastreável) em **pelo menos 70% das cartas do batch**.

Exemplo: se o MASTER_FACTS diz `years_experience: "14+"`, então "14+ anos" (ou "14 anos de prática", ou "mais de 14 anos") deve aparecer em ≥ 0.7 × N cartas. Se N=11, em ≥ 8 cartas.

**17.3 Validação cruzada (Verificação 9 do Passo 7):** após gerar o batch inteiro, rodar script (ou manualmente) que conta, para cada âncora, em quantas cartas ela aparece. Relatório obrigatório:

```
MASTER_FACTS CROSS-LETTER VALIDATION
[OK]  years_experience "14+"        → 9/11 cartas ≥70% threshold
[OK]  pe_channel "FL License 34217" → 7/11 cartas (relevante só em cartas US) ≥5/7 US letters
[!!]  current_role "Karins Sr PM"   → 5/11 cartas — abaixo do threshold, revisar
```

**17.4 Exceções admitidas:**
- Cartas em PT-BR de pessoas que não conhecem a atuação US do peticionário não precisam declarar `pe_channel_or_license`
- Cartas acadêmicas de expert opinion podem se concentrar em `prong_2_anchors` e omitir `prong_1_anchors`
- Todas as exceções devem ser documentadas no MASTER_FACTS.json em campo `exceptions_by_letter`

---

### 18. 🆕 HARD_BLOCKs por SOC Code (RULE #18 — V4)

**Origem:** Cowork Ricardo, HARD BLOCKS — termos que disparam RFE automático são específicos do SOC code. Lista universal (RULE #1) cobre termos imigratórios; RULE #18 cobre termos do CAMPO PROFISSIONAL que sinalizam SOC errado ao VIBE/USCIS.

**Problema que resolve:** SOC 17-2051 (Civil Engineers) tem RFE trigger em "advisory/consulting" porque esse vocabulário é próprio de SOC 13-1111 (Management Analysts) — SOC errado = RFE imediato. Cada SOC tem seu próprio léxico proibido.

**TABELA LOOKUP — HARD_BLOCKs por SOC (inicial; expandir conforme casos):**

**SOC 17-2051 — Civil Engineers** (caso Ricardo):
| Token | Idioma | Motivo | Substituto |
|---|---|---|---|
| `advisory` | EN (service desc) | Sugere SOC 13-1111 | "engineering engagement" / "specialty structural scope" |
| `consulting` | EN (service desc) | Idem | "engineering engagement" |
| `sub-consulting` | EN | Idem | "specialty engineering subcontract" |
| `consultoria` | PT (role desc, não razão social) | Idem | "engenharia técnica" |
| `assessoria` | PT (role desc) | Idem | "engenharia técnica" / "atuação estrutural" |
| `padronizado` | PT | Sugere processo não-especialista | "sistematizado", "metodológico", "reprodutível" |
| `turnkey` | EN | Contractor-style, fora de SOC | Omitir ou "engineering + O&M support" |
| `autossuficiente` | PT | Sugere SOC não-expert | "autonomous" + domínio específico |

**SOC 11-9021 — Construction Managers** (caso Ricardo Augusto — alternativo):
| Token | Idioma | Motivo | Substituto |
|---|---|---|---|
| `advisory` | EN | Sugere SOC 13-1111 | "construction management engagement" |
| `consulting` | EN | Idem | "construction management services" |
| `first-line supervisor` | EN | Disqualifier para EB-1C leadership | "project executive" / "senior PM" |

**SOC 13-2011 — Accountants and Auditors** (caso Contador — RULE #23):
| Token | Idioma | Motivo | Substituto |
|---|---|---|---|
| `bookkeeping only` | EN | Sub-classifica SOC | "integrated accounting responsibility" |
| `advisory` | EN | SOC 13-1111 | "technical accounting assurance" |
| `financial planning` | EN (isolado) | SOC 13-2052 (financial analysts) | "financial reporting and compliance" |

**SOC 15-1252 — Software Developers** (placeholder, expandir quando houver caso):
- `coder`, `programmer` isolados (preferir "software engineer")
- `coding bootcamp` (preferir "software engineering")
- `freelancer` / `contractor` (preferir "engineering consultant")

**SOC 15-1221 — Data Scientists** (placeholder):
- `analyst` isolado (preferir "data scientist" / "applied scientist")
- `reporting` isolado (preferir "analytics and modeling")

**OUTROS SOCs:** o operador deve consultar o documento `HARD_BLOCKS_por_SOC.md` da pasta de referências (a criar), ou o relatório RAG 1 (critérios AAO por SOC), para identificar triggers específicos.

**Protocolo de aplicação:**
1. Identificar `soc_target` do MASTER_FACTS (RULE #17)
2. Carregar lista de HARD_BLOCKs do SOC correspondente
3. Adicionar aos proibidos da RULE #1 para o batch
4. Passar o scrub automaticamente em cada carta gerada
5. Manter lista universal da RULE #1 SEMPRE ativa (HARD_BLOCKs por SOC é ACRÉSCIMO, não substituição)

---

### 19. 🆕 Regex Suite Anti-GPT (23 Anti-Padrões) (RULE #19 — V4)

**Origem:** Cowork Ricardo, Categoria H (H1-H15) + 23 anti-padrões listados. Padrões estilísticos característicos de texto gerado por modelos de linguagem em 2024-2026. Distinct de RULE #1 (HARD BLOCKs imigratórios) — esses aqui são TELLS DE IA, não termos proibidos de imigração.

**Aplicação:** após gerar cada carta, rodar regex suite. Flags bloqueiam finalização até correção.

**Tabela Completa:**

| # | Anti-padrão | Regex (Python flavor) | Substituto / ação |
|---|---|---|---|
| H1 | "In today's rapidly evolving..." | `^\s*(In today'?s|In our current|In an era of)\b` | Identificação institucional específica |
| H2 | Tripartite "X, Y, and Z" | `\b(\w+),\s+(\w+),\s+and\s+(\w+)\b` (freq > 2/página) | Prosa com nexo causal explícito |
| H3 | "widely recognized as..." | `\b(widely recognized|well-known as|renowned for)\b` | Fato específico com número (ART #, DOI, etc.) |
| H4 | "leverage" como verbo | `\bleverag\w+\b` | "apply", "mobilize", "bring to bear", "aplicar" |
| H5 | "navigate" metafórico | `\bnavigat\w+\b` (contexto não-físico) | "comply with", "meet", "cumprir" |
| H6 | "robust, cutting-edge, state-of-the-art" | `\b(robust|cutting-edge|state-of-the-art|world-class)\b` | Norma específica (ACI 318, PTI Vol. 13, NBR 6118) |
| H7 | "It is important to note that..." | `^\s*(It is important to note|It should be noted|Note that)` | Cortar inteiro |
| H8 | "dive deep / delve into / unpack" | `\b(dive deep|delve into|unpack|explore in depth)\b` | "examine", "review", "examinar", "rever" |
| H9 | "demonstrates conclusively that..." | `\b(conclusively|definitively|incontrovertibly|irrefutably)\b` | "provides direct evidence of", "supports" |
| H10 | "unique ability / one-of-a-kind / sole" | `\b(unique ability|one-of-a-kind|sole provider|sole expert)\b` | Capability específica |
| H11 | "As an experienced engineer..." | `^\s*As an?\s+(experienced|seasoned|accomplished)\s+\w+` | Identificação específica com credencial |
| H12 | Em-dash abusivo | `count("—") / page > 4` | Reduzir, máx 4 por página |
| H13 | Colon rhetorical | `[A-Z][^.!?]+:\s+[a-z]` (padrão "Topic: we need change") | Reestruturar para prosa direta |
| H14 | Moreover/Furthermore/Additionally iniciando parágrafo | `^\s*(Moreover|Furthermore|Additionally|In addition)\b` | Nova sentença sem conector |
| H15 | Bullet lists em carta formal | count de linhas iniciando `•` ou `-` em carta formal > 0 (exceto Annex enumeration) | Converter em prosa/tabela |
| 16 | "a testament to his/her..." | `\b(a testament to|a testimony to)\b` | Dado específico (métrica, publicação) |
| 17 | "honor to write / privilege to recommend" | `\b(honor to write|privilege to recommend|my distinct pleasure)\b` | Voz pessoal do signatário |
| 18 | "In conclusion / In summary / To summarize" | `^\s*(In conclusion|In summary|To summarize|In closing)\b` | Frase declarativa direta |
| 19 | "we are extremely excited / thrilled / delighted" | `\b(extremely excited|thrilled to|delighted to|enthusiastic about)\b` | "we propose", "we intend" |
| 20 | "strategic partnership" sem escopo | `\bstrategic partnership\b` sem follow-up com %/forma na mesma sentença | Obrigar spec: "strategic partnership involving X% allocation in Y area" |
| 21 | "synergies / synergistic" | `\bsynerg\w+\b` | "complementarity", "joint capability" |
| 22 | "landscape / ecosystem / paradigm" metafórico | `\b(landscape|ecosystem|paradigm)\b` (contexto não-técnico-literal) | Nome técnico específico do setor |
| 23 | "we remain at your disposal for any questions" | `\bremain at your disposal\b` | Proposta operacional concreta (próxima ação específica) |

**Casos limítrofes (não flag):**
- H15 NÃO flaga bullets em seção "Annex I — ... : ..." (exigida por RULE #15)
- H2 (tripartite) NÃO flaga listas genuínas de ≥4 itens (isso é enumeration técnica, não GPT-tell)
- H6 NÃO flaga termos em contexto de citação DE TERCEIRO ("the ASCE described it as 'robust'") — só flaga na voz direta do autor

**Enforcement (Verificação 10 do Passo 7):** rodar regex suite completa; relatório:
```
REGEX SUITE ANTI-GPT — CARTA 03 (Carlos Eduardo)
  [OK] H1, H2, H3, H4... H5 (navigate: 1 ocorrência — FLAG)
  [!!] H6 (robust: 2 ocorrências — FLAG)
  [OK] H7-H23
Result: 3 flags — CORRIGIR antes de finalizar.
```

---

### 20. 🆕 Anti-ATLAS Validator Automatizado (RULE #20 — V4)

**Origem:** Cowork Ricardo, Categoria A (A1-A8) — 8 regras de heterogeneidade visual anti-ATLAS com métricas objetivas.

**Problema que resolve:** RULE #3 e #14 dão DIRETRIZES de heterogeneidade visual e estrutural. RULE #20 dá o CHECK ATÔMICO — um validador comparativo que detecta clusters visuais antes do envio.

**Métricas auditadas (por batch de N cartas):**

**20.1 `header_geometry_hash`** — Hash simplificado da geometria do cabeçalho (posição do logo, alinhamento, presença de letterhead). Cada carta deve ter hash distinto. Aceita até ⌈N/4⌉ cartas com hash igual.

**20.2 `date_position`** — Posição da data. Opções: `top-left`, `top-right`, `body-para-1`, `closing`, `inside-preamble`. No batch, **data NUNCA deve ficar sempre no topo**. Distribuição mínima: 3 posições distintas em N≥6.

**20.3 `font_family`** — Fonte principal. Em N=6, pelo menos 5 fontes distintas (V3 catálogo F01-F20).

**20.4 `table_count`** — Número de tabelas por carta. Distribuição recomendada: `[0, 0, 1, 1, 2, 3+]` para N=6 (nem todas iguais, nem todas com tabela, nem todas sem).

**20.5 `length_distribution`** — Número de páginas. Distribuição: pelo menos 3 faixas (`1-2pp`, `3-4pp`, `5+pp`).

**20.6 `logo_presence`** — Logo presente vs ausente. Se N≥4, pelo menos uma carta sem logo (placeholder `[Company Logo]`).

**20.7 `signature_block_type`** — Tipo de bloco de assinatura (S1-S10 catálogo). Distinto em cada carta quando N≤10.

**20.8 `color_primary_hash`** — Hash da cor primária (RGB). Nenhuma repetição.

**ATLAS_SIMILARITY_SCORE:**
```
score = 0
para cada métrica acima:
    se violação do spec → score += peso (peso variando 0.5 a 2.0 dependendo de criticidade visual)
threshold: ATLAS_SIMILARITY_SCORE > 3.0 → BLOQUEIA entrega do batch
```

**Protocolo (Verificação 5 do Passo 7 expandida):**
1. Extrair metadata de cada `.docx` do batch (fontes, cores, tabelas, headers, datas)
2. Computar cada métrica 20.1-20.8
3. Gerar relatório:
```
ANTI-ATLAS VALIDATOR — BATCH RICARDO (6 satellite letters)
  20.1 header_geometry:   6/6 distintos  [OK]
  20.2 date_position:     2 posições (top-left 4x, body 2x) [!! — usar pelo menos 3]
  20.3 font_family:       5 fontes distintas (Constantia, Calibri, Verdana, Trebuchet, Rockwell x2) [!! — Rockwell repete]
  20.4 table_count:       [0, 1, 1, 2, 3, 3] [OK]
  20.5 length:            3 faixas [OK]
  20.6 logo_presence:     5 com, 1 sem [OK]
  20.7 signature_block:   S3, S6, S5, S4, S2, S3 [!! — S3 repete]
  20.8 color_hash:        6 distintos [OK]

ATLAS_SIMILARITY_SCORE: 2.5 (≤ 3.0)
Veredicto: APROVADO com avisos — considerar substituir Rockwell+S3 repetidos.
```

---

### 21. 🆕 Adversarial Auditor Consolidado — 8 Critérios (RULE #21 — V4)

**Origem:** Cowork Ricardo identificou 53 issues via auditoria manual adversarial na v3 do batch Ricardo (APÊNDICE contador faltando, envelope USD ausente no L11, "14+ anos" ausente em 11 cartas, etc.). RULE #21 formaliza esse processo como gate automático.

**Problema que resolve:** V3.1 tem Verificações 1-7 no Passo 7, mas não tem um AUDITOR ADVERSARIAL independente que simule o olhar crítico do adjudicador USCIS + advogado de oposição. RULE #21 é esse auditor.

**8 CRITÉRIOS OBRIGATÓRIOS (adversarial gate):**

**21.1 `placeholder_count == 0`** — Nenhum `[VERIFICAR:...]`, `[TODO]`, `[XXX]`, `[FILL IN]` no texto final. Exceção: placeholders intencionais documentados (ex: data a ser preenchida pelo signatário na hora de assinar) são permitidos desde que listados explicitamente no relatório.

**21.2 `hard_block_count == 0`** — Zero ocorrências de RULE #1 (lista universal) OU RULE #18 (por SOC).

**21.3 `forbidden_vocab_count == 0`** — Zero ocorrências de vocabulário imigratório extendido: `dhanasar`, `eb-1`, `eb-2`, `niw`, `uscis`, `visa`, `visto`, `petition`, `petição`, `green card`, `waiver`, `i-140`, `extraordinary ability`, `outstanding researcher`, `kazarian`, `national interest`, `priority date`, `advance parole`, `EAD`.

**21.4 `fact_consistency_matrix`** — Cross-check contra MASTER_FACTS.json (RULE #17). Cada âncora obrigatória deve aparecer em ≥70% das cartas aplicáveis. Relatório dito em RULE #17.3.

**21.5 `prong_coverage_heuristic`** — Para EB-2 NIW, contagem de keywords de Prong 1 (mercado, importância nacional, escala), Prong 2 (track record, ARTs, publicações), Prong 3 (exclusividade, waiver implícito) por carta. Nenhuma carta pode ser "prong-orphan" (sem nenhum keyword de nenhum prong). Para EB-1, análogo com os 10 critérios (cada carta endereça ≥1 critério).

**21.6 `signature_completeness`** — Toda carta tem signature block completo: nome, cargo, empresa, credencial (CRC, CREA, PE, PhD, etc.), meio de contato (email OU telefone). Nenhum signatário com campo ausente.

**21.7 `atlas_similarity_score ≤ 3.0`** — Resultado do validador RULE #20. Se > 3.0, bloqueia.

**21.8 `docstring_consistency`** — Formatação por tipo de carta segue RULE #15 + expectativas por tipo (RULE #7 expandida com Tipo 7):
- Testemunho BR: ID table ao final obrigatória
- Testemunho US: FL License (ou equivalente) no corpo
- Cliente futuro: gatilho regulatório US citado
- Parceiro US: estrutura WHEREAS/ARTICLE
- Investidor: allocation table + envelope USD explícito
- Contador: APÊNDICE legal com 4 citações (RULE #23)
- Cada tipo tem checklist próprio.

**Decisão do gate:**
```
CRITICAL = 21.1 | 21.2 | 21.3  (placeholder/hard-block/forbidden)
MAJOR    = 21.4 | 21.6 | 21.8  (fact/signature/docstring)
MINOR    = 21.5 | 21.7          (prong/atlas)

Se CRITICAL > 0 → BLOQUEADO — corrigir e re-auditar
Se MAJOR > 2   → BLOQUEADO — corrigir
Se MAJOR ≤ 2 e MINOR qualquer → liberação condicional com relatório de observações
Se tudo OK → APROVADO
```

**Relatório padrão do auditor (markdown):**
```markdown
# ADVERSARIAL AUDITOR REPORT — [caso] — v[N]
Data: [timestamp]
Batch: [N] cartas

## Critérios
- [OK/!!]  21.1 placeholder_count: [valor]
- [OK/!!]  21.2 hard_block_count: [valor]
- [OK/!!]  21.3 forbidden_vocab: [valor]
- [OK/!!]  21.4 fact_consistency: [breakdown por âncora]
- [OK/!!]  21.5 prong_coverage: [breakdown por carta]
- [OK/!!]  21.6 signature_completeness: [cartas com falha]
- [OK/!!]  21.7 atlas_similarity: [score]
- [OK/!!]  21.8 docstring_consistency: [violações por tipo]

## Veredicto
[APROVADO | BLOQUEADO]

## Ações de correção (se BLOQUEADO)
1. ...
2. ...
```

---

### 22. 🆕 Final-Pass Cycle Formal (v → v+0.1) (RULE #22 — V4)

**Origem:** Cowork Ricardo observou que v3 → v4 → v4.1 foram ciclos SEMPRE necessários, nunca "opcionais". O último pulido descobre itens que só aparecem quando o documento está quase pronto.

**Problema que resolve:** V3.1 já tem Passo 7 (validação) mas não separa "final-pass" (último ajuste). Na prática, o último pulido é um ciclo distinto com checklist diferente.

**PROTOCOLO — Final-Pass Cycle:**

Após bater todos os critérios da RULE #21 (APROVADO), aplicar um **Final-Pass Checklist dedicado** antes da entrega final:

**22.1 Checklist Final-Pass (todos os tipos):**
- [ ] Data no topo da carta SORTEADA entre opções válidas (não sempre top-left)
- [ ] "Page X of Y" presente SOMENTE se `paragraph_count >= 25`
- [ ] Fontes-âncora do MASTER_FACTS declaradas em ≥70% (revalidar)
- [ ] Pelo menos 1 "autobiographical fragment" por carta (RULE #16.C7)
- [ ] Signature_verb (RULE #16.C1) presente em momento-chave
- [ ] Zero bullets em cartas formais (exceto Annex) (RULE #19.H15)

**22.2 Checklist específico por tipo:**
- **Declaração de Contador:** APÊNDICE legal com 4 citações (CC Art. 1.179, CC Art. 1.180, NBC TP 01, Decreto-Lei 9.295/1946 Art. 25) — obrigatório (RULE #23)
- **Investidor (L11):** envelope USD explícito (não "adequate funding", mas "US$ 50,000" ou valor específico); allocation table por vertical presente
- **Cliente Futuro (L06-L08):** gatilho regulatório US citado (SB 4-D / LL 126 / NBIS / FDOT / IIJA / FEMA — conforme setor)
- **Parceiro US (L10):** WHEREAS/ARTICLE structure completa (≥3 WHEREAS + ≥5 ARTICLES + IN WITNESS WHEREOF)
- **Parceiro PT (L09):** reafirmação de trajetória comum + cláusulas operacionais (%, forma jurídica) + assinaturas paralelas
- **Testemunho BR:** ID table no fechamento (CREA, empresa, email, telefone)
- **Testemunho US:** PE License (FL / CA / NY) explícita no corpo
- **Expert Opinion:** declaração de independência explícita ("I have not collaborated directly with...")
- **Recomendação:** endosso técnico (RULE #13) presente em ≥1 parágrafo

**22.3 Sign-off Record:**
Final-Pass Cycle gera um registro `FINAL_PASS_SIGNOFF_[caso].md` com todos os checklist items marcados. Arquivo fica arquivado com o batch como trilha de auditoria.

---

### 23. 🆕 Tipo 7 — Declaração de Contador com APÊNDICE Legal (RULE #23 — V4)

**Origem:** Cowork Ricardo, Seção 5, Template 5. Na v4 do Ricardo, a Declaração de Contador apareceu como gap crítico — o APÊNDICE com 4 citações legais literais NÃO existia e teve que ser adicionado no ciclo v4→v4.1.

**Problema que resolve:** declaração de contador é testemunha técnica específica (Prong 2 via faturamento/patrimônio documentado) com obrigações regulatórias PT-BR próprias. V3.1 não tinha essa tipologia formalizada.

**QUEM ESCREVE:** Contador registrado no CRC de Estado brasileiro, responsável pela escrituração contábil da sociedade do peticionário.

**QUANDO INCLUIR:** casos com sociedade brasileira formalmente contabilizada (Ltda, S.A., EIRELI, SLP). Especialmente forte em Prong 2 de EB-2 NIW quando o peticionário foi CEO/sócio.

**ESTRUTURA DA CARTA — 5 SEÇÕES + APÊNDICE:**

**Seção 1. Identificação Profissional e Escopo**
- Nome completo do contador + CRC/UF + número/categoria (ex: CRC/GO 006553/O-6)
- Endereço profissional completo
- Período de responsabilidade técnica pela sociedade (datas exatas, não "vários anos")
- Identificação da sociedade: razão social + CNPJ + sede

**Seção 2. Natureza da Atuação e Conformidade Normativa**
- Escopo dos serviços: escrituração, balanços, tributos, obrigações acessórias
- Declaração de conformidade com CC Art. 1.179, Art. 1.180, NBC TP 01, Decreto-Lei 9.295/1946
- Regularidade da escrituração (mecanizada ou não, prazo legal, assinatura do administrador)

**Seção 3. Dados Econômico-Financeiros Consolidados**
- Quadro resumo (tabela) com: exercício | faturamento anual | patrimônio líquido | número de colaboradores
- Série histórica completa do período de responsabilidade
- Moeda: reais brasileiros (R$) com indicação de exercício encerrado vs parcial

**Seção 4. Observações Profissionais**
- Regularidade fiscal, tempestividade de recolhimentos
- Fidedignidade dos demonstrativos
- SEM juízo de valor sobre mérito profissional do administrador (FORBIDDEN Cat 0)
- Voz 1ª pessoa do contador; nunca 3ª pessoa sobre o peticionário (FORBIDDEN Cat 2)

**Seção 5. Fechamento Formal**
- "Por ser expressão da verdade, firmo a presente declaração..."
- Data, local
- Assinatura + CRC visível no fechamento

**APÊNDICE LEGAL — FUNDAMENTAÇÃO NORMATIVA (OBRIGATÓRIO — diferencial do Tipo 7):**

Após o fechamento, bloco separado com **4 citações literais** na íntegra. Formato visual: borda dupla em dourado ou cinza-escuro, fundo cinza muito claro `#F4F4F4`, título "APÊNDICE LEGAL — FUNDAMENTAÇÃO NORMATIVA" centrado.

**I. Código Civil (Lei nº 10.406, de 10 de janeiro de 2002) — Art. 1.179** — texto literal
**II. Código Civil (Lei nº 10.406, de 10 de janeiro de 2002) — Art. 1.180** — texto literal
**III. NBC TP 01 — Estrutura Conceitual** — trecho estrutural pertinente
**IV. Decreto-Lei nº 9.295, de 27 de maio de 1946 — Art. 25** — texto literal

(Conteúdo literal dos 4 artigos disponível no script de geração `generate_satellite_accountant_[caso].py`.)

**VISUAL_ID do Tipo 7** — distinto dos outros 6 tipos:
- Fonte: **Times New Roman** (jurídico-contábil sóbrio)
- Paleta: cinza escuro `#2C3E50` + dourado muted `#B08D57`
- Estrutura de seções: **decimal (1. / 1.1 / 1.2)** + APÊNDICE LEGAL em bloco destacado
- Tabela única: financeira (horizontal-lines only, sem bordas laterais)

**Exemplo prático de implementação:** ver script `petition-engine/scripts/clients/generate_satellite_accountant_ricardo.py` — handler do caso Ricardo Augusto com 8 verificações automáticas (CRC visível, 4 citações literais, período exato, zero jargão imigratório, etc.).

**Checklist do Tipo 7 (adicionado à RULE #22 Final-Pass):**
- [ ] CRC visível no fechamento (regex `CRC/[A-Z]{2}\s*\d+/O-\d`)
- [ ] APÊNDICE com 4 citações literais numeradas (I-IV)
- [ ] Art. 1.179 citado com "escrituração uniforme"
- [ ] Art. 1.180 citado com "indispensável o Diário"
- [ ] NBC TP 01 citada com "reporting entity"
- [ ] Decreto-Lei 9.295/1946 Art. 25 citado com "trabalhos técnicos de contabilidade"
- [ ] Período com datas exatas (mínimo 2 anos distintos detectáveis)
- [ ] Zero jargão imigratório

---

## Workflow Completo

### Passo 0: LER RAGs (OBRIGATÓRIO — ver topo deste documento, incluindo RAG 5 das retrospectivas)

### Passo 0-B: CARREGAR MASTER_FACTS do caso (NOVO V4 — RULE #17)

Antes de qualquer outra ação, construir ou carregar `MASTER_FACTS.json` do caso. Sem MASTER_FACTS formalizado, RULE #17 não pode ser enforced e o batch será inconsistente.

### Passo 1: Intake — Coletar Dados do Caso

**OBRIGATÓRIOS:**
- [ ] Nome completo do peticionário
- [ ] Área de atuação / campo profissional
- [ ] **NOVO V4:** SOC code primário (determina HARD_BLOCKs por SOC — RULE #18)
- [ ] Empresa(s) do peticionário (nome, NAICS code se possível)
- [ ] Tipo de petição: EB-1A, EB-1B, EB-1C ou EB-2 NIW (se satélite)
- [ ] Critérios que pretende satisfazer (quais dos 10/6 ou 3 prongs)
- [ ] Lista de signatários (nome, cargo, empresa, relação com o peticionário, país de residência)
- [ ] Tipo de cada carta (recomendação, expert opinion, satélite, testemunho, attestação, intenção, contador)
- [ ] **NOVO V4:** MASTER_FACTS.json construído com anchors do caso (RULE #17)

**ALTAMENTE RECOMENDADOS:**
- [ ] Business plan ou catálogo de serviços (ou "Declaração de Intenção Futura" se EB-1A)
- [ ] CV com publicações, prêmios, citações, certificações
- [ ] Dados quantificáveis com estrutura baseline-meta-timeline (RULE #5 expandida V4)
- [ ] Cartas já geradas no batch (para garantir heterogeneidade)
- [ ] LinkedIn URLs dos recomendadores para verificação de credenciais (RULE #12)
- [ ] **NOVO V4:** Vocabulary bank setorial preliminar (RULE #9 expandida V4)
- [ ] **NOVO V4:** persona_bank[author_id] para cada signatário (RULE #16)

**SE NÃO FORNECIDOS — PESQUISAR:**
- Dados do setor para contextualizar métricas (usar web search)
- Benchmarks do campo para comparação (ver `references/metricas-e-nexos-causais.md`)
- Informações públicas sobre empresas signatárias
- LinkedIn profiles dos recomendadores

### Passo 2: Análise de Viabilidade dos Critérios

**Para EB-1A, aplicar o "Teste da Pílula Venenosa":**
1. Listar todos os critérios candidatos
2. Para cada critério, classificar a força da evidência: FORTE (documentação robusta + métricas), MÉDIO (evidência existe mas precisa de contexto), FRACO (evidência questionável ou comparação desfavorável)
3. **ELIMINAR critérios FRACOS** — especialmente o Critério 9 para candidatos de moedas fracas
4. Selecionar os 3-5 critérios mais fortes para a petição
5. Distribuir endereçamento dos critérios entre as cartas

> **Regra de ouro dos escritórios de elite:** É melhor ter 3 critérios blindados do que 5 critérios com 2 vulneráveis. Um critério fraco pode envenenar a percepção do oficial sobre TODO o caso durante o Step 2.

### Passo 3: Mapeamento Critérios × Cartas × Ângulos Únicos × Persona (EXPANDIDO V4)

Criar AGORA **CINCO** matrizes (V4 adiciona Matriz 5):

**Matriz 1 — Critérios por Carta** (ver V3.1, inalterada)
**Matriz 2 — Serviços por Carta** (ver V3.1, inalterada)
**Matriz 3 — Identidade Visual** (ver V3.1, inalterada)
**Matriz 4 — Ângulos Únicos + Heterogeneidade Estrutural** (ver V3.1, inalterada; cross-check com RULE #14 V4)

**Matriz 5 (NOVA V4) — Persona Engineering por Carta:**
```
| Carta | author_id       | signature_verb    | opening_variant       | register          | domain_lock         | sentence_dist      | pronoun |
|-------|-----------------|-------------------|----------------------|-------------------|---------------------|---------------------|---------|
| 01    | ademar_hirata   | "registre-se"     | "Atuo há 50+ anos..."| technical-forensic| pós-tração, reforço | long-enumerative    | I-dom   |
| 02    | carlos_rocha    | "emito o endosso" | "Formado em 2013..." | analytic-diagnostic| co-autoria PTI      | short-engineer      | I-dom   |
| 03    | karins_group    | "I hereby attest" | "As a Florida PE..." | terse-business-us | market US, IIJA     | terse-business-us   | we-inst |
| 04    | family_office   | "our allocation"  | "[Nome FO]'s thesis" | financial-analytic| PPM, TAM/SAM/SOM    | mixed-analytical    | we-inst |
| 05    | thiago_direct   | "testemunho"      | "Entre 2014-2017..." | personal-collegial| 2014-2017 window    | mixed-analytical    | I-dom   |
| 06    | marcos_accountant| "firmo"          | "Eu, Marcos V. M..." | ultra-formal-legal| CRC, escrituração   | short-engineer      | I-dom   |
```

**Regras de distribuição V4:**
- signature_verb único por autor (nunca repetido no batch)
- opening_variant único por autor (nem mesma variante usada em 2 cartas)
- emotional_register: máx 2 cartas com mesmo register
- domain_lock: específico e não-sobreposto entre autores
- sentence_dist: mín 3 distribuições diferentes em N≥6
- pronoun: "I-dom" em testemunho, "we-inst" em B2B e investidor

### Passo 4: Atribuir Identidade Visual

(Inalterado da V3.1 — ver catálogo `references/formatting-catalog-v3.md`.)

**NOVO V4 — Tipo 7 (Contador):** VISUAL_ID dedicado = Times New Roman + cinza/dourado + decimal + APÊNDICE legal. Ver RULE #23.

### Passo 5: Escrever a Carta

Aplicar na ordem:
1. RULE #12 (verificação de credenciais)
2. RULE #13 (endosso técnico presente)
3. **NOVO V4:** RULE #16 (persona engineering — signature_verb, opening, register)
4. **NOVO V4:** RULE #17 (MASTER_FACTS anchors declarados)
5. RULE #1 (sem termos imigratórios) + **RULE #18 V4** (sem HARD_BLOCKs do SOC)
6. RULE #5 (mín 4 métricas, com baseline-meta-timeline quando aplicável — V4)
7. RULE #6 (cadeias causais explícitas)
8. RULE #9 (heterogeneidade textual + **8 termos setoriais próprios** — V4)

**Para CADA parágrafo substantivo, aplicar o Teste dos 4 Ns:**
1. **NÚMERO** — Tem dado quantificável?
2. **NEXO** — A relação causa-efeito está explícita?
3. **NOTORIEDADE** — Está contextualizado vs. pares/mercado?
4. **NARRATIVA** — Contribui para "sustained acclaim"?

**Conteúdo por Tipo de Carta:** (inalterado da V3.1 para Tipos 1-6; adicionar Tipo 7 — ver RULE #23.)

---

## Protocolo Anti-Alucinação (V3, inalterado)

Baseado em 7 cartas de produção real, AI-generated letters comumente alucinam credenciais, certs, empregadores, títulos, anos de experiência, contagens de publicações, prêmios inexistentes.

**APÓS gerar cada carta, executar "Hallucination Scan":**

1. **Extração de Afirmações Factuais** — listar TODAS as afirmações sobre recomendador + métricas sobre peticionário
2. **Verificação Cruzada** — contra LinkedIn + CV + intake
3. **Reporte ao Operador** — 0 unverified OK; 1+ = CAUTION
4. **Ação** — corrigir alucinação clara; remover ou flagar inferência legítima não suportada

---

## Estratégia de Ângulos Únicos (V3, expandida V4 com Tipo 7)

**Ângulos únicos por categoria:**

**Supervisão/Liderança:** Supervisor direto · Líder de departamento · C-level
**Clientela/Impacto:** Cliente que recebeu serviços · Parceiro em joint venture · Fornecedor/vendor
**Conhecimento Técnico:** Expert independente · Pesquisador acadêmico · Executor técnico subordinado
**Mercado/Futuro:** Futuro empregador · Investor/Board · Concorrente direto
**Testemunha Documental (NOVO V4):** Contador responsável (CRC) · Auditor externo · Tabelião de documentos técnicos

**REGRA:** Em um batch de 5-6 cartas, mapear cada uma para um ângulo ÚNICO. Não repetir.

```
Exemplo de MAPA COMPLETO V4 (caso Ricardo 11 cartas):
01 — Ademar Hirata (Supervisor Direto + Engenheiro Sênior)
02 — Carlos Eduardo Rocha (Co-autor técnico — PTI Journal)
03 — Antônio Claret (Expert Independente Jurídico-técnico)
04 — Vito (Cliente que recebeu serviços — Cosmed)
05 — Thiago (Testemunha direta 2014-2017)
06 — HOA Florida (Futuro cliente — SB 4-D)
07 — Real Estate Broker FL (Futuro cliente — mercado)
08 — DOT General Contractor (Futuro cliente — IIJA/FEMA)
09 — Hirata Brasil (Parceiro estratégico — transfer know-how)
10 — Karins Engineering (JV — signing authority)
11 — Family Office (Investidor — seed)
[NOVO]— Marcos Valério Marra (Contador — testemunha documental)
```

---

## Passo 6: Gerar o .docx

Script Node.js com docx-js OU Python com python-docx. Ver `references/docx-code-patterns.md`.

**Regras técnicas (inalteradas V3):**
- US Letter: 12240 × 15840 DXA
- Margens: 1440 all sides (1 polegada)
- NUNCA `\n` em TextRun
- Cores hex SEM `#`
- Table cells: SEMPRE width + columnSpan
- Shading: SEMPRE `ShadingType.CLEAR`
- Bullets: `LevelFormat.BULLET`

**Convenção de nome:** `NN_NOME_SOBRENOME_Carta_[Recomendacao|ExpertOpinion|Satelite|Testemunho|Attestacao|IntencaoFutura|DeclaracaoContador].docx`

**NOVO V4:** Handlers Python consolidados em `petition-engine/scripts/clients/generate_satellite_letters_[caso].py` e `generate_satellite_accountant_[caso].py`. Cada handler carrega:
- `MASTER_FACTS.json` do caso (RULE #17)
- `persona_bank.json` do caso (RULE #16)
- `HARD_BLOCKs_SOC.json` do caso (RULE #18)
- Aplica `regex_suite_anti_gpt.py` após gerar (RULE #19)
- Invoca `atlas_validator.py` sobre o batch completo (RULE #20)

---

## Passo 7: Validar (EXPANDIDO V4 — Verificações 1 a 11)

**Verificação 1 — Técnica:**
```bash
python /mnt/.skills/skills/docx/scripts/office/validate.py <arquivo>
```

**Verificação 2 — Conteúdo (extrair texto e varrer):**
Scan de RULE #1 (lista universal de imigração) + **RULE #18 V4** (HARD_BLOCKs do SOC identificado).
```bash
pandoc <arquivo> -t plain > /tmp/carta_text.txt
grep -ci "consultoria\|assessoria\|imigração\|visto\|visa\|USCIS..." /tmp/carta_text.txt
grep -ci "$(cat HARD_BLOCKs_SOC.txt | paste -sd '|')" /tmp/carta_text.txt
```

**Verificação 3 — Qualidade** (inalterada V3.1)
**Verificação 4 — Credenciais** (V3 — ver RULE #12)
**Verificação 5 — Heterogeneidade Estrutural** (V3 — expandida V4 com Matriz 5)
**Verificação 6 — Scan de Alucinação** (V3 — ver Protocolo Anti-Alucinação)
**Verificação 7 — Anexos/Apêndices** (V3 — ver RULE #15)

**NOVO V4 — Verificação 8 — Persona Engineering Cross-Check**
- [ ] Para cada carta, signature_verb (RULE #16.C1) literal presente
- [ ] Opening corresponde a uma variante de `opening_template_variants` do persona_bank
- [ ] emotional_register detectado alinha com persona_bank.C3
- [ ] Nenhum julgamento fora de `expertise_domain_lock` (RULE #16.C4)
- [ ] Distribuição de sentence_length observada corresponde ao codificado em C5
- [ ] Pronoun dominante alinha com C6
- [ ] 1-2 fragmentos autobiográficos presentes (C7)

**NOVO V4 — Verificação 9 — MASTER_FACTS Cross-Letter**
- [ ] Cada âncora obrigatória de `MASTER_FACTS.anchors` aparece em ≥70% das cartas do batch (exceto exceções documentadas)
- [ ] Prong/critério anchors distribuídos de forma que nenhuma carta seja "prong-orphan"
- [ ] Hard numbers (faturamento, # projetos, anos) consistentes entre cartas

**NOVO V4 — Verificação 10 — Regex Suite Anti-GPT**
- [ ] Rodar as 23 regex (H1-H15 + 16-23) contra cada carta
- [ ] Zero flags, ou flags justificados em exceções (H15 em Annex, H6 em citação de terceiro)

**NOVO V4 — Verificação 11 — Anti-ATLAS Validator Score**
- [ ] Rodar validador RULE #20 no batch completo
- [ ] ATLAS_SIMILARITY_SCORE ≤ 3.0

---

## Passo 8: Ciclo Final-Pass (NOVO V4 — RULE #22)

Após Verificações 1-11 todas verdes, rodar o Final-Pass Checklist (RULE #22.1 + #22.2) e gerar FINAL_PASS_SIGNOFF_[caso].md.

Só após sign-off, o batch é considerado ENTREGÁVEL.

---

## Contexto USCIS 2026 — PARA O OPERADOR (nunca para as cartas)

(Inalterado V3.1 — ver bloco completo em SKILL_v3.md. Inclui: Cenário Bifurcado, Taxas de Aprovação, Efeito Hidráulico NIW→EB-1A, Mukherji v. Miller, RFEs Automatizados por IA, Flexibilizações 2024-2026, Triggers de RFE/Negação expandidos para 13 triggers V3, Estratégias de Escritórios de Elite, Divisão 40/60, Declaração de Intenção Futura.)

**NOVO V4 — Triggers de RFE/Negação adicionais (14-17):**

14. MASTER_FACTS anchors ausentes em ≥30% das cartas (inconsistência detectável)
15. HARD_BLOCKs por SOC presentes (vocabulário errado para o SOC declarado)
16. GPT-tells (regex suite #19) em >3 ocorrências por carta
17. ATLAS_SIMILARITY_SCORE > 3.0 (clustering visual detectável)

---

## Checklist Anti-Boilerplate + Anti-Alucinação (OBRIGATÓRIO antes de entregar batch) — EXPANDIDO V4

### Dimensão 1: Heterogeneidade Visual & Estrutural (RULES #3, #14, #20)
- [ ] Cada carta tem font family diferente
- [ ] Cada carta tem color scheme diferente
- [ ] Nenhuma carta compartilha estilo de header de seção
- [ ] "Próximos Passos" aparece em no máximo 1 carta
- [ ] Elementos estruturais distribuídos (RULE #14 thresholds)
- [ ] Formatos de documento variados
- [ ] Blocos de assinatura variam
- [ ] Comprimentos variam
- [ ] **NOVO V4:** ATLAS_SIMILARITY_SCORE ≤ 3.0 (RULE #20)

### Dimensão 2: Conteúdo & Argumentação (RULES #5, #6, #8, #9)
- [ ] Parágrafos de abertura usam estruturas diferentes
- [ ] Perplexidade textual alta + **8 termos setoriais por carta** (RULE #9 V4)
- [ ] Mínimo 4 dados quantificáveis por carta com fontes variadas
- [ ] **NOVO V4:** Quando aplicável, KPIs em formato baseline-meta-timeline (RULE #5 V4)
- [ ] Critério 5 (ou prong equivalente) endereçado em ≥70%
- [ ] Nenhum critério fraco incluído
- [ ] Reconhecimento SUSTENTADO demonstrado
- [ ] Zero termos proibidos RULE #1 + **zero HARD_BLOCKs SOC** (RULE #18 V4)

### Dimensão 3: Ângulos Únicos + Persona (RULES #7, #16)
- [ ] Cada carta com ângulo ÚNICO
- [ ] Nenhum ângulo repetido 2x no batch
- [ ] Mapear via Matriz 4
- [ ] **NOVO V4:** Matriz 5 (Persona Engineering) completa por carta
- [ ] **NOVO V4:** signature_verb, opening, register, domain_lock, sentence_dist, pronoun todos alinhados

### Dimensão 4: Credenciais & Anti-Alucinação (RULES #12, #13)
- [ ] Credenciais verificadas via LinkedIn/CV (RULE #12)
- [ ] Hallucination Scan executado (0 unverified)
- [ ] Endosso Técnico presente em cada carta (RULE #13)
- [ ] Nenhuma inferência não suportada

### Dimensão 5: Fact Consistency (RULE #17 — V4)
- [ ] MASTER_FACTS.json construído para o caso
- [ ] Cada âncora obrigatória aparece em ≥70% das cartas
- [ ] Hard numbers consistentes entre cartas
- [ ] Exceções documentadas

### Dimensão 6: Regex Anti-GPT (RULE #19 — V4)
- [ ] 23 regex rodadas; zero flags ou todos justificados
- [ ] Em-dash ≤4 por página
- [ ] Zero bullets em cartas formais (exceto Annex RULE #15)

### Dimensão 7: Adversarial Auditor + Final-Pass (RULES #21, #22 — V4)
- [ ] 8 critérios RULE #21 passados (CRITICAL=0, MAJOR≤2)
- [ ] Final-Pass Checklist (RULE #22) completo
- [ ] FINAL_PASS_SIGNOFF_[caso].md gerado e arquivado

### Dimensão 8: Conformidade Técnica
- [ ] validate.py passou
- [ ] Logos documentados (real ou placeholder)
- [ ] Nomes de arquivo seguem convenção

---

## Arquivos de Referência

- `references/formatting-catalog-v3.md` — Catálogo de fontes (F01-F20), headers (H1-H12), formatos (D1-D10), tabelas (T1-T10), assinaturas (S1-S10), pull-quote/value-prop blocks
- `references/docx-code-patterns.md` — Padrões Node.js/docx-js e Python/python-docx
- `references/metricas-e-nexos-causais.md` — Framework de métricas por área, cadeia causal templates, benchmarks, sinônimos
- `references/jurisprudencia-e-estrategia-2026.md` — Mukherji v. Miller, Gold Card, RFEs por IA, elite firms

**NOVO V4 — Referências adicionais:**
- `references/MASTER_FACTS_schema.json` — schema canônico (RULE #17)
- `references/HARD_BLOCKS_por_SOC.md` — lookup table (RULE #18) — expandir conforme casos
- `references/regex_suite_anti_gpt.py` — implementação Python das 23 regex (RULE #19)
- `references/atlas_validator.py` — implementação do validador comparativo (RULE #20)
- `references/persona_bank_examples/` — `persona_bank.json` do Ricardo e Mariana como templates
- `references/final_pass_checklist_template.md` — template FINAL_PASS_SIGNOFF
- `references/tipo_7_contador_exemplo/` — script de referência `generate_satellite_accountant_ricardo.py`

---

## Changelog V3.1 → V4.0 (Abril 2026)

### 8 Novas Regras Críticas
- **RULE #16 — Persona Engineering Explícito** — signature_verb + opening_variants + emotional_register + expertise_domain_lock + sentence_length_distribution + pronoun_distribution + autobiographical_fragments. Origem: Cowork Ricardo C1-C7.
- **RULE #17 — MASTER_FACTS Anchors Enforcement** — JSON schema + enforcement cross-letter ≥70%. Origem: Cowork Ricardo Seção 4 + gap "14+ anos ausente em 11 cartas v3 Ricardo".
- **RULE #18 — HARD_BLOCKs por SOC Code** — lookup table com 17-2051, 11-9021, 13-2011 inicial. Origem: Cowork Ricardo HARD BLOCKS.
- **RULE #19 — Regex Suite Anti-GPT** — 23 patterns estilísticos (H1-H15 + 16-23). Origem: Cowork Ricardo Categoria H + 23 anti-padrões.
- **RULE #20 — Anti-ATLAS Validator Automatizado** — 8 métricas comparativas com ATLAS_SIMILARITY_SCORE ≤3.0 threshold. Origem: Cowork Ricardo Categoria A.
- **RULE #21 — Adversarial Auditor Consolidado** — 8 critérios CRITICAL/MAJOR/MINOR. Origem: auditoria manual 53-issues v3 Ricardo.
- **RULE #22 — Final-Pass Cycle Formal** — checklist dedicado após RULE #21 passar + sign-off record. Origem: observação que v→v+0.1 sempre aparece na prática.
- **RULE #23 — Tipo 7 Declaração de Contador com APÊNDICE** — 4 citações literais obrigatórias + VISUAL_ID cinza/dourado/TNR. Origem: Cowork Ricardo Template 5 + gap v4→v4.1.

### Expansões a RULES Existentes
- **RULE #5 (métricas)** — adicionada estrutura baseline-meta-timeline quando aplicável (origem: Mariana v1 KPIs)
- **RULE #9 (perplexidade)** — adicionado mínimo 8 termos setoriais próprios por carta (origem: Mariana v1 vocabulary banks)
- **RULE #14 (heterogeneidade estrutural)** — formalizada como heading próprio (era subentendida em V3)
- **RULE #7 (tipos)** — expandido para 7 tipos (incluindo Declaração de Contador)

### Novas Verificações no Passo 7 (8, 9, 10, 11)
- Verificação 8: Persona Engineering Cross-Check
- Verificação 9: MASTER_FACTS Cross-Letter
- Verificação 10: Regex Suite Anti-GPT
- Verificação 11: Anti-ATLAS Validator Score

### Novo Passo 8: Ciclo Final-Pass (RULE #22) com sign-off obrigatório

### Matriz 5 (Persona Engineering) adicionada ao Passo 3

### RAG 5 adicionado ao Passo Zero (retrospectivas Cowork + Mariana)

### Triggers de RFE/Negação atualizados (+4: 14-17)

### Motivação
Duas retrospectivas de engenharia reversa retrospectiva sobre trabalho real aprovado:

**Cowork Ricardo (2026-04-17):** 57 regras invisíveis em 8 categorias (A-H), 23 anti-padrões IA com regex, 5 master prompts por tipo, 8 gaps críticos, taxonomia de 5 tipos de carta (testemunho L01-L05, cliente futuro L06-L08, parceiro estratégico L09-L10, investidor L11, contador). Auditoria adversarial manual capturou 53 issues na v3 que só foram visíveis em revisão cross-letter.

**Mariana Kasza (2026-04-05):** 20 regras em estrutura (heterogeneidade, KPIs, vocabulary, anti-patterns), 8 formatos distintos validados, convergence matrix (format × sector × tone), strength scoring 7-9.5/10 por carta, KPI structure baseline-meta-timeline, 5 critical success factors.

**Convergências validadas (8 regras ambos confirmam):** zero generic praise, market data com sources cited, heterogeneous formatting anti-ATLAS, sector-specific vocabulary per author, authentic signatory voice, Dhanasar/prongs implícitos nunca explícitos, multiple signatories com distinct personas, KPI com baseline-meta-timeline.

### Retrocompatibilidade
**V4 é SUPERCONJUNTO PURO de V3.1:** Todas as regras #1-#15, workflows, frameworks, catálogos V3.1 permanecem INTACTOS. V4 ADICIONA (nunca substitui). Código/scripts que funcionam em V3.1 continuam funcionando em V4 — apenas ganham novas verificações opcionais até serem retrofitted para enforce das RULES #16-#23.

### Caminho de adoção progressiva (para casos em andamento em V3.1)
- **Fase 1 (hoje):** Adotar RULE #17 (MASTER_FACTS.json) — maior ROI, menor esforço
- **Fase 2:** Adotar RULE #18 (HARD_BLOCKs por SOC) — ajuste na lista proibida por caso
- **Fase 3:** Adotar RULE #19 (Regex Suite Anti-GPT) — validação automatizada
- **Fase 4:** Adotar RULE #16 (Persona Engineering) + Matriz 5 — mais trabalhoso, maior impacto anti-ATLAS
- **Fase 5:** Adotar RULE #20 (Anti-ATLAS Validator) — script dedicado
- **Fase 6:** Adotar RULE #21 (Adversarial Auditor) — gate formal
- **Fase 7:** Adotar RULE #22 (Final-Pass Cycle) — sign-off
- **Fase 8:** Adotar RULE #23 (Tipo 7 Contador) — casos com sociedade BR contabilizada

---

**Version:** 4.0 (2026-04)
**Last Updated:** 18 de abril de 2026
**Status:** Production Ready — Superconjunto da V3.1 com 8 novas regras críticas
**Origem dos aprendizados V4:** Retrospectiva Cowork Ricardo (11 cartas EB-2 NIW) + Engenharia Reversa Mariana Kasza v1 (11 docs em 8 formatos)
