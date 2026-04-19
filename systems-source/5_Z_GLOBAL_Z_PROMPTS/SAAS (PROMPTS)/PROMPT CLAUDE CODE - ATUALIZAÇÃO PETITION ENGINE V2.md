# PROMPT CLAUDE CODE — ATUALIZAÇÃO DO PETITION ENGINE V2

**Objetivo:** Cole este prompt no Claude Code para aplicar correções cirúrgicas nos 9 prompts estratégicos (pasta `EB-2 - ESTRATÉGIAS`) E nos 2 prompts SaaS Evidence Architect (pasta `SAAS (PROMPTS)`). Esta é a versão 2 — mais abrangente e com hard blocks sistêmicos.

**Data de criação:** 02/04/2026

---

## COLE ESTE PROMPT NO CLAUDE CODE:

---

## CONTEXTO

Uma auditoria forense do sistema de elaboração de petições EB-2 NIW revelou que nossos próprios documentos foram usados como ARMA contra nossos clientes pelo USCIS. Especificamente:

1. **O "Paradoxo da Escalabilidade"** — Descrevíamos negócios como "padronizados" e "auto-sustentáveis", provando ao oficial que o beneficiário NÃO é necessário (destruindo Prong 3)
2. **Termos proibidos** — "Consultoria/consulting/assessoria" disparam classificação NAICS de alto escrutínio no VIBE/Dun & Bradstreet do USCIS
3. **Prong 3 inexistente** — O sistema não gerava defesa robusta do waiver
4. **Menção a negativas anteriores** — Documentos referenciavam decisões anteriores, plantando dúvida no oficial

Este prompt corrige TODOS esses problemas de forma permanente.

## TAREFA

### FASE 1: HARD BLOCKS — Inserir em TODOS os arquivos de prompt

Leia TODOS os arquivos .md nas pastas:
- `EB-2 - ESTRATÉGIAS/` (9 prompts estratégicos)
- `SAAS (PROMPTS)/` (SaaS Evidence Architect V1 e V2)

Em CADA arquivo, insira o seguinte bloco IMEDIATAMENTE após o primeiro header principal (seja `## 🎯 Objetivo`, `SYSTEM INSTRUCTIONS:`, `CORE MISSION:` ou equivalente):

```
---
⛔ HARD BLOCKS — REGRAS INVIOLÁVEIS (aplicar a TODO output):

BLOCO 1 — TERMOS PROIBIDOS (jamais usar em qualquer output):
- "consulting" / "consultoria" / "assessoria" / "advisory services" (genérico)
- "standardized" / "padronizado" / "processos padronizados"
- "train-the-trainer" / "capacitação de multiplicadores autônomos"
- "operates autonomously" / "opera de forma autônoma" / "funciona sem o beneficiário"
- "self-sustaining" / "auto-sustentável" / "autossuficiente"
- "plug-and-play" / "pronto para uso sem supervisão"
- "white-label" / "marca branca"
- "client autonomy" / "autonomia do cliente para operar sozinho"
- "founder dependency: low" / "baixa dependência do fundador"
- "scalable without the founder" / "escalável sem o fundador"
- "replicable by any professional" / "replicável por qualquer profissional"
- "turnkey solution" / "solução chave-na-mão"

SUBSTITUIÇÕES OBRIGATÓRIAS:
- "consulting" → "prestação de serviços técnicos especializados" / "implementação técnica sob metodologia proprietária"
- "assessoria" → "assessoria técnica regulatória" / "orientação técnica especializada"
- "train-the-trainer" → "programa de formação supervisionada sob metodologia proprietária do beneficiário, com atualização contínua obrigatória"
- "standardized" → "sistematizado pela expertise proprietária do beneficiário" / "estruturado conforme framework desenvolvido pelo beneficiário"
- "scalable" → "expansível sob supervisão contínua do beneficiário" / "multiplicável através da expertise proprietária do beneficiário"
- "autonomous operation" → "implementação guiada sob o framework de qualidade do beneficiário"

BLOCO 2 — PROIBIÇÃO DE MENÇÃO A HISTÓRICO PROCESSUAL:
JAMAIS incluir em qualquer output:
- Referência a negativa anterior / denial / decisão desfavorável
- Referência a RFE anterior / Request for Evidence
- Referência a "petição anterior" / "previous petition" / "prior filing"
- Referência a "refile" / "nova submissão" / "segunda tentativa"
- Qualquer linguagem que sugira que este caso já foi submetido antes
- Qualquer linguagem que sugira correção de erros anteriores
→ MOTIVO: Mencionar histórico processual planta a semente de dúvida no oficial e é um atestado de fraqueza da petição anterior. Toda petição deve ser tratada como ORIGINAL.

BLOCO 3 — NEXO OBRIGATÓRIO BENEFICIÁRIO ↔ ENDEAVOR:
Todo parágrafo de output que descreva o endeavor DEVE responder implicitamente:
"E por que isso não acontece sem ESTA PESSOA?"
→ Modelo Beethoven: A sinfonia pode ser tocada por muitas orquestras, mas SÓ Beethoven pode compô-la. A plataforma/negócio escala PORQUE o beneficiário desenvolve, atualiza e supervisiona continuamente os protocolos proprietários. Sem o beneficiário, os protocolos congelam e ficam obsoletos.

BLOCO 4 — PRONG 3 OBRIGATÓRIO:
Todo output que aborde o endeavor DEVE incluir seção explícita de defesa de Prong 3 (waiver) com TRÊS sub-argumentos:
(a) IMPRATICABILIDADE DO PERM — O endeavor empreendedor/proprietário não se encaixa no modelo de oferta de emprego tradicional
(b) URGÊNCIA — O problema nacional que o beneficiário resolve se agrava enquanto espera 2-3 anos pelo PERM (com dados federais)
(c) UNICIDADE DA EXPERTISE — A combinação específica de habilidades do beneficiário é genuinamente rara e o mercado convencional não produziria substituto adequado
---
```

