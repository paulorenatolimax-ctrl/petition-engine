# SISTEMA DE CONSTRUÇÃO DE COVER LETTER EB-2 NIW
## Índice Rápido — v2.0 (02/03/2026)
## Execução Autônoma — "Drop docs, press go, get cover letter"

---

## O QUE MUDOU (v1 → v2)

| Antes (v1) | Agora (v2) |
|---|---|
| Para após cada seção, espera aprovação | Executa tudo sozinho, 0 interações |
| 8 regras de interação com checkpoints | 3 HALTs (únicos motivos para parar) |
| PROTOCOLO_DE_INTERACAO separado | Absorvido pelo ARCHITECT v2 |
| Multi-agente (3 prompts separados) | Agente único com 3 modos internos |
| Sem lições técnicas documentadas | LICOES_TECNICAS com 21 bugs reais |

---

## COMO USAR

### No Projects (Claude.ai):
1. Colar **ARCHITECT_COVER_LETTER_EB2_NIW_v2.md** como **Project Instructions**
2. Subir como Knowledge: SISTEMA v2, LICOES_TECNICAS, specs, templates, benchmarks, RAGs
3. Subir documentos do cliente
4. Dizer: **"Faz a cover letter do [NOME]. SOC: [CÓDIGO]."**
5. Esperar. Ele entrega pronto.

### No Claude Code (terminal):
1. Copiar todos os .md para pasta do projeto do cliente (NÃO em /tmp!)
2. **ARCHITECT v2** como CLAUDE.md
3. Dizer: **"Faz a cover letter do [NOME]. SOC: [CÓDIGO]."**
4. Esperar. Ele entrega pronto.

**IMPORTANTE**: Sempre abrir Claude Code NA PASTA DO CLIENTE, nunca em /tmp:
```bash
cd "/caminho/para/pasta/do/cliente" && claude
```

---

## ARQUIVOS DO SISTEMA

### NOVOS (v2) — usar estes:
| Arquivo | O que é |
|---------|---------|
| **SISTEMA_COVER_LETTER_EB2_NIW_v2.md** | Arquitetura completa + execução autônoma |
| **ARCHITECT_COVER_LETTER_EB2_NIW_v2.md** | Prompt principal (Project Instructions / CLAUDE.md) |
| **LICOES_TECNICAS_ANDREA.md** | 21 bugs reais + fixes obrigatórios |
| **README_NIW_v2.md** | Este arquivo |

### DEPRECADOS (v1) — NÃO usar mais:
| Arquivo | Substituído por |
|---------|----------------|
| ~~SISTEMA v1~~ | SISTEMA v2 |
| ~~ARCHITECT v1~~ | ARCHITECT v2 |
| ~~PROTOCOLO_DE_INTERACAO_NIW~~ | Absorvido pelo ARCHITECT v2 + SISTEMA v2 |
| ~~README_NIW~~ | README v2 |

### MANTIDOS (sem alteração):
| Arquivo | Função |
|---------|--------|
| FORMATTING_SPEC_NIW.md | Tipografia, cores, margens |
| FORBIDDEN_CONTENT_NIW.md | Proibições (zero tolerância) |
| LEGAL_FRAMEWORK_NIW_2026.md | Dhanasar, PAs, legislação |
| QUALITY_GATES_NIW.md | Checks por fase |
| EVIDENCE_NAMING_CONVENTION_NIW.md | Nomenclatura |
| TEMPLATE_ELIGIBILITY.md | Template Eligibility |
| TEMPLATE_PRONG1.md | Template Prong 1 |
| TEMPLATE_PRONG2.md | Template Prong 2 |
| TEMPLATE_PRONG3.md | Template Prong 3 |
| RESEARCH_AGENT.md | Protocolo de pesquisa web |
| QUALITY_AGENT.md | 25 checks de qualidade |
| CHECKLIST_PRE_PRODUCAO_NIW.md | Referência (execução absorvida) |
| SKILL.md | Orquestrador (compatível com v2) |

**TOTAL: 17 arquivos ativos** (4 novos + 13 mantidos)

---

## PIPELINE v2 (AUTÔNOMO)

```
"Faz a cover letter do [NOME]. SOC: [CÓDIGO]."
│
├── FASE 0: INTAKE
│   ├── Ler specs + templates + legal + forbidden + lições técnicas
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
│   ├── Evidence cards com thumbnails
│   ├── Tabelas visuais (14+ tabelas)
│   ├── Acentuação (word_map 200+ palavras)
│   └── Target: 73+ páginas
│
├── FASE 3: AUTO-AUDITORIA
│   ├── Forbidden content scan
│   ├── Accent scan
│   ├── Color scan (zero azul)
│   ├── Evidence bold + shading
│   ├── BP cross-check
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

*v2.0 — 02/03/2026 — Execução Autônoma*
