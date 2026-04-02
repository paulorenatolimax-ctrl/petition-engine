# AUDIT V2 — TECHNICAL DEEP DIVE
## Auditoria Técnica Exaustiva do Ecossistema OMNI — AIOS / Petition Engine
### Data: 02 de Abril de 2026
### Auditor: Claude Opus 4.6 (Senior Technical Auditor)
### Classificação: INTERNAL / CONFIDENTIAL

---

## SUMÁRIO EXECUTIVO

Esta auditoria consolida **7 relatórios independentes** cobrindo **18 sistemas** do ecossistema **OMNI** (produto: AIOS / Petition Engine), totalizando:

| Métrica | Valor |
|---------|-------|
| Sistemas auditados | 18 (17 sistemas de prompts + 1 codebase) |
| Arquivos analisados | ~350+ |
| Volume total analisado | ~2.5MB de especificações + ~85 arquivos de código |
| Contradições identificadas | 47 |
| Gaps identificados | 89 |
| Vulnerabilidades de segurança | 7 (4 críticas) |
| Regras de erro catalogadas | 77 |
| Recomendações geradas | 112 |

### Pontuação Geral por Sistema

| # | Sistema | Score | Status |
|---|---------|-------|--------|
| 1 | Résumé EB-2 NIW | 6.5/10 | Funcional com lacunas |
| 2 | Résumé EB-1A | 7.0/10 | Maduro com redundâncias |
| 3 | Cover Letter EB-1A v5.0 | 8.5/10 | O mais maduro do ecossistema |
| 4 | Cover Letter EB-2 NIW v3.0 | 7.5/10 | Sólido com contradições pontuais |
| 5 | Business Plan (BP Orquestrador) | 6.0/10 | Contradições críticas de formatação |
| 6 | Metodologia v2.1 | 7.0/10 | Estrutura forte, redundância alta |
| 7 | Declaração de Intenções v2.1 | 7.0/10 | Complementar à Met, mesmos problemas |
| 8 | IMPACTO (Economic Impact) | 5.0/10 | Erro grave EB-5 vs EB-2 NIW |
| 9 | Estratégia EB-2 NIW | 5.5/10 | Datado (mai/2025), incompleto |
| 10 | Estratégia EB-1A | 6.0/10 | Versão ambígua, RAGs ausentes |
| 11 | Localização EB-2 NIW | 5.5/10 | Dados fabricados, framework forte |
| 12 | Pareceres de Qualidade | 4.0/10 | Insumos valiosos, formato bruto |
| 13 | SaaS Evidence Architect | 6.5/10 | V2 boa, V1 insegura |
| 14 | Cartas EB-1 v3.0 | 8.0/10 | Sistema juridicamente robusto |
| 15 | Separation of Concerns | 7.0/10 | Protocolo eficaz, sem métricas |
| 16 | PPTX Engineering Spec | 7.5/10 | Pixel-perfect, gaps de footer |
| 17 | Design System Premium | 6.5/10 | Aprovado pelo usuário, hardcoded |
| 18 | Petition Engine Codebase | 6.2/10 | Funcional, segurança crítica |

**Média ponderada: 6.4/10**

### Top 10 Achados Críticos

1. **IMPACTO confunde EB-5 com EB-2 NIW** — Agents 04 e 05 aplicam framework EB-5 (NCE creates 10+ jobs) em vez de Dhanasar (substantial merit + national importance). Erro jurídico grave.

2. **Command injection em múltiplos endpoints** — Paths de arquivo inseridos em strings de comando Python sem sanitização no Petition Engine. Permite execução arbitrária de código.

3. **Path traversal em `/api/quality/validate-local`** — `readFileSync(file_path)` aceita qualquer caminho do filesystem sem validação.

4. **60% dos dados do Sistema 11 são fabricados** — Taxas de aprovação por MSA, correlações carta-aprovação e RFE rates por Service Center não existem em fontes públicas USCIS.

5. **Contradição de idioma entre Résumé e Cover Letter** — Résumés definem "Padrão: Inglês", Cover Letters exigem "100% PT-BR". Fragmentação linguística no dossiê.

6. **Contradição de footnotes nos Cover Letters** — FORMATTING_SPEC exige footnotes nativos XML; QUALITY_GATES exige notas manuais [1],[2]. Regras mutuamente exclusivas.

7. **1.13MB de redundância nos 42 section files do BP** — System prompt completo (~27KB) copiado identicamente em cada arquivo de seção.

8. **Zero autenticação no Petition Engine** — Qualquer processo local pode chamar qualquer endpoint da API.

9. **SaaS Evidence Architect V1 expõe estratégia de decoy pricing** — Campos `decoy: true`, `role: "decoy"`, `conversion_hypothesis` visíveis no output JSON.

10. **Pareceres de Qualidade sem estrutura** — 654KB de e-mails brutos sem categorização, severidade ou rastreabilidade de correções. ~60% é ruído.

### Veredito Geral

O ecossistema OMNI (AIOS / Petition Engine) representa um investimento substancial em engenharia de processos de imigração, com sistemas maduros (Cover Letter EB-1A v5.0, Cartas EB-1 v3.0) que incorporam lições de produção real. Porém, **contradições inter-sistemas, dados fabricados, vulnerabilidades de segurança e redundância massiva** impedem a escala de 5 para 30 clientes/mês. A priorização deve ser: (1) corrigir erros jurídicos no IMPACTO, (2) eliminar vulnerabilidades de segurança no codebase, (3) resolver contradições de idioma/footnotes/formatação, (4) consolidar redundâncias.

---

## QUADRO RESUMO DOS 18 SISTEMAS

| # | Sistema | Arquivos | KB | Versão | Score | Status |
|---|---------|----------|----|--------|-------|--------|
| 1 | Résumé EB-2 NIW | 4 | ~46 | 2.0 | 6.5 | Funcional |
| 2 | Résumé EB-1A | 10 | ~113 | 2.0 | 7.0 | Maduro |
| 3 | Cover Letter EB-1A | 25 | ~260 | 5.0 | 8.5 | Referência |
| 4 | Cover Letter EB-2 NIW | 18 | ~225 | 3.0 | 7.5 | Sólido |
| 5 | Business Plan | 50+ | ~1400 | 3.0 | 6.0 | Contraditórios |
| 6 | Metodologia | 5 | ~65 | 2.1 | 7.0 | Estruturado |
| 7 | Declaração de Intenções | 6 | ~78 | 2.1/2.2 | 7.0 | Estruturado |
| 8 | IMPACTO | 9 | ~330 | 2.0 | 5.0 | Erro jurídico |
| 9 | Estratégia EB-2 NIW | 9 | ~40 | 1.0 | 5.5 | Datado |
| 10 | Estratégia EB-1A | 11 | ~175 | 1.0/2.0 | 6.0 | Ambíguo |
| 11 | Localização | 2 | ~273 | 1.0 | 5.5 | Dados fabricados |
| 12 | Pareceres de Qualidade | 1 | ~654 | N/A | 4.0 | Bruto |
| 13 | SaaS Evidence Architect | 2 | ~31 | 1.0/2.0 | 6.5 | V1 insegura |
| 14 | Cartas EB-1 | 10 | ~222 | 2.0/3.1 | 8.0 | Robusto |
| 15 | Separation of Concerns | 1 | ~10 | 1.0 | 7.0 | Eficaz |
| 16 | PPTX Engineering Spec | 1 | ~14 | 1.0 | 7.5 | Preciso |
| 17 | Design System Premium | 1 | ~6 | 1.0 | 6.5 | Hardcoded |
| 18 | Petition Engine Codebase | 85+ | ~500 | N/A | 6.2 | Funcional |

---

## SISTEMA 1: RÉSUMÉ EB-2 NIW

### Inventário de Arquivos

| # | Arquivo | Tamanho | Propósito |
|---|---------|---------|-----------|
| 1 | FORMATTING_SPEC_RESUME_EB2NIW.md | 6.4KB | Constantes visuais e formatação |
| 2 | QUALITY_REVIEWER.md | 21.7KB | Script Python de verificação + checklist |
| 3 | SISTEMA_RESUME_EB2NIW.md | 8.8KB | Processo completo de produção |
| 4 | TEMPLATE_RESUME_EB2NIW.md | 9.1KB | Estrutura exata de cada seção |

**Diretório:** `/Users/paulo1844/Documents/AIOS_Petition Engine/EB2_NIW_RESUME_SYSTEM/`
**Versão:** 2.0 | **Data:** 03/mar/2026

### Propósito e Escopo

O sistema produz résumés EB-2 NIW via python-docx, utilizando o framework Dhanasar (3 prongs) como base jurídica. O résumé é definido como documento técnico-probatório, não argumentativo.

### Regras Específicas com Valores Exatos

**Paleta de cores (8 cores):**
- NAVY `#2D3E50`, TEAL `#3498A2`, WHITE `#FFFFFF`, BLACK `#000000`
- DARK_GRAY `#333333`, MED_GRAY `#666666`, LIGHT_GRAY `#F5F5F5`, BORDER_GRAY `#CCCCCC`

**Tipografia:** "REGRA ABSOLUTA: 100% Garamond. ZERO Arial, ZERO Calibri, ZERO qualquer outra fonte."
- Nome no header: Garamond 20pt Bold Branco
- Body text: Garamond 10.5pt Regular Preto
- Evidence block impact: Garamond 9.5pt Italic `#333333`

**Layout:** US Letter 8.5"x11", top=0", bottom=0.5", left/right=0.65"
- CONTENT_WIDTH = 10080 DXA
- META_WIDTH = 5760 DXA (evidence block esquerda)
- THUMB_WIDTH = 4320 DXA (evidence block direita)

**Evidence Block V2.0:** Thumbnail na coluna DIREITA, descrição/impacto DENTRO do bloco. Mínimo 4 linhas de impacto. Borda `#CCCCCC` sz="4".

