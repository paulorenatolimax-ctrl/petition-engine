# MAPA DE ERROS — Lições das Conversas com Bots (Perplexity / Claude Sonnet / Notebook LM)

Este documento mapeia os erros reais encontrados durante a produção do caso Renato Silveira, extraídos das conversas com Perplexity e Notebook LM. Serve como **anti-padrão**: o que NÃO fazer.

---

## CATEGORIA 1: DADOS FACTUAIS ERRADOS

### Erro 1.1 — População inflada
- **O que aconteceu**: Carta usou "cidade de 120 mil habitantes" para São Sebastião do Paraíso
- **Dado real**: Censo IBGE 2022 = 71.796; Estimativa 2024 = 74.742
- **Gravidade**: 60% acima da realidade. Verificável em 10 segundos no Google.
- **Lição**: NUNCA usar número demográfico sem verificar IBGE. Na dúvida, use faixa: "approximately 72,000 inhabitants".

### Erro 1.2 — "galo" em vez de "galpão"
- **O que aconteceu**: "galo de 100m" quando deveria ser "galpão de 100 m²"
- **Gravidade**: Erro de português básico em documento jurídico formal.
- **Lição**: Revisar CADA parágrafo. LLMs introduzem erros de digitação/confusão de palavras.

### Erro 1.3 — Inconsistência interna na mesma carta
- **O que aconteceu**: "120 mil habitantes" no início, "acima de 70k habitantes" no meio da mesma carta
- **Gravidade**: Auto-contradição detectável por qualquer leitor atento
- **Lição**: CTRL+F virtual em todo o documento para cada número importante.

---

## CATEGORIA 2: NÚMEROS CONTRADITÓRIOS

### Erro 2.1 — 4 números para o mesmo indicador
- **O que aconteceu**: Seguidores de Júlio Caleiro variaram entre:
  - 1.756.000 (uma versão)
  - 2.000.000 ("hoje tem 2 MILHÕES")
  - 2.077.000 (na carta)
  - 3.000.000 (total plataformas)
- **Gravidade**: Oficial do USCIS vê 4 números diferentes = credibilidade zero
- **Lição**: Escolha UM número com data de corte. Use o MESMO em todo documento. Formato: "over [N] followers as of [Month/Year]"

### Erro 2.2 — Matemática do quadro agregado não fecha
- **O que aconteceu**: "Receita Direta Gerada R$ 2,22M-2,68M" mas componentes somados dão R$ 7M+
- **Gravidade**: Qualquer pessoa com calculadora detecta
- **Lição**: SEMPRE verificar que subtotais = soma dos componentes. Se não fecha, explicar a diferença.

---

## CATEGORIA 3: CREDENCIAIS SEM VERIFICAÇÃO

### Erro 3.1 — Título profissional inventado
- **O que aconteceu**: Júlio Caleiro descrito como "nutricionista, bacharel em Nutrição pela Universidade de Franca"
- **Dado verificado**: Naturopata CRT 17.447, Terapeuta Alternativo RDA-150381BR. NENHUM registro de bacharelado em Nutrição no bloco verificado.
- **Gravidade**: Se USCIS pesquisa e não acha diploma = fraude documental potencial
- **Lição**: Só usar títulos que existem em DOCUMENTO comprovador. Se não tem documento, use descrição genérica: "health and wellness professional".

### Erro 3.2 — "CEO" sem contrato social
- **Risco potencial**: Usar "CEO" quando o contrato social diz "Sócio-Administrador"
- **Lição**: Copiar o cargo EXATAMENTE como aparece no contrato social. Se quiser usar "CEO" como tradução, note: "Managing Partner (equivalent to CEO)".

---

## CATEGORIA 4: ATRIBUIÇÃO CAUSAL EXAGERADA

### Erro 4.1 — "100% do crescimento atribuível"
- **O que aconteceu**: "Impacto Renato – 100% crescimento audiência atribuível a Renato"
- **Gravidade**: Claim absoluta indefensável. Nenhum crescimento de audiência é 100% atribuível a uma pessoa.
- **Lição**: Usar linguagem forte mas defensável:
  - ✅ "was the primary architect of"
  - ✅ "played a decisive role in"
  - ✅ "Under [Name]'s direct guidance, the audience grew from [X] to [Y]"
  - ❌ "100% attributable to"

