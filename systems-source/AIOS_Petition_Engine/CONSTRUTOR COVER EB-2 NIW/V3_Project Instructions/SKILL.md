# EB-2 NIW Cover Letter Factory — Multi-Agent Skill para Claude Code
## v2.0 — 28/02/2026
## Arquitetura Multi-Agente para Produção de Cover Letters EB-2 National Interest Waiver

---

## Visão Geral

Este skill transforma o Claude Code em uma **fábrica multi-agente** de Cover Letters para petições EB-2 NIW. Ele orquestra **3 agentes especializados**, executa **pesquisa profunda na web**, produz **.docx prontos para protocolo**, e valida contra **25 checks de qualidade** antes da entrega.

---

## ARQUITETURA MULTI-AGENTE

```
┌─────────────────────────────────────────────┐
│            🎯 ORQUESTRADOR (SKILL.md)       │
│         Coordena fases e checkpoints        │
│         Apresenta resultados a Paulo        │
│         Decide qual agente ativar           │
└──────────┬──────────┬──────────┬────────────┘
           │          │          │
    ┌──────▼──────┐ ┌▼────────┐ ┌▼───────────┐
    │ 🔍 AGENTE  │ │ ✍️ AGENTE│ │ 🛡️ AGENTE  │
    │ PESQUISADOR│ │ ESCRITOR │ │ QUALIDADE  │
    │            │ │          │ │            │
    │ Deep       │ │ Produz   │ │ 25 checks  │
    │ Research   │ │ a CL em  │ │ brutais    │
    │ Prong 1    │ │ .docx    │ │ cross-doc  │
    │            │ │          │ │            │
    │ RESEARCH_  │ │ARCHITECT_│ │ QUALITY_   │
    │ AGENT.md   │ │ NIW.md   │ │ AGENT.md   │
    └─────────────┘ └──────────┘ └────────────┘
           │          │          │
    ┌──────▼──────────▼──────────▼────────────┐
    │        📚 KNOWLEDGE BASE (14 arquivos)  │
    │  Legal, Templates, Specs, Protocols     │
    └─────────────────────────────────────────┘
```

---

## OS 3 AGENTES

### 🔍 Agente Pesquisador (RESEARCH_AGENT.md)
- **Quando ativa**: Fase 1 (Deep Research)
- **O que faz**: 20-30 web searches, conecta campo do cliente a prioridades federais
- **Output**: Research Dossier com URLs verificáveis
- **Não faz**: Escrever argumentação, produzir CL

### ✍️ Agente Escritor (ARCHITECT_NIW.md)
- **Quando ativa**: Fases 0, 2, 3 (Inventário, Planejamento, Produção)
- **O que faz**: Lê documentos, mapeia evidências, produz CL em .docx
- **Output**: Cover Letter completa formatada em Garamond/sage green
- **Não faz**: Inventar dados, avançar sem aprovação

### 🛡️ Agente de Qualidade (QUALITY_AGENT.md)
- **Quando ativa**: Após CADA bloco de produção + antes da entrega final
- **O que faz**: 25 verificações brutais cross-document
- **Output**: Relatório de qualidade com erros CRÍTICOS/GRAVES/ALERTAS
- **Não faz**: Sugerir evidências novas, fazer "ajuste grosso", sugerir o impossível
- **Modular**: Desenhado para reusar em EB-1A e outros documentos futuramente

---

## WORKFLOW DE 6 FASES

```
FASE 0: INTAKE        → Agente Escritor lê tudo, inventaria, classifica
        ↓ CHECKPOINT (Paulo aprova)
FASE 1: RESEARCH      → Agente Pesquisador faz 20-30 web searches
        ↓ CHECKPOINT (Paulo aprova Research Dossier)
FASE 2: PLANEJAMENTO  → Agente Escritor define PE, mapeia prongs, estratégia
        ↓ CHECKPOINT (Paulo aprova Plano Estratégico)
FASE 3: PRODUÇÃO      → Agente Escritor produz CL bloco a bloco
        ↓ [Agente Qualidade roda após CADA bloco]
        ↓ CHECKPOINT por bloco (Paulo aprova)
FASE 4: VALIDAÇÃO     → Agente Qualidade roda 25/25 checks na CL completa
        ↓ CHECKPOINT (Paulo aprova relatório)
FASE 5: ENTREGA       → .docx final em /mnt/user-data/outputs/
```

---

## CONTEXTO 2026: POR QUE MULTI-AGENTE

| Fato | Impacto |
|------|---------|
| Taxa de aprovação NIW caiu de 96% (FY2023) para 43% (FY2024) | Escrutínio brutal |
| USCIS implantou ATLAS (NLP + clustering) | Detecta boilerplate por escritório |
| USCIS implantou ATA (perplexidade + burstiness) | Detecta texto GenAI |
| FDNS-DS NexGen cruza petições via ML | Detecta duplicidade entre clientes |
| PA-2025-03 exige especificidade extrema | Vagueza = RFE automático |
| Setor de qualidade humano pega inconsistências graves | Agente de qualidade DEVE ser melhor |

---

## ARQUITETURA DE ARQUIVOS (19 total)

### Agentes (3)
| Arquivo | Função |
|---------|--------|
| RESEARCH_AGENT.md | Agente Pesquisador — Deep Research Prong 1 |
| ARCHITECT_NIW.md | Agente Escritor — produção da CL |
| QUALITY_AGENT.md | Agente de Qualidade — 25 checks brutais |

