# DIAGNÓSTICO E AJUSTES CIRÚRGICOS — SISTEMA DE METODOLOGIA (COMO PASSADO)
## Prompts 0 a 4

---

## SÍNTESE DO DIAGNÓSTICO

O sistema funciona bem. A arquitetura 0→1→2→3→4 é sólida e a progressão lógica (fatos → como → porquê → prova → blindagem) é correta. Os problemas não são estruturais — são operacionais. O sistema produz documentos que passam na teoria mas falham na prática por três razões recorrentes: (1) não força leitura exaustiva dos documentos do cliente antes de escrever, (2) não protege contra os padrões que o USCIS detecta algoritmicamente em 2026, e (3) não previne os erros concretos que observamos no caso Renato.

A seguir: achados específicos por prompt, com prescrição exata do que adicionar, remover ou modificar.

---

## ACHADOS TRANSVERSAIS (aplicam-se a TODOS os prompts)

### T1. AUSÊNCIA DE PROTOCOLO DE LEITURA EXAUSTIVA

**Problema:** Todos os prompts dizem "baseie-se exclusivamente nos documentos anexados" mas nenhum força uma leitura estruturada antes de escrever. O resultado: o LLM escaneia superficialmente, inventa detalhes que parecem plausíveis, e mistura fatos reais com inferências não documentadas.

**Caso Renato:** Claude Code inventou "Salete Distribuidora" e "Supermercados Araujo" como empregadores — empresas que NÃO existiam nos documentos. Inventou datas "2008-2020" para o Hipermercado Ourinhos quando o correto era "2010-2022". Métricas foram atribuídas a contextos errados.

**Prescrição — adicionar a TODOS os prompts, na seção de regras:**

```
### PROTOCOLO DE LEITURA OBRIGATÓRIA (antes de redigir qualquer linha)

Antes de iniciar a redação, você DEVE:

1. Ler CADA documento anexado integralmente, do início ao fim
2. Extrair e listar internamente (não no output):
   - Todas as datas mencionadas (empregos, projetos, eventos)
   - Todos os nomes de empresas/instituições/pessoas
   - Todas as métricas numéricas com seu contexto exato
   - Todas as funções/cargos com períodos específicos
3. NUNCA inferir datas, nomes de empresas, cargos ou métricas que não estejam
   explicitamente escritos nos documentos
4. Se um documento menciona "crescimento de 340%" vinculado a uma empresa
   específica, NUNCA atribuir essa métrica a outra empresa ou contexto
5. Se houver ambiguidade sobre datas ou sequência de empregos, usar
   linguagem temporal vaga ("no período subsequente", "na fase seguinte")
   em vez de inventar datas específicas

VIOLAÇÃO DESTE PROTOCOLO INVALIDA TODO O DOCUMENTO.
```

---

### T2. AUSÊNCIA DE PROTEÇÃO ANTI-DETECÇÃO ALGORÍTMICA

**Problema:** O USCIS opera três sistemas de detecção de conteúdo sintético em 2026: ATLAS (NLP para agrupar petições com linguagem similar), ATA (análise de perplexidade e burstiness), e FDNS-DS NexGen (clustering de padrões entre escritórios). Nenhum prompt aborda isso.

**O que acontece:** Documentos gerados por LLM sem tratamento exibem baixa perplexidade (frases uniformemente previsíveis) e baixa burstiness (sentenças de comprimento similar). Isso aciona pontuação de risco elevada no sistema do USCIS.

**Prescrição — adicionar a TODOS os prompts, na seção de estilo:**

```
### PROTOCOLO ANTI-UNIFORMIDADE TEXTUAL

O texto final DEVE apresentar variação natural de estilo:

1. VARIAR comprimento de frases deliberadamente:
   - Intercalar frases curtas (8-12 palavras) com frases longas (40-60 palavras)
   - Nunca produzir mais de 3 frases consecutivas de comprimento similar
   
2. VARIAR estrutura sintática:
   - Não iniciar parágrafos consecutivos com a mesma construção
   - Alternar entre voz ativa e construções passivas
   - Usar subordinadas, intercalações e inversões sintáticas
   
3. ELIMINAR padrões formulaicos:
   - Nunca usar "It is worth noting that", "Furthermore", "Moreover" como
     transições mecânicas
   - Nunca repetir a mesma estrutura de transição entre parágrafos
   - Cada transição deve ser única e orgânica ao conteúdo
   
4. PRIVILEGIAR dados sobre adjetivos:
   - Substituir "remarkable growth" por "growth of 340% over ten years"
   - Substituir "exceptional results" por "stockout rates below 2% against
     a sector average of 12%"
   - Cada parágrafo deve conter pelo menos um dado concreto extraído
     dos documentos (quando disponível)
   
5. PROIBIDO usar estas expressões (gatilhos conhecidos de boilerplate):
   - "revolutionize the industry"
   - "leverage extensive knowledge"
   - "create indispensable synergies"
   - "paradigm shift"
   - "cutting-edge"
   - "state-of-the-art"
   - "unparalleled expertise"
   - Qualquer frase que poderia aparecer em qualquer petição de qualquer
     pessoa em qualquer área
```