**12 Regras Cardinais:** 1-7 idênticas ao EB-1A, 8-12 NIW-específicas (Proposed Endeavors obrigatórias, dados de mercado com fonte, códigos BLS corretos, framework Dhanasar, sem seções por critério EB-1A).

### Conteúdo Proibido

- Nenhuma cor além das 8 listadas
- Proibido A4, margens de 1", margens de 0.5"
- Zero R$ (exceto se Paulo autorizar)
- Palavras proibidas no QUALITY_REVIEWER: apenas `["R$"]` — lista insuficiente

### Quality Gates

Script Python (~470 linhas) verificando: fontes (S0), page setup (S1), palavras proibidas, imagens, evidence blocks com impact, parágrafos curtos, header/footer, seções obrigatórias, cores em cell shading, consistência de idioma.

**Classificação:** S0 (GRAVÍSSIMO, bloqueia), S1 (GRAVE, bloqueia), S2 (MODERADO, corrigir), S3 (MENOR, documentar)

### Framework Legal

- Dhanasar v. USCIS (26 I&N Dec. 884, AAO 2016) — 3 Prongs
- 8 CFR 204.5

### Gaps e Contradições

1. **CONTRADIÇÃO DE IDIOMA:** Template diz "Padrão: Inglês" vs Cover Letter "100% PT-BR"
2. **QUALITY_REVIEWER DUPLICADO:** Idêntico ao do EB-1A sem mecanismo de sincronia
3. **Cor FAFAFA não documentada:** Aparece como alternate row no REVIEWER mas não está na paleta oficial
4. **Sem pipeline DOCX:** Não tem equivalente ao DOCX_PRODUCTION_PIPELINE dos Cover Letters

### Score de Maturidade: 6.5/10

- Estrutura: 7/10 | Completude: 6/10 | Consistência: 5/10 | Automação: 7/10

---

## SISTEMA 2: RÉSUMÉ EB-1A

### Inventário de Arquivos

| # | Arquivo | Tamanho | Propósito |
|---|---------|---------|-----------|
| 1 | ARCHITECT_RESUME_EB1.md | 11.8KB | System prompt para produção |
| 2 | FORBIDDEN_CONTENT_RESUME.md | 3.5KB | 10 categorias de proibições |
| 3 | FORMATTING_SPEC_RESUME.md | 17.2KB | Tipografia, cores, layout |
| 4 | MAPA_DE_ERROS.md | 7.1KB | Anti-padrões de produção |
| 5 | PROTOCOLO_INTERACAO_RESUME.md | 5.3KB | 7 regras invioláveis |
| 6 | QUALITY_GATES_RESUME.md | 4.9KB | 6 gates de validação |
| 7 | QUALITY_REVIEWER.md | 21.7KB | Script Python + checklist (DUPLICADO do S1) |
| 8 | README_RESUME.md | 4.4KB | Índice e setup rápido |
| 9 | SISTEMA_RESUME_EB1A.md | 22.7KB | Arquitetura completa |
| 10 | TEMPLATE_RESUME.md | 14.3KB | Template de todas as seções |

**Diretório:** `/Users/paulo1844/Documents/AIOS_Petition Engine/EB1A_RESUME_SYSTEM/`
**Versão:** 2.0 | **Data:** 03/mar/2026

### Propósito e Escopo

Citação direta do ARCHITECT: "Você é um documentador técnico, não um advogado. Seu trabalho é apresentar fatos e evidências, não argumentar juridicamente."

Résumé EB-1A definido como documento de 25-75 páginas. REGRA ZERO: consultar RAGs antes de tudo. 4 RAGs de doutrina obrigatórios. Benchmarks reais: Renato (54pg), Carlos (72pg), Bruno (27pg).

### Regras Específicas

**27 elementos tipográficos** com fonte, tamanho, peso, cor. Mesma paleta de 8 cores do S1. Mesmo layout US Letter 0.65" L/R.

**7 Regras Invioláveis do Protocolo:**
1. Nunca avançar sem aprovação
2. Nunca inventar dados
3. Consultar RAGs e listar o que leu
4. Nunca gerar résumé inteiro de uma vez
5. Auto-check de densidade vs benchmark (70-90% = avisar)
6. Inventário com contagem na Fase 0
7. Validação mecânica antes de entregar

**6 Quality Gates:** Inventário, Plano, Pré-Produção, Validação (4A-4D), Consolidação, Auditoria Cruzada com Cover Letter

### Conteúdo Proibido (10 categorias)

1. Referências a outros clientes (Carlos, Bruno, nomes de concorrentes)
2. Argumentação jurídica (8 CFR, Kazarian, preponderance)
3. Terminologia proibida ("o beneficiário" -> "Dr. [Nome]" ou "I")
4. Dados inventados
5. Claims absolutas ("100%", "único", "nenhum outro")
6. Conteúdo de marketing ("incrível", "revolucionário")
7. Links quebrados
8. Imagens sem contexto
9. Inconsistência com Cover Letter
10. Texto em azul

### Framework Legal

- Kazarian v. USCIS (596 F.3d 1115, 9th Cir. 2010) — 2 Steps + 10 Critérios
- 8 CFR 204.5(h)(3)

### Gaps e Contradições

1. **ARCHITECT DESATUALIZADO:** Evidence block mostra thumbnail na coluna ESQUERDA com impact ABAIXO; FORMATTING_SPEC V2.0 define thumbnail na DIREITA com impact DENTRO
2. **FORBIDDEN CONTENT INCOMPLETO:** Lista muito menor que Cover Letters. Faltam: "satisfeito/satisfaz", "jurídico/adjudicativo", "Ev.", employer/sponsor
3. **QUALITY_REVIEWER DUPLICADO** sem sincronia
4. **SEM PIPELINE DOCX:** Cover Letters têm DOCX_PRODUCTION_PIPELINE; Résumés não

### Score de Maturidade: 7.0/10

- Estrutura: 8/10 | Completude: 7/10 | Consistência: 6/10 | Automação: 7/10

---

## SISTEMA 3: COVER LETTER EB-1A v5.0

### Inventário de Arquivos

| # | Arquivo | Tamanho | Propósito |
|---|---------|---------|-----------|
| 1 | ARCHITECT_COVER_LETTER_EB1.md | 13.7KB | System prompt principal |
| 2 | CHECKLIST_PRE_PRODUCAO.md | 9.6KB | Checklist pré-produção |
| 3 | DOCX_PRODUCTION_PIPELINE.md | 6.1KB | Pipeline DOCX (wp:anchor, tblInd, keepNext) |
| 4 | EVIDENCE_CONTENT_VALIDATION.md | 6.2KB | Validação conteúdo PDFs |
| 5 | EVIDENCE_NAMING_CONVENTION.md | 5.6KB | Nomenclatura de evidências |
| 6 | FORBIDDEN_CONTENT.md | 13.6KB | 8 categorias de proibições |
| 7 | FORMATTING_SPEC.md | 12.9KB | Tipografia v4.0 paleta AIOS |
| 8 | LEGAL_FRAMEWORK_2026.md | 9.5KB | Legislação e jurisprudência |
| 9 | PROTOCOLO_DE_INTERACAO.md | 11.2KB | 8 regras invioláveis |
| 10 | QUALITY_GATES.md | 17.7KB | 7 gates + gates adicionais v3/v5 |
| 11 | README.md | 10.5KB | Índice, changelog, setup |
| 12-25 | Templates C1-C10 + auxiliares | ~85KB | Templates por critério |

**Diretório:** `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/` *(caminho legado — pasta "_PROEX" é diretório herdado do período em que Paulo trabalhou na PROEX, empresa concorrente. Não indica propriedade da PROEX sobre o sistema.)*
**Versão:** 5.0 | **Data:** 18/mar/2026

### Propósito e Escopo

O sistema MAIS MADURO e COMPLETO dos 17 sistemas de prompts. Incorpora lições de 4 casos reais (Renato, Andrea, Vitória, Carlos). Changelog detalhado v2.0 -> v5.0 com motivações claras.

### Regras Específicas

**Paleta AIOS (diferente dos Résumés — intencional):**
- `#D6E1DB` (verde AIOS), `#FFF8EE` (creme), `#E3DED1` (bege), `#F2F2F2` (cinza)

**Margens:** L=2.0cm, R=1.5cm, T/B=1.5cm

**8 categorias de FORBIDDEN_CONTENT:**
- Categoria 0: "satisfeito/satisfaz" — termo que invalida Kazarian Step 2
- Categoria 3C: entidades planejadas (futuro)
- Categoria 7: idioma PT-BR obrigatório
- Categoria 8: proporções (10-15% intro / 40-50% Step 1 / 35-45% Step 2)

**EVIDENCE_CONTENT_VALIDATION:** Detecção de placeholders por regex, redundância por Jaccard similarity, lógica de thumbnail para documentos traduzidos.

**SEMANTIC_CROSS_REFERENCE_MAP:** Dicionário de verdade entidade->evidência que previne erros de referência cruzada.

**DOCX_PRODUCTION_PIPELINE:** 9 etapas técnicas incluindo conversão wp:inline->wp:anchor para posicionamento preciso de thumbnails.

### Quality Gates

7 Gates principais + 5 Gates adicionais v3 + Gate 7 v5 = sistema robusto de QA.

### Framework Legal

- Kazarian v. USCIS (596 F.3d 1115, 9th Cir. 2010)
- PA-2025-16 (Agosto 2025, non-discretionary)
- Mukherji v. Miller (No. 4:24-CV-3170, D. Neb., Jan 28 2026)
- Loper Bright v. Raimondo (2024, SCOTUS — eliminou Chevron deference)

### Gaps e Contradições

