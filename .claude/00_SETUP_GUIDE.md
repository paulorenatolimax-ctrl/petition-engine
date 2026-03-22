# GUIA DE SETUP — Petition Engine no Antigravity

## COMO ANTIGRAVITY + CLAUDE CODE FUNCIONAM JUNTOS

Pensa assim: o Antigravity é o **Gemini construindo o front-end** (React, telas, UI).
O Claude Code roda **dentro do terminal do Antigravity** e constrói o **back-end** (API routes, agentes, lógica).

Eles "conversam" porque **trabalham no mesmo repositório Git**:
- O Gemini/Antigravity cria os componentes React em `src/components/` e `src/app/`
- O Claude Code cria as API routes em `src/app/api/`, os agentes em `src/agents/`, os scripts Python em `scripts/`
- Ambos leem e escrevem no mesmo projeto → o Next.js junta tudo

```
ANTIGRAVITY (Gemini)          CLAUDE CODE (Terminal)
┌─────────────────────┐       ┌─────────────────────┐
│ Constrói front-end   │       │ Constrói back-end    │
│ - React components   │       │ - API routes         │
│ - Páginas (UI)       │       │ - Agentes TypeScript  │
│ - TailwindCSS        │       │ - Scripts Python      │
│ - Framer Motion      │       │ - Supabase schema     │
│ - Design system      │       │ - GitHub integration  │
└────────┬────────────┘       └────────┬────────────┘
         │                              │
         └──────── MESMO REPO GIT ──────┘
                        │
                   petition-engine/
```

Não existe API mágica entre eles. O ponto de integração é o **filesystem + Git**.

---

## PASSOS — Na ordem, sem pular

### PASSO 0: Salvar o projeto casey-predictor
Você já tem o casey-predictor rodando. Antes de mudar:
```bash
cd ~/casey-predictor   # (ou onde estiver o projeto)
git add -A && git commit -m "save state before petition-engine"
git push
```

### PASSO 1: Criar o repositório no GitHub
1. Vai em github.com → New Repository
2. Nome: `petition-engine`
3. Private → Create
4. NÃO inicializar com README (fica vazio)

### PASSO 2: Criar o projeto local
No terminal do Antigravity (ou qualquer terminal):
```bash
cd ~/Documents
npx create-next-app@14 petition-engine --typescript --tailwind --eslint --app --src-dir --no-import-alias
cd petition-engine
```

### PASSO 3: Conectar ao GitHub
```bash
git remote add origin https://github.com/SEU_USER/petition-engine.git
git push -u origin main
```

### PASSO 4: Copiar os arquivos de instrução
Os 9 arquivos de instrução que já criamos vão na pasta `.claude/` do projeto:
```bash
mkdir -p .claude
cp ~/Documents/C.P./petition-engine-claude-instructions/CLAUDE.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/01_ARCHITECTURE.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/02_SUPABASE.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/03_AGENTS.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/04_API_ROUTES.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/05_SYSTEMS_MAP.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/06_ERROR_RULES.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/07_THUMBNAILS.md .claude/
cp ~/Documents/C.P./petition-engine-claude-instructions/09_AUTO_LEARNING.md .claude/
```

**IMPORTANTE:** O arquivo `08_FRONTEND.md` é para o Gemini/Antigravity. Copia também pra referência:
```bash
cp ~/Documents/C.P./petition-engine-claude-instructions/08_FRONTEND.md .claude/
```

### PASSO 5: Criar o CLAUDE.md na raiz (para Claude Code encontrar)
```bash
cp .claude/CLAUDE.md ./CLAUDE.md
```
O Claude Code lê automaticamente o `CLAUDE.md` da raiz do projeto quando você abre uma conversa.

### PASSO 6: Configurar o .env.local
Cria o arquivo `.env.local` na raiz:
```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
ANTHROPIC_API_KEY=sua_chave_anthropic
GOOGLE_AI_API_KEY=sua_chave_gemini
GITHUB_TOKEN=seu_github_pat
GITHUB_OWNER=seu_github_user
GITHUB_REPO=petition-engine
```

### PASSO 7: Setup Supabase
1. Vai em supabase.com → New Project → `petition-engine`
2. Espera criar
3. Abre o SQL Editor
4. Cola e executa o SQL do arquivo `.claude/02_SUPABASE.md`
5. Pega a URL e as keys (Settings → API) → coloca no `.env.local`

### PASSO 8: Abrir o projeto no Antigravity
1. No Antigravity, abre a pasta `~/Documents/petition-engine`
2. O Gemini vai reconhecer que é um projeto Next.js
3. No terminal integrado, o Claude Code vai ler o CLAUDE.md automaticamente

### PASSO 9: Dar o primeiro comando ao Claude Code
No terminal do Antigravity, abre o Claude Code e diz:

```
Leia todos os arquivos em .claude/ na ordem (01 até 09).
Depois, comece pela ORDEM DE CONSTRUÇÃO do CLAUDE.md:
1. Instalar todas as dependências do package.json (01_ARCHITECTURE.md)
2. Criar os lib clients (supabase.ts, anthropic.ts, gemini.ts, github.ts)
3. Criar as API routes (04_API_ROUTES.md)
4. Criar os agentes (03_AGENTS.md)
NÃO construir o front-end — o Antigravity cuida disso.
```

### PASSO 10: Dar as instruções de front-end ao Antigravity
No chat do Antigravity (Gemini), diz:

```
Leia o arquivo .claude/08_FRONTEND.md. Ele contém o design system
completo, wireframes, componentes, e todas as especificações visuais
para o Petition Engine. Construa o front-end seguindo essas specs.
Dark mode premium com accent teal/verde. Português brasileiro.
```

---

## FLUXO DE TRABALHO DEPOIS DO SETUP

```
1. Paulo pede algo ao Claude Code no terminal
   → Claude Code cria/edita arquivos do back-end
   → Faz commit no GitHub automaticamente

2. Paulo pede algo visual ao Antigravity (Gemini)
   → Gemini cria/edita componentes React
   → Paulo revisa e aceita

3. `npm run dev` roda o Next.js local
   → Front-end (Gemini) + Back-end (Claude Code) juntos

4. Push pro GitHub → Vercel faz deploy automático
```

---

## CHECKLIST RÁPIDO

- [ ] casey-predictor commitado e salvo
- [ ] Repositório `petition-engine` criado no GitHub
- [ ] Projeto Next.js 14 criado com `create-next-app`
- [ ] Repositório conectado ao GitHub
- [ ] 9 arquivos de instrução copiados para `.claude/`
- [ ] CLAUDE.md copiado para a raiz
- [ ] .env.local criado com todas as keys
- [ ] Projeto Supabase criado e schema SQL executado
- [ ] Projeto aberto no Antigravity
- [ ] Primeiro comando dado ao Claude Code
- [ ] Instruções de front-end passadas ao Antigravity
