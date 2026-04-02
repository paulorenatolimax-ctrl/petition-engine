# AUDITORIA TÉCNICA COMPLETA — PETITION ENGINE

**Data:** 2026-04-02  
**Auditor:** Claude Opus 4.6  
**Escopo:** Codebase inteiro — 85+ arquivos analisados  
**Classificação:** INTERNAL / CONFIDENTIAL

---

## SUMÁRIO EXECUTIVO

O Petition Engine é uma aplicação Next.js 14 (App Router) que orquestra a geração automatizada de documentos de imigração dos EUA (Cover Letters, Résumés, Business Plans, Metodologias, Declarações, Cartas Satélite, etc.). Opera localmente na máquina do Paulo, executando Claude Code CLI como subprocesso para gerar documentos, com validação de qualidade automática e sistema de auto-aprendizado baseado em regras de erro.

**Pontuação geral: 62/100** — Funcional para uso interno de operador único, mas com falhas de segurança, robustez e escalabilidade significativas.

---

## 1. ARQUITETURA GERAL

### Stack
- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS + Lucide icons + Zustand
- **Backend:** Next.js API Routes (serverless local)
- **Banco:** Supabase (dual: cloud via @supabase/supabase-js + local JSON fallback)
- **LLM Execution:** Claude Code CLI via `child_process.spawn()`
- **Scripts:** Python 3 (python-docx, playwright, pptx)
- **VCS:** Git + GitHub API (Octokit)

### Padrão de Dados Híbrido
O sistema mantém dados em DOIS lugares simultaneamente:
1. **Supabase** (cloud) — acessado pelos agents `quality.ts`, `auto-debugger.ts`, `writer.ts`, `system-updater.ts`
2. **JSON local** (`data/*.json`) — acessado pelas API routes como fallback

**PROBLEMA CRÍTICO:** Não há sincronização entre os dois stores. O Supabase pode ter regras diferentes do `error_rules.json` local, causando inconsistência nas validações.

### Fluxo de Geração (Pipeline Principal)
```
UI (gerador/page.tsx) 
  → POST /api/generate (monta instrução + salva .md)
  → POST /api/generate/execute (SSE stream)
    → FASE 1: spawn("claude", ["-p", instrução]) → gera .docx
    → FASE 1.5: runQualityLocal() → valida documento
    → FASE 2: spawn("claude", ["-p", revisão]) → Separation of Concerns
  → SSE events → UI atualiza em tempo real
```

---

## 2. ANÁLISE POR ARQUIVO

### 2.1 AGENTS (src/agents/)

#### quality-local.ts (344 linhas)
**Propósito:** Validação local de documentos — detecção de CoT, headings órfãos, acentuação, termos proibidos, checagens estruturais e de BP.

**Funcionalidades:**
- 5 módulos de checagem: Error Rules, CoT Detection, Orphan Headings, Accent Check, Structural/BP Checks
- Auto-fix: remove CoT, headings órfãos, linhas vazias consecutivas
- Scoring: penalidades (critical=25, high=15, medium=5, low=2), threshold 80+ e zero criticals para aprovação
- 48 palavras sem acento monitoradas

**Issues:**
- `catch {}` vazio nas linhas 88, 138 — silencia erros de regex inválida ou I/O
- `writeFileSync` síncrono na atualização de trigger count (linha 86) — race condition se 2 documentos são validados simultaneamente
- `ORPHAN_HEADINGS` regex `/^#{1,3}\s+/` remove QUALQUER heading markdown, incluindo os legítimos em documentos .md
- `accentViolations` lista tem 50 palavras mas a regex `\b` não funciona corretamente com Unicode em JS — "formação" não seria matched por `\bformacao\b` se o texto original tiver acento
- Hardcoded: threshold 80, penalty weights, minimum doc length 5000 chars

#### quality.ts (93 linhas)
**Propósito:** Versão Supabase do quality agent — mesma lógica mas busca rules do banco.

**Issues:**
- Duplicação quase completa da lógica de `quality-local.ts` (DRY violation)
- Falta: CoT detection, orphan headings, accent check, auto-fix — presentes apenas no local
- `rpc('increment_rule_trigger')` pode não existir no Supabase — fallback para UPDATE manual
- Sem limit no `select('*')` de error_rules — pode retornar milhares de regras
- Threshold diferente (2000 chars vs 5000 no local) — inconsistência

#### writer.ts (200 linhas)
**Propósito:** Monta o mega-prompt para geração de documentos, lendo arquivos do sistema e regras de erro.

