# SISTEMA DE CONSTRUÇÃO DE COVER LETTER EB-2 NIW
## Arquitetura Completa — v3.0 (18/03/2026)
## Escritório PROEX — Execução Autônoma
## SUBSTITUI: SISTEMA v2.0

---

## MUDANÇA FUNDAMENTAL v2 → v3

| v2.0 (02/03/2026) | v3.0 (18/03/2026) |
|---|---|
| Cores antigas (C5E0B4, FFF2CC) | Nova paleta PROEX (D6E1DB, FFF8EE) |
| Evidence block v3 (fundo creme ambas colunas) | **Evidence block v4** (thumbnail branco, metadados creme) |
| Sub-evidências XXa, XXb, XXc | **Sub-evidências descontinuadas** (zero sufixos) |
| Sem Gate 7 DOCX explícito | **Gate 7 assembly DOCX** (wp:anchor, tblInd, keepNext, widowControl) |
| Sem pipeline DOCX documentado | **DOCX_PRODUCTION_PIPELINE.md** (referência obrigatória) |
| Sem validação conteúdo PDFs | **EVIDENCE_CONTENT_VALIDATION.md** (validação obrigatória) |
| Sem regras de proporção | **Proporções obrigatórias** (10-15% / 40-50% / 35-45%) |
| Idioma parcialmente supervisionado | **Idioma PT-BR obrigatório** (zero inglês corpo narrativo) |

**PRINCÍPIO MANTIDO**: A cover letter é o ÚLTIMO documento do caso. Quando chega aqui, TUDO já existe na pasta. Não faz sentido interagir. É ler, processar, gerar.

---

## 1. MODELO DE EXECUÇÃO AUTÔNOMA

### Trigger
```
Paulo coloca todos os documentos na pasta e diz:
"Faz a cover letter do [NOME]. SOC: [CÓDIGO]."
```

### O que acontece (sem interação):
```
FASE 0: INTAKE (5-10 min)
├── Ler TODOS os .md do sistema (specs, templates, legal, forbidden, pipeline, validation)
├── Ler TODOS os documentos do cliente na pasta
├── Ler benchmarks (PDFs de cover letters anteriores)
├── Ler RAGs de vacinação EB-2 NIW
├── Inventariar evidências → numerar → mapear a seções
├── Determinar: empresa PLANEJADA ou CONSTITUÍDA?
├── Determinar: via elegibilidade (Advanced Degree ou Exceptional Ability)
└── Se TUDO disponível → CONTINUA AUTOMATICAMENTE

FASE 1: PESQUISA (se web search disponível)
├── 15-30 web searches para Prong 1
├── CETs, EOs, BLS, O*NET, CISA, Budget, DCI
├── Montar Research Dossier interno (não entrega a Paulo)
└── CONTINUA AUTOMATICAMENTE

FASE 2: PRODUÇÃO DO .DOCX (30-60 min)
├── Gerar documento COMPLETO de uma vez:
│   0. Capa (carta) + Índice Evidências
│   1. Synopsis
│   2. ELIGIBILITY
│   3. PRONG 1 (A + B + C)
│   4. PRONG 2 (A + B)
│   5. PRONG 3 (A + B)
│   6. Conclusion + Summary Table
│   7. Sources Cited
├── Aplicar TODAS as formatações (Garamond, cores D6E1DB/FFF8EE, thumbnails v4, etc.)
├── Validar conteúdo PDFs (EVIDENCE_CONTENT_VALIDATION)
├── Rodar validação interna (forbidden content, evidence bold, cores)
└── CONTINUA AUTOMATICAMENTE

FASE 3: AUTO-AUDITORIA
├── Rodar os 25+ checks do Quality Agent internamente
├── Validar proporções (10-15% / 40-50% / 35-45%)
├── Validar Gate 7 DOCX (wp:anchor, tblInd, keepNext, widowControl)
├── Corrigir TUDO que encontrar
├── Revalidar
└── ENTREGA

FASE 4: ENTREGA
├── .docx final na pasta de output
├── Relatório resumido: "Cover letter gerada. [N] páginas, [N] evidências, [N] tabelas."
├── Se houve [VERIFICAR]: listar pendências
└── FIM
```

### 3 CONDIÇÕES DE HALT (as ÚNICAS razões para parar e perguntar)

