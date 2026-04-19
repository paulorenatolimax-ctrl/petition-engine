# Prompt para Claude Code — Atualização do Petition Engine

Cole este prompt no Claude Code para aplicar as correções no sistema de prompts do Petition Engine (os 9 prompts estratégicos na pasta EB-2 - ESTRATÉGIAS).

---

## CONTEXTO

Uma auditoria do sistema elaborador de petições EB-2 NIW (SaaS Petition Engine) revelou falhas críticas que geraram documentos autossabotadores — especificamente, o "Talent Anchor OS" de Cristine Correa foi usado pelo oficial do USCIS como prova CONTRA a petição. Os prompts SaaS Evidence Architect (V1 e V2) já foram corrigidos manualmente. Agora é preciso aplicar as mesmas correções nos 9 prompts estratégicos.

## TAREFA

Leia os 9 arquivos .md na pasta `EB-2 - ESTRATÉGIAS` (Prompt 1 a Prompt 9) e aplique SOMENTE estas correções cirúrgicas — não reescreva os prompts, apenas ajuste os pontos listados:

### 1. DIRETRIZ TRANSVERSAL — Adicionar a TODOS os 9 prompts

No topo de cada prompt, logo após o `## 🎯 Objetivo`, inserir:

```
> ⚠️ DIRETRIZ CRÍTICA — NEXO BENEFICIÁRIO ↔ ENDEAVOR:
> Todo output DEVE demonstrar que o endeavor é INSEPARÁVEL da expertise proprietária do beneficiário. NUNCA descrever o negócio como capaz de operar sem o beneficiário. Cada menção a escalabilidade DEVE ser ancorada na expertise da pessoa. NUNCA usar: "standardized", "operates autonomously", "self-sustaining", "plug-and-play", "consulting/consultoria" (o termo "consultoria geral" dispara flag no sistema VIBE/Dun & Bradstreet do USCIS), "train-the-trainer", "white-label", "client autonomy".
```

### 2. PROMPT 1 (National Importance) — Ajuste no Terceiro Passo

No Terceiro Passo (Justificativa Técnica de Interesse Nacional), adicionar ao final:

```
- **Demonstre por que a PESSOA do beneficiário é indispensável** para o impacto nacional descrito — não basta mostrar que a ÁREA é importante; mostre que ESTE INDIVÍDUO é insubstituível para gerar esse impacto
```

### 3. PROMPT 2 (Definição do Negócio) — Ajuste no Terceiro Passo

No Terceiro Passo (Justificativa Técnica e Causal), adicionar:

```
- Demonstre que o modelo de negócio é DEPENDENTE da expertise proprietária do beneficiário — o negócio não pode existir nem evoluir sem esta pessoa
- NUNCA usar o termo "consultoria" isolado — usar "prestação de serviços técnicos especializados" ou "soluções baseadas em metodologia proprietária"
```

### 4. PROMPT 3 (Sumário Executivo) — Ajustes críticos

a) Na seção de serviços, adicionar restrição:
```
> ⚠️ Limitar a 2-3 serviços CORE (não 5). Cada serviço deve demonstrar dependência da expertise proprietária do beneficiário.
```

b) Na seção do curso, adicionar:
```
> ⚠️ O curso NÃO deve ser descrito como "capacitação para que outros façam o mesmo trabalho" — isso prova que a expertise é transferível e destrói o Prong 3. Descrever como "programa de supervisão" ou "protocolo de implementação supervisionada".
```

c) Na seção de setores, adicionar:
```
> ⚠️ Limitar a 1-2 setores hiperespecíficos com vazio competitivo documentado (não 4 setores genéricos).
```

### 5. PROMPTS 4, 5 e 6 (Políticas Governamentais) — Ajuste em todos

Adicionar ao final de cada prompt:

```
> ⚠️ Para cada política, demonstrar como o TRABALHO ESPECÍFICO DO BENEFICIÁRIO (não apenas o negócio) contribui para os objetivos da política. A conexão deve ser: Beneficiário → Endeavor → Política Pública → Interesse Nacional.
```

### 6. PROMPT 7 (Missão/Visão/Valores) — Ajustes

a) Na Missão, adicionar:
```
- A missão deve explicitar que a empresa existe COMO VEÍCULO para a expertise proprietária do beneficiário alcançar impacto nacional
```

b) Na Visão, adicionar:
```
- A visão de crescimento deve ser ATRAVÉS do beneficiário, não independente dele. NUNCA descrever metas que impliquem que a empresa cresce sem a pessoa.
```

c) Nos Valores, reduzir de 4 pares para 2 pares e remover linguagem ESG genérica.

### 7. PROMPT 8 (BLS) — Ajuste

Alterar de 4 códigos para:
```
Identifique **1 código ocupacional primário** e **1 código secundário de suporte**. Adicionalmente, explique por que o endeavor do beneficiário TRANSCENDE as classificações padrão do BLS — isso reforça a unicidade do trabalho proposto.
```

### 8. PROMPT 9 (Consolidação) — Ajuste crítico

Adicionar seção obrigatória ao final da estrutura:

```
### 🔹 Argumento de Waiver (Prong 3) — OBRIGATÓRIO
- Por que o processo PERM é IMPRATICÁVEL para este endeavor (escopo multi-empregador)
- Urgência: que problema nacional se agrava enquanto espera 2-3 anos pelo PERM
- Vazio competitivo: ninguém nos EUA faz este trabalho específico (dados BLS/Census)
- Não-transferibilidade: por que a expertise do beneficiário não pode ser replicada por treinamento ou contratação
```

## REGRAS

- NÃO reescrever os prompts inteiros — apenas inserir/ajustar nos pontos indicados
- NÃO alterar a estrutura geral, formatação ou numeração
- NÃO mexer nos emojis, headers ou estilo visual
- MANTER todo o conteúdo existente que não foi mencionado acima
- Após as alterações, listar um resumo das mudanças feitas em cada arquivo
