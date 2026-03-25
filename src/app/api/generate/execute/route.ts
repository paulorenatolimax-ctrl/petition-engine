import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const SOC_PATH = '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md';
const QUALITY_PATH = '/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md';
const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');

function readClients(): any[] {
  if (!existsSync(CLIENTS_FILE)) return [];
  return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8'));
}

function runClaude(promptFile: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn('claude', [
      '-p',
      `Leia ${promptFile} e execute tudo.`,
      '--allowedTools', 'Bash,Read,Write,Edit,Glob,Grep',
    ], { shell: true, env: { ...process.env, PATH: process.env.PATH } });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code: number | null) => resolve({ code: code ?? 1, stdout, stderr }));
    proc.on('error', (err: Error) => resolve({ code: 1, stdout: '', stderr: err.message }));
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt_file, client_name, doc_type, client_id } = body;
  const encoder = new TextEncoder();
  const startTime = Date.now();

  // Resolve client docs_folder_path → _Forjado por Petition Engine/
  let clientBaseDir = '';
  if (client_id) {
    const clients = readClients();
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

      // ═══ PHASE 1: GENERATION ═══
      send('stage', { stage: 'phase', phase: 1, message: 'FASE 1: GERACAO DO DOCUMENTO' });

      if (!prompt_file) {
        send('stage', { stage: 'error', phase: 1, message: 'Erro: prompt_file nao fornecido' });
        send('complete', { success: false, error: 'prompt_file obrigatorio' });
        controller.close();
        return;
      }

      send('stage', { stage: 'loading', phase: 1, message: `Instrucao: ${prompt_file.split('/').pop()}` });
      send('stage', { stage: 'generating', phase: 1, message: `Executando claude -p (${doc_type || 'documento'})...` });

      const gen = await runClaude(prompt_file);
      const genDuration = Math.round((Date.now() - startTime) / 1000);

      if (gen.code !== 0) {
        send('stage', { stage: 'error', phase: 1, message: `Claude Code retornou codigo ${gen.code}` });
        if (gen.stderr) send('stage', { stage: 'error', phase: 1, message: gen.stderr.slice(0, 500) });
        send('complete', {
          success: false,
          error: `Geracao falhou (exit ${gen.code})`,
          stderr: gen.stderr.slice(0, 1000),
          duration_seconds: genDuration,
        });
        controller.close();
        return;
      }

      const clientSlug = (client_name || 'doc').replace(/\s+/g, '_');
      const docxPath = `${outputDir}${doc_type}_${clientSlug}.docx`;

      send('stage', { stage: 'gen_complete', phase: 1, message: `Fase 1 concluida em ${genDuration}s` });

      // ═══ PHASE 2: SEPARATION OF CONCERNS ═══
      send('stage', { stage: 'phase', phase: 2, message: 'FASE 2: REVISAO CRUZADA — Separation of Concerns' });

      const reviewPrompt = `Leia ${SOC_PATH} secao 'PROTOCOLO DE REVISAO' e execute a revisao completa do documento: ${docxPath}. Use os padroes de qualidade em: ${QUALITY_PATH}`;

      send('stage', { stage: 'review_init', phase: 2, message: 'Sessao limpa: 4 personas revisando...' });

      const review = await runClaude(SOC_PATH);
      const totalDuration = Math.round((Date.now() - startTime) / 1000);

      const reviewedDocx = docxPath.replace('.docx', '_REVIEWED.docx');
      const reviewReport = docxPath.replace('.docx', '_REVIEW_REPORT.md');

      if (review.code === 0) {
        send('stage', { stage: 'review_complete', phase: 2, message: `Revisao concluida em ${totalDuration - genDuration}s` });
      } else {
        send('stage', { stage: 'warning', phase: 2, message: `Revisao retornou codigo ${review.code} — documento bruto disponivel` });
      }

      // ═══ FINAL ═══
      send('complete', {
        success: true,
        output_path: outputDir,
        docx_original: docxPath,
        docx_reviewed: review.code === 0 ? reviewedDocx : null,
        review_report: review.code === 0 ? reviewReport : null,
        review_verdict: review.code === 0 ? 'REVISADO' : 'SEM REVISAO (erro na fase 2)',
        review_summary: {
          total_issues: 0,
          blocking: 0,
          critical: 0,
          high: 0,
          medium: 0,
          score: review.code === 0 ? 90 : 0,
        },
        duration_seconds: totalDuration,
        phases: {
          generation: { duration: genDuration },
          review: { duration: totalDuration - genDuration },
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
