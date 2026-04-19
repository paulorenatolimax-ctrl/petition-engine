# DIAGNÓSTICO E AJUSTES CIRÚRGICOS — SISTEMA DE DECLARAÇÃO DE INTENÇÕES (COMO FUTURO)
## Prompts 0 a 5

---

## SÍNTESE DO DIAGNÓSTICO

O sistema de Declaração tem uma qualidade que o de Metodologia não tem: a bifurcação silenciosa EB-1/EB-2 NIW (com ou sem Business Plan). Isso é inteligente e bem executado. Porém, o sistema sofre de três problemas graves: (1) é excessivamente abstrato — produz documentos que soam como relatórios de consultoria genérica, não como planos de execução concretos, (2) ignora completamente o framework regulatório que deveria guiar silenciosamente a estrutura, e (3) tem sobreposição significativa entre prompts (especialmente P1 e P2, e P4 e P5).

---

## ACHADOS TRANSVERSAIS

*Os achados T1 a T5 do documento de Metodologia se aplicam integralmente aqui também (leitura exaustiva, anti-detecção, limite de métricas, formatação visual, cross-reference). Não repito.*

### T6. EXCESSO DE ABSTRAÇÃO INSTITUCIONAL

**Problema:** A linguagem obrigatória definida no Prompt 0 ("estrutura estratégica futura", "arcabouço técnico-organizacional", "plataforma institucional") é tão abstrata que produz documentos que não dizem nada concreto. O adjudicador precisa saber O QUE a pessoa vai fazer, ONDE, QUANDO e COM QUE RESULTADO MENSURÁVEL. A abstração é o oposto disso.

**Caso Renato:** A Declaration funcionou justamente porque foi concreta — nomes de cidades, números de locações, métricas de emprego, timelines com meses. Sem isso, seria vazio.

**Prescrição — reformular a seção "Linguagem obrigatória" do Prompt 0:**

```
### LINGUAGEM OBRIGATÓRIA

O texto deve usar linguagem CONCRETA e ESPECÍFICA:

BOM: "The enterprise will establish ten convenience retail locations
across five metropolitan areas — Boston, Orlando, Miami, Newark, and
New York City — creating 100-200 direct positions within 36 months."

RUIM: "A plataforma institucional projetará sua expansão operacional
através de um arcabouço técnico-organizacional multi-regional."

REGRA: Cada parágrafo do documento final DEVE conter pelo menos um
elemento concreto extraído dos documentos do cliente (número, local,
prazo, entidade, métrica, produto, serviço).

Se o cliente não forneceu dados concretos suficientes, usar linguagem
direcional específica em vez de abstrata:
- NÃO: "multiple institutional environments"
- SIM: "healthcare facilities, research institutions, and clinical
  practice settings across the Northeastern United States"
```

### T7. O SISTEMA NÃO GUIA SILENCIOSAMENTE PARA DHANASAR

**Problema:** O grande insight dos RAGs: o USCIS adjudica via Dhanasar (3 prongs). O sistema proíbe (corretamente) mencionar Dhanasar no texto. Mas não estrutura o conteúdo para MAPEAR silenciosamente os 3 prongs. Resultado: documentos que não respondem às perguntas que o adjudicador vai fazer.

**As 3 perguntas que o adjudicador faz (sem usar estes termos):**
1. O empreendimento tem mérito substancial e importância nacional?
2. O profissional está bem posicionado para executá-lo?
3. Seria benéfico dispensar a oferta de emprego?

**Prescrição — adicionar nota interna (que não aparece no output) ao Prompt 0:**

