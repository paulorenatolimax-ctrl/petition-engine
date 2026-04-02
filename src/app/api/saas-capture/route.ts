import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readClients(): any[] {
  if (!existsSync(CLIENTS_FILE)) return [];
  try { return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8')); } catch { return []; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, client_id, docx_path } = body;

    if (!url || !client_id) {
      return new Response(JSON.stringify({ error: 'url e client_id são obrigatórios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Resolve client info
    const clients = readClients();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = clients.find((c: any) => c.id === client_id);
    const clientName = client?.name || 'Cliente';
    const clientFolder = client?.docs_folder_path || '';

    // Output directory: client folder or fallback
    const outputDir = clientFolder
      ? path.join(clientFolder, 'screenshots')
      : path.join(process.cwd(), 'data', 'screenshots', client_id);

    const scriptPath = path.join(process.cwd(), 'scripts', 'capture_saas.js');
    const insertScript = path.join(process.cwd(), 'scripts', 'insert_saas_screenshots.py');

    if (!existsSync(scriptPath)) {
      return new Response(JSON.stringify({ error: 'Script capture_saas.js não encontrado' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        function send(event: string, data: string) {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        }

        send('progress', JSON.stringify({ phase: 'starting', message: 'Iniciando captura de screenshots...' }));

        // Run capture_saas.js
        const captureProc = spawn('node', [scriptPath, url, outputDir, clientName], {
          cwd: process.cwd(),
          env: { ...process.env, NODE_ENV: 'production' },
        });

        let captureOutput = '';
        const screenshots: string[] = [];

        captureProc.stdout.on('data', (chunk: Buffer) => {
          const text = chunk.toString();
          captureOutput += text;

          // Parse progress lines from capture_saas.js
          const lines = text.split('\n').filter((l: string) => l.trim());
          for (const line of lines) {
            // Screenshot captured lines: "✓ SaaS_01_Landing_Page.png — ..."
            const screenshotMatch = line.match(/SaaS_\d+_[^\s]+\.png/);
            if (screenshotMatch) {
              screenshots.push(screenshotMatch[0]);
              send('screenshot', JSON.stringify({
                file: screenshotMatch[0],
                total: screenshots.length,
              }));
            }

            // Route discovery lines
            if (line.includes('Checking route') || line.includes('Navigating') || line.includes('Found')) {
              send('progress', JSON.stringify({
                phase: 'capturing',
                message: line.trim(),
              }));
            }

            // General progress
            if (line.includes('Starting') || line.includes('Complete') || line.includes('pages found')) {
              send('progress', JSON.stringify({
                phase: 'capturing',
                message: line.trim(),
              }));
            }
          }
        });

        captureProc.stderr.on('data', (chunk: Buffer) => {
          const text = chunk.toString().trim();
          if (text) {
            send('progress', JSON.stringify({ phase: 'warning', message: text }));
          }
        });

        captureProc.on('close', (code: number | null) => {
          if (code !== 0 && code !== null) {
            send('error', JSON.stringify({
              message: `Captura falhou com código ${code}`,
              output: captureOutput.slice(-500),
            }));
            controller.close();
            return;
          }

          send('progress', JSON.stringify({
            phase: 'capture_done',
            message: `Captura concluída: ${screenshots.length} screenshots`,
            screenshots,
            output_dir: outputDir,
          }));

          // Optionally insert into DOCX
          if (docx_path && existsSync(insertScript)) {
            send('progress', JSON.stringify({
              phase: 'inserting',
              message: `Inserindo screenshots no DOCX: ${path.basename(docx_path)}`,
            }));

            const screenshotsDir = path.join(outputDir, 'screenshots');
            const mapFile = path.join(outputDir, 'screenshot_map.json');
            const insertArgs = [insertScript, docx_path, screenshotsDir];
            if (existsSync(mapFile)) {
              insertArgs.push('--map', mapFile);
            }

            const insertProc = spawn('python3', insertArgs, {
              cwd: process.cwd(),
              env: process.env,
            });

            let insertOutput = '';

            insertProc.stdout.on('data', (chunk: Buffer) => {
              insertOutput += chunk.toString();
              send('progress', JSON.stringify({
                phase: 'inserting',
                message: chunk.toString().trim(),
              }));
            });

            insertProc.stderr.on('data', (chunk: Buffer) => {
              send('progress', JSON.stringify({
                phase: 'insert_warning',
                message: chunk.toString().trim(),
              }));
            });

            insertProc.on('close', (insertCode: number | null) => {
              // Find the output DOCX (usually *_WITH_SCREENSHOTS.docx)
              let outputDocx = docx_path;
              const match = insertOutput.match(/Saved.*?:\s*(.+\.docx)/);
              if (match) outputDocx = match[1].trim();

              send('done', JSON.stringify({
                success: insertCode === 0,
                screenshots,
                screenshots_dir: screenshotsDir,
                output_dir: outputDir,
                output_docx: insertCode === 0 ? outputDocx : null,
                total: screenshots.length,
              }));
              controller.close();
            });
          } else {
            // No DOCX insertion — done
            send('done', JSON.stringify({
              success: true,
              screenshots,
              screenshots_dir: path.join(outputDir, 'screenshots'),
              output_dir: outputDir,
              total: screenshots.length,
            }));
            controller.close();
          }
        });

        captureProc.on('error', (err: Error) => {
          send('error', JSON.stringify({ message: `Erro ao iniciar script: ${err.message}` }));
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Erro interno: ${(error as Error).message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