### Core (2)
| Arquivo | Função |
|---------|--------|
| SKILL.md | **ESTE ARQUIVO** — Orquestrador |
| PROTOCOLO_INTERACAO_NIW.md | 8 regras invioláveis de comportamento |

### Legal & Doutrina (3)
| Arquivo | Função |
|---------|--------|
| LEGAL_FRAMEWORK_NIW_2026.md | Dhanasar, PAs, 8 CFR, case law |
| RFE_PATTERNS_AND_DEFENSES.md | Padrões de RFE por prong |
| ANTI_DETECTION_PROTOCOL.md | ATLAS, ATA, FDNS, anti-boilerplate |

### Templates de Produção (5)
| Arquivo | Função |
|---------|--------|
| TEMPLATE_ELIGIBILITY.md | Seção EB-2 Classification |
| TEMPLATE_PRONG1.md | Seção Prong 1 com modelo |
| TEMPLATE_PRONG2.md | Seção Prong 2 com modelo |
| TEMPLATE_PRONG3.md | Seção Prong 3 com modelo |
| TEMPLATE_CONCLUSION.md | Seção Conclusão com modelo |

### Specs Técnicas (6)
| Arquivo | Função |
|---------|--------|
| FORMATTING_SPEC_NIW.md | .docx: Garamond, cores, margens, EMUs |
| FORBIDDEN_CONTENT_NIW.md | Termos proibidos (zero tolerância) |
| QUALITY_GATES_NIW.md | Gates de validação legados (absorvidos pelo Quality Agent) |
| EVIDENCE_NAMING_NIW.md | Nomenclatura 3-way consistency |
| RESEARCH_PROTOCOL.md | Queries de pesquisa por categoria |
| CHECKLIST_PRE_PRODUCAO_NIW.md | Checklist pré-produção por seção |

---

## REGRAS DO ORQUESTRADOR

### Regra #1: LEIA TODOS OS ARQUIVOS ANTES DE COMEÇAR
Ler os 19 arquivos .md nesta ordem:
1. SKILL.md (este arquivo)
2. ARCHITECT_NIW.md, RESEARCH_AGENT.md, QUALITY_AGENT.md (agentes)
3. PROTOCOLO_INTERACAO_NIW.md (regras de interação)
4. LEGAL_FRAMEWORK_NIW_2026.md (base legal)
5. Todos os demais (templates, specs, protocols)

### Regra #2: ANTI-BOILERPLATE É VIDA OU MORTE
ATLAS e ATA estão ativos. Cada parágrafo DEVE ter:
- Dado numérico específico do cliente
- Variação de comprimento de frase (5-50 palavras)
- Zero jargão oco
- Referência de Evidence
- Footnote com URL para dados externos

### Regra #3: PROPOSED ENDEAVOR ≠ CAMPO DE ATUAÇÃO
"Consultoria financeira" NÃO é um PE. "Fundação da XYZ Financial Consulting LLC, empresa de compliance regulatório para fintechs Series B no setor de pagamentos digitais" É um PE.

### Regra #4: ESCASSEZ DE MÃO-DE-OBRA ≠ IMPORTÂNCIA NACIONAL
Isto foi explicitamente rejeitado pela AAO. Se o argumento é "faltam profissionais", a resposta do USCIS é "use o PERM". O argumento deve ser: "meu projeto avança prioridades federais documentadas".

### Regra #5: QUALIDADE É INEGOCIÁVEL
O Agente de Qualidade roda APÓS cada bloco. Se encontra erro CRÍTICO, a produção PARA até correção. Não existe "manda assim mesmo". Um dado errado pode custar o visto.

### Regra #6: NÃO SUGIRA O IMPOSSÍVEL
Na hora da cover letter, a coleta de evidências já foi feita. NÃO sugira: "obtenha um prêmio internacional", "publique em Nature", "consiga carta do Presidente". Sugira SOMENTE: traduções faltantes, divergências de dados, inconsistências documentais, falhas de nomenclatura.

---

## EB-1A vs EB-2 NIW — Diferenças Críticas

| Aspecto | EB-1A | EB-2 NIW |
|---------|-------|----------|
| Standard | Extraordinary Ability | Advanced Degree + National Interest |
| Test | 10 critérios (3 de 10) | 3 Prongs Dhanasar (TODOS) |
| Focus | "Sou extraordinário" | "Meu PROJETO beneficia os EUA" |
| Web research | Opcional (mídia, citações) | **OBRIGATÓRIO** (CETs, EOs, budgets) |
| Business Plan | Raro | Frequente (empreendedores) |
| Labor market | Irrelevante | Argumento de escassez = PROIBIDO |
| Quality Agent | Mesmos 25 checks | Mesmos 25 checks (modular) |

---

## COMO INICIAR UM NOVO CASO

Prompt de ativação para o Claude Code:

```
Leia TODOS os 19 arquivos .md do skill eb2-niw-system começando pelo SKILL.md.
Confirme a leitura. Depois leia TODOS os documentos do cliente em [PASTA].
Este é o caso de [NOME] para EB-2 NIW.
Execute a FASE 0 — INTAKE E INVENTÁRIO e AGUARDE minha aprovação.
```

---

*v2.0 — 28/02/2026 — Multi-Agent Architecture*
