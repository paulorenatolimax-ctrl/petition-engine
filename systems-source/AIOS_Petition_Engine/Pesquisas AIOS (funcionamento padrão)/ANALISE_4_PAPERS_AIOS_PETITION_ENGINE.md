# Análise de 4 Papers de Pesquisa: Princípios Aplicáveis ao Petition Engine

**Data da análise:** 2026-04-06
**Contexto:** Extração de princípios arquiteturais e metodológicos de papers sobre AIOS e geração de texto com LLMs, aplicáveis à geração automatizada de documentos legais de imigração (résumés, cover letters, business plans).

---

## PAPER 1: AIOS: LLM Agent Operating System

**Título completo:** AIOS: LLM Agent Operating System
**Autores:** Kai Mei, Xi Zhu, Wujiang Xu, Mingyu Jin, Wenyue Hua, Zelong Li, Shuyuan Xu, Ruosong Ye, Yingqiang Ge, Yongfeng Zhang (Rutgers University)
**Publicado em:** COLM 2025
**Arquivo:** `420_AIOS_LLM_Agent_Operating_S.pdf` / `2403.16971v5.pdf` (mesma versão arXiv)

### Problema Central
Agentes baseados em LLM enfrentam desafios significativos de deployment relacionados a **gerenciamento de recursos**. O acesso irrestrito a LLMs e ferramentas leva a alocação ineficiente, vulnerabilidades de segurança e gargalos de concorrência. Frameworks existentes (Autogen, Langchain) usam trial-and-error ineficiente para chamadas LLM, degradando throughput quando múltiplos agentes competem por recursos limitados.

### Arquitetura (3 Camadas)

1. **Application Layer (Camada de Aplicação)**
   - Agentes (Travel Agent, Coding Agent, Narrative Agent, etc.) interagem via AIOS SDK
   - SDK abstrai complexidades do kernel, permitindo foco na lógica do agente
   - Suporta frameworks nativos e não-nativos (ReAct, Reflexion, Autogen, MetaGPT) via adapters

2. **Kernel Layer (Camada de Kernel) — o coração do AIOS**
   - **LLM Core(s):** Encapsula cada instância de LLM como um "core" (análogo a CPU cores). Interface unificada via `LLMAdapter` para múltiplos backends (OpenAI, Anthropic, Google, Groq, Bedrock, HuggingFace, vLLM, Ollama). Suporta Structured Output e Function Calling.
   - **Agent Scheduler:** Centraliza filas de todas as system calls. Implementa FIFO e Round Robin (RR). RR suportado por mecanismo de interrupção de contexto.
   - **Context Manager:** Snapshot e restauração de estados intermediários de geração LLM. Duas abordagens: text-based (para APIs fechadas) e logits-based (preserva árvore de busca). Permite suspender/retomar geração sem recomputar.
   - **Memory Manager:** Gerencia históricos de interação em RAM. Política de evição LRU-K (80% do limite). Operações CRUD atômicas, thread-safe.
   - **Storage Manager:** Persistência em disco + vector database (ChromaDB). Versionamento de arquivos com rollback. Busca semântica via `sto_retrieve`.
   - **Tool Manager:** Carregamento padronizado de ferramentas. Validação de parâmetros pré-execução via regex estrutural. Resolução de conflitos de acesso paralelo via hashmap.
   - **Access Manager:** Controle de privilégios por grupo. Intervenção do usuário para operações destrutivas.

3. **Hardware Layer:** CPU, GPU, memória, disco (abstração padrão OS).

### Resultados Experimentais Relevantes
- AIOS mantém ou **melhora** performance de agentes em benchmarks (HumanEval, MINT, GAIA, SWE-Bench-Lite)
- Até **2.1x mais rápido** em throughput (Reflexion no Llama-3.1-8b)
- Escalabilidade linear de 250 a 2000 agentes concorrentes
- Performance boosted por **prompt enhancement** (contexto estrutural adicional no wrapper LLM)

### Princípios Aplicáveis ao Petition Engine

