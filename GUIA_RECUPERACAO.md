# Guia de Recuperação — Petition Engine + AIOS

## Se a conversa cair, cole EXATAMENTE isto no novo terminal:

```
Leia os arquivos abaixo NA ORDEM e absorva o contexto completo antes de fazer qualquer coisa:

1. /Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/CLAUDE.md
2. /Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/.claude/CLAUDE.md
3. /Users/paulo1844/Documents/Claude/Projects/C.P./PETITION_ENGINE_ESTADO_COMPLETO.md
4. /Users/paulo1844/Documents/Claude/Projects/C.P./DIAGNOSTICO_FASE4_FIXES_2026-03-25.md
5. /Users/paulo1844/Documents/Claude/Projects/C.P./ANTEPROJETO_SISTEMA_2026-03-25.md
6. /Users/paulo1844/Documents/Claude/Projects/C.P./RESUME_V7_FIXES_2026-03-25.md
7. /Users/paulo1844/Documents/Claude/Projects/Automação Núcleo DURO/PETITION_ENGINE_DIAGNOSTICO_E_APRIMORAMENTO.md

Depois, rode: cd ~/Documents/OMNI/_IMIGRAÇÃO/Sistema\ Automatizado/petition-engine && npm run dev

O sistema está no GitHub: https://github.com/paulorenatolimax-ctrl/petition-engine
Branch: main
Último commit: verificar com git log --oneline -5
```

---

## Onde está TUDO armazenado

### 1. GitHub (backup principal — SEMPRE atualizado)
- **Repositório:** `paulorenatolimax-ctrl/petition-engine`
- **Branch:** `main`
- **O que tem:** Todo o código fonte, error_rules.json (17 regras), systems.json (18 sistemas), clients.json (5 clientes), agents, API routes, frontend
- **Como acessar:** `git clone https://github.com/paulorenatolimax-ctrl/petition-engine.git`
- **Como verificar:** `cd petition-engine && git log --oneline -20`

### 2. Pasta local do projeto
- **Caminho:** `/Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/`
- **O que tem:** Código + data/ (JSON com regras, clientes, sistemas) + systems/ (symlinks) + scripts/

### 3. Documentação em C.P. (contexto e decisões)
- **Caminho:** `/Users/paulo1844/Documents/Claude/Projects/C.P./`
- **Arquivos-chave:**
  - `PETITION_ENGINE_ESTADO_COMPLETO.md` — estado geral do sistema
  - `PETITION_ENGINE_BLUEPRINT.md` — arquitetura técnica
  - `DIAGNOSTICO_FASE4_FIXES_2026-03-25.md` — fixes de infraestrutura
  - `ANTEPROJETO_SISTEMA_2026-03-25.md` — sistemas de anteprojeto
  - `RESUME_V7_FIXES_2026-03-25.md` — evolução do résumé
  - `BP_MEGA_PROMPT_V5_UNIVERSAL.md` — sistema de BP

### 4. Documentação AIOS (diagnóstico e aprimoramento)
- **Caminho:** `/Users/paulo1844/Documents/Claude/Projects/Automação Núcleo DURO/`
- **Arquivo:** `PETITION_ENGINE_DIAGNOSTICO_E_APRIMORAMENTO.md`

### 5. Obsidian (este guia)
- **Caminho:** `/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/`
- **Este arquivo:** `GUIA_RECUPERACAO_PETITION_ENGINE.md`

---

## Estado atual do sistema (25/03/2026)

### Petition Engine — 7 páginas funcionais
| Página | URL | Função |
|--------|-----|--------|
| Dashboard | localhost:3000 | Visão geral com dados reais |
| Clientes | localhost:3000/clientes | 5 clientes cadastrados |
| Gerador | localhost:3000/gerador | 18 sistemas, gera via claude -p |
| Documentos | localhost:3000/documentos | Lista + importação + feedback cirúrgico/cascalho |
| Qualidade | localhost:3000/qualidade | Dashboard de qualidade |
| Erros | localhost:3000/erros | 17 regras ativas + painel de feedback |
| Sistemas | localhost:3000/sistemas | 18 sistemas com symlinks |

### Error Rules — 17 regras ativas
- r1-r8: Regras seed (I believe, I think, Dhanasar, proposed endeavor, etc.)
- r9: SOC code dentista proibido
- r10: SOC codes restritos (advogado, médico, engenheiro, contador)
- r11: Compatibilidade educacional SOC
- r12: Nunca dizer "PROMPT" no output
- r13: Output 100% português
- r14: Endeavors genéricos proibidos (consultoria/assessoria)
- r15: RAGs obrigatórios antes de gerar
- r16: Nunca mencionar PROEX/Kortix/outros clientes
- r17: Revisão obrigatória de dados em infográficos de IA

### Sistemas — 18 registrados
| # | Sistema | Tipo |
|---|---------|------|
| 1-2 | Résumé EB-2 NIW / EB-1A | Geração |
| 3-4 | Cover Letter EB-1A / EB-2 NIW | Geração |
| 5 | Business Plan | Geração |
| 6-7 | Metodologia / Declaração | Geração |
| 8 | IMPACTO® | Geração |
| 9-10 | Estratégia EB-2 / EB-1 | Geração |
| 11 | Localização | Pesquisa |
| 12 | Pareceres da Qualidade | Qualidade |
| 13-14 | Cartas Satélite / Cartas EB-1 | Geração |
| 15-16 | Anteprojeto EB-2 NIW / EB-1A | Estratégia |
| 17-18 | Projeto-Base EB-2 NIW / EB-1A | Estratégia |