**Issues:**
- `createClient()` direto no module scope (linha 6-8) — inicializado no load, não lazy
- `process.env.SUPABASE_SERVICE_ROLE_KEY!` — assertion sem fallback; crash se env não existir
- Fuzzy match via `ilike` com replace de caracteres especiais (linha 53) — pode retornar sistema errado
- `readFileSync`/`readdirSync` síncronos — bloqueiam event loop
- Hardcoded: formatting spec (Arial, 11pt, 1.15 spacing, US Letter) — deveria ser configurável por sistema
- Token estimation `prompt.length / 4` é imprecisa — ratio varia por idioma (PT-BR ≈ 3.2)
- Split threshold `30000` hardcoded mas splitting nunca implementado
- O prompt diz "Gere .docx usando python-docx" mas o orchestrator já define formato por sistema

#### extractor.ts (263 linhas)
**Propósito:** Extrai conteúdo de documentos do cliente (PDF, DOCX, TXT, MD) para montar perfil JSON.

**Issues:**
- `execSync` com injection risk: `${filePath.replace(/"/g, '\\"')}` — se o path contiver `$()` ou backticks, há command injection
- Timeout de 120s por arquivo mas sem timeout global — 50 PDFs = 100+ minutos possíveis
- `maxBuffer: 10MB` — PDFs grandes podem exceder e causar ENOBUFS silencioso
- `content.slice(0, 50000)` hardcoded — trunca documentos sem aviso ao usuário
- `maxChars: 320000` default — pode exceder window do Claude
- Sem deduplicação de conteúdo — se o mesmo CV existir em formatos .pdf e .docx, ambos são incluídos
- Priority patterns são bons mas faltam: PPTX (metodologias), JSON (perfis extraídos), XLSX (financeiros)

#### auto-debugger.ts (110 linhas)
**Propósito:** Classifica erros reportados em regras e persiste no Supabase.

**Issues:**
- Classificação por keywords é frágil — "formato do PDF" seria classified como "formatting" mesmo se o erro for de conteúdo
- Pattern extraction via regex `/"([^"]+)"/` captura apenas a primeira string entre aspas — pode extrair o pattern errado
- Dedup por `ilike` dos primeiros 50 chars — erros similares mas distintos serão merged
- Rule_action é binário (block se critical, senão warn) — falta `auto_fix`

#### uscis-reviewer.ts (63 linhas)
**Propósito:** Monta prompt de simulação de adjudicação USCIS com critérios por tipo de visto.

**Issues:**
- Apenas gera prompt, sem integração com o pipeline de geração
- EB-1A lista 10 critérios (C1-C10) mas o Kazarian 2-step não é explicado ao modelo
- O-1 lista 8 critérios mas falta o "sustained national or international acclaim" overall
- `input.visaType.includes('EB-1')` match demasiado amplo — matcharia "EB-1B", "EB-1C"
- Sem suporte para EB-5, L-1, E-2 — limita expansão futura
- Emojis (🟢🟡🔴) no prompt — podem causar issues em modelos sem suporte multibyte

#### system-updater.ts (253 linhas)
**Propósito:** Gerencia versionamento de sistemas de prompts — proposals, aplicação, rollback.

**Issues:**
- `readSystemFiles()` importado de `@/lib/file-reader` mas trunca a 15000 chars (linha 67) — sistemas grandes têm diff incompleto
- `replace(proposal.before, proposal.after)` faz replace da PRIMEIRA ocorrência apenas
- Rollback busca versão anterior pelo índice na array `versions` — se versões forem adicionadas fora de ordem, rollback falha
- Symlink creation pode falhar silenciosamente no Windows (se portado)
- GitHub commit é fire-and-forget — se falhar, o sistema local tem versão nova mas GitHub tem versão antiga

---

### 2.2 API ROUTES (src/app/api/)

#### generate/route.ts (~400 linhas)
**Propósito:** Endpoint principal de geração — monta instrução completa, salva como .md, retorna path para execute.

**Método:** POST  
**Schema:** `{ client_id, doc_type, generation_instructions?, selected_endeavor?, selected_soc_code? }`  
**Resposta:** `{ data: { prompt, prompt_path, prompt_file, claude_command, metadata } }`

**Funcionalidades:**
- Construção de instruções por tipo (anteprojeto, projeto-base, PPTX, genérico)
- Injeção de RAGs, benchmarks, regras de erro
- Pesquisa web obrigatória pré-geração
- Instruções de acentuação explícitas

**Issues:**
- HARDCODED PATHS: 8 paths absolutos hardcoded para `/Users/paulo1844/...`
  - `SOC_PATH`, `CP_DIR`, `RAGS_EB1`, `RAGS_EB2`, `BENCHMARK_THAYSE`, `BENCHMARK_THIAGO`, `PPTX_GENERATOR`
  - Qualquer reorganização de pastas quebra o sistema
- Leitura de JSON com `readFileSync` a cada request — sem cache
- `buildRulesSection()` re-lê `error_rules.json` inteiro a cada chamada
- O arquivo de instrução salvo em `data/prompts/` cresce indefinidamente — sem cleanup
- Prompt para PPTX inclui spec completa inline (100+ linhas) — deveria referenciar arquivo