| Princípio | Aplicação no Petition Engine |
|-----------|------------------------------|
| **Separação em camadas (Application/Kernel)** | Separar a lógica de cada tipo de documento (résumé, cover letter, BP) da infraestrutura de chamadas LLM. O "kernel" do Petition Engine gerencia filas, contexto e memória; os "agentes" focam na lógica de geração de cada seção. |
| **LLM Core como abstração** | O Petition Engine deve tratar diferentes LLMs (Claude, GPT, Gemini) como "cores" intercambiáveis via interface unificada. Permite trocar modelos por seção conforme custo/qualidade. |
| **Context Manager com snapshot/restore** | Para documentos longos (cover letters de 68K palavras), implementar snapshot de contexto entre seções. Se a geração da Seção 5 falhar, restaurar do ponto anterior sem regerir Seções 1-4. |
| **Memory Manager com LRU-K** | Manter em memória de trabalho as evidências e dados do cliente mais recentemente acessados. Evidências menos usadas vão para storage, recuperadas sob demanda. |
| **Storage Manager com versionamento** | Cada iteração de um documento gera uma versão. Rollback habilitado: se a V3 da cover letter degradar, reverter para V2. Histórico completo. |
| **Tool Manager com validação pré-execução** | Antes de chamar qualquer ferramenta (busca O*NET, consulta regulatória SBA, formatação DOCX), validar parâmetros via regex/schema. Previne erros cascateados. |
| **Prompt Enhancement no wrapper** | Embeber instruções estruturais (formato de saída, regras do critério USCIS, tom em 1ª pessoa) diretamente no wrapper LLM, não no prompt do agente. Melhora consistência. |
| **Scheduling Round Robin** | Quando processando múltiplos clientes simultaneamente, usar RR para distribuir recursos LLM de forma justa, evitando que um caso complexo monopolize. |
| **Access Control por privilégio** | Diferentes níveis de acesso: attorney (tudo), paralegal (edição limitada), cliente (somente leitura do próprio caso). |

### Lições Concretas
1. **Não dê acesso direto ao LLM.** Todo request deve passar por um scheduler centralizado com filas por módulo. Isso previne que a geração de um BP de 700 parágrafos bloqueie a geração de um résumé urgente.
2. **Abstraia o LLM como um "processador."** Assim como AIOS trata LLMs como CPU cores, o Petition Engine deve permitir que seções críticas (extraordinary ability claims) usem Claude Opus enquanto seções rotineiras (dados biográficos) usem modelos menores/mais baratos.
3. **Versionamento é obrigatório.** O Storage Manager do AIOS com rollback é essencial para documentos legais onde cada versão pode ter implicações jurídicas.

---

## PAPER 2: Self-Refine: Iterative Refinement with Self-Feedback

**Título completo:** Self-Refine: Iterative Refinement with Self-Feedback
**Autores:** Aman Madaan, Niket Tandon, Prakhar Gupta, Skyler Hallinan, Luyu Gao, Sarah Wiegreffe, Uri Alon, Nouha Dziri, Shrimai Prabhumoye, Yiming Yang, Shashank Gupta, Bodhisattwa Prasad Majumder, Katherine Hermann, Sean Welleck, Amir Yazdanbakhsh, Peter Clark
**Instituições:** CMU, Allen AI, UW, NVIDIA, UC San Diego, Google Research
**Arquivo:** `2303.17651v2.pdf`

### Problema Central
LLMs não geram o melhor output na primeira tentativa. Tarefas com objetivos multifacetados (geração de diálogo, legibilidade de código, raciocínio matemático) se beneficiam de **refinamento iterativo** — mas métodos existentes requerem treinamento supervisionado, modelos de reward separados ou anotações humanas caras. Self-Refine propõe que o **mesmo LLM** gere, dê feedback e refine iterativamente.

### Arquitetura (3 Passos Iterativos)