---

### T3. AUSÊNCIA DE LIMITE DE REPETIÇÃO DE MÉTRICAS

**Problema:** Sem controle, o LLM repete as mesmas métricas de impacto 5-8 vezes ao longo do documento. Isso (a) soa artificial para o adjudicador, (b) infla o texto sem adicionar substância, e (c) é um sinal clássico de boilerplate.

**Caso Renato:** "200-340%" aparecia 5+ vezes, "38-42% conversion" aparecia 4+ vezes. Tivemos que fazer múltiplas rodadas de poda.

**Prescrição — adicionar a TODOS os prompts:**

```
### REGRA DE REPETIÇÃO DE MÉTRICAS

- Cada métrica numérica específica pode aparecer NO MÁXIMO 3 vezes
  no documento inteiro
- Na 1ª ocorrência: apresentação completa com contexto
- Na 2ª ocorrência: referência resumida em contexto diferente
- Na 3ª ocorrência: apenas se estiver em tabela comparativa ou síntese final
- Se precisar referenciar o mesmo resultado uma 4ª vez, usar linguagem
  qualitativa ("growth rates far exceeding sector norms") em vez do número
```

---

### T4. AUSÊNCIA DE MANDATO DE FORMATAÇÃO VISUAL

**Problema:** Todos os prompts mandam produzir "texto contínuo, denso, extenso" mas documentos de 40+ páginas em prosa pura são intragáveis para adjudicadores que revisam centenas de petições. Tabelas, bullet summaries e elementos visuais permitem scanning rápido sem perder substância.

**Caso Renato:** 80K+ chars de prose wall em ambos os documentos. Tivemos que criar um briefing inteiro de formatação visual depois.

**Prescrição — adicionar aos Prompts 0, 1 e 4 (Metodologia) e 0, 1, 2 e 5 (Declaration):**

```
### REGRA DE FORMATAÇÃO VISUAL

O texto deve ser primariamente narrativo, mas DEVE incluir elementos visuais
estratégicos para facilitar scanning:

OBRIGATÓRIO incluir pelo menos:
- 1 tabela comparativa (prática padrão vs. abordagem do profissional)
- 1 tabela de resultados consolidados por caso/projeto/episódio
- 1 quadro de validação (quem validou o quê)
- Bullet points de "Key Outcomes" após cada pilar/seção principal
  (máximo 5 bullets, cada um com métrica + contexto em uma linha)

PROIBIDO:
- Emojis
- Caixas decorativas
- HTML
- Formatação que não seja Markdown padrão (|tabela|, **bold**, - bullets)

Os elementos visuais COMPLEMENTAM a prosa — não substituem. Cada tabela
deve estar cercada por parágrafos narrativos que contextualizem os dados.
```

---

### T5. AUSÊNCIA DE CROSS-REFERENCE ENTRE DOCUMENTOS

**Problema:** Quando Metodologia e Declaração são produzidos separadamente, não há instrução sobre como referenciá-los mutuamente. Isso causa: (a) repetição de conteúdo entre documentos, ou (b) desconexão total.

**Caso Renato:** Tivemos que adicionar manualmente linguagem de "accompanying" e calibrar o que cada documento cobria vs. delegava ao outro.

**Prescrição — adicionar ao Prompt 0 de ambos os sistemas:**

```
### CROSS-REFERÊNCIA ENTRE DOCUMENTOS DO DOSSIÊ

Este documento faz parte de um conjunto. Ao mencionar conteúdo coberto
em outro volume:

- Usar SEMPRE: "as documented in the accompanying [nome do documento]"
- NUNCA reproduzir conteúdo extenso que pertence a outro volume
- Referências cruzadas permitidas: máximo 1 frase de contexto + remissão
- Conteúdo biográfico detalhado → pertence à Cover Letter
- Projeções financeiras → pertencem ao Business Plan
- Metodologia operacional → pertence ao Dossiê Metodológico
- Plano futuro → pertence à Declaração de Intenções

Se um fato precisa aparecer em mais de um documento, a versão COMPLETA
fica no documento principal e os outros fazem referência resumida.
```