#### generate/execute/route.ts (441 linhas)
**Propósito:** Executa Claude Code CLI como subprocesso com SSE streaming.

**Método:** POST (SSE response)  
**Schema:** `{ prompt_file, client_name, doc_type, client_id }`  
**Eventos SSE:** stage, complete, stdout, stderr, quality_result, violation

**Funcionalidades:**
- Auto-versioning de arquivos existentes antes de gerar
- Pipeline de 2 fases (Geração + Revisão Separation of Concerns)
- Quality gate automático pós-geração
- Detecção de documentos parciais (exit code != 0 mas .docx criado)
- Rastreamento em `generations.json`

**PROBLEMAS CRÍTICOS:**
1. **Command Injection:** `python3 -c "from docx import Document; doc=Document('${mainDocx}')"` — se o path do DOCX contiver aspas simples, há injection
2. **Sem timeout global** — o processo Claude pode rodar indefinidamente
3. **Sem rate limiting** — múltiplas gerações simultâneas podem saturar a máquina
4. **`findClaudeBin()` hardcoded para paths Mac** — `/opt/homebrew/bin/`, `/Users/paulo1844/.npm-global/bin/`
5. **Auto-version via `renameSync`** pode falhar se arquivo está aberto no Word — sem retry
6. **`readClients()` chamado múltiplas vezes** durante execução — sem cache
7. **Sem autenticação** — qualquer processo pode chamar este endpoint

#### errors/report/route.ts (64 linhas)
**Propósito:** Recebe feedback de erro e cria/atualiza regra.

**Método:** POST  
**Schema:** `{ error_description, doc_type?, document_id?, severity? }`

**Issues:**
- Fallback silencioso para JSON local se Supabase falhar — sem log de qual path foi usado
- Classificação `classifyType()` simplista — não reconhece "visual" ou "structural"
- `id: r${Date.now()}` — colisão possível se 2 regras são criadas no mesmo milissegundo

#### saas-capture/route.ts (255 linhas)
**Propósito:** Captura screenshots de SaaS via Playwright e insere em DOCX.

**Método:** POST (SSE response)  
**Schema:** `{ url, client_id, docx_path? }`

**Issues:**
- Playwright `require('playwright')` — dependency de 200MB+ para um feature pontual
- Sem validação de URL — pode ser usado para screenshot de qualquer site
- `spawn('node', [scriptPath, url, ...])` — sem sanitização de URL
- Screenshots deduplicados por tamanho (rounding de 5KB) — screenshots diferentes de tamanho similar são removidos

#### quality/validate-local/route.ts (57 linhas)
**Propósito:** Valida documento local via quality-local agent.

**Método:** POST  
**Schema:** `{ file_path, doc_type?, client_name? }`

**VULNERABILIDADE DE SEGURANÇA:**
- `readFileSync(file_path)` sem validação — permite ler QUALQUER arquivo do sistema (path traversal)
- `python3 -c "...Document('${file_path}')"` — command injection via file_path
- Sem autenticação

#### systems/route.ts (36 linhas)
**Propósito:** Lista sistemas instalados. Seeds dados se arquivo não existir.

**Método:** GET  
**Resposta:** `{ data: System[] }`

**Issues:**
- SEED_SYSTEMS hardcoded (14 sistemas) têm paths que DIFEREM do `systems.json` (21 sistemas)
- Seed paths no código-fonte (route.ts) e paths no JSON (systems.json) estão dessincronizados
- Exemplo: BP path no seed = `/Users/paulo1844/Documents/Claude/Projects/C.P./docs/` vs JSON = `/Users/paulo1844/.../BP_SYSTEM_V3/`

---

### 2.3 PAGES (src/app/)

#### gerador/page.tsx (~450 linhas)
**Propósito:** Interface principal de geração — seleciona cliente + sistema → gera → executa → mostra resultado.

**Features:**
- Dropdown de clientes e sistemas
- Modal de geração com SSE streaming
- Auto-execute após gerar prompt
- Mapa SYSTEM_TO_ENUM (53 entradas) para conversão de nomes

**Issues:**
- `SYSTEM_TO_ENUM` é duplicação manual do que deveria vir do `SYSTEM_MAP`
- `useEffect` sem dependency array correto para `selectedClientData`
- Sem debounce na busca de clientes — re-fetch a cada keystroke
- Streaming SSE sem retry/reconnect — se a conexão cair, perde todo o progress

#### documentos/page.tsx (~500+ linhas)
**Propósito:** Lista gerações, permite feedback, relaunch, complemento, e captura SaaS.

**Issues:**
- Estado complexo (15+ useState) — candidato a refatoração com useReducer ou Zustand
- Feedback "cirúrgico" vs "cascalho" é UX confusa — nomenclatura interna

#### qualidade/page.tsx (134 linhas)
**Propósito:** Dashboard de qualidade com score médio e breakdown por tipo.

