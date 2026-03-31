import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { spawn, execSync } from 'child_process';
import path from 'path';

const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts');
const GENERATIONS_FILE = path.join(process.cwd(), 'data', 'generations.json');

function readGenerations(): any[] {
  if (!existsSync(GENERATIONS_FILE)) return [];
  try { return JSON.parse(readFileSync(GENERATIONS_FILE, 'utf-8')); } catch { return []; }
}

function writeGenerations(gens: any[]) {
  writeFileSync(GENERATIONS_FILE, JSON.stringify(gens, null, 2), 'utf-8');
}

function findClaudeBin(): string | null {
  const candidates = [
    '/Users/paulo1844/.npm-global/bin/claude',
    `${process.env.HOME}/.npm-global/bin/claude`,
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  try {
    const resolved = execSync('which claude', { encoding: 'utf-8' }).trim();
    if (resolved && existsSync(resolved)) return resolved;
  } catch {}
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { instruction, client_name, client_id, doc_type, output_path, original_gen_id } = body;

  if (!instruction?.trim()) {
    return NextResponse.json({ error: 'instruction obrigatoria' }, { status: 400 });
  }

  const claudeBin = findClaudeBin();
  if (!claudeBin) {
    return NextResponse.json({ error: 'claude CLI nao encontrado' }, { status: 500 });
  }

  // Save complement prompt
  if (!existsSync(PROMPTS_DIR)) mkdirSync(PROMPTS_DIR, { recursive: true });
  const slug = (client_name || 'client').replace(/\s+/g, '_');
  const promptFile = path.join(PROMPTS_DIR, `COMPLEMENTO_${doc_type}_${slug}_${Date.now()}.md`);
  writeFileSync(promptFile, instruction, 'utf-8');

  // Register as generation
  const genId = `comp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const gens = readGenerations();
  gens.push({
    id: genId,
    client_id: client_id || '',
    client_name: client_name || 'Complemento',
    doc_type: doc_type || 'complement',
    prompt_file: promptFile,
    status: 'processing',
    started_at: new Date().toISOString(),
    completed_at: null,
    output_path: output_path || '',
    output_files: [],
    error_message: null,
    duration_seconds: null,
    current_phase: 'phase_1',
    current_phase_label: 'Gerando complemento...',
    source: 'complement',
    original_gen_id: original_gen_id || null,
  });
  writeGenerations(gens);

  // Launch Claude in background (non-blocking)
  const proc = spawn(claudeBin, [
    '-p', `Leia ${promptFile} e execute tudo.`,
    '--allowedTools', 'Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch',
  ], {
    shell: false,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  let stdout = '';
  proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
  proc.stderr.on('data', () => {});

  proc.on('close', (code: number | null) => {
    // Update generation status when done
    try {
      const gens2 = readGenerations();
      const gen = gens2.find((g: any) => g.id === genId);
      if (gen) {
        gen.status = code === 0 ? 'completed' : 'failed';
        gen.completed_at = new Date().toISOString();
        gen.duration_seconds = Math.round((Date.now() - new Date(gen.started_at).getTime()) / 1000);
        gen.current_phase = code === 0 ? 'completed' : 'failed';
        gen.current_phase_label = code === 0 ? 'Complemento concluído' : `Falhou (exit ${code})`;
        if (code !== 0) gen.error_message = `Exit ${code}`;
        // Try to find new files
        if (output_path && existsSync(output_path)) {
          try {
            const { readdirSync, statSync } = require('fs');
            const startMs = new Date(gen.started_at).getTime();
            const newFiles = readdirSync(output_path)
              .filter((f: string) => !f.startsWith('.'))
              .filter((f: string) => {
                try { return statSync(path.join(output_path, f)).mtimeMs > startMs; } catch { return false; }
              });
            gen.output_files = newFiles;
          } catch {}
        }
        writeGenerations(gens2);
      }
    } catch {}
  });

  proc.unref();

  return NextResponse.json({
    data: {
      gen_id: genId,
      prompt_file: promptFile,
      message: 'Complemento lançado em background. Acompanhe na página /documentos.',
    }
  });
}