### Pipeline de geração
```
Botão "Gerar" → /api/generate (monta prompt + injeta 17 regras)
    → /api/generate/execute (claude -p real)
        → Fase 1: Geração
        → Fase 1.5: QualityAgent local (score 0-100)
        → Fase 2: Separation of Concerns (revisão cruzada)
    → Resultado aparece em /documentos
    → Paulo aponta erro (cirúrgico ou cascalho)
    → Vira regra → Próxima geração já sai sem esse erro
```

### Agentes ativos
| Agente | Arquivo | Função |
|--------|---------|--------|
| Extractor | src/agents/extractor.ts | Lê docs do cliente → JSON |
| Writer | src/agents/writer.ts | Monta prompt com sistema + regras |
| Quality | src/agents/quality.ts | Valida via Supabase |
| Quality Local | src/agents/quality-local.ts | Valida via JSON (sem Supabase) |
| USCIS Reviewer | src/agents/uscis-reviewer.ts | Simula adjudicação |
| Auto-Debugger | src/agents/auto-debugger.ts | Feedback → regra automática |
| System Updater | src/agents/system-updater.ts | Versionamento + rollback |

---

## Commits de 25/03/2026 (14 commits)

```
e6899a5 fix: 6 problemas de infraestrutura
7de7299 feat: scripts e templates
3deffd4 feat: auto-learning UI
27e96ee feat: regra SOC code
dda8cc9 feat: injeção de rules no generate
408f226 feat: anteprojeto e projeto-base EB-1/EB-2
3794346 feat: regra r17 infográficos
fbcfd26 feat: QualityAgent local no pipeline
ed55c05 feat: AIOS Squad Runner
df97650 feat: página /documentos
544e987 feat: importação + feedback cirúrgico/cascalho
364b6f8 feat: campo de considerações na importação
```

---

## Benchmarks de qualidade (onde estão)

| Benchmark | Caminho |
|-----------|---------|
| BP Ikaro (padrão visual) | /OMNI/_IMIGRAÇÃO/BP Orquestrador/VF_business plan_ikaro ferreira souza.pdf |
| Résumé Thiago (EB-1A) | /_PROEX/_2. MEUS CASOS/2026/Thiago Fernandes.../Resume_Thiago_Fernandes_dos_Santos_EB1A.docx |
| Résumé André (EB-1A) | /_PROEX/_2. MEUS CASOS/2026/ANDRÉ CERBASI.../VF_Resume_Andre_Cerbasi_V8.docx |
| Anteprojeto Thayse (EB-2) | /_PROEX/_1. APIÁRIO.../LILIAN/Thayse/Anteprojeto Thayse.pdf |
| Anteprojeto Thiago (EB-1) | /_PROEX/_2. MEUS CASOS/2026/Thiago.../ANTEPROJETO_EB1A_v3.pdf |

---

## RAGs (base de conhecimento jurídico)

| RAG | Caminho |
|-----|---------|
| EB-1 (4 docs) | /_PROEX/_(RAGs).../2025/EB-1/ |
| EB-2 NIW (11 docs) | /_PROEX/_(RAGs).../2025/EB-2 NIW - RAGs/ |
| Geral (Dhanasar, etc.) | /_PROEX/_(RAGs).../  |
| Pareceres da Qualidade | /_PROEX/_(RAGs).../2025/Pareceres da Qualidade.md |

---

## Comandos essenciais

```bash
# Subir o servidor
cd ~/Documents/OMNI/_IMIGRAÇÃO/Sistema\ Automatizado/petition-engine
npm run dev

# Ver estado do Git
git log --oneline -20
git status

# Ver regras ativas
cat data/error_rules.json | python3 -c "import sys,json; [print(f'{r[\"id\"]}: {r[\"rule_description\"][:60]}') for r in json.load(sys.stdin)]"

# Ver sistemas
cat data/systems.json | python3 -c "import sys,json; [print(f'{s[\"id\"]}: {s[\"system_name\"]}') for s in json.load(sys.stdin)]"

# Ver clientes
cat data/clients.json | python3 -c "import sys,json; [print(f'{c[\"id\"]}: {c[\"name\"]}') for c in json.load(sys.stdin)]"

# Testar API
curl -s localhost:3000/api/dashboard | python3 -m json.tool
curl -s localhost:3000/api/errors | python3 -m json.tool
curl -s localhost:3000/api/systems | python3 -m json.tool
```

---

## Conceitos-chave que o Paulo usa

| Termo | Significado |
|-------|-------------|
| Separation of Concerns | Dois terminais Claude revisando o trabalho um do outro |
| Cirúrgico | Apontamento específico (seção X, página Y) |
| Cascalho | Rejeitar/refazer bloco inteiro |
| Indutivo | Do particular pro geral (erro específico → regra universal) |
| Squad / Esquadrão | Os agentes do AIOS trabalhando juntos |
| Ikaro com K | Benchmark visual do Business Plan (67 páginas) |
| Anteprojeto | Pré-projeto com 3 endeavors + 3 SOC codes pra escolha |
| Projeto-Base | Projeto completo após seleção de endeavor |

---

*Última atualização: 25 de março de 2026*
*Autor: Claude Opus 4.6 + Paulo Lima*