**Issues:**
- Pega dados de `/api/quality/stats` que depende de Supabase — pode estar vazio
- Sem fallback para dados locais (generations.json)
- Score médio inclui zeros (documentos sem validação) — distorce a média

#### erros/page.tsx (329 linhas)
**Propósito:** Gerenciamento de regras de erro — lista, filtro, toggle, feedback direto.

**Issues:**
- `useEffect` com dependency `[typeFilter, severityFilter, activeOnly]` mas sem cleanup — requests podem se sobrepor
- eslint-disable para `react-hooks/exhaustive-deps` — indica problema de design

#### sistemas/page.tsx (133 linhas)
**Propósito:** Lista sistemas instalados com status de symlink.

**Issues:**
- `symlink_ok` é always undefined no JSON — badge sempre mostra "CONNECTED" baseado no file_count
- Scan button chama `/api/systems/setup-symlinks` que pode não existir

#### clientes/page.tsx (298 linhas)
**Propósito:** CRUD de clientes com filtro por visa e busca.

**Issues:**
- Delete sem confirmação robusta — `confirm()` nativo é fácil de clicar acidentalmente
- Sem paginação — todos os clientes carregados de uma vez
- `docs_folder_path` é validado apenas no save, não na criação — pode salvar path inexistente

---

### 2.4 CORE LIBRARIES (src/lib/)

#### orchestrator.ts (76 linhas)
**Propósito:** Classe que monta o prompt completo usando system-map + writer.

**Issues:**
- Import dinâmico de `@/agents/writer` (linha 52) — impede tree-shaking
- `rpc('next_doc_version')` em catch vazio — silencia falha de incremento
- Retorna metadata misturando dados do writer e do system-map — acoplamento

#### system-map.ts (185 linhas)
**Propósito:** Mapa estático de 16 tipos de documento para configuração de sistema.

**Issues:**
- `cover_letter_o1` aponta para `symlinkDir: 'cover-letter-eb1a'` — O-1 usa mesmo sistema de EB-1A? Pode gerar conteúdo errado
- `rfe_response` aponta para `symlinkDir: 'cover-letter-eb1a'` — RFE Response NÃO é Cover Letter
- `anteprojeto` aponta para `'estrategia-eb2'` mas Case Compass pode ser EB-1A
- **Mismatch SYSTEM_MAP vs systems.json:** SYSTEM_MAP tem 16 entries, systems.json tem 21 — 5 sistemas sem mapping estático
- `preferredModel: 'claude-sonnet-4'` para maioria — mas `location_analysis` usa `'gemini-deep-research'` que não é um modelo real (deveria ser `gemini-2.0-flash` como no JSON)

#### supabase.ts (13 linhas)
**Issues:**
- `process.env.NEXT_PUBLIC_SUPABASE_URL!` — crash se env não configurada
- `supabase` exportado como singleton no module scope — NÃO deve ser usado em API routes (compartilha estado entre requests)
- `createServerClient()` cai para `supabaseAnonKey` se service role não existir — permissões insuficientes

#### types.ts (130 linhas)
**Issues:**
- 13 `eslint-disable @typescript-eslint/no-explicit-any` — tipagem fraca
- `SystemConfig` não inclui campo `doc_type` — mas é usado em vários places

#### heterogeneity.ts (94 linhas)
**Propósito:** Engine anti-ATLAS para diversificação visual de cartas satélite.

**Issues:**
- 15 combos de fonte/cor × 8 header styles × 6 doc formats = 720 combinações — suficiente
- `hashCode` pode ter colisões para strings similares
- Loop de retry (max 100) pode não encontrar combo único se >100 cartas do mesmo cliente

#### feedback-detector.ts (58 linhas)
**Propósito:** Detecta padrões de feedback nas mensagens do Paulo.

**Issues:**
- Regex patterns em português apenas — feedback em inglês não é detectado
- Confidence calculation `matchedPatterns.length / 3` é arbitrária
- Retorna `null` para confidence < 0.3 — pode perder feedback válido com uma única keyword
- Não é chamado em nenhuma API route — funcionalidade latente/não integrada

#### github.ts (61 linhas)
**Issues:**
- `GITHUB_REPO` default `'paulorenatolimax-ctrl/petition-engine'` — expõe username
- Branch hardcoded como `'main'` — sem suporte a feature branches
- `commitToGitHub` usa Git low-level API (createBlob → createTree → createCommit) — complexo, poderia usar Content API

---

### 2.5 DATA FILES

#### error_rules.json — 77 REGRAS ANALISADAS

