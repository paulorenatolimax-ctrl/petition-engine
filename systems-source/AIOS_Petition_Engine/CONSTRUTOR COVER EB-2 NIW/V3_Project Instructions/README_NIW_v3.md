# SISTEMA DE CONSTRUÇÃO DE COVER LETTER EB-2 NIW
## Índice Rápido — v3.0 (18/03/2026)
## Execução Autônoma — "Drop docs, press go, get cover letter"

---

## O QUE MUDOU (v2 → v3)

| Antes (v2) | Agora (v3) |
|---|---|
| Cores antigas (#C5E0B4, #FFF2CC) | Nova paleta PROEX (#D6E1DB, #FFF8EE) |
| Evidence block v3 (creme ambas colunas) | Evidence block v4 (thumbnail branco, metadados creme) |
| Sub-evidências XXa, XXb, XXc ativas | Sub-evidências descontinuadas (ZERO sufixos) |
| Sem Gate 7 DOCX explícito | Gate 7 assembly DOCX (wp:anchor, tblInd, keepNext, widowControl) |
| Sem pipeline DOCX documentado | DOCX_PRODUCTION_PIPELINE.md (referência obrigatória) |
| Sem validação conteúdo PDFs | EVIDENCE_CONTENT_VALIDATION.md (validação obrigatória) |
| Sem regras de proporção | Proporções obrigatórias (10-15% / 40-50% / 35-45%) |
| Idioma parcialmente supervisionado | Idioma PT-BR obrigatório (100% português brasileiro) |

---

## COMO USAR

### No Projects (Claude.ai):
1. Colar **ARCHITECT_COVER_LETTER_EB2_NIW_v3.md** como **Project Instructions**
2. Subir como Knowledge: SISTEMA v3, LICOES_TECNICAS, specs, templates, benchmarks, RAGs, novos arquivos (DOCX_PRODUCTION_PIPELINE, EVIDENCE_CONTENT_VALIDATION)
3. Subir documentos do cliente
4. Dizer: **"Faz a cover letter do [NOME]. SOC: [CÓDIGO]."**
5. Esperar. Ele entrega pronto.

### No Claude Code (terminal):
1. Copiar todos os .md para pasta do projeto do cliente (NÃO em /tmp!)
2. **ARCHITECT v3** como CLAUDE.md
3. Dizer: **"Faz a cover letter do [NOME]. SOC: [CÓDIGO]."**
4. Esperar. Ele entrega pronto.

**IMPORTANTE**: Sempre abrir Claude Code NA PASTA DO CLIENTE, nunca em /tmp:
```bash
cd "/caminho/para/pasta/do/cliente" && claude
```

---

## ARQUIVOS DO SISTEMA

### NOVOS (v3) — usar estes:
| Arquivo | O que é | Motivação |
|---------|---------|-----------|
| **SISTEMA_COVER_LETTER_EB2_NIW_v3.md** | Arquitetura completa + execução autônoma | Atualização lições EB-1A |
| **ARCHITECT_COVER_LETTER_EB2_NIW_v3.md** | Prompt principal (Project Instructions / CLAUDE.md) | Atualização com novos specs |
| **README_NIW_v3.md** | Este arquivo | Índice v3 |
| **DOCX_PRODUCTION_PIPELINE_NIW.md** | **NOVO: Pipeline DOCX** | Gate 7, wp:anchor, tblInd, keepNext, widowControl |
| **EVIDENCE_CONTENT_VALIDATION_NIW.md** | **NOVO: Validação conteúdo PDFs** | Validar antes de usar |

### DEPRECADOS (v1, v2) — NÃO usar mais:
| Arquivo | Substituído por |
|---------|----------------|
| ~~SISTEMA v1~~ | SISTEMA v3 |
| ~~ARCHITECT v1~~ | ARCHITECT v3 |
| ~~SISTEMA v2~~ | SISTEMA v3 |
| ~~ARCHITECT v2~~ | ARCHITECT v3 |
| ~~PROTOCOLO_DE_INTERACAO_NIW~~ | Absorvido pelo ARCHITECT v3 + SISTEMA v3 |
| ~~README_NIW v2~~ | README v3 |

### MANTIDOS (com atualizações):
| Arquivo | Status | O que mudou |
|---------|--------|------------|
| FORMATTING_SPEC_NIW.md | Atualizado | Cores D6E1DB/FFF8EE, evidence block v4, thumbnails |
| FORBIDDEN_CONTENT_NIW.md | Atualizado | Adicionado #C5E0B4 como proibido, idioma PT-BR obrigatório |
| LEGAL_FRAMEWORK_NIW_2026.md | Mantido | Sem alteração |
| QUALITY_GATES_NIW.md | Atualizado | Gate 7 assembly DOCX, proporções, idioma |
| EVIDENCE_NAMING_CONVENTION_NIW.md | Atualizado | Sub-evidências descontinuadas (zero sufixos) |
| TEMPLATE_ELIGIBILITY.md | Mantido | Sem alteração |
| TEMPLATE_PRONG1.md | Mantido | Sem alteração |
| TEMPLATE_PRONG2.md | Mantido | Sem alteração |
| TEMPLATE_PRONG3.md | Mantido | Sem alteração |
| RESEARCH_AGENT.md | Mantido | Sem alteração |
| QUALITY_AGENT.md | Atualizado | Novos checks (proporções, Gate 7, idioma) |
| CHECKLIST_PRE_PRODUCAO_NIW.md | Mantido | Referência (execução absorvida) |
| LICOES_TECNICAS_ANDREA.md | Mantido | Sem alteração |
| SKILL.md | Compatível | Compatível com v3 |

**TOTAL: 20 arquivos ativos** (5 novos/atualizados v3 + 13 mantidos + 2 deprecated na prática)

---

## PIPELINE v3 (AUTÔNOMO)

```
"Faz a cover letter do [NOME]. SOC: [CÓDIGO]."
│
├── FASE 0: INTAKE
│   ├── Ler specs + templates + legal + forbidden + lições técnicas
│   ├── Ler DOCX_PRODUCTION_PIPELINE + EVIDENCE_CONTENT_VALIDATION (NOVO v3)
│   ├── Ler RAGs + benchmarks
│   ├── Ler TODOS os docs do cliente
│   ├── Inventariar evidências
│   ├── Determinar: empresa planejada vs. constituída
│   └── HALT-1/2/3 se bloqueado │ senão → continua
│
├── FASE 1: PESQUISA (se web disponível)
│   ├── 15-30 buscas (CETs, EOs, BLS, CISA, Budget)
│   └── Armazenar dados → integrar no Prong 1
│
├── FASE 2: PRODUÇÃO
│   ├── Gerar .docx COMPLETO (Capa → Eligibility → P1 → P2 → P3 → Conclusion)
│   ├── Evidence cards com thumbnails v4 (coluna 0 branco, coluna 1 #FFF8EE)
│   ├── Tabelas visuais (14+ tabelas, headers #D6E1DB)
│   ├── Acentuação (word_map 200+ palavras)
│   ├── Cores novas (#D6E1DB, #FFF8EE, ZERO #C5E0B4)
│   ├── Sub-evidências: ZERO sufixos
│   └── Target: 73+ páginas
│
├── FASE 3: AUTO-AUDITORIA
│   ├── Forbidden content scan (incluindo #C5E0B4)
│   ├── Accent scan
│   ├── Color scan (zero azul, zero #C5E0B4 antigo)
│   ├── Evidence bold + shading v4
│   ├── BP cross-check
│   ├── Validação conteúdo PDFs (EVIDENCE_CONTENT_VALIDATION)
│   ├── Validação Gate 7 DOCX (wp:anchor, tblInd, keepNext, widowControl)
│   ├── Validação proporções (10-15% / 40-50% / 35-45%)
│   ├── Validação idioma PT-BR 100%
│   └── Corrigir → revalidar
│
└── FASE 4: ENTREGA
    ├── VF_COVER_LETTER_[NOME]_EB2_NIW.docx
    └── Relatório: páginas, evidências, tabelas, pendências
```

---

## CONDIÇÕES DE HALT (as ÚNICAS)

| HALT | Condição | Gravidade |
|------|----------|-----------|
| 🔴 1 | Não acessa RAGs de vacinação | Bloqueante — sem RAGs a argumentação legal fica genérica |
| 🔴 2 | Não acessa benchmarks | Bloqueante — sem referência visual a formatação desvia |
| 🔴 3 | Documento crítico faltante | Bloqueante — BP, Credential Eval, ou Cartas |

**Tudo mais**: resolve sozinho, marca [VERIFICAR] se necessário.

---

## MUDANÇAS NO DETALHE: v2 → v3

### Cores
```
v2: #C5E0B4 (Sage Green antigo)  → v3: #D6E1DB (Verde PROEX novo)
v2: #FFF2CC (Cream antigo)       → v3: #FFF8EE (Creme novo)
NOVO: #C5E0B4 é PROIBIDA em v3
```

### Evidence Block
```
v2: Fundo #FFF2CC em AMBAS colunas (thumbnail + metadados)
v3: Fundo branco (Col 0: thumbnail)
    Fundo #FFF8EE (Col 1: metadados) ← NOVO
    cantSplit = true (impede quebra) ← NOVO
```

### Sub-evidências
```
v2: Evidence 68a (CV), 68b (original PT) etc.
v3: Evidence 68 = CV + original PT integrados (ZERO sufixos)
```

### Gate 7 (NEW)
```
v3: Obrigatório verificar após assembly DOCX:
    - wp:anchor (imagens em âncora, não inline)
    - tblInd = 0 (tabelas sem recuo)
    - keepNext + widowControl (tipografia)
    - cantSplit em evidence tables (impede quebra)
```

### Proporções (NEW)
```
v3: Introduction 10-15%
    Eligibility + Prong 1: 40-50%
    Prong 2 + Prong 3: 35-45%
    REGRA: Nenhum Prong < 15% da página total
```

### Idioma (NEW)
```
v3: 100% português brasileiro obrigatório
    ZERO inglês em corpo narrativo
    Exceções: nomes de leis, casos, O*NET codes, termos técnicos
```

---

## ARQUIVOS NOVOS v3 (LEITURA OBRIGATÓRIA)

### DOCX_PRODUCTION_PIPELINE_NIW.md
- **O que**: Guia completo do pipeline DOCX
- **Quando**: Ler antes de começar, referência durante Gate 7
- **Contém**:
  - Geração de thumbnails (v4: branco + creme)
  - Inserção em tabelas 1x2
  - Conversão wp:inline → wp:anchor
  - Merge DOCX (XML manual, zero docxcompose)
  - Correção de tabelas (tblInd, tblW, jc)
  - Quebras de página (só antes de seções principais)
  - keepNext + widowControl
  - Verificação final

### EVIDENCE_CONTENT_VALIDATION_NIW.md
- **O que**: Validação do conteúdo real dos PDFs
- **Quando**: Antes de usar qualquer evidência
- **Contém**:
  - Checklist de validação conteúdo
  - Padrões regex (placeholders, erros comuns)
  - Verificação de correspondência documento-categoria
  - Testes de integridade PDF

---

## MANUTENÇÃO: ARQUIVOS ATUALIZADOS

### EVIDENCE_NAMING_CONVENTION_NIW.md
**Mudança crítica v2 → v3**: Sub-evidências descontinuadas

```
v2: Evidence 68 = Carta de Recomendação
    Evidence 68a = CV do Recomendador
    Evidence 68b = Original PT

v3: Evidence 68 = Carta de Recomendação + CV do Recomendador
    (sem sufixos, tudo integrado)
```

### FORMATTING_SPEC_NIW.md
**Atualizações v3**:
- Cores: D6E1DB para headers, FFF8EE para metadados
- Evidence block: thumbnail branco, metadados creme
- Thumbnails: lógica de página 2, paisagem vs. retrato
- Tabelas: tblInd = 0, tblW = 5000 pct
- cantSplit = true em evidence tables

### QUALITY_GATES_NIW.md
**Novas gates v3**:
- Gate 7: Assembly DOCX (wp:anchor, tblInd, keepNext, widowControl)
- Gate 7.8: Idioma português brasileiro obrigatório
- Gate 7.9: Proporções validadas

---

## FLUXO DE LEITURA OBRIGATÓRIO

**1. Antes de começar qualquer case:**
```
1. SISTEMA_COVER_LETTER_EB2_NIW_v3.md (este sistema)
2. ARCHITECT_COVER_LETTER_EB2_NIW_v3.md (identidade + execução)
3. DOCX_PRODUCTION_PIPELINE_NIW.md (pipeline NOVO v3)
4. EVIDENCE_CONTENT_VALIDATION_NIW.md (validação NOVO v3)
5. LICOES_TECNICAS_ANDREA.md (bugs + fixes)
6. FORMATTING_SPEC_NIW.md (tipografia, cores ATUALIZADAS)
7. FORBIDDEN_CONTENT_NIW.md (proibições ATUALIZADAS)
8. LEGAL_FRAMEWORK_NIW_2026.md (legal)
9. QUALITY_GATES_NIW.md (checks ATUALIZADOS)
```

**2. Durante produção:**
```
Por seção: TEMPLATE_ELIGIBILITY, TEMPLATE_PRONG1, TEMPLATE_PRONG2, TEMPLATE_PRONG3
```

**3. Benchmarks:**
```
2-3 PDFs de cover letters anteriores (nunca citar nomes)
```

---

## SUMÁRIO: TOTAL DE ARQUIVOS (v3)

| # | Tipo | Arquivos | Total |
|---|------|----------|-------|
| A | Core (v3) | ARCHITECT, SISTEMA, README v3 | 3 |
| B | Novo (v3) | DOCX_PRODUCTION_PIPELINE, EVIDENCE_CONTENT_VALIDATION | 2 |
| C | Specs | FORMATTING_SPEC, FORBIDDEN_CONTENT, LEGAL_FRAMEWORK, QUALITY_GATES, EVIDENCE_NAMING_CONVENTION | 5 |
| D | Templates | TEMPLATE_ELIGIBILITY, TEMPLATE_PRONG1, TEMPLATE_PRONG2, TEMPLATE_PRONG3 | 4 |
| E | Agentes | RESEARCH_AGENT, QUALITY_AGENT, LICOES_TECNICAS_ANDREA | 3 |
| F | Utilitários | CHECKLIST_PRE_PRODUCAO, SKILL | 2 |
| | **TOTAL** | | **20** |

---

*v3.0 — 18/03/2026 — Execução Autônoma*
*Incorpora lições EB-1A v5: paleta cores, evidence block v4, sub-evidências descontinuadas, Gate 7, proporções, idioma obrigatório*
