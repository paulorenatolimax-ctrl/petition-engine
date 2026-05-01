/**
 * Cover Letter EB-1A Multi-Phase Pipeline
 *
 * Extracted from execute/route.ts lines 131-784.
 * Handles the 10+ phase generation of EB-1A cover letters.
 *
 * IMPORTANT: This is a MOVE, not a rewrite.
 * The logic is identical to the original — only imports changed.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, mkdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { EB1A_SYSTEM_PATH, INSERT_THUMBNAILS_PATH, SOC_PATH, QUALITY_PATH } from '@/lib/config/paths';
import {
  upsertGeneration, runClaude, findNewDocx, SendFn, PhaseResult, buildRulesSectionForDocType,
} from './base';

const ORCHESTRATOR_SPEC_PATH = path.join(process.cwd(), 'systems', 'cover-letter-eb1a-orchestrator', 'ORCHESTRATOR_COVER_LETTER_EB1A.md');

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

### FORBIDDEN CONTENT (12 categorias — ZERO TOLERANCE):
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
Cat 12: ANTI-RAG-POLLUTION (CHUNK 4 / auditoria 30/abr): ZERO ocorrências de "system",
        "automated", "AI-generated", "framework", "based on the system", "the framework",
        "Petition Engine", "Forjado por", "RAG", "RAGs", "PROEX". Auditoria identificou
        "system"/"automated" como red flags em cartas anteriores — sintoma de prompt-leak.
        O documento DEVE parecer escrito por um ESPECIALISTA HUMANO real. Use linguagem
        regulatória/probatória técnica, não linguagem de produto/sistema/AI.

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

  // ═══ PHASE -1: EVIDENCE ORGANIZATION (Python) ═══
  const evidenceDir = path.join(clientDocsPath, 'Evidence');
  if (!existsSync(evidenceDir) || readdirSync(evidenceDir).length === 0) {
    send('stage', { stage: 'phase', phase: '-1', message: 'FASE -1: ORGANIZAÇÃO DE EVIDÊNCIAS' });
    send('stage', { stage: 'loading', phase: '-1', message: 'Escaneando pasta do cliente, classificando, filtrando, numerando...' });
    const organizeScript = path.join(process.cwd(), 'scripts', 'core', 'organize_evidence.py');
    if (existsSync(organizeScript)) {
      try {
        const orgResult = execSync(
          `python3 "${organizeScript}" "${clientDocsPath}" --force`,
          { encoding: 'utf-8', timeout: 300000, maxBuffer: 10 * 1024 * 1024 }
        );
        send('stage', { stage: 'gen_complete', phase: '-1', message: `Evidências organizadas: ${orgResult.split('\n').filter(l => l.includes('Valid:')).pop() || 'OK'}` });
      } catch (err: unknown) {
        const errMsg = (err as { stderr?: string })?.stderr || String(err);
        send('stage', { stage: 'warning', phase: '-1', message: `Organizer falhou: ${errMsg.slice(0, 200)}. Continuando com pasta original.` });
      }
    } else {
      send('stage', { stage: 'info', phase: '-1', message: 'organize_evidence.py não encontrado — pulando organização automática' });
    }
  } else {
    send('stage', { stage: 'info', phase: '-1', message: `Evidence/ já existe com ${readdirSync(evidenceDir).length} arquivos — usando existente` });
  }
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

    // CHUNK 3 (F1.2) — injetar regras ATIVAS de error_rules.json em cada fase
    const rulesPrefix = buildRulesSectionForDocType('cover_letter_eb1a');
    const instructionWithRules = rulesPrefix + instruction;

    let lastChunkTime = Date.now();
    const result = await runClaude(claudeBin, instructionWithRules,
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

export { runCoverLetterEB1APipeline, parseStrategicPlan, TRANSVERSAL_RULES };
export type { CriterionInfo };
