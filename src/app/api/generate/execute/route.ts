import { NextRequest } from 'next/server';
import { execSync, spawn } from 'child_process';
import { readFileSync, existsSync, readdirSync, mkdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';

const SOC_PATH = '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md';
const QUALITY_PATH = '/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md';
const EB1A_SYSTEM_PATH = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5';
const INSERT_THUMBNAILS_PATH = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/insert_thumbnails.py';
const ORCHESTRATOR_SPEC_PATH = path.join(process.cwd(), 'systems', 'cover-letter-eb1a-orchestrator', 'ORCHESTRATOR_COVER_LETTER_EB1A.md');
const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');
const GENERATIONS_FILE = path.join(process.cwd(), 'data', 'generations.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readGenerations(): any[] {
  if (!existsSync(GENERATIONS_FILE)) return [];
  try { return JSON.parse(readFileSync(GENERATIONS_FILE, 'utf-8')); } catch { return []; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeGenerations(gens: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { writeFileSync: wfs } = require('fs');
  wfs(GENERATIONS_FILE, JSON.stringify(gens, null, 2), 'utf-8');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function upsertGeneration(gen: any) {
  const gens = readGenerations();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idx = gens.findIndex((g: any) => g.id === gen.id);
  if (idx >= 0) gens[idx] = { ...gens[idx], ...gen };
  else gens.push(gen);
  writeGenerations(gens);
}

// Resolve absolute path to claude binary (cached)
let _claudeBin: string | null = null;
function findClaudeBin(): string | null {
  if (_claudeBin) return _claudeBin;
  const candidates = [
    '/Users/paulo1844/.npm-global/bin/claude',
    `${process.env.HOME}/.npm-global/bin/claude`,
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
    `${process.env.HOME}/.claude/bin/claude`,
  ];
  for (const p of candidates) {
    if (existsSync(p)) { _claudeBin = p; return p; }
  }
  // Fallback: try which
  try {
    const resolved = execSync('which claude', { encoding: 'utf-8' }).trim();
    if (resolved && existsSync(resolved)) { _claudeBin = resolved; return resolved; }
  } catch {}
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readClients(): any[] {
  if (!existsSync(CLIENTS_FILE)) return [];
  return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8'));
}

function findNewDocx(dir: string, afterMs: number): string[] {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.docx') || f.endsWith('.pptx') || f.endsWith('.md'))
      .filter(f => !f.startsWith('REVIEW_') && !f.startsWith('.'))
      .map(f => path.join(dir, f))
      .filter(f => { try { return statSync(f).mtimeMs > afterMs; } catch { return false; } });
  } catch { return []; }
}

function autoVersionExisting(dir: string) {
  /**
   * Auto-version: if output files already exist, rename them to V1, V2, etc.
   * So the new generation doesn't overwrite previous work.
   */
  if (!existsSync(dir)) return;
  try {
    const files = readdirSync(dir).filter(f =>
      (f.endsWith('.docx') || f.endsWith('.pptx') || f.endsWith('.md') || f.endsWith('.json')) &&
      !f.startsWith('REVIEW_') && !f.startsWith('.') && !f.includes('_V')
    );
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const ext = path.extname(f);
      const base = f.slice(0, -ext.length);
      // Find next version number
      let v = 1;
      while (existsSync(path.join(dir, `${base}_V${v}${ext}`))) v++;
      const versionedPath = path.join(dir, `${base}_V${v}${ext}`);
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { renameSync } = require('fs');
        renameSync(fullPath, versionedPath);
      } catch {}
    }
  } catch {}
}

function runClaude(
  claudeBin: string,
  instruction: string,
  onStdout?: (chunk: string) => void,
  onStderr?: (chunk: string) => void,
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(claudeBin, [
      '-p', instruction,
      '--allowedTools', 'Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch',
    ], {
      shell: false,
      env: { ...process.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d: Buffer) => {
      const chunk = d.toString();
      stdout += chunk;
      if (onStdout) onStdout(chunk);
    });
    proc.stderr.on('data', (d: Buffer) => {
      const chunk = d.toString();
      stderr += chunk;
      if (onStderr) onStderr(chunk);
    });
    proc.on('close', (code: number | null) => resolve({ code: code ?? 1, stdout, stderr }));
    proc.on('error', (err: Error) => resolve({ code: 1, stdout: '', stderr: `spawn error: ${err.message}` }));
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COVER LETTER EB-1A MULTI-PHASE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════

const TRANSVERSAL_RULES = `
## REGRAS INVIOLÁVEIS (INCLUIR EM TODO PROMPT)

### PROTOCOLO DE INTERAÇÃO (8 regras):
R1: NUNCA avançar sem ter lido TODOS os arquivos necessários
R3: Listar o que leu ANTES de escrever (confirmação de leitura)
R4: NUNCA gerar critério inteiro com 9+ evidências de uma vez — dividir em partes
R5: Auto-check de densidade contra benchmarks (Carlos Avelino ~72pg, Bruno Cipriano ~27pg)
R6: Inventário exaustivo com contagem de evidências, tabelas, subseções
R7: Validação mecânica antes de entregar (forbidden content, evidence bold, cores, borders)
R8: Buscar nas evidências do cliente — NUNCA inventar dados

### FORBIDDEN CONTENT (11 categorias — ZERO TOLERANCE):
Cat 0:  NUNCA "satisfeito/satisfaz/satisfies" sobre critérios (juízo de valor)
Cat 1:  NUNCA nomes proibidos (PROEX, Carlos Avelino, Bruno Cipriano, Renato Silveira, "Loper Light")
Cat 2:  NUNCA 3ª pessoa no corpo argumentativo ("o beneficiário") — SEMPRE 1ª pessoa ("apresento", "meu")
Cat 3:  NUNCA seção explícita "Objeções Antecipadas" — costurar no texto argumentativo
Cat 3B: NUNCA "jurídico"/"adjudicativo"/"independentes"/"Ev." — usar "regulatório"/"probatório"/"Evidence"
Cat 3C: NUNCA linguagem de existência para empresas planejadas (NOT YET established)
Cat 4:  NUNCA azul (#0000FF proibido), evidence block SEMPRE antes do texto argumentativo
Cat 5:  NUNCA Currículo Lattes, dados inventados, holdings inexistentes
Cat 6:  NUNCA afirmar Mukherji v. Miller como vinculante (é persuasivo, distrito de Nebraska)
Cat 7:  TUDO em português brasileiro (exceto: INA §, C.F.R. §, Kazarian, Mukherji, USCIS, O*NET, EB-1A, I-140, Step 1/2)
Cat 8:  Proporções: Intro 8-18%, Step 1 35-55%, Step 2 ≥25% (mín 30% ideal)
Cat 9:  ZERO artefatos de produção (EXPANSÃO:, TODO:, ████, contagem de palavras, meta-instruções)
Cat 10: ZERO URLs inventadas/truncadas
Cat 11: Substituição NUNCA é cega — verificar contexto antes de substituir

### FORMATAÇÃO OBRIGATÓRIA:
- Garamond 100% (NUNCA Arial, Calibri, Times)
- Margens: L=2.0cm, R=1.5cm, T=1.5cm, B=1.5cm
- Evidence blocks: fundo #FFF8EE (creme), Evidence XX em bold #2E7D32 (verde)
- Headers de seção: shading #D6E1DB (verde PROEX)
- Tabelas: bordas APENAS horizontais (ZERO bordas verticais)
- Footnotes: nativos do Word (<w:footnoteReference> + footnotes.xml), em português
- Imagens: wp:anchor + wrapSquare (NUNCA wp:inline — quebra tabelas)
- cantSplit=true em rows de tabelas (impede quebra de evidence blocks entre páginas)
- Footer: "EB-1A | I-140 Petition — Cover Letter [CLIENT NAME] | Page X of Y"
`;

interface PhaseResult {
  phase: string;
  label: string;
  success: boolean;
  duration_seconds: number;
  files_created: string[];
  error?: string;
}

interface CriterionInfo {
  id: string;       // e.g. "C1", "C5"
  name: string;     // e.g. "Premiações", "Contribuições Originais"
  evidences: number; // count of evidences
  sessions: number;  // 1, 2, or 3
}

function parseStrategicPlan(planPath: string): CriterionInfo[] {
  if (!existsSync(planPath)) return [];
  try {
    const content = readFileSync(planPath, 'utf-8');
    const criteria: CriterionInfo[] = [];

    // Parse criteria from the strategic plan — look for patterns like:
    // C1, C2, C3, etc. with evidence counts
    const criterionRegex = /C(\d+)\s*[-–—:]\s*([^\n|]+?)(?:\s*\|\s*(\d+)\s*evidências?)?/gi;
    let match;
    while ((match = criterionRegex.exec(content)) !== null) {
      const num = match[1];
      const name = match[2].trim();
      const evidences = parseInt(match[3] || '4', 10);
      const sessions = evidences >= 9 ? 3 : evidences >= 5 ? 2 : 1;
      criteria.push({ id: `C${num}`, name, evidences, sessions });
    }

    // If no criteria found via regex, try to find them in a table format
    if (criteria.length === 0) {
      const lines = content.split('\n');
      for (const line of lines) {
        const tableMatch = line.match(/\|\s*C(\d+)\s*\|\s*([^|]+)\s*\|\s*(\d+)/);
        if (tableMatch) {
          const num = tableMatch[1];
          const name = tableMatch[2].trim();
          const evidences = parseInt(tableMatch[3], 10);
          const sessions = evidences >= 9 ? 3 : evidences >= 5 ? 2 : 1;
          criteria.push({ id: `C${num}`, name, evidences, sessions });
        }
      }
    }

    return criteria;
  } catch {
    return [];
  }
}

async function runCoverLetterEB1APipeline(
  claudeBin: string,
  clientDocsPath: string,
  outputDir: string,
  clientName: string,
  send: (event: string, data: object) => void,
  genId: string,
  startTime: number,
): Promise<{
  success: boolean;
  phaseResults: PhaseResult[];
  allFiles: string[];
}> {
  const phasesDir = path.join(outputDir, 'phases');
  if (!existsSync(phasesDir)) mkdirSync(phasesDir, { recursive: true });

  const phaseResults: PhaseResult[] = [];
  const allFiles: string[] = [];
  let totalPhases = 10; // Will update after we know criteria count

  // Helper: run a single phase
  async function executePhase(
    phaseId: string,
    phaseLabel: string,
    instruction: string,
    phaseNum: number,
  ): Promise<PhaseResult> {
    const phaseStart = Date.now();
    const progressPct = Math.round((phaseNum / totalPhases) * 100);
    send('stage', { stage: 'phase', phase: phaseId, message: `FASE ${phaseId}: ${phaseLabel}`, progress: progressPct });
    send('stage', { stage: 'loading', phase: phaseId, message: `Iniciando fase ${phaseId}...` });
    upsertGeneration({ id: genId, current_phase: `phase_${phaseId}`, current_phase_label: phaseLabel });

    let lastChunkTime = Date.now();
    const result = await runClaude(claudeBin, instruction,
      (chunk) => {
        const now = Date.now();
        if (now - lastChunkTime > 8000) {
          const preview = chunk.trim().slice(0, 150).replace(/\n/g, ' ');
          if (preview) send('stage', { stage: 'stdout', phase: phaseId, message: preview });
          lastChunkTime = now;
        }
      },
      (chunk) => {
        const preview = chunk.trim().slice(0, 150);
        if (preview) send('stage', { stage: 'stderr', phase: phaseId, message: preview });
      },
    );

    const phaseDuration = Math.round((Date.now() - phaseStart) / 1000);
    const filesCreated = findNewDocx(phasesDir, phaseStart)
      .concat(findNewDocx(outputDir, phaseStart))
      .filter((v, i, a) => a.indexOf(v) === i);

    // Also check for JSON/MD outputs
    const extraFiles: string[] = [];
    for (const dir of [phasesDir, outputDir]) {
      if (existsSync(dir)) {
        try {
          readdirSync(dir)
            .filter(f => (f.endsWith('.json') || f.endsWith('.md')) && !f.startsWith('.'))
            .map(f => path.join(dir, f))
            .filter(f => { try { return statSync(f).mtimeMs > phaseStart; } catch { return false; } })
            .forEach(f => extraFiles.push(f));
        } catch {}
      }
    }

    const allCreated = [...filesCreated, ...extraFiles].filter((v, i, a) => a.indexOf(v) === i);

    const phaseResult: PhaseResult = {
      phase: phaseId,
      label: phaseLabel,
      success: result.code === 0,
      duration_seconds: phaseDuration,
      files_created: allCreated.map(f => path.basename(f)),
    };

    if (result.code !== 0) {
      phaseResult.error = `Exit code ${result.code}: ${result.stderr.slice(0, 300)}`;
      send('stage', { stage: 'error', phase: phaseId, message: `Fase ${phaseId} falhou (exit ${result.code}): ${result.stderr.slice(0, 200)}` });
    } else {
      send('stage', { stage: 'gen_complete', phase: phaseId, message: `Fase ${phaseId} concluida (${phaseDuration}s) — ${allCreated.length} arquivo(s)` });
    }

    allFiles.push(...allCreated);
    phaseResults.push(phaseResult);
    return phaseResult;
  }

  // ═══ PHASE 0: INVENTORY ═══
  await executePhase('0', 'Inventário e Mapeamento', `
Leia TODOS os arquivos na pasta do cliente: ${clientDocsPath}
Leia o sistema em: ${EB1A_SYSTEM_PATH}/
Leia ESPECIFICAMENTE: ${EB1A_SYSTEM_PATH}/SEMANTIC_CROSS_REFERENCE_MAP.md, ${EB1A_SYSTEM_PATH}/EVIDENCE_NAMING_CONVENTION.md

TAREFA 1: Criar inventário de evidências.
1. Liste TODOS os PDFs/DOCXs na pasta do cliente
2. Para cada arquivo, identifique tipo, critério(s) aplicável(is), título
3. Numere sequencialmente: Evidence 1, Evidence 2, ... Evidence N
4. Identifique O*NET code do résumé
5. Identifique critérios C1-C10 aplicáveis (mínimo 3)
6. Identifique cross-references (evidências que servem múltiplos critérios)
7. Salve: ${phasesDir}/_inventory.json

TAREFA 2: Construir mapa semântico.
Para CADA entidade mencionada nos documentos:
- Marcas registradas → número da evidência
- Pessoas (recomendadores, parceiros) → número da evidência
- Empresas/Organizações → número da evidência
- Veículos de mídia → números das evidências
- Credenciais/Diplomas → número da evidência
Salve: ${phasesDir}/_semantic_map.json

TAREFA 3: Relatório de gaps.
- Quais critérios têm evidências insuficientes (< 3)?
- Quais evidências não mapeiam a nenhum critério?
- O O*NET code é compatível com o perfil?
`, 1);

  // ═══ PHASE 0.5: STRATEGIC PLAN ═══
  await executePhase('0.5', 'Plano Estratégico', `
Leia: ${phasesDir}/_inventory.json
Leia: ${phasesDir}/_semantic_map.json
Leia: ${EB1A_SYSTEM_PATH}/CHECKLIST_PRE_PRODUCAO.md

TAREFA: Gerar Plano Estratégico.

O plano DEVE conter:
1. CRITÉRIOS SELECIONADOS: Quais C1-C10 serão argumentados + justificativa
   Para cada critério, incluir uma linha no formato:
   | C[N] | [Nome do Critério] | [quantidade] evidências |
2. CRITÉRIOS DESCARTADOS: Quais NÃO serão argumentados + por quê
3. MAPA DE EVIDÊNCIAS: Para cada critério, quais evidências e em qual ordem
4. CAMPO DEFINIDO: Field of endeavor + O*NET code + validação
5. RISCOS: Pontos fracos do caso + estratégia de mitigação
6. ESTIMATIVA: Páginas e palavras por critério (usar tabela de calibração)
7. CROSS-REFERENCES: Evidências compartilhadas entre critérios

Salve: ${phasesDir}/_strategic_plan.md
`, 2);

  // Parse strategic plan to determine criteria
  const strategicPlanPath = path.join(phasesDir, '_strategic_plan.md');
  let criteria = parseStrategicPlan(strategicPlanPath);

  // Fallback: if parsing failed, use default criteria set
  if (criteria.length === 0) {
    send('stage', { stage: 'warning', phase: '0.5', message: 'Nao foi possivel parsear criterios do plano estrategico — usando defaults C1,C3,C5,C8' });
    criteria = [
      { id: 'C1', name: 'Premiações', evidences: 4, sessions: 1 },
      { id: 'C3', name: 'Material Publicado', evidences: 6, sessions: 2 },
      { id: 'C5', name: 'Contribuições Originais', evidences: 8, sessions: 2 },
      { id: 'C8', name: 'Papel de Liderança', evidences: 5, sessions: 2 },
    ];
  }

  send('stage', { stage: 'info', phase: '0.5', message: `Criterios identificados: ${criteria.map(c => c.id).join(', ')} (${criteria.length} criterios, ${criteria.reduce((a, c) => a + c.sessions, 0)} sessoes)` });

  // Update total phases count: 0, 0.5, 1, [criteria sessions], 3A, 3B, 3C, 3.5, 4, 4.5, 5
  const criterionSessions = criteria.reduce((a, c) => a + c.sessions, 0);
  totalPhases = 2 + 1 + criterionSessions + 3 + 1 + 1 + 1 + 1; // 0, 0.5, 1, criteria, 3A/B/C, 3.5, 4, 4.5, 5
  let currentPhaseNum = 3; // Already did phases 0, 0.5

  // ═══ PHASE 1: PART I (INTRODUCTION) ═══
  await executePhase('1', 'Parte I — Introdução + Índice de Evidências', `
Leia o sistema em: ${EB1A_SYSTEM_PATH}/
Leia: ${EB1A_SYSTEM_PATH}/ARCHITECT_COVER_LETTER_EB1.md, ${EB1A_SYSTEM_PATH}/FORMATTING_SPEC.md, ${EB1A_SYSTEM_PATH}/FORBIDDEN_CONTENT.md, ${EB1A_SYSTEM_PATH}/LEGAL_FRAMEWORK_2026.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_strategic_plan.md
Leia evidências do cliente: ${clientDocsPath}

${TRANSVERSAL_RULES}

TAREFA: Gerar PARTE I da Cover Letter EB-1A em python-docx.

CONTEÚDO OBRIGATÓRIO:
1. CAPA (formato carta):
   - Data à direita (formato inglês)
   - 'To: U.S. Citizenship and Immigration Services / Immigration Officer'
   - Bloco metadata verde #D6E1DB: Ref, Petitioner/Beneficiary, Type, Classification, Field, O*NET

2. APRESENTAÇÃO (~3-4 parágrafos, 1ª pessoa):
   - Nome completo, campo, O*NET code
   - Trajetória profissional condensada
   - Quantos critérios (N) e quantas evidências (M)

3. ENQUADRAMENTO LEGAL (substancial):
   - INA § 203(b)(1)(A), 8 C.F.R. § 204.5(h)(3), Kazarian two-step, PA-2025-16, Mukherji v. Miller

4. ÍNDICE DE EVIDÊNCIAS:
   - Tabela: Evidence # | Título | Tipo | Critério(s)
   - [THUMBNAIL — Exhibit XX] placeholder para CADA evidência

5. SUMÁRIO DOS CRITÉRIOS

6. PARÁGRAFO DE TRANSIÇÃO para Step 1

Palavras alvo: 6.000-8.000
Salve: ${phasesDir}/CL_PART_I_Intro.docx
`, currentPhaseNum++);

  // ═══ PHASE 2: CRITERIA (1+ session per criterion) ═══
  for (const criterion of criteria) {
    if (criterion.sessions === 1) {
      // Single session for small criteria
      await executePhase(`2-${criterion.id}`, `Step 1 — ${criterion.id} ${criterion.name}`, `
Leia: ${EB1A_SYSTEM_PATH}/TEMPLATE_${criterion.id}_*.md (se existir)
Leia: ${EB1A_SYSTEM_PATH}/FORMATTING_SPEC.md, ${EB1A_SYSTEM_PATH}/FORBIDDEN_CONTENT.md, ${EB1A_SYSTEM_PATH}/LEGAL_FRAMEWORK_2026.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia evidências do cliente relevantes a ${criterion.id}: ${clientDocsPath}

${TRANSVERSAL_RULES}

TAREFA: Gerar CRITÉRIO ${criterion.id} — ${criterion.name} da Cover Letter EB-1A.

ESTRUTURA:
1. Enquadramento Legal (INA + C.F.R. + Policy Manual + Kazarian + PA-2025-16 + Mukherji + O*NET)
2. Tabela sinóptica (Evidence # | Tipo | Significância | Status)
3. Para CADA evidência (da mais forte à mais fraca):
   - 'Evidence XX.' bold verde #2E7D32
   - Contexto institucional + Análise regulatória + 3+ defesas preemptivas costuradas
   - [THUMBNAIL — Exhibit XX]
   - 500-1.500 palavras por evidence block + argumentação
4. Conclusão do critério (2-3 parágrafos)

AUTO-CHECK antes de entregar:
- Todas as evidências do inventário para ${criterion.id} cobertas
- Forbidden content: 0 violações
- Evidence XX. em bold #2E7D32, 1ª pessoa, Garamond 100%

Salve: ${phasesDir}/CL_${criterion.id}.docx
`, currentPhaseNum++);
    } else if (criterion.sessions === 2) {
      // Part A
      await executePhase(`2-${criterion.id}-A`, `Step 1 — ${criterion.id} ${criterion.name} (Parte A)`, `
Leia: ${EB1A_SYSTEM_PATH}/TEMPLATE_${criterion.id}_*.md (se existir)
Leia: ${EB1A_SYSTEM_PATH}/FORMATTING_SPEC.md, ${EB1A_SYSTEM_PATH}/FORBIDDEN_CONTENT.md, ${EB1A_SYSTEM_PATH}/LEGAL_FRAMEWORK_2026.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia evidências do cliente relevantes a ${criterion.id}: ${clientDocsPath}

${TRANSVERSAL_RULES}

TAREFA: Gerar CRITÉRIO ${criterion.id} — ${criterion.name} — PARTE A (primeira metade).

Incluir:
1. Enquadramento Legal completo
2. Tabela sinóptica de TODAS as evidências
3. Evidence blocks da PRIMEIRA METADE das evidências (1 a ${Math.ceil(criterion.evidences / 2)})
   - 'Evidence XX.' bold verde #2E7D32
   - 500-1.500 palavras por evidence block
   - [THUMBNAIL — Exhibit XX]

Salve: ${phasesDir}/CL_${criterion.id}_A.docx
`, currentPhaseNum++);

      // Part B
      await executePhase(`2-${criterion.id}-B`, `Step 1 — ${criterion.id} ${criterion.name} (Parte B)`, `
Leia: ${phasesDir}/CL_${criterion.id}_A.docx para manter continuidade
Leia: ${EB1A_SYSTEM_PATH}/FORMATTING_SPEC.md, ${EB1A_SYSTEM_PATH}/FORBIDDEN_CONTENT.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia evidências do cliente relevantes a ${criterion.id}: ${clientDocsPath}

${TRANSVERSAL_RULES}

TAREFA: Gerar CRITÉRIO ${criterion.id} — ${criterion.name} — PARTE B (segunda metade).
CONTINUAÇÃO da Parte A.

Incluir:
1. Evidence blocks da SEGUNDA METADE das evidências (${Math.ceil(criterion.evidences / 2) + 1} em diante)
   - 'Evidence XX.' bold verde #2E7D32
   - 500-1.500 palavras por evidence block
   - [THUMBNAIL — Exhibit XX]
2. Conclusão do critério (2-3 parágrafos)

Salve: ${phasesDir}/CL_${criterion.id}_B.docx
`, currentPhaseNum++);
    } else {
      // 3 sessions for very large criteria (9+ evidences)
      const third = Math.ceil(criterion.evidences / 3);
      // Part A
      await executePhase(`2-${criterion.id}-A`, `Step 1 — ${criterion.id} ${criterion.name} (Parte A)`, `
Leia: ${EB1A_SYSTEM_PATH}/TEMPLATE_${criterion.id}_*.md (se existir)
Leia: ${EB1A_SYSTEM_PATH}/FORMATTING_SPEC.md, ${EB1A_SYSTEM_PATH}/FORBIDDEN_CONTENT.md, ${EB1A_SYSTEM_PATH}/LEGAL_FRAMEWORK_2026.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia evidências do cliente: ${clientDocsPath}

${TRANSVERSAL_RULES}

TAREFA: Gerar CRITÉRIO ${criterion.id} — ${criterion.name} — PARTE A (primeiro terço).

Incluir:
1. Enquadramento Legal completo
2. Tabela sinóptica de TODAS as evidências
3. Evidence blocks 1 a ${third}

Salve: ${phasesDir}/CL_${criterion.id}_A.docx
`, currentPhaseNum++);

      // Part B
      await executePhase(`2-${criterion.id}-B`, `Step 1 — ${criterion.id} ${criterion.name} (Parte B)`, `
Leia: ${phasesDir}/CL_${criterion.id}_A.docx para continuidade
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia evidências do cliente: ${clientDocsPath}

${TRANSVERSAL_RULES}

TAREFA: Gerar CRITÉRIO ${criterion.id} — ${criterion.name} — PARTE B (segundo terço).
CONTINUAÇÃO da Parte A.
Evidence blocks ${third + 1} a ${third * 2}

Salve: ${phasesDir}/CL_${criterion.id}_B.docx
`, currentPhaseNum++);

      // Part C
      await executePhase(`2-${criterion.id}-C`, `Step 1 — ${criterion.id} ${criterion.name} (Parte C)`, `
Leia: ${phasesDir}/CL_${criterion.id}_A.docx, ${phasesDir}/CL_${criterion.id}_B.docx para continuidade
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia evidências do cliente: ${clientDocsPath}

${TRANSVERSAL_RULES}

TAREFA: Gerar CRITÉRIO ${criterion.id} — ${criterion.name} — PARTE C (terço final).
CONTINUAÇÃO das Partes A e B.
Evidence blocks ${third * 2 + 1} em diante + Conclusão do critério (2-3 parágrafos)

Salve: ${phasesDir}/CL_${criterion.id}_C.docx
`, currentPhaseNum++);
    }
  }

  // ═══ PHASE 3: STEP 2 — FINAL MERITS (3 sessions) ═══
  // Build list of criterion files for reading
  const criterionFilesList = criteria.map(c => {
    if (c.sessions === 1) return `${phasesDir}/CL_${c.id}.docx`;
    if (c.sessions === 2) return `${phasesDir}/CL_${c.id}_A.docx, ${phasesDir}/CL_${c.id}_B.docx`;
    return `${phasesDir}/CL_${c.id}_A.docx, ${phasesDir}/CL_${c.id}_B.docx, ${phasesDir}/CL_${c.id}_C.docx`;
  }).join('\n');

  // 3A
  await executePhase('3A', 'Step 2 — Parte A (Enquadramento + Síntese)', `
Leia: ${EB1A_SYSTEM_PATH}/ARCHITECT_COVER_LETTER_EB1.md, ${EB1A_SYSTEM_PATH}/LEGAL_FRAMEWORK_2026.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia TODOS os .docx de critérios:
${criterionFilesList}

${TRANSVERSAL_RULES}

TAREFA: Gerar STEP 2 — PARTE A (Seções A + B).

SEÇÃO A — Enquadramento Regulatório para a Etapa 2:
- Kazarian Step 2 DETALHADO (totality of evidence, não mero checklist)
- PA-2025-16 — implicações para determinação final
- Mukherji v. Miller — como fortalece o caso (persuasivo)

SEÇÃO B — Síntese Consolidada das Evidências:
- NÃO repetir Step 1 — análise CRUZADA e INTEGRATIVA
- Demonstrar que as evidências formam MOSAICO coerente

REGRA: Step 2 NÃO é resumo. É análise HOLÍSTICA onde 1+1=3.
Palavras alvo: 8.000-10.000
Salve: ${phasesDir}/CL_STEP2_A.docx
`, currentPhaseNum++);

  // 3B
  await executePhase('3B', 'Step 2 — Parte B (Continuidade + Referência Cruzada)', `
Leia: ${phasesDir}/CL_STEP2_A.docx (continuidade)
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_semantic_map.json
Leia critérios:
${criterionFilesList}

${TRANSVERSAL_RULES}

SEÇÃO C — Continuidade Temporal: Aclamação Sustentada:
- Timeline cronológica com marcos conectados a evidências
- Demonstrar sustained acclaim ao longo de ANOS

SEÇÃO D — Referência Cruzada Cumulativa:
- Tabela: evidências que servem MÚLTIPLOS critérios
- 3+ pathways argumentativos
- Evidências se REFORÇAM mutuamente

Palavras alvo: 8.000-10.000
Salve: ${phasesDir}/CL_STEP2_B.docx
`, currentPhaseNum++);

  // 3C
  await executePhase('3C', 'Step 2 — Parte C (Benefício Prospectivo + Conclusão)', `
Leia: ${phasesDir}/CL_STEP2_A.docx, ${phasesDir}/CL_STEP2_B.docx (continuidade)
Leia: ${phasesDir}/_inventory.json
Leia evidências do cliente: ${clientDocsPath}

${TRANSVERSAL_RULES}

SEÇÃO E — Benefício Prospectivo aos Estados Unidos:
- O*NET code com dados BLS (salário mediano, crescimento, demanda)
- Políticas federais alinhadas (mínimo 3)
- Impacto nacional QUANTIFICÁVEL

SEÇÃO F — Integração da Declaração Pessoal + Conclusão final solicitando aprovação

Palavras alvo: 8.000-10.000
Salve: ${phasesDir}/CL_STEP2_C.docx
`, currentPhaseNum++);

  // ═══ PHASE 3.5: THUMBNAILS ═══
  send('stage', { stage: 'phase', phase: '3.5', message: 'FASE 3.5: INSERÇÃO DE THUMBNAILS', progress: Math.round((currentPhaseNum / totalPhases) * 100) });
  upsertGeneration({ id: genId, current_phase: 'phase_3.5', current_phase_label: 'Thumbnails' });

  if (existsSync(INSERT_THUMBNAILS_PATH)) {
    const docxFiles = existsSync(phasesDir)
      ? readdirSync(phasesDir).filter(f => f.startsWith('CL_') && f.endsWith('.docx'))
      : [];

    let thumbnailSuccesses = 0;
    let thumbnailFailures = 0;

    for (const docxFile of docxFiles) {
      const fullPath = path.join(phasesDir, docxFile);
      try {
        send('stage', { stage: 'loading', phase: '3.5', message: `Inserindo thumbnails: ${docxFile}` });
        execSync(`python3 "${INSERT_THUMBNAILS_PATH}" "${fullPath}" "${clientDocsPath}"`, {
          encoding: 'utf-8',
          timeout: 120000,
        });
        thumbnailSuccesses++;
      } catch (err) {
        thumbnailFailures++;
        send('stage', { stage: 'warning', phase: '3.5', message: `Thumbnail falhou para ${docxFile}: ${(err as Error).message?.slice(0, 100)}` });
      }
    }

    send('stage', { stage: 'gen_complete', phase: '3.5', message: `Thumbnails: ${thumbnailSuccesses} ok, ${thumbnailFailures} falhas` });
    phaseResults.push({
      phase: '3.5',
      label: 'Thumbnails',
      success: thumbnailFailures === 0,
      duration_seconds: 0,
      files_created: [],
      error: thumbnailFailures > 0 ? `${thumbnailFailures} arquivos falharam` : undefined,
    });
  } else {
    send('stage', { stage: 'warning', phase: '3.5', message: `Script insert_thumbnails.py nao encontrado: ${INSERT_THUMBNAILS_PATH}` });
    phaseResults.push({ phase: '3.5', label: 'Thumbnails', success: false, duration_seconds: 0, files_created: [], error: 'Script nao encontrado' });
  }
  currentPhaseNum++;

  // ═══ PHASE 4: CONSOLIDATION (XML MERGE) ═══
  // Build ordered list of files to merge
  const mergeOrderList: string[] = [`${phasesDir}/CL_PART_I_Intro.docx`];
  for (const criterion of criteria) {
    if (criterion.sessions === 1) {
      mergeOrderList.push(`${phasesDir}/CL_${criterion.id}.docx`);
    } else if (criterion.sessions === 2) {
      mergeOrderList.push(`${phasesDir}/CL_${criterion.id}_A.docx`);
      mergeOrderList.push(`${phasesDir}/CL_${criterion.id}_B.docx`);
    } else {
      mergeOrderList.push(`${phasesDir}/CL_${criterion.id}_A.docx`);
      mergeOrderList.push(`${phasesDir}/CL_${criterion.id}_B.docx`);
      mergeOrderList.push(`${phasesDir}/CL_${criterion.id}_C.docx`);
    }
  }
  mergeOrderList.push(`${phasesDir}/CL_STEP2_A.docx`);
  mergeOrderList.push(`${phasesDir}/CL_STEP2_B.docx`);
  mergeOrderList.push(`${phasesDir}/CL_STEP2_C.docx`);

  // Filter to only files that actually exist
  const existingMergeFiles = mergeOrderList.filter(f => existsSync(f));
  const consolidatedName = `Cover_Letter_EB1A_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}_CONSOLIDATED.docx`;

  await executePhase('4', 'Consolidação XML Merge', `
TAREFA: Consolidar todos os .docx em 1 documento único.

ORDEM DE MERGE (arquivos existentes):
${existingMergeFiles.map((f, i) => `${i + 1}. ${f}`).join('\n')}

REGRAS DE MERGE:
1. NÃO usar docxcompose — PERDE IMAGENS
2. Merge XML:
   a) Unzip todos os .docx
   b) Primeiro = base
   c) Para cada adicional: copiar media/ (renomear se conflito), atualizar rIds, copiar body (exceto sectPr final)
   d) Page break entre documentos (APENAS antes de CRITÉRIO e STEP 2)
   e) Repack ZIP → .docx
3. wp:inline → wp:anchor + wrapSquare (todas as imagens)
4. cantSplit=true em todas as rows de tabelas
5. tblW w='5000' type='pct' + jc val='center'
6. Verificar contagem imagens antes/depois (DEVE ser igual)
7. Paginação contínua
8. Footer: 'EB-1A | I-140 Petition — Cover Letter ${clientName} | Page X of Y'

Salve: ${outputDir}/${consolidatedName}
`, currentPhaseNum++);

  // ═══ PHASE 4.5: VALIDATION ═══
  const consolidatedPath = path.join(outputDir, consolidatedName);
  const validateScriptPath = path.join(process.cwd(), 'scripts', 'validate_final_docx.py');

  send('stage', { stage: 'phase', phase: '4.5', message: 'FASE 4.5: VALIDAÇÃO AUTOMATIZADA', progress: Math.round((currentPhaseNum / totalPhases) * 100) });
  upsertGeneration({ id: genId, current_phase: 'phase_4.5', current_phase_label: 'Validação Automatizada' });

  if (existsSync(consolidatedPath) && existsSync(validateScriptPath)) {
    try {
      const validateOutput = execSync(`python3 "${validateScriptPath}" "${consolidatedPath}"`, {
        encoding: 'utf-8',
        timeout: 120000,
      });
      send('stage', { stage: 'gen_complete', phase: '4.5', message: `Validacao concluida: ${validateOutput.trim().slice(0, 200)}` });
      phaseResults.push({ phase: '4.5', label: 'Validação', success: true, duration_seconds: 0, files_created: [] });
    } catch (err) {
      const errMsg = (err as Error).message?.slice(0, 200) || 'Erro desconhecido';
      send('stage', { stage: 'warning', phase: '4.5', message: `Validacao falhou: ${errMsg}` });
      phaseResults.push({ phase: '4.5', label: 'Validação', success: false, duration_seconds: 0, files_created: [], error: errMsg });
    }
  } else if (!existsSync(consolidatedPath)) {
    send('stage', { stage: 'warning', phase: '4.5', message: `DOCX consolidado nao encontrado: ${consolidatedPath}` });
    phaseResults.push({ phase: '4.5', label: 'Validação', success: false, duration_seconds: 0, files_created: [], error: 'DOCX consolidado nao existe' });
  } else {
    send('stage', { stage: 'warning', phase: '4.5', message: `Script de validacao nao encontrado: ${validateScriptPath}. Pulando.` });
    phaseResults.push({ phase: '4.5', label: 'Validação', success: false, duration_seconds: 0, files_created: [], error: 'Script nao encontrado' });
  }
  currentPhaseNum++;

  // ═══ PHASE 5: SEPARATION OF CONCERNS ═══
  const docToReview = existsSync(consolidatedPath) ? consolidatedPath : existingMergeFiles[existingMergeFiles.length - 1] || '';

  if (docToReview) {
    await executePhase('5', 'Separation of Concerns — Revisão Cruzada', `
Leia ${SOC_PATH} secao 'PROTOCOLO DE REVISAO' e execute a revisao completa do documento: ${docToReview}
Use os padroes de qualidade em: ${QUALITY_PATH}
`, currentPhaseNum++);
  } else {
    send('stage', { stage: 'warning', phase: '5', message: 'Nenhum documento para revisar — pulando SoC' });
    phaseResults.push({ phase: '5', label: 'SoC Review', success: false, duration_seconds: 0, files_created: [], error: 'Nenhum documento para revisar' });
  }

  // Write pipeline summary
  const summaryPath = path.join(phasesDir, '_pipeline_summary.json');
  try {
    writeFileSync(summaryPath, JSON.stringify({
      client_name: clientName,
      total_duration_seconds: Math.round((Date.now() - startTime) / 1000),
      total_phases: phaseResults.length,
      phases_succeeded: phaseResults.filter(p => p.success).length,
      phases_failed: phaseResults.filter(p => !p.success).length,
      criteria_used: criteria.map(c => c.id),
      results: phaseResults,
    }, null, 2), 'utf-8');
  } catch {}

  return {
    success: phaseResults.filter(p => p.success).length > phaseResults.length / 2,
    phaseResults,
    allFiles: allFiles.filter((v, i, a) => a.indexOf(v) === i),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt_file, client_name, doc_type, client_id } = body;
  const encoder = new TextEncoder();
  const startTime = Date.now();
  const genId = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Resolve output directory
  let clientBaseDir = '';
  if (client_id) {
    const clients = readClients();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = clients.find((c: any) => c.id === client_id);
    if (client?.docs_folder_path) clientBaseDir = client.docs_folder_path;
  }
  if (!clientBaseDir) {
    clientBaseDir = `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/${client_name || 'output'}/`;
  }
  const outputDir = path.join(clientBaseDir, '_Forjado por Petition Engine') + '/';

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: object) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      // ═══ PRE-FLIGHT CHECKS ═══
      const claudeBin = findClaudeBin();
      if (!claudeBin) {
        send('stage', { stage: 'error', phase: 0, message: 'Binario claude nao encontrado no sistema' });
        send('stage', { stage: 'error', phase: 0, message: 'Tentei: ~/.npm-global/bin/claude, /usr/local/bin/claude, /opt/homebrew/bin/claude, which claude' });
        send('complete', { success: false, error: 'claude CLI nao encontrado — instale com: npm install -g @anthropic-ai/claude-code' });
        controller.close();
        return;
      }
      send('stage', { stage: 'info', phase: 0, message: `claude: ${claudeBin}` });

      if (!prompt_file) {
        send('stage', { stage: 'error', phase: 0, message: 'prompt_file nao fornecido' });
        send('complete', { success: false, error: 'prompt_file obrigatorio' });
        controller.close();
        return;
      }

      if (!existsSync(prompt_file)) {
        send('stage', { stage: 'error', phase: 0, message: `Arquivo nao encontrado: ${prompt_file}` });
        send('complete', { success: false, error: `Instrucao nao existe: ${prompt_file}` });
        controller.close();
        return;
      }

      try {
        if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        send('stage', { stage: 'error', phase: 0, message: `Nao foi possivel criar pasta: ${err.message}` });
        send('complete', { success: false, error: `Falha ao criar ${outputDir}` });
        controller.close();
        return;
      }

      // Auto-version existing files before generating new ones
      autoVersionExisting(outputDir);
      // Also version in the client docs_folder_path/_Forjado
      if (client_id) {
        try {
          const cs = readClients();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cl = cs.find((c: any) => c.id === client_id);
          if (cl?.docs_folder_path) {
            const forjado = path.join(cl.docs_folder_path, '_Forjado por Petition Engine');
            if (existsSync(forjado)) autoVersionExisting(forjado);
          }
        } catch {}
      }
      send('stage', { stage: 'info', phase: 0, message: 'Arquivos anteriores versionados automaticamente (V1, V2...)' });

      // Record generation start
      upsertGeneration({
        id: genId,
        client_id: client_id || null,
        client_name: client_name || 'Desconhecido',
        doc_type: doc_type || 'unknown',
        prompt_file,
        status: 'processing',
        started_at: new Date(startTime).toISOString(),
        completed_at: null,
        output_path: outputDir,
        output_files: [],
        error_message: null,
        duration_seconds: null,
        stages: [],
      });

      // ═══════════════════════════════════════════════════════════════
      // COVER LETTER EB-1A: MULTI-PHASE PIPELINE
      // ═══════════════════════════════════════════════════════════════
      if (doc_type === 'cover_letter_eb1a') {
        send('stage', { stage: 'info', phase: 0, message: '⚡ Pipeline multi-fase EB-1A ativado (10 fases)' });
        send('stage', { stage: 'info', phase: 0, message: `Orchestrator: ${ORCHESTRATOR_SPEC_PATH}` });

        // Resolve client docs path
        let clientDocsPath = '';
        if (client_id) {
          const cs = readClients();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cl = cs.find((c: any) => c.id === client_id);
          if (cl?.docs_folder_path) clientDocsPath = cl.docs_folder_path;
        }
        if (!clientDocsPath) {
          clientDocsPath = clientBaseDir;
        }

        send('stage', { stage: 'info', phase: 0, message: `Client docs: ${clientDocsPath}` });
        send('stage', { stage: 'info', phase: 0, message: `Output: ${outputDir}` });
        send('stage', { stage: 'info', phase: 0, message: `Sistema EB1A: ${EB1A_SYSTEM_PATH}` });

        try {
          const pipelineResult = await runCoverLetterEB1APipeline(
            claudeBin,
            clientDocsPath,
            outputDir,
            client_name || 'Cliente',
            send,
            genId,
            startTime,
          );

          const totalDuration = Math.round((Date.now() - startTime) / 1000);
          const succeeded = pipelineResult.phaseResults.filter(p => p.success).length;
          const failed = pipelineResult.phaseResults.filter(p => !p.success).length;

          upsertGeneration({
            id: genId,
            status: pipelineResult.success ? 'completed' : 'failed',
            completed_at: new Date().toISOString(),
            duration_seconds: totalDuration,
            output_files: pipelineResult.allFiles.map(f => path.basename(f)),
            error_message: pipelineResult.success ? null : `${failed} fases falharam`,
          });

          send('complete', {
            success: pipelineResult.success,
            pipeline: true,
            output_path: outputDir,
            phases_dir: path.join(outputDir, 'phases'),
            total_phases: pipelineResult.phaseResults.length,
            phases_succeeded: succeeded,
            phases_failed: failed,
            all_files: pipelineResult.allFiles.map(f => path.basename(f)),
            phase_details: pipelineResult.phaseResults.map(p => ({
              phase: p.phase,
              label: p.label,
              success: p.success,
              duration: p.duration_seconds,
              files: p.files_created,
              error: p.error,
            })),
            duration_seconds: totalDuration,
          });
        } catch (pipeErr) {
          const totalDuration = Math.round((Date.now() - startTime) / 1000);
          const errMsg = (pipeErr as Error).message?.slice(0, 500) || 'Erro desconhecido';
          send('stage', { stage: 'error', phase: 'pipeline', message: `Pipeline EB-1A falhou: ${errMsg}` });
          upsertGeneration({
            id: genId,
            status: 'failed',
            completed_at: new Date().toISOString(),
            duration_seconds: totalDuration,
            error_message: `Pipeline crash: ${errMsg}`,
          });
          send('complete', {
            success: false,
            pipeline: true,
            error: `Pipeline EB-1A falhou: ${errMsg}`,
            duration_seconds: totalDuration,
          });
        }

        controller.close();
        return;
      }

      // ═══ PHASE 1: GENERATION (standard single-session for all other doc types) ═══
      upsertGeneration({ id: genId, current_phase: 'phase_1', current_phase_label: 'Gerando documento...' });
      send('stage', { stage: 'phase', phase: 1, message: 'FASE 1: GERACAO DO DOCUMENTO' });
      send('stage', { stage: 'loading', phase: 1, message: `Instrucao: ${prompt_file.split('/').pop()}` });
      send('stage', { stage: 'loading', phase: 1, message: `Output: ${outputDir}` });
      send('stage', { stage: 'generating', phase: 1, message: `Executando: ${claudeBin.split('/').pop()} -p "Leia ... e execute tudo."` });
      send('stage', { stage: 'info', phase: 1, message: 'Aguarde — geracao real pode levar varios minutos...' });

      const instruction = `Leia ${prompt_file} e execute tudo.`;
      let lastChunkTime = Date.now();

      const gen = await runClaude(claudeBin, instruction,
        (chunk) => {
          const now = Date.now();
          if (now - lastChunkTime > 5000) {
            const preview = chunk.trim().slice(0, 150).replace(/\n/g, ' ');
            if (preview) send('stage', { stage: 'stdout', phase: 1, message: preview });
            lastChunkTime = now;
          }
        },
        (chunk) => {
          const preview = chunk.trim().slice(0, 150);
          if (preview) send('stage', { stage: 'stderr', phase: 1, message: preview });
        },
      );

      const genDuration = Math.round((Date.now() - startTime) / 1000);

      // Report exit code honestly
      if (gen.code !== 0) {
        send('stage', { stage: 'error', phase: 1, message: `claude -p saiu com codigo ${gen.code}` });
        if (gen.stderr) {
          send('stage', { stage: 'error', phase: 1, message: `stderr: ${gen.stderr.slice(0, 500)}` });
        }
        // Even on error, check if any .docx was created (partial success)
        const foundFiles = findNewDocx(outputDir, startTime).concat(findNewDocx(clientBaseDir, startTime));
        if (foundFiles.length > 0) {
          send('stage', { stage: 'warning', phase: 1, message: `Processo falhou mas encontrou ${foundFiles.length} .docx criado(s)` });
          upsertGeneration({ id: genId, status: 'failed', completed_at: new Date().toISOString(), duration_seconds: genDuration, error_message: `Exit ${gen.code} — docx parcial`, output_files: foundFiles.map(f => f.split('/').pop()) });
          send('complete', {
            success: false,
            partial: true,
            error: `Exit ${gen.code} — docx parcial encontrado`,
            files_found: foundFiles.map(f => f.split('/').pop()),
            output_path: outputDir,
            duration_seconds: genDuration,
            stdout_tail: gen.stdout.slice(-500),
          });
        } else {
          upsertGeneration({ id: genId, status: 'failed', completed_at: new Date().toISOString(), duration_seconds: genDuration, error_message: `Geracao falhou (exit ${gen.code})` });
          send('complete', {
            success: false,
            error: `Geracao falhou (exit ${gen.code}) — nenhum documento criado`,
            stderr: gen.stderr.slice(0, 1000),
            stdout_tail: gen.stdout.slice(-500),
            duration_seconds: genDuration,
          });
        }
        controller.close();
        return;
      }

      // ═══ POST-FLIGHT: Check if document was actually created ═══
      // Also check the docs_folder_path directly (Claude may save there instead of _Forjado)
      const searchDirs = [outputDir, clientBaseDir];
      // Also search the docs_folder_path from client record
      if (client_id) {
        try {
          const cs = readClients();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cl = cs.find((c: any) => c.id === client_id);
          if (cl?.docs_folder_path) {
            const forjado = cl.docs_folder_path + '/_Forjado por Petition Engine/';
            if (!searchDirs.includes(forjado)) searchDirs.push(forjado);
            if (!searchDirs.includes(cl.docs_folder_path)) searchDirs.push(cl.docs_folder_path);
          }
        } catch {}
      }
      let newDocx: string[] = [];
      for (const dir of searchDirs) {
        newDocx = newDocx.concat(findNewDocx(dir, startTime));
      }
      // Deduplicate
      newDocx = newDocx.filter((v, i, a) => a.indexOf(v) === i);

      if (newDocx.length === 0) {
        send('stage', { stage: 'error', phase: 1, message: 'claude -p retornou 0 mas NENHUM documento foi criado no disco' });
        send('stage', { stage: 'error', phase: 1, message: `Pasta verificada: ${outputDir}` });
        send('stage', { stage: 'info', phase: 1, message: `stdout (ultimos 300 chars): ${gen.stdout.slice(-300)}` });
        upsertGeneration({ id: genId, status: 'failed', completed_at: new Date().toISOString(), duration_seconds: genDuration, error_message: 'Exit 0 mas nenhum documento criado' });
        send('complete', {
          success: false,
          error: 'Processo completou mas nao gerou documento — a instrucao pode ser generica demais para o sistema',
          hint: 'Cover Letters e BPs precisam de instrucoes especificas de 4 partes (veja GERAR_COVER_EB1A_GUSTAVO_NELSON.md como exemplo)',
          stdout_tail: gen.stdout.slice(-500),
          duration_seconds: genDuration,
          output_dir_checked: outputDir,
        });
        controller.close();
        return;
      }

      const mainDocx = newDocx[0];
      send('stage', { stage: 'gen_complete', phase: 1, message: `Documento criado: ${mainDocx.split('/').pop()} (${genDuration}s)` });
      if (newDocx.length > 1) {
        send('stage', { stage: 'info', phase: 1, message: `${newDocx.length} arquivos .docx encontrados no total` });
      }

      // ═══ PHASE 1.5: QUALITY GATE (LOCAL) ═══
      upsertGeneration({ id: genId, current_phase: 'phase_1.5', current_phase_label: 'Quality Gate — Validacao automatica' });
      send('stage', { stage: 'phase', phase: 1.5, message: 'FASE 1.5: QUALITY GATE — Validacao automatica' });

      try {
        const { runQualityLocal } = await import('@/agents/quality-local');
        // Extract text from DOCX for quality check
        let docText = '';
        try {
          docText = execSync(
            `python3 -c "from docx import Document; doc=Document('${mainDocx}'); print('\\n'.join(p.text for p in doc.paragraphs))"`,
            { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
          );
        } catch {
          send('stage', { stage: 'warning', phase: 1.5, message: 'Nao foi possivel extrair texto do DOCX para quality check' });
        }

        if (docText) {
          const qualityResult = await runQualityLocal({
            documentText: docText,
            docType: doc_type || 'unknown',
            clientName: client_name || '',
          });

          send('stage', { stage: 'quality_result', phase: 1.5, message: `Score: ${qualityResult.score}/100 — ${qualityResult.passed ? 'APROVADO' : 'REPROVADO'}` });

          if (qualityResult.autoFixes.length > 0) {
            send('stage', { stage: 'info', phase: 1.5, message: `${qualityResult.autoFixes.length} auto-fixes aplicados: ${qualityResult.autoFixes.map(f => f.description).join(', ')}` });
          }

          if (qualityResult.violations.length > 0) {
            for (const v of qualityResult.violations.slice(0, 5)) {
              send('stage', { stage: 'violation', phase: 1.5, message: `[${v.severity.toUpperCase()}] ${v.rule}: ${v.match}` });
            }
          }

          if (!qualityResult.passed) {
            send('stage', { stage: 'warning', phase: 1.5, message: `Quality gate REPROVADO (${qualityResult.score}/100). Documento entregue com ressalvas.` });
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (qErr: any) {
        send('stage', { stage: 'warning', phase: 1.5, message: `Quality agent erro: ${qErr.message?.slice(0, 200)}` });
      }

      // ═══ PHASE 2: SEPARATION OF CONCERNS ═══
      upsertGeneration({ id: genId, current_phase: 'phase_2', current_phase_label: 'Separation of Concerns — Revisao cruzada' });
      send('stage', { stage: 'phase', phase: 2, message: 'FASE 2: REVISAO CRUZADA — Separation of Concerns' });
      send('stage', { stage: 'review_init', phase: 2, message: 'Iniciando sessao limpa para revisao cruzada...' });

      const reviewInstruction = `Leia ${SOC_PATH} secao 'PROTOCOLO DE REVISAO' e execute a revisao completa do documento: ${mainDocx}. Use os padroes de qualidade em: ${QUALITY_PATH}`;

      const review = await runClaude(claudeBin, reviewInstruction);
      const totalDuration = Math.round((Date.now() - startTime) / 1000);
      const reviewDuration = totalDuration - genDuration;

      // Check if reviewed .docx was created
      const reviewedFiles = findNewDocx(outputDir, startTime + genDuration * 1000);
      const reviewedDocx = reviewedFiles.find(f => f.includes('REVIEWED')) || null;
      const reviewReport = reviewedFiles.find(f => f.includes('REVIEW')) || null;

      if (review.code === 0 && reviewedDocx) {
        send('stage', { stage: 'review_complete', phase: 2, message: `Revisao concluida: ${reviewedDocx.split('/').pop()} (${reviewDuration}s)` });
      } else if (review.code === 0) {
        send('stage', { stage: 'warning', phase: 2, message: `Revisao executou mas nao gerou _REVIEWED.docx (${reviewDuration}s)` });
      } else {
        send('stage', { stage: 'warning', phase: 2, message: `Revisao falhou (exit ${review.code}) — documento bruto disponivel` });
      }

      // ═══ FINAL — HONEST RESULT ═══
      upsertGeneration({
        id: genId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        duration_seconds: totalDuration,
        output_files: newDocx.concat(reviewedFiles).map(f => f.split('/').pop()),
        error_message: null,
      });
      send('complete', {
        success: true,
        output_path: outputDir,
        docx_original: mainDocx,
        docx_reviewed: reviewedDocx,
        review_report: reviewReport,
        all_files: newDocx.concat(reviewedFiles).map(f => f.split('/').pop()),
        review_verdict: reviewedDocx ? 'REVISADO' : review.code === 0 ? 'REVISAO PARCIAL' : 'SEM REVISAO',
        duration_seconds: totalDuration,
        phases: {
          generation: { duration: genDuration, exit_code: gen.code, docx_found: true },
          review: { duration: reviewDuration, exit_code: review.code, reviewed_docx_found: !!reviewedDocx },
        },
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
