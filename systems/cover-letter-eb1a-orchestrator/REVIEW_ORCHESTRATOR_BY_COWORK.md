# REVISÃO DO ORQUESTRADOR — POR COWORK
## Validação contra a produção real da VF Vitória Carolina
## 02/04/2026

---

## RESPOSTA ÀS 8 PERGUNTAS DO PAULO

---

### 1. A DIVISÃO EM 7 FASES ESTÁ CORRETA? FALTOU ALGUMA FASE?

**PARCIALMENTE CORRETA — mas com gaps importantes.**

As 7 fases do orquestrador:
```
Fase 0 — Inventário e Mapeamento         ✅ CORRETA
Fase 1 — Parte I (Intro + Índice)        ✅ CORRETA
Fase 2 — Step 1: Critérios               ✅ CORRETA
Fase 3 — Step 2: Final Merits            ✅ CORRETA
Fase 4 — Consolidação (XML Merge)        ✅ CORRETA
Fase 5 — Thumbnails                      ⚠️ PARCIAL (ver abaixo)
Fase 6 — Separation of Concerns          ⚠️ NÃO EXISTIA no v5/v6
```

**O que falta:**

a) **FASE ENTRE 0 E 1 — PLANO ESTRATÉGICO**: No sistema real (ARCHITECT + PROTOCOLO_DE_INTERACAO), existe uma fase explícita de **Plano Estratégico** que Paulo aprova ANTES de qualquer produção. O plano define: quais critérios, quais evidências em cada critério, riscos, gaps, campo definido. Sem essa aprovação, NÃO se começa a produzir. No orquestrador, a Fase 0 pula direto do inventário para a produção.

**CORREÇÃO SUGERIDA:** Inserir **Fase 0.5 — Plano Estratégico** entre Inventário e Parte I.

b) **FASE ENTRE 4 E 5 — VALIDAÇÃO AUTOMATIZADA (validate_final_docx.py)**: O sistema v6 tem um `validate_final_docx.py` que DEVE rodar após o merge e ANTES de entregar. Verifica forbidden content, proporções, footnotes, artefatos de produção, etc. No orquestrador, essa validação não aparece como fase separada.

**CORREÇÃO SUGERIDA:** Inserir **Fase 4.5 — Validação Automatizada**.

c) **FASE 5 (Thumbnails) deveria ser ANTES do merge, não depois**: No DOCX_PRODUCTION_PIPELINE.md, o pipeline real é: (1) gerar thumbnails, (2) inserir nos evidence blocks, (3) converter inline→anchor, (4) DEPOIS fazer merge. Se você insere thumbnails depois do merge, precisa manipular um .docx de 80MB+ em vez de vários pequenos. O orquestrador inverte essa ordem.

**CORREÇÃO SUGERIDA:** Thumbnails ANTES da Fase 4 (merge), não depois.

d) **Fase 6 (Separation of Concerns)**: NÃO existia no sistema v5/v6 que produziu a Vitória. É algo novo que o Claude Code parece estar propondo. Pode ser útil, mas não é "engenharia reversa" — é feature nova. Documentar como tal.

---

### 2. O COMANDO claude -p DA FASE 1 (PART I) GERA O QUE EU REALMENTE GEREI?

**APROXIMADAMENTE — mas com omissões.**

O que o orquestrador pede na Fase 1 está razoável. O que está **faltando**:

a) **Sumário dos critérios com faixas de evidência**: Na VF da Vitória, a Parte I contém um quadro detalhado mostrando não só quais critérios, mas quais faixas de evidência em cada um (C1: Ev 8-15, C2: Ev 16-23, etc.). O prompt do orquestrador menciona "sumário dos critérios" mas não especifica esse nível de detalhe.

b) **Legal Framework é mais extenso do que 1 parágrafo por item**: Na VF, o Legal Framework da Parte I é substancial — Kazarian com análise detalhada do two-step, PA-2025-16 com explicação da mudança para non-discretionary, Mukherji com implicações. O prompt simplifica demais.

c) **Transição para STEP 1**: A VF tem parágrafo de transição explícito conectando a Parte I ao primeiro critério. O prompt não menciona.

