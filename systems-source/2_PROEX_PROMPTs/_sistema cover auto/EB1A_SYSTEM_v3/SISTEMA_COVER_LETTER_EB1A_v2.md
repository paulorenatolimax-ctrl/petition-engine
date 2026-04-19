# SISTEMA DE CONSTRUÇÃO DE COVER LETTER EB-1A
## Arquitetura Completa — v2.2 (27/02/2026)
## Escritório PROEX

---

## 1. VISÃO GERAL DO SISTEMA

### 1.1 O que é
Um pipeline estruturado de 6 fases para construção de Cover Letters de petições EB-1A (I-140), projetado para funcionar com **qualquer cliente, qualquer combinação de critérios**.

### 1.2 Como funciona
O sistema opera como **conjunto de prompts especializados** dentro do Projects do Claude.ai. Todos os arquivos ficam no mesmo nível (flat — sem subpastas).

### 1.3 Estrutura do Project
```
📁 Project: "SISTEMA DE CONSTRUÇÃO DE COVER LETTER EB-1A"
│
├── 📋 Instruções do Projeto (Project Instructions):
│   └── Conteúdo do ARCHITECT_COVER_LETTER_EB1.md
│
├── 📚 Arquivos (Project Knowledge) — TODOS no mesmo nível:
│
│   ── CORE ──────────────────────────────────────────────
│   SISTEMA_COVER_LETTER_EB1A_v2.md     ← este documento
│   ARCHITECT_COVER_LETTER_EB1.md        ← prompt do Paulo
│   CHECKLIST_PRE_PRODUCAO.md            ← checklist do Paulo
│   README.md                            ← índice rápido
│
│   ── SPECS ─────────────────────────────────────────────
│   FORMATTING_SPEC.md                   ← tipografia, cores, margens
│   LEGAL_FRAMEWORK_2026.md              ← legislação e jurisprudência
│   FORBIDDEN_CONTENT.md                 ← lista de proibições
│   QUALITY_GATES.md                     ← validações por fase
│   EVIDENCE_NAMING_CONVENTION.md        ← regras de nomenclatura
│
│   ── TEMPLATES (todos os 10 critérios) ─────────────────
│   TEMPLATE_C1_AWARDS.md
│   TEMPLATE_C2_MEMBERSHIP.md
│   TEMPLATE_C3_PUBLISHED_MATERIAL.md
│   TEMPLATE_C4_JUDGING.md
│   TEMPLATE_C5_ORIGINAL_CONTRIBUTIONS.md
│   TEMPLATE_C6_SCHOLARLY_ARTICLES.md
│   TEMPLATE_C7_EXHIBITIONS.md
│   TEMPLATE_C8_LEADING_ROLE.md
│   TEMPLATE_C9_HIGH_SALARY.md
│   TEMPLATE_C10_COMMERCIAL_SUCCESS.md
│
│   ── BENCHMARKS (subir PDFs separados) ─────────────────
│   VPO_Carlos_Henrique_Avelino.pdf      ← NUNCA citar
│   VPO_Bruno_Alcantara_Cipriano.pdf     ← NUNCA citar
│
└── 💬 Conversas (uma por cliente):
    └── "Renato Silveira — Cover Letter"
    └── "[Novo Cliente] — Cover Letter"
```

**REGRA**: Tudo flat, sem subpastas. O prefixo do nome organiza: `TEMPLATE_C[N]_` para templates, nomes descritivos para specs.

---

## 2. OS 10 CRITÉRIOS — COBERTURA COMPLETA

O sistema cobre TODOS os 10 critérios do 8 C.F.R. § 204.5(h)(3). Cada cliente usará uma combinação diferente (mínimo 3).