| HALT | Condição | Mensagem |
|------|----------|----------|
| 🔴 HALT-1 | Não tem acesso aos RAGs/Knowledge | "Não consigo acessar os RAGs de vacinação EB-2 NIW. Preciso de: [lista]. Suba no Knowledge ou aponte o caminho." |
| 🔴 HALT-2 | Não tem acesso aos benchmarks | "Não encontrei nenhum benchmark de cover letter anterior. Preciso de pelo menos 1 PDF de referência visual para calibrar formatação." |
| 🔴 HALT-3 | Documento crítico faltante | "Não encontrei [Business Plan / Credential Evaluation / Cartas de Recomendação]. Sem isso, não consigo gerar [seção específica]. O que está disponível?" |

**REGRA**: Se não é HALT-1, HALT-2 ou HALT-3 → NÃO PARA. Resolve sozinho.

### O que NÃO é motivo para parar:
- Dúvida sobre uma data → marcar [VERIFICAR] e continuar
- Não sabe se empresa é constituída → verificar se há Articles of Org na pasta. Se não há → é planejada.
- Não encontrou um dado do BP → reler o BP. Se realmente não está → [VERIFICAR]
- Formatação ambígua → seguir FORMATTING_SPEC ao pé da letra
- Não sabe quantas evidências → inventariar e numerar

---

## 2. ESTRUTURA DO DOCUMENTO

### Seções e Páginas-Alvo

| # | Seção | Páginas | Evidence Cards | Tabelas |
|---|-------|---------|---------------|---------|
| 0 | Capa + Índice | 3-5 | 0 | 1 (metadata) |
| 1 | Synopsis | 2-3 | 0 | 1 (synopsis) |
| 2 | ELIGIBILITY | 8-12 | 2-5 | 1 (synopsis) |
| 3 | PRONG 1 (A+B+C) | 15-25 | 4-6 | 5+ (dados federais) |
| 4 | PRONG 2 (A+B) | 15-25 | 8-12 | 3+ (cronológica, validação, synopsis) |
| 5 | PRONG 3 (A+B) | 8-15 | 1-3 | 3+ (empregos, balance, synopsis) |
| 6 | Conclusion | 3-5 | 0 | 1 (summary) |
| 7 | Sources | 1-2 | 0 | 0 |
| | **TOTAL** | **55-92** | **15-30** | **14+** |

### Regra de Sequência
```
Eligibility PRIMEIRO → depois Prong 1 → Prong 2 → Prong 3
Sem elegibilidade, USCIS nem analisa os prongs.
```

---

## 3. SPECS TÉCNICAS (RESUMO — VER FORMATTING_SPEC_NIW.md PARA DETALHES)

```python
# === PÁGINA ===
page = "US Letter 8.5×11, margins L=2.0cm R=1.5cm T/B=1.5cm"

# === FONTE: 100% GARAMOND ===
body      = "12pt justified, black, line_spacing 14.5pt"
h_section = "14pt bold, shading #D6E1DB, black, LEFT"
h_sub     = "13pt bold italic, shading #D6E1DB, black, JUSTIFY"
h_subsec  = "12pt bold, black, LEFT"
ev_title  = "10pt bold, #2E7D32"
ev_meta   = "10pt regular, black"
table     = "10pt, header bold #D6E1DB"
footer    = "8pt gray #808080, CENTER"
footnotes = "10pt, black"

# === CORES (NOVA PALETA v3) ===
VERDE_PROEX     = "#D6E1DB"  # Headers, table headers (NOVO v3)
CREME           = "#FFF8EE"  # Evidence blocks (COLUNA METADADOS apenas; NOVO v3)
EV_GREEN        = "#2E7D32"  # "Evidence XX." texto
H4_SUBTITLE     = "#F2F5D7"  # Subtítulos H4 (light yellow)
BLACK           = "#000000"  # Todo texto
GRAY            = "#808080"  # Footer
BLUE            = "PROIBIDO" # ZERO azul em qualquer lugar
C5E0B4_ANTIGO   = "FORBIDDEN" # Cor v2 proibida em v3

# === EVIDENCE BLOCK v4 ===
# Tabela 1×2, Col0 ~3.5cm (thumbnail), Col1 restante
# Shading Col0: BRANCO (ShadingType.CLEAR)
# Shading Col1: #FFF8EE (ShadingType.CLEAR)
# cantSplit = true na row (impede quebra entre páginas)
# Evidence card SEMPRE ANTES do texto argumentativo

# === TABELAS ===
# Bordas: APENAS horizontais (top, bottom, insideHorizontal)
# ZERO bordas laterais, ZERO bordas verticais internas
# Header: #D6E1DB, bold, preto
# tblInd = 0 (sem recuo)
# tblW = 5000 pct (100% width)

# === FOOTER ===
# "EB-2 NIW | I-140 Petition — Cover Letter [NOME] | Page X of Y"

# === NOVAS REGRAS v3 ===
# Sub-evidências: DESCONTINUADAS (XXa, XXb não existem)
# Proporções: Introduction 10-15%, Eligibility+Prong1 40-50%, Prong2+3 35-45%
```