1. **Geração Inicial:** `y₀ = M(p_gen || x)` — dado input x e prompt de geração p_gen, gerar output inicial.
2. **Feedback:** `fb_t = M(p_fb || x || y_t)` — o mesmo modelo M analisa seu próprio output e produz feedback **acionável e específico**.
3. **Refinamento:** `y_{t+1} = M(p_refine || x || y₀ || fb₀ || ... || y_t || fb_t)` — o modelo refina incorporando todo histórico de feedback.
4. **Iteração:** Repete FEEDBACK → REFINE até condição de parada (score, número de iterações, ou modelo julgar "suficiente").

### Algoritmo Formal
```
Require: input x, model M, prompts {p_gen, p_fb, p_refine}, stop condition stop(·)
1: y₀ = M(p_gen || x)                          ▷ Geração inicial
2: for iteration t ∈ 0, 1, ... do
3:    fb_t = M(p_fb || x || y_t)               ▷ Feedback
4:    if stop(fb_t, t) then break               ▷ Condição de parada
5:    else
6:       y_{t+1} = M(p_refine || x || y₀ || fb₀ || ... || y_t || fb_t)  ▷ Refine
7: return y_t
```

### Resultados Experimentais Relevantes
- **Melhoria média de ~20% absolutos** sobre geração one-shot em 7 tarefas diversas
- GPT-4 + Self-Refine melhora 5-40% absolutos sobre GPT-4 base
- **Maiores ganhos nas primeiras iterações** (y₀→y₁ tem o maior delta), com retornos decrescentes
- **Feedback específico >> feedback genérico >> sem feedback:** Tabela 2 mostra que feedback acionável ("Avoid repeated calculations in the for loop") supera feedback genérico ("Improve the efficiency") que supera nenhum feedback.
- **Self-Refine > gerar múltiplas amostras:** Mesmo quando ChatGPT gera k=4 amostras sem refinamento, Self-Refine com 1 amostra refinada é preferido por humanos.
- **Modelos fracos não conseguem se auto-refinar:** Vicuna-13B não gera feedback consistente nem incorpora feedback no refinamento. Requer modelos fortes (GPT-3.5+).
- **Análise de falhas:** 33% feedback impreciso na localização do erro, 61% sugestão inadequada, 6% implementação incorreta do feedback.

### Princípios Aplicáveis ao Petition Engine

| Princípio | Aplicação no Petition Engine |
|-----------|------------------------------|
| **Loop GENERATE → FEEDBACK → REFINE** | Todo documento gerado deve passar por pelo menos 2-3 iterações de self-refinement. A cover letter V1 recebe feedback ("Faltam dados quantitativos no critério Original Contributions"), e V2 incorpora. |
| **3 prompts separados (p_gen, p_fb, p_refine)** | Para cada tipo de documento, manter 3 prompts distintos: um para gerar o draft, um para criticar (checklist USCIS, tom, completude), e um para refinar incorporando o feedback. |
| **Feedback ESPECÍFICO e ACIONÁVEL** | O prompt de feedback deve gerar críticas como "A seção Judging não menciona o critério de 'distinguished reputation' do 8 CFR 204.5(h)(3)(iv)" — não "Melhore a seção Judging". |
| **Histórico cumulativo de feedback** | Cada iteração de refinamento recebe TODO o histórico de outputs e feedbacks anteriores, permitindo ao modelo aprender de erros passados e evitar regressões. |
| **Condição de parada baseada em score** | Implementar checklist com score numérico (e.g., 42 quality gates do BP Orquestrador). Parar quando score ≥ threshold ou após máx. 4 iterações. |
| **Retornos decrescentes → limitar iterações** | O paper prova que y₀→y₁ tem o maior ganho. Para documentos longos, 2-3 iterações são suficientes. Mais que 4 desperdiça tokens. |
| **Modelos fortes para feedback** | Usar Claude Opus/GPT-4o para o passo de FEEDBACK mesmo se a geração inicial usar modelo menor. O feedback é a etapa mais crítica. |

