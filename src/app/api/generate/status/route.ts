import { NextResponse } from 'next/server';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';

const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts');
const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');

function readClients(): any[] {
  if (!existsSync(CLIENTS_FILE)) return [];
  return JSON.parse(readFileSync(CLIENTS_FILE, 'utf-8'));
}

function findDocx(dir: string): string[] {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir).filter(f => f.endsWith('.docx'));
  } catch { return []; }
}

export async function GET() {
  const generations: any[] = [];
  const clients = readClients();

  // Scan data/prompts/ for all instruction files
  if (existsSync(PROMPTS_DIR)) {
    const promptFiles = readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md'));

    for (const file of promptFiles) {
      const filePath = path.join(PROMPTS_DIR, file);
      const stat = statSync(filePath);
      const content = readFileSync(filePath, 'utf-8');

      // Parse client name and doc_type from filename: GERAR_{DOC_TYPE}_{CLIENT_SLUG}.md
      const match = file.match(/^GERAR_(.+?)_(.+)\.md$/);
      if (!match) continue;

      const docType = match[1].toLowerCase();
      const clientSlug = match[2];

      // Try to match client
      const client = clients.find((c: any) =>
        c.name.replace(/\s+/g, '_') === clientSlug ||
        clientSlug.includes(c.name.split(' ')[0])
      );

      // Check output directory for .docx files
      const clientDir = client?.docs_folder_path || '';
      const forjadoDir = clientDir ? path.join(clientDir, '_Forjado por Petition Engine') : '';
      const outputFiles = forjadoDir ? findDocx(forjadoDir) : [];
      const clientDirFiles = clientDir ? findDocx(clientDir) : [];

      // Determine status
      let status: 'concluido' | 'erro' | 'pendente' = 'pendente';
      let docxFiles: string[] = [];

      if (outputFiles.length > 0) {
        status = 'concluido';
        docxFiles = outputFiles;
      } else if (clientDirFiles.some(f => f.toLowerCase().includes(docType.replace(/_/g, '')))) {
        status = 'concluido';
        docxFiles = clientDirFiles.filter(f => f.toLowerCase().includes(docType.replace(/_/g, '')));
      }

      generations.push({
        id: file,
        prompt_file: filePath,
        doc_type: docType,
        client_name: client?.name || clientSlug.replace(/_/g, ' '),
        client_id: client?.id || null,
        status,
        output_dir: forjadoDir || clientDir || 'N/A',
        docx_files: docxFiles,
        created_at: stat.mtime.toISOString(),
        age_seconds: Math.round((Date.now() - stat.mtimeMs) / 1000),
      });
    }
  }

  // Also scan C.P. for existing instruction files used by the system
  const cpDir = '/Users/paulo1844/Documents/Claude/Projects/C.P.';
  if (existsSync(cpDir)) {
    const cpFiles = readdirSync(cpDir).filter(f => f.startsWith('GERAR_') && f.endsWith('.md'));
    for (const file of cpFiles) {
      // Skip if we already have this from data/prompts
      if (generations.some(g => g.id === file)) continue;

      const filePath = path.join(cpDir, file);
      const stat = statSync(filePath);

      const match = file.match(/^GERAR_(.+?)_(.+)\.md$/);
      if (!match) continue;

      const docType = match[1].toLowerCase();
      const clientSlug = match[2].replace(/\.md$/, '');

      const client = clients.find((c: any) => {
        const nameTokens = c.name.toUpperCase().split(/\s+/);
        return nameTokens.some((t: string) => t.length > 2 && clientSlug.toUpperCase().includes(t));
      });

      const clientDir = client?.docs_folder_path || '';
      const forjadoDir = clientDir ? path.join(clientDir, '_Forjado por Petition Engine') : '';
      const outputFiles = forjadoDir ? findDocx(forjadoDir) : [];

      generations.push({
        id: file,
        prompt_file: filePath,
        doc_type: docType,
        client_name: client?.name || clientSlug.replace(/_/g, ' '),
        client_id: client?.id || null,
        source: 'C.P.',
        status: outputFiles.length > 0 ? 'concluido' : 'pendente',
        output_dir: forjadoDir || clientDir || 'N/A',
        docx_files: outputFiles,
        created_at: stat.mtime.toISOString(),
        age_seconds: Math.round((Date.now() - stat.mtimeMs) / 1000),
      });
    }
  }

  // Sort by created_at descending
  generations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ data: generations });
}