---

## 4. FRAMEWORK LEGAL (RESUMO — VER LEGAL_FRAMEWORK_NIW_2026.md)

### Dhanasar v. USCIS (26 I&N Dec. 884, AAO 2016)
- Prong 1: substantial merit + national importance
- Prong 2: well positioned to advance
- Prong 3: on balance, beneficial to waive

### Elegibilidade
- Via 1: Advanced Degree (Master's ou Bachelor's + 5 anos)
- Via 2: Exceptional Ability (3 de 6 critérios)

### Jurisprudência
- PA-2025-16, Mukherji v. Miller, Loper Bright, Kazarian

---

## 5. PROIBIÇÕES ABSOLUTAS (RESUMO — VER FORBIDDEN_CONTENT_NIW.md)

| Categoria | Proibido | Correto |
|-----------|----------|---------|
| Juízo de valor | "satisfaz/satisfeito" sobre critérios | "atende/consistente com" |
| Employer | "employer/sponsor/patrocinador" | NIW = autopetição |
| Voz | "o beneficiário/peticionário" | 1ª pessoa |
| Entidades | "constituída/sediada" (sem Articles of Org) | "planejada/projetada" |
| Cores antigo | "#C5E0B4" | "#D6E1DB" |
| Termos | "jurídico/adjudicativo" | "regulatório/probatório" |
| Abreviação | "Ev." | "Evidence" por extenso |
| Seções | "Objeções Antecipadas" | Defesas costuradas |
| Ortografia | "Attesta" (duplo T) | "Atesta" |
| Idioma | Inglês corpo narrativo | 100% português brasileiro |

---

## 6. LIÇÕES TÉCNICAS DA ANDREA (APLICAR SEMPRE)

Estas foram extraídas de auditoria real do QC sobre output do Claude Code. Ver LICOES_TECNICAS_ANDREA.md para detalhes completos.

### 6.1 Acentuação Portuguesa
O word_map de acentos DEVE conter no mínimo 200 palavras. A v1 começou com ~100 e precisou de 4 batches de expansão. Incluir obrigatoriamente:
- Todas as palavras com ê/é/ã/õ/í/ó/ú/â/ç que aparecem no texto
- Proteção de URLs (nunca corrigir acentos dentro de URLs)
- Nomes próprios (Estácio de Sá, Lázaro, Brandão)

### 6.2 Thumbnails v4
- Documentos traduzidos: usar PÁGINA 2 (pág 1 é certificado do tradutor)
- Documentos paisagem (diplomas, certificados): detectar width>height → layout expandido
- ShadingType.CLEAR obrigatório (SOLID causa fundo preto)
- Verificar visualmente: thumbnail deve corresponder ao documento real

### 6.3 Evidence Blocks v4
- Shading APENAS na coluna metadados: #FFF8EE (NOVO v3)
- Coluna thumbnail: branco (ShadingType.CLEAR)
- cantSplit = true (impede quebra entre páginas)
- Description & Relevance: mínimo 4 linhas densas (não 1-2 linhas)
- Sem recuo — evidence blocks full-width