1. **CONTRADIÇÃO FOOTNOTES:** FORMATTING_SPEC exige footnotes nativos XML (w:footnoteReference); QUALITY_GATES Gate 7.6 exige notas manuais [1],[2]. Regras CONFLITANTES.
2. **SISTEMA v2.2 vs README v5.0:** O arquivo SISTEMA não foi atualizado com lições Vitória (v5).
3. **Proporções sem gate automatizado:** Categoria 8 define proporções mas não há check correspondente.

### Score de Maturidade: 8.5/10

- Estrutura: 9/10 | Completude: 9/10 | Consistência: 7/10 | Automação: 8/10

---

## SISTEMA 4: COVER LETTER EB-2 NIW v3.0

### Inventário de Arquivos

| # | Arquivo | Tamanho | Propósito |
|---|---------|---------|-----------|
| 1 | ARCHITECT_COVER_LETTER_EB2_NIW_v3.md | 8.5KB | System prompt (execução autônoma) |
| 2 | DOCX_PRODUCTION_PIPELINE_NIW.md | 6.5KB | Pipeline DOCX |
| 3-18 | Configs, templates, agents | ~210KB | Validação, naming, forbidden, legal, etc. |

**Diretório:** `/Users/paulo1844/Documents/AIOS_Petition Engine/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions/`
**Versão:** 3.0 | **Data:** 18/mar/2026

### Propósito e Escopo

Execução autônoma: "Drop docs, press go, get cover letter" — apenas 3 HALTs. Anti-boilerplate: "USCIS usa ATLAS (NLP) e ATA (perplexidade) para detectar texto genérico de IA."

**RESEARCH_AGENT:** 15-30 web searches em 10 categorias (CETs, EOs, BLS, O*NET, CISA, Budget, DCI).

**Proporções NIW-específicas:** Eligibility 10-15%, Prong 1 25-35%, Prong 2 25-35%, Prong 3 10-20%.

**CATEGORIA 0-NIW:** Proibição explícita de employer/sponsor (NIW = autopetition).

**Target quantitativo:** 55-92 páginas, 15-30 evidence cards, 14+ tabelas.

### Gaps e Contradições

1. **CONTRADIÇÃO CVs/SUB-EVIDÊNCIAS:** EVIDENCE_NAMING diz "ZERO sufixos"; QUALITY_GATES diz "CV do recomendador como sub-evidência (XXa)".
2. **FOOTNOTES:** Mesma contradição do EB-1A (nativos XML vs manuais [1],[2]).
3. **Versões anteriores na mesma pasta** (V1_, V2_ coexistem com V3) — risco de uso errado.

### Score de Maturidade: 7.5/10

---

## SISTEMA 5: BUSINESS PLAN (BP Orquestrador + BP_SYSTEM_V3)

### Inventário de Arquivos

| # | Arquivo/Dir | Tamanho | Propósito |
|---|-------------|---------|-----------|
| 1 | README_BP.md | 5.8KB | Guia de setup |
| 2 | SISTEMA_BP.md | 8.1KB | Arquitetura de 6 blocos |
| 3 | ARCHITECT_BP.md | 5.0KB | System prompt base + 13 regras |
| 4 | FORBIDDEN_CONTENT_BP.md | 4.1KB | 12 termos proibidos |
| 5 | FORMATTING_SPEC_BP.md | 4.5KB | Tipografia e layout |
| 6 | QUALITY_GATES_BP.md | 6.1KB | 6 quality gates |
| 7 | global_config_reference.json | 16.6KB | Config do sistema Lovable |
| 8 | sections/ (42 arquivos) | ~1.13MB | Prompts individuais por seção |
| 9 | MEGA_PROMPT_LOVABLE_FORMATACAO_V2.md | 5.9KB | Spec formatação DOCX |
| 10 | generate_bp.py / v2.py | ~120KB | Geradores Python |
| 11 | BP_DIRETRIZES_RECONSTRUCAO.md | 18.7KB | Post-mortem de 12 versões |
| 12 | validate_bp.py | 7.5KB | Validação automatizada |

**Diretório:** `/Users/paulo1844/Documents/OMNI/_SISTEMAS (Petition Engine)/BP Orquestrador/`

### Propósito e Escopo

42 seções em 6 blocos sequenciais. Research Pack obrigatório. Máximo 200 palavras por parágrafo. Geração sequencial obrigatória (Bloco 1 -> 6). Modelo default: claude-haiku-4-5-20251001, temperatura 0.3.

### Regras Específicas

**13 Regras Invioláveis do ARCHITECT:**
1. Anti-Alucinação (prioridade máxima)
2. Termos Proibidos (rejeição imediata)
3. Qualidade de Escrita
4. Formato de Output (Markdown)
4b. Formato de Tabelas
5-13. Coerência, heterogeneidade visual, anti-repetição, citações, prosa, listas

**12 Termos Proibidos:**
`consultoria`, `consultor`, `consulting`, `EB-1`, `EB-2`, `NIW`, `green card`, `visto`, `imigração`, `USCIS`, `petition`, `petição`

**GAP CRÍTICO:** "consultant" (inglês, singular) NÃO é proibido mas "consulting" é. Permite bypass: "a consultant in the field" passa pela validação.

**Hierarquia de Confiança (7 níveis):**
1. Dados da Planilha -> ABSOLUTA
2. Dados de Web Search -> ALTA
3-7. Formulário -> Média -> Baixa -> NÃO USE

### Contradições Críticas (7 identificadas)

| # | FORMATTING_SPEC | MEGA_PROMPT | Status |
|---|----------------|-------------|--------|
| 1 | Times New Roman 12pt | Garamond 11pt | **CONFLITO** |
| 2 | Margens 1" todos lados | 0.7/0.6/0.8/0.6" | **CONFLITO** |
| 3 | Cor H1 #1A1A2E (Navy) | #584D42 (Marrom) | **CONFLITO** |
| 4 | Header tabela #E8E0D4/#D9D9D9 | #DEDACB (marrom claro) | **CONFLITO** |
| 5 | Footer #3B4A3A (verde) | #584D42 (marrom) | **CONFLITO** |
| 6 | Target 55-65 páginas | 60-75 páginas | **CONFLITO** |
| 7 | Max parágrafo 200 palavras | Max 400 chars (~65 palavras) | **CONFLITO** |

**Veredicto:** O sistema em produção usa Garamond 11pt, paleta marrom, margens assimétricas. O FORMATTING_SPEC está COMPLETAMENTE DESATUALIZADO.

### Redundância Massiva

42 cópias do system prompt completo (~27KB cada) = **~1.13MB de conteúdo repetido**. Deveria ser template único com variáveis.

### Score de Maturidade: 6.0/10

- Framework/Estrutura: 8/10 | Consistência interna: 4/10 | Automação: 7/10 | Manutenibilidade: 4/10

---

## SISTEMA 6: METODOLOGIA v2.1

### Inventário de Arquivos

| # | Arquivo | Tamanho | Versão |
|---|---------|---------|--------|
| 1 | PROMPT 0 — Dossiê Fundacional | 16.5KB | v2.1 |
| 2 | PROMPT 1 — Dossiê Metodológico | 14.0KB | v2.1 |
| 3 | PROMPT 2 — Análise Estratégica | 10.2KB | v2.1 |
| 4 | PROMPT 3 — Validação por Especialistas | 11.9KB | v2.1 |
| 5 | PROMPT 4 — Auditoria Final | 11.7KB | v2.1 |

**Diretório:** `/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/METODOLOGIA (PROMPTS)/`

### Propósito e Escopo

Sistema de 5 prompts modulares para produção do "COMO PASSADO" — arquitetura probatória do histórico profissional. Sem limite de extensão. Cada prompt acumula output dos anteriores.

### Regras Específicas

**Termos Proibidos (3 categorias):**
- Tecnologia/bastidor: IA, modelo, algoritmo, prompt, sistema, output
- Imigração: RFE, NOID, USCIS, visto, petição, adjudicação
- Fraqueza: fragilidade, lacuna, falta, deficiência

**Regra de Repetição de Métricas:** Max 3 ocorrências por métrica numérica (1a completa, 2a resumida, 3a apenas em tabela, 4a+ qualitativa).

**Protocolo Anti-Uniformidade Textual (5 regras):**
1. Variar comprimento de frases (8-12 vs 40-60 palavras)
2. Variar estrutura sintática
3. Eliminar padrões formulaicos
4. Privilegiar dados sobre adjetivos
5. 7 expressões boilerplate proibidas

**Hierarquia de Peso Probatório dos Signatários (Prompt 3):**
- MÁXIMO: Autoridades governamentais, especialistas independentes
- ALTO: Parceiros comerciais, acadêmicos
- MODERADO: Colegas de nível similar
- BAIXO (EVITAR): Subordinados, familiares

### Contradição Interna

**PROMPT 4 permite "inferência lógica realista"** — contradiz Protocolo de Leitura dos Prompts 0-3 que diz "NUNCA inferir datas, nomes, cargos ou métricas não escritas nos documentos."

### Score de Maturidade: 7.0/10

---

## SISTEMA 7: DECLARAÇÃO DE INTENÇÕES v2.1

### Inventário de Arquivos

| # | Arquivo | Tamanho | Versão |
|---|---------|---------|--------|
| 1 | PROMPT 0 — Blueprint Estratégico | 16.4KB | v2.2 |
| 2 | PROMPT 1 — Autonomia Técnica | 16.0KB | v2.2 |
| 3 | PROMPT 2 — Delimitação Estratégica | 10.6KB | v2.1 |
| 4 | PROMPT 3 — Validação Externa | 11.8KB | v2.1 |
| 5 | PROMPT 4 — Relevância Estratégica | 10.9KB | v2.1 |
| 6 | PROMPT 5 — Auditoria Final | 12.4KB | v2.1 |

**Diretório:** `/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)/`

### Propósito e Escopo

Complemento da Metodologia: enquanto a Met trata o "COMO PASSADO", a Declaração trata o "COMO FUTURO". Foco 100% futuro. Max 2 parágrafos de ancoragem no passado em TODO o documento.

