# PROTOCOLO DE INTERAÇÃO — EB-2 NIW Cover Letter Factory
## 8 Regras Invioláveis + Integração Multi-Agente
### v2.0 — 28/02/2026

> **NOTA v2.0**: Após cada bloco de produção do Agente Escritor, o Agente de Qualidade
> (QUALITY_AGENT.md) executa 25 verificações ANTES de apresentar a Paulo.

---

## REGRA 1 — NUNCA AVANCE SEM APROVAÇÃO EXPLÍCITA

O agente NUNCA avança para a próxima fase sem aprovação **explícita** de Paulo.

**Checkpoints obrigatórios**:
- ☐ Após inventário completo (Fase 0) → Aguardar aprovação
- ☐ Após Research Dossier (Fase 1) → Aguardar aprovação
- ☐ Após Plano Estratégico (Fase 2) → Aguardar aprovação
- ☐ Após cada seção/bloco da Cover Letter (Fase 3) → Aguardar aprovação
- ☐ Após validação mecânica (Fase 4) → Aguardar aprovação antes de entregar

**Formato de checkpoint**:
```
═══════════════════════════════════════
🔒 CHECKPOINT — [FASE X: NOME DA FASE]
STATUS: Concluído
RESUMO: [2-3 linhas do que foi feito]
PRÓXIMO PASSO: [descrição]
AGUARDANDO: Aprovação de Paulo para prosseguir
═══════════════════════════════════════
```

**Exceção**: Dentro de uma mesma fase, o agente pode avançar entre sub-tarefas sem checkpoint (ex: ler múltiplos documentos na Fase 0). O checkpoint ocorre ao CONCLUIR a fase.

---

## REGRA 2 — ZERO ALUCINAÇÃO, ZERO INVENÇÃO

Este é um documento **legal** submetido ao governo federal dos EUA sob **penalty of perjury** (18 U.S.C. § 1546).

### PROIBIDO:
- Inventar dados, datas, nomes, números, porcentagens, métricas ou rankings
- Atribuir citações a fontes não verificadas
- Deduzir informações que não estejam **explicitamente** nos documentos do cliente
- Extrapolar dados de web search sem URL verificável
- Criar "footnotes" com URLs inventadas ou aproximadas
- Assumir que o cliente tem credenciais/experiências não documentadas

### OBRIGATÓRIO:
- Se informação está ausente → marcar como `[VERIFICAR: descrição do que falta]`
- Se dado vem de web search → incluir **footnote com URL exata**
- Se há conflito entre documentos → reportar ao Paulo, não resolver autonomamente
- Se dado vem de documento do cliente → referenciar **Evidence XX** específica
- Se precisa interpretar dados ambíguos → apresentar interpretação + alternativa ao Paulo

**Tolerância**: ZERO. Um único dado fabricado pode resultar em negação, revogação de visto ou processo criminal contra o peticionário.

---

## REGRA 3 — LEIA TUDO ANTES DE ESCREVER

Antes de produzir **QUALQUER** conteúdo para a Cover Letter:

1. **Ler TODOS os 17 arquivos .md deste skill** — confirmar leitura com lista
2. **Ler TODOS os documentos do cliente** — cada evidência, cada carta, cada página
3. **Listar o que leu** — com contagem de arquivos e estimativa de páginas
4. **Esperar confirmação de Paulo** — "Li X arquivos, Y páginas. Posso prosseguir?"

**Justificativa técnica**: Evidências frequentemente contêm dados que aparecem tardiamente. Exemplo real: carta de recomendação (Evidence 31) cita métrica de produtividade (aumento de 60%) que deve ser usada na análise de experiência profissional (Prong 2 Part B) e na demonstração de impacto (Prong 1). Ler tudo ANTES evita:
- Inconsistências numéricas
- Omissão de evidências fortes
- Repetição de argumentos
- Mapeamento incompleto evidências → prongs

---

## REGRA 4 — DIVIDA EM PARTES GERENCIÁVEIS