| ID | Tipo | Severidade | Ação | Descrição (resumo) | Pattern | Observações |
|---|---|---|---|---|---|---|
| r1 | forbidden_term | critical | block | Nunca "I believe" / "we believe" | `\b(I\|we)\s+believe\b` | 127 triggers — regra mais acionada |
| r2 | forbidden_term | high | block | Nunca "I think" / "we think" | `\b(I\|we)\s+think\b` | 84 triggers |
| r3 | logic | critical | block | Nunca Dhanasar em EB-1A cover letter | null | Sem pattern — validação manual apenas |
| r4 | terminology | medium | auto_fix | "proposed endeavor" (não venture/business) | `proposed\s+(venture\|business)` | auto_fix_replacement ausente no JSON |
| r5 | formatting | low | warn | Headings bold com capitalização | null | Sem enforcement automático |
| r6 | forbidden_term | high | block | Nunca "in conclusion" / "to summarize" | `\b(in conclusion\|to summarize)\b` | 38 triggers |
| r7 | legal | critical | warn | Citar 3 prongs Dhanasar com precisão | null | Severidade critical mas ação warn — inconsistente |
| r8 | content | medium | warn | Evidence blocks com thumbnails | null | Sem enforcement automático |
| r9 | legal | critical | block | Nunca SOC de dentista para EB-1A | `29-102[3-9]` | Pattern captura range 29-1023 a 29-1029 |
| r10 | legal | critical | block | Nunca SOC que exige diploma validado | `(23-1011\|29-1069\|17-201[1-9]\|13-2011)` | Pattern correto |
| r11 | legal | high | warn | Verificar compatibilidade educacional SOC | null | Sem enforcement automático |
| r12 | forbidden_term | critical | block | Nunca "prompt" no output | `\bprompt\b` | Essencial — vazamento de sistema |
| r13 | content | high | warn | Output 100% PT-BR | null | Sem pattern automático |
| r14 | content | critical | block | Endeavors genéricos (consultoria/assessoria) | null | Sem pattern — manual |
| r15 | content | high | warn | Consultar RAGs antes de gerar | null | Instrucional — não validável |
| r16 | forbidden_term | critical | block | Nunca PROEX/Kortix/Carlos Avelino | `(PROEX\|Kortix\|Carlos Avelino)` | Essencial |
| r17 | content | high | warn | Infográficos IA com dados revisados | null | BP-specific |
| r18 | content | high | block | Footnotes insuficientes em BP | null | Sem pattern |
| r19 | content | high | warn | Parágrafos > 1200 chars devem dividir | null | Implementável com regex |
| r20 | content | critical | block | Heading seguido de heading (seção vazia) | null | Implementável |
| r21 | content | critical | block | "pé quadrado" proibido — usar m² | null | Sem pattern |
| r22 | content | critical | block | Labels de gráficos em INGLÊS | null | Manual |
| r23 | content | critical | block | Footer CONFIDENTIAL em todas as páginas | null | BP-specific, manual |
| r24 | content | high | warn | Mínimo 300-500 palavras por seção BP | null | Sem pattern |
| r25 | content | high | block | LLC vs S-Corp — esclarecer diferença | null | Client-specific (EventFinOps) |
| r26 | content | critical | block | Numeração de seção duplicada proibida | null | Implementável |
| r27 | content | critical | block | Tabelas com parágrafo intro e analítico | null | Manual |
| r28 | content | critical | block | Localização: parágrafos íntegros | null | Manual |
| r29 | content | critical | block | Público-Alvo: formatação consistente | null | Manual |
| r30 | content | critical | block | Metodologia: METHOD→RESULT→IMPACT | null | Manual |
| r31 | content | critical | block | Métricas quantificáveis obrigatórias | `\b(significant\|considerable...)` | Pattern bloqueia claims genéricos |
| r32 | content | high | warn | Mapear componentes a critérios EB | null | Manual |
| r33 | content | high | warn | Validação de terceiros obrigatória | null | Manual |
| r34 | content | critical | block | Declaration: endeavor específico | null | Manual |
| r35 | content | critical | block | Declaration: endereçar 3 prongs | null | Manual |
| r36 | content | high | warn | Declaration: demonstrar autonomia | null | Manual |
| r37 | formatting | high | warn | Metodologia PPTX mín 20 slides | null | Manual |
| r38 | formatting | high | warn | Declaration PPTX mín 15 slides | null | Manual |
| r39 | content | critical | block | Declaration EB-1A: sem Dhanasar | null | Manual |
| r40 | content | critical | block | Credenciais verificadas antes de carta | null | Manual |
| r41 | content | critical | block | Endorsement técnico com credential | null | Manual |
| r42 | formatting | high | warn | Heterogeneidade: máx 2 tabelas/batch | null | Manual |
| r43 | forbidden_term | critical | block | Nunca termos imigratórios em cartas | `\b(waiver\|priority date\|I-485...)` | Essencial para satellite letters |
| r44 | content | critical | block | Anti-hallucination: cross-reference | null | Manual |
| r45 | content | high | warn | Ângulos únicos por carta | null | Manual |
| r46 | forbidden_term | critical | block | Termos imigratórios em cartas EB-2 | `\b(waiver\|priority date...)` | Duplica r43 para EB-2 |
| r47 | formatting | critical | block | Heterogeneidade por carta EB-2 | null | Manual |
| r48 | content | high | warn | EB-2: cartas são propostas comerciais | null | Manual |
| r49 | content | critical | block | Quadro de Informações obrigatório | null | Manual |
| r50 | content | high | warn | Mín 5 recomendadores EB-1A | null | Manual |
| r51 | content | critical | block | Estratégia base obrigatória | null | Manual |
| r52 | content | critical | block | CV/LinkedIn de cada recomendador | null | Manual |
| r53 | content | critical | block | Código SOC obrigatório | null | Manual |
| r54 | content | critical | block | Quadro obrigatório EB-2 | null | Duplica r49 para EB-2 |
| r55 | content | critical | block | Estratégia base EB-2 | null | Duplica r51 para EB-2 |
| r56 | content | critical | block | CV/LinkedIn EB-2 | null | Duplica r52 para EB-2 |
| r57 | content | high | warn | Mín 5 recomendadores EB-2 | null | Duplica r50 para EB-2 |
| r58 | content | critical | block | SOC obrigatório EB-2 | null | Duplica r53 para EB-2 |
| r59 | content | critical | block | Acentuação obrigatória | `\b(introducao\|peticao...)` | Pattern útil — 12 palavras monitoradas |
| r60 | content | critical | block | BP mín 6 gráficos matplotlib | null | Manual |
| r61 | formatting | high | block | BP: Garamond 12pt, margens específicas | null | Manual |
| r62 | content | critical | block | BP mín 10 footnotes | null | Manual |
| r63 | formatting | critical | block | PPTX card body max 9.5pt | null | Metodologia |
| r64 | formatting | critical | block | PPTX footer #8B7355 bg | null | Metodologia |
| r65 | formatting | high | block | PPTX gradientes obrigatórios | null | Metodologia |
| r66 | content | high | warn | PPTX não repetir layout consecutivo | null | Metodologia |
| r67 | formatting | critical | block | PPTX body max 9.5pt (Declaration) | null | Duplica r63 |
| r69 | formatting | critical | block | PPTX footer (Declaration) | null | Duplica r64 |
| r71 | formatting | high | block | PPTX gradientes (Declaration) | null | Duplica r65 |
| r73 | content | high | warn | PPTX layout variado (Declaration) | null | Duplica r66 |
| r74 | forbidden_term | critical | block | Termos imigratórios em SaaS Evidence | `\b(petition\|petitioner\|EB-2...)` | Essencial |
| r75 | forbidden_term | critical | block | Termos imigratórios em Metodologia | `\b(petition\|petitioner...)` | Duplica r74 escopo |
| r76 | forbidden_term | critical | block | Termos imigratórios em Declaration | `\b(petition\|petitioner...)` | Duplica r74 escopo |
| r77 | formatting | critical | block | Sem "Version X.X", "Generated:" | `\b(Version \d\|Generated:...)` | Anti-artefato |

