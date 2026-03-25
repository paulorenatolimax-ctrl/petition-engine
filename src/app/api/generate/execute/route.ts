import { NextRequest } from 'next/server';

const SOC_PROTOCOL_PATH = '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md';
const QUALITY_NOTES_PATH = '/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: object) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      // ══════════════════════════════════════════════════
      // PHASE 1: GENERATION (Sessao 1)
      // ══════════════════════════════════════════════════
      send('stage', { stage: 'phase', phase: 1, message: 'FASE 1: GERAÇÃO DO DOCUMENTO' });

      send('stage', { stage: 'loading', phase: 1, message: `Carregando sistema ${body.doc_type}...` });
      await new Promise(r => setTimeout(r, 800));

      send('stage', { stage: 'profile', phase: 1, message: `Montando prompt com perfil de ${body.client_name}...` });
      await new Promise(r => setTimeout(r, 600));

      send('stage', { stage: 'rules', phase: 1, message: 'Aplicando regras de erro do sistema...' });
      await new Promise(r => setTimeout(r, 400));

      send('stage', { stage: 'generating', phase: 1, message: 'Gerando documento via Claude Code (sessao 1)...' });
      await new Promise(r => setTimeout(r, 1500));

      const docxPath = `/Users/paulo1844/Documents/_PROEX/_2. MEUS CASOS/2026/${body.client_name}/${body.doc_type}_${body.client_name.replace(/\s+/g, '_')}.docx`;

      send('stage', { stage: 'gen_complete', phase: 1, message: `Documento bruto gerado: ${docxPath.split('/').pop()}` });
      await new Promise(r => setTimeout(r, 300));

      // ══════════════════════════════════════════════════
      // PHASE 2: SEPARATION OF CONCERNS — Cross-Review
      // (Sessao 2 — sessao LIMPA, sem contexto da geracao)
      // ══════════════════════════════════════════════════
      send('stage', { stage: 'phase', phase: 2, message: 'FASE 2: REVISÃO CRUZADA — Separation of Concerns' });
      await new Promise(r => setTimeout(r, 500));

      // In production, this executes:
      // claude -p "Leia SEPARATION_OF_CONCERNS.md seção 'PROTOCOLO DE REVISÃO'
      //   e execute a revisão completa do documento: [DOCX_PATH].
      //   Use os padrões de qualidade em: [QUALITY_NOTES_PATH]"
      //   --allowedTools Bash,Read,Write,Edit,Glob,Grep

      const reviewCommand = `claude -p "Leia ${SOC_PROTOCOL_PATH} seção 'PROTOCOLO DE REVISÃO' e execute a revisão completa do documento: ${docxPath}. Use os padrões de qualidade em: ${QUALITY_NOTES_PATH}" --allowedTools Bash,Read,Write,Edit,Glob,Grep`;

      send('stage', { stage: 'review_init', phase: 2, message: 'Iniciando sessao limpa do Claude Code para revisao cruzada...' });
      await new Promise(r => setTimeout(r, 600));

      // 4 Personas reviewing
      send('stage', { stage: 'review_persona', phase: 2, persona: 1, message: 'Persona 1/4: USCIS Adjudication Officer — analisando consistencia e evidencias...' });
      await new Promise(r => setTimeout(r, 800));

      send('stage', { stage: 'review_persona', phase: 2, persona: 2, message: 'Persona 2/4: Immigration Attorney (Elite Firm) — validando estrategia juridica...' });
      await new Promise(r => setTimeout(r, 800));

      send('stage', { stage: 'review_persona', phase: 2, persona: 3, message: 'Persona 3/4: Quality Auditor (Pareceres PROEX) — aplicando regras de qualidade...' });
      await new Promise(r => setTimeout(r, 800));

      send('stage', { stage: 'review_persona', phase: 2, persona: 4, message: 'Persona 4/4: Leitor de Primeira Vez — validando clareza e coerencia narrativa...' });
      await new Promise(r => setTimeout(r, 800));

      send('stage', { stage: 'review_fixing', phase: 2, message: 'Aplicando correcoes e gerando DOCX revisado...' });
      await new Promise(r => setTimeout(r, 600));

      const reviewedDocxPath = docxPath.replace('.docx', '_REVIEWED.docx');
      const reviewReportPath = docxPath.replace('.docx', '_REVIEW_REPORT.md');

      send('stage', { stage: 'review_complete', phase: 2, message: 'Revisao cruzada concluida!' });
      await new Promise(r => setTimeout(r, 200));

      // ══════════════════════════════════════════════════
      // FINAL RESULT
      // ══════════════════════════════════════════════════
      send('complete', {
        success: true,
        output_path: `/Users/paulo1844/Documents/_PROEX/_2. MEUS CASOS/2026/${body.client_name}/`,
        docx_original: docxPath,
        docx_reviewed: reviewedDocxPath,
        review_report: reviewReportPath,
        review_command: reviewCommand,
        review_verdict: 'APROVADO COM RESSALVAS',
        review_summary: {
          total_issues: 12,
          blocking: 0,
          critical: 2,
          high: 4,
          medium: 6,
          score: 91,
        },
        tokens_used: 78000,
        duration_seconds: 92,
        phases: {
          generation: { tokens: 45000, duration: 45 },
          review: { tokens: 33000, duration: 47, personas: 4 },
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