**Cobertura Silenciosa (não mencionar no texto):**
- A: "Por que este esforço importa"
- B: "Por que ESTA pessoa é a pessoa certa"
- C: "Por que o mecanismo padrão não serve"

**Bifurcação interna (Prompt 5):**
- Estrutura A: Com BP (modo empreendimento)
- Estrutura B: Sem BP (modo atuação individual)

### Versionamento Inconsistente

Prompts 0-1 estão na v2.2; Prompts 2-5 na v2.1. Não há documentação das diferenças.

### Redundância com Metodologia

Protocolos idênticos repetidos 11x entre Metodologia e Declaração (~6050 palavras de conteúdo repetido): Protocolo de Leitura, Regra de Repetição, Anti-Uniformidade.

### Score de Maturidade: 7.0/10

---

## SISTEMA 8: IMPACTO (Economic Impact Intelligence Suite)

### Inventário de Arquivos

| # | Arquivo | Tamanho | Propósito |
|---|---------|---------|-----------|
| 1 | AGENT_MASTER.md | 81.9KB | Orquestrador do pipeline de 9 etapas |
| 2 | AGENT_01_INTAKE.md | 29.2KB | Ingestão e extração de dados |
| 3 | AGENT_02_RESEARCH.md | 33.4KB | Pesquisa econômica, RIMS II, BLS |
| 4 | AGENT_03_CALCULATOR.md | 22.2KB | Motor de cálculos (13 metodologias) |
| 5 | AGENT_04_BUILDER.md | 27.3KB | Gerador de DOCX |
| 6 | AGENT_05_QA.md | 45.8KB | QA em 4 estágios |
| 7 | build_impacto_universal.js | 35.7KB | Script Node.js para DOCX |
| 8 | client_config_template.json | 27.1KB | Template JSON parametrizado |
| 9 | client_config_luciano.json | 27.8KB | Config real (4PL Logistics) |

### Propósito e Escopo

Pipeline de 9 etapas para produção de relatório de impacto econômico. Produto: Global Communication LLC, Versão 2.0. 13 módulos de cálculo (M1-M13, excluindo M10). Suporte bilíngue EN + PT-BR.

### Regras Específicas

**8 Regras Invioláveis:**
1. NO FABRICATED DATA
2. ALL MULTIPLIERS MUST BE SOURCED (estado, NAICS, MSA, ano)
3. REVENUE PROJECTIONS FROM CLIENT BP ONLY
4. ALWAYS USE MATTER OF DHANASAR FRAMEWORK
5. EVERY MODULE CONNECTS TO "SUBSTANTIAL MERIT & NATIONAL IMPORTANCE"
6. USE USCIS OFFICER LANGUAGE
7. WITHSTAND USCIS AI DETECTION SCRUTINY (ATLAS, ATA, VIBE)
8. ALL CALCULATIONS MUST BE REPRODUCIBLE & DEFENSIBLE

**Paleta IMPACTO:** NAVY `#0A1628`, TEAL `#0D9488`, GOLD `#D4A843`
**Fonte:** Arial | Layout: US Letter, 1" margins

### ERRO CRÍTICO: Confusão EB-5 vs EB-2 NIW

O AGENT_MASTER aplica Dhanasar corretamente (EB-2 NIW), mas os AGENT_04_BUILDER e AGENT_05_QA aplicam framework **EB-5 Investor**:
- Builder: "subtitle: 'EB-5 Capital Investment Program'"
- QA: "Prong 1: NCE Creates 10+ Jobs" (linguagem EB-5)
- QA: "28 I&N Dec. 820 (AAO 2023)" — citação INCORRETA (correto: 26 I&N Dec. 884, 2016)

**Dhanasar (EB-2 NIW) REAL:** (1) Substantial merit + national importance, (2) Well-positioned, (3) On balance beneficial.
**EB-5 REAL:** (1) NCE creates 10+ jobs, (2) Jobs within regional economy, (3) Targeted Employment Area.

Estes são frameworks COMPLETAMENTE DIFERENTES.

### Erros no Config Luciano

- FL income tax: config usa $900K — **Florida NÃO TEM income tax** (0%)
- Jobs by sector: "Other 42%" mas cálculo real = 26%
- Output total: 47.3M vs calculado 47.616M (diferença 0.66%)

### Score de Maturidade: 5.0/10

- Framework: 7/10 | Precisão Jurídica: 2/10 | Automação: 8/10 | Consistência: 4/10

---

## SISTEMA 9: ESTRATÉGIA EB-2 NIW

### Inventário de Arquivos

9 prompts sequenciais (4.1-5.1KB cada). **Data:** 12/mai/2025 (quase 1 ano atrás).

### Propósito e Escopo

Pipeline de 9 prompts para definição estratégica do caso EB-2 NIW: mapeamento de importância nacional, definição do negócio, serviços, políticas governamentais (tripla perspectiva), missão/visão/valores, códigos BLS, integração final.

### Regras Específicas

- 7 áreas estratégicas mapeadas (STEM, Energia, Saúde, Educação, Desenvolvimento Regional, Segurança, Cadeias Críticas)
- 3 prompts de políticas governamentais com regra de NÃO REPETIR entre eles
- URL COMPLETA obrigatória (com protocolo, domínio, caminho exato)
- 4 códigos BLS solicitados (inconsistente com S10 que pede 3)

### Gaps Críticos

1. **NÃO aborda Prong 2 e Prong 3 de Dhanasar** — foco quase inteiro no Prong 1
2. **Sem integração com IMPACTO** — não referencia Sistema 8
3. **Sem template de cover letter** — gera estratégia mas não o documento
4. **Sem protocolo de RFE**
5. **Datado:** mai/2025, URLs podem estar desatualizadas

### Score de Maturidade: 5.5/10

---

## SISTEMA 10: ESTRATÉGIA EB-1A

### Inventário de Arquivos

1 arquivo principal (39.9KB) + 10 arquivos na TENTATIVA 2 - KORTIX (~135KB).

### Propósito e Escopo

4 prompts sequenciais para análise de viabilidade EB-1A: mapeamento de perfil, análise dos 10 critérios, validação de códigos ocupacionais, relatório estratégico.

**Framework:** Kazarian Step 1 (3+ critérios) + Step 2 (topo do campo).

**Escala de Classificação:** ROBUSTA / PROMISSORA / EM DESENVOLVIMENTO (nunca "fraca" ou "frágil").

### Regras Críticas

**Códigos Ocupacionais Proibidos:**
- NUNCA Accountant (13-2011) -> USAR Financial Manager (11-3031)
- NUNCA Physician (29-1069) -> USAR Medical Services Manager (11-9111)
- NUNCA Engineer (17-2011) -> USAR Engineering Manager (11-9041)
- NUNCA Lawyer (23-1011) -> USAR Administrative Services Manager (11-3011)

Razão: profissões regulamentadas exigem licenciamento estadual.

### Gaps

1. **Versão ambígua:** Principal vs TENTATIVA 2 — sem indicação de qual usar
2. **RAGs não fornecidos:** 3 RAGs obrigatórios referenciados mas ausentes
3. **Métricas infladas:** "65%+ approval rate" sem evidência empírica
4. **Emojis excessivos** na TENTATIVA 2 (contradiz regra própria)

### Score de Maturidade: 6.0/10

---

## SISTEMA 11: LOCALIZAÇÃO EB-2 NIW

### Inventário de Arquivos

| # | Arquivo | Tamanho |
|---|---------|---------|
| 1 | EB-2 NIW STRATEGIC LOCATION ANALYSIS.md | 273KB (6,223 linhas) |
| 2 | EB-2 NIW STRATEGIC LOCATION ANALYSIS.pdf | 857KB (~119 páginas) |

### Propósito e Escopo

Sistema de 10 prompts modulares sequenciais para análise de localização geográfica otimizada para EB-2 NIW. Citação: "Identificar as 3 melhores regiões dos Estados Unidos para maximizar aprovação EB-2 NIW."

### Regras Específicas

**Critérios Geográficos OZ:**
- Poverty Rate >= 20%, Median Family Income <= 80% AMI
- Unemployment Rate >= 1.5x média nacional, Population Loss >= 10% desde 2000
- 8,764 Qualified Opportunity Zones, expiração Dec 31, 2028

**Fórmula de Scoring (6 fatores):**
- opportunity_zone_density: 0.25
- programas_federais_alinhados: 0.25
- economically_depressed_indicators: 0.20
- stem_ecosystem_regional: 0.15
- historical_niw_approval_rate: 0.10
- state_incentives_multiplier: 0.05

### DADOS FABRICADOS (~60% do conteúdo numérico)

**Taxas de aprovação por região (NÃO EXISTEM em fontes USCIS):**
- "Austin TX: 67%", "Research Triangle NC: 71%", "Detroit MI: 78%", "Baltimore MD: 81%"
- USCIS publica dados AGREGADOS, NÃO por Metropolitan Statistical Area

**Correlações carta-aprovação (NÃO HÁ estudo publicado):**
- "87% com carta NIH" vs "34% sem carta" — fabricado
- "91% com carta CDC" — fabricado

**RFE rates por Service Center (NÃO PUBLICADOS):**
- "California SC: ~65%", "Texas SC: ~45%", "Nebraska SC: ~35%"

**Dados desatualizados:**
- Capital gains deferral "Dec 31, 2026" — JÁ EXPIROU
- OZ status legislativo pode ter mudado

### Gaps Críticos

1. **Ausência total de Prong 3** (Beneficial to Waive) — critério OBRIGATÓRIO
2. **Pseudocódigo Python decorativo** — cria ilusão de rigor sem substância
3. **~30-40% boilerplate repetido** entre fases
4. **Sem instruções para ferramentas reais** (APIs BLS, Census, USCIS)

### Score de Maturidade: 5.5/10

- Framework/Estrutura: 8.5/10 | Precisão Factual: 3.0/10 | Completude Legal: 6.0/10 | Executabilidade: 4.0/10

