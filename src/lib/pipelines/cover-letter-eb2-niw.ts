/**
 * Cover Letter EB-2 NIW Multi-Phase Pipeline
 *
 * Extracted from execute/route.ts lines 786-1463.
 * Handles the 13-phase generation of EB-2 NIW cover letters.
 *
 * IMPORTANT: This is a MOVE, not a rewrite.
 * The logic is identical to the original — only imports changed.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, mkdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { EB2_NIW_SYSTEM_PATH as EB2_NIW_SYS_PATH, RAGS_EB2 as RAGS_EB2_PATH, INSERT_THUMBNAILS_PATH, SOC_PATH, QUALITY_PATH } from '@/lib/config/paths';
import {
  upsertGeneration, runClaude, findNewDocx, SendFn,
} from './base';

const EB2_NIW_SYSTEM_PATH = EB2_NIW_SYS_PATH;
const RAGS_EB2 = RAGS_EB2_PATH;
const EB2_NIW_ORCHESTRATOR_SPEC_PATH = path.join(process.cwd(), 'systems', 'cover-letter-eb2niw-orchestrator', 'ORCHESTRATOR_COVER_LETTER_EB2NIW.md');

interface PhaseResult {
  phase: string;
  label: string;
  success: boolean;
  duration_seconds: number;
  files_created: string[];
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// COVER LETTER EB-2 NIW MULTI-PHASE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════

const TRANSVERSAL_RULES_EB2_NIW = `
## REGRAS TRANSVERSAIS (INCLUIR EM TODOS OS PROMPTS):

- Idioma: 100% INGLÊS (en-US) para documentos USCIS. Termos em português apenas entre parênteses quando necessário.
- Font: Garamond em TODO o documento. NUNCA Arial, Calibri ou Times New Roman.
- Evidence blocks: Tabela 2 colunas com [THUMBNAIL — Exhibit X] placeholder. NAO tente gerar imagem.
- NUNCA usar "extraordinary ability" (termo EB-1A)
- NUNCA citar Kazarian (framework EB-1A; usar Dhanasar)
- NUNCA dizer "top of the field" (EB-1A; NIW = "well positioned")
- NUNCA confundir "national importance" com "national acclaim"
- NUNCA prometer resultados específicos ("I WILL generate $X" → "projected/estimated")
- NUNCA omitir PERM no Prong 3
- ANTI-CRISTINE: NUNCA usar "standardized", "self-sustaining", "plug-and-play", "replicable by any", "turnkey", "scalable without the founder"
- NUNCA expor infraestrutura (RAGs, Petition Engine, Obsidian, Claude)
- NUNCA usar terminologia jurídica (advogado, tribunal, tradução juramentada)
- Dados de mercado COM FONTE em toda afirmação
- Cada evidence block: [THUMBNAIL — Exhibit X] na célula da direita

### FORBIDDEN CONTENT (ZERO TOLERANCE):
Cat 0:  NUNCA "satisfeito/satisfaz/satisfies" sobre prongs (juízo de valor)
Cat 1:  NUNCA nomes proibidos (PROEX, Carlos Avelino, Bruno Cipriano, Renato Silveira, "Loper Light")
Cat 2:  NUNCA 3ª pessoa no corpo argumentativo ("o beneficiário") — SEMPRE 1ª pessoa ("apresento", "meu")
Cat 3:  NUNCA seção explícita "Objeções Antecipadas" — costurar no texto argumentativo
Cat 3B: NUNCA "jurídico"/"adjudicativo"/"independentes"/"Ev." — usar "regulatório"/"probatório"/"Evidence"
Cat 3C: NUNCA linguagem de existência para empresas planejadas (NOT YET established)
Cat 4:  NUNCA azul (#0000FF proibido), evidence block SEMPRE antes do texto argumentativo
Cat 5:  NUNCA Currículo Lattes, dados inventados, holdings inexistentes
Cat 8:  ZERO artefatos de produção (EXPANSÃO:, TODO:, ████, contagem de palavras, meta-instruções)
Cat 9:  ZERO URLs inventadas/truncadas

### FORMATAÇÃO OBRIGATÓRIA:
- Garamond 100% (NUNCA Arial, Calibri, Times)
- Margens: L=2.0cm, R=1.5cm, T=1.5cm, B=1.5cm
- Evidence blocks: fundo #FFF8EE (creme), Evidence XX em bold #2E7D32 (verde)
- Headers de seção: shading #D6E1DB (verde PROEX)
- Tabelas: bordas APENAS horizontais (ZERO bordas verticais)
- Footnotes: nativos do Word (<w:footnoteReference> + footnotes.xml), em português
- Imagens: wp:anchor + wrapSquare (NUNCA wp:inline — quebra tabelas)
- cantSplit=true em rows de tabelas (impede quebra de evidence blocks entre páginas)
- Footer: "EB-2 NIW | I-140 Petition — Cover Letter [CLIENT NAME] | Page X of Y"

### ANTI-CRISTINE HARD BLOCKS:
BLOCK 1: NUNCA descrever endeavor como "standardized system" ou "replicable methodology"
BLOCK 2: NUNCA sugerir que o endeavor funciona SEM o beneficiário ("self-sustaining", "plug-and-play")
BLOCK 3: NUNCA usar "turnkey solution" ou "scalable without the founder"
BLOCK 4: TODO parágrafo sobre o endeavor DEVE responder: "Por que isso não acontece sem ESTA PESSOA?"
`;

async function runCoverLetterEB2NIWPipeline(
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
  const totalPhases = 11; // 0, 0.5, 1, 2A, 2B, 3A, 3B, 4, 5, 5.5(thumbnails), 6(consolidation)

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

  let currentPhaseNum = 1;

  // ═══ PHASE 0: INVENTORY ═══
  await executePhase('0', 'Inventário e Mapeamento EB-2 NIW', `
Leia o sistema EB-2 NIW em: ${EB2_NIW_SYSTEM_PATH}/
Leia TODOS os documentos do cliente: ${clientDocsPath}
Leia RAGs EB-2 NIW em: ${RAGS_EB2}/

TAREFA: Inventário de evidências para EB-2 NIW.

1. Liste TODOS os PDFs/DOCXs na pasta do cliente
2. Para cada arquivo, identifique tipo, título, conteúdo resumido
3. Numere sequencialmente: Evidence 1, Evidence 2, ... Evidence N
4. Mapeie cada evidência para:
   - ELEGIBILIDADE: Advanced Degree ou Exceptional Ability
   - PRONG 1: Mérito substancial + importância nacional (proposed endeavor, dados mercado)
   - PRONG 2: Qualificações, experiência, track record, cartas de recomendação
   - PRONG 3: Dados de impacto econômico, PERM impraticável, benefício nacional
   - CROSS: evidências que servem múltiplos prongs
5. Identifique O*NET code do résumé
6. Identifique Proposed Endeavor (do Anteprojeto/Projeto-Base se existir)
7. Identifique endeavor geography (cidade, estado, região)
8. Identifique Business Plan (se existir)
9. Liste cartas de recomendação e seus autores
10. Relatório de gaps: quais prongs têm evidências insuficientes?

Salve: ${phasesDir}/_inventory.json
`, currentPhaseNum++);

  // ═══ PHASE 0.5: STRATEGIC PLAN ═══
  await executePhase('0.5', 'Plano Estratégico EB-2 NIW', `
Leia: ${phasesDir}/_inventory.json
Leia: ${EB2_NIW_SYSTEM_PATH}/
Leia: ${RAGS_EB2}/

TAREFA: Gerar Plano Estratégico para Cover Letter EB-2 NIW.

O plano DEVE conter:
1. PATHWAY DE ELEGIBILIDADE: Advanced Degree vs Exceptional Ability — qual usar e por quê
2. PROPOSED ENDEAVOR: Definição precisa (do Anteprojeto se disponível)
3. MAPA DE EVIDÊNCIAS POR PRONG:
   - Prong 1: quais evidências, em qual ordem
   - Prong 2: quais evidências, em qual ordem
   - Prong 3: quais evidências, em qual ordem
4. ESTRATÉGIA POR PRONG: qual é o mais forte, qual precisa de reforço
5. DEEP RESEARCH TASKS: O que pesquisar (BLS, Census, políticas federais)
6. ESTIMATIVA DE PÁGINAS:
   - Intro + Elegibilidade: ~10% (4-6 páginas)
   - Prong 1: ~30% (15-24 páginas)
   - Prong 2: ~35% (17-28 páginas)
   - Prong 3: ~20% (10-16 páginas)
   - Conclusão: ~5% (2-4 páginas)
7. CARTAS DE RECOMENDAÇÃO: lista e estratégia de uso
8. RISCOS: pontos fracos do caso + mitigação

Salve: ${phasesDir}/_strategic_plan.md
`, currentPhaseNum++);

  // ═══ PHASE 1: INTRODUCTION + EB-2 ELIGIBILITY ═══
  await executePhase('1', 'Parte I — Introdução + Elegibilidade EB-2', `
Leia o sistema em: ${EB2_NIW_SYSTEM_PATH}/
Leia ESPECIFICAMENTE: ${EB2_NIW_SYSTEM_PATH}/ARCHITECT_*.md, ${EB2_NIW_SYSTEM_PATH}/FORMATTING_SPEC*.md, ${EB2_NIW_SYSTEM_PATH}/FORBIDDEN_CONTENT*.md, ${EB2_NIW_SYSTEM_PATH}/LEGAL_FRAMEWORK*.md, ${EB2_NIW_SYSTEM_PATH}/TEMPLATE_ELIGIBILITY*.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_strategic_plan.md
Leia evidências do cliente: ${clientDocsPath}
Leia RAGs: ${RAGS_EB2}/

${TRANSVERSAL_RULES_EB2_NIW}

TAREFA: Gerar PARTE 1 da Cover Letter EB-2 NIW em python-docx.

CONTEÚDO OBRIGATÓRIO:
1. CAPA (formato carta):
   - Data à direita (formato inglês: Month DD, YYYY)
   - 'To: U.S. Citizenship and Immigration Services / Immigration Officer'
   - Bloco metadata verde #D6E1DB: Ref, Petitioner/Beneficiary, Type: I-140, Classification: EB-2 NIW, Field of Endeavor, O*NET code

2. INTRODUÇÃO (~2-3 parágrafos, 1ª pessoa):
   - Nome completo, campo, O*NET code
   - Proposed endeavor definido em 1 frase clara
   - 'I respectfully submit this I-140 petition under the EB-2 National Interest Waiver classification...'
   - Framework: Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016) — three-prong test
   - Apresentar os 3 prongs brevemente

3. ELEGIBILIDADE EB-2 (seção OBRIGATÓRIA que NÃO existe no EB-1A):
   - Advanced Degree pathway: diploma, GEO/WES evaluation, credenciais estrangeiras equivalentes
   - OU Exceptional Ability: 6 fatores de 8 C.F.R. § 204.5(k)(2) (demonstrar pelo menos 3)
   - Evidence blocks com documentação acadêmica + [THUMBNAIL — Exhibit X]
   - Esta seção DEVE ser autossuficiente — o officer deve concluir elegibilidade antes dos prongs

4. ÍNDICE DE EVIDÊNCIAS:
   - Tabela: Evidence # | Título | Tipo | Prong(s)
   - [THUMBNAIL — Exhibit XX] placeholder para CADA evidência
   - Bordas APENAS horizontais

5. PARÁGRAFO DE TRANSIÇÃO para Prong 1

Palavras alvo: 4.000-6.000
Salve: ${phasesDir}/CL_NIW_PART1_Intro.docx
`, currentPhaseNum++);

  // ═══ PHASE 2A: PRONG 1 — PART A (Proposed Endeavor + Deep Research) ═══
  await executePhase('2A', 'Prong 1 — Part A (Proposed Endeavor + Deep Research)', `
Leia o sistema em: ${EB2_NIW_SYSTEM_PATH}/
Leia: ${EB2_NIW_SYSTEM_PATH}/TEMPLATE_PRONG1*.md, ${EB2_NIW_SYSTEM_PATH}/RESEARCH_AGENT*.md, ${EB2_NIW_SYSTEM_PATH}/LEGAL_FRAMEWORK*.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_strategic_plan.md
Leia evidências do cliente relevantes a Prong 1: ${clientDocsPath}
Leia RAGs: ${RAGS_EB2}/
PESQUISE NA WEB: BLS Occupational Outlook Handbook, Census Bureau, SBA, políticas federais relevantes ao campo do beneficiário

${TRANSVERSAL_RULES_EB2_NIW}

TAREFA: Gerar PRONG 1 — PARTE A: Proposed Endeavor + Deep Research.

CONTEÚDO OBRIGATÓRIO:

1. DEFINIÇÃO DO PROPOSED ENDEAVOR:
   - Descrição técnica DETALHADA (NÃO genérica)
   - Campo de atuação + O*NET code
   - Geografia (cidade, estado, região) + alcance nacional
   - Público-alvo + vazio competitivo documentado
   - O endeavor como RESPOSTA a um problema real e documentado

2. DEEP RESEARCH — DADOS DE MERCADO:
   - TAM (Total Addressable Market) com fonte
   - SAM (Serviceable Addressable Market) com fonte
   - SOM (Serviceable Obtainable Market) com fonte
   - Dados de emprego/crescimento do setor (BLS Occupational Outlook Handbook)
   - Dados Census Bureau relevantes ao campo
   - Gap documentado que o endeavor resolve
   - 15+ fontes primárias com URLs REAIS (BLS.gov, Census.gov, SBA.gov, etc.)
   - Tabela: Fonte | Dado | Relevância

3. GAP ANALYSIS:
   - O que existe hoje no campo
   - O que está faltando (o gap)
   - Como o proposed endeavor preenche esse gap
   - Dados quantitativos do gap

Palavras alvo: 8.000-10.000
Salve: ${phasesDir}/CL_NIW_PRONG1_A.docx
`, currentPhaseNum++);

  // ═══ PHASE 2B: PRONG 1 — PART B (Federal Policies + Nexo Causal + Evidence) ═══
  await executePhase('2B', 'Prong 1 — Part B (Federal Policies + Nexo Causal)', `
Leia: ${phasesDir}/CL_NIW_PRONG1_A.docx (CONTINUIDADE — não repetir dados de mercado)
Leia: ${EB2_NIW_SYSTEM_PATH}/TEMPLATE_PRONG1*.md, ${EB2_NIW_SYSTEM_PATH}/LEGAL_FRAMEWORK*.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_strategic_plan.md
Leia evidências do cliente relevantes a Prong 1: ${clientDocsPath}
Leia RAGs: ${RAGS_EB2}/
PESQUISE NA WEB: Executive Orders, federal legislation, government programs relevantes

${TRANSVERSAL_RULES_EB2_NIW}

TAREFA: Gerar PRONG 1 — PARTE B: Federal Policies + Nexo Causal + Evidence Blocks.
CONTINUAÇÃO da Parte A — NÃO repetir definição do endeavor ou dados de mercado.

CONTEÚDO OBRIGATÓRIO:

1. POLÍTICAS FEDERAIS ALINHADAS (MÍNIMO 3):
   - Executive Orders relevantes ao campo
   - Acts / Programs federais (ex: CHIPS Act, IIJA, IRA, ARPA-H, etc.)
   - Government programs e iniciativas
   - Para CADA política: cadeia causal completa:
     Expertise do Beneficiário → Proposed Endeavor → Política Federal → Interesse Nacional
   - Citações diretas das políticas quando possível

2. NEXO CAUSAL — SUBSTANTIAL MERIT:
   - Por que o endeavor tem MÉRITO SUBSTANCIAL (qualidade intrínseca do trabalho)
   - Impacto direto e mensurável
   - Diferencial técnico/metodológico

3. NEXO CAUSAL — NATIONAL IMPORTANCE:
   - Por que tem IMPORTÂNCIA NACIONAL (escopo ALÉM do local)
   - Impacto multi-estado / multi-setor
   - Alinhamento com prioridades nacionais documentadas
   - Dhanasar: "the endeavor has both substantial merit and national importance"

4. EVIDENCE BLOCKS com [THUMBNAIL — Exhibit X]:
   - Cada evidência relevante a Prong 1
   - 'Evidence XX.' bold verde #2E7D32
   - 500-1.000 palavras por evidence block + argumentação
   - Tabela 2 colunas: texto à esquerda, [THUMBNAIL — Exhibit X] à direita

Palavras alvo: 6.000-8.000
Salve: ${phasesDir}/CL_NIW_PRONG1_B.docx
`, currentPhaseNum++);

  // ═══ PHASE 3A: PRONG 2 — PART A (Education + Credentials + Experience) ═══
  await executePhase('3A', 'Prong 2 — Part A (Education + Credentials + Experience)', `
Leia o sistema em: ${EB2_NIW_SYSTEM_PATH}/
Leia: ${EB2_NIW_SYSTEM_PATH}/TEMPLATE_PRONG2*.md, ${EB2_NIW_SYSTEM_PATH}/LEGAL_FRAMEWORK*.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_strategic_plan.md
Leia: ${phasesDir}/CL_NIW_PRONG1_A.docx, ${phasesDir}/CL_NIW_PRONG1_B.docx (para continuidade de tom e referências)
Leia evidências do cliente relevantes a Prong 2: ${clientDocsPath}
Leia RAGs: ${RAGS_EB2}/

${TRANSVERSAL_RULES_EB2_NIW}

TAREFA: Gerar PRONG 2 — PARTE A: Education, Credentials, Professional Experience.

CONTEXTO: Prong 2 demonstra que o beneficiário está BEM POSICIONADO para avançar o proposed endeavor.
Dhanasar: "the beneficiary is well positioned to advance the proposed endeavor."

CONTEÚDO OBRIGATÓRIO:

1. EDUCAÇÃO + CREDENCIAIS:
   - Graus acadêmicos com instituições, datas, GPA (se relevante)
   - Certificações profissionais (SAP, PMI, PMP, CPA, etc.)
   - Treinamentos especializados com certificados
   - GEO/WES equivalência (se aplicável)
   - Evidence blocks com documentos acadêmicos + [THUMBNAIL — Exhibit X]

2. EXPERIÊNCIA PROFISSIONAL DETALHADA:
   - Para CADA posição relevante:
     * Cargo, empresa, datas (início — fim)
     * MÉTRICAS de impacto: receita gerada/administrada, projetos liderados, equipes gerenciadas, clientes atendidos
     * Resultados QUANTIFICÁVEIS com números REAIS das evidências
     * Progressão de carreira demonstrando expertise crescente
   - NUNCA genérico — números REAIS extraídos das evidências do cliente
   - Evidence blocks com cartas de empregadores, contracheques, etc. + [THUMBNAIL — Exhibit X]

3. TRANSIÇÃO para expertise técnica na Parte B

Palavras alvo: 8.000-10.000
Salve: ${phasesDir}/CL_NIW_PRONG2_A.docx
`, currentPhaseNum++);

  // ═══ PHASE 3B: PRONG 2 — PART B (Publications + Methodology + Recommendations + Execution Plan) ═══
  await executePhase('3B', 'Prong 2 — Part B (Publications + Recommendations + Plan)', `
Leia: ${phasesDir}/CL_NIW_PRONG2_A.docx (CONTINUIDADE — não repetir educação/experiência)
Leia: ${EB2_NIW_SYSTEM_PATH}/TEMPLATE_PRONG2*.md, ${EB2_NIW_SYSTEM_PATH}/LEGAL_FRAMEWORK*.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_strategic_plan.md
Leia evidências do cliente relevantes a Prong 2: ${clientDocsPath}
Leia RAGs: ${RAGS_EB2}/

${TRANSVERSAL_RULES_EB2_NIW}

TAREFA: Gerar PRONG 2 — PARTE B: Publications, Methodology, Recommendation Letters, Execution Plan.
CONTINUAÇÃO da Parte A — NÃO repetir educação nem experiência profissional.

CONTEÚDO OBRIGATÓRIO:

1. PUBLICAÇÕES E CONTRIBUIÇÕES:
   - Artigos, livros, palestras, webinars, workshops
   - Métricas de impacto: citações, downloads, alcance, audiência
   - Relevância para o proposed endeavor
   - Evidence blocks + [THUMBNAIL — Exhibit X]

2. METODOLOGIA PROPRIETÁRIA (se houver):
   - Descrever o que é ÚNICO no approach do beneficiário
   - ANTI-CRISTINE: metodologia DEPENDE do beneficiário, não é transferível
   - Por que ninguém mais aplica este método exatamente desta forma
   - Evidence blocks demonstrando a metodologia em ação

3. CARTAS DE RECOMENDAÇÃO (todas disponíveis):
   - Para CADA carta:
     * Quem é o recomendador (nome, cargo, instituição, credenciais)
     * Relação com o beneficiário
     * CITAÇÕES DIRETAS relevantes (3-5 quotes por carta)
     * Tom FUTURO: 'The beneficiary is well positioned to...'
   - Evidence blocks com [THUMBNAIL — Exhibit X] de cada carta
   - Mínimo 3 cartas, ideal 5-7

4. PLANO DE EXECUÇÃO (FORWARD-LOOKING):
   - Como o beneficiário vai implementar o proposed endeavor nos EUA
   - Timeline estruturada:
     * Ano 1: Estabelecimento + primeiros marcos
     * Ano 3: Expansão + impacto mensurável
     * Ano 5: Escala nacional + consolidação
   - Milestones mensuráveis e verificáveis
   - Recursos necessários vs. recursos já disponíveis
   - ANTI-CRISTINE: plano DEPENDE do beneficiário — não é "plug-and-play"

5. CONCLUSÃO DO PRONG 2 (2-3 parágrafos):
   - Síntese: educação + experiência + publicações + recomendações + plano = well positioned

Palavras alvo: 8.000-10.000
Salve: ${phasesDir}/CL_NIW_PRONG2_B.docx
`, currentPhaseNum++);

  // ═══ PHASE 4: PRONG 3 — BALANCE OF EQUITIES (WAIVER) ═══
  await executePhase('4', 'Prong 3 — Balance of Equities (National Interest Waiver)', `
Leia o sistema em: ${EB2_NIW_SYSTEM_PATH}/
Leia: ${EB2_NIW_SYSTEM_PATH}/TEMPLATE_PRONG3*.md, ${EB2_NIW_SYSTEM_PATH}/LEGAL_FRAMEWORK*.md
Leia: ${phasesDir}/_inventory.json, ${phasesDir}/_strategic_plan.md
Leia Prongs anteriores para continuidade:
${phasesDir}/CL_NIW_PRONG1_A.docx
${phasesDir}/CL_NIW_PRONG1_B.docx
${phasesDir}/CL_NIW_PRONG2_A.docx
${phasesDir}/CL_NIW_PRONG2_B.docx
Leia evidências do cliente: ${clientDocsPath}
Leia RAGs: ${RAGS_EB2}/
PESQUISE NA WEB: BLS JOLTS data, PERM processing times, visa backlogs

${TRANSVERSAL_RULES_EB2_NIW}

TAREFA: Gerar PRONG 3 — Balance of Equities (National Interest Waiver).

CONTEXTO: Prong 3 é o WAIVER propriamente dito. Demonstra que aprovar SEM labor certification serve ao interesse nacional.
Dhanasar: "on balance, it would be beneficial to the United States to waive the requirements of a job offer and thus of a labor certification."

ESTRUTURA (4 FRENTES OBRIGATÓRIAS):

A. IMPRATICABILIDADE DO PERM (OBRIGATÓRIO — omissão = denial):
   - Self-employment / empreendedorismo proprietário: o beneficiário não pode patrocinar a si mesmo
   - Escopo multi-empregador / multi-cliente: labor certification para empregador único não reflete a natureza do trabalho
   - Timeline PERM (2-3 anos atualmente) vs. urgência do endeavor
   - 'The very nature of the proposed endeavor precludes the traditional labor certification process'
   - Dados de processing time do PERM (DOL statistics)

B. BENEFÍCIO NACIONAL > PROTEÇÃO DO MERCADO DE TRABALHO:
   - Empregos projetados a serem criados (quantificar com bases realistas)
   - Receita estimada / impostos projetados (usar "projected/estimated", NUNCA "will generate")
   - Multiplicador econômico (NAICS, BEA data)
   - Impacto na cadeia de valor do setor
   - 'The United States gains more by approving this petition than by denying it'

C. PRECEDENTES JURISPRUDENCIAIS:
   - Matter of Dhanasar: 'it would be impractical to require labor certification'
   - Matter of NYSDOT: endeavors de interesse público
   - Casos AAO recentes relevantes (se encontrados na pesquisa)
   - NUNCA citar Kazarian (framework EB-1A)

D. URGÊNCIA:
   - Janela de oportunidade que se fecha
   - Skill shortage documentado no campo (BLS JOLTS data + Occupational Outlook)
   - Competição internacional por talento (Canadá Express Entry, UK Global Talent, Austrália)
   - Gap que se AGRAVA enquanto espera PERM
   - Timeline: o que acontece se o beneficiário NÃO obtiver o waiver nos próximos 2-3 anos

ANTI-CRISTINE OBRIGATÓRIO EM PRONG 3:
- Expertise do beneficiário é INSUBSTITUÍVEL para este endeavor
- Endeavor NÃO funciona sem esta pessoa específica
- NUNCA "standardized", "self-sustaining", "plug-and-play", "replicable by any"
- NUNCA "the system runs without the founder"

Evidence blocks relevantes com [THUMBNAIL — Exhibit X]

Palavras alvo: 8.000-12.000
Salve: ${phasesDir}/CL_NIW_PRONG3.docx
`, currentPhaseNum++);

  // ═══ PHASE 5: CONCLUSION + EVIDENCE INDEX ═══
  await executePhase('5', 'Conclusão + Evidence Index', `
Leia todos os Prongs gerados:
${phasesDir}/CL_NIW_PART1_Intro.docx
${phasesDir}/CL_NIW_PRONG1_A.docx
${phasesDir}/CL_NIW_PRONG1_B.docx
${phasesDir}/CL_NIW_PRONG2_A.docx
${phasesDir}/CL_NIW_PRONG2_B.docx
${phasesDir}/CL_NIW_PRONG3.docx
Leia: ${phasesDir}/_inventory.json

${TRANSVERSAL_RULES_EB2_NIW}

TAREFA: Gerar Conclusão + Evidence Index da Cover Letter EB-2 NIW.

CONTEÚDO OBRIGATÓRIO:

1. SÍNTESE DOS 3 PRONGS (3-4 parágrafos):
   - Prong 1: O proposed endeavor do beneficiário tem mérito substancial e importância nacional
   - Prong 2: O beneficiário está bem posicionado para avançar o proposed endeavor
   - Prong 3: No balanço, dispensar a labor certification serve ao interesse nacional
   - Conectar os 3 prongs como CUMULATIVOS: a aprovação conjunta é a conclusão lógica

2. PEDIDO DE APROVAÇÃO:
   - 'For the foregoing reasons, the Petitioner respectfully requests that this I-140 petition be approved...'
   - Referência ao framework Dhanasar
   - Assinatura formal

3. EVIDENCE INDEX (tabela completa):
   - Tabela: Evidence # | Title | Type | Prong(s) Served
   - [THUMBNAIL — Exhibit XX] para CADA evidência
   - Bordas APENAS horizontais
   - Ordenada sequencialmente (Evidence 1, 2, 3, ...)
   - Incluir TODAS as evidências mencionadas ao longo do documento

Palavras alvo: 2.000-3.000
Salve: ${phasesDir}/CL_NIW_CONCLUSION.docx
`, currentPhaseNum++);

  // ═══ PHASE 5.5: THUMBNAILS ═══
  send('stage', { stage: 'phase', phase: '5.5', message: 'FASE 5.5: INSERÇÃO DE THUMBNAILS', progress: Math.round((currentPhaseNum / totalPhases) * 100) });
  upsertGeneration({ id: genId, current_phase: 'phase_5.5', current_phase_label: 'Thumbnails' });

  if (existsSync(INSERT_THUMBNAILS_PATH)) {
    const docxFiles = existsSync(phasesDir)
      ? readdirSync(phasesDir).filter(f => f.startsWith('CL_NIW_') && f.endsWith('.docx'))
      : [];

    let thumbnailSuccesses = 0;
    let thumbnailFailures = 0;

    for (const docxFile of docxFiles) {
      const fullPath = path.join(phasesDir, docxFile);
      try {
        send('stage', { stage: 'loading', phase: '5.5', message: `Inserindo thumbnails: ${docxFile}` });
        execSync(`python3 "${INSERT_THUMBNAILS_PATH}" "${fullPath}" "${clientDocsPath}"`, {
          encoding: 'utf-8',
          timeout: 120000,
        });
        thumbnailSuccesses++;
      } catch (err) {
        thumbnailFailures++;
        send('stage', { stage: 'warning', phase: '5.5', message: `Thumbnail falhou para ${docxFile}: ${(err as Error).message?.slice(0, 100)}` });
      }
    }

    send('stage', { stage: 'gen_complete', phase: '5.5', message: `Thumbnails: ${thumbnailSuccesses} ok, ${thumbnailFailures} falhas` });
    phaseResults.push({
      phase: '5.5',
      label: 'Thumbnails',
      success: thumbnailFailures === 0,
      duration_seconds: 0,
      files_created: [],
      error: thumbnailFailures > 0 ? `${thumbnailFailures} arquivos falharam` : undefined,
    });
  } else {
    send('stage', { stage: 'warning', phase: '5.5', message: `Script insert_thumbnails.py nao encontrado: ${INSERT_THUMBNAILS_PATH}` });
    phaseResults.push({ phase: '5.5', label: 'Thumbnails', success: false, duration_seconds: 0, files_created: [], error: 'Script nao encontrado' });
  }
  currentPhaseNum++;

  // ═══ PHASE 6: CONSOLIDATION (XML MERGE) ═══
  const mergeOrderList: string[] = [
    `${phasesDir}/CL_NIW_PART1_Intro.docx`,
    `${phasesDir}/CL_NIW_PRONG1_A.docx`,
    `${phasesDir}/CL_NIW_PRONG1_B.docx`,
    `${phasesDir}/CL_NIW_PRONG2_A.docx`,
    `${phasesDir}/CL_NIW_PRONG2_B.docx`,
    `${phasesDir}/CL_NIW_PRONG3.docx`,
    `${phasesDir}/CL_NIW_CONCLUSION.docx`,
  ];

  // Filter to only files that actually exist
  const existingMergeFiles = mergeOrderList.filter(f => existsSync(f));
  const consolidatedName = `Cover_Letter_EB2_NIW_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}_CONSOLIDATED.docx`;

  await executePhase('6', 'Consolidação XML Merge', `
TAREFA: Consolidar todos os .docx em 1 documento único.

ORDEM DE MERGE (arquivos existentes):
${existingMergeFiles.map((f, i) => `${i + 1}. ${f}`).join('\n')}

REGRAS DE MERGE:
1. NÃO usar docxcompose — PERDE IMAGENS
2. Merge XML:
   a) Unzip todos os .docx
   b) Primeiro = base
   c) Para cada adicional: copiar media/ (renomear se conflito), atualizar rIds, copiar body (exceto sectPr final)
   d) Page break entre documentos (APENAS antes de PRONG e CONCLUSÃO)
   e) Repack ZIP → .docx
3. wp:inline → wp:anchor + wrapSquare (todas as imagens)
4. cantSplit=true em todas as rows de tabelas
5. tblW w='5000' type='pct' + jc val='center'
6. Verificar contagem imagens antes/depois (DEVE ser igual)
7. Paginação contínua
8. Footer: 'EB-2 NIW | I-140 Petition — Cover Letter ${clientName} | Page X of Y'

Salve: ${outputDir}/${consolidatedName}
`, currentPhaseNum++);

  // ═══ PHASE 6.5: VALIDATION ═══
  const consolidatedPath = path.join(outputDir, consolidatedName);
  const validateScriptPath = path.join(process.cwd(), 'scripts', 'validate_final_docx.py');

  send('stage', { stage: 'phase', phase: '6.5', message: 'FASE 6.5: VALIDAÇÃO AUTOMATIZADA', progress: Math.round((currentPhaseNum / totalPhases) * 100) });
  upsertGeneration({ id: genId, current_phase: 'phase_6.5', current_phase_label: 'Validação Automatizada' });

  if (existsSync(consolidatedPath) && existsSync(validateScriptPath)) {
    try {
      const validateOutput = execSync(`python3 "${validateScriptPath}" "${consolidatedPath}"`, {
        encoding: 'utf-8',
        timeout: 120000,
      });
      send('stage', { stage: 'gen_complete', phase: '6.5', message: `Validacao concluida: ${validateOutput.trim().slice(0, 200)}` });
      phaseResults.push({ phase: '6.5', label: 'Validação', success: true, duration_seconds: 0, files_created: [] });
    } catch (err) {
      const errMsg = (err as Error).message?.slice(0, 200) || 'Erro desconhecido';
      send('stage', { stage: 'warning', phase: '6.5', message: `Validacao falhou: ${errMsg}` });
      phaseResults.push({ phase: '6.5', label: 'Validação', success: false, duration_seconds: 0, files_created: [], error: errMsg });
    }
  } else if (!existsSync(consolidatedPath)) {
    send('stage', { stage: 'warning', phase: '6.5', message: `DOCX consolidado nao encontrado: ${consolidatedPath}` });
    phaseResults.push({ phase: '6.5', label: 'Validação', success: false, duration_seconds: 0, files_created: [], error: 'DOCX consolidado nao existe' });
  } else {
    send('stage', { stage: 'warning', phase: '6.5', message: `Script de validacao nao encontrado: ${validateScriptPath}. Pulando.` });
    phaseResults.push({ phase: '6.5', label: 'Validação', success: false, duration_seconds: 0, files_created: [], error: 'Script nao encontrado' });
  }
  currentPhaseNum++;

  // ═══ PHASE 7: SEPARATION OF CONCERNS ═══
  const docToReview = existsSync(consolidatedPath) ? consolidatedPath : existingMergeFiles[existingMergeFiles.length - 1] || '';

  if (docToReview) {
    await executePhase('7', 'Separation of Concerns — Revisão Cruzada', `
Leia ${SOC_PATH} secao 'PROTOCOLO DE REVISAO' e execute a revisao completa do documento: ${docToReview}
Use os padroes de qualidade em: ${QUALITY_PATH}

ATENÇÃO: Este é um documento EB-2 NIW (Dhanasar framework).
- Se encontrar "extraordinary ability", "Kazarian", "top of the field" → VIOLAÇÃO CRÍTICA
- Se encontrar PERM não endereçado no Prong 3 → VIOLAÇÃO CRÍTICA
- Se encontrar "standardized", "self-sustaining", "plug-and-play" → VIOLAÇÃO ANTI-CRISTINE
`, currentPhaseNum++);
  } else {
    send('stage', { stage: 'warning', phase: '7', message: 'Nenhum documento para revisar — pulando SoC' });
    phaseResults.push({ phase: '7', label: 'SoC Review', success: false, duration_seconds: 0, files_created: [], error: 'Nenhum documento para revisar' });
  }

  // Write pipeline summary
  const summaryPath = path.join(phasesDir, '_pipeline_summary.json');
  try {
    writeFileSync(summaryPath, JSON.stringify({
      client_name: clientName,
      doc_type: 'cover_letter_eb2_niw',
      framework: 'Dhanasar three-prong',
      total_duration_seconds: Math.round((Date.now() - startTime) / 1000),
      total_phases: phaseResults.length,
      phases_succeeded: phaseResults.filter(p => p.success).length,
      phases_failed: phaseResults.filter(p => !p.success).length,
      phases: ['0-Inventory', '0.5-Strategic Plan', '1-Intro+Eligibility', '2A-Prong1 PartA', '2B-Prong1 PartB', '3A-Prong2 PartA', '3B-Prong2 PartB', '4-Prong3', '5-Conclusion', '5.5-Thumbnails', '6-Consolidation', '6.5-Validation', '7-SoC'],
      results: phaseResults,
    }, null, 2), 'utf-8');
  } catch {}

  return {
    success: phaseResults.filter(p => p.success).length > phaseResults.length / 2,
    phaseResults,
    allFiles: allFiles.filter((v, i, a) => a.indexOf(v) === i),
  };
}


export { runCoverLetterEB2NIWPipeline };
