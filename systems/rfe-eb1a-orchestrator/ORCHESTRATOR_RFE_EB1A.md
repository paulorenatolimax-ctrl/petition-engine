# ORQUESTRADOR DE RESPOSTA RFE EB-1A — Petition Engine
## Pipeline Multi-Fase (Engenharia Reversa da VF Marcelo Góis)
## Versão: 1.0 — Abril 2026

---

## DIFERENÇAS FUNDAMENTAIS: RFE vs COVER LETTER

| Aspecto | Cover Letter | RFE Response |
|---------|-------------|-------------|
| **Objetivo** | Provar critérios | Refutar objeções do oficial |
| **Tom** | Persuasivo, positivo | Respeitoso, técnico, contra-argumentativo |
| **Estrutura** | Critérios na ordem de força | Critérios na ordem das objeções do oficial |
| **Step 2** | Holistic analysis (no final) | Colocado NO INÍCIO (soft intro que Marcelo atende tudo) |
| **Evidências** | Todas originais | Reuso + novas evidências de reforço |
| **Tech** | python-docx (ou docx-js) | **Node.js + docx-js** (melhor pra thumbnails + footnotes) |
| **Merge** | XML merge (sem docxcompose) | **docxcompose** (Python) — funcionou no Marcelo |
| **Linguagem** | PT-BR (corpo) + EN (legal) | PT-BR (corpo) + EN (legal) |

---

## PIPELINE DE 8 FASES

```
Fase 0   — Análise da RFE (decomposição das objeções do oficial)
Fase 0.5 — Plano Estratégico (priorização + mapeamento evidências)
Fase 1   — Geração por Critério (1 script/sessão por critério questionado)
Fase 2   — Step 2: Final Merits (PRIMEIRO no documento, não último)
Fase 3   — Thumbnails (inserir em cada .docx individual)
Fase 4   — Aglutinação (merge Python — docxcompose ou XML)
Fase 4.5 — Validação + Auditoria (6 rodadas no Marcelo)
Fase 5   — SOC 4 Agentes (4 personas simultâneas)
```

---

## FASE 0 — ANÁLISE DA RFE

**Input:** RFE traduzida + cover letter original + evidências
**Output:** `_rfe_analysis.json` + `_rfe_decomposition.md`

```
claude -p "
Leia a RFE traduzida: [RFE_TRANSLATED_PATH]
Leia a cover letter original (se existir): [ORIGINAL_CL_PATH]
Leia o inventário de evidências: [EVIDENCE_INVENTORY_PATH]

TAREFA: Decompor a RFE em objeções específicas por critério.

Para CADA critério questionado pelo oficial:
1. Transcrever a objeção EXATA do oficial (word-for-word em inglês)
2. Identificar o TIPO de objeção:
   - Falta de evidência documental
   - Evidência insuficiente/genérica
   - Interpretação regulatória divergente
   - Evidência ignorada pelo oficial
3. Mapear evidências EXISTENTES que respondem à objeção
4. Identificar NOVAS evidências necessárias (gaps)
5. Classificar FORÇA de resposta: FORTE / MÉDIA / FRACA

Salve como JSON:
{
  'case_number': '[IOE...]',
  'officer_id': '[XX0000]',
  'rfe_date': '[YYYY-MM-DD]',
  'deadline': '[YYYY-MM-DD]',
  'criteria_questioned': [
    {
      'criterion': 'C1',
      'criterion_name': 'Prêmios e Distinções',
      'cfr_reference': '8 C.F.R. § 204.5(h)(3)(i)',
      'officer_objection': '[TRANSCRIÇÃO EXATA]',
      'objection_type': 'falta_evidencia|insuficiente|interpretacao|ignorada',
      'existing_evidence': ['E17', 'E18', 'E19'],
      'new_evidence_needed': ['E108', 'E109'],
      'response_strength': 'FORTE|MÉDIA|FRACA',
      'priority': 1
    },
    ...
  ],
  'original_evidence_count': 107,
  'new_evidence_count': 4,
  'total_criteria_questioned': 7
}

Salve: [OUTPUT_DIR]/_rfe_analysis.json

REGRA: NUNCA confrontar o oficial. Padrão obrigatório:
'The record contains Evidence XX, which demonstrates...'
NUNCA: 'The officer erred...', 'The officer ignored...'
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 0.5 — PLANO ESTRATÉGICO

**Input:** `_rfe_analysis.json` + evidências
**Output:** `_rfe_strategic_plan.md` (REQUER APROVAÇÃO DO PAULO)

```
claude -p "
Leia: [OUTPUT_DIR]/_rfe_analysis.json
Leia o sistema: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/

TAREFA: Plano Estratégico para Resposta RFE.

