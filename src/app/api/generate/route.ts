import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';

const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');
const SYSTEMS_FILE = path.join(process.cwd(), 'data', 'systems.json');
const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts');
const SOC_PATH = '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md';
const CP_DIR = '/Users/paulo1844/Documents/Claude/Projects/C.P.';

function readJson(file: string): any[] {
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, 'utf-8'));
}

// Map doc_type to search patterns for existing instruction files
const DOC_TYPE_PATTERNS: Record<string, string[]> = {
  cover_letter_eb1a: ['GERAR_COVER_EB1A_', 'GERAR_COVER_EB-1A_'],
  cover_letter_eb2_niw: ['GERAR_COVER_EB2NIW_', 'GERAR_COVER_EB-2_'],
  resume_eb2_niw: ['GERAR_RESUME_', 'GERAR_RESUME_EB2_'],
  resume_eb1a: ['GERAR_RESUME_EB1A_', 'GERAR_RESUME_EB-1A_'],
  business_plan: ['GERAR_BP_'],
  methodology: ['GERAR_METODOLOGIA_'],
  declaration_of_intentions: ['GERAR_DECLARACAO_'],
  impacto_report: ['GERAR_IMPACTO_'],
  strategy_eb1: ['GERAR_ESTRATEGIA_EB1_'],
  strategy_eb2: ['GERAR_ESTRATEGIA_EB2_'],
  eb1_letters: ['GERAR_CARTAS_EB1_'],
};

// Search for an existing specific instruction file for this client + doc_type
function findExistingInstruction(clientName: string, docType: string, clientDocsPath: string): string | null {
  const nameTokens = clientName.toUpperCase().split(/\s+/).filter(t => t.length > 2);
  const patterns = DOC_TYPE_PATTERNS[docType] || [`GERAR_${docType.toUpperCase()}_`];

  // 1. Search in C.P. folder (Paulo's main instruction folder)
  if (existsSync(CP_DIR)) {
    try {
      const cpFiles = readdirSync(CP_DIR).filter(f => f.endsWith('.md'));
      for (const pat of patterns) {
        const match = cpFiles.find(f => {
          const upper = f.toUpperCase();
          return upper.startsWith(pat.toUpperCase()) && nameTokens.some(t => upper.includes(t));
        });
        if (match) return path.join(CP_DIR, match);
      }
    } catch {}
  }

  // 2. Search in client's docs folder for MEGA_PROMPT or GERAR_ files
  if (clientDocsPath && existsSync(clientDocsPath)) {
    try {
      const searchDirs = [clientDocsPath];
      // Also check immediate subdirectories
      const subs = readdirSync(clientDocsPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => path.join(clientDocsPath, d.name));
      searchDirs.push(...subs);

      for (const dir of searchDirs) {
        try {
          const files = readdirSync(dir).filter(f => f.endsWith('.md'));
          const mega = files.find(f => f.toUpperCase().includes('MEGA_PROMPT'));
          if (mega) return path.join(dir, mega);
          for (const pat of patterns) {
            const match = files.find(f => f.toUpperCase().startsWith(pat.toUpperCase()));
            if (match) return path.join(dir, match);
          }
        } catch {}
      }
    } catch {}
  }

  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, doc_type } = body;

  if (!client_id || !doc_type) {
    return NextResponse.json({ error: 'client_id e doc_type sao obrigatorios' }, { status: 400 });
  }

  const clients = readJson(CLIENTS_FILE);
  const client = clients.find((c: any) => c.id === client_id);
  if (!client) {
    return NextResponse.json({ error: `Cliente ${client_id} nao encontrado` }, { status: 404 });
  }

  const systems = readJson(SYSTEMS_FILE);
  const system = systems.find((s: any) => s.doc_type === doc_type);
  if (!system) {
    return NextResponse.json({ error: `Sistema ${doc_type} nao encontrado` }, { status: 404 });
  }

  const clientSlug = client.name.replace(/\s+/g, '_');
  const clientBaseDir = client.docs_folder_path || `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/${client.name}/`;
  const outputDir = path.join(clientBaseDir, '_Forjado por Petition Engine') + '/';

  // Try to find existing specific instruction first
  const existingInstruction = findExistingInstruction(client.name, doc_type, clientBaseDir);

  let promptPath: string;
  let instructionSource: 'existing' | 'generated';
  let prompt: string;

  if (existingInstruction) {
    // Use the existing real instruction file (written by Paulo/Cowork)
    promptPath = existingInstruction;
    instructionSource = 'existing';
    prompt = readFileSync(existingInstruction, 'utf-8');
  } else {
    // Generate a fallback instruction
    instructionSource = 'generated';
    const promptFileName = `GERAR_${doc_type.toUpperCase()}_${clientSlug}.md`;
    if (!existsSync(PROMPTS_DIR)) mkdirSync(PROMPTS_DIR, { recursive: true });
    promptPath = path.join(PROMPTS_DIR, promptFileName);

    prompt = [
      `# Instrucao de Geracao: ${system.system_name}`,
      `## Cliente: ${client.name}`,
      `## Visto: ${client.visa_type}`,
      client.company_name ? `## Empresa: ${client.company_name}` : null,
      '',
      '## REGRAS ABSOLUTAS',
      '- Output SEMPRE .docx (python-docx). NUNCA .md, NUNCA texto puro.',
      '- Leia TODOS os arquivos de sistema ANTES de escrever codigo.',
      '- Instrucoes estrategicas — NAO invente parametrizacoes.',
      '',
      '## SISTEMA DE GERACAO',
      `Leia TODOS os arquivos .md em: ${system.system_path}`,
      `Versao: ${system.version_tag} | Modelo recomendado: ${system.recommended_model}`,
      '',
      '## DADOS DO CLIENTE',
      `Pasta de documentos: ${client.docs_folder_path || 'NAO DEFINIDA'}`,
      'Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.',
      '',
      '## OUTPUT',
      `Crie a pasta se nao existir: ${outputDir}`,
      `Gere o documento .docx final e salve em: ${outputDir}`,
      `Naming: ${doc_type}_${clientSlug}.docx`,
      '',
      '## POS-GERACAO: SEPARATION OF CONCERNS',
      'Apos gerar o documento, NAO considere finalizado.',
      'O documento DEVE passar por revisao cruzada em SESSAO LIMPA.',
      `Instrucao: ${SOC_PATH}`,
    ].filter(Boolean).join('\n');

    writeFileSync(promptPath, prompt, 'utf-8');
  }

  const claudeCommand = `claude -p "Leia ${promptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep`;

  return NextResponse.json({
    data: {
      prompt,
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
        instruction_source: instructionSource,
        instruction_path: promptPath,
        pipeline: ['generation', 'separation_of_concerns'],
        soc_enabled: true,
      },
      prompt_path: promptPath,
      prompt_file: promptPath,
      claude_command: claudeCommand,
    },
  });
}