### Lições Concretas
1. **Nunca entregar o primeiro draft.** O paper prova que LLMs melhoram ~20% com auto-refinamento. Para documentos legais de alto impacto (petições EB-1A), cada % de melhoria conta.
2. **O prompt de feedback é mais importante que o de geração.** A Tabela 2 mostra que a qualidade do feedback determina a qualidade do output final. Investir tempo criando checklists detalhados de avaliação (critérios USCIS, O*NET alignment, compliance regulatória).
3. **Preservar o histórico completo.** A Equação 4 mostra que o refinamento é CUMULATIVO — o modelo recebe y₀, fb₀, y₁, fb₁, ..., y_t, fb_t. Para cover letters de 68K palavras, isso implica gerenciamento cuidadoso de context window.
4. **Cuidado com regressões multi-aspecto.** O paper nota que melhoria em um aspecto pode degradar outro. Para petições: melhorar "completude de evidências" pode prejudicar "concisão". Feedback deve cobrir MÚLTIPLOS aspectos simultaneamente.

---

## PAPER 3: WritingPath: Outline-guided Text Generation with Large Language Models

**Título completo:** Navigating the Path of Writing: Outline-guided Text Generation with Large Language Models
**Autores:** Yukyung Lee, Soonwon Ka, Bokyung Son, Pilsung Kang, Jaewook Kang
**Instituições:** Boston University, NAVER AI Platform, Seoul National University
**Arquivo:** `2404.13919v2.pdf`

### Problema Central
Gerar texto de alta qualidade, orientado a objetivos, que reflita as intenções do usuário é desafiador para LLMs. Abordagens existentes (geração direta, ou ciclos Plan→Edit→Explain) falham em manter **consistência** ao longo de textos longos e não incorporam informação externa relevante. WritingPath propõe que **outlines explícitos e augmentados** são o caminho para texto consistente, rico e alinhado com as intenções do autor.

### Arquitetura (Pipeline de 5 Passos)

**Step 1: Prepare Metadata**
- Define: propósito, tipo de escrita, estilo, keywords
- Metadata `m = {purpose, type, style, keywords}`
- Estabelece a direção da escrita e o público-alvo

**Step 2: Generate Title and Initial Outline**
- `t, O_init = f_llm(φ₂(m))`
- Outline inicial com headers principais `h_{i,0}`
- Scaffolding: organiza ideias principais e pontos-chave

**Step 3: Browse for Information**
- `D_sim = f_search(t)` — busca documento similar via API de busca
- `K = f_llm(φ₃(D_sim))` — extrai keywords do documento encontrado
- Enriquece o plano de escrita com informação externa

**Step 4: Generate Augmented Outline**
- `O_aug = f_llm(φ₄(t, K, O_init))`
- Refina outline adicionando subheaders e detalhes específicos baseados nas keywords coletadas
- Resultado: `{(h_{1,0}, {h_{1,1}, h_{1,2}, ...}), (h_{2,0}, {h_{2,1}, h_{2,2}, ...}), ...}`
- Plano de escrita compreensivo com seções gerenciáveis

**Step 5: Write the Text**
- `d^i = f_llm(φ₅(t, O^i_aug))` — gera texto seção por seção
- `D = {d¹, d², ..., dⁿ}` — concatena todas as seções

### Framework de Avaliação (7 Aspectos com Sub-aspectos)

O paper propõe um framework de avaliação multi-aspecto **CheckEval** extremamente relevante:

1. **Linguistic Fluency:** Natural Expression, Text Length, Vocabulary, Syntax, Mechanic-Spelling-Punctuation
2. **Logical Fluency:** Organization (layout), Repetitive Content, Inter-sentence Cohesion, Inter-paragraph Cohesion
3. **Coherence:** Topic Consistency, Topic Sentence and Paragraph
4. **Consistency:** Tone, Stance/Posture, Style
5. **Complexity:** Vocabulary, Syntax
6. **Specificity:** Use of Example and Review, Detailed Description, Engagement
7. **Interestingness:** Kindness, Originality

Cada sub-aspecto avaliado com questões binárias (Yes/No), possibilitando avaliação automatizada por LLM com alta correlação com humanos (0.65 Spearman para diálogo).