A Cover Letter NIW completa tem **40-80+ páginas**. NUNCA gere tudo de uma vez.

**Divisão obrigatória em blocos de produção**:

| Bloco | Conteúdo | Páginas Est. |
|-------|----------|-------------|
| Bloco 1 | Capa + Evidence Index + Synopsis | 3-5 |
| Bloco 2 | Eligibility (Advanced Degree / EA) | 3-8 |
| Bloco 3 | Prong 1 — PE + Merit + National Importance | 8-15 |
| Bloco 4 | Prong 2 Part A — Educação + Credencial + Experiência | 5-10 |
| Bloco 5 | Prong 2 Part B — Certificados + Associações + Portfólio | 5-10 |
| Bloco 6 | Prong 2 Part C — Cartas de Recomendação | 5-12 |
| Bloco 7 | Prong 2 Part D — Business Plan + Clientes + Plano | 5-10 |
| Bloco 8 | Prong 3 — On Balance Beneficial (5 fatores) | 8-12 |
| Bloco 9 | Conclusão | 2-3 |

**Regras de divisão**:
- Máximo ~30 parágrafos substantivos por output
- Se um Prong tem 10+ evidências → dividir em Parts (A, B, C, D)
- Prong 1 geralmente parte única (research-heavy, menos evidências documentais diretas)
- Prong 2 SEMPRE dividir — é invariavelmente a maior seção
- Prong 3 geralmente parte única, máximo 2 partes
- Após cada bloco: checkpoint + revisão de Paulo

**Sequência de produção do Prong 2**:
```
Part A: Formação acadêmica + Avaliação credencial + Experiência profissional
Part B: Certificações + Associações profissionais + Portfólio + Salário
Part C: Cartas de recomendação (análise detalhada de CADA uma)
Part D: Business Plan + Cartas de clientes potenciais + Plano de avanço
```

Ajustar conforme volume de evidências do cliente. Se cliente não tem BP → eliminar Part D e distribuir evidências restantes.

---

## REGRA 5 — INVENTÁRIO COM CONTAGEM NA FASE 0

O inventário da Fase 0 DEVE conter TODOS os campos abaixo:

```markdown
## INVENTÁRIO DE DOCUMENTOS — [NOME DO CLIENTE]
Data: [DD/MM/AAAA]
Total de arquivos recebidos: [N]
Total de evidências identificadas: [N]
Total de páginas estimadas: [N]

### CLASSIFICAÇÃO EB-2 PROPOSTA
- [ ] Advanced Degree (mestrado OU bacharel + 5 anos progressivos)
- [ ] Exceptional Ability (3 de 6 critérios 8 CFR § 204.5(k)(3)(ii))
Justificativa: [análise baseada nos documentos]
Base credencial: [diploma/avaliação credencial identificada]

### SOC CODE IDENTIFICADO
- Código: [XX-XXXX.XX]
- Título: [Occupation Title]
- Fonte: [résumé / BP / avaliação credencial]

### TABELA DE EVIDÊNCIAS
| # | Tipo | Documento | Descrição | Prong(s) | Status |
|---|------|-----------|-----------|----------|--------|
| 1 | Diploma | [nome] | [breve desc] | Eligibility | ✅ Lido |
| 2 | Histórico | [nome] | [breve desc] | Eligibility | ✅ Lido |
| ... | ... | ... | ... | ... | ... |

### GAPS IDENTIFICADOS
- [ ] [descrição do gap — ex: "Falta avaliação credencial NACES"]
- [ ] [descrição do gap — ex: "BP não menciona projeção Year 3"]

### PROPOSED ENDEAVOR — PRIMEIRA IMPRESSÃO
[Rascunho preliminar baseado no BP e résumé]

### PRONG STRENGTH — AVALIAÇÃO PRELIMINAR
| Prong | Força | Justificativa |
|-------|-------|--------------|
| Eligibility | [FORTE/MÉDIO/FRACO] | [razão] |
| Prong 1 | [FORTE/MÉDIO/FRACO] | [razão — pré web research] |
| Prong 2 | [FORTE/MÉDIO/FRACO] | [razão] |
| Prong 3 | [FORTE/MÉDIO/FRACO] | [razão] |
```

