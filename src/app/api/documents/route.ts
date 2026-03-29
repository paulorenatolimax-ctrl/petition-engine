import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const GENERATIONS_FILE = path.join(process.cwd(), 'data', 'generations.json');

function readGenerations(): any[] {
  if (!existsSync(GENERATIONS_FILE)) return [];
  try { return JSON.parse(readFileSync(GENERATIONS_FILE, 'utf-8')); } catch { return []; }
}

function writeGenerations(gens: any[]) {
  writeFileSync(GENERATIONS_FILE, JSON.stringify(gens, null, 2), 'utf-8');
}

const STALE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function cleanStaleGenerations(gens: any[]): boolean {
  let changed = false;
  const now = Date.now();
  for (const g of gens) {
    if (g.status === 'processing') {
      const started = new Date(g.started_at).getTime();
      if (now - started > STALE_TIMEOUT_MS) {
        g.status = 'failed';
        g.error_message = 'Timeout: processo ficou mais de 30min sem concluir. Provavelmente o servidor ou sessao foram fechados.';
        g.completed_at = new Date().toISOString();
        changed = true;
      }
    }
  }
  return changed;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let gens = readGenerations();

  // Auto-clean stale processing entries
  if (cleanStaleGenerations(gens)) {
    writeGenerations(gens);
  }

  const client_id = searchParams.get('client_id');
  if (client_id) gens = gens.filter((g: any) => g.client_id === client_id);

  const doc_type = searchParams.get('doc_type');
  if (doc_type) gens = gens.filter((g: any) => g.doc_type === doc_type);

  const status = searchParams.get('status');
  if (status) gens = gens.filter((g: any) => g.status === status);

  // Sort by started_at descending
  gens.sort((a: any, b: any) =>
    new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );

  return NextResponse.json({ data: gens.slice(0, 100) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { file_path, doc_type, client_name, source, notes } = body;

  const genId = `ext_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const newGen = {
    id: genId,
    client_id: '',
    client_name: client_name || 'Documento Externo',
    doc_type: doc_type || 'other',
    prompt_file: '',
    status: 'completed',
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    output_path: file_path || '',
    output_files: file_path ? [file_path.split('/').pop()] : [],
    error_message: null,
    duration_seconds: null,
    source: source || 'external_import',
    notes: notes || '',
    stages: [],
  };

  const gens = readGenerations();
  gens.push(newGen);
  writeGenerations(gens);

  return NextResponse.json({ data: newGen });
}