### FASE 2: CORREÇÕES ESPECÍFICAS POR PROMPT

#### PROMPT 1 (National Importance):

No Terceiro Passo (Justificativa Técnica de Interesse Nacional), ADICIONAR ao final:

```
- **OBRIGATÓRIO:** Demonstre por que a PESSOA do beneficiário é indispensável para o impacto nacional descrito — não basta mostrar que a ÁREA é importante; mostre que ESTE INDIVÍDUO é insubstituível para gerar esse impacto. Use o teste: "Se removermos esta pessoa, o impacto nacional descrito DIMINUI, ATRASA ou DESAPARECE?"
- **CONEXÃO COM POLÍTICAS:** Vincule o endeavor a pelo menos UMA política federal específica (lei, executive order, programa governamental) — não apenas ao "campo" genérico
```

#### PROMPT 2 (Definição do Negócio):

No Terceiro Passo (Justificativa Técnica e Causal), ADICIONAR:

```
- Demonstre que o modelo de negócio é DEPENDENTE da expertise proprietária do beneficiário — o negócio não pode existir nem evoluir sem esta pessoa
- NUNCA usar o termo "consultoria" isolado — usar "prestação de serviços técnicos especializados" ou "soluções baseadas em metodologia proprietária"
- ANTI-PARADOXO: Se descrever qualquer elemento escalável (plataforma, certificação, treinamento), explicite IMEDIATAMENTE que esse elemento escala PORQUE o beneficiário o desenvolve e atualiza continuamente — não APESAR dele
- LIMITE DE SERVIÇOS: Máximo 2-3 serviços CORE hiperespecíficos (não 5+ serviços genéricos)
```

#### PROMPT 3 (Sumário Executivo):

a) Na seção de serviços:
```
> ⚠️ Limitar a 2-3 serviços CORE. Cada serviço deve demonstrar dependência da expertise proprietária do beneficiário. NUNCA listar serviços genéricos que "qualquer profissional qualificado" poderia oferecer.
```

b) Na seção do curso/programa de capacitação:
```
> ⚠️ O programa NÃO deve ser descrito como "capacitação para que outros façam o mesmo trabalho" — isso prova que a expertise é transferível e destrói o Prong 3. Descrever como "programa de implementação supervisionada" ou "formação técnica sob supervisão contínua do beneficiário, com atualização obrigatória de protocolos".
```

