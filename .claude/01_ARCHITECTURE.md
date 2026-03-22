# 01 — ARQUITETURA DO PETITION ENGINE

## Stack Tecnológico

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Front-end | Next.js 14 + TailwindCSS + Framer Motion + shadcn/ui | Interface do operador |
| Back-end | Next.js API Routes (TypeScript) + Scripts Python | Orquestração + geração de documentos |
| Banco de dados | Supabase (PostgreSQL + Storage + Auth) | Dados de clientes, documentos, regras de erro |
| LLM principal | Claude API (Anthropic SDK) | Geração de conteúdo (cover letters, résumés, BPs, etc.) |
| LLM pesquisa | Gemini API (Google AI SDK) | DeepResearch para análises de localização |
| Versionamento | GitHub (Octokit SDK) | Commits automáticos a cada fix, rollback |
| Deploy | Vercel (auto-deploy via GitHub) | Front-end em produção |
| Execução local | Node.js + Python 3.11+ | Scripts de DOCX, thumbnails, PDF parsing |

## Princípio Central

Os **sistemas de geração já existem** como coleções de arquivos .md nas pastas do Paulo. O Petition Engine é um **orquestrador** — ele lê esses arquivos em runtime, monta o prompt correto, chama o LLM, e gera o DOCX final.

```
SISTEMAS EXISTENTES (.md files)     PETITION ENGINE
┌──────────────────────┐            ┌──────────────────┐
│ Cover Letter EB-1A v5│──symlink──▶│                  │
│ Cover Letter EB-2 v3 │──symlink──▶│   ORQUESTRADOR   │──▶ Claude API ──▶ DOCX
│ Résumé EB-1A System  │──symlink──▶│                  │
│ Metodologia v2.1     │──symlink──▶│   Lê .md files   │
│ Declaração v2.1      │──symlink──▶│   Monta prompt   │
│ IMPACTO® 6 agents    │──symlink──▶│   Chama LLM      │
│ Estratégia EB-2 (9p) │──symlink──▶│   Gera DOCX      │
│ Estratégia EB-1A     │──symlink──▶│   Valida          │
│ Localização          │──symlink──▶│                  │
│ Quality Notes        │──symlink──▶│                  │
└──────────────────────┘            └──────────────────┘
```

## Dependências (package.json)

```json
{
  "name": "petition-engine",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.45.0",
    "@anthropic-ai/sdk": "^0.30.0",
    "@google/generative-ai": "^0.21.0",
    "octokit": "^4.0.0",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.400.0",
    "date-fns": "^3.6.0",
    "zustand": "^4.5.0",
    "zod": "^3.23.0",
    "react-hot-toast": "^2.4.0",
    "swr": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Dependências Python (scripts/requirements.txt)

```
python-docx==1.1.2
pdfplumber==0.11.4
PyMuPDF==1.24.0
pdf2image==1.17.0
Pillow==10.4.0
```

**Nota:** `pdf2image` requer `poppler-utils` instalado no sistema. No macOS: `brew install poppler`.

## Estrutura de Pastas

```
petition-engine/
├── .claude/
│   ├── CLAUDE.md
│   ├── 01_ARCHITECTURE.md      ← este arquivo
│   ├── 02_SUPABASE.md
│   ├── 03_AGENTS.md
│   ├── 04_API_ROUTES.md
│   ├── 05_SYSTEMS_MAP.md
│   ├── 06_ERROR_RULES.md
│   ├── 07_THUMBNAILS.md
│   └── 08_FRONTEND.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── globals.css
│   │   ├── clientes/
│   │   │   ├── page.tsx                # Lista de clientes
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Perfil do cliente (abas)
│   │   ├── gerador/
│   │   │   └── page.tsx                # Grid de botões de geração
│   │   ├── qualidade/
│   │   │   └── page.tsx                # Relatórios QA
│   │   ├── erros/
│   │   │   └── page.tsx                # Kanban de erros & fixes
│   │   ├── sistemas/
│   │   │   └── page.tsx                # Gestão dos sistemas instalados
│   │   └── api/
│   │       ├── clients/
│   │       │   └── route.ts
│   │       ├── generate/
│   │       │   └── route.ts
│   │       ├── quality/
│   │       │   └── route.ts
│   │       ├── errors/
│   │       │   └── route.ts
│   │       └── systems/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui (Button, Card, Badge, Dialog, etc.)
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCards.tsx
│   │   │   └── RecentClients.tsx
│   │   ├── client/
│   │   │   ├── ClientForm.tsx
│   │   │   ├── DocumentsTab.tsx
│   │   │   ├── EvidenceTab.tsx
│   │   │   ├── SatelliteLettersTab.tsx
│   │   │   └── HistoryTab.tsx
│   │   ├── generator/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── GenerationModal.tsx
│   │   │   └── ProgressLog.tsx
│   │   ├── quality/
│   │   │   ├── QualityReport.tsx
│   │   │   └── ScoreBadge.tsx
│   │   └── errors/
│   │       ├── ErrorKanban.tsx
│   │       ├── ErrorCard.tsx
│   │       └── RulesTable.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts                 # createClient + helpers
│   │   ├── anthropic.ts                # Anthropic SDK wrapper
│   │   ├── gemini.ts                   # Google AI SDK wrapper (DeepResearch)
│   │   ├── github.ts                   # Octokit wrapper (commit, revert)
│   │   ├── orchestrator.ts             # Lógica central: qual agente chamar, em que ordem
│   │   ├── file-reader.ts              # Lê .md files dos sistemas via filesystem
│   │   ├── python-runner.ts            # Executa scripts Python via child_process
│   │   └── types.ts                    # TypeScript types compartilhados
│   │
│   └── agents/
│       ├── extractor.ts                # Agente Extrator (intake de docs do cliente)
│       ├── writer.ts                   # Agente Escritor (geração via Claude API)
│       ├── quality.ts                  # Agente de Qualidade (validação automatizada)
│       ├── uscis-reviewer.ts           # Agente Revisor USCIS (simulação de oficial)
│       └── auto-debugger.ts            # Agente Auto-Debugger (fix → commit → deploy)
│
├── scripts/
│   ├── extract_pdf.py                  # Extração de texto de PDFs
│   ├── generate_docx.py                # Geração de DOCX formatado com python-docx
│   ├── thumbnail_generator.py          # Gera thumbnails das evidências (pdf2image)
│   ├── docx_inserter.py                # Insere thumbnails no DOCX
│   ├── quality_scanner.py              # Scanner automatizado de qualidade
│   └── requirements.txt
│
├── systems/                            # SYMLINKS (criados pelo setup)
│   └── (ver 05_SYSTEMS_MAP.md)
│
├── templates/                          # Templates DOCX pré-formatados
│   └── (ver 07_THUMBNAILS.md)
│
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Variáveis de Ambiente (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Claude API
ANTHROPIC_API_KEY=

# Gemini
GEMINI_API_KEY=

# GitHub
GITHUB_TOKEN=
GITHUB_REPO=paulo1844/petition-engine
GITHUB_BRANCH=main

# Caminhos locais
LOCAL_SYSTEMS_BASE=/Users/paulo1844/Documents
LOCAL_CLIENTS_BASE=/Users/paulo1844/Documents/CLIENTES
LOCAL_OUTPUTS_BASE=/Users/paulo1844/Documents/OUTPUTS

# LLM Config
DEFAULT_MODEL=claude-sonnet-4-20250514
OPUS_MODEL=claude-opus-4-20250115
GEMINI_MODEL=gemini-2.0-flash
MAX_TOKENS=128000
QUALITY_THRESHOLD=90
```