```
### ESTRUTURA SILENCIOSA DE COBERTURA (INSTRUÇÃO INTERNA)

O documento final deve, SEM MENCIONAR os termos abaixo, cobrir
organicamente:

COBERTURA A — "Por que este esforço importa"
- Escala do mercado ou setor
- Lacunas estruturais documentadas
- Impacto projetado que transcende o empreendimento individual
- Alinhamento com necessidades econômicas ou sociais amplas
→ Deve estar coberta nas seções 1-2 e na seção de relevância

COBERTURA B — "Por que ESTA pessoa é a pessoa certa"
- Convergência entre trajetória passada e execução futura
- Competências específicas que habilitam o esforço
- Validações de terceiros sobre a capacidade de execução
- Capital comprometido / recursos já mobilizados
→ Deve estar coberta na seção de convergência e validação

COBERTURA C — "Por que o mecanismo padrão não serve"
- Singularidade da combinação de competências
- Urgência temporal da implementação
- Natureza empreendedora que não se enquadra em emprego convencional
- Benefício público que seria perdido com atraso
→ Deve estar coberta na seção de relevância e urgência

VERIFICAÇÃO: Antes de finalizar, confirmar que as 3 coberturas
estão presentes. Se alguma estiver ausente, o documento está
estruturalmente incompleto.
```

### T8. SOBREPOSIÇÃO ENTRE PROMPTS

**Problema:** P1 (Execução) e P2 (Delimitação Estratégica) se sobrepõem substancialmente. Ambos falam de "como será executado", "processos centrais", "mecanismos operacionais." P4 (Relevância) e P5 (Auditoria Final) também têm sobreposição na parte de "impacto" e "convergência."

**Prescrição — redefinir fronteiras:**

```
FRONTEIRAS CLARAS:

P0: O QUE e POR QUÊ (tese + identidade + visão)
P1: O COMO operacional (pipeline + roadmap + métricas + governança)
P2: O ONDE e PARA QUEM (escopo técnico + ambientes + entregas + geografia)
P3: O COM QUEM (validação externa + LOIs + parcerias)
P4: O POR QUE AGORA (urgência + alinhamento com prioridades nacionais)
P5: VERIFICAÇÃO FINAL (auditoria + síntese executiva + compromissos)

REGRA DE OURO: Se o conteúdo já foi produzido em um prompt anterior,
o prompt posterior NÃO reproduz — apenas REFERENCIA em uma frase
e avança para sua camada analítica própria.
```

---

## ACHADOS ESPECÍFICOS POR PROMPT

---

## PROMPT 0 — Blueprint Estratégico

### 0F.1. "O passado pode ser mencionado de forma mínima" — Sem definição de "mínima"

**Caso Renato:** A Declaration tinha seções inteiras recontando a carreira. Conflitava com a Cover Letter e a Methodology.

**Prescrição:**

```
REGRA DE MENÇÃO AO PASSADO:

- Máximo 2 parágrafos de ancoragem no documento inteiro
- Nesses parágrafos: apenas referência sumária
  ("more than twenty years of progressive retail management
  experience, documented in the accompanying Methodology dossier")
- NUNCA recontar datas, cargos, empresas, métricas do passado
  em detalhe — isso pertence à Methodology
- O passado aparece como CREDENCIAL, não como NARRATIVA
```

### 0F.2. Falta seção de ANÁLISE DE MERCADO com dados concretos

**Problema:** O Prompt 0 futuro não exige dados de mercado. Mas o Prong 1 de Dhanasar exige "importância nacional" demonstrada com dados quantificáveis. Sem uma seção de mercado com números reais (tamanho do mercado, demografia, lacunas quantificadas), o documento falha na cobertura A.

**Prescrição — adicionar seção obrigatória:**

```
### Seção obrigatória: Contexto de Mercado e Oportunidade Estrutural

Baseado nos documentos do cliente (especialmente Business Plan):

- Tamanho do mercado (números absolutos quando disponíveis)
- Demografia da população-alvo
- Lacunas estruturais quantificadas
- Projeções de crescimento do setor
- Posicionamento da proposta dentro do mercado

Se Business Plan não estiver disponível, construir com base nos
documentos profissionais e no campo de atuação, usando linguagem
de análise setorial (não especulativa).
```

### 0F.3. Falta seção de LANDSCAPE COMPETITIVO

**Caso Renato:** A seção de Competitive Landscape (mainstream chains vs. ethnic independents vs. Mercado Express) foi uma das mais fortes da Declaration. O sistema deveria exigir isso.

**Prescrição — adicionar:**