| # | Critério | Template | Frequência de Uso |
|---|----------|----------|-------------------|
| 1 | Awards/Prizes | TEMPLATE_C1_AWARDS.md | Alta |
| 2 | Membership | TEMPLATE_C2_MEMBERSHIP.md | Alta |
| 3 | Published Material | TEMPLATE_C3_PUBLISHED_MATERIAL.md | Muito Alta |
| 4 | Judging | TEMPLATE_C4_JUDGING.md | Média |
| 5 | Original Contributions | TEMPLATE_C5_ORIGINAL_CONTRIBUTIONS.md | Muito Alta |
| 6 | Scholarly Articles | TEMPLATE_C6_SCHOLARLY_ARTICLES.md | Alta |
| 7 | Exhibitions/Display | TEMPLATE_C7_EXHIBITIONS.md | Baixa (artes) |
| 8 | Leading/Critical Role | TEMPLATE_C8_LEADING_ROLE.md | Muito Alta |
| 9 | High Salary | TEMPLATE_C9_HIGH_SALARY.md | Alta |
| 10 | Commercial Success | TEMPLATE_C10_COMMERCIAL_SUCCESS.md | Baixa (performing arts) |

### Combinações comuns por perfil:

**Empresário/CEO**: C1 + C3 + C5 + C8 + C9
**Influenciador/Creator**: C1 + C3 + C5 + C6 + C9
**Acadêmico/Pesquisador**: C2 + C4 + C5 + C6 + C8
**Artista/Performer**: C1 + C3 + C5 + C7 + C10
**Médico/Profissional de Saúde**: C2 + C3 + C5 + C6 + C8
**Engenheiro/Tech**: C2 + C4 + C5 + C6 + C8
**Advogado/Consultor**: C2 + C3 + C5 + C8 + C9
**Atleta**: C1 + C3 + C5 + C8 + C9

---

## 3. AS 6 FASES DO PIPELINE

### FASE 0 — SETUP DO CLIENTE
**Input**: Pasta completa do cliente
**Output**: Confirmação de leitura + gaps

O que Paulo faz:
1. Sobe documentos na conversa do Project
2. Inicia: "Novo cliente: [NOME]. O*Net: [CÓDIGO]. Critérios: [LISTA]"

O que o sistema faz:
1. Lê TUDO
2. NÃO imprime conteúdo no chat
3. Confirma leitura

### FASE 1 — PLANO ESTRATÉGICO
**Output**: Markdown com:
- Dados do beneficiário (nome, O*Net, campo)
- Critérios a defender com análise de força (MUITO FORTE / FORTE / MÉDIO / FRACO)
- Inventário de evidências numeradas
- Mapeamento evidência → critério
- Gaps e riscos
- Recomendações para Paulo

### FASE 2 — PRODUÇÃO (critério por critério)
**Sequência por critério:**
1. Ler TEMPLATE_C[N] correspondente
2. Ler benchmark do mesmo critério
3. Ler TODAS as evidências mapeadas
4. Gerar .docx conforme FORMATTING_SPEC
5. Validar contra FORBIDDEN_CONTENT e QUALITY_GATES

**Divisão em partes:**
- Critérios com muitas evidências → dividir em A/B/C
- Regra geral: >4 evidências no C3, >2 contribuições no C5 → dividir
- O template de cada critério define quando dividir

### FASE 3 — ORGANIZAÇÃO DE EVIDÊNCIAS
Criar lista de evidências renomeadas conforme EVIDENCE_NAMING_CONVENTION

### FASE 4 — AUDITORIA
Executar validações de QUALITY_GATES:
- Forbidden content check
- Evidence name consistency (3-way)
- Résumé cross-check
- Density calibration

### FASE 5 — MONTAGEM FINAL
- Índice de evidências completo
- Consistência inter-critérios
- Paginação e compilação

---

## 4. ESPECIFICAÇÕES TÉCNICAS

### Resumo (detalhes completos em FORMATTING_SPEC.md)

| Elemento | Spec |
|----------|------|
| Fonte | Garamond 100% |
| Corpo | 12pt, justificado, preto |
| Headers de seção | 14pt bold, shading #C5E0B4, preto |
| Título critério | 13pt bold+italic, shading #C5E0B4, preto |
| Evidence title | 10pt bold, #2E7D32 (green) |
| Evidence block bg | #FFF2CC (cream) |
| Table headers | 10pt bold, shading #C5E0B4, preto |
| Margens | L=2.0cm, R=1.5cm, T/B=1.5cm |
| Página | US Letter (8.5" × 11") |
| Footer | Garamond 8pt gray |