c) Na seção de setores:
```
> ⚠️ Limitar a 1-2 setores hiperespecíficos com vazio competitivo documentado. Setores genéricos ("healthcare", "technology", "education") são indefensáveis — especifique o nicho exato.
```

#### PROMPTS 4, 5 e 6 (Políticas Governamentais):

ADICIONAR ao final de cada prompt:

```
> ⚠️ Para cada política, demonstrar como o TRABALHO ESPECÍFICO DO BENEFICIÁRIO (não apenas a área de atuação) contribui para os objetivos da política. A cadeia causal obrigatória é:
> Expertise Proprietária do Beneficiário → Endeavor Específico → Política Pública Federal → Interesse Nacional
> Se esta cadeia não puder ser demonstrada, a política não deve ser incluída.
```

#### PROMPT 7 (Missão/Visão/Valores):

a) Na Missão:
```
- A missão deve explicitar que a empresa existe COMO VEÍCULO para a expertise proprietária do beneficiário alcançar impacto nacional — a empresa é o INSTRUMENTO, o beneficiário é o MOTOR
```

b) Na Visão:
```
- A visão de crescimento deve ser ATRAVÉS do beneficiário, não independente dele
- NUNCA descrever metas que impliquem que a empresa cresce sem a pessoa
- Toda projeção de crescimento deve incluir o papel contínuo do beneficiário
```

c) Nos Valores:
```
- Reduzir de 4 pares para 2 pares máximo
- Remover linguagem ESG genérica (o USCIS não avalia ESG)
- Cada valor deve conectar à expertise proprietária do beneficiário
```

#### PROMPT 8 (BLS):

SUBSTITUIR instrução de 4 códigos por:

```
Identifique **1 código ocupacional primário** (SOC code) que melhor capture o endeavor e **1 código secundário de suporte**. Máximo de 2.

Adicionalmente, produza um parágrafo explicando por que o endeavor do beneficiário TRANSCENDE as classificações padrão do BLS — isso reforça a unicidade do trabalho proposto e demonstra que nenhum código SOC individual captura a complexidade do que esta pessoa faz.

IMPORTANTE: Verifique que o SOC code selecionado:
- NÃO exige licença americana que o beneficiário não possui
- TEM salário mediano compatível com "advanced degree" (preferencialmente acima de $80K)
- TEM crescimento projetado acima da média nacional
- NÃO está classificado como "management consulting" (NAICS 5416) — use classificações de nicho
```

#### PROMPT 9 (Consolidação):

ADICIONAR seção obrigatória ao final da estrutura do documento consolidado:

```
### ARGUMENTO DE WAIVER (Prong 3) — SEÇÃO OBRIGATÓRIA

Esta seção DEVE estar presente em toda petição consolidada. Estrutura:

**A. Impraticabilidade do PERM:**
- O endeavor proposto envolve [escopo multi-empregador / empreendedorismo proprietário / pesquisa independente] — categorias estruturalmente incompatíveis com o modelo de oferta de emprego do PERM
- O beneficiário precisa de flexibilidade para [atender múltiplas organizações / pivotar a metodologia / expandir geograficamente] — nenhum empregador individual poderia patrocinar este escopo

**B. Urgência do Interesse Nacional:**
- O problema que o beneficiário resolve — [ESPECIFICAR com dados federais: BLS, Census, JOLTS] — se agrava enquanto o mercado espera
- Tempo médio de processamento do PERM: [X meses/anos] — durante este período, [QUANTIFICAR o dano: Y trabalhadores afetados, Z empresas sem acesso, W$ em perdas]
- Dados contemporâneos: [inserir estatísticas federais mais recentes]

**C. Unicidade da Expertise:**
- A combinação específica do beneficiário — [formação A] + [experiência B] + [competência linguística C] + [foco em nicho D] + [localização E] — não existe em forma empacotada no mercado de trabalho americano
- Dados BLS/OEWS demonstram que profissionais com [SOC code X] ganham mediana de $Y, mas NENHUM código SOC individual captura a intersecção de competências deste beneficiário
- O processo PERM, mesmo que concluído, não encontraria substituto adequado — a certificação de trabalho testa DISPONIBILIDADE de trabalhadores americanos, não EQUIVALÊNCIA de expertise proprietária
```