### Erro 4.2 — Confundir receita da empresa com impacto do beneficiário
- **O que aconteceu**: GMV total da plataforma Eduzz (R$ 5-10M) atribuído implicitamente como receita gerada pelo Renato
- **Lição**: SEMPRE separar:
  - "Total company revenue: R$ [X]"
  - "Revenue directly attributed to [Beneficiary]'s contributions: R$ [Y]"
  - Se não é possível separar, usar: "Within this context, [Beneficiary]'s products/methods accounted for approximately [Z]% of total operations"

---

## CATEGORIA 5: PROBLEMAS DE MÉTODO

### Erro 5.1 — Bloco "Verificado" misturado com especulação
- **O que aconteceu**: Bloco de "Informação Verificada" sobre Júlio não mencionava bacharelado, mas o CV subsequente adicionou o título
- **Lição**: O que entra no résumé = o que tem documento. Zero exceção.

### Erro 5.2 — Números ultra-específicos sem fonte
- **O que aconteceu**: "Eduzz – 300.000 usuários ativos, 50.000 produtores, faturamento R$ 80-120 milhões/mês, market share 25-28%"
- **Gravidade**: Parece equity research mas não tem fonte pública verificável
- **Lição**: Se não tem fonte → use ordem de grandeza: "one of Brazil's largest digital payment and education platforms, with hundreds of thousands of users". Se tem fonte → cite entre parênteses.

### Erro 5.3 — Aceitar "está pronto para submissão" sem verificar
- **O que aconteceu**: Bot declarou "todas as cartas perfeitamente alinhadas" quando havia erros crassos
- **Lição**: NUNCA confiar em auto-avaliação de outro LLM. SEMPRE verificar independentemente.

---

## CATEGORIA 6: ERROS ESTRUTURAIS

### Erro 6.1 — Seções vazias ou com placeholder
- **Risco**: Incluir "[EVIDÊNCIA A COLETAR]" no résumé final
- **Lição**: Se não tem a evidência, NÃO inclua a seção. Seção sem evidência = fraqueza exposta.

### Erro 6.2 — Duplicação de evidence blocks
- **Risco**: A mesma matéria da IstoÉ aparece duas vezes (uma na seção C3, outra na C5)
- **Lição**: Cada evidência aparece UMA VEZ com seu evidence block completo. Nas demais seções, cross-reference: "As documented in the Published Material section above..."

### Erro 6.3 — Misturar idiomas
- **Risco**: Parágrafos em português no meio de documento em inglês
- **Lição**: O résumé é em INGLÊS. Nomes próprios e termos brasileiros mantêm grafia original (itálico). Tudo mais em inglês.

---

## RESUMO: CHECKLIST ANTI-ERROS

Antes de entregar QUALQUER seção, verificar:

| # | Pergunta | Se SIM |
|---|---------|--------|
| 1 | Algum número veio da minha memória e não de documento? | → [VERIFICAR] |
| 2 | O mesmo número aparece diferente em outra seção? | → CORRIGIR |
| 3 | Algum título/credencial não tem diploma/certificado comprovador? | → REMOVER |
| 4 | Alguma claim usa "100%", "único", "nenhum outro"? | → SUAVIZAR |
| 5 | Receita total da empresa está sendo atribuída ao beneficiário? | → SEPARAR |
| 6 | Algum placeholder [A DEFINIR] ainda está no texto? | → RESOLVER OU REMOVER |
| 7 | Tem texto em português no meio de seção em inglês? | → TRADUZIR |
| 8 | Alguma URL foi inserida sem verificar? | → VERIFICAR OU REMOVER |
| 9 | Algum dado veio de "o outro bot disse" sem documento? | → DESCARTAR |
| 10 | A seção está mais rasa que o benchmark? | → EXPANDIR |

---

*Mapa de Erros v1.0 — 21/02/2026*
*Fonte: Análise de conversas Perplexity + Notebook LM sobre caso Renato Silveira*