**NUNCA**: azul em qualquer elemento.

---

## 5. REGRAS ABSOLUTAS

Detalhes completos em FORBIDDEN_CONTENT.md. Resumo:

| Proibido | Motivo |
|----------|--------|
| PROEX, nomes de outros clientes | Confidencialidade |
| "o beneficiário" / terceira pessoa | Voz = primeira pessoa |
| Seção "Objeções Antecipadas" | Defesas costuradas no texto |
| Headers azuis | Sempre preto sobre verde-sage |
| Evidence block depois do texto | Sempre antes |
| Dados sem footnote | Zero afirmação sem fonte |
| **"satisfeito/satisfaz/satisfies"** (sobre critérios) | **Juízo de valor — cabe ao oficial USCIS** |
| **"Ev." como prefixo** | **Sempre "Evidence XX" por extenso** |
| **Tabelas com box borders** | **Apenas bordas horizontais** |
| **Capa centrada (title page)** | **Formato carta conforme benchmark** |
| **"Step 1"/"Step 2" em minúsculas** | **Sempre "STEP 1"/"STEP 2"** |
| **"jurídico"/"adjudicativo"** | **Usar "regulatório"/"probatório"** |
| **"independentes" para validadores** | **Omitir ou "com observação direta"** |
| **"constituída/sediada/aberta" (empresa inexistente)** | **"planejada/projetada/prevista" — ver FORBIDDEN_CONTENT Cat. 3C** |

---

## 6. COMO USAR (Manual do Paulo)

### Setup (uma vez)
1. Criar Project "SISTEMA DE CONSTRUÇÃO DE COVER LETTER EB-1A"
2. Colar ARCHITECT_COVER_LETTER_EB1.md como Instruções do Projeto
3. Subir TODOS os .md como Arquivos (Knowledge)
4. Subir benchmarks (PDFs)

### Novo Cliente
```
1. Paulo: "Novo cliente: João Silva. O*Net: 13-1111.00. Critérios: C1, C3, C5, C8, C9"
2. Claude: [lê tudo, gera Plano Estratégico]
3. Paulo: [revisa e aprova o plano]
4. Paulo: "Avance para o Critério 3"
5. Claude: [lê TEMPLATE_C3, benchmarks, evidências → gera .docx]
6. Paulo: [revisa → aprova ou pede revisão]
7. Repete para cada critério
8. Paulo: "Faça auditoria final"
9. Claude: [valida consistência, forbidden content, cross-refs]
```

### Comandos Úteis
```
"Leia tudo e faça o plano estratégico"
"Avance para o Critério [X]"
"Divida o Critério [X] em partes A e B"
"Revise com densidade de benchmark"
"Faça auditoria do Critério [X]"
"Organize evidências do Critério [X]"
"Valide résumé ↔ cover letter"
"Quais gaps temos?"
"Qual a próxima ação?"
```

---

## 7. LIÇÕES DO CASO RENATO SILVEIRA

### Erros que o sistema DEVE prevenir:
1. Densidade insuficiente — mínimo 3-5 subseções por evidência
2. Não calibrar contra benchmarks antes de escrever
3. Thumbnails ausentes sem placeholder claro
4. Fontes externas (Lattes, etc.) usadas como evidência da petição
5. Livros sem ISBN — não mencionar dados editoriais inexistentes
6. Numeração conflitante de evidências
7. Forbidden content (zero tolerância)
8. Margens invertidas (L=2.0, R=1.5 — não o contrário)
9. Headers em azul (sempre preto)
10. Seção explícita de objeções (costurar no texto)

