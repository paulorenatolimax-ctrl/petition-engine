import { NextRequest } from 'next/server';
import { spawn, execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import path from 'path';

const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readClients(): any[] {
  if (!existsSync(CLIENTS_FILE)) return [];
  try { return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8')); } catch { return []; }
}

function findSaasDocx(clientFolder: string): string | null {
  // Search for existing SaaS Evidence DOCX in _Forjado folder
  const forjado = path.join(clientFolder, '_Forjado por Petition Engine');
  if (!existsSync(forjado)) return null;

  try {
    const files = readdirSync(forjado)
      .filter(f => f.endsWith('.docx') && !f.startsWith('~$'))
      .filter(f => f.toLowerCase().includes('saas') || f.toLowerCase().includes('evidence'));

    // Prefer non-PREMIUM, non-REVIEWED, non-WITH_SCREENSHOTS versions (the base document)
    const base = files.find(f =>
      !f.includes('PREMIUM') && !f.includes('REVIEWED') && !f.includes('WITH_SCREENSHOTS')
    );
    if (base) return path.join(forjado, base);

    // Fallback to any match
    if (files.length > 0) return path.join(forjado, files[0]);
  } catch {}

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, client_id } = body;

    if (!url || !client_id) {
      return new Response(JSON.stringify({ error: 'url e client_id são obrigatórios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const clients = readClients();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = clients.find((c: any) => c.id === client_id);
    const clientName = client?.name || 'Cliente';
    const clientFolder = client?.docs_folder_path || '';
    const visaType = client?.visa_type || 'EB-2 NIW';

    // Output directory: inside client's _Forjado folder
    const forjadoDir = clientFolder
      ? path.join(clientFolder, '_Forjado por Petition Engine')
      : path.join(process.cwd(), 'data', 'output', client_id);

    const outputDir = path.join(forjadoDir, 'SaaS_Evidence');
    const scriptPath = path.join(process.cwd(), 'scripts', 'capture_saas.js');
    const insertScript = path.join(process.cwd(), 'scripts', 'insert_saas_screenshots.py');

    if (!existsSync(scriptPath)) {
      return new Response(JSON.stringify({ error: 'Script capture_saas.js não encontrado' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Auto-find existing SaaS Evidence DOCX
    const existingDocx = clientFolder ? findSaasDocx(clientFolder) : null;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        function send(event: string, data: string) {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        }

        send('progress', JSON.stringify({
          phase: 'init',
          message: `Iniciando captura para ${clientName}...`,
          existing_docx: existingDocx ? path.basename(existingDocx) : null,
        }));

        // ═══ ETAPA B-1: Capture Screenshots ═══
        send('progress', JSON.stringify({
          phase: 'capture_start',
          message: `ETAPA 1/2: Capturando screenshots de ${url}`,
        }));

        const captureProc = spawn('node', [scriptPath, url, outputDir, clientName], {
          cwd: process.cwd(),
          env: { ...process.env, NODE_ENV: 'production' },
        });

        let captureOutput = '';
        const screenshots: string[] = [];

        captureProc.stdout.on('data', (chunk: Buffer) => {
          const text = chunk.toString();
          captureOutput += text;

          const lines = text.split('\n').filter((l: string) => l.trim());
          for (const line of lines) {
            const screenshotMatch = line.match(/SaaS_\d+[^\s(]+\.png/);
            if (screenshotMatch) {
              screenshots.push(screenshotMatch[0]);
              send('screenshot', JSON.stringify({
                file: screenshotMatch[0],
                total: screenshots.length,
                message: line.trim(),
              }));
            }

            if (line.includes('Phase') || line.includes('unique') || line.includes('COMPLETA')) {
              send('progress', JSON.stringify({
                phase: 'capturing',
                message: line.trim(),
              }));
            }
          }
        });

        captureProc.stderr.on('data', (chunk: Buffer) => {
          const text = chunk.toString().trim();
          if (text) send('progress', JSON.stringify({ phase: 'warning', message: text }));
        });

        captureProc.on('close', (code: number | null) => {
          if (code !== 0 && code !== null) {
            send('error', JSON.stringify({
              message: `Captura falhou (exit ${code})`,
              output: captureOutput.slice(-500),
            }));
            controller.close();
            return;
          }

          send('progress', JSON.stringify({
            phase: 'capture_done',
            message: `Captura concluída: ${screenshots.length} screenshots`,
            screenshots,
          }));

          // ═══ ETAPA B-2: Insert into DOCX with Premium Design ═══
          const docxToProcess = existingDocx || (body.docx_path && existsSync(body.docx_path) ? body.docx_path : null);

          if (!docxToProcess) {
            send('progress', JSON.stringify({
              phase: 'no_docx',
              message: 'Nenhum DOCX de SaaS Evidence encontrado. Screenshots salvos — gere o documento pelo /gerador primeiro.',
            }));
            send('done', JSON.stringify({
              success: true,
              screenshots,
              screenshots_dir: path.join(outputDir, 'screenshots'),
              output_dir: outputDir,
              total: screenshots.length,
              output_docx: null,
              needs_docx: true,
            }));
            controller.close();
            return;
          }

          send('progress', JSON.stringify({
            phase: 'insert_start',
            message: `ETAPA 2/2: Inserindo ${screenshots.length} screenshots em ${path.basename(docxToProcess)}`,
          }));

          const screenshotsDir = path.join(outputDir, 'screenshots');
          const mapFile = path.join(outputDir, 'screenshot_map.json');
          const insertArgs = [
            insertScript, docxToProcess, screenshotsDir,
            '--premium',
            '--client', clientName,
            '--visa', visaType,
          ];
          if (existsSync(mapFile)) {
            insertArgs.push('--map', mapFile);
          }

          const insertProc = spawn('python3', insertArgs, {
            cwd: process.cwd(),
            env: process.env,
          });

          let insertOutput = '';

          insertProc.stdout.on('data', (chunk: Buffer) => {
            const text = chunk.toString();
            insertOutput += text;
            const lines = text.split('\n').filter((l: string) => l.trim());
            for (const line of lines) {
              if (line.includes('✓') || line.includes('Figure') || line.includes('COMPLETA') || line.includes('Inserted') || line.includes('Output')) {
                send('progress', JSON.stringify({
                  phase: 'inserting',
                  message: line.trim(),
                }));
              }
            }
          });

          insertProc.stderr.on('data', (chunk: Buffer) => {
            send('progress', JSON.stringify({ phase: 'insert_warning', message: chunk.toString().trim() }));
          });

          insertProc.on('close', (insertCode: number | null) => {
            // Find output DOCX
            let outputDocx = docxToProcess.replace('.docx', '_PREMIUM.docx');
            const outputMatch = insertOutput.match(/Output:\s*(.+\.docx)/);
            if (outputMatch) outputDocx = outputMatch[1].trim();

            send('done', JSON.stringify({
              success: insertCode === 0,
              screenshots,
              screenshots_dir: screenshotsDir,
              output_dir: outputDir,
              output_docx: insertCode === 0 && existsSync(outputDocx) ? outputDocx : null,
              source_docx: docxToProcess,
              total: screenshots.length,
              client_name: clientName,
            }));
            controller.close();
          });

          insertProc.on('error', (err: Error) => {
            send('error', JSON.stringify({ message: `Erro no insert: ${err.message}` }));
            controller.close();
          });
        });

        captureProc.on('error', (err: Error) => {
          send('error', JSON.stringify({ message: `Erro ao iniciar captura: ${err.message}` }));
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Erro interno: ${(error as Error).message}` }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