### Resultados Experimentais Relevantes
- **Melhoria progressiva consistente:** meta → init → aug mostra ganhos em TODOS os modelos
- Outline augmentado melhora **Coerência** sem sacrificar **Diversidade**
- **Redução de repetição:** Self-BLEU cai significativamente com outlines augmentados (de 48.01 para 23.79 no GPT-3.5)
- **Correlações de Kendall tau** mostram que Fluência Lógica (0.7227), Especificidade (0.6575) e Coerência (0.6519) são os aspectos mais correlacionados com qualidade geral
- **Deployment real:** 6 meses em plataforma comercial da NAVER (CLOVA for Writing), validando aplicabilidade em produção
- **Modelos open-source falharam:** Llama2, Orion, KoAlpaca não atingiram qualidade suficiente para o pipeline

### Princípios Aplicáveis ao Petition Engine

| Princípio | Aplicação no Petition Engine |
|-----------|------------------------------|
| **Pipeline de 5 passos (Metadata → Outline → Browse → Augment → Write)** | Mapear diretamente: (1) Metadata = dados do cliente + critérios USCIS + O*NET code, (2) Outline inicial = estrutura do documento, (3) Browse = buscar evidências, precedentes, regulações, (4) Augmented outline = outline enriquecido com evidências específicas, (5) Write = gerar texto seção por seção. |
| **Metadata como ponto de partida** | Para cada documento, definir explicitamente: propósito (EB-1A, L-1A, E-2), tipo (cover letter, BP, résumé), estilo (1ª pessoa, técnico-legal), keywords (termos do CFR, critérios específicos). |
| **Browsing para enriquecimento** | Antes de gerar o outline augmentado, buscar: (a) precedentes AAO relevantes, (b) dados do O*NET para o occupation code, (c) regulações SBA para BPs, (d) dados de mercado para financial projections. |
| **Outline augmentado ANTES da escrita** | NUNCA gerar texto direto dos dados do cliente. Sempre criar outline detalhado com headers + subheaders + evidências alocadas por seção. Isso é o que o BP Orquestrador já faz com suas 42 seções. |
| **Geração seção por seção** | Gerar cada seção do documento independentemente, passando título + outline da seção específica. Previne perda de coerência em documentos longos. |
| **CheckEval adaptado para documentos legais** | Adaptar os 7 aspectos de avaliação: (1) Fluência Linguística → conformidade gramatical PT-BR/EN, (2) Fluência Lógica → progressão argumentativa legal, (3) Coerência → alinhamento com critérios USCIS, (4) Consistência → tom e postura uniformes, (5) Complexidade → adequação vocabular legal, (6) Especificidade → dados quantitativos e exemplos concretos, (7) Interestingness → narrativa persuasiva. |
| **Avaliação binária por sub-aspecto** | Criar checklist binário (Yes/No) para cada critério: "A seção menciona métricas quantitativas?" "O tom é consistente com 1ª pessoa?" "Há referência a pelo menos 2 evidências por critério?" |

### Lições Concretas
1. **O outline É o documento.** O paper prova que a qualidade do outline determina a qualidade do texto final. Para o Petition Engine, o BP Orquestrador (42 seções com quality gates) é literalmente a implementação deste princípio — e os dados provam que funciona.
2. **Browsing externo é essencial.** O Step 3 (buscar informação similar) reduz repetição e aumenta riqueza. Para petições: buscar precedentes AAO, dados SOC/O*NET, regulações CFR automaticamente antes de gerar cada seção.
3. **Avaliação multi-aspecto supera Likert scales.** O framework CheckEval com questões binárias é mais confiável que pontuações 1-5. Adaptar para os critérios USCIS: 8 critérios EB-1A × N sub-aspectos cada = checklist de validação automatizada.
4. **A correlação de Kendall tau mostra prioridades.** Para documentos legais, Especificidade (dados concretos) e Fluência Lógica (argumentação) provavelmente terão a maior correlação com sucesso do caso. Investir mais nestas dimensões.

---

## PAPER 4: WritingPath (Detalhes Adicionais do Deployment)