```
### Seção obrigatória: Análise do Landscape Competitivo

Quando houver Business Plan:
- Mapear categorias existentes de concorrentes
- Identificar lacunas que nenhum concorrente preenche
- Posicionar o empreendimento no gap identificado
- Incluir tabela comparativa (mínimo 4 fatores × 3 categorias)

Quando não houver Business Plan:
- Mapear o estado da prática no campo de atuação
- Identificar o que profissionais convencionais fazem vs.
  o que o profissional propõe
- Demonstrar o diferencial sem linguagem de "produto"
```

---

## PROMPT 1 — Dossiê de Execução

### 1F.1. Roadmap 0-6-18-36 é bom mas falta MILESTONES VERIFICÁVEIS

**Problema:** O prompt define fases mas não exige marcos concretos com métricas. Resultado: fases genéricas que servem para qualquer pessoa.

**Prescrição — adicionar:**

```
Cada fase do roadmap DEVE incluir:
- 3-5 milestones concretos (não genéricos)
- Métrica de sucesso para cada milestone
- Entregável verificável (o que existirá no final que antes não existia)

Exemplo RUIM: "Consolidação das bases técnicas e alinhamento"
Exemplo BOM: "Completion of LLC registration, execution of commercial
lease for first two locations, onboarding of initial 25 employees,
establishment of supplier agreements with minimum 30 Brazilian food
importers, launch of digital ordering platform beta"
```

### 1F.2. Teoria de Mudança (seção 3) está correta mas o output é genérico

**Problema:** A cadeia causal (entradas → ações → produtos → efeitos → benefícios) é excelente conceitualmente mas o prompt não força dados concretos. Resultado: cadeias causais que parecem templates.

**Prescrição — adicionar:**

```
A cadeia causal NÃO pode usar linguagem genérica.
Cada elemento deve ser ESPECÍFICO ao caso:

RUIM: "Entradas: informações técnicas, bases documentais,
instrumentos metodológicos"

BOM: "Entradas: demographic analysis of Brazilian diaspora
populations across five metropolitan areas; import channel
mapping for 200+ Brazilian food products; proprietary supplier
evaluation scorecard across 12 performance dimensions"
```

---

## PROMPT 2 — Delimitação Estratégica

### 2F.1. Sobreposição com P1 — Fronteira mal definida

**Prescrição:** Ver T8 acima. A diferença deveria ser:
- P1 = COMO executa (processos, fases, métricas)
- P2 = ONDE e PARA QUEM (escopo, geografia, ecossistema, entregas)

### 2F.2. Seção 5 (Delimitação Geográfica) — Sem instrução de profundidade

**Caso Renato:** As melhores seções da Declaration tinham perfis individuais por cidade. O sistema deveria exigir isso.

**Prescrição:**

```
### Delimitação Geográfica

Quando o esforço futuro abranger múltiplas localidades:
- Descrever CADA localidade individualmente (2-3 frases cada)
- Explicar POR QUE cada localidade foi selecionada
- Identificar características únicas de cada mercado
- Incluir tabela com: Localidade | Vantagem-chave | Perfil demográfico

Não listar localidades de forma genérica.
Cada uma deve ter identidade própria no texto.
```

---

## PROMPT 3 — Validação Externa (LOIs/MOUs)

### 3F.1. LOIs/MOUs genéricas podem acionar ATLAS clustering

**Problema:** Se múltiplos clientes usam o mesmo sistema e as LOIs seguem o mesmo template, o ATLAS do USCIS pode agrupá-las como padrão suspeito.

**Prescrição — adicionar:**

```
### PROTOCOLO ANTI-PADRONIZAÇÃO DE LOIs

Cada LOI/MOU DEVE:
- Conter dados específicos do caso (nomes, localidades, setores)
- Usar estrutura de frases única (não seguir template fixo)
- Incluir detalhes operacionais que só fazem sentido para ESTE caso
- Variar a ordem das seções entre diferentes minutas

TESTE: Se duas LOIs de clientes diferentes parecerem
intercambiáveis trocando apenas nomes, ambas estão genéricas demais.
```