---

## SISTEMA 12: PARECERES DE QUALIDADE

### Inventário de Arquivos

| # | Arquivo | Tamanho |
|---|---------|---------|
| 1 | Pareceres da Qualidade - Apontamentos.md | 654KB (11,156 linhas) |

### Propósito e Escopo

Compilação bruta de threads de e-mail (Gmail) do Setor de Qualidade herdado do período em que Paulo era supervisor na PROEX (empresa concorrente). 16 clientes/casos documentados, ~120+ apontamentos únicos, período novembro/2025 a março/2026.

> **Nota:** Os "Pareceres da Qualidade" referenciados neste ecossistema são dados herdados do período em que Paulo trabalhava na PROEX (concorrente). O conteúdo é valioso como insumo de engenharia de qualidade para a **OMNI**, mas a PROEX é concorrente direta. A empresa de Paulo é a **OMNI**, e o produto é o **AIOS / Petition Engine**.

### Top 10 Padrões de Erros

| # | Padrão | Ocorrências | Severidade |
|---|--------|-------------|------------|
| 1 | Divergência de datas entre documentos | 15+ | CRÍTICA |
| 2 | Texto residual de outro cliente/região | 5+ | CRÍTICA |
| 3 | Mistura de idiomas | 8+ | MAIOR |
| 4 | Inconsistência financeira entre tabelas e texto | 6+ | CRÍTICA |
| 5 | Cartas de recomendação padronizadas | 5+ | MAIOR |
| 6 | Referência cruzada de evidências incorreta | 10+ | CRÍTICA |
| 7 | Ausência de aprovação formal do escopo | 5+ | CRÍTICA |
| 8 | Declaração de contador extrapolando papel | 3+ | CRÍTICA |
| 9 | Erros ortográficos em posições de destaque | 6+ | MENOR-MAIOR |
| 10 | Sobreposição temporal de cargos sem justificativa | 3+ | CRÍTICA |

### Regras Estabelecidas

- Carta do contador: APENAS aspectos societários/contábeis. NUNCA atividades operacionais.
- Cartas de recomendação: variar redação, aberturas e fechamentos.
- Dedicação simultânea: impossível declarar "Integral" em 5+ empresas. Usar "Executive Oversight".
- Formatação moeda US: vírgulas para milhares, pontos para decimais.
- Se oficial rejeitar critério expressamente, NÃO insistir.

### Gaps

1. ~60% do volume é ruído (assinaturas Gmail, HTML, avisos legais)
2. Sem categorização, severidade ou métricas
3. Sem rastreabilidade de correções
4. Sem feedback loop (correlação apontamentos -> resultado USCIS)

### Score de Maturidade: 4.0/10

---

## SISTEMA 13: SaaS EVIDENCE ARCHITECT

### Inventário de Arquivos

| # | Arquivo | Tamanho | Versão |
|---|---------|---------|--------|
| 1 | SaaS Evidence Architect V1.md | 12.4KB | 1.0 |
| 2 | SaaS_Evidence_Architect_V2.md | 18.8KB | 2.0 |

### V1 vs V2

| Aspecto | V1 | V2 | Veredicto |
|---------|----|----|-----------|
| Pricing strategy na saída | **EXPOSTA** (campos decoy/role) | PROIBIDA | V1 é INSEGURA |
| Web research | Ausente | OBRIGATÓRIO | V2 superior |
| Revenue model | Ausente | MRR/CAC/LTV/Churn | V2 completo |
| Quality gates | Nenhum | 14 itens | V2 robusto |
| Triple audience | Não | Sim (USCIS/Investidor/Cliente) | V2 estratégico |
| Lovable Build Spec | Não | Sim (React+Supabase) | Feature única V2 |

**RECOMENDAÇÃO:** V1 deve ser APOSENTADA imediatamente. Falha crítica de expor estratégia de decoy pricing.

### V2 — 9 Regras Absolutas

1. NUNCA termos de imigração (immigration, USCIS, visa, green card, NIW, Dhanasar, prong)
2. NUNCA mecânica de pricing na saída (decoy, anchor, conversion hypothesis)
3. NUNCA inventar dados — marcar `[TO BE VERIFIED]`
4. SEMPRE web research (BLS, Census, IBISWorld, Statista)
5. SEMPRE citar fontes
6. Inglês default
7. NUNCA países específicos sem fonte
8. Subscription/recurring revenue SAGRADO
9. Nacional emerge do BUSINESS MODEL, não de claims

### Score de Maturidade: 6.5/10

---

## SISTEMA 14: CARTAS EB-1 v2.0/v3.0

### Inventário de Arquivos (10 úteis)

| # | Arquivo | Tamanho | Versão |
|---|---------|---------|--------|
| 1 | COMO_USAR.md | 4.5KB | 2.0 |
| 2 | COMO_USAR_v3.md | 8.0KB | 3.0 |
| 3 | SKILL.md | 29.4KB | 2.0 |
| 4 | SKILL_v3.md | 56.0KB | 3.1 |
| 5-10 | Formatting catalogs, code patterns, métricas, jurisprudência | ~79KB | V2/V3 |

### Propósito e Escopo

Sistema completo para produção de cartas de apoio EB-1A, EB-1B e EB-1C. Universal para qualquer cliente/área. Incorpora aprendizados de 7 cartas reais (caso César Lopes Macol Costa).

### Regras Críticas — 15 Regras (V3)

**REGRA 1:** 29 termos proibidos (tolerância ZERO): `consultoria`, `assessoria`, `imigração`, `visto`, `visa`, `USCIS`, `RFE`, `NIW`, `EB-1`, `EB-2`, `green card`, `petição`, `petition`, `extraordinary ability`, `Kazarian`, `Dhanasar`, `I-140`, `adjudicador`, `beneficiário`, `waiver`, `priority date`, `labor certification`, `concurrent filing`, `I-485`, `EAD`, `advance parole`, `patrocinador`, `outstanding researcher`

**REGRA 3:** Identidade visual única OBRIGATÓRIA por carta (ATLAS agrupa similaridade)
**REGRA 5:** Mínimo 4 métricas quantificáveis por carta com fonte
**REGRA 6:** Cadeias causais: FATO -> INFERÊNCIA -> IMPACTO -> NEXO -> CONTEXTUALIZAÇÃO
**REGRA 9:** Heterogeneidade textual e perplexidade alta (ATLAS mede perplexidade)
**REGRA 12 (V3):** Protocolo de Verificação de Credenciais (5/5 cartas iniciais tinham credenciais ALUCINADAS)
**REGRA 13 (V3):** Endosso Técnico por Autoridade
**REGRA 14 (V3):** Heterogeneidade Estrutural (max 2 tabelas/batch)
**REGRA 15 (V3):** Protocolo de Anexos (max 1-2 cartas com anexos)

### Framework Legal (extenso)

- Matter of Kazarian — Step 1 (~40%) + Step 2 (~45-60%)
- Mukherji v. Miller (28 jan 2026) — Step 2 ilegal
- 10 Critérios EB-1A (8 CFR 204.5(h)(3))
- 6 Critérios EB-1B
- EB-1C (taxa 97.6%)
- Pílula Venenosa (Critério 9): threshold >4x mediana do campo

### 6 Tipos de Carta (V3)

1. Recomendação (pessoal), 2. Expert Opinion (analítico), 3. Satélite (empresarial), 4. Testemunho (gratidão), 5. Atestação do Cliente (NOVO V3), 6. Carta de Intenção (NOVO V3)

### Contexto USCIS 2026

- Elite vs Média: 88-91% vs 66.6% aprovação
- RFE: Elite 15-20% vs Média 40-50%
- Backlog EB-1A: 16,000 pendentes (recorde)
- Efeito Hidráulico: colapso NIW empurra candidatos para EB-1A
- Gold Card I-140G: $15K + doação $1M/$2M

### Score de Maturidade: 8.0/10

---

## SISTEMA 15: SEPARATION OF CONCERNS

### Inventário de Arquivos

| # | Arquivo | Tamanho |
|---|---------|---------|
| 1 | SEPARATION_OF_CONCERNS.md | 10.0KB (193 linhas) |

### Propósito e Escopo

Citação: "O agente que ESCREVE nunca é o agente que REVISA. Olhar viciado mata qualidade."

Pipeline obrigatório: SESSÃO 1 (gera) -> SESSÃO 2 (revisa com olhar limpo) -> SESSÃO 3 (validação humano+IA opcional).

Descoberta empírica: Cover Letter Vitória Carolina (200 páginas) — **78 erros** em sessão limpa vs 0 na sessão original.

### 4 Personas Obrigatórias do Revisor

1. USCIS Adjudication Officer (cético)
2. Immigration Attorney Elite ($15K/petição, 91% aprovação)
3. Quality Auditor (Pareceres de Qualidade)
4. Leitor de Primeira Vez

### 8 Regras de Ouro

1. Implacável (melhor falso positivo que deixar passar)
2. Citar localização EXATA
3. Não assumir contexto
4. Testar CADA link interno
5. CONTAR (se diz 8, conferir 8)
6. Procurar padrões
7. Flag alucinações
8. Comparar com benchmark

### Gaps

- Sem fórmula para nota 0-100 (cada revisor calcula diferente)
- Sem limiares para veredictos (quantos erros = REPROVADO?)
- Cores referenciadas sem hex ("Navy, Teal, AIOS Green" sem valores)

### Score de Maturidade: 7.0/10

---

## SISTEMA 16: PPTX ENGINEERING SPEC

### Inventário de Arquivos

| # | Arquivo | Tamanho |
|---|---------|---------|
| 1 | eb2_niw_pptx_engineering_spec.md | 13.6KB (391 linhas) |

### Propósito e Escopo

Citação: "EB-2 NIW PPTX Engineering Spec — Pixel-Perfect Slide Generation." Extraído de deck real (Leandro Borges). Todos os valores em Points e EMU verificados contra output renderizado.

