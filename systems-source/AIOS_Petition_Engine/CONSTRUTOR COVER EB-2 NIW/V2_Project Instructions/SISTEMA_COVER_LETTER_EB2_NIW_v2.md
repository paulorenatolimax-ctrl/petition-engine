# SISTEMA DE CONSTRUÇÃO DE COVER LETTER EB-2 NIW
## Arquitetura Completa — v2.0 (02/03/2026)
## Escritório PROEX — Execução Autônoma
## SUBSTITUI: SISTEMA v1.0, PROTOCOLO_DE_INTERACAO v1.0

---

## MUDANÇA FUNDAMENTAL v1 → v2

| v1.0 (01/03/2026) | v2.0 (02/03/2026) |
|---|---|
| Para após cada seção e espera Paulo | **Executa tudo sozinho, para APENAS se bloqueado** |
| 8 regras de interação com checkpoints | **3 condições de HALT + execução contínua** |
| ~30 parágrafos por vez | **Seção inteira de uma vez** |
| Multi-agente (Pesquisador + Escritor + Qualidade) | **Agente único com 3 modos internos** |
| "Posso prosseguir?" | **PROIBIDO perguntar — apenas executa** |

**PRINCÍPIO**: A cover letter é o ÚLTIMO documento do caso. Quando chega aqui, TUDO já existe na pasta. Não faz sentido interagir. É ler, processar, gerar.

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
├── Ler TODOS os .md do sistema (specs, templates, legal, forbidden)
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
├── Aplicar TODAS as formatações (Garamond, cores, thumbnails, etc.)
├── Rodar validação interna (forbidden content, evidence bold, cores)
└── CONTINUA AUTOMATICAMENTE

FASE 3: AUTO-AUDITORIA
├── Rodar os 25 checks do Quality Agent internamente
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
h_section = "14pt bold, shading #C5E0B4, black, LEFT"
h_sub     = "13pt bold italic, shading #C5E0B4, black, JUSTIFY"
h_subsec  = "12pt bold, black, LEFT"
ev_title  = "10pt bold, #2E7D32"
ev_meta   = "10pt regular, black"
table     = "10pt, header bold #C5E0B4"
footer    = "8pt gray #808080, CENTER"
footnotes = "10pt, black"

# === CORES ===
SAGE_GREEN    = "#C5E0B4"  # Headers, table headers
CREAM         = "#FFF2CC"  # Evidence blocks (AMBAS células)
EV_GREEN      = "#2E7D32"  # "Evidence XX." texto
H4_SUBTITLE   = "#F2F5D7"  # Subtítulos H4 (light yellow, extraído XML Márcia)
BLACK         = "#000000"  # Todo texto
GRAY          = "#808080"  # Footer
BLUE          = "PROIBIDO"  # ZERO azul em qualquer lugar

# === EVIDENCE BLOCK ===
# Tabela 1×2, Col0 ~3.5cm (thumbnail), Col1 restante
# Shading AMBAS células: #FFF2CC
# ShadingType.CLEAR (NUNCA ShadingType.SOLID — causa fundo preto)
# Evidence card SEMPRE ANTES do texto argumentativo

# === TABELAS ===
# Bordas: APENAS horizontais (top, bottom, insideHorizontal)
# ZERO bordas laterais, ZERO bordas verticais internas
# Header: #C5E0B4, bold, preto

# === FOOTER ===
# "EB-2 NIW | I-140 Petition — Cover Letter [NOME] | Page X of Y"
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
| Formatação | Headers azuis | Preto sobre sage green |
| Termos | "jurídico/adjudicativo" | "regulatório/probatório" |
| Abreviação | "Ev." | "Evidence" por extenso |
| Seções | "Objeções Antecipadas" | Defesas costuradas |
| Ortografia | "Attesta" (duplo T) | "Atesta" |

---

## 6. LIÇÕES TÉCNICAS DA ANDREA (APLICAR SEMPRE)