### 3F.2. Falta instrução sobre TIPOS de parceiros por cenário

**Prescrição:**

```
### Tipos de parceiros por cenário

Quando houver Business Plan (empreendimento):
- Fornecedores do setor
- Associações comerciais locais
- Câmaras de comércio
- Instituições comunitárias
- Provedores de tecnologia
- Parceiros logísticos

Quando não houver Business Plan (atuação profissional):
- Instituições de pesquisa
- Universidades
- Associações profissionais
- Centros de excelência
- Publicações setoriais
- Organizações de padrões técnicos
```

---

## PROMPT 4 — Relevância Estratégica e Urgência

### 4F.1. "Alinhamento com prioridades nacionais" sem guia concreto

**Problema:** O prompt pede alinhamento mas não guia sobre QUAIS prioridades. Os RAGs são explícitos: o USCIS quer ver conexão com políticas federais concretas (CET list, CHIPS Act, IRA, etc.). Para casos não-STEM, há equivalentes em food security, small business development, community economic vitality.

**Prescrição — adicionar:**

```
### Fontes de alinhamento com prioridades nacionais

O texto deve CONECTAR o esforço futuro a pelo menos 2 das seguintes
fontes de autoridade (quando aplicável ao caso):

PARA CASOS STEM:
- Critical and Emerging Technologies List (CET)
- CHIPS and Science Act
- Executive Orders sobre IA, biotech, etc.
- Prioridades de funding NSF/NIH/DOE
- Estratégia Nacional de Normas

PARA CASOS DE EMPREENDEDORISMO:
- Programas federais de small business development
- Prioridades de revitalização econômica (Opportunity Zones)
- Estratégias de food security e supply chain resilience
- Iniciativas de inclusão econômica de comunidades imigrantes
- Dados do Bureau of Labor Statistics sobre gaps de emprego

PARA CASOS DE ATUAÇÃO PROFISSIONAL:
- Relatórios setoriais sobre shortage de profissionais
- Políticas de saúde pública (para área médica)
- Prioridades de infraestrutura (para engenharia)
- Estratégias de competitividade industrial

A referência NÃO é jurídica — é TÉCNICA e INSTITUCIONAL.
O texto cita a política como contexto, não como argumento legal.
```

### 4F.2. "Consequências da não implementação" é arriscado

**Problema:** A seção F ("o que acontece se NÃO implementar") pode soar como coerção ou dramatização. O USCIS não responde bem a argumentos do tipo "se vocês negarem, será terrível."

**Prescrição — reformular:**

```
### Seção F — REFORMULAÇÃO

Em vez de "consequências negativas da não implementação":
→ Reescrever como "oportunidade temporal e custo de oportunidade"

O tom deve ser ANALÍTICO, não dramático:
- "The current convergence of demographic growth, supply chain
  maturation, and technology availability creates a time-limited
  implementation window"
- NÃO: "Without this project, communities will suffer"

O foco é na OPORTUNIDADE que existe AGORA, não no DESASTRE
que acontecerá sem a pessoa.
```

---

## PROMPT 5 — Dossiê Final

### 5F.1. Versão Executiva Final é a seção mais importante — e está subinstruída

**Problema:** A "Versão Executiva Final" (1-2 páginas) é o que o adjudicador provavelmente lê primeiro (ou às vezes o único que lê completamente). Mas o prompt dá apenas 7 bullets genéricos sobre o que incluir.

**Prescrição — reformular:**