### FASE 3: ATUALIZAÇÃO DOS SaaS Evidence Architect (V1 e V2)

Nos arquivos `SaaS Evidence Architect — EB2-NIW Prong 1 Specialist.md` e `SaaS_Evidence_Architect_V2.md`:

1. **Inserir os HARD BLOCKS** (Fase 1) logo após "SYSTEM INSTRUCTIONS:" ou "CORE MISSION:"

2. **Na seção ANTI-SABOTAGE RULE**, expandir para:
```
CRITICAL ANTI-SABOTAGE RULES (expanded):

RULE 1 — BENEFICIARY INDISPENSABILITY:
NEVER describe the platform as capable of operating WITHOUT the beneficiary. Every feature, every module, every automation exists BECAUSE the beneficiary created and continuously refines it. The platform is the VEHICLE; the beneficiary is the ENGINE.

RULE 2 — PROHIBITED TERMS:
NEVER use: "standardized", "operates autonomously", "self-sustaining", "plug-and-play", "founder dependency: low", "client autonomy", "train-the-trainer", "white-label", "consulting" (triggers NAICS flag), "advisory services" (generic), "turnkey", "scalable without founder", "replicable by any professional".

RULE 3 — SCALABILITY = CONSEQUENCE, NOT SUBSTITUTE:
Every mention of scale MUST be anchored to the beneficiary's proprietary expertise. Template:
"The [platform/program/service] serves [X organizations] across [Y states] — this reach is made possible BY the beneficiary's proprietary [methodology/framework/protocols], which [he/she] continuously develops and updates. Without the beneficiary's ongoing research and quality oversight, the [platform/program] would [freeze/degrade/become obsolete]."

RULE 4 — NO CASE HISTORY:
NEVER reference previous petitions, RFEs, denials, or refiles. NEVER use: "previous filing", "prior petition", "corrected approach", "lessons learned from denial". Treat EVERY petition as ORIGINAL.

RULE 5 — PRONG 3 MANDATORY:
Every output MUST include a Prong 3 (waiver) defense section with three sub-arguments:
(a) PERM impracticability
(b) National urgency with federal data
(c) Expertise uniqueness — labor market void
```

3. **Na seção de PRICING**, adicionar nota:
```
> ⚠️ PRICING NAICS WARNING: Ensure pricing tiers do NOT use "consulting" in their names. Use: "Implementation Tier", "Technical Services Tier", "Expert-Guided Program" — never "Consulting Package" or "Advisory Retainer".
```

4. **No pipeline step 4 (product_spec_markdown)**, alterar a seção "Deployment Model":
```
## Deployment Model
> ⚠️ NEVER describe deployment as "autonomous" or "self-service". Use: "expert-guided implementation under the beneficiary's proprietary quality framework" — emphasizing that the beneficiary designs, oversees, and continuously improves the deployment protocols.
```

## REGRAS DE EXECUÇÃO

- NÃO reescrever os prompts inteiros — apenas INSERIR nos pontos indicados e AJUSTAR linguagem onde necessário
- NÃO alterar a estrutura geral, formatação ou numeração existente
- NÃO mexer nos emojis, headers ou estilo visual
- MANTER todo o conteúdo existente que não foi mencionado acima
- Os HARD BLOCKS (Fase 1) devem ser IDÊNTICOS em todos os arquivos — são regras transversais
- Após as alterações, produzir um RELATÓRIO RESUMO listando:
  - Arquivo modificado
  - O que foi inserido/alterado
  - Localização exata da alteração (após qual linha/seção)
  - Confirmação de que os HARD BLOCKS foram inseridos

## VALIDAÇÃO

Após aplicar todas as alterações, execute uma varredura em TODOS os arquivos modificados procurando por:
1. Qualquer ocorrência remanescente de termos proibidos (Bloco 1)
2. Qualquer referência a "denial", "negativa", "RFE anterior", "petição anterior"
3. Qualquer linguagem de escalabilidade sem ancoragem no beneficiário
4. Ausência de seção Prong 3

Reporte qualquer violação encontrada e corrija automaticamente.
