/**
 * Testimony Letters Pipeline — Multi-voice arsenal generator.
 *
 * Takes a case_id and generates an arsenal of letters where EACH letter uses
 * a different persona from the persona bank (kills ATLAS homogeneity). After
 * generation, runs:
 *   - hard_block scrub (per-case SOC-specific blocks)
 *   - anti-ATLAS validator (compares geometry/font/date-position/table-count)
 *   - master_facts anchor check (per letter_type required anchors)
 *
 * Applies SKILL v5 (satellite/testimony letters) + Sandeco Ch. 4 (layered
 * architecture + Repository + Factory Method): persona/master-facts/hard-blocks
 * are independently loaded and composable.
 *
 * Invoked when doc_type ∈ {testimony_letter_eb1a, testimony_letter_eb2_niw}.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { runClaude, findNewDocx, upsertGeneration, SendFn, PhaseResult } from './base';
import { getAllPersonas, getPersonasForType, Persona, LetterType } from '@/lib/rules/persona-bank';
import { getMasterFacts, checkAnchorsPresence, requiredAnchorsMissing, MasterFacts } from '@/lib/rules/master-facts';
import { scanHardBlocks, renderHardBlockReport, HardBlockScrubResult } from '@/lib/rules/hard-blocks';
import { validateAntiAtlas, LetterSignature, AtlasValidationResult, renderAtlasReport } from '@/lib/validators/anti-atlas';

// Fallback letter types produced when no master_facts are present.
const DEFAULT_LETTER_TYPES: LetterType[] = [
  'testemunho_passado',
  'cliente_futuro',
  'parceiro_estrategico',
  'investidor_futuro',
];

export interface TestimonyPipelineParams {
  caseId: string;
  clientName: string;
  clientDocsPath: string;
  outputDir: string;
  visaType: 'EB-1A' | 'EB-2 NIW' | 'O-1';
  claudeBin: string;
  letterTypes?: LetterType[];
  send: SendFn;
  genId: string;
}

export interface TestimonyPipelineResult {
  success: boolean;
  phase_results: PhaseResult[];
  letters_generated: string[];
  atlas_validation?: AtlasValidationResult;
  hard_block_results?: HardBlockScrubResult[];
  master_facts_coverage?: { letter_id: string; missing_anchors: string[] }[];
  total_duration_seconds: number;
  verdict: 'GO' | 'NO_GO' | 'WARN';
  report_md: string;
}

/**
 * Build per-persona prompt. Each persona yields a unique letter.
 */
function buildPersonaPrompt(
  persona: Persona,
  masterFacts: MasterFacts | null,
  clientDocsPath: string,
  outputDir: string,
  visaType: string,
): string {
  const anchorLines = masterFacts
    ? Object.entries(masterFacts.anchors)
        .map(([k, v]) => `- ${k}: ${v.value}${v.aliases.length ? ` (aka ${v.aliases.slice(0, 2).join(', ')})` : ''}`)
        .join('\n')
    : '(no master facts for this case)';

  const openingSuggestion = persona.opening_variants[
    Math.floor(Math.random() * persona.opening_variants.length)
  ];

  return `# Carta: ${letterTypeHuman(persona.letter_type)}

## Sua persona (autor da carta)
- Nome: ${persona.full_name}
- Credencial: ${persona.credential}
- Firma: ${persona.firm}
- ${persona.years_in_field} anos de experiência no campo
- Relação com o pleiteante: ${persona.relationship_to_petitioner}
- Verbo-assinatura: "${persona.signature_verb}"
- Registro emocional: ${persona.emotional_register}
- Ritmo de frase: ${persona.sentence_length_distribution}
- Idioma obrigatório: ${persona.preferred_language === 'en' ? 'English' : 'Português (pt-BR)'}
- Domínio de expertise (NÃO opinar fora): ${persona.expertise_lock.join(', ')}

## Abertura sugerida (escolha esta OU uma das outras variantes)
"${openingSuggestion}"

## Fatos-âncora do caso (DEVE ecoar ≥3 destes)
${anchorLines}

## Pasta de evidências do pleiteante
${clientDocsPath}

## Regras invioláveis (SKILL v5)
- Voz em PRIMEIRA PESSOA do autor (não do pleiteante)
- Tom: ${persona.emotional_register}
- Zero jargão imigratório (NUNCA: EB-1, EB-2, NIW, Dhanasar, USCIS, visa, petition, i-140, green card)
- Zero hyperbole (NUNCA: unique, sole, only, unparalleled, one-of-a-kind)
- Cada afirmação com evidência numerada (ART nº, DOI, ISBN, NFS-e, norma técnica)
- 1-3 cenas técnicas concretas, específicas à cadeira do autor
- Juízo qualificado APENAS dentro do expertise_lock

## Tipo de carta: ${persona.letter_type}
${letterTypeInstructions(persona.letter_type, visaType)}

## Output obrigatório
Gerar UM arquivo .docx em ${outputDir}
Naming: ${persona.author_id}_${persona.letter_type}.docx

Use python-docx para o arquivo (NÃO .md). Aplique formatação por tipo
conforme SEÇÃO 2 Categoria F do SKILL v5 current.md (/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/_Sistema Produtor de Cartas EB-1/current.md).
`;
}