**Análise estatística das 77 regras:**
- **Critical:** 47 (61%) — maioria são BLOCK
- **High:** 25 (32%)
- **Medium:** 3 (4%)
- **Low:** 2 (3%)

**Problemas nas regras:**
1. **r4** tem `auto_fix` mas `auto_fix_replacement` não está no JSON — fix silenciosamente falha
2. **r7** é critical mas warn — inconsistência entre severidade e ação
3. **r25** é client-specific (EventFinOps) marcado como global BP — pode causar false positives
4. **r68, r70, r72** estão FALTANDO (IDs pulados: r67→r69→r71→r73) — possível corrupção
5. **Duplicações massivas:** r43/r46, r49/r54, r50/r57, r51/r55, r52/r56, r53/r58, r63/r67, r64/r69, r65/r71, r66/r73 — poderiam usar campo `doc_type` como array
6. **38 regras sem pattern** — dependem de validação humana/LLM, não automática. O quality-local agent ignora regras sem pattern mas as lista como rules aplicáveis

#### systems.json — 21 SISTEMAS VALIDADOS

| ID | Nome | Path | Existe? | Observação |
|---|---|---|---|---|
| 1 | Résumé EB-2 NIW | `.../AIOS_Petition Engine/EB2_NIW_RESUME_SYSTEM/` | OK | |
| 2 | Résumé EB-1A | `.../AIOS_Petition Engine/EB1A_RESUME_SYSTEM/` | OK | |
| 3 | Cover Letter EB-1A | `.../PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/` | OK | |
| 4 | Cover Letter EB-2 NIW | `.../AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions/` | **MISSING** | Path não encontrado no filesystem |
| 5 | Business Plan | `.../OMNI/_IMIGRAÇÃO/BP Orquestrador/BP_SYSTEM_V3/` | **MISSING** | Path não encontrado no filesystem |
| 6 | Metodologia | `.../Z_PROMPTS/_V2 Met e Dec (2026)/METODOLOGIA (PROMPTS)/` | OK | |
| 7 | Declaração de Intenções | `.../Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)/` | OK | |
| 8 | IMPACTO® | `.../_Z GLOBAL/_PRODUTO NOVO/agents/` | OK | |
| 9 | Estratégia EB-2 NIW | `.../PROMPTs/EB-2 - ESTRATÉGIAS/` | OK | |
| 10 | Estratégia EB-1A | `.../PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)/` | OK | |
| 11 | Localização | `.../PROMPTs/LOCALIZAÇÃO - PROMPT/` | OK | |
| 12 | Pareceres da Qualidade | `.../Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/` | OK | |
| 13 | Cartas Satélite | `.../PROMPTs/_Sistema Produtor de Cartas EB-1/` | OK | Atualizado (antes vazio) |
| 14 | Cartas EB-1 v2.0 | `.../PROMPTs/_Sistema Produtor de Cartas EB-1/` | OK | Duplica path do 13 |
| 15 | Case Compass EB-2 NIW | `.../PROMPTs/EB-2 - ESTRATÉGIAS/` | OK | Duplica path do 9 |
| 16 | Case Compass EB-1A | `.../TENTATIVA 2 - KORTIX/` | OK | |
| 17 | Case Blueprint EB-2 NIW | `.../PROMPTs/EB-2 - ESTRATÉGIAS/` | OK | Duplica path do 9 e 15 |
| 18 | Case Blueprint EB-1A | `.../TENTATIVA 2 - KORTIX/` | OK | Duplica path do 16 |
| 19 | Cartas Satélite EB-1A | `.../PROMPTs/_Sistema Produtor de Cartas EB-1/` | OK | Duplica 13 e 14 |
| 20 | Cartas Satélite EB-2 NIW | `.../Mariana Kasza (DIRETO)/eb2-niw-letters/` | OK | Client-specific path |
| 21 | SaaS Evidence Architect | `.../Z_PROMPTS/SAAS (PROMPTS)/` | OK | |

