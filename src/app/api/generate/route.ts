import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');
const SYSTEMS_FILE = path.join(process.cwd(), 'data', 'systems.json');
const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts');
const SOC_PATH = '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md';

function readJson(file: string): any[] {
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, 'utf-8'));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, doc_type } = body;

  if (!client_id || !doc_type) {
    return NextResponse.json({ error: 'client_id e doc_type sao obrigatorios' }, { status: 400 });
  }

  // Find client
  const clients = readJson(CLIENTS_FILE);
  const client = clients.find((c: any) => c.id === client_id);
  if (!client) {
    return NextResponse.json({ error: `Cliente ${client_id} nao encontrado` }, { status: 404 });
  }

  // Find system
  const systems = readJson(SYSTEMS_FILE);
  const system = systems.find((s: any) => s.doc_type === doc_type);
  if (!system) {
    return NextResponse.json({ error: `Sistema ${doc_type} nao encontrado` }, { status: 404 });
  }

  // Build instruction .md
  const clientSlug = client.name.replace(/\s+/g, '_');
  const promptFileName = `GERAR_${doc_type.toUpperCase()}_${clientSlug}.md`;
  if (!existsSync(PROMPTS_DIR)) mkdirSync(PROMPTS_DIR, { recursive: true });
  const promptPath = path.join(PROMPTS_DIR, promptFileName);

  const outputDir = client.docs_folder_path || `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/${client.name}/`;

  const instruction = [
    `# Instrucao de Geracao: ${system.system_name}`,
    `## Cliente: ${client.name}`,
    `## Visto: ${client.visa_type}`,
    client.company_name ? `## Empresa: ${client.company_name}` : null,
    `## Output: ${outputDir}`,
    '',
    '## SISTEMA DE GERACAO',
    `Leia TODOS os arquivos .md em: ${system.system_path}`,
    `Versao: ${system.version_tag} | Modelo recomendado: ${system.recommended_model}`,
    '',
    '## DADOS DO CLIENTE',
    `Pasta de documentos: ${client.docs_folder_path || 'NAO DEFINIDA'}`,
    `Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.`,
    '',
    '## OUTPUT',
    `Gere o documento .docx final e salve em: ${outputDir}`,
    `Naming: ${doc_type}_${clientSlug}.docx`,
    '',
    '## POS-GERACAO: SEPARATION OF CONCERNS',
    'Apos gerar o documento, NAO considere finalizado.',
    'O documento DEVE passar por revisao cruzada em SESSAO LIMPA.',
    `Instrucao: ${SOC_PATH}`,
  ].filter(Boolean).join('\n');

  writeFileSync(promptPath, instruction, 'utf-8');

  const claudeCommand = `claude -p "Leia ${promptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep`;

  return NextResponse.json({
    data: {
      prompt: instruction,
      metadata: {
        system: system.system_name,
        systemName: system.system_name,
        doc_type: system.doc_type,
        client_name: client.name,
        client_id: client.id,
        system_path: system.system_path,
        output_dir: outputDir,
        filesRead: system.file_count,
        recommended_model: system.recommended_model,
        estimatedTokens: system.file_count * 3000,
        pipeline: ['generation', 'separation_of_concerns'],
        soc_enabled: true,
      },
      prompt_path: promptPath,
      prompt_file: promptPath,
      claude_command: claudeCommand,
    },
  });
}