Estas foram extraídas de auditoria real do QC sobre output do Claude Code. Ver LICOES_TECNICAS_ANDREA.md para detalhes completos.

### 6.1 Acentuação Portuguesa
O word_map de acentos DEVE conter no mínimo 200 palavras. A v1 começou com ~100 e precisou de 4 batches de expansão. Incluir obrigatoriamente:
- Todas as palavras com ê/é/ã/õ/í/ó/ú/â/ç que aparecem no texto
- Proteção de URLs (nunca corrigir acentos dentro de URLs)
- Nomes próprios (Estácio de Sá, Lázaro, Brandão)

### 6.2 Thumbnails
- Documentos traduzidos: usar PÁGINA 2 (pág 1 é certificado do tradutor)
- Documentos paisagem (diplomas, certificados): detectar width>height → layout expandido
- ShadingType.CLEAR obrigatório (SOLID causa fundo preto)
- Verificar visualmente: thumbnail deve corresponder ao documento real

### 6.3 Evidence Blocks
- Shading #FFF2CC em AMBAS as células (thumbnail + metadata)
- Description & Relevance: mínimo 4 linhas densas (não 1-2 linhas)
- Sem recuo — evidence blocks full-width

### 6.4 Validação Automatizada
Antes de entregar QUALQUER .docx, executar:
1. Scan de forbidden content (satisfaz, employer, beneficiário, PROEX, Attesta)
2. Scan de acentos faltantes (comparar contra word_map expandido)
3. Scan de cores (zero azul, shading correto)
4. Scan de evidence bold
5. Contagem de páginas vs. target

---

## 7. ARQUIVOS DO SISTEMA (O QUE LER E QUANDO)

### Leitura OBRIGATÓRIA antes de começar (ordem):
| # | Arquivo | Prioridade |
|---|---------|-----------|
| 1 | SISTEMA_COVER_LETTER_EB2_NIW_v2.md (ESTE) | Arquitetura + execução |
| 2 | LICOES_TECNICAS_ANDREA.md | Bugs reais + fixes |
| 3 | FORMATTING_SPEC_NIW.md | Tipografia exata |
| 4 | FORBIDDEN_CONTENT_NIW.md | Zero tolerância |
| 5 | LEGAL_FRAMEWORK_NIW_2026.md | Base legal |
| 6 | QUALITY_GATES_NIW.md | Checks de qualidade |

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
| EVIDENCE_NAMING_CONVENTION_NIW.md | Nomear evidências |
| RESEARCH_AGENT.md | Pesquisa web Prong 1 |
| QUALITY_AGENT.md | Auto-auditoria |
| CHECKLIST_PRE_PRODUCAO_NIW.md | Referência (absorvido pela execução autônoma) |

---

## 8. BENCHMARKS

Nunca citar nomes de clientes benchmark. Usar APENAS para calibrar:
- Formato visual (evidence cards, thumbnails, tabelas)
- Densidade (parágrafos por seção, evidências por prong)
- Tom (assertivo, fundamentado, 1ª pessoa)
- Tamanho (55-92 páginas)

---

## 9. DIFERENÇAS vs. EB-1A

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

---

## 10. ANTI-BOILERPLATE (OBRIGATÓRIO)

USCIS usa ATLAS (NLP) e ATA (perplexidade) para detectar texto genérico de IA. CADA parágrafo deve ter:
- Dado numérico ESPECÍFICO do cliente (não genérico)
- Variação de comprimento de frase (5-50 palavras)
- Zero jargão oco ("sinergia", "paradigma", "revolucionário")
- Referência a Evidence específica
- Footnote com URL para dados externos

---

## 11. ENTREGA FINAL

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

*v2.0 — 02/03/2026 — Execução Autônoma*
*Substitui: SISTEMA v1.0 + PROTOCOLO_DE_INTERACAO v1.0*
*Lições incorporadas: Andrea Medeiros EB-2 NIW (audit completo)*