d) **Palavras alvo "5.000-8.000"**: A VF tem ~7.984 palavras na Parte I (7,4%). Está na faixa, mas o mínimo deveria ser **6.000** (não 5.000) para acomodar o Legal Framework completo.

---

### 3. NA FASE 2, EU REALMENTE RODEI 1 SESSÃO POR CRITÉRIO? OU AGRUPEI ALGUNS?

**1 SESSÃO POR CRITÉRIO é correto para critérios pequenos. Critérios grandes precisam de MÚLTIPLAS sessões.**

O que realmente aconteceu na Vitória:

| Critério | Sessões | Divisão |
|----------|---------|---------|
| C1 | 1 sessão | Arquivo único |
| C2 | 1 sessão | Arquivo único |
| C3 | 2-3 sessões | Parte A + Parte B (11 evidências) |
| C4 | 1 sessão | Arquivo único |
| C5 | 3 sessões | Parte A + Parte B + Parte C (15 evidências) |
| C6 | 1 sessão | Arquivo único |
| C7 | 1-2 sessões | Depende do número de evidências |
| C8 | 2 sessões | Parte A + Parte B + Conclusão (confirmado na VF) |

**O orquestrador está CORRETO** sobre a regra de divisão (4- = único, 5-8 = A+B, 9+ = A+B+C), mas precisa ser explícito que **cada Parte é uma sessão `claude -p` separada**. Não é 1 sessão que gera A+B+C de uma vez — são 2 ou 3 sessões separadas, onde cada uma lê o output da anterior para manter continuidade.

**CORREÇÃO SUGERIDA:** Adicionar ao prompt de critérios divididos: "Leia também [OUTPUT_DIR]/CL_C[N]_A.docx para manter continuidade com a Parte A" no prompt da Parte B.

---

### 4. A FASE 3 (STEP 2) — EU FIZ EM 1 SESSÃO OU DIVIDI EM A/B/C?

**DEVE ser dividido — 29.484 palavras não cabem em 1 sessão.**

Na VF da Vitória, o STEP 2 tem 29.484 palavras (26,9% do documento). Isso é IMPOSSÍVEL em uma única sessão `claude -p`.

**O que o orquestrador deveria fazer:**

```
Sessão 3A: SEÇÃO A (Enquadramento) + SEÇÃO B (Síntese)     → ~8.000-10.000 palavras
Sessão 3B: SEÇÃO C (Timeline) + SEÇÃO D (Cross-Reference)  → ~8.000-10.000 palavras
Sessão 3C: SEÇÃO E (Benefício Prospectivo) + SEÇÃO F (Declaração Pessoal) → ~8.000-10.000 palavras
```

**CORREÇÃO SUGERIDA:** Dividir a Fase 3 em 3 sessões explícitas (3A, 3B, 3C), cada uma com seu prompt e referência aos outputs anteriores.

O prompt atual diz "Palavras alvo: 20.000-30.000" — isso é o alvo TOTAL do STEP 2, mas nenhuma sessão individual vai conseguir gerar 20.000+ palavras de qualidade. Cada sessão deveria visar ~8.000-10.000.

---

### 5. A FASE 4 (MERGE) — EU USEI XML MERGE OU OUTRO MÉTODO?

**O orquestrador está CORRETO sobre o XML merge.**

O DOCX_PRODUCTION_PIPELINE.md do sistema v5/v6 especifica explicitamente:

```
REGRA: NÃO usar docxcompose (perde imagens)
Usar merge no nível XML:
1. Unzip todos os .docx
2. Usar o primeiro como base
3. Copiar media, atualizar rIds, copiar body elements
4. Repack como ZIP
```

A Fase 4 do orquestrador reproduz isso fielmente. **APROVADO.**

O que está **faltando** no prompt da Fase 4:

a) **Conversão wp:inline → wp:anchor**: Após o merge, imagens que foram inseridas como `wp:inline` precisam ser convertidas para `wp:anchor` com `wrapSquare` para não deslocar o layout das tabelas de evidence blocks. O DOCX_PRODUCTION_PIPELINE menciona isso como passo 3 do pipeline.

b) **cantSplit = true** nas rows de tabelas: Precisa ser aplicado para impedir que evidence blocks quebrem entre páginas.