---

## ACHADOS ESPECÍFICOS POR PROMPT

---

## PROMPT 0 — Dossiê Fundacional

### 0.1. SEÇÃO 5.2 (Índice Probatório) — Formato muito rígido

**Problema:** A tabela probatória pede "tipo, origem, o que demonstra, relevância." Isso é bom, mas falta uma coluna crítica: a LOCALIZAÇÃO no documento final. Sem isso, o advogado não sabe onde cada evidência é usada.

**Prescrição:** Adicionar coluna "Onde é utilizada no dossiê" à tabela do Índice Probatório.

### 0.2. SEÇÃO 5.3 (Episódios de Impacto) — Sem limite nem guia de seleção

**Problema:** Diz "vários episódios (quantos forem razoáveis)" mas não dá critério de seleção. Resultado: o LLM ou produz 2 episódios fracos ou 12 episódios repetitivos.

**Prescrição:** Substituir por:

```
Selecione entre 3 e 6 episódios de impacto, priorizando:
- Diversidade de contexto (diferentes empresas, projetos ou períodos)
- Presença de validação por terceiros (cartas, relatórios)
- Disponibilidade de métricas quantitativas
- Relevância para demonstrar os pilares da metodologia

Se houver mais de 6 episódios fortes, selecione os 6 com maior
diversidade e densidade probatória. Os restantes podem ser mencionados
brevemente na seção de progressão.
```

### 0.3. NÃO INSTRUI sobre o que fazer com informações contraditórias

**Problema:** Documentos reais frequentemente contêm datas conflitantes entre CV e cartas, ou métricas ligeiramente diferentes entre fontes.

**Caso Renato:** CV dizia uma data, carta de recomendação dizia outra para o mesmo emprego.

**Prescrição — adicionar à seção 3 (Fontes):**

```
Se houver contradição entre documentos (datas, métricas, nomes):
- Priorizar documentos oficiais (registros, contratos) sobre narrativos
- Priorizar CV/résumé sobre cartas de recomendação para datas de emprego
- Quando não for possível resolver, usar a versão mais conservadora
- NUNCA inventar uma terceira versão que "harmonize" as contradições
```

---

## PROMPT 1 — Dossiê Metodológico (O COMO)

### 1.1. "3 a 5 pilares" é bom, mas falta instrução de DERIVAÇÃO

**Problema:** O prompt manda criar pilares mas não explica como identificá-los a partir dos documentos. Resultado: pilares genéricos que servem para qualquer pessoa.

**Prescrição — adicionar à seção 5.2:**

```
Os pilares NÃO são categorias genéricas de gestão.
Eles devem EMERGIR dos documentos específicos do profissional.

Para identificar pilares:
1. Leia todos os episódios de impacto do Prompt 0
2. Identifique PADRÕES RECORRENTES de atuação (não resultados, mas COMO atua)
3. Agrupe esses padrões em 3-5 eixos que se repetem consistentemente
4. Cada pilar deve ser comprovável por pelo menos 2 episódios distintos
5. Os pilares devem ser ESPECÍFICOS ao profissional — se trocar o nome
   e a área e o pilar ainda fizer sentido, ele é genérico demais

TESTE DE ESPECIFICIDADE: se o pilar poderia pertencer a qualquer
profissional da mesma área, ele precisa ser reformulado com mais
granularidade baseada nos documentos.
```

### 1.2. SEÇÃO 5.4 (Diferenciação) — Comparação com "prática padrão" sem base

**Problema:** Manda comparar com "prática padrão do setor" mas o LLM não tem base documental para isso. Resultado: comparações genéricas inventadas.

**Prescrição — reformular:**

```
### 5.4. Diferenciação Metodológica

A comparação deve ser construída EXCLUSIVAMENTE a partir de:
- Contrastes mencionados nas cartas de recomendação
  (ex: "diferente de outros profissionais que conheci...")
- Dados de setor mencionados nos documentos
  (ex: "média do setor de 12% vs. resultado de 2%")
- Contextos descritos nos episódios
  (ex: "enquanto a prática comum era X, o profissional implementou Y")

NUNCA inventar benchmarks de setor não mencionados nos documentos.
Se não houver base documental para comparação setorial, reformular
a seção como "Características Distintivas da Abordagem" sem
afirmações sobre o que "o setor normalmente faz."
```

### 1.3. FALTA mandato de tabela comparativa

**Prescrição — adicionar ao final da seção 5.4:**