### 6.4 Validação Automatizada
Antes de entregar QUALQUER .docx, executar:
1. Scan de forbidden content (satisfaz, employer, beneficiário, PROEX, Attesta, #C5E0B4)
2. Scan de acentos faltantes (comparar contra word_map expandido)
3. Scan de cores (zero azul, zero #C5E0B4 antigo, cores corretas D6E1DB/FFF8EE)
4. Scan de evidence bold
5. Contagem de páginas vs. target
6. Validação conteúdo PDFs (EVIDENCE_CONTENT_VALIDATION)

---

## 7. LIÇÕES DA V5 EB-1A INCORPORADAS NA V3 NIW

Integradas do sucesso do sistema EB-1A v5 para EB-2 NIW v3:

- **Nova paleta de cores**: PROEX verde #D6E1DB + creme #FFF8EE (não C5E0B4 + FFF2CC)
- **Evidence block v4**: thumbnail branco + metadados creme, cantSplit = true
- **Sub-evidências descontinuadas**: ZERO sufixos XXa/XXb — evidências são monolíticas
- **Gate 7 assembly DOCX**: wp:anchor, tblInd, keepNext, widowControl conforme pipeline
- **EVIDENCE_CONTENT_VALIDATION**: validar conteúdo real antes de usar
- **Proporções obrigatórias**: 10-15% / 40-50% / 35-45% (nenhum bloco < 15%)
- **Idioma PT-BR obrigatório**: 100% português brasileiro em corpo narrativo (zero inglês)

---

## 8. ARQUIVOS DO SISTEMA (O QUE LER E QUANDO)

### Leitura OBRIGATÓRIA antes de começar (ordem):
| # | Arquivo | Prioridade |
|---|---------|-----------|
| 1 | SISTEMA_COVER_LETTER_EB2_NIW_v3.md (ESTE) | Arquitetura + execução |
| 2 | LICOES_TECNICAS_ANDREA.md | Bugs reais + fixes |
| 3 | FORMATTING_SPEC_NIW.md | Tipografia exata |
| 4 | FORBIDDEN_CONTENT_NIW.md | Zero tolerância |
| 5 | LEGAL_FRAMEWORK_NIW_2026.md | Base legal |
| 6 | QUALITY_GATES_NIW.md | Checks de qualidade |
| 7 | DOCX_PRODUCTION_PIPELINE_NIW.md | **NOVO: Pipeline DOCX** |
| 8 | EVIDENCE_CONTENT_VALIDATION_NIW.md | **NOVO: Validação conteúdo** |

### Leitura durante produção (por seção):
| Seção | Template |
|-------|---------|
| Eligibility | TEMPLATE_ELIGIBILITY.md |
| Prong 1 | TEMPLATE_PRONG1.md |
| Prong 2 | TEMPLATE_PRONG2.md |
| Prong 3 | TEMPLATE_PRONG3.md |

### Referência:
| Arquivo | Quando |
|---------|--------|
| EVIDENCE_NAMING_CONVENTION_NIW.md | Nomear evidências (ATUALIZADO: sub-evidências descontinuadas) |
| RESEARCH_AGENT.md | Pesquisa web Prong 1 |
| QUALITY_AGENT.md | Auto-auditoria |
| CHECKLIST_PRE_PRODUCAO_NIW.md | Referência (absorvido pela execução autônoma) |

---

## 9. BENCHMARKS

Nunca citar nomes de clientes benchmark. Usar APENAS para calibrar:
- Formato visual (evidence cards v4, thumbnails, tabelas)
- Densidade (parágrafos por seção, evidências por prong)
- Tom (assertivo, fundamentado, 1ª pessoa)
- Tamanho (55-92 páginas)
- Paleta de cores (D6E1DB + FFF8EE)

---

## 10. DIFERENÇAS vs. EB-1A

| Aspecto | EB-1A | EB-2 NIW |
|---------|-------|----------|
| Framework | Kazarian (Step 1+2) | Dhanasar (3 Prongs) |
| Seções | 10 critérios (mín. 3) | Eligibility + 3 Prongs |
| Foco | "Sou extraordinário" | "Meu PROJETO beneficia os EUA" |
| Web research | Opcional | **OBRIGATÓRIO** (CETs, EOs, budgets) |
| Business Plan | Raro | Frequente |
| Labor market | Irrelevante | Escassez = PROIBIDO argumentar |
| Sponsor | Self-petition | Self-petition (ZERO employer) |
| Idioma | PT-BR | PT-BR |
| Cores | #D6E1DB + #FFF8EE | #D6E1DB + #FFF8EE (mesmas) |
| Evidence block | v4 (thumbnail branco) | v4 (thumbnail branco) |

---

## 11. ANTI-BOILERPLATE (OBRIGATÓRIO)

USCIS usa ATLAS (NLP) e ATA (perplexidade) para detectar texto genérico de IA. CADA parágrafo deve ter:
- Dado numérico ESPECÍFICO do cliente (não genérico)
- Variação de comprimento de frase (5-50 palavras)
- Zero jargão oco ("sinergia", "paradigma", "revolucionário")
- Referência a Evidence específica
- Footnote com URL para dados externos

---

## 12. ENTREGA FINAL

### O que entregar:
```
VF_COVER_LETTER_[NOME]_EB2_NIW.docx
```

### Relatório de entrega (mensagem a Paulo):
```
Cover letter gerada para [NOME].
- [N] páginas | [N] evidências | [N] tabelas | [N] footnotes
- Elegibilidade: [via]
- Prong 1: [N] fontes federais vinculadas
- Prong 2: [N] cartas + BP + [N] investidores
- Prong 3: [N] fatores NYSDOT cobertos
- Validação: [PASS/N pendências]
- Pendências [VERIFICAR]: [lista ou "nenhuma"]
```

---

*v3.0 — 18/03/2026 — Execução Autônoma*
*Substitui: SISTEMA v2.0*
*Incorpora: Lições EB-1A v5 + Andrea Medeiros (paleta cores, evidence v4, sub-evidências, Gate 7, proporções, idioma)*