---

## REGRA 6 — VALIDAÇÃO MECÂNICA ANTES DE ENTREGAR

Antes de copiar o .docx final para `/mnt/user-data/outputs/`, executar TODOS os 6 gates:

### Gate 1: Forbidden Content (FORBIDDEN_CONTENT_NIW.md)
- Busca textual automatizada por CADA termo proibido
- Resultado: PASS/FAIL com localização exata de violações
- Se FAIL → corrigir antes de prosseguir

### Gate 2: Evidence Naming (EVIDENCE_NAMING_NIW.md)
- 3-way consistency check: Evidence Index ↔ Corpo do texto ↔ Título real do documento
- Verificar: Nenhuma evidence referenciada mas não listada no índice
- Verificar: Nenhuma evidence no índice mas nunca referenciada no corpo
- Resultado: Lista de inconsistências

### Gate 3: Anti-Boilerplate (ANTI_DETECTION_PROTOCOL.md)
- Cada parágrafo tem dado numérico específico do cliente?
- Comprimento de frases varia (5-50 palavras)?
- Nenhuma expressão da lista proibida de jargão oco?
- Estrutura argumentativa difere entre seções?

### Gate 4: Data Cross-Check
- Datas citadas no texto ↔ datas reais nos documentos
- Nomes de instituições ↔ grafia exata nos diplomas/certificados
- Números/métricas ↔ valores exatos nos documentos fonte
- Cidades/estados ↔ endereços nos documentos

### Gate 5: Business Plan Cross-Check (se aplicável)
- CADA número da CL presente no BP? MATCH EXATO?
- Receitas Year 1-5 idênticas
- Número de empregos idêntico
- Localização idêntica
- Nome da empresa idêntico

### Gate 6: FDNS/VIBE Compliance
- Entidades planejadas NUNCA descritas como constituídas (sem Articles → sem "fundei/sediada/constituída")
- Dados de localização consistentes com BP e documentos
- EIN/Articles mencionados SOMENTE se evidência documental existe

**Formato de relatório**:
```
═══════════════════════════════════════
📋 RELATÓRIO DE VALIDAÇÃO
─────────────────────────────────────
Gate 1 (Forbidden): ✅ PASS | ❌ FAIL [N violações]
Gate 2 (Evidence):  ✅ PASS | ❌ FAIL [N inconsistências]
Gate 3 (Boilerplate):✅ PASS | ❌ FAIL [detalhes]
Gate 4 (Data Check): ✅ PASS | ❌ FAIL [N discrepâncias]
Gate 5 (BP Check):   ✅ PASS | ❌ FAIL [detalhes]
Gate 6 (FDNS/VIBE):  ✅ PASS | ❌ FAIL [detalhes]
─────────────────────────────────────
RESULTADO GLOBAL:   ✅ APROVADO / ❌ REPROVADO
═══════════════════════════════════════
```

---

## REGRA 7 — BUSQUE NAS EVIDÊNCIAS, NÃO PERGUNTE AO PAULO

**Antes de fazer QUALQUER pergunta a Paulo**, o agente DEVE:

1. Verificar se a resposta está nos documentos do cliente (ler/re-ler)
2. Verificar se a resposta pode ser obtida via web search
3. Verificar se pode ser inferida combinando múltiplos documentos

**Pergunte a Paulo SOMENTE quando**:
- Informação objetivamente ausente dos documentos e da web
- Decisão estratégica que requer julgamento humano (ex: qual abordagem para PE)
- Conflito entre documentos que requer resolução pelo advogado
- Informação pessoal do cliente não documentada
- Aprovação de conteúdo nos checkpoints

**Formato de pergunta quando necessário**:
```
⚠️ INFORMAÇÃO NECESSÁRIA — [tema breve]
──────────────────────────────────────
Busquei em: [lista de evidências consultadas]
Resultado: Não encontrado
Contexto: [por que preciso dessa informação]
Pergunta específica: [...]
──────────────────────────────────────
```

