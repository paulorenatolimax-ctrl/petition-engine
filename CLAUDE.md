# PETITION ENGINE — Instruções para Claude Code

## ANTES DE QUALQUER COISA

Leia os arquivos abaixo NA ORDEM antes de escrever uma única linha de código:

1. `01_ARCHITECTURE.md` — Stack, estrutura do projeto, princípios
2. `02_SUPABASE.md` — Schema SQL completo (copiar e executar no SQL Editor)
3. `03_AGENTS.md` — Os 6 agentes do orquestrador (Extrator, Escritor, Qualidade, USCIS, Auto-Debugger, **System Updater**)
4. `04_API_ROUTES.md` — Todos os endpoints do back-end
5. `05_SYSTEMS_MAP.md` — Mapa de symlinks + **pipeline de 9 prompts do Anteprojeto** + **sistema de heterogeneidade anti-ATLAS para cartas**
6. `06_ERROR_RULES.md` — Sistema de error rules com **50 regras seed extraídas dos Pareceres da Qualidade**
7. `07_THUMBNAILS.md` — Scripts Python para geração e inserção de thumbnails no DOCX
8. `09_AUTO_LEARNING.md` — **CRÍTICO**: Sistema de auto-aprendizado conversacional (3 níveis: Error Rules, System Updates, Preferences). Cada interação com Paulo pode evoluir o sistema. Versionar, NUNCA sobrescrever.

O arquivo `08_FRONTEND.md` é para o Gemini/Antigravity construir o front-end. Claude Code NÃO precisa ler esse arquivo a menos que esteja implementando componentes React diretamente.

## REGRAS ABSOLUTAS

1. **NÃO recriar sistemas que já existem.** Os sistemas de geração (Cover Letter, Résumé, BP, etc.) já estão prontos como arquivos .md nas pastas do Paulo. O Petition Engine ORQUESTRA esses sistemas — não os reescreve.

2. **Usar SYMLINKS** para apontar para os sistemas nas pastas originais. Zero duplicação de arquivos.

3. **Cada fix/melhoria = commit no GitHub.** Nunca sobrescrever sem commit. Paulo precisa de rollback a qualquer momento.

4. **Versionar, não sobrescrever.** Quando um sistema evolui (v5.0 → v5.1), a versão anterior fica como backup. Symlink `current.md` aponta para a versão ativa. Rollback = mudar o symlink.

5. **Auto-aprendizado conversacional.** Quando Paulo dá feedback durante uma conversa, o Engine DEVE perguntar: "Quer que eu incorpore isso no sistema?" Se sim → propor diff → confirmar → commit no GitHub → nova versão.

6. **Scripts Python rodam local** na máquina do Paulo via `child_process.exec()` nas API routes. Não tentar rodar Python no Vercel.

7. **Supabase via MCP** quando disponível. Senão, usar `@supabase/supabase-js` standard.

8. **Dark mode sempre.** A interface é dark premium com accent teal/verde.

9. **Português brasileiro** em toda a interface. Comentários no código podem ser em inglês.

10. **Salvar direto nas pastas do Paulo.** Documentos gerados vão diretamente para a pasta do caso do cliente (`_PROEX/_2. MEUS CASOS/2026/[Nome do Cliente]/`). Sem download, sem arrastar.

11. **Cartas satélite com heterogeneidade visual.** Cada carta deve ter combinação única de fonte × cor × estrutura × formato para derrotar o ATLAS/ATA do USCIS. Ver `05_SYSTEMS_MAP.md` seção "Heterogeneidade Anti-ATLAS".

12. **Anteprojeto = pipeline de 9 prompts sequenciais.** NÃO é derivado do BP. É o oposto: vem ANTES do BP e o alimenta. Ver `05_SYSTEMS_MAP.md` seção "Pipeline de 9 Prompts".

## ESTRUTURA DO PROJETO

```
petition-engine/
├── .claude/                    ← VOCÊ ESTÁ AQUI
├── src/app/                    ← Next.js App Router (pages + API routes)
├── src/components/             ← React components (shadcn/ui + custom)
├── src/lib/                    ← Clients SDK (Supabase, Anthropic, Gemini, GitHub)
├── src/agents/                 ← Lógica dos 6 agentes
├── scripts/                    ← Python scripts (DOCX, thumbnails, PDF extraction)
├── systems/                    ← SYMLINKS para sistemas existentes (com versionamento)
│   └── [system-name]/
│       ├── current.md          ← symlink para versão ativa
│       ├── versions/           ← histórico de versões
│       │   ├── v5.0.md
│       │   ├── v5.1.md
│       │   └── changelog.md
│       └── meta.json           ← metadata do sistema
├── templates/                  ← Templates DOCX pré-formatados
├── error-rules/                ← Regras de erro commitadas (JSON)
└── .env.local                  ← Variáveis de ambiente
```

## ORDEM DE CONSTRUÇÃO

1. Setup do projeto (Next.js 14 + deps)
2. Schema Supabase (SQL) — incluir tabelas `system_updates` e `preferences`
3. Lib clients (supabase.ts, anthropic.ts, gemini.ts, github.ts)
4. API Routes (/api/clients, /api/generate, /api/quality, /api/errors, /api/systems, /api/systems/[name]/propose-update)
5. Agents (orchestrator.ts → extractor.ts → writer.ts → quality.ts → uscis-reviewer.ts → auto-debugger.ts → **system-updater.ts**)
6. Python scripts (extract_pdf.py, generate_docx.py, thumbnail_generator.py, quality_scanner.py)
7. Symlinks para systems/ (com versionamento)
8. Heterogeneity engine (para cartas satélite)
9. Feedback detector (detecção de feedback conversacional do Paulo)
10. Front-end (se necessário — o Antigravity faz a maior parte)