c) **Tabelas com largura 100% e centralização**: `tblW w="5000" type="pct"` + `jc val="center"`.

---

### 6. A TABELA DE CALIBRAÇÃO BATE COM O QUE EU VI NA VF?

**PARCIALMENTE — precisa de correções.**

Comparação orquestrador vs. VF real:

| Critério | Orquestrador | VF Real | Diferença |
|----------|-------------|---------|-----------|
| C1 Premiações | 3.000-5.000 | 4.671 | ✅ Dentro da faixa |
| C2 Associações | 2.000-4.000 | 2.386 | ✅ Dentro da faixa |
| C3 Material Pub. | 8.000-12.000 | 9.521 | ✅ Dentro da faixa |
| C4 Julgamento | 3.000-5.000 | 4.585 | ✅ Dentro da faixa |
| C5 Contrib. Orig. | 8.000-12.000 | 10.403 | ✅ Dentro da faixa |
| C6 Artigos Acad. | 3.000-6.000 | 4.735 | ✅ Dentro da faixa |
| C7 Exposições | 3.000-8.000 | 3.732 | ✅ Dentro da faixa |
| C8 Liderança | 5.000-10.000 | **8.318** | ✅ Dentro da faixa |

**As faixas estão OK.** O orquestrador acertou as calibrações. O único dado que estava ERRADO na minha engenharia reversa anterior era o C8 — eu tinha calculado 411 palavras (0,3%) porque usei a posição errada (só a conclusão do C8, sem as Partes A e B). O real é **8.318 palavras (10,9%)**, dividido em Parte A + Parte B + Conclusão.

**CORREÇÃO na tabela do orquestrador:**
- C8 % do total: deveria ser "8-15%" (está correto no orquestrador)
- As métricas gerais estão OK

**PORÉM**, os dados das MÉTRICAS DE CALIBRAÇÃO no final do orquestrador têm um erro:
- "Palavras por evidence block: 150-400" — isso é muito pouco. Na VF, cada evidence block com argumentação completa tem 400-1.200 palavras (incluindo as 3-5 subseções argumentativas). Os 150-400 são só o metadata do evidence block, não a argumentação.

**CORREÇÃO SUGERIDA:** "Palavras por evidence block + argumentação: 500-1.500" ou detalhar que 150-400 é só o bloco de metadata e que a argumentação adicional é 300-1.000 por evidência.

---

### 7. TEM ALGUMA COISA QUE EU FIZ QUE NÃO ESTÁ NO ORQUESTRADOR?

**SIM — várias coisas importantes:**

a) **Mapa Semântico (SEMANTIC_CROSS_REFERENCE_MAP.md)**: O sistema v5/v6 exige construir um dicionário entidade→evidência ANTES da produção (marcas, pessoas, documentos financeiros, veículos de mídia, empresas, credenciais). Isso preveniu 7+ erros de referência cruzada no caso Renato. O orquestrador NÃO menciona isso.

b) **Auto-check de densidade contra benchmark**: PROTOCOLO_DE_INTERACAO Regra 5 — antes de entregar cada parte, comparar parágrafos/evidências/subseções/tabelas contra os benchmarks (Carlos/Bruno). O orquestrador não tem isso.

c) **Validação mecânica antes de entregar cada parte (Regra 7)**: Forbidden content check, evidence bold check, color check, table border check, abbreviation check — tudo isso roda ANTES de entregar cada .docx individual, não só no final.

d) **Listing pré-produção (Regra 3)**: Antes de cada critério, listar explicitamente o que foi lido (template, benchmarks, evidências). Isso é mecanismo de controle de qualidade que o orquestrador pula.

e) **O PROTOCOLO_DE_INTERACAO inteiro**: As 8 regras de interação (nunca avançar sem aprovação, perguntar quando em dúvida, listar o que leu, nunca gerar critério inteiro de uma vez, auto-check, inventário exaustivo, validação mecânica, buscar nas evidências) — nenhuma dessas regras aparece nos prompts do orquestrador. Elas precisam estar DENTRO dos prompts `claude -p`, porque cada sessão é independente e não herda regras de sessões anteriores.