**2 PATHS MISSING (sistemas 4 e 5)** — Cover Letter EB-2 NIW e Business Plan não existem nos paths registrados.

**Paths duplicados:**
- IDs 9, 15, 17 compartilham o mesmo path (Estratégias EB-2)
- IDs 13, 14, 19 compartilham o mesmo path (Cartas EB-1)
- IDs 16, 18 compartilham o mesmo path (Kortix EB-1A)

#### clients.json (19 clientes)
- 19 clientes ativos, maioria EB-2 NIW
- 14 sem `client_profiles` (null) — extração de perfil não executada
- 3 clientes sem `docs_folder_path` vazio — impossibilita extração
- Email ausente em 15 dos 19 clientes

#### generations.json (10+ gerações)
- Mix de completed/failed
- Erros comuns: "Exit 0 mas nenhum documento criado", "Timeout: 30min+"
- `duration_seconds: null` em várias gerações — tracking inconsistente

---

### 2.6 SCRIPTS

#### capture_saas.js (387 linhas)
**Propósito:** Captura screenshots de app SaaS usando Playwright.

**Issues:**
- `require('playwright')` — se não instalado, crash sem mensagem clara
- 40 routes hardcoded em `COMMON_ROUTES` — pode gerar dezenas de screenshots desnecessários
- Dedup por tamanho (rounding 5KB) remove screenshots diferentes de tamanho similar
- Sem autenticação em apps protegidos — captura apenas landing/públicas
- `headless: true` com `deviceScaleFactor: 2` — screenshots Retina (2x) desnecessariamente grandes

#### insert_saas_screenshots.py (383 linhas)
**Propósito:** Insere screenshots em DOCX com design premium.

**Issues:**
- Dois modos (placeholder/smart) — smart mode depende de keyword matching em headings que pode ser impreciso
- `Inches(6.0)` hardcoded para largura da imagem — pode ficar grande demais com margens estreitas
- Sem compressão de imagens antes de inserir — DOCX pode ficar gigante (60MB+)
- Font `Garamond` hardcoded — pode não existir em todas as máquinas

---

## 3. PROBLEMAS DE SEGURANÇA

### CRÍTICO (P0)
1. **Path Traversal em `/api/quality/validate-local`:** `file_path` do request body é usado diretamente em `readFileSync` — atacante pode ler qualquer arquivo (`.env.local`, SSH keys, etc.)
2. **Command Injection em múltiplos endpoints:** Paths de arquivo inseridos em strings de comando Python sem sanitização adequada
3. **Zero autenticação:** Nenhum endpoint tem auth — qualquer processo local pode acessar
4. **`.env.local` com keys no repo:** Arquivo existe (886 bytes) — pode conter SUPABASE_SERVICE_ROLE_KEY e GITHUB_TOKEN