```
Esta seção DEVE incluir uma tabela com formato:

| Dimensão | Prática Convencional | Abordagem do Profissional |
|----------|---------------------|--------------------------|

Mínimo 4 linhas, máximo 8. Cada linha baseada em fatos documentados.
```

---

## PROMPT 2 — Dossiê de Análise Estratégica (O PORQUÊ)

### 2.1. "Sem repetir Prompts 0 e 1" — Regra correta mas sem enforcement

**Problema:** O prompt proíbe repetição mas não dá mecanismo para evitá-la. O LLM inevitavelmente reconta os mesmos episódios.

**Prescrição — adicionar:**

```
### MECANISMO ANTI-REPETIÇÃO

Antes de escrever cada parágrafo, verifique:
- Este fato já foi narrado em detalhe nos Prompts 0 ou 1?
- Se SIM: referenciar em uma frase ("the systematic approach to supplier
  management documented in the methodological analysis") e avançar
  para a INTERPRETAÇÃO ESTRATÉGICA
- Se NÃO: pode desenvolver

O Prompt 2 INTERPRETA e CONECTA. Não RECONSTRÓI.
Proporção mínima: 70% análise / 30% referência a fatos.
```

### 2.2. SEÇÃO IV (Modelo de Contribuição Ampliada) — Silenciosamente serve o Prong 1 de Dhanasar mas não guia o suficiente

**Problema:** Esta seção é onde se demonstra "importância nacional" sem usar o termo. Mas o prompt não guia sobre COMO demonstrar que efeitos "escapam do limite de uma função convencional." Isso é exatamente o que o Prong 1 exige: impacto além do empregador imediato.

**Prescrição — adicionar:**

```
Para demonstrar que a contribuição é "ampliada", o texto deve evidenciar
pelo menos 3 dos seguintes efeitos (quando documentados):

- Impacto em múltiplas organizações (não apenas o empregador)
- Influência em práticas do setor (adoção por terceiros)
- Efeitos em cadeia de suprimentos ou ecossistema
- Criação de emprego ou capacitação de equipes além do escopo imediato
- Contribuição para base de conhecimento do campo (publicações, métodos
  adotados, treinamentos replicados)
- Impacto em comunidades ou populações (consumidores, pacientes, etc.)

Cada efeito deve ser RASTREÁVEL aos documentos anexados.
```

---

## PROMPT 3 — Dossiê de Validação por Especialistas (A PROVA)

### 3.1. NÃO reflete a hierarquia atual de peso probatório das cartas

**Problema:** O RAG regulatório é explícito: cartas de colegas diretos e subordinados perderam peso. O USCIS prioriza "expert opinion letters" de autoridades independentes. O Prompt 3 não faz essa distinção.

**Prescrição — adicionar à seção II (Mapa Estratégico):**

```
### HIERARQUIA DE PESO PROBATÓRIO DOS SIGNATÁRIOS

Ao definir o perfil ideal de cada carta, priorizar:

PESO MÁXIMO:
- Autoridades de entidades governamentais ou quasi-governamentais
- Especialistas independentes do setor (sem vínculo comercial ou
  hierárquico com o profissional)
- Líderes de associações setoriais ou profissionais

PESO ALTO:
- Parceiros comerciais de longo prazo (clientes, fornecedores)
  que testemunham resultados específicos
- Acadêmicos com publicações relevantes na área

PESO MODERADO:
- Colegas de nível similar (peer-level)
- Ex-supervisores diretos

PESO BAIXO (EVITAR se possível):
- Subordinados
- Familiares ou amigos
- Pessoas sem credencial verificável na área

O mapa deve demonstrar que o conjunto prioriza signatários de
PESO MÁXIMO e ALTO, com no máximo 1 carta de PESO MODERADO.
```

### 3.2. Minutas de cartas não enfatizam INDEPENDÊNCIA suficientemente

**Problema:** O RAG de 2026 é claro: o USCIS agora exige que cartas demonstrem que o signatário não tem conflito de interesses. As minutas pedem "nota de independência institucional" mas como um item de checklist, não como elemento narrativo.

**Prescrição — reformular seção III.A:**

```
### A. Identificação e Relação Profissional

OBRIGATÓRIO incluir parágrafo explícito de independência:
- Descrever a relação profissional (não pessoal)
- Explicitar que a avaliação é baseada em observação direta de
  resultados, não em relação pessoal
- Mencionar que o signatário não possui dependência financeira,
  hierárquica ou contratual em relação ao profissional
- Demonstrar que a motivação para testemunhar é técnica, não pessoal
```