*Nota: O paper 4 (2404.13919v2.pdf) é o mesmo WritingPath analisado acima. A análise completa já foi incluída no Paper 3.*

O deployment real na NAVER (Figura 7 do paper) revela uma arquitetura de produção com:
- **Gateway** com rate limiting
- **Emergency Filter** + **Safety Classifier** para filtragem de conteúdo
- **Prompt Pipeline** estruturado
- **Token Event Monitor** + **Token Event Filter** para anomalias
- **Kafka** para ETL, logging, métricas e alertas
- **Search API** + **Keyword Extractor** + **Blog Corpora** para o Step 3 (Browsing)
- **Outline Evaluation** + **Writing Evaluation (CheckEval)** como quality gates

Esta arquitetura de produção é diretamente aplicável ao Petition Engine como pipeline de deployment.

---

## SÍNTESE CRUZADA: Princípios Convergentes para o Petition Engine

### 1. Arquitetura em Camadas com Kernel Centralizado (Papers 1+3)
O AIOS e o WritingPath convergem na necessidade de **separar lógica de negócio da infraestrutura**. O Petition Engine deve ter:
- **Kernel:** Scheduler de chamadas LLM, gerenciamento de contexto/memória, versionamento
- **Agentes de Documento:** Cover Letter Agent, BP Agent, Résumé Agent — cada um com sua lógica de seções
- **SDK:** Interface padronizada para todos os agentes acessarem LLMs e ferramentas

### 2. Pipeline de Geração em Estágios (Papers 2+3)
Self-Refine e WritingPath convergem no pipeline **multi-estágio**:
```
METADATA → OUTLINE INICIAL → BROWSING → OUTLINE AUGMENTADO → GERAÇÃO POR SEÇÃO → FEEDBACK → REFINAMENTO → VALIDAÇÃO
```
Este é exatamente o pipeline que o BP Orquestrador já implementa, validado agora por evidência acadêmica de 2 papers independentes.

### 3. Self-Refinement Iterativo com Feedback Específico (Paper 2)
Após a geração inicial de cada seção:
1. Gerar feedback específico contra checklist (critérios USCIS, quality gates)
2. Refinar incorporando feedback
3. Repetir 2-3 vezes (retornos decrescentes após 3 iterações)
4. Parar quando score do checklist ≥ threshold

### 4. Gerenciamento de Contexto para Documentos Longos (Paper 1)
O Context Manager do AIOS com snapshot/restore resolve o problema de cover letters de 68K palavras:
- Snapshot do estado após cada seção gerada com sucesso
- Restauração em caso de falha sem regerir seções anteriores
- Memory swapping (RAM ↔ disco) para evidências por caso

### 5. Avaliação Multi-Aspecto Automatizada (Paper 3)
O framework CheckEval adaptado para documentos de imigração:
- Questões binárias por sub-aspecto
- Automatizável por LLM com alta correlação com avaliação humana
- Permite quality gates programáticos no pipeline

### 6. Multi-LLM com Interface Unificada (Paper 1)
O LLMAdapter do AIOS permite:
- Claude Opus para seções críticas (argumentação legal, extraordinary ability claims)
- Claude Sonnet para seções rotineiras (dados biográficos, formatação)
- Modelos locais para operações sensíveis (dados PII do cliente)
- Troca de modelo sem alterar lógica do agente

### 7. Versionamento e Rollback (Paper 1)
O StorageManager com versionamento é obrigatório para documentos legais:
- Cada iteração de refinamento = nova versão
- Rollback habilitado por timestamp ou índice
- Auditoria completa de alterações (requisito legal)

---

## Tabela Resumo: Paper → Princípio → Implementação