CONTEÚDO OBRIGATÓRIO:
1. PRIORIZAÇÃO DOS CRITÉRIOS (por força de resposta):
   - #1 ALTA: critérios com evidência FORTE (resposta irrefutável)
   - #2 MÉDIA: critérios com evidência parcial (precisa reforço)
   - #3 BAIXA: critérios com pouca evidência (manter com defesa mínima)

2. MAPA DE EVIDÊNCIAS POR CRITÉRIO:
   - Evidências existentes (da cover letter original)
   - Evidências novas (obtidas para a RFE)
   - Evidências ignoradas pelo oficial (DESTACAR — são ouro)

3. ESTRATÉGIA ARGUMENTATIVA POR CRITÉRIO:
   - Tipo de refutação (evidência nova? Reframe? Policy update?)
   - Precedentes a citar (Kazarian, Mukherji, PA-2025-16)
   - Dados de pesquisa necessários (deep research)

4. DEEP RESEARCH TASKS:
   - O que pesquisar na internet para reforçar cada critério
   - Fontes: BLS, Census, NYT, BBC, Reuters (validação externa)

5. ESTIMATIVA DE PÁGINAS POR CRITÉRIO

6. ORDEM DO DOCUMENTO FINAL:
   RECOMENDAÇÃO: Step 2 PRIMEIRO (soft intro) + critérios na ordem das objeções

Salve: [OUTPUT_DIR]/_rfe_strategic_plan.md
⚠️ PRODUÇÃO SÓ COMEÇA APÓS APROVAÇÃO DESTE PLANO.
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
```

---

## FASE 1 — GERAÇÃO POR CRITÉRIO

Para CADA critério questionado (na ordem de prioridade do plano):

```
claude -p "
Leia o sistema: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/
Leia: TEMPLATE_C[N]_*.md, FORMATTING_SPEC.md, FORBIDDEN_CONTENT.md, LEGAL_FRAMEWORK_2026.md
Leia: [OUTPUT_DIR]/_rfe_analysis.json (objeção do oficial para C[N])
Leia evidências: [lista de PDFs para este critério]

[INCLUIR REGRAS TRANSVERSAIS — ver Cover Letter Orchestrator]

TAREFA: Gerar RESPOSTA ao Critério [N] da RFE EB-1A.

ESTRUTURA OBRIGATÓRIA (RFE — diferente de Cover Letter):

1. REPRODUÇÃO DA OBJEÇÃO DO OFICIAL:
   - Transcrever word-for-word em inglês (entre aspas)
   - NÃO parafrasear, NÃO interpretar

2. ENQUADRAMENTO LEGAL:
   - 8 C.F.R. § 204.5(h)(3)([alínea]) — requisito regulatório
   - USCIS Policy Manual (citação relevante)
   - PA-2025-16 (se aplicável a este critério)
   - Mukherji v. Miller (se reforça argumento)
   - Kazarian two-step (se relevante)

3. RESPOSTA À OBJEÇÃO:
   Padrão obrigatório: 'The record contains Evidence XX, which the officer may not have fully considered...'
   - Para cada ponto da objeção, contra-argumentar com evidência ESPECÍFICA
   - NUNCA linguagem confrontativa
   - SEMPRE evidência primeiro, argumento depois

4. EVIDENCE BLOCKS (da mais forte à mais fraca):
   Para CADA evidência:
   - 'Evidence XX.' bold verde #2E7D32
   - Contexto institucional
   - O que demonstra vs. requisito regulatório
   - Defesas preemptivas costuradas no texto
   - [THUMBNAIL — Exhibit XX]
   - 500-1.500 palavras por evidence block + argumentação

5. DADOS DE PESQUISA (se aplicável):
   - Dados BLS, Census, circulação de mídia
   - Cobertura internacional (se critério 8 — MPF/Lava Jato)
   - Dados de seletividade (se critério 2 — ABRASCI)

6. CONCLUSÃO DO CRITÉRIO:
   - Síntese de como as evidências REFUTAM a objeção
   - Citar regulamento específico
   - NÃO usar 'satisfeito/satisfaz' (Cat 0 forbidden)

REGRAS ESPECÍFICAS DE RFE:
- Tom: respeitoso mas técnico (NUNCA agressivo)
- Padrão: 'The record also contains...' / 'Additionally, Evidence XX demonstrates...'
- NUNCA: 'The officer erred' / 'The officer failed to consider'
- NUNCA: referência a petição anterior / denial / refile (BLOCO 2 anti-Cristine)
- Divisão: ≤4 evidências = 1 arquivo; 5-8 = A+B; 9+ = A+B+C

Palavras alvo: [ver tabela de calibração]
Salve: [OUTPUT_DIR]/RFE_C[N].docx (ou _A.docx, _B.docx)
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

### Tabela de calibração (VF Marcelo):

