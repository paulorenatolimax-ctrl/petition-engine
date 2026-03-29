import { NextRequest } from 'next/server';
import { execSync, spawn } from 'child_process';
import { readFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'fs';
import path from 'path';

const SOC_PATH = '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md';
const QUALITY_PATH = '/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md';
const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');
const GENERATIONS_FILE = path.join(process.cwd(), 'data', 'generations.json');

function readGenerations(): any[] {
  if (!existsSync(GENERATIONS_FILE)) return [];
  try { return JSON.parse(readFileSync(GENERATIONS_FILE, 'utf-8')); } catch { return []; }
}

function writeGenerations(gens: any[]) {
  const { writeFileSync: wfs } = require('fs');
  wfs(GENERATIONS_FILE, JSON.stringify(gens, null, 2), 'utf-8');
}

function upsertGeneration(gen: any) {
  const gens = readGenerations();
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

function readClients(): any[] {
  if (!existsSync(CLIENTS_FILE)) return [];
  return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8'));
}

function findNewDocx(dir: string, afterMs: number): string[] {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.docx') || f.endsWith('.pptx'))
      .map(f => path.join(dir, f))
      .filter(f => { try { return statSync(f).mtimeMs > afterMs; } catch { return false; } });
  } catch { return []; }
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
      '--allowedTools', 'Bash,Read,Write,Edit,Glob,Grep',
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
      } catch (err: any) {
        send('stage', { stage: 'error', phase: 0, message: `Nao foi possivel criar pasta: ${err.message}` });
        send('complete', { success: false, error: `Falha ao criar ${outputDir}` });
        controller.close();
        return;
      }

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

      // ═══ PHASE 1: GENERATION ═══
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
      const altOutputDir = clientBaseDir.replace(/\/_Forjado por Petition Engine\/?$/, '');
      const searchDirs = [outputDir, clientBaseDir];
      // Also search the docs_folder_path from client record
      if (client_id) {
        try {
          const cs = readClients();
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