### 3.3. Biblioteca Anti-Genérico (seção IV) — Boa ideia, execução insuficiente

**Problema:** Pede "15-20 frases-modelo" mas não distingue entre frases que descrevem AÇÃO vs. RESULTADO vs. IMPACTO. Resultado: frases que soam iguais.

**Prescrição — reestruturar:**

```
### IV. Biblioteca Anti-Genérico

Organizar em 3 categorias, 5-7 frases cada:

A) FRASES DE AÇÃO OBSERVADA (o que o signatário VIU o profissional fazer):
   - Descrevem processo, decisão, rotina, ferramenta
   
B) FRASES DE RESULTADO DOCUMENTADO (o que aconteceu depois):
   - Descrevem métricas, mudanças, melhorias quantificáveis
   
C) FRASES DE IMPACTO AMPLIADO (efeito além do contexto imediato):
   - Descrevem consequências para o setor, ecossistema, terceiros

Cada frase deve incluir um [slot] para dado específico do caso.
Ex: "The implementation of [processo específico] resulted in a
documented [métrica] improvement over [período], as measured by
[indicador]."
```

---

## PROMPT 4 — Dossiê de Auditoria (A BLINDAGEM)

### 4.1. SEÇÃO 4 (Plano de Coleta) contradiz a regra geral de "não recomendar"

**Problema:** Todas as regras transversais dizem "não recomendar, não orientar, não prescrever." Mas o Prompt 4 manda criar um "Plano de Coleta Estratégica." Isso É uma recomendação, mesmo com linguagem positiva.

**Prescrição:** Duas opções:

**Opção A (recomendada):** Remover a seção 4 inteira e substituir por "Matriz de Cobertura Documental" que apenas MAPEIA o que já existe, sem sugerir coleta.

**Opção B:** Manter mas mover para um documento SEPARADO (não faz parte do dossiê que vai ao USCIS — é documento interno de trabalho para o advogado).

### 4.2. SEÇÃO 6 (Matriz de Redundância Positiva) — Excelente conceito, falta instrução concreta

**Prescrição — adicionar:**

```
A matriz deve demonstrar que cada afirmação-chave do dossiê é
sustentada por pelo menos 2 fontes independentes:

| Afirmação-Chave | Fonte 1 | Fonte 2 | Fonte 3 (se houver) |
|-----------------|---------|---------|---------------------|

Mínimo 8 linhas. Cada linha deve cobrir uma claim diferente.
Se alguma afirmação-chave tiver apenas 1 fonte, ela deve ser
sinalizada internamente (sem aparecer no documento) e o texto
deve ser reformulado para reduzir dependência de fonte única.
```

### 4.3. FALTA uma seção de CONSISTÊNCIA NUMÉRICA

**Caso Renato:** Métrica aparecia como "17x" em um lugar e "17-fold" em outro. Datas de emprego variavam entre seções.

**Prescrição — adicionar nova seção:**

```
### AUDITORIA DE CONSISTÊNCIA NUMÉRICA E FACTUAL

Verificar e reportar:
1. Cada métrica aparece de forma idêntica em todas as ocorrências?
2. Datas de emprego são consistentes entre seções?
3. Nomes de empresas/instituições são grafados identicamente?
4. Cargos/funções são descritos de forma consistente?
5. Referências cruzadas a outros documentos usam os títulos corretos?

Apresentar como checklist com ✅ para cada item verificado.
```

---

## RESUMO DE PRIORIDADES (METODOLOGIA)

| Prioridade | Ajuste | Impacto |
|-----------|--------|---------|
| 🔴 CRÍTICA | T1 — Protocolo de leitura exaustiva | Previne erros factuais (maior risco) |
| 🔴 CRÍTICA | T2 — Protocolo anti-detecção algorítmica | Previne flagging pelo USCIS |
| 🟠 ALTA | T3 — Limite de repetição de métricas | Previne boilerplate |
| 🟠 ALTA | 3.1 — Hierarquia de peso das cartas | Alinha com prática atual do USCIS |
| 🟠 ALTA | 1.1 — Instrução de derivação de pilares | Previne pilares genéricos |
| 🟡 MÉDIA | T4 — Mandato de formatação visual | Melhora legibilidade |
| 🟡 MÉDIA | T5 — Cross-reference entre documentos | Previne repetição |
| 🟡 MÉDIA | 0.3 — Protocolo para contradições | Previne erros factuais |
| 🟢 MENOR | 1.2 — Reforma da seção de diferenciação | Melhora qualidade |
| 🟢 MENOR | 4.1 — Resolver contradição do Plano de Coleta | Coerência interna |