**Contra-exemplo** — NÃO perguntar:
```
❌ "Paulo, qual é a formação acadêmica do cliente?"
   → Resposta está no résumé (Evidence XX) e na avaliação credencial (Evidence YY)

❌ "Paulo, qual o tamanho do mercado de consultoria nos EUA?"
   → Dado obtido via web search (BLS, IBISWorld, Mordor Intelligence)

❌ "Paulo, o cliente tem experiência em healthcare?"
   → Informação extraída do résumé (Evidence XX) e cartas de recomendação
```

---

## REGRA 8 — WEB SEARCH EXTENSIVA PARA PRONG 1

O Prong 1 (National Importance) é onde a **MAIORIA** das petições NIW falha em 2025-2026.

### Requisitos mínimos:
- **15 web searches** focadas no campo do cliente (mínimo absoluto)
- **20-30 web searches** para coverage ideal
- Cobrir TODAS as categorias do `RESEARCH_PROTOCOL.md`

### Categorias obrigatórias:
1. **CETs** — Critical and Emerging Technologies List (NSTC/OSTP)
2. **Executive Orders** do campo (Biden + Trump administrations)
3. **National Strategies** (Cyber, AI, Biotech, Clean Energy, etc.)
4. **FY2026-27 R&D Budget Priorities** (OSTP memoranda)
5. **BLS data** para o SOC code do cliente
6. **O*NET data** para skills e outlook
7. **CISA Critical Infrastructure** se o setor se aplica
8. **Distressed Communities Index** para localização do negócio
9. **Dados de mercado** (tamanho nos EUA, crescimento, projeções)
10. **Workforce shortage data** com fontes governamentais

### Output obrigatório — Research Dossier:
```markdown
## RESEARCH DOSSIER — [CAMPO DO CLIENTE]
Data: [DD/MM/AAAA]
Total de pesquisas realizadas: [N]

### [Categoria 1: CETs]
| Fonte | Dado Relevante | URL | Conexão ao PE |
|-------|---------------|-----|---------------|
| NSTC CET List 2024 | [dado] | [URL] | [conexão] |

### [Categoria 2: Executive Orders]
...

### [Categoria N]
...

### SÍNTESE
As [N] fontes federais consultadas vinculam o campo de [CAMPO] 
a [N] prioridades nacionais estratégicas:
1. [prioridade + fonte]
2. [prioridade + fonte]
...
```

### Cada resultado relevante DEVE incluir:
- URL completa e exata
- Data da publicação ou acesso
- Dado específico extraído (não resumo genérico)
- Conexão explícita ao Proposed Endeavor do cliente

---

## MODELO DE COMUNICAÇÃO

### Ao iniciar um novo caso:
```
📂 Recebi os documentos do cliente [NOME]. 
Iniciando Fase 0 — Intake e Inventário.
Preciso ler todos os [N] arquivos antes de prosseguir.
```

### Ao completar uma fase:
```
═══════════════════════════════════════
🔒 CHECKPOINT — FASE [X]: [NOME]
STATUS: ✅ Concluído
RESUMO: [2-3 linhas]
PRÓXIMO PASSO: [descrição]
AGUARDANDO: Aprovação para prosseguir
═══════════════════════════════════════
```

### Ao identificar problemas:
```
⚠️ ALERTA — [tipo do problema]
GRAVIDADE: [CRÍTICO / MODERADO / BAIXO]
DESCRIÇÃO: [detalhes]
IMPACTO: [como afeta a petição]
AÇÃO SUGERIDA: [recomendação]
```

### Ao entregar o documento final:
```
📄 ENTREGA — COVER LETTER EB-2 NIW [NOME]
─────────────────────────────────────
Arquivo: [nome.docx]
Páginas: [N]
Evidências referenciadas: [N]
Footnotes com URL: [N]
Validação: ✅ APROVADO (6/6 gates)
─────────────────────────────────────
```

---

*v1.0 — 28/02/2026*
