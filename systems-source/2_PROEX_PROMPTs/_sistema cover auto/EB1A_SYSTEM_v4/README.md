# EB-1A Cover Letter Factory — v4.0 (nova paleta de cores PROEX)

## Para subir no Projects do Claude.ai (tudo flat, sem subpastas)
### Atualizado em 17/03/2026 — Nova paleta de cores + evidence block design

---

## O que mudou v3.0 → v4.0

### Mudanças de Cores (GLOBAL)
| Elemento | v3 (antigo) | v4 (novo) | Hex |
|----------|-------------|-----------|-----|
| Headers de seção, capa | Sage Green #C5E0B4 | Verde PROEX #D6E1DB | `D6E1DB` |
| Sub-headers (Part A/B/C), table headers | (não existia) | Bege/Marrom #E3DED1 | `E3DED1` |
| Terceiro nível, linhas alternadas | (não existia) | Cinza Claro #F2F2F2 | `F2F2F2` |
| Evidence block background | Cream #FFF2CC (ambas colunas) | Creme #FFF8EE (APENAS coluna metadados) | `FFF8EE` |

### Mudança no Evidence Block
- **Antes (v3)**: Fundo creme em AMBAS as colunas (thumbnail + metadados)
- **Agora (v4)**: Fundo creme APENAS na coluna de metadados (coluna 1). Coluna de thumbnail (coluna 0) = fundo branco
- **Novo**: `cantSplit = true` na row da tabela (impede quebra entre páginas)

### #C5E0B4 agora é cor PROIBIDA
Adicionada à lista de FORBIDDEN_COLORS em FORBIDDEN_CONTENT.md. Qualquer documento usando a paleta antiga precisa ser atualizado.

---

## O que mudou v2.2 → v3.0

### Novos Arquivos (3)
| # | Arquivo | O que é | Lição que motivou |
|---|---------|---------|---|
| 21 | EVIDENCE_CONTENT_VALIDATION.md | Gate de validação conteúdo real dos PDFs | Evidence 37 = CRF em vez de carta; Evidence 71 = placeholders |
| 22 | SEMANTIC_CROSS_REFERENCE_MAP.md | Mapa obrigatório conteúdo→evidência | 7 referências cruzadas erradas (MagicChá→26, Francelino→49, etc.) |
| 23 | validate_evidence_package.py | Script executável de validação automática | Todo o pseudocódigo v2 era manual |

### Arquivos Atualizados (4 — conteúdo v2 INTACTO, adições ao final)
| Arquivo | O que foi adicionado |
|---|---|
| CHECKLIST_PRE_PRODUCAO.md | Seções 11 (Tradução) e 12 (CVs dos Recomendadores) |
| QUALITY_GATES.md | Gates 3.16 (Integridade XML), 4.5 (Conteúdo PDFs), 5.5 (Mapa Semântico), 5.6 (CVs), 6.5 (Footnotes) |
| FORMATTING_SPEC.md | Lógica de thumbnail (pular certificado tradução), footnotes nativos obrigatórios, limpeza de espaçamento, largura de tabelas |
| EVIDENCE_NAMING_CONVENTION.md | Convenção de sub-evidências (XXa = CV, XXb = original PT) |

---

## Instruções do Projeto
Colar o conteúdo de `ARCHITECT_COVER_LETTER_EB1.md` no campo "Instruções"

## Arquivos (Knowledge) — 23 arquivos

### Core (4)
| # | Arquivo | O que é |
|---|---------|---------|
| 1 | SISTEMA_COVER_LETTER_EB1A_v2.md | Arquitetura do sistema (6 fases) |
| 2 | ARCHITECT_COVER_LETTER_EB1.md | System prompt (vai nas Instruções) |
| 3 | CHECKLIST_PRE_PRODUCAO.md | Checklist pré-produção (**+Tradução +CVs**) |
| 4 | README.md | Este arquivo |