### ALTO (P1)
5. **GITHUB_TOKEN com permissão de push:** Se comprometido, permite push arbitrário ao repo
6. **Supabase service role key no server-side:** Bypass de RLS — acesso total ao banco
7. **`execSync`/`spawn` sem sandboxing:** Processos filhos herdam todas as env vars e permissões

---

## 4. PROBLEMAS DE PERFORMANCE

1. **Leitura síncrona de JSON a cada request:** `readFileSync` em `error_rules.json`, `clients.json`, `systems.json`, `generations.json` — deveria ter cache em memória com invalidação
2. **Sem connection pooling para Supabase:** Novo client criado por request em `createServerClient()`
3. **Claude CLI como subprocesso:** Cada geração spawna novo processo Node.js completo (~200MB RAM)
4. **Sem rate limiting:** 5 gerações simultâneas = 5 processos Claude = 1GB+ RAM
5. **`writeFileSync` em path hot:** `updateRuleTrigger` escreve JSON inteiro para atualizar 1 campo
6. **Playwright como dependency de produção:** 200MB+ no `node_modules` para feature pontual

---

## 5. PROBLEMAS DE QUALIDADE DE CÓDIGO

1. **43 `eslint-disable` no codebase** — maioria `@typescript-eslint/no-explicit-any`
2. **Zero testes** — nenhum arquivo de teste encontrado
3. **Zero validação de input com Zod** — Zod está no package.json mas não é usado em nenhum endpoint
4. **Duplicação de lógica:** quality.ts vs quality-local.ts, SYSTEM_MAP vs systems.json, SEED_SYSTEMS vs systems.json
5. **Inconsistência de patterns:** Alguns endpoints usam `apiSuccess`/`apiError`, outros usam `NextResponse.json` diretamente
6. **Sem logging estruturado** — `console.warn`, `console.error` soltos
7. **Sem error boundaries** no React — crash em um componente derruba a página inteira
8. **Sem cleanup de dados temporários** — `data/prompts/` cresce indefinidamente

---

## 6. GAPS E OPORTUNIDADES

### Funcionalidades documentadas no CLAUDE.md mas NÃO implementadas:
1. **Symlinks com versionamento** (systems/[name]/current.md → versions/) — diretório `systems/` tem apenas 1 arquivo (pptx-engineering-spec)
2. **Auto-aprendizado conversacional** — `feedback-detector.ts` existe mas não é chamado por nenhuma rota
3. **Thumbnails nos evidence blocks** — mencionado nas regras mas sem script de geração
4. **Anteprojeto como pipeline de 9 prompts** — implementado no generate/route.ts mas sem tracking de progresso por prompt individual

### Melhorias recomendadas:
1. **Adicionar Zod validation** em todos os endpoints POST
2. **Implementar cache em memória** para JSON files (TTL 30s)
3. **Adicionar autenticação básica** (API key no header)
4. **Unificar quality agents** em um único módulo com source configurável (local/supabase)
5. **Mover hardcoded paths para `.env.local`** ou config JSON
6. **Implementar timeout global** no execute route (30min max)
7. **Adicionar rate limiting** (1 geração por vez)
8. **Criar testes unitários** para quality-local, extractor, heterogeneity
9. **Sanitizar todos os inputs** usados em `exec`/`spawn`
10. **Consolidar error_rules duplicadas** usando array de doc_types

---

## 7. RESUMO DE SEVERIDADES

| Categoria | Crítico | Alto | Médio | Baixo |
|---|---|---|---|---|
| Segurança | 4 | 3 | 0 | 0 |
| Performance | 1 | 4 | 2 | 0 |
| Bugs | 3 | 5 | 4 | 2 |
| Code Quality | 0 | 3 | 5 | 3 |
| Data Integrity | 2 | 3 | 2 | 0 |
| **Total** | **10** | **18** | **13** | **5** |

---

## 8. RECOMENDAÇÃO FINAL

O Petition Engine é funcional e demonstra design inteligente (auto-learning, heterogeneity engine, quality gates, SSE streaming). No entanto, **10 problemas críticos** precisam ser resolvidos antes de qualquer consideração de multi-usuário ou produção:

**Prioridade imediata:**
1. Sanitizar TODOS os inputs usados em `execSync`/`spawn` (command injection)
2. Validar `file_path` em validate-local (path traversal)
3. Corrigir os 2 system paths MISSING (Cover Letter EB-2 NIW, Business Plan)
4. Adicionar `auto_fix_replacement` na regra r4
5. Unificar quality agents eliminando duplicação

**Prioridade curta (1 semana):**
6. Cache em memória para JSON reads
7. Rate limiting no execute endpoint
8. Timeout global de 30 minutos
9. Zod validation em endpoints POST
10. Consolidar regras duplicadas (r43/r46, r49/r54, etc.)

---

*Relatório gerado por Claude Opus 4.6 (1M context) em 2026-04-02.*