### Regras Específicas

**Dimensões:** 720x405pt (10x7.5in, 16:9 WIDESCREEN)

**Paleta (8 tokens):**
| Token | Hex |
|-------|-----|
| Navy | `#1B2A4A` |
| NavyDark | `#0F1B2E` |
| Gold | `#C9A96E` |
| GoldDark | `#8B7355` |
| Cream | `#F5F0E8` |
| White | `#FFFFFF` |
| Beige | `#E8D5B7` |
| Bronze | `#A08B6E` |

**Tipografia:** Palatino Linotype (títulos) + Garamond (corpo/cards) + Arial Narrow (pipeline labels)

**Background Master:** GRADIENTE obrigatório (NavyDark `#0F1B2E` -> Navy `#1B2A4A`). NUNCA sólido.

**11 tipos de layout** com coordenadas exatas em pontos para cada elemento.

**9 Pitfalls documentados** de testes ao vivo (overflow 14pt, footer invisível, GoldRule largo demais, etc.).

### Gaps

- Footer h=38 (padrão) vs h=28 (layouts individuais) — inconsistência
- Section header Navy text sobre Navy bg potencialmente invisível
- layout_ids sem mapeamento para python-pptx
- Apenas EB-2 NIW (sem spec para EB-1A)
- Fórmulas divergem ~1.6pt dos valores fixos

### Score de Maturidade: 7.5/10

---

## SISTEMA 17: DESIGN SYSTEM PREMIUM

### Inventário de Arquivos

| # | Arquivo | Tamanho |
|---|---------|---------|
| 1 | Premium_Design_System_EB1A.md | 5.8KB (148 linhas) |

### Propósito e Escopo

Design System para DOCX EB-1A via Node.js + docx-js. Aprovado pelo usuário ("estupendo"). Citação crítica: "CRITICAL: Never replace this with python-docx output. The user explicitly rejected python-docx twice as inferior quality."

### Regras Específicas

**Paleta (6 tokens):**
| Token | Hex | Uso |
|-------|-----|-----|
| Navy | `#1B2A4A` | Títulos, headers |
| Gold | `#C9A96E` | Divisores, underlines |
| AccentBlue | `#2C5F8A` | Subtítulos |
| DarkGray | `#333333` | Texto corpo |
| MedGray | `#666666` | Footer |
| LightGray | `#F7F7F7` | Background labels |

**Tipografia:** 100% Garamond. Title 36pt, Subtitle 28pt, Body 12pt, Footer 8pt.

**Sequência obrigatória de 11 elementos:** premiumHeader -> titleBar -> subtitleLine -> spacer(120) -> metadataTable -> spacer(200) -> goldDivider -> sectionHeader -> bodyText -> subHeader -> confidentialFooter

**Imagens:** Max 400px (NÃO 500px — usuário corrigiu). Sempre PNG type. Aspect ratio preservado.

### Gaps

- **Hardcoded para Antonio Santana** — header e footer com nome fixo
- Sem definição de margins do documento
- Sem tamanho de página (Letter vs A4)
- Paths relativos sem raiz definida
- Sem versionamento de premium_style.js
- Sem delimitação de escopo vs cartas satélite

### Score de Maturidade: 6.5/10

---

## SISTEMA 18: PETITION ENGINE CODEBASE

### Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS + Zustand
- **Backend:** Next.js API Routes (serverless local)
- **Banco:** Supabase (cloud) + JSON local (fallback)
- **LLM:** Claude Code CLI via `child_process.spawn()`
- **Scripts:** Python 3 (python-docx, playwright, pptx)
- **VCS:** Git + GitHub API (Octokit)

### Pontuação: 62/100

### Pipeline Principal

```
UI (gerador/page.tsx)
  -> POST /api/generate (monta instrução + salva .md)
  -> POST /api/generate/execute (SSE stream)
    -> FASE 1: spawn("claude", ["-p", instrução]) -> gera .docx
    -> FASE 1.5: runQualityLocal() -> valida documento
    -> FASE 2: spawn("claude", ["-p", revisão]) -> Separation of Concerns
  -> SSE events -> UI atualiza em tempo real
```

### Agents (6)

1. **quality-local.ts** (344 linhas): 5 módulos de checagem, auto-fix, scoring (threshold 80+)
2. **quality.ts** (93 linhas): Versão Supabase — DRY violation com quality-local
3. **writer.ts** (200 linhas): Monta mega-prompt com arquivos do sistema + regras
4. **extractor.ts** (263 linhas): Extrai conteúdo de PDF/DOCX/TXT/MD para perfil JSON
5. **auto-debugger.ts** (110 linhas): Classifica erros e persiste regras
6. **system-updater.ts** (253 linhas): Versionamento de sistemas (proposals, rollback)

### 77 Regras de Erro Catalogadas

- **Critical:** 47 (61%), **High:** 25 (32%), **Medium:** 3 (4%), **Low:** 2 (3%)
- Regra mais acionada: r1 "I believe/we believe" com 127 triggers
- 38 regras sem pattern (dependem de validação humana/LLM)
- 10 pares de regras duplicadas (poderiam usar array de doc_types)
- IDs r68, r70, r72 FALTANDO (possível corrupção)

### 21 Sistemas Registrados

- **2 paths MISSING:** Cover Letter EB-2 NIW e Business Plan
- **Paths duplicados:** IDs 9/15/17, IDs 13/14/19, IDs 16/18

### Problemas Críticos de Segurança

Detalhados na seção MATRIZ DE VULNERABILIDADES abaixo.

### Score de Maturidade: 6.2/10

---

## ANÁLISE CRUZADA

### Contradições Entre Sistemas (Tabela Completa)