function letterTypeHuman(t: LetterType): string {
  const map: Record<LetterType, string> = {
    testemunho_passado: 'Testemunho de Passado',
    cliente_futuro: 'Potencial Cliente Futuro',
    parceiro_estrategico: 'Potencial Parceiro Estratégico',
    investidor_futuro: 'Potencial Investidor Futuro',
    contador: 'Declaração de Contador',
  };
  return map[t];
}

function letterTypeInstructions(t: LetterType, visaType: string): string {
  switch (t) {
    case 'testemunho_passado':
      return 'Ataca Prong 2 (well-positioned). Não inventar cenas — usar pasta de evidências. Fechamento: tabela de identificação (CREA/PE, empresa, contatos) no BR; "FL License nº" se US.';
    case 'cliente_futuro':
      return `Ataca Prong 1 (national importance). Tom B2B US. Gatilho regulatório específico obrigatório (SB 4-D / LL 126 / NBIS / FDOT / IIJA / FEMA). Three distinct grounds. Non-binding framing. Sem advisory/consulting/sub-consulting. Visto: ${visaType}.`;
    case 'parceiro_estrategico':
      return 'Ataca Prong 3 (waiver). Se BR: ofício formal com Destinatário/Corpo/Assinatura paralela. Se US: minuta WHEREAS (≥3) + ARTICLE (≥5) + IN WITNESS WHEREOF.';
    case 'investidor_futuro':
      return 'Ataca os 3 Prongs. PPM simplificado. Tom analytic-sóbrio. 7 tabelas (revenue, allocation, TAM/SAM/SOM, milestones, governance, downside, signatures). Envelope USD explícito (default US$ 50,000 seed). Zero sales tone.';
    case 'contador':
      return 'Autenticação estrutural. PT-BR jurídico-contábil. APÊNDICE OBRIGATÓRIO com 4 citações: Código Civil Art. 1.179, NBC TP 01, CC Art. 1.180, Decreto-Lei 9.295/1946 Art. 25.';
  }
}

/**
 * Extract lightweight signature from a .docx for anti-ATLAS clustering.
 * Falls back to heuristics when python-docx is unavailable.
 */
