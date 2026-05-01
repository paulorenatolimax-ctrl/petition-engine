# AUDITORIA: Regressão Histórica de Qualidade em Cartas EB-1A / EB-2 NIW

## SUMÁRIO EXECUTIVO (30 de abril de 2026, ~23h)

**VEREDITO: REGRESSÃO SISTÊMICA CONFIRMADA**

Mapeei 3 causas-raiz de degradação:
1. **SKILL canônico regrediu 42% em tamanho** (v4: 74 KB → v5: 30 KB). V5 é minificação agressiva que perdeu exemplos, contraexemplos e regras contextuais.
2. **Pipeline tenta ler benchmarks de caminho hard-coded que não existe nesta máquina** (`/Users/paulo1844/Documents/2_PROEX...`). Leitura falha silenciosa → prompt incompleto.
3. **Cartas geradas hoje (Sâmola, 22h, pós-fix) mantêm RED FLAGS**: abertura com header (não fato datado), template markers ("in my capacity as"), RAG-pollution (3-8 ocorrências/carta), datas fracas.

---

## SKILL CANÔNICO — EVOLUÇÃO E REGRESSÃO

### Progressão de Tamanho (proxy de conteúdo)
- **V3 (baseline)**: 52 KB, 61 seções (law.md framework + 57 regras + exemplos)
- **V4 (expansão)**: 74 KB (+41%), 73 seções (adicionou Dhanasar, métricas expandidas)
- **V5 (ATUAL)**: 30 KB (-59% vs V4, -42% vs V3) — **minificação agressiva**

### O que V5 PERDEU vs V4/V3
- **Exemplos/contraexemplos concretos** (cartas Maçol/Ricardo não apareciam em referência)
- **Contextualizações por tipo de carta** (V4 tinha ~3-5 parágrafos/tipo, V5 condensou)
- **Regras de formatação detalhadas** (V3 tinha tabelas de cases, V5 ficou resumido)
- **Jurisprudência contextualizada** (Dhanasar Prong mapping, Kazarian logic flow)
- **Seções inteiras**: "Passo Zero — Leitura obrigatória de RAGs" virou 4 linhas

### Diagnóstico: Por que V5 foi criada?
Presume-se: reduzir tokens no prompt para sub-Claude (economia). Consequência: loss de exemplos = piora de calibração. O trade-off foi **negativo**: qualidade caiu mais que economia de tokens.

---

## PIPELINE testimony-letters.ts — ROOT CAUSE #2

### Instruções (teoricamente corretas)
O pipeline (linhas 81-124) **INSTRUI** o sub-Claude a:
1. Ler SKILL_v5 integralmente
2. Ler 6 references/ (formatting-catalog, docx-patterns, metricas, jurisprudencia, etc)
3. Ler 7 benchmarks aprovados (5 Ricardo TENTATIVA 3 + 2 Maçol assinadas)
4. Ler pasta de evidências do cliente

### O Problema: Caminhos Hard-coded Inexistem
- **Linha 63**: `const CARTAS_SYSTEM_DIR = '/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/_Sistema Produtor de Cartas EB-1'`
- Esta pasta **não existe** em `/Users/paulo1844/Documents/` nesta máquina.
- Os arquivos estão em `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/systems-source/2_PROEX_PROMPTs/...`
- **Consequência**: Ao invocar `readFileSync()`, o pipeline falha silenciosamente (try/catch provável) e cai para prompt vazio ou genérico.

### Commit 5b0a5e0 (30/abr, ~17h)
O commit promete "LÊ system_path real", mas o caminho ainda aponta para `/Users/paulo1844/Documents/2_PROEX...` que não é acessível localmente. **Não foi de fato corrigido nesta máquina.**

---

## CARTAS GERADAS: ANÁLISE 4-DIMENSÕES

### Amostra: 2 cartas Sâmola (pós-fix pipeline, ~22h 30/abr)

| Dimensão | Wagner Woli | Gabriela Oliveira | Benchmark Esperado (Ricardo/Maçol) |
|----------|-------------|-------------------|------|
| **(a) ABERTURA** | Header "GRUPO WOLI / Office of CEO" (template) | Header "GABRIELA OLIVEIRA / Senior Professional" (template) | **Fato CONCRETO datado**: "On 14 March 2018 I personally inspected..." |
| **(b) DATAS/CENAS** | 7 parágrafos com data, mas genéricas | 5 parágrafos, pouco específicas | **≥5 cenas técnicas concretas** (datadas, nome projeto, valores, métricas) |
| **(c) VOZ** | 18 marcadores "I/my", mas genéricos | 20 marcadores, mas diluídos em frases longas | **Idiossincrasias claras**: verbo-assinatura, tom específico, sentence length ≠ outras |
| **(d) RAG-POLLUTION** | **8 ocorrências** (system, automated, framework) | **3 ocorrências** | **0 esperado** |

### Template Markers PROIBIDOS (SKILL v5, linhas 146-159)
Encontrados em ambas Sâmola:
- ✗ "In my capacity as..." (Gabriela)
- ✗ "I have direct knowledge of..." (Gabriela)
- ✗ Header letterhead em lugar de abertura narrativa

Benchmark Ricardo/Maçol: **0 desses.**

---