f) **FORBIDDEN_CONTENT completo nos prompts**: O orquestrador menciona superficialmente "NUNCA satisfeito/satisfaz" e "NUNCA seção Objeções Antecipadas", mas são **11 categorias** de proibições. As outras 9 categorias (nomes proibidos, voz/pessoa, termos jurídico/adjudicativo, entidades planejadas, formatação, fontes, conteúdo factual, artefatos de produção, URLs, substituição segura) precisam estar referenciadas.

g) **Conversão de footnotes**: O sistema v6 especifica que footnotes devem ser nativos do Word (`<w:footnoteReference>` + `footnotes.xml`), em português brasileiro. O orquestrador não menciona footnotes em nenhuma fase.

h) **Tabelas com bordas APENAS horizontais**: O orquestrador menciona isso na Fase 2 ("Bordas APENAS horizontais") mas não enfatiza nos prompts das outras fases. Isso é regra GLOBAL.

---

### 8. TEM ALGUMA COISA NO ORQUESTRADOR QUE EU NÃO FIZ?

**SIM:**

a) **Fase 0 gerando JSON**: No sistema real, o inventário era feito em texto/tabela dentro do chat, com Paulo validando interativamente. O formato JSON estruturado (`_inventory.json`) é uma **boa melhoria** para automação, mas não é como foi feito na Vitória. **MANTER — é melhor que o original.**

b) **Fase 5 — insert_thumbnails.py como script externo**: No sistema real, thumbnails eram inseridos DURANTE a produção de cada critério (evidence blocks com thumbnail na coluna 0). Ter um script separado pós-merge é uma abordagem diferente. Pode funcionar, mas:
   - O script referenciado (`/Users/paulo1844/.../insert_thumbnails.py`) está na pasta do sistema de résumés, não do EB-1A. Existe mesmo?
   - A lógica de pular certificados de tradução (usar pág 2 em vez de pág 1) precisa estar no script.

c) **Fase 6 — Separation of Concerns**: Não existia no v5/v6. É proposta nova do Claude Code. **Pode ser boa** como revisão final automatizada, mas:
   - O arquivo `SEPARATION_OF_CONCERNS.md` referenciado — existe?
   - O arquivo de "Pareceres da Qualidade" no Obsidian — o Claude Code tem acesso a isso?
   - Isso substitui ou complementa o `validate_final_docx.py`?

d) **Métricas "Thumbnails: 90"**: Na VF, o documento tem 83 evidências, não 90 thumbnails. O número de thumbnails = número de evidências com PDF (algumas podem não ter PDF). **CORRIGIR para "= número de evidências com documento".**

---

## RESUMO: CLASSIFICAÇÃO POR PRIORIDADE

### CRÍTICO (deve corrigir antes de implementar):
1. **Inserir Fase 0.5 — Plano Estratégico** (sem isso, produz no escuro)
2. **Dividir Fase 3 (STEP 2) em 3 sessões** (impossível em 1 shot)
3. **Mover thumbnails ANTES do merge** (ou documentar que o script post-merge funciona)
4. **Adicionar mapa semântico à Fase 0** (previne erros de referência cruzada)
5. **Incluir FORBIDDEN_CONTENT completo nos prompts** (11 categorias, não 2)
6. **Incluir regras do PROTOCOLO nos prompts** (cada sessão é independente)

### IMPORTANTE (melhorias significativas):
7. Adicionar validação automatizada (validate_final_docx.py) como fase
8. Adicionar auto-check de densidade nos prompts de critério
9. Especificar footnotes nativos do Word em português
10. Corrigir "palavras por evidence block" para incluir argumentação
11. Cada Parte (A/B/C) de critério dividido = 1 sessão `claude -p` separada, com referência ao output anterior

### DESEJÁVEL (refinamentos):
12. Referência ao LEGAL_FRAMEWORK_2026.md em cada prompt de critério
13. wp:inline → wp:anchor no prompt de merge
14. cantSplit/tblW/jc no prompt de merge
15. Verificar existência dos scripts referenciados (insert_thumbnails.py, SEPARATION_OF_CONCERNS.md)

---

*Revisado por Cowork em 02/04/2026, baseado nos 26 arquivos do sistema v5/v6 + análise direta da VF validada pela Vitória Carolina (865.490 chars / 85.819 palavras / ~200 páginas).*