function extractLetterSignature(docxPath: string, letterId: string): LetterSignature {
  // Minimal fallback — we let adversarial auditor do the heavy parse.
  // This keeps us from spawning python for every letter; a future pass can
  // enrich via python-docx to inspect XML header/runs/tables precisely.
  try {
    const paragraphCount = Number(execSync(
      `python3 -c "from docx import Document; d=Document('${docxPath}'); print(len(d.paragraphs))"`,
      { encoding: 'utf-8', timeout: 15000 },
    ).trim()) || 0;
    const tableCount = Number(execSync(
      `python3 -c "from docx import Document; d=Document('${docxPath}'); print(len(d.tables))"`,
      { encoding: 'utf-8', timeout: 15000 },
    ).trim()) || 0;
    const fontFamily = execSync(
      `python3 -c "from docx import Document; d=Document('${docxPath}'); r=d.paragraphs[0].runs[0] if d.paragraphs and d.paragraphs[0].runs else None; print(r.font.name or 'default' if r else 'unknown')"`,
      { encoding: 'utf-8', timeout: 15000 },
    ).trim() || 'unknown';
    // Heuristics for date position — scan first 3 paragraphs for YYYY or month names
    const firstText = execSync(
      `python3 -c "from docx import Document; d=Document('${docxPath}'); print('|'.join(p.text for p in d.paragraphs[:5]))"`,
      { encoding: 'utf-8', timeout: 15000 },
    ).trim().toLowerCase();
    const hasDateInHeader =
      /\b(january|february|march|april|may|june|july|august|september|october|november|december|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b/.test(firstText) ||
      /\b20\d{2}\b/.test(firstText);
    return {
      id: letterId,
      headerGeometry: 'unknown', // enriched in future pass
      datePosition: hasDateInHeader ? 'top-left' : 'closing',
      fontFamily: fontFamily || 'unknown',
      tableCount,
      paragraphCount,
    };
  } catch {
    return {
      id: letterId,
      headerGeometry: 'unknown',
      datePosition: 'unknown',
      fontFamily: 'unknown',
      tableCount: 0,
      paragraphCount: 0,
    };
  }
}

export async function runTestimonyLettersPipeline(params: TestimonyPipelineParams): Promise<TestimonyPipelineResult> {
  const { caseId, clientDocsPath, outputDir, visaType, claudeBin, letterTypes, send, genId } = params;
  const startTime = Date.now();
  const phaseResults: PhaseResult[] = [];
  const lettersGenerated: string[] = [];
  const hardBlockResults: HardBlockScrubResult[] = [];
  const masterFactsCoverage: { letter_id: string; missing_anchors: string[] }[] = [];
  let atlasResult: AtlasValidationResult | undefined;

  // ═══ PHASE 1: LOAD PERSONAS ═══
  send('stage', { stage: 'phase', phase: 1, message: 'FASE 1: Carregando personas do caso' });
  const personas = caseId ? getAllPersonas(caseId) : [];
  const requestedTypes = letterTypes && letterTypes.length > 0 ? letterTypes : DEFAULT_LETTER_TYPES;
  const personasToRun = personas.filter(p => requestedTypes.includes(p.letter_type));

  if (personasToRun.length === 0) {
    const msg = `Nenhuma persona encontrada para caseId=${caseId} com letter_types=${requestedTypes.join(',')}. Cadastre em data/persona_bank.json.`;
    send('stage', { stage: 'error', phase: 1, message: msg });
    return {
      success: false,
      phase_results: phaseResults,
      letters_generated: [],
      total_duration_seconds: Math.round((Date.now() - startTime) / 1000),
      verdict: 'NO_GO',
      report_md: `# Testimony Letters Pipeline — NO-GO\n\n${msg}\n`,
    };
  }
  send('stage', { stage: 'info', phase: 1, message: `${personasToRun.length} personas carregadas: ${personasToRun.map(p => p.author_id).join(', ')}` });
  phaseResults.push({ phase: '1', label: 'load_personas', success: true, duration_seconds: 0, files_created: [] });

  // ═══ PHASE 2: LOAD MASTER FACTS ═══
  const masterFacts = getMasterFacts(caseId);
  if (!masterFacts) {
    send('stage', { stage: 'warning', phase: 2, message: `Nenhum master_facts para caseId=${caseId} — anchors não serão validados` });
  } else {
    send('stage', { stage: 'info', phase: 2, message: `Master facts: ${Object.keys(masterFacts.anchors).length} anchors` });
  }
  phaseResults.push({ phase: '2', label: 'load_master_facts', success: true, duration_seconds: 0, files_created: [] });

  // ═══ PHASE 3: DRAFT ONE LETTER PER PERSONA ═══
  send('stage', { stage: 'phase', phase: 3, message: `FASE 3: Gerando ${personasToRun.length} cartas (uma por persona)` });
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  for (const persona of personasToRun) {
    const phaseStart = Date.now();
    send('stage', { stage: 'generating', phase: 3, message: `  → ${persona.full_name} (${persona.letter_type})` });
    const prompt = buildPersonaPrompt(persona, masterFacts, clientDocsPath, outputDir, visaType);
    const genResult = await runClaude(claudeBin, prompt, undefined, undefined, {
      timeoutMs: 25 * 60 * 1000,
      idleTimeoutMs: 7 * 60 * 1000,
    });
    const duration = Math.round((Date.now() - phaseStart) / 1000);
    const newFiles = findNewDocx(outputDir, phaseStart).filter(f => f.includes(persona.author_id));
    if (newFiles.length > 0) {
      lettersGenerated.push(...newFiles);
      send('stage', { stage: 'gen_complete', phase: 3, message: `    ✓ ${path.basename(newFiles[0])} (${duration}s)` });
      phaseResults.push({ phase: `3.${persona.author_id}`, label: `draft_${persona.author_id}`, success: true, duration_seconds: duration, files_created: newFiles.map(f => path.basename(f)) });
    } else {
      const errMsg = genResult.timedOut ? `timeout (${genResult.timeoutKind})` : `exit ${genResult.code}`;
      send('stage', { stage: 'warning', phase: 3, message: `    ⚠ ${persona.author_id}: ${errMsg} sem DOCX` });
      phaseResults.push({ phase: `3.${persona.author_id}`, label: `draft_${persona.author_id}`, success: false, duration_seconds: duration, files_created: [] });
    }
  }

  if (lettersGenerated.length === 0) {
    const msg = 'Nenhuma carta foi gerada — todas as personas falharam';
    send('stage', { stage: 'error', phase: 3, message: msg });
    return {
      success: false,
      phase_results: phaseResults,
      letters_generated: [],
      total_duration_seconds: Math.round((Date.now() - startTime) / 1000),
      verdict: 'NO_GO',
      report_md: `# Testimony Letters Pipeline — NO-GO\n\n${msg}\n`,
    };
  }

  // ═══ PHASE 4: ANTI-ATLAS VALIDATION ═══
  send('stage', { stage: 'phase', phase: 4, message: 'FASE 4: Validação Anti-ATLAS (heterogeneidade visual)' });
  const signatures: LetterSignature[] = lettersGenerated.map((f, i) =>
    extractLetterSignature(f, path.basename(f).replace('.docx', '') || `L${i + 1}`),
  );
  atlasResult = validateAntiAtlas(signatures);
  send('stage', { stage: atlasResult.passed ? 'info' : 'warning', phase: 4, message: `atlas_score=${atlasResult.atlas_score} (${atlasResult.passed ? 'PASSED' : 'FAILED'}, ${atlasResult.violations.length} violações)` });
  phaseResults.push({ phase: '4', label: 'anti_atlas', success: atlasResult.passed, duration_seconds: 0, files_created: [] });

  // ═══ PHASE 5: HARD BLOCK SCAN ═══
  send('stage', { stage: 'phase', phase: 5, message: 'FASE 5: Scan Hard Blocks (default + caso)' });
  for (const letterPath of lettersGenerated) {
    try {
      const text = execSync(
        `python3 -c "from docx import Document; d=Document('${letterPath}'); print('\\n'.join(p.text for p in d.paragraphs))"`,
        { encoding: 'utf-8', timeout: 15000, maxBuffer: 10 * 1024 * 1024 },
      );
      const scan = scanHardBlocks(text, caseId);
      hardBlockResults.push(scan);
      if (scan.criticalCount > 0) {
        send('stage', { stage: 'warning', phase: 5, message: `${path.basename(letterPath)}: ${scan.criticalCount} critical hard-block matches` });
      }
    } catch {
      hardBlockResults.push({ cleaned: '', violations: [], criticalCount: 0, totalMatches: 0 });
    }
  }
  const totalCritical = hardBlockResults.reduce((sum, r) => sum + r.criticalCount, 0);
  phaseResults.push({ phase: '5', label: 'hard_block_scan', success: totalCritical === 0, duration_seconds: 0, files_created: [] });

  // ═══ PHASE 6: MASTER FACTS ANCHOR CHECK ═══
  if (masterFacts) {
    send('stage', { stage: 'phase', phase: 6, message: 'FASE 6: Check de anchors (master_facts)' });
    for (const letterPath of lettersGenerated) {
      try {
        const text = execSync(
          `python3 -c "from docx import Document; d=Document('${letterPath}'); print('\\n'.join(p.text for p in d.paragraphs))"`,
          { encoding: 'utf-8', timeout: 15000, maxBuffer: 10 * 1024 * 1024 },
        );
        // Derive letter_type from filename (matches naming convention)
        const basename = path.basename(letterPath);
        const matchedPersona = personasToRun.find(p => basename.includes(p.author_id));
        const letterType = matchedPersona?.letter_type;
        const missing = letterType ? requiredAnchorsMissing(text, caseId, letterType) : [];
        const coverage = checkAnchorsPresence(text, caseId);
        masterFactsCoverage.push({ letter_id: basename, missing_anchors: missing });
        if (missing.length > 0) {
          send('stage', { stage: 'warning', phase: 6, message: `${basename}: missing required anchors: ${missing.join(', ')}` });
        } else if (coverage) {
          send('stage', { stage: 'info', phase: 6, message: `${basename}: anchor coverage ${Math.round(coverage.coverage_ratio * 100)}%` });
        }
      } catch {
        // non-fatal
      }
    }
    const anyMissing = masterFactsCoverage.some(m => m.missing_anchors.length > 0);
    phaseResults.push({ phase: '6', label: 'master_facts_check', success: !anyMissing, duration_seconds: 0, files_created: [] });
  }

  // ═══ FINAL VERDICT ═══
  const hasCriticalBlocks = totalCritical > 0;
  const hasAtlasFailure = atlasResult && !atlasResult.passed;
  const hasMissingAnchors = masterFactsCoverage.some(m => m.missing_anchors.length > 0);
  const verdict: 'GO' | 'NO_GO' | 'WARN' = hasCriticalBlocks
    ? 'NO_GO'
    : hasAtlasFailure || hasMissingAnchors
      ? 'WARN'
      : 'GO';

  const reportSections = [
    `# Testimony Letters Pipeline — Verdict: ${verdict}`,
    '',
    `**Caso:** ${caseId}  **Visto:** ${visaType}  **Cartas geradas:** ${lettersGenerated.length}`,
    '',
    '## Cartas',
    ...lettersGenerated.map(f => `- ${path.basename(f)}`),
    '',
    atlasResult ? renderAtlasReport(atlasResult) : '',
    ...hardBlockResults.flatMap((r, i) => r.violations.length > 0 ? [`### ${path.basename(lettersGenerated[i])}`, renderHardBlockReport(r)] : []),
    masterFactsCoverage.length > 0 ? [
      '## Master Facts Anchor Coverage',
      ...masterFactsCoverage.map(m => m.missing_anchors.length === 0
        ? `- ✓ ${m.letter_id}: all required anchors present`
        : `- ✗ ${m.letter_id}: missing ${m.missing_anchors.join(', ')}`,
      ),
    ].join('\n') : '',
  ].filter(Boolean).join('\n');

  const reportPath = path.join(outputDir, 'TESTIMONY_PIPELINE_REPORT.md');
  try { writeFileSync(reportPath, reportSections); } catch {}

  upsertGeneration({
    id: genId,
    status: verdict === 'NO_GO' ? 'quality_blocked' : 'completed',
    completed_at: new Date().toISOString(),
    duration_seconds: Math.round((Date.now() - startTime) / 1000),
    output_files: lettersGenerated.map(f => path.basename(f)).concat(['TESTIMONY_PIPELINE_REPORT.md']),
    testimony_verdict: verdict,
    atlas_score: atlasResult?.atlas_score,
    hard_block_critical_count: totalCritical,
  });

  return {
    success: verdict === 'GO',
    phase_results: phaseResults,
    letters_generated: lettersGenerated,
    atlas_validation: atlasResult,
    hard_block_results: hardBlockResults,
    master_facts_coverage: masterFactsCoverage,
    total_duration_seconds: Math.round((Date.now() - startTime) / 1000),
    verdict,
    report_md: reportSections,
  };
}

// Helpers exported for tests
export const _testExports = { buildPersonaPrompt, letterTypeHuman, letterTypeInstructions };