| Critério | Palavras VF | % do total | Prioridade | Sessões |
|----------|------------|-----------|-----------|---------|
| C1 Prêmios | 291 | 0,75% | Baixa | 1 |
| C2 Membership | 2.560 | 6,56% | **ALTA** | 1-2 |
| C3 Mídia | 2.140 | 5,49% | Média | 1 |
| C5 Contribuições | 6.335 | 16,24% | **ALTA** | 3 (A+B+C) |
| C6 Artigos | 2.769 | 7,10% | Média | 1-2 |
| C8 Liderança | 1.827 | 4,68% | **ALTA** | 4 (A+B+C+D) |
| C9 Remuneração | 6.598 | 16,91% | Baixa | 1-2 |

**NOTA:** No caso do Marcelo, C5 teve 3 partes e C8 teve 4 partes. A divisão depende do número de evidências e da complexidade da objeção.

---

## FASE 2 — STEP 2: FINAL MERITS

**POSIÇÃO NO DOCUMENTO: PRIMEIRO (antes dos critérios)**

Estratégia do Marcelo: Step 2 no início como "soft introduction" mostrando que o beneficiário atende Step 1 + Step 2 antes de entrar na refutação técnica.

```
claude -p "
Leia: sistema v5 (ARCHITECT, LEGAL_FRAMEWORK_2026.md)
Leia: [OUTPUT_DIR]/_rfe_analysis.json
Leia TODOS os .docx de critérios já gerados: [OUTPUT_DIR]/RFE_C*.docx

[INCLUIR REGRAS TRANSVERSAIS]

TAREFA: Gerar STEP 2 — Final Merits da RFE EB-1A.

DIFERENÇA DO COVER LETTER: Step 2 da RFE refuta preocupações do oficial sobre 'sustained acclaim' e 'small percentage at the top'.

ESTRUTURA:
1. Kazarian Two-Step Framework (Step 2 detalhado)
2. Sustained National/International Acclaim:
   - Timeline cronológica (YYYY-YYYY, anos de contribuições contínuas)
   - Múltiplas realizações distintas convergindo
3. Small Percentile Analysis:
   - Dados quantitativos provando top X% do campo
4. Mukherji v. Miller:
   - Citar como autoridade persuasiva
   - Argumentar que Step 2 não cria barreira extra-regulatória
5. PA-2025-16:
   - Avaliação non-discretionary se Step 1 satisfeito
6. Convergência de Evidências:
   - Cross-references entre critérios
   - Tabela mostrando evidências multi-critério

Palavras alvo: 2.500-5.000
Salve: [OUTPUT_DIR]/RFE_STEP2.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 3 — THUMBNAILS

Para CADA .docx individual:
```
python3 insert_thumbnails.py "[OUTPUT_DIR]/RFE_C[N].docx" "[CLIENT_DOCS_PATH]"
```

Ou gerar thumbnails via script dedicado:
```bash
cd [CLIENT_DOCS_PATH]
for pdf in *.pdf; do
  pdftoppm -f 1 -l 1 -r 150 -png "$pdf" "thumb_${pdf%.pdf}"
done
```

Regras:
- Certificados de tradução: usar página 2 (pular capa do tradutor)
- Tamanho: ~2"×3" no DOCX
- wp:anchor + wrapSquare (NUNCA wp:inline)

---

## FASE 4 — AGLUTINAÇÃO

**ORDEM DO DOCUMENTO FINAL (estratégia Marcelo: Step 2 PRIMEIRO):**

```
1. RFE_STEP2.docx          ← PRIMEIRO (soft intro)
2. RFE_C1.docx             ← Na ordem das objeções do oficial
3. RFE_C2.docx (ou A+B)
4. RFE_C3.docx
5. RFE_C5_A.docx + _B.docx + _C.docx
6. RFE_C6.docx
7. RFE_C8_A.docx + _B + _C + _D
8. RFE_C9.docx
```

```
claude -p "
TAREFA: Aglutinar todos os .docx da RFE em 1 documento único.

Usar Python com docxcompose OU XML merge.
Ordem: Step 2 PRIMEIRO, depois critérios na ordem das objeções.

PÓS-MERGE:
- Paginação: 'Página X de Y' (campo Word dinâmico)
- Footer: 'RFE Response — [CLIENT NAME] — [CASE NUMBER] | Página X de Y'
- Header: 'EB-1A Extraordinary Ability | I-140 Petition — RFE Response'
- Verificar contagem de imagens antes/depois
- cantSplit=true em todas as rows de tabelas
- Tabelas: bordas APENAS horizontais

Salve: [OUTPUT_DIR]/RFE_Resposta_Completa_[CLIENT].docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## FASE 4.5 — VALIDAÇÃO + AUDITORIA

**6 rodadas (como no Marcelo):**