### Padrões que funcionaram:
1. Comparativos com veículos americanos
2. Convergência editorial (múltiplos veículos, mesmo epíteto)
3. Pipeline pesquisa→produto→PI→receita
4. Validação cruzada por recomendadores de setores diferentes
5. Munição regulatória (PA-2025-16 + Mukherji + Kazarian) em cada critério
6. DRE como prova de monetização de PI
7. Footnotes robustos com fontes verificáveis

---

## 8. LIÇÕES DO CASO ANDREA JUSTINO (v2.1)

### Erros graves corrigidos (incorporados ao sistema):

1. **Capa em formato errado** — Gerada como "title page" centrada em vez de carta formal. CORRIGIDO: especificação completa de formato carta adicionada ao FORMATTING_SPEC.md.

2. **"satisfeito/satisfaz" = juízo de valor proibido** — A cover letter afirmava repetidamente "este critério está satisfeito", "satisfaz os requisitos", etc. O oficial do USCIS pode rejeitar pela presunção do peticionário em concluir a análise por ele. CORRIGIDO: FORBIDDEN_CONTENT.md agora tem CATEGORIA 0 (máxima prioridade) proibindo essas expressões. Usar "atendido"/"consistente com"/"documentalmente atendido".

3. **"Ev." em vez de "Evidence"** — Abreviação inconsistente com o padrão profissional. CORRIGIDO: regra adicionada ao FORMATTING_SPEC.md e FORBIDDEN_CONTENT.md.

4. **Tabelas com box borders** — Pareciam planilha Excel. O benchmark usa apenas linhas horizontais. CORRIGIDO: especificação de bordas adicionada ao FORMATTING_SPEC.md.

5. **"Step 2" em minúsculas** — Inconsistente com a importância da fase Kazarian. CORRIGIDO: regra "STEP 1"/"STEP 2" sempre em maiúsculas adicionada ao FORMATTING_SPEC.md.

6. **Termos inadvertidamente adversariais** — "jurídico", "adjudicativo" soam confrontacionais. CORRIGIDO: adicionados ao FORBIDDEN_CONTENT.md.

7. **Validadores chamados de "independentes"** — Implica que outros recomendadores não são independentes. Cabe ao oficial julgar. CORRIGIDO: adicionado ao FORBIDDEN_CONTENT.md.