| # | Princípio | Paper Fonte | Implementação no Petition Engine | Prioridade |
|---|-----------|-------------|----------------------------------|------------|
| 1 | Kernel centralizado com scheduler | AIOS (P1) | Fila de chamadas LLM por módulo, Round Robin entre clientes | ALTA |
| 2 | LLM como "core" abstrato | AIOS (P1) | LLMAdapter multi-provider (Claude/GPT/Gemini) | ALTA |
| 3 | Context snapshot/restore | AIOS (P1) | Checkpoint por seção em documentos longos | MÉDIA |
| 4 | Memory swapping LRU-K | AIOS (P1) | Evidências frequentes em RAM, históricas em disco | MÉDIA |
| 5 | Versionamento com rollback | AIOS (P1) | Cada iteração = versão, rollback por índice | ALTA |
| 6 | Validação pré-execução de tools | AIOS (P1) | Schema validation antes de chamar O*NET, SBA, formatador | MÉDIA |
| 7 | Prompt enhancement no wrapper | AIOS (P1) | Regras USCIS, tom 1ª pessoa, formato O*NET embutidos no wrapper | ALTA |
| 8 | Access control por privilégio | AIOS (P1) | Attorney/paralegal/cliente com permissões distintas | MÉDIA |
| 9 | GENERATE → FEEDBACK → REFINE loop | Self-Refine (P2) | 2-3 iterações por seção com checklist USCIS | ALTA |
| 10 | 3 prompts separados (gen/fb/refine) | Self-Refine (P2) | Prompts dedicados para geração, crítica e refinamento | ALTA |
| 11 | Feedback ESPECÍFICO e ACIONÁVEL | Self-Refine (P2) | Checklists com critérios concretos, não genéricos | ALTA |
| 12 | Histórico cumulativo de feedback | Self-Refine (P2) | Cada refinamento recebe todo histórico anterior | MÉDIA |
| 13 | Condição de parada por score | Self-Refine (P2) | Quality gates com threshold (e.g., 42 gates do BP) | ALTA |
| 14 | Retornos decrescentes → max 3-4 iterações | Self-Refine (P2) | Limitar iterações, maior ganho na 1ª | MÉDIA |
| 15 | Modelos fortes para feedback | Self-Refine (P2) | Opus para feedback, Sonnet para geração inicial | ALTA |
| 16 | Pipeline 5 passos (Meta→Outline→Browse→Aug→Write) | WritingPath (P3) | Dados→Estrutura→Busca→Enriquecimento→Geração | ALTA |
| 17 | Metadata como ponto de partida | WritingPath (P3) | Propósito/tipo/estilo/keywords definidos antes de tudo | ALTA |
| 18 | Browsing externo para enriquecimento | WritingPath (P3) | Busca automática: AAO, O*NET, CFR, SBA | ALTA |
| 19 | Outline augmentado antes da escrita | WritingPath (P3) | Outline detalhado com evidências alocadas por seção | ALTA |
| 20 | Geração seção por seção | WritingPath (P3) | Cada seção gerada independentemente com seu contexto | ALTA |
| 21 | CheckEval multi-aspecto | WritingPath (P3) | 7 aspectos adaptados para documentos legais de imigração | ALTA |
| 22 | Avaliação binária por sub-aspecto | WritingPath (P3) | Yes/No por critério, automatizável por LLM | MÉDIA |
| 23 | Deploy com safety filters | WritingPath (P3) | Filtros de PII, compliance, quality gates em pipeline | ALTA |

---

## Conclusão

Os 4 papers (sendo 2 versões do AIOS e 1 do WritingPath) convergem em princípios que o Petition Engine da OMNI já implementa parcialmente via BP Orquestrador. A validação acadêmica confirma que:

1. **O pipeline multi-estágio com outlines funciona** — WritingPath prova com 4.500 instâncias e 6 meses em produção
2. **Self-refinement iterativo é obrigatório** — Self-Refine prova 20% de melhoria média, essencial para documentos legais
3. **Arquitetura de kernel com abstrações é escalável** — AIOS prova escalabilidade linear até 2.000 agentes
4. **Avaliação multi-aspecto com checklist binário é confiável** — CheckEval correlaciona com humanos a 0.65+

O Petition Engine deve integrar estes princípios em sua arquitetura, priorizando os 23 itens da tabela resumo conforme classificação de prioridade.