```
### VERSÃO EXECUTIVA FINAL (Seção mais crítica do dossiê inteiro)

Esta seção SERÁ LIDA INTEGRALMENTE pelo tomador de decisão.
Ela deve funcionar como documento autossuficiente.

Estrutura obrigatória:
1. PRIMEIRO PARÁGRAFO: Quem é a pessoa e o que propõe (3-4 frases)
2. SEGUNDO PARÁGRAFO: Por que o empreendimento/atuação importa —
   dados de mercado, lacunas, escala (4-5 frases)
3. TERCEIRO PARÁGRAFO: Convergência — por que ESTA pessoa é
   singularmente posicionada, com 2-3 evidências concretas do passado
4. QUARTO PARÁGRAFO: Roadmap resumido — o que será feito em 12 e
   36 meses, com milestones verificáveis
5. QUINTO PARÁGRAFO: Impacto projetado — empregos, receita, benefício
   público, alcance geográfico (números)
6. SEXTO PARÁGRAFO: Validação — capital comprometido, parcerias
   formalizadas, apoio institucional

Cada parágrafo deve ter PELO MENOS UM número concreto.
A versão executiva NÃO pode exceder 2 páginas.
A versão executiva NÃO pode conter linguagem abstrata.
```

### 5F.2. RACI e Pipeline muito genéricos sem dados do cliente

**Prescrição:**

```
O Pipeline e RACI DEVEM ser construídos a partir dos dados do
Business Plan (quando disponível), não de templates genéricos.

Se o BP menciona 10 locações em 5 cidades em 36 meses:
- O pipeline deve refletir ESSAS locações e ESSAS cidades
- O RACI deve incluir funções específicas do empreendimento
- Os prazos devem coincidir com o BP

Se não houver BP:
- O pipeline deve refletir a atuação profissional específica
- As etapas devem corresponder a marcos reais da carreira projetada
```

---

## RESUMO DE PRIORIDADES (DECLARAÇÃO)

| Prioridade | Ajuste | Impacto |
|-----------|--------|---------|
| 🔴 CRÍTICA | T6 — Eliminar excesso de abstração | Transforma o doc de vazio para concreto |
| 🔴 CRÍTICA | T7 — Guia silencioso para Dhanasar | Garante cobertura dos 3 prongs |
| 🔴 CRÍTICA | 4F.1 — Alinhamento com prioridades nacionais concretas | Requisito de facto em 2026 |
| 🟠 ALTA | T8 — Resolver sobreposições P1/P2 e P4/P5 | Elimina repetição |
| 🟠 ALTA | 0F.2 — Seção obrigatória de mercado | Fornece dados que adjudicador exige |
| 🟠 ALTA | 5F.1 — Reformular versão executiva | É a seção que será efetivamente lida |
| 🟠 ALTA | 3F.1 — Anti-padronização de LOIs | Previne ATLAS clustering |
| 🟡 MÉDIA | 0F.1 — Definir "mínima" para menção ao passado | Previne repetição |
| 🟡 MÉDIA | 1F.1 — Milestones verificáveis no roadmap | Concretude |
| 🟡 MÉDIA | 0F.3 — Landscape competitivo obrigatório | Fortalece posicionamento |
| 🟡 MÉDIA | 4F.2 — Reformular "consequências da não implementação" | Evita tom dramático |
| 🟢 MENOR | 2F.2 — Profundidade geográfica | Melhora qualidade |

---

## VISÃO PANORÂMICA: SOBREPOSIÇÕES ENTRE OS DOIS SISTEMAS

| Conteúdo | Pertence a | NÃO deve aparecer em |
|----------|-----------|---------------------|
| Biografia/cronologia de carreira | Cover Letter + Methodology P0 | Declaration |
| Metodologia operacional (pilares) | Methodology P1 | Declaration (só referência) |
| Análise estratégica do passado | Methodology P2 | Declaration (só ancoragem) |
| Cartas de recomendação (passado) | Methodology P3 | Declaration |
| Mercado + oportunidade | Declaration P0 | Methodology |
| Roadmap operacional futuro | Declaration P1 | Methodology |
| LOIs e parcerias futuras | Declaration P3 | Methodology |
| Convergência passado→futuro | Declaration P4 | Methodology (só na conclusão) |
| Impacto nacional projetado | Declaration P4 | Methodology |
| Projeções financeiras | Business Plan | Nem Methodology nem Declaration em detalhe |

**REGRA ABSOLUTA:** Quando um conteúdo aparece em ambos os sistemas,
um tem a versão COMPLETA e o outro tem APENAS uma frase de referência
com "as documented in the accompanying [título do documento]."