8. **Fundo azul escuro (#1F3864) nos headers da capa** — Cores proibidas. CORRIGIDO: capa agora usa sage green (#C5E0B4) conforme benchmark.

### Erros graves adicionais (v2.2 — incorporados ao sistema):

9. **Empresa planejada tratada como constituída** — A cover letter da Andrea descrevia a Pravion LLC como "constituída na Flórida", "sediada em Winter Haven", quando a empresa NÃO EXISTE (Andrea é estudante sem work permit; Pravion é apenas um Business Plan). CORRIGIDO: FORBIDDEN_CONTENT.md agora tem CATEGORIA 3C completa com lista de substituições obrigatórias. Verificação deve incluir corpo, footnotes E timeline table.

10. **Datas erradas na timeline table** — O Redecard estava com 2025 (correto: 2024), as 5 cartas estavam com 2024 (correto: 2025). Causa raiz: regex mal calibrado durante compilação tocou as linhas erradas da tabela XML. CORRIGIDO: QUALITY_GATES agora exige verificação de CADA data contra evidência primária (Gate 3.14).

11. **Perguntar ao Paulo algo que está nas evidências** — Ao perguntar sobre datas de M1/M2 e sobre a "constituição da Pravion", Paulo ficou (com razão) furioso: "Vc que tem que saber a partir das evidências", "que pergunta amadora do caralho". CORRIGIDO: ARCHITECT regra 21 — se a resposta está nas evidências, BUSCAR nas evidências. Paulo não é a fonte; as evidências são.

12. **Business Plan com inconsistência interna não detectada** — O BP da Pravion dizia 78 empregos (p.47) e 93 empregos (p.48). A cover letter não citava números de empregos, então não houve conflito — mas se tivesse citado, haveria contradição. CORRIGIDO: QUALITY_GATES Gate 3.13 agora exige cross-check de TODOS os números citados entre BP e cover letter, INCLUINDO consistência interna do próprio BP.

13. **Datas sem dia exato nas cartas de recomendação** — As cartas tinham datas completas mas a cover letter usava apenas mês/ano. Paulo queria dia EXATO quando disponível. CORRIGIDO: QUALITY_GATES Gate 3.15 e ARCHITECT regra 20.

### Padrões que funcionaram no caso Andrea:
1. Compilação modular (10 scripts JS → 1 DOCX via master) — eficiente para revisões
2. Renumeração automática de footnotes na compilação
3. Thumbnails gerados via pdftoppm direto dos PDFs de evidência
4. Evidence blocks ANTES do texto argumentativo (NUNCA depois)
5. Defesas preemptivas costuradas no texto narrativo
6. Synopsis tables ao final de cada critério
7. Cross-references robustos entre critérios
8. BLS/OES como fonte padrão para comparativos salariais
9. Cross-check exaustivo BP ↔ cover letter (receita, TIR, ROI, VPL, NAICS)
10. Audit de 11 regras automatizado antes de entregar versão final
11. Comparação chunk-based entre versões paralelas para garantir nada perdido

---

## 9. ROADMAP

### v2.0 (Fevereiro 2026)
- [x] Arquitetura completa
- [x] 10 templates de critérios
- [x] 5 módulos de specs
- [x] Estrutura flat (compatível com Projects)

### v2.1 (Fevereiro 2026, pós-Andrea — primeira rodada)
- [x] Lições do Caso Andrea incorporadas em TODOS os .md
- [x] FORBIDDEN_CONTENT: CATEGORIA 0 (satisfeito), CATEGORIA 3B (termos)
- [x] FORMATTING_SPEC: capa formato carta, bordas horizontais, Evidence por extenso, STEP caps
- [x] QUALITY_GATES: novos checks (satisfeito, bordas, capa, STEP, Ev.)
- [x] LEGAL_FRAMEWORK: "satisf*" substituído por "atend*" nos exemplos
- [x] EVIDENCE_NAMING: "Ev." → "Evidence" em todo o documento
- [x] Templates: "Ev." → "Evidence" em synopsis tables

### v2.2 (atual — 27/02/2026, pós-Andrea — lições finais completas)
- [x] FORBIDDEN_CONTENT: CATEGORIA 3C (entidades planejadas/inexistentes — Pravion)
- [x] QUALITY_GATES: Gate 3.12 (entidades planejadas), 3.13 (BP cross-check), 3.14 (timeline dates), 3.15 (datas cartas)
- [x] QUALITY_GATES: validação script expandida (FORBIDDEN_PLANNED, BP_CROSSCHECK, TIMELINE_DATES)
- [x] ARCHITECT: regras 17-21 (entidades planejadas, BP cross-check, timeline, datas cartas, evidências vs perguntas)
- [x] ARCHITECT: checklist expandido com 4 novos checks
- [x] TEMPLATE_C5: "Validação Independente" → "Validação por Terceiros", "independentes" → "com observação direta"
- [x] SISTEMA: Seção 8 expandida com erros 9-13 e padrões 9-11
- [x] CHECKLIST_PRE_PRODUCAO: generalizado como template (removidos dados específicos Renato)
- [ ] validate_docx.py (script de validação automática)

### v2.3 (próximo)
- [ ] Template de Parte I (Introdução + Índice de Evidências)
- [ ] Template de Final Merits (STEP 2 Kazarian + Cartas + Conclusão)
- [ ] Script de geração de thumbnails reutilizável
- [ ] Script de merge de múltiplos .docx

### v3.0 (futuro)
- [ ] Sistema de cartas de recomendação
- [ ] Sistema de résumé EB-1
- [ ] Módulo EB-2 NIW (Business Plan)

---

*v2.2 — 27/02/2026*
*Baseado na engenharia reversa do caso Renato Silveira + lições COMPLETAS do caso Andrea Justino + 2 benchmarks + RAGs USCIS 2026*