| Rodada | Foco | Quem |
|--------|------|------|
| 1. Técnica | Erros de código, imagens, formatação | Claude Code |
| 2. Independente | Conteúdo, estratégia, evidências missing | Sessão limpa |
| 3. Exaustiva | Cada frase, cada métrica, factual accuracy | Claude Code + Cowork |
| 4. Legal | Força jurídica, precedentes, regulamentos | Persona advogado |
| 5. SOC 4 Agentes | 4 personas simultâneas (ver Fase 5) | Sessão limpa |
| 6. Last Pass | Zero-tolerance, documento locked | Claude Code |

**Checklist obrigatório:**
- [ ] Todos evidence numbers batem com Exhibit Index
- [ ] Zero placeholder ([INSERIR], [TODO], ████)
- [ ] Zero markdown visível
- [ ] Zero código visível
- [ ] Spelling/grammar PT-BR
- [ ] Datas consistentes
- [ ] Nomes de organizações consistentes
- [ ] SICAU/sistemas com nome EXATO (NUNCA inventar variantes)
- [ ] Zero termos proibidos (Cat 0-11)
- [ ] Cross-criteria consistency
- [ ] Proporções aceitáveis
- [ ] Todas imagens carregam

---

## FASE 5 — SOC 4 AGENTES

```
claude -p "
Leia: /Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md
Leia: /Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md

Assuma 4 PERSONAS SIMULTÂNEAS e revise o documento:
[OUTPUT_DIR]/RFE_Resposta_Completa_[CLIENT].docx

PERSONA 1 — USCIS Adjudication Officer:
- 'Eu sou o oficial que emitiu esta RFE. A resposta refuta TODAS as minhas objeções?'
- Para cada objeção original, verificar se foi endereçada com evidência específica
- Identificar lacunas que eu exploraria para negar novamente

PERSONA 2 — Immigration Attorney (Elite Firm, $15K/caso):
- 'Se este fosse meu cliente, eu cobraria por revisões?'
- Avaliar força jurídica, precedentes, estratégia
- Identificar pontos que opposing counsel exploraria

PERSONA 3 — Quality Auditor (PROEX):
- Aplicar 12 Quality Checkpoints
- Forbidden content (11 categorias)
- Formatação (Garamond, cores, bordas)
- Evidence numbering consistency

PERSONA 4 — First-Time Reader:
- 'A narrativa faz sentido do início ao fim?'
- 'Eu entendo por que esta pessoa merece EB-1A?'
- Clareza, coerência, acessibilidade

VEREDITO:
- 4/4 aprovam → STRONGLY POSITIVE (entregar)
- 3/4 aprovam → POSITIVE (minor tweaks e entregar)
- 2/4 aprovam → MIXED (revisão significativa)
- ≤1/4 aprovam → NEGATIVE (refazer)

Gere relatório: [OUTPUT_DIR]/REVIEW_SOC_4_AGENTES_[CLIENT].md
" --allowedTools Bash,Read,Write,Edit,Glob,Grep
```

---

## MÉTRICAS DE CALIBRAÇÃO (VF Marcelo Góis)

| Métrica | Valor |
|---------|-------|
| Total palavras | 39.008 |
| Total páginas | 131 |
| Tabelas | 90 |
| Imagens/Thumbnails | 69 |
| Evidence blocks | 87 |
| Critérios respondidos | 7 (C1, C2, C3, C5, C6, C8, C9) |
| Scripts Node.js | 14 |
| Rodadas de auditoria | 6 |
| Tempo de produção | 5 dias |
| File size final | 34 MB |

---

## REGRAS ESPECÍFICAS DE RFE (além das transversais)

1. NUNCA confrontar o oficial — padrão: "The record contains..." / "Additionally..."
2. Step 2 NO INÍCIO do documento (não no final)
3. Reproduzir objeção do oficial WORD-FOR-WORD antes de refutar
4. Evidências ignoradas pelo oficial = OURO (destacar com "the officer may not have fully considered")
5. Policy Manual updates (2024, 2025) são argumentos fortes em RFE
6. Mukherji como "persuasive authority" (NUNCA "binding")
7. PA-2025-16 como "policy guidance" (NUNCA "law")
8. Se critério é FRACO: manter com defesa mínima, não abandonar
9. NUNCA mencionar refile/denial/petição anterior (anti-Cristine BLOCO 2)
10. Nomes de sistemas (SICAU, etc.): VERIFICAR NOME EXATO (NUNCA inventar variantes)

---

*Orquestrador baseado na engenharia reversa da VF Marcelo Góis (131 páginas, 39K palavras, 90 tabelas, 69 imagens)*
*14 scripts Node.js + aglutinador Python + 6 rodadas de auditoria + SOC 4 agentes*
*Abril 2026*