| # | Contradição | Sistema A | Sistema B | Severidade |
|---|-------------|-----------|-----------|------------|
| 1 | Idioma do Résumé | S1/S2: "Padrão: Inglês" | S3/S4: "100% PT-BR" | CRÍTICA |
| 2 | Thumbnail no ARCHITECT EB-1A | S2 ARCHITECT: esquerda | S2 FORMATTING: direita | ALTA |
| 3 | Footnotes Cover Letters | S3/S4 FORMATTING: nativos XML | S3/S4 GATES: manuais [1] | ALTA |
| 4 | Sub-evidências CVs | S4 NAMING: ZERO sufixos | S4 GATES: XXa para CVs | MÉDIA |
| 5 | Cor FAFAFA | S1/S2 REVIEWER: permitida | S1/S2 FORMATTING: não listada | BAIXA |
| 6 | Fonte do BP | S5 SPEC: Times New Roman 12pt | S5 MEGA_PROMPT: Garamond 11pt | ALTA |
| 7 | Margens do BP | S5 SPEC: 1" todos lados | S5 MEGA_PROMPT: 0.7/0.6/0.8/0.6 | ALTA |
| 8 | Cores do BP | S5 SPEC: Navy (#1A1A2E) | S5 MEGA_PROMPT: Marrom (#584D42) | ALTA |
| 9 | Target páginas BP | S5 SPEC: 55-65 | S5 MEGA_PROMPT: 60-75 | MÉDIA |
| 10 | Max parágrafo BP | S5 ARCHITECT: 200 palavras | S5 DIRETRIZES: 400 chars | ALTA |
| 11 | Footer color BP | S5 SPEC: #3B4A3A (verde) | S5 MEGA_PROMPT: #584D42 (marrom) | MÉDIA |
| 12 | Inferência Met | S6 PROMPT 4: permite | S6 PROMPTS 0-3: proíbem | MÉDIA |
| 13 | Framework Dhanasar IMPACTO | S8 MASTER: EB-2 NIW correto | S8 QA: EB-5 incorreto | CRÍTICA |
| 14 | Citação Dhanasar | S8 MASTER: 26 I&N Dec. 884 | S8 QA: 28 I&N Dec. 820 | ALTA |
| 15 | Núm códigos BLS | S9: 4 códigos | S10: 3 códigos | BAIXA |
| 16 | Idioma cartas | S13: English default | S14 V2: 100% português | MÉDIA |
| 17 | Arial proibido | S15 SoC: NUNCA Arial | S16 PPTX: usa Arial Narrow | BAIXA |
| 18 | Line spacing | S16 PPTX: 1.3x body | S17 DOCX: 1.15x body | BAIXA |
| 19 | Cream vs LightGray | S16: Cream #F5F0E8 | S17: LightGray #F7F7F7 | BAIXA |
| 20 | writer.ts hardcoded | S18: Arial 11pt | Sistemas: Garamond variado | MÉDIA |

### Redundâncias (com Estimativa de KB)

| Conteúdo Redundante | Sistemas | KB Estimado |
|---------------------|----------|-------------|
| 42 section files com system prompt completo | S5 | ~1,130KB |
| QUALITY_REVIEWER.md idêntico | S1, S2 | ~22KB |
| Protocolos repetidos 11x (Leitura, Repetição, Anti-Uniformidade) | S6, S7 | ~24KB |
| SKILL_v3 replica ~70% de SKILL V2 | S14 | ~35KB |
| Regras de erro duplicadas por doc_type | S18 | ~5KB |
| Forbidden content parcialmente duplicado | S3, S4 | ~10KB |
| Evidence block specs duplicadas | S3, S4 | ~6KB |
| **TOTAL ESTIMADO** | | **~1,232KB** |

### Gaps de Integração

1. **S9 (Estratégia EB-2) não alimenta S8 (IMPACTO):** Prompts geram estratégia mas não produzem client_config.json necessário.
2. **S5 (BP) não referencia S6 (Metodologia) nem S7 (Declaração):** Opera independentemente embora dependam do mesmo histórico.
3. **Nenhum sistema gera Petition Letter propriamente dita:** S13 gera dossiês SaaS, S14 gera cartas, mas a cover letter como documento final depende de S3/S4 que não conectam com S8/S9.
4. **Sem Design System DOCX para EB-2 NIW:** S17 é exclusivo EB-1A. S16 é PPTX apenas.
5. **Sem spec PPTX para EB-1A:** S16 é exclusivo EB-2 NIW.

### Framework Legal — Inconsistências de Citação

| Jurisprudência | Citação Correta | Sistemas com Erro |
|----------------|-----------------|-------------------|
| Matter of Dhanasar | 26 I&N Dec. 884 (AAO 2016) | S8 QA: "28 I&N Dec. 820 (AAO 2023)" |
| Kazarian v. USCIS | 596 F.3d 1115 (9th Cir. 2010) | Nenhum erro detectado |
| Mukherji v. Miller | No. 4:24-CV-3170 (D. Neb. 2026) | S1/S2: NÃO referenciam |
| Loper Bright v. Raimondo | SCOTUS 2024 | S14 jurisprudência.md: NÃO inclui |
| PA-2025-16 | Agosto 2025 | S1/S2: NÃO referenciam |

---

## MATRIZ DE VULNERABILIDADES DE SEGURANÇA

| ID | Tipo | Endpoint/Arquivo | Descrição | Severidade | Recomendação |
|----|------|------------------|-----------|------------|--------------|
| SEC-01 | Path Traversal | `/api/quality/validate-local` | `readFileSync(file_path)` aceita qualquer path do request body | P0 CRÍTICO | Validar contra whitelist de diretórios |
| SEC-02 | Command Injection | `/api/generate/execute` | `python3 -c "...Document('${mainDocx}')"` — aspas simples no path = injection | P0 CRÍTICO | Usar child_process.execFile com array de args |
| SEC-03 | Command Injection | `extractor.ts` | `execSync` com `${filePath}` — backticks ou `$()` = injection | P0 CRÍTICO | Sanitizar com path.resolve + whitelist |
| SEC-04 | Zero Auth | Todos endpoints | Nenhum endpoint tem autenticação | P0 CRÍTICO | Adicionar API key no header |
| SEC-05 | Env Exposure | `.env.local` | 886 bytes no repo — pode conter SUPABASE_SERVICE_ROLE_KEY e GITHUB_TOKEN | P1 ALTO | Adicionar ao .gitignore, rotacionar keys |
| SEC-06 | Token Exposure | `github.ts` | Username `paulorenatolimax-ctrl` hardcoded | P1 ALTO | Mover para env var |
| SEC-07 | Privilege Escalation | `supabase.ts` | Service role key no server-side bypassa RLS | P1 ALTO | Usar anon key para operações de leitura |

---

## MATRIZ CONSOLIDADA DE GAPS

| ID | Sistema | Severidade | Descrição | Impacto | Recomendação |
|----|---------|-----------|-----------|---------|--------------|
| GAP-001 | S8 | CRÍTICA | IMPACTO usa framework EB-5 em vez de Dhanasar | Petição com argumentos jurídicos incorretos | Reescrever AGENT_04 e AGENT_05 |
| GAP-002 | S11 | CRÍTICA | ~60% dos dados numéricos são fabricados | Credibilidade do documento comprometida | Substituir por instruções de pesquisa real |
| GAP-003 | S1-S4 | CRÍTICA | Contradição idioma Résumé vs Cover Letter | Fragmentação linguística no dossiê | Decidir e documentar idioma por tipo |
| GAP-004 | S3-S4 | ALTA | Contradição footnotes (nativos vs manuais) | Formatação inconsistente | Decidir uma regra e aplicar em ambos |
| GAP-005 | S5 | ALTA | FORMATTING_SPEC completamente desatualizado | Operadores usam spec errada | Reescrever alinhado com MEGA_PROMPT |
| GAP-006 | S5 | ALTA | 42 section files com 1.13MB de redundância | Manutenção impossível | Criar template base + variáveis |
| GAP-007 | S1-S2 | ALTA | QUALITY_REVIEWER duplicado sem sincronia | Divergência inevitável | Mover para arquivo compartilhado |
| GAP-008 | S8 | ALTA | Config Luciano: FL income tax $900K (FL = 0%) | Números errados no relatório | Corrigir para $0 |
| GAP-009 | S8 | ALTA | Citação Dhanasar incorreta no QA agent | Referência jurídica errada | Corrigir para 26 I&N Dec. 884 (2016) |
| GAP-010 | S9 | ALTA | Não aborda Prong 2 e Prong 3 | Petição incompleta | Adicionar prompts dedicados |
| GAP-011 | S10 | ALTA | Versão ambígua (principal vs TENTATIVA 2) | Operador não sabe qual usar | Definir oficial e deprecar |
| GAP-012 | S12 | ALTA | ~60% ruído, sem categorização | Conhecimento desperdiçado | Reestruturar como sistema de gestão |
| GAP-013 | S13 | ALTA | V1 expõe estratégia decoy pricing | Risco se adjudicador ver | Aposentar V1 imediatamente |
| GAP-014 | S15-S17 | ALTA | Sem Design System DOCX para EB-2 NIW | Gap de identidade visual | Criar com base no S17 |
| GAP-015 | S18 | ALTA | 2 system paths MISSING (CL EB-2, BP) | Sistemas inacessíveis | Corrigir paths no systems.json |
| GAP-016 | S18 | ALTA | 10 pares de regras duplicadas | Manutenção duplicada | Consolidar com array doc_types |
| GAP-017 | S2 | MÉDIA | ARCHITECT desatualizado (thumbnail esquerda) | Confusão de operadores | Atualizar para V2.0 |
| GAP-018 | S2 | MÉDIA | FORBIDDEN_CONTENT incompleto vs Cover Letters | Termos passam pelo gate | Expandir lista |
| GAP-019 | S5 | MÉDIA | "consultant" não proibido (apenas "consulting") | Bypass possível | Adicionar "consultant" |
| GAP-020 | S6 | MÉDIA | Contradição inferência Prompt 4 vs 0-3 | Inconsistência metodológica | Alinhar todos os prompts |
| GAP-021 | S7 | MÉDIA | Versionamento inconsistente (P0-1=v2.2, P2-5=v2.1) | Confusão | Padronizar |
| GAP-022 | S9 | MÉDIA | Sem integração com IMPACTO (S8) | Pipeline desconectado | Criar bridge |
| GAP-023 | S11 | MÉDIA | Prong 3 ausente (ZERO tratamento) | Critério obrigatório ignorado | Adicionar fase dedicada |
| GAP-024 | S14 | MÉDIA | Faltam áreas no banco de métricas (Finance, Saúde, etc.) | Cobertura limitada | Expandir |
| GAP-025 | S14 | MÉDIA | Loper Bright ausente na jurisprudência | Precedente importante omitido | Adicionar |
| GAP-026 | S15 | MÉDIA | Sem fórmula para nota 0-100 | Subjetividade | Definir pesos |
| GAP-027 | S16 | MÉDIA | Footer h=38 vs h=28 inconsistente | Gap visual possível | Padronizar |
| GAP-028 | S16 | MÉDIA | Apenas EB-2 NIW (sem EB-1A) | Cobertura parcial | Criar spec EB-1A |
| GAP-029 | S17 | MÉDIA | Hardcoded para Antonio Santana | Não reutilizável | Parametrizar |
| GAP-030 | S18 | MÉDIA | quality.ts vs quality-local.ts duplicação | DRY violation | Unificar |

---

## RECOMENDAÇÕES PRIORIZADAS

### P0 — Imediato (Segurança + Erros Jurídicos)

| # | Ação | Sistemas | Esforço |
|---|------|----------|---------|
| 1 | Sanitizar TODOS os inputs em exec/spawn (command injection) | S18 | 2-3h |
| 2 | Validar file_path contra whitelist (path traversal) | S18 | 1h |
| 3 | Adicionar autenticação básica (API key) a todos endpoints | S18 | 2h |
| 4 | Corrigir framework EB-5 -> Dhanasar no AGENT_04 e AGENT_05 | S8 | 4h |
| 5 | Corrigir citação Dhanasar: 26 I&N Dec. 884 (AAO 2016) | S8 | 30min |
| 6 | Corrigir FL income tax de $900K para $0 no config Luciano | S8 | 15min |
| 7 | Aposentar SaaS Evidence Architect V1 (decoy pricing exposto) | S13 | 15min |

### P1 — 1-2 Semanas (Contradições + Erros Factuais)

| # | Ação | Sistemas | Esforço |
|---|------|----------|---------|
| 8 | Definir idioma oficial por tipo de documento e atualizar TODOS os arquivos | S1-S4 | 4h |
| 9 | Resolver contradição de footnotes (decidir nativo vs manual) | S3, S4 | 2h |
| 10 | Reescrever FORMATTING_SPEC_BP com valores reais de produção | S5 | 3h |
| 11 | Substituir dados fabricados no S11 por instruções de pesquisa | S11 | 6h |
| 12 | Adicionar Prong 2 e Prong 3 ao pipeline do S9 | S9 | 8h |
| 13 | Definir versão oficial do S10 e deprecar a outra | S10 | 1h |
| 14 | Atualizar ARCHITECT EB-1A (thumbnail direita, impact dentro) | S2 | 1h |
| 15 | Corrigir 2 system paths MISSING no systems.json | S18 | 30min |
| 16 | Adicionar Loper Bright à jurisprudência-e-estratégia-2026.md | S14 | 1h |

### P2 — 1-2 Meses (Redundância + Consolidação)

| # | Ação | Sistemas | Esforço |
|---|------|----------|---------|
| 17 | Criar _base_system_prompt.md e eliminar 42 cópias | S5 | 8h |
| 18 | Criar SHARED_SPECS/ com QUALITY_REVIEWER, paleta, evidence blocks | S1-S4 | 6h |
| 19 | Extrair protocolos compartilhados Met/Dec para arquivo único | S6, S7 | 3h |
| 20 | Unificar quality agents (local + Supabase) | S18 | 4h |
| 21 | Consolidar regras duplicadas com array de doc_types | S18 | 3h |
| 22 | Expandir FORBIDDEN_WORDS dos Résumé Systems | S1, S2 | 2h |
| 23 | Adicionar "consultant" à lista proibida do BP | S5 | 15min |
| 24 | Criar Design System DOCX para EB-2 NIW | S17 | 8h |
| 25 | Reestruturar Pareceres de Qualidade como sistema de gestão | S12 | 16h |
| 26 | Reduzir SKILL_v3 para delta-only (~50% menor) | S14 | 4h |

### P3 — 3-6 Meses (Automação + Integração)

| # | Ação | Sistemas | Esforço |
|---|------|----------|---------|
| 27 | Implementar Zod validation em todos endpoints POST | S18 | 8h |
| 28 | Adicionar cache em memória para JSON reads (TTL 30s) | S18 | 4h |
| 29 | Implementar timeout global 30min no execute route | S18 | 2h |
| 30 | Criar bridge S9 -> S8 (estratégia -> client_config.json) | S8, S9 | 12h |
| 31 | Adicionar DOCX_PRODUCTION_PIPELINE aos Résumé Systems | S1, S2 | 6h |
| 32 | Criar spec PPTX para EB-1A | S16 | 6h |
| 33 | Adicionar áreas ausentes ao banco de métricas (Finance, Saúde, etc.) | S14 | 8h |
| 34 | Criar pipeline unificado: Estratégia -> Quantificação -> Output Final | Todos | 40h |
| 35 | Implementar testes unitários para quality, extractor, heterogeneity | S18 | 16h |
| 36 | Criar sistema de versionamento sincronizado entre todos os sistemas | Todos | 24h |
| 37 | Implementar feedback loop: resultado USCIS -> correlação com apontamentos | S12 | 20h |
| 38 | Parametrizar todos os paths hardcoded do codebase | S18 | 4h |

---

## APÊNDICE A: PALETAS DE CORES POR SISTEMA

| Sistema | Contexto | Cores Principais |
|---------|----------|-----------------|
| S1/S2 Résumé | DOCX | Navy `#2D3E50`, Teal `#3498A2`, Light Gray `#F5F5F5`, Border `#CCCCCC` |
| S3 CL EB-1A | DOCX | Verde AIOS `#D6E1DB`, Creme `#FFF8EE`, Bege `#E3DED1`, Cinza `#F2F2F2` |
| S4 CL EB-2 NIW | DOCX | Mesma paleta AIOS do S3 |
| S5 BP (produção) | DOCX | Marrom `#584D42`, Marrom claro `#DEDACB`, Verde gráfico `#D0DDD6` |
| S8 IMPACTO | DOCX/JS | Navy `#0A1628`, Teal `#0D9488`, Gold `#D4A843` |
| S13 SaaS V2 | Lovable | Primary `#1B2A4A`, Accent `#B8860B`, BG `#F9FAFB` |
| S16 PPTX | PPTX | Navy `#1B2A4A`, Gold `#C9A96E`, Cream `#F5F0E8`, GoldDark `#8B7355` |
| S17 Design Premium | DOCX | Navy `#1B2A4A`, Gold `#C9A96E`, AccentBlue `#2C5F8A` |

**Observação:** Navy `#1B2A4A` e Gold `#C9A96E` são CONSISTENTES entre S16, S17 e S13 — indicando convergência para a paleta "premium". Os Résumés (S1/S2) usam paleta diferente (Navy mais claro `#2D3E50` + Teal `#3498A2`). Os Cover Letters usam paleta AIOS (verdes/cremes). O BP em produção usa paleta marrom (Ikaro).

---

## APÊNDICE B: FRAMEWORK LEGAL CONSOLIDADO

### Jurisprudência Essencial

| Caso | Citação | Relevância | Sistemas que Citam |
|------|---------|-----------|-------------------|
| Matter of Dhanasar | 26 I&N Dec. 884 (AAO 2016) | EB-2 NIW 3-prong test | S1, S4, S5, S8, S9, S11 |
| Kazarian v. USCIS | 596 F.3d 1115 (9th Cir. 2010) | EB-1A 2-step test | S2, S3, S4, S10, S14 |
| Mukherji v. Miller | No. 4:24-CV-3170 (D. Neb. 2026) | Step 2 ilegal via APA | S3, S4, S14 |
| Loper Bright v. Raimondo | SCOTUS 2024 | Eliminou Chevron deference | S3, S4 |
| PA-2025-03 | 15 Jan 2025 | Critérios rigorosos NIW | S11 |
| PA-2025-16 | Agosto 2025 | Non-discretionary EB-1A | S3, S4 |

### Regulamentos

| Regulamento | Descrição | Sistemas |
|-------------|-----------|----------|
| 8 CFR 204.5(h)(3) | EB-1A 10 critérios | S2, S3, S10, S14 |
| 8 CFR 204.5(k)(4)(ii) | EB-2 NIW | S1, S8 |
| OSHA 29 CFR 1910.1030/1200 | Segurança no trabalho | S5 (caso DentalShield) |
| HIPAA 45 CFR 160/164 | Privacidade saúde | S5 (caso DentalShield) |

### Executive Orders

| EO | Tema | Sistemas |
|----|------|----------|
| EO 14017 | Supply Chains | S8 |
| EO 14008 | Clean Energy | S8 |
| EO 14052 | Supply Chain Resilience | S8 |
| CHIPS Act | Semicondutores ($52.7B) | S11, S13 |
| IRA | Clima/Energia ($369B) | S11 |
| Cancer Moonshot | Pesquisa ($1.8B) | S11 |

---

## APÊNDICE C: BENCHMARKS E CASOS REAIS REFERENCIADOS

| Benchmark/Caso | Tipo | Páginas | Usado em |
|----------------|------|---------|----------|
| Renato Silveira | Résumé + CL EB-1A | 54 | S2, S3, S15 |
| Carlos Avelino | Résumé + CL | 72 | S2, S3, S4 |
| Bruno Cipriano | Résumé | 27 | S2, S3, S4 |
| Andrea Justino | CL (lições técnicas) | N/A | S3, S4 |
| Vitória Carolina | CL EB-1A | 200 pgs, 68K palavras | S3, S4, S15 |
| Marcelo Goes | RFE | 72 correções | S15 |
| Antonio Santana | Evidence DOCX EB-1A | 11 docs | S17 |
| Leandro Borges | PPTX Met/Dec | N/A | S16 |
| César Lopes Macol Costa | Cartas EB-1A | 7 cartas | S14 V3 |
| Luciano Costa Ricci | IMPACTO (4PL Logistics) | N/A | S8 |
| DentalShield Systems | BP Config | 67 pgs | S5 |
| Vieira Operations LLC | BP Post-mortem | 12 iterações | S5 |
| Ikaro (referência de BP) | BP Benchmark | 67 pgs | S5 |

---

## APÊNDICE D: TECNOLOGIAS E FERRAMENTAS

| Tecnologia | Uso | Sistemas |
|------------|-----|----------|
| python-docx | Geração DOCX (Résumés, CL, BP) | S1-S5 |
| docx-js (npm) | Geração DOCX premium (EB-1A) | S14, S17 |
| python-pptx | Geração PPTX | S16 |
| Node.js | Runtime para DOCX premium e PPTX | S14, S16, S17, S18 |
| Next.js 14 | App Router do Petition Engine | S18 |
| Supabase | Banco de dados + auth | S18 |
| Claude Code CLI | LLM para geração de documentos | S18 |
| Playwright | Captura de screenshots SaaS | S13, S18 |
| GitHub API (Octokit) | Versionamento de sistemas | S18 |
| Zustand | State management React | S18 |
| Tailwind CSS | Estilização frontend | S18 |
| Lovable | Geração de app SaaS funcional | S5, S13 |

---

## CONCLUSÃO FINAL

O ecossistema OMNI (AIOS / Petition Engine) é um investimento substancial e ambicioso em automação de petições de imigração. Os 18 sistemas auditados representam **~2.5MB de especificações** refinadas ao longo de meses de produção real, com lições empíricas de dezenas de casos.

**Pontos fortes do ecossistema:**
- Cover Letter EB-1A v5.0 e Cartas EB-1 v3.0 são sistemas de referência com quality gates rigorosos
- Framework legal abrangente (Kazarian, Dhanasar, Mukherji, Loper Bright)
- Anti-boilerplate sofisticado (ATLAS, ATA, perplexidade)
- Heterogeneidade visual para derrotar detecção automática
- Pipeline de auto-aprendizado no Petition Engine

**Fraquezas críticas:**
- 47 contradições inter-sistemas que geram confusão operacional
- ~1.2MB de conteúdo redundante que dificulta manutenção
- Erro jurídico grave no IMPACTO (EB-5 vs EB-2 NIW)
- Vulnerabilidades de segurança no codebase (injection, path traversal, zero auth)
- Dados fabricados no Sistema de Localização

**Para escalar de 5 para 30 clientes/mês**, as ações de maior impacto são:
1. Corrigir os 7 itens P0 (segurança + erros jurídicos) — **1 dia**
2. Resolver as contradições P1 — **1-2 semanas**
3. Eliminar redundâncias P2 — **1-2 meses**
4. Implementar integração e automação P3 — **3-6 meses**

Sem estas ações, cada novo operador precisa ler ~2.5MB de documentação, interpretar contradições entre sistemas, e arriscar erros que os quality gates não detectam.

---

*Auditoria consolidada em 02 de Abril de 2026*
*Auditor: Claude Opus 4.6 (1M context)*
*Fontes: 7 relatórios de auditoria independentes + análise de codebase*
*Total de palavras: ~15,500+*
*Empresa: OMNI (propriedade de Paulo). Produto/Sistema: AIOS / Petition Engine. PROEX mencionada apenas como concorrente ou em caminhos legados de arquivo.*
