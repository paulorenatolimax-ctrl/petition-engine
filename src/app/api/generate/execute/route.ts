import { NextRequest } from 'next/server';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import {
  SOC_PATH, QUALITY_PATH, INSERT_THUMBNAILS_PATH,
  EB1A_SYSTEM_PATH, EB2_NIW_SYSTEM_PATH as EB2_NIW_SYS_PATH,
  RAGS_EB2 as RAGS_EB2_PATH, DEFAULT_CASES_DIR,
} from '@/lib/config/paths';

import {
  upsertGeneration, readClients, findClaudeBin, runClaude,
  findNewDocx, autoVersionExisting,
} from '@/lib/pipelines/base';
import { runCoverLetterEB1APipeline } from '@/lib/pipelines/cover-letter-eb1a';
import { runCoverLetterEB2NIWPipeline } from '@/lib/pipelines/cover-letter-eb2-niw';

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
    clientBaseDir = `${DEFAULT_CASES_DIR}${client_name || 'output'}/`;
  }
  const outputDir = path.join(clientBaseDir, '_Forjado por Petition Engine') + '/';

  const stream = new ReadableStream({
    async start(controller) {
      // Accumulate stages for persistence in generations.json
      const stagesLog: { event: string; phase: number; message: string; timestamp: string }[] = [];
      const send = (event: string, data: object) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        // Persist stage events
        const d = data as Record<string, unknown>;
        if (event === 'stage' || event === 'complete') {
          stagesLog.push({
            event,
            phase: (d.phase as number) || 0,
            message: (d.message as string) || (d.error as string) || JSON.stringify(d).slice(0, 200),
            timestamp: new Date().toISOString(),
          });
          // Persist periodically (every 5 stages)
          if (stagesLog.length % 5 === 0) {
            try { upsertGeneration({ id: genId, stages: stagesLog }); } catch {}
          }
        }
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
        send('stage', { stage: 'info', phase: 0, message: 'Orchestrator: EB-1A multi-phase pipeline (extracted module)' });

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

      // ═══════════════════════════════════════════════════════════════
      // COVER LETTER EB-2 NIW: MULTI-PHASE PIPELINE
      // ═══════════════════════════════════════════════════════════════
      if (doc_type === 'cover_letter_eb2_niw') {
        send('stage', { stage: 'info', phase: 0, message: 'Pipeline multi-fase EB-2 NIW ativado (8 fases + thumbnails + consolidation)' });
        send('stage', { stage: 'info', phase: 0, message: 'Orchestrator: EB-2 NIW pipeline (extracted module)' });
        send('stage', { stage: 'info', phase: 0, message: `Sistema EB-2 NIW: ${EB2_NIW_SYS_PATH}` });

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
        send('stage', { stage: 'info', phase: 0, message: `RAGs EB-2: ${RAGS_EB2_PATH}` });

        try {
          const pipelineResult = await runCoverLetterEB2NIWPipeline(
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
            pipeline_type: 'eb2_niw',
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
          send('stage', { stage: 'error', phase: 'pipeline', message: `Pipeline EB-2 NIW falhou: ${errMsg}` });
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
            pipeline_type: 'eb2_niw',
            error: `Pipeline EB-2 NIW falhou: ${errMsg}`,
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
        // Extract text from document for quality check (.md or .docx)
        let docText = '';
        const isMdFile = mainDocx.endsWith('.md');
        try {
          if (isMdFile) {
            // .md files: read directly
            docText = readFileSync(mainDocx, 'utf-8');
            send('stage', { stage: 'info', phase: 1.5, message: `Arquivo .md detectado — leitura direta (${docText.length} chars)` });
          } else {
            // .docx files: extract via python-docx
            docText = execSync(
              `python3 -c "from docx import Document; doc=Document('${mainDocx}'); print('\\n'.join(p.text for p in doc.paragraphs))"`,
              { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
            );
          }
        } catch {
          send('stage', { stage: 'warning', phase: 1.5, message: `Nao foi possivel extrair texto do ${isMdFile ? '.md' : '.docx'} para quality check` });
        }

        if (docText) {
          const qualityResult = await runQualityLocal({
            documentText: docText,
            docType: doc_type || 'unknown',
            clientName: client_name || '',
          });

          send('stage', { stage: 'quality_result', phase: 1.5, message: `Score: ${qualityResult.score}/100 — ${qualityResult.passed ? 'APROVADO' : 'REPROVADO'}` });

          // Persist quality results in generations.json
          upsertGeneration({
            id: genId,
            quality_score: qualityResult.score,
            quality_passed: qualityResult.passed,
            quality_violations: qualityResult.violations.map(v => `[${v.severity}] ${v.rule}: ${v.match}`).slice(0, 20),
            quality_auto_fixes: qualityResult.autoFixes.length,
          });

          if (qualityResult.autoFixes.length > 0) {
            send('stage', { stage: 'info', phase: 1.5, message: `${qualityResult.autoFixes.length} auto-fixes aplicados: ${qualityResult.autoFixes.map(f => f.description).join(', ')}` });
          }

          if (qualityResult.violations.length > 0) {
            for (const v of qualityResult.violations.slice(0, 5)) {
              send('stage', { stage: 'violation', phase: 1.5, message: `[${v.severity.toUpperCase()}] ${v.rule}: ${v.match}` });
            }
          }

          if (!qualityResult.passed) {
            const criticalViolations = qualityResult.violations.filter(v => v.severity === 'critical');
            if (criticalViolations.length > 0) {
              send('stage', { stage: 'error', phase: 1.5, message: `QUALITY GATE BLOQUEADO — ${criticalViolations.length} violacao(oes) critica(s) encontrada(s). Documento NAO sera entregue.` });
              for (const cv of criticalViolations) {
                send('stage', { stage: 'violation', phase: 1.5, message: `[CRITICAL/BLOCK] ${cv.rule}: ${cv.match}` });
              }
              send('stage', { stage: 'error', phase: 1.5, message: `Score: ${qualityResult.score}/100. O documento foi gerado em ${mainDocx} mas REPROVOU no quality gate. Corrija as violacoes e re-gere.` });

              upsertGeneration({
                id: genId,
                status: 'quality_blocked',
                quality_score: qualityResult.score,
                quality_violations: criticalViolations.map(v => v.rule),
                completed_at: new Date().toISOString(),
              });

              send('complete', {
                success: false,
                blocked_by_quality: true,
                quality_score: qualityResult.score,
                critical_violations: criticalViolations.length,
                violations: criticalViolations.map(v => ({ rule: v.rule, match: v.match })),
                output_path: mainDocx,
                message: `Documento REPROVADO pelo Quality Gate (${qualityResult.score}/100). ${criticalViolations.length} violacao(oes) critica(s). Corrija e re-gere.`,
              });
              controller.close();
              return;
            }

            // Non-critical failures: warn but deliver
            send('stage', { stage: 'warning', phase: 1.5, message: `Quality gate REPROVADO (${qualityResult.score}/100). Sem violacoes criticas — documento entregue com ressalvas.` });
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (qErr: any) {
        send('stage', { stage: 'warning', phase: 1.5, message: `Quality agent erro: ${qErr.message?.slice(0, 200)}` });
      }

      // ═══ PHASE 1.6: PYTHON QUALITY GATE (DOCX formatting checks) ═══
      // This catches what the TypeScript quality agent misses:
      // Exhibit in résumé, missing Responsabilidades/Resultados, word count, footer, fonts
      if (mainDocx.endsWith('.docx') && (doc_type?.includes('resume') || doc_type?.includes('cover_letter'))) {
        send('stage', { stage: 'phase', phase: 1.6, message: 'FASE 1.6: PYTHON QUALITY GATE — Validacao DOCX (formatacao, estrutura, thumbnails)' });
        const qualityGateScript = path.join(process.cwd(), 'scripts', 'core', 'quality_gate_resume.py');
        if (existsSync(qualityGateScript)) {
          try {
            const { execSync: execSyncQG } = await import('child_process');
            const qgResult = execSyncQG(
              `python3 "${qualityGateScript}" "${mainDocx}"`,
              { encoding: 'utf-8', maxBuffer: 5 * 1024 * 1024, timeout: 30000 }
            );
            send('stage', { stage: 'info', phase: 1.6, message: `Python quality gate output: ${qgResult.trim().slice(-300)}` });
            send('stage', { stage: 'gen_complete', phase: 1.6, message: '✅ Python quality gate APROVADO' });
          } catch (qgErr: unknown) {
            // Exit code 1 = quality gate FAILED
            const errOutput = (qgErr as { stdout?: string })?.stdout || '';
            send('stage', { stage: 'warning', phase: 1.6, message: `⚠️ Python quality gate REPROVADO: ${errOutput.trim().slice(-500)}` });
            send('stage', { stage: 'warning', phase: 1.6, message: 'Documento gerado mas NAO passou no quality gate de formatacao. Verifique manualmente.' });
            // Don't block — warn only (blocking can be enabled later when the gate is mature)
          }
        } else {
          send('stage', { stage: 'info', phase: 1.6, message: 'Python quality gate nao encontrado em scripts/core/ — pulando' });
        }
      }

      // ═══ PHASE 1.7: THUMBNAILS (for résumés and cover letters) ═══
      const needsThumbnails = (doc_type || '').includes('resume') || (doc_type || '').includes('cover_letter');
      if (needsThumbnails && mainDocx.endsWith('.docx') && existsSync(INSERT_THUMBNAILS_PATH)) {
        upsertGeneration({ id: genId, current_phase: 'phase_1.7', current_phase_label: 'Thumbnails — Inserindo imagens de evidencia' });
        send('stage', { stage: 'phase', phase: 1.7, message: 'FASE 1.7: INSERÇÃO DE THUMBNAILS' });

        // Resolve client docs path for evidence PDFs
        let thumbClientPath = clientBaseDir;
        if (client_id) {
          try {
            const cs = readClients();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cl = cs.find((c: any) => c.id === client_id);
            if (cl?.docs_folder_path) thumbClientPath = cl.docs_folder_path;
          } catch {}
        }

        try {
          send('stage', { stage: 'loading', phase: 1.7, message: `Inserindo thumbnails em ${mainDocx.split('/').pop()}...` });
          const thumbOutput = execSync(
            `python3 "${INSERT_THUMBNAILS_PATH}" "${mainDocx}" "${thumbClientPath}"`,
            { encoding: 'utf-8', timeout: 180000 }
          );
          send('stage', { stage: 'gen_complete', phase: 1.7, message: `Thumbnails inseridos com sucesso` });
          if (thumbOutput.trim()) {
            send('stage', { stage: 'info', phase: 1.7, message: thumbOutput.trim().slice(0, 500) });
          }
        } catch (thumbErr: unknown) {
          const errMsg = thumbErr instanceof Error ? thumbErr.message : String(thumbErr);
          send('stage', { stage: 'warning', phase: 1.7, message: `Thumbnails falhou: ${errMsg.slice(0, 300)}` });
        }
      } else if (needsThumbnails && !existsSync(INSERT_THUMBNAILS_PATH)) {
        send('stage', { stage: 'warning', phase: 1.7, message: `Script insert_thumbnails.py nao encontrado: ${INSERT_THUMBNAILS_PATH}` });
      }

      // ═══ PHASE 1.8: FIX DOCX FORMATTING ═══
      const FIX_FORMATTING_PATH = path.join(process.cwd(), 'scripts', 'fix_docx_formatting.py');
      if (mainDocx.endsWith('.docx') && existsSync(FIX_FORMATTING_PATH)) {
        send('stage', { stage: 'phase', phase: 1.8, message: 'FASE 1.8: FIX FORMATAÇÃO (spacing + anchor + cleanup)' });
        try {
          const fixOutput = execSync(
            `python3 "${FIX_FORMATTING_PATH}" "${mainDocx}"`,
            { encoding: 'utf-8', timeout: 60000 }
          );
          send('stage', { stage: 'gen_complete', phase: 1.8, message: fixOutput.trim().split('\n').pop() || 'Formatação corrigida' });
        } catch (fixErr: unknown) {
          const errMsg = fixErr instanceof Error ? fixErr.message : String(fixErr);
          send('stage', { stage: 'warning', phase: 1.8, message: `Fix formatação falhou: ${errMsg.slice(0, 200)}` });
        }
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
        stages: stagesLog,
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