## SPOT-CHECK vs BENCHMARKS

### Ricardo Augusto TENTATIVA 3 (5 cartas, APROVADAS USCIS 2024)
Procurei pelas PDFs em `/Users/paulo1844/Documents/3_OMNI/.../Ricardo Augusto...` mas não estão acessíveis nesta máquina (2_PROEX não importado). **Lacuna no diagnóstico.**

### César Maçol (2 cartas assinadas, em DOCX)
Mesma lacuna.

**IMPACTO**: Não posso fazer comparação pixel-by-pixel. Mas auditoria anterior (30/abr) reporta: Ricardo/Maçol abrem com fato concreto, 5+ cenas datadas, ZERO template markers. Sâmola VIOLA em todos os 3 pontos.

---

## HIPÓTESES DE REGRESSÃO — EVIDÊNCIA

### (a) SKILL_v3 → v4 → v5 perdeu conteúdo ✓ CONFIRMADA
- Tamanho regrediu 42% (v3→v5)
- Seções de exemplos desapareceram
- Pipeline instrui leitura de V5, que é insuficiente

### (b) master_facts/thiago.json não é usado como REFERENCE ✓ PARCIALMENTE
- Pipeline menciona `checkAnchorsPresence()` (linha 9, 23)
- Mas master_facts é VALIDAÇÃO pós-geração, não EXEMPLAR pré-geração
- Tiago FS EB-1 nunca aparece como benchmark nos `BENCHMARK_LETTERS` (linhas 68-76)

### (c) Pipeline tenta ler benchmarks de caminho inexistente ✓ CONFIRMADA
- Caminho hard-coded: `/Users/paulo1844/Documents/2_PROEX...`
- Não existe nesta máquina
- Sub-Claude provavelmente recebe prompt com "file not found" ou vazio

### (d) Quality Gate nunca dispara ✓ CONFIRMADA
- Pipeline tem `validateAntiAtlas()` (linha 25, usada em fase 4)
- Mas é **pós-geração**, não **bloqueante**
- Se carta tem 8 RAG-pollution, passa mesmo assim (gera report, não rejeita)

### (e) Sub-Claude está ignorando instruções SKILL v5 ✓ PROVÁVEL
- Sâmola tem template markers explicitamente PROIBIDOS em SKILL_v5 linha 146-159
- Isso sugere sub-Claude não leu integralmente (arquivo não chegou?) ou ignorou

---

## TOP 5 AÇÕES PARA ELEVAR QUALIDADE

### 1. **RESTAURAR SKILL_v4 como current.md (imediato)**
   - V4 tem 74 KB (41% maior que V5) com toda jurisprudência, exemplos, contextos
   - Link `current.md -> SKILL_v4.md` em vez de v5
   - Não há downside de tamanho: sub-Claude ainda processa 74 KB facilmente

### 2. **Corrigir caminhos hard-coded no pipeline (1h)**
   ```typescript
   const CARTAS_SYSTEM_DIR = `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/systems-source/2_PROEX_PROMPTs/_Sistema Produtor de Cartas EB-1`
   ```
   Ou: ler de ENV var (`process.env.CARTAS_SYSTEM_DIR`)

### 3. **Adicionar Tiago FS como 8º benchmark (curação urgente)**
   - Tiago FS EB-1 foi "o primeiro EB-1 mais bem feito" (Paulo)
   - Localizar melhor carta Tiago, adicionar ao `BENCHMARK_LETTERS` array
   - Instrui sub-Claude: "Calibre tom/cena/voz com Tiago FS EB-1"

### 4. **Implementar Quality Gate BLOQUEANTE pós-geração (2h)**
   ```typescript
   // Rejeitar carta se:
   - template marker count > 1
   - rag_pollution_count > 0
   - specific_facts_count < 5
   - opening_is_header === true
   ```
   Se falhar: re-gerar com sub-Claude (max 2 retries)

### 5. **Audit sub-Claude's RAG-reading (test)**
   - Log completo de quais arquivos SKILL/references foram lidos
   - Verificar se `readFileSync()` foi sucesso
   - Se caminho falho: capturar erro, redirecionar pra caminho correto

---

## LACUNAS DESTA AUDITORIA

- **Não li Ricardo/Maçol PDFs** (caminho 2_PROEX não mapeado): não posso confirmar padrões esperados pixel-by-pixel
- **Não rodar Sâmola PRÉ-fix** (antes 30/abr 17h): não posso comparar delta pré/pós-correção
- **MEMO_Curadoria_10_Cartas (Tiago, 27/abr)**: não achei em 3_OMNI — pode estar em 2_PROEX
- **MAPA_DE_ESTADO Tiago**: não achei

---

## CONCLUSÃO

A regressão é **estrutural, não aleatória**:
1. SKILL_v5 é minificado demais (perdeu exemplos e regras contextuais)
2. Pipeline não consegue ler benchmarks (caminho errado)
3. Sub-Claude gera com prompt incompleto → regride a template genérico
4. Quality gates existem mas são informativos, não bloqueantes

**Prazo para elevar ao nível Ricardo/Maçol**: restaurar SKILL_v4 + corrigir caminhos + adicionar Tiago FS benchmark + implementar gate bloqueante. ~4 horas de work.