### Specs + Protocolo (8)
| # | Arquivo | O que é |
|---|---------|---------|
| 5 | PROTOCOLO_DE_INTERACAO.md | **8 regras invioláveis de comportamento** |
| 6 | FORMATTING_SPEC.md | Tipografia, cores, margens (**+thumbnails +footnotes**) |
| 7 | LEGAL_FRAMEWORK_2026.md | Kazarian, PA-2025-16, Mukherji |
| 8 | FORBIDDEN_CONTENT.md | Proibições absolutas |
| 9 | QUALITY_GATES.md | 6+5 gates de validação (**+XML +PDFs +Mapa +CVs +Footnotes**) |
| 10 | EVIDENCE_NAMING_CONVENTION.md | Nomenclatura (**+sub-evidências**) |
| 11 | EVIDENCE_CONTENT_VALIDATION.md | **NOVO: Validação conteúdo dos PDFs** |
| 12 | SEMANTIC_CROSS_REFERENCE_MAP.md | **NOVO: Mapa semântico obrigatório** |

### Templates — Todos os 10 Critérios (10)
| # | Arquivo | Critério |
|---|---------|----------|
| 13 | TEMPLATE_C1_AWARDS.md | Prêmios |
| 14 | TEMPLATE_C2_MEMBERSHIP.md | Associações |
| 15 | TEMPLATE_C3_PUBLISHED_MATERIAL.md | Material publicado |
| 16 | TEMPLATE_C4_JUDGING.md | Julgamento |
| 17 | TEMPLATE_C5_ORIGINAL_CONTRIBUTIONS.md | Contribuições originais |
| 18 | TEMPLATE_C6_SCHOLARLY_ARTICLES.md | Artigos científicos |
| 19 | TEMPLATE_C7_EXHIBITIONS.md | Exibições |
| 20 | TEMPLATE_C8_LEADING_ROLE.md | Papel de liderança |
| 21 | TEMPLATE_C9_HIGH_SALARY.md | Remuneração elevada |
| 22 | TEMPLATE_C10_COMMERCIAL_SUCCESS.md | Sucesso comercial |

### Script de Validação (1)
| # | Arquivo | O que é |
|---|---------|---------|
| 23 | validate_evidence_package.py | Script Python de validação automática |

### Benchmarks (subir separado — PDFs)
- VPO_Carlos_Henrique_Avelino.pdf — NUNCA citar
- VPO_Bruno_Alcantara_Cipriano.pdf — NUNCA citar

---

## Setup rápido
1. Criar Project → colar ARCHITECT nas Instruções
2. Subir os 22 .md + 1 .py como Arquivos
3. Subir 2 PDFs de benchmark
4. Iniciar conversa: "Novo cliente: [NOME]. O*Net: [CÓDIGO]. Critérios: [LISTA]"

---

## Catálogo de Erros que Motivaram a v3.0

| Erro | Impacto | Gate v3 que previne |
|---|---|---|
| PDF contém documento errado (CRF em vez de carta) | Evidence 37 inutilizada | Gate 4.5 + EVIDENCE_CONTENT_VALIDATION |
| PDF com placeholders não preenchidos | Evidence 71 inutilizada | Gate 4.5 (detecção regex) |
| Thumbnail da página 1 = certificado tradutor | Evidence 52 visual incorreto | FORMATTING_SPEC (lógica thumbnail) |
| 7 referências cruzadas erradas | Inconsistência grave no texto | Gate 5.5 + SEMANTIC_CROSS_REFERENCE_MAP |
| Referência a Evidence > máximo | Evidence 49-81 quando max=80 | Gate 5.5 (cobertura) |
| Documento sem tradução | Evidence 65 não utilizável | CHECKLIST Seção 11 |
| CVs dos recomendadores ausentes | Pacote incompleto | CHECKLIST Seção 12 + Gate 5.6 |
| Script de bold reverteu ordem dos runs | 4 versões para corrigir | Gate 3.16 (integridade XML) |
| Notas de seção em vez de footnotes | Conversão manual gerou órfãs | Gate 6.5 + FORMATTING_SPEC |
| Evidências redundantes (50 ↔ 71) | Evidência desnecessária com placeholders | Gate 4.5 (redundância) |
| Tabela com colunas iguais | Labels ilegíveis | FORMATTING_SPEC (largura proporcional) |
| Célula com conteúdo errado | Seletividade = Ordem do Mérito | FORMATTING_SPEC (validação célula) |

---

*v4.0 — 17/03/2026 — Nova paleta de cores PROEX + evidence block com thumbnail branco + cantSplit.*
*Base: v3.0 (09/03/2026) — Lições Renato Silveira + Andrea Justino.*
