# BUILD COMPLETO DO PETITION ENGINE — EXECUÇÃO AUTÔNOMA

Leia este arquivo INTEIRO antes de começar. Depois execute tudo sem perguntar nada.

## REGRA #1: NÃO USAR API PAGA

- NÃO importar @anthropic-ai/sdk
- NÃO importar @google/generative-ai
- NÃO chamar callClaude(), callGemini(), anthropic.messages.create()
- Todos os agentes RETORNAM prompts como strings
- Paulo copia o prompt, cola no Claude Code manualmente, e cola o resultado de volta

## REGRA #2: CRIAR CADA ARQUIVO LISTADO ABAIXO

Cada seção abaixo tem o caminho do arquivo e o conteúdo completo. Crie TODOS.

## REGRA #3: NÃO PERGUNTAR NADA

Execute tudo de uma vez. Commit no GitHub após cada bloco.

---

# ═══════════════════════════════════════
# BLOCO 0: DEPENDÊNCIAS E CONFIGURAÇÃO
# ═══════════════════════════════════════

## Verificar package.json e instalar dependências faltantes

```bash
npm install @supabase/supabase-js zod zustand swr date-fns lucide-react framer-motion react-hot-toast class-variance-authority clsx tailwind-merge octokit
```

Verificar que NÃO tem @anthropic-ai/sdk nem @google/generative-ai no package.json. Se tiver, remover.

---

# ═══════════════════════════════════════
# BLOCO 1: LIB — Utilitários base
# ═══════════════════════════════════════

## Arquivo: src/lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client para uso no browser (componentes React)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client para uso no servidor (API routes) — usa service role key
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}
```

## Arquivo: src/lib/api-helpers.ts

```typescript
import { NextResponse } from 'next/server';

export function apiError(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message, timestamp: new Date().toISOString() },
    { status }
  );
}

export function apiSuccess(data: any, status: number = 200) {
  return NextResponse.json(
    { data, timestamp: new Date().toISOString() },
    { status }
  );
}
```

## Arquivo: src/lib/schemas.ts

```typescript
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  visa_type: z.enum(['EB-1A', 'EB-2-NIW', 'O-1', 'L-1', 'EB-1C']),
  proposed_endeavor: z.string().optional(),
  soc_code: z.string().optional(),
  soc_title: z.string().optional(),
  location_city: z.string().optional(),
  location_state: z.string().optional(),
  company_name: z.string().optional(),
  company_type: z.string().optional(),
  naics_code: z.string().optional(),
  notes: z.string().optional(),
  docs_folder_path: z.string().optional(),
  drive_folder_url: z.string().url().optional().or(z.literal('')),
});

export const generateSchema = z.object({
  client_id: z.string().uuid(),
  doc_type: z.enum([
    'resume', 'cover_letter_eb1a', 'cover_letter_eb2_niw', 'cover_letter_o1',
    'business_plan', 'methodology', 'declaration_of_intentions',
    'anteprojeto', 'location_analysis', 'impacto_report',
    'satellite_letter', 'photographic_report', 'rfe_response',
    'strategy_eb1', 'strategy_eb2',
  ]),
  doc_subtype: z.string().optional(),
  config: z.object({
    skip_quality: z.boolean().optional(),
    skip_uscis: z.boolean().optional(),
    include_thumbnails: z.boolean().optional(),
    language: z.enum(['pt-BR', 'en-US']).optional(),
  }).optional(),
});
```

## Arquivo: src/lib/types.ts

```typescript
export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  visa_type: string;
  proposed_endeavor: string | null;
  soc_code: string | null;
  soc_title: string | null;
  location_city: string | null;
  location_state: string | null;
  company_name: string | null;
  company_type: string | null;
  naics_code: string | null;
  status: string;
  docs_folder_path: string | null;
  drive_folder_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  client_profiles?: ClientProfile | null;
}

export interface ClientProfile {
  id: string;
  client_id: string;
  full_name: string | null;
  nationality: string | null;
  education: any[];
  work_experience: any[];
  total_years_experience: number | null;
  evidence_inventory: any[];
  total_evidence_count: number;
  publications: any[];
  media_coverage: any[];
  awards: any[];
  financial_data: Record<string, any>;
  satellite_letters_needed: any[];
  eb1a_criteria: Record<string, any>;
  dhanasar_pillars: Record<string, any>;
  raw_extracted_text: string | null;
  extracted_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  doc_type: string;
  doc_subtype: string | null;
  version: number;
  status: string;
  system_used: string | null;
  output_file_path: string | null;
  quality_score: Record<string, any>;
  quality_passed: boolean | null;
  quality_notes: string | null;
  uscis_risk_score: Record<string, any>;
  generation_time_seconds: number | null;
  generated_at: string;
}

export interface ErrorRule {
  id: string;
  rule_type: string;
  doc_type: string | null;
  rule_description: string;
  rule_pattern: string | null;
  rule_action: string;
  auto_fix_replacement: string | null;
  severity: string;
  source: string;
  active: boolean;
  times_triggered: number;
  created_at: string;
  github_commit_sha: string | null;
}

export interface FileInventory {
  number: number;
  type: 'pdf' | 'docx' | 'image';
  file_path: string;
  file_name: string;
  description: string;
  size_bytes: number;
}

export interface ExtractionResult {
  prompt: string;
  inventory: FileInventory[];
  textExtracted: string;
  totalFiles: number;
  totalTextLength: number;
}

export interface GenerationResult {
  prompt: string;
  metadata: {
    system: string;
    version: string;
    rules_count: number;
    estimated_tokens: number;
    files_read: string[];
  };
}

export interface SystemConfig {
  name: string;
  symlinkDir: string;
  preferredModel: string;
  requiresProfile: boolean;
  requiresDeepResearch: boolean;
  outputFormat: 'docx' | 'pdf' | 'md';
  estimatedTokens: number;
  multiAgent: boolean;
  sequentialPrompts?: number;
  heterogeneity?: boolean;
  skillFile?: string;
}
```

## Arquivo: src/lib/python-runner.ts

```typescript
import { exec } from 'child_process';
import path from 'path';

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

export function runPython(scriptName: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, scriptName);
    const escapedArgs = args.map(a => `"${a.replace(/"/g, '\\"')}"`).join(' ');
    const cmd = `python3 "${scriptPath}" ${escapedArgs}`;

    exec(cmd, { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Python error (${scriptName}): ${stderr || error.message}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}
```

## Arquivo: src/lib/file-reader.ts

```typescript
import fs from 'fs/promises';
import path from 'path';

const SYSTEMS_BASE = path.join(process.cwd(), 'systems');

export async function readSystemFiles(symlinkDir: string): Promise<{ content: string; files: string[] }> {
  const systemPath = path.join(SYSTEMS_BASE, symlinkDir);

  try {
    const stat = await fs.stat(systemPath);
    if (!stat.isDirectory()) throw new Error(`${systemPath} não é um diretório`);
  } catch {
    throw new Error(`Sistema não encontrado: ${symlinkDir}. Execute scripts/setup-symlinks.sh`);
  }

  const files = await getMarkdownFiles(systemPath);
  if (files.length === 0) {
    throw new Error(`Nenhum arquivo .md encontrado em ${symlinkDir}`);
  }

  files.sort();
  const contents: string[] = [];
  const fileNames: string[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const relativePath = path.relative(systemPath, file);
    fileNames.push(relativePath);
    contents.push(`\n<!-- === ${relativePath} === -->\n${content}`);
  }

  return { content: contents.join('\n'), files: fileNames };
}

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function checkSymlink(systemPath: string): Promise<boolean> {
  try {
    await fs.access(systemPath);
    return true;
  } catch {
    return false;
  }
}

export async function countFiles(dir: string): Promise<number> {
  try {
    const files = await getMarkdownFiles(dir);
    return files.length;
  } catch {
    return 0;
  }
}

export async function scanSystemDirectory(systemPath: string) {
  try {
    await fs.access(systemPath);
    const files = await getMarkdownFiles(systemPath);
    const dirName = path.basename(systemPath);
    const versionMatch = dirName.match(/v(\d+)/i);

    return {
      exists: true,
      file_count: files.length,
      files: files.map(f => path.relative(systemPath, f)),
      detected_version: versionMatch ? `v${versionMatch[1]}.0.0` : null,
    };
  } catch {
    return { exists: false, file_count: 0, files: [], detected_version: null };
  }
}

export async function setupSymlinks(systems: Array<{ system_name: string; system_path: string }>) {
  const results: Array<{ name: string; status: 'ok' | 'error'; message?: string }> = [];
  await fs.mkdir(SYSTEMS_BASE, { recursive: true });

  for (const sys of systems) {
    const linkName = sys.system_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const linkPath = path.join(SYSTEMS_BASE, linkName);

    try {
      try { await fs.unlink(linkPath); } catch {}
      await fs.access(sys.system_path);
      await fs.symlink(sys.system_path, linkPath);
      results.push({ name: sys.system_name, status: 'ok' });
    } catch (err: any) {
      results.push({ name: sys.system_name, status: 'error', message: err.message });
    }
  }

  return results;
}
```

## Arquivo: src/lib/system-map.ts

```typescript
import { SystemConfig } from './types';

export const SYSTEM_MAP: Record<string, SystemConfig> = {
  cover_letter_eb1a: {
    name: 'Cover Letter EB-1A',
    symlinkDir: 'cover-letter-eb1a',
    preferredModel: 'claude-sonnet-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 80000,
    multiAgent: false,
  },
  cover_letter_eb2_niw: {
    name: 'Cover Letter EB-2 NIW',
    symlinkDir: 'cover-letter-eb2-niw',
    preferredModel: 'claude-sonnet-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 80000,
    multiAgent: false,
  },
  cover_letter_o1: {
    name: 'Cover Letter O-1',
    symlinkDir: 'cover-letter-eb1a',
    preferredModel: 'claude-sonnet-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 80000,
    multiAgent: false,
  },
  resume: {
    name: 'Résumé EB-1A',
    symlinkDir: 'resume-eb1a',
    preferredModel: 'claude-sonnet-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 40000,
    multiAgent: false,
  },
  business_plan: {
    name: 'Business Plan',
    symlinkDir: 'business-plan',
    preferredModel: 'claude-opus-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 120000,
    multiAgent: false,
  },
  methodology: {
    name: 'Metodologia',
    symlinkDir: 'metodologia',
    preferredModel: 'claude-sonnet-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 60000,
    multiAgent: false,
  },
  declaration_of_intentions: {
    name: 'Declaração de Intenções',
    symlinkDir: 'declaracao-intencoes',
    preferredModel: 'claude-sonnet-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 50000,
    multiAgent: false,
  },
  anteprojeto: {
    name: 'Anteprojeto (Pré-Projeto Base)',
    symlinkDir: 'estrategia-eb2',
    preferredModel: 'claude-opus-4',
    requiresProfile: true,
    requiresDeepResearch: true,
    outputFormat: 'docx',
    estimatedTokens: 200000,
    multiAgent: false,
    sequentialPrompts: 9,
  },
  location_analysis: {
    name: 'Análise de Localização',
    symlinkDir: 'localizacao',
    preferredModel: 'gemini-deep-research',
    requiresProfile: true,
    requiresDeepResearch: true,
    outputFormat: 'docx',
    estimatedTokens: 100000,
    multiAgent: false,
  },
  impacto_report: {
    name: 'IMPACTO®',
    symlinkDir: 'impacto',
    preferredModel: 'claude-opus-4',
    requiresProfile: true,
    requiresDeepResearch: true,
    outputFormat: 'docx',
    estimatedTokens: 200000,
    multiAgent: true,
  },
  satellite_letter: {
    name: 'Carta Satélite',
    symlinkDir: 'satellite-letters',
    preferredModel: 'claude-sonnet-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 30000,
    multiAgent: false,
    heterogeneity: true,
    skillFile: 'eb2-niw-letters-skill',
  },
  strategy_eb1: {
    name: 'Estratégia EB-1A',
    symlinkDir: 'estrategia-eb1',
    preferredModel: 'claude-opus-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 100000,
    multiAgent: false,
  },
  strategy_eb2: {
    name: 'Estratégia EB-2 NIW',
    symlinkDir: 'estrategia-eb2',
    preferredModel: 'claude-opus-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 100000,
    multiAgent: false,
  },
  rfe_response: {
    name: 'Resposta a RFE',
    symlinkDir: 'cover-letter-eb1a',
    preferredModel: 'claude-opus-4',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 150000,
    multiAgent: false,
  },
};
```

## Arquivo: src/lib/github.ts

```typescript
import { Octokit } from 'octokit';

function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token || token === 'PREENCHER') {
    console.warn('[GitHub] Token não configurado — commits desabilitados');
    return null;
  }
  return new Octokit({ auth: token });
}

const REPO = process.env.GITHUB_REPO || 'paulorenatolimax-ctrl/petition-engine';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const [owner, repo] = REPO.split('/');

export async function commitToGitHub(filePath: string, content: string, message: string): Promise<string | null> {
  const octokit = getOctokit();
  if (!octokit) return null;

  try {
    const { data: ref } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${BRANCH}` });
    const latestCommitSha = ref.object.sha;

    const { data: commit } = await octokit.rest.git.getCommit({ owner, repo, commit_sha: latestCommitSha });

    const { data: blob } = await octokit.rest.git.createBlob({
      owner, repo,
      content: Buffer.from(content).toString('base64'),
      encoding: 'base64',
    });

    const { data: newTree } = await octokit.rest.git.createTree({
      owner, repo,
      base_tree: commit.tree.sha,
      tree: [{ path: filePath, mode: '100644', type: 'blob', sha: blob.sha }],
    });

    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner, repo, message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    await octokit.rest.git.updateRef({ owner, repo, ref: `heads/${BRANCH}`, sha: newCommit.sha });

    return newCommit.sha;
  } catch (err: any) {
    console.error('[GitHub] Commit falhou:', err.message);
    return null;
  }
}

export async function commitErrorRule(rule: any): Promise<string | null> {
  return commitToGitHub(
    `error-rules/${rule.rule_type}/${rule.id}.json`,
    JSON.stringify(rule, null, 2),
    `fix(error-rules): add ${rule.rule_type} rule — ${rule.rule_description?.substring(0, 50)}`
  );
}
```

---

# ═══════════════════════════════════════
# BLOCO 2: AGENTES (SEM API PAGA)
# ═══════════════════════════════════════

## Arquivo: src/agents/extractor.ts

CRÍTICO: Este agente NÃO chama nenhuma API. Ele extrai texto dos PDFs/DOCX via Python e RETORNA um prompt como string.

```typescript
import { runPython } from '@/lib/python-runner';
import { createServerClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import type { ExtractionResult, FileInventory } from '@/lib/types';

export class ExtractorAgent {
  static async extract(
    folderPath: string,
    clientId: string,
    onProgress?: (msg: { step: string; current: number; total: number; message: string }) => void
  ): Promise<ExtractionResult> {
    // 1. Verificar pasta existe
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Pasta não encontrada: ${folderPath}`);
    }

    // 2. Inventariar arquivos recursivamente
    const allFiles = getAllFiles(folderPath);
    const pdfFiles = allFiles.filter(f => f.toLowerCase().endsWith('.pdf'));
    const docxFiles = allFiles.filter(f => f.toLowerCase().endsWith('.docx'));
    const imageFiles = allFiles.filter(f => /\.(png|jpg|jpeg|tiff|bmp)$/i.test(f));

    const totalFiles = pdfFiles.length + docxFiles.length + imageFiles.length;
    let processed = 0;

    // 3. Extrair texto dos PDFs
    let allText = '';
    for (const pdf of pdfFiles) {
      processed++;
      const fileName = path.basename(pdf);
      onProgress?.({ step: 'extracting_pdf', current: processed, total: totalFiles, message: `Extraindo texto: ${fileName}` });

      try {
        const text = await runPython('extract_pdf.py', [pdf]);
        allText += `\n\n=== ${fileName} ===\n${text}`;
      } catch (err: any) {
        allText += `\n\n=== ${fileName} === [ERRO: ${err.message}]\n`;
      }
    }

    // 4. Extrair texto dos DOCX
    for (const docx of docxFiles) {
      processed++;
      const fileName = path.basename(docx);
      onProgress?.({ step: 'extracting_docx', current: processed, total: totalFiles, message: `Extraindo texto: ${fileName}` });

      try {
        const text = await runPython('extract_docx.py', [docx]);
        allText += `\n\n=== ${fileName} ===\n${text}`;
      } catch (err: any) {
        allText += `\n\n=== ${fileName} === [ERRO: ${err.message}]\n`;
      }
    }

    // 5. Inventariar todos os arquivos
    const inventory: FileInventory[] = [];
    let evidenceNum = 1;

    for (const file of [...pdfFiles, ...docxFiles, ...imageFiles]) {
      const stat = fs.statSync(file);
      const ext = path.extname(file).toLowerCase();
      inventory.push({
        number: evidenceNum++,
        type: ext === '.pdf' ? 'pdf' : ext === '.docx' ? 'docx' : 'image',
        file_path: file,
        file_name: path.basename(file),
        description: path.basename(file, ext).replace(/[-_]/g, ' '),
        size_bytes: stat.size,
      });
    }

    // 6. Salvar inventário no Supabase
    const supabase = createServerClient();
    await supabase.from('client_profiles').upsert({
      client_id: clientId,
      evidence_inventory: inventory,
      total_evidence_count: inventory.length,
      raw_extracted_text: allText.substring(0, 500000),
      extracted_at: new Date().toISOString(),
    }, { onConflict: 'client_id' });

    // 7. Montar PROMPT DE EXTRAÇÃO (Paulo vai colar no Claude Code)
    const extractionPrompt = `Você é um agente extrator de dados para petições de imigração dos EUA.

Analise o texto abaixo, extraído de ${totalFiles} documentos de um cliente, e retorne um JSON com a seguinte estrutura:

{
  "full_name": "nome completo",
  "nationality": "nacionalidade",
  "date_of_birth": "YYYY-MM-DD ou null",
  "current_visa_status": "status atual do visto",
  "education": [{"degree": "", "institution": "", "year": 0, "country": "", "field": ""}],
  "work_experience": [{"company": "", "title": "", "start_date": "", "end_date": "", "country": "", "description": ""}],
  "total_years_experience": 0,
  "publications": [{"title": "", "journal": "", "date": "", "citations": 0}],
  "media_coverage": [{"outlet": "", "title": "", "date": ""}],
  "awards": [{"name": "", "granting_body": "", "date": "", "significance": ""}],
  "financial_data": {"revenue_projections": [], "investment": 0},
  "satellite_letters_needed": [{"type": "investor_pj|investor_pf|current_client_pj|current_client_pf|potential_client_pj|potential_client_pf|strategic_partner|volunteer|recommendation|support|expert_opinion", "status": "needed"}],
  "eb1a_criteria": {"C1_awards": "", "C2_membership": "", "C3_media": "", "C4_judging": "", "C5_contributions": "", "C6_scholarly": "", "C7_exhibitions": "", "C8_leading_role": "", "C9_high_salary": "", "C10_commercial": ""},
  "dhanasar_pillars": {"prong1_merit": "", "prong2_well_positioned": "", "prong3_balance": ""}
}

Retorne APENAS o JSON, sem markdown, sem explicação.

TEXTO EXTRAÍDO DOS DOCUMENTOS DO CLIENTE:
${allText.substring(0, 100000)}`;

    return {
      prompt: extractionPrompt,
      inventory,
      textExtracted: allText,
      totalFiles,
      totalTextLength: allText.length,
    };
  }
}

function getAllFiles(dir: string): string[] {
  const results: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.')) {
      results.push(...getAllFiles(fullPath));
    } else if (item.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}
```

## Arquivo: src/agents/writer.ts

CRÍTICO: Este agente NÃO chama nenhuma API. Ele monta o prompt completo e RETORNA como string.

```typescript
import { readSystemFiles } from '@/lib/file-reader';
import { createServerClient } from '@/lib/supabase';
import { SYSTEM_MAP } from '@/lib/system-map';
import type { GenerationResult } from '@/lib/types';

export class WriterAgent {
  static async generate(params: {
    clientId: string;
    docType: string;
    docSubtype?: string;
  }): Promise<GenerationResult> {
    const supabase = createServerClient();

    // 1. Buscar config do sistema
    const systemConfig = SYSTEM_MAP[params.docType];
    if (!systemConfig) throw new Error(`Sistema não encontrado para doc_type: ${params.docType}`);

    // 2. Ler arquivos .md do sistema via symlinks
    let systemInstructions: string;
    let filesRead: string[];
    try {
      const result = await readSystemFiles(systemConfig.symlinkDir);
      systemInstructions = result.content;
      filesRead = result.files;
    } catch (err: any) {
      throw new Error(`Erro ao ler sistema ${systemConfig.symlinkDir}: ${err.message}. Execute scripts/setup-symlinks.sh`);
    }

    // 3. Buscar perfil do cliente
    const { data: client } = await supabase
      .from('clients')
      .select('*, client_profiles(*)')
      .eq('id', params.clientId)
      .single();

    if (!client) throw new Error('Cliente não encontrado');
    if (!client.client_profiles) throw new Error('Perfil não extraído. Execute a extração primeiro.');

    const profileContext = JSON.stringify(client.client_profiles, null, 2);

    // 4. Buscar error_rules ativas
    const { data: errorRules } = await supabase
      .from('error_rules')
      .select('*')
      .eq('active', true)
      .or(`doc_type.is.null,doc_type.eq.${params.docType}`);

    const errorRulesText = (errorRules || [])
      .map(r => {
        const prefix = r.rule_action === 'block' ? '⛔ OBRIGATÓRIO' : r.rule_action === 'warn' ? '⚠️ ALERTA' : '🔧 AUTO-FIX';
        return `[${prefix}] [${r.severity.toUpperCase()}] ${r.rule_description}${r.rule_pattern ? ` (padrão: ${r.rule_pattern})` : ''}`;
      })
      .join('\n');

    // 5. Montar prompt completo
    const prompt = `${systemInstructions}

=== DADOS DO CLIENTE ===
Nome: ${client.name}
Tipo de visto: ${client.visa_type}
Endeavor: ${client.proposed_endeavor || 'Não definido'}
SOC: ${client.soc_code || '?'} — ${client.soc_title || '?'}
Empresa: ${client.company_name || 'Não definida'}
Localização: ${client.location_city || '?'}, ${client.location_state || '?'}

=== PERFIL EXTRAÍDO ===
${profileContext}

=== REGRAS DE ERRO ACUMULADAS (OBEDEÇA TODAS) ===
${errorRulesText || 'Nenhuma regra adicional.'}

=== INSTRUÇÃO ===
Gere o documento completo para ${client.name}.
Siga RIGOROSAMENTE as instruções do sistema acima.
O output deve ser o texto completo do documento, formatado conforme especificado.
${params.docSubtype ? `Subtipo: ${params.docSubtype}` : ''}`;

    // 6. Estimar tokens
    const estimatedTokens = Math.round(prompt.length / 4);

    // 7. Registrar geração no Supabase
    await supabase.from('activity_log').insert({
      client_id: params.clientId,
      action: 'prompt_generated',
      details: {
        doc_type: params.docType,
        system: systemConfig.name,
        files_read: filesRead.length,
        rules_applied: (errorRules || []).length,
        estimated_tokens: estimatedTokens,
      },
    });

    return {
      prompt,
      metadata: {
        system: systemConfig.name,
        version: systemConfig.symlinkDir,
        rules_count: (errorRules || []).length,
        estimated_tokens: estimatedTokens,
        files_read: filesRead,
      },
    };
  }
}
```

## Arquivo: src/agents/quality.ts

```typescript
import { runPython } from '@/lib/python-runner';
import { createServerClient } from '@/lib/supabase';

export class QualityAgent {
  static async validate(params: {
    docxPath: string;
    docType: string;
    clientName: string;
  }) {
    const supabase = createServerClient();

    // 1. Extrair texto do DOCX
    let docText = '';
    try {
      docText = await runPython('extract_docx.py', [params.docxPath]);
    } catch {
      return { score: { total_violations: 1 }, passed: false, notes: 'Não foi possível extrair texto do DOCX' };
    }

    // 2. Buscar regras ativas
    const { data: rules } = await supabase
      .from('error_rules')
      .select('*')
      .eq('active', true)
      .in('rule_action', ['block', 'warn'])
      .or(`doc_type.is.null,doc_type.eq.${params.docType}`);

    // 3. Validar cada regra com pattern
    const violations: any[] = [];
    for (const rule of rules || []) {
      if (rule.rule_pattern) {
        try {
          const regex = new RegExp(rule.rule_pattern, 'gi');
          const matches = docText.match(regex);
          if (matches && matches.length > 0) {
            violations.push({
              rule_id: rule.id,
              description: rule.rule_description,
              action: rule.rule_action,
              severity: rule.severity,
              matches_found: matches.length,
              samples: matches.slice(0, 3),
            });
            await supabase.rpc('increment_rule_trigger', { rule_id: rule.id });
          }
        } catch {}
      }
    }

    // 4. Verificar nome do cliente
    if (params.clientName && !docText.includes(params.clientName)) {
      violations.push({
        rule_id: null,
        description: `Nome "${params.clientName}" não encontrado no documento`,
        action: 'warn',
        severity: 'high',
        matches_found: 0,
      });
    }

    const blockViolations = violations.filter(v => v.action === 'block');
    const passed = blockViolations.length === 0;

    return {
      score: {
        total_violations: violations.length,
        block_violations: blockViolations.length,
        warn_violations: violations.filter(v => v.action === 'warn').length,
        details: violations,
      },
      passed,
      notes: passed
        ? `Validação OK. ${violations.length} alertas (sem bloqueios).`
        : `${blockViolations.length} violação(ões) bloqueante(s) encontrada(s).`,
    };
  }
}
```

## Arquivo: src/agents/uscis-reviewer.ts

CRÍTICO: NÃO chama API. Retorna prompt para Paulo colar no Claude Code.

```typescript
import { runPython } from '@/lib/python-runner';

export class USCISReviewer {
  static async buildReviewPrompt(params: {
    docxPath: string;
    docType: string;
    visaType: string;
    clientName: string;
  }): Promise<string> {
    let docText = '';
    try {
      docText = await runPython('extract_docx.py', [params.docxPath]);
    } catch {
      docText = '[Não foi possível extrair texto]';
    }

    const criteriaBlock = params.visaType === 'EB-1A'
      ? `CRITÉRIOS EB-1A (avalie cada um):
C1: Awards/Prizes of national or international recognition
C2: Membership in associations requiring outstanding achievement
C3: Published material about the beneficiary
C4: Judging the work of others
C5: Original contributions of major significance
C6: Scholarly articles
C7: Exhibition of work
C8: Leading or critical role in distinguished organizations
C9: High salary or remuneration
C10: Commercial success in the performing arts

Use o Kazarian 2-step analysis.`
      : params.visaType === 'EB-2-NIW'
      ? `PILARES DHANASAR (avalie cada um):
Prong 1: O proposed endeavor tem mérito substancial e importância nacional?
Prong 2: O peticionário está bem posicionado para avançar o endeavor?
Prong 3: No balanço, seria benéfico para os EUA dispensar o requisito de oferta de emprego?`
      : `Avalie conforme critérios do visto ${params.visaType}.`;

    return `Você é um oficial adjudicador da USCIS revisando uma petição ${params.visaType} para ${params.clientName}.

${criteriaBlock}

Para cada critério/pilar, classifique como:
- 🟢 VERDE: Forte, evidência convincente
- 🟡 AMARELO: Adequado mas poderia ser reforçado
- 🔴 VERMELHO: Fraco, alta probabilidade de RFE

Retorne um JSON:
{
  "overall_risk": "green|yellow|red",
  "criteria": { "C1": {"risk": "green", "assessment": "...", "suggestions": "..."}, ... },
  "rfe_likely_topics": ["..."],
  "strengths": ["..."],
  "weaknesses": ["..."]
}

DOCUMENTO PARA REVISÃO:
${docText.substring(0, 100000)}`;
  }
}
```

## Arquivo: src/agents/auto-debugger.ts

CRÍTICO: NÃO chama API. Retorna prompt de classificação para Paulo colar no Claude Code.

```typescript
import { createServerClient } from '@/lib/supabase';

export class AutoDebugger {
  static async buildClassificationPrompt(params: {
    docType: string;
    errorDescription: string;
    errorLocation?: string;
  }): Promise<string> {
    const supabase = createServerClient();

    // Buscar regras existentes para evitar duplicatas
    const { data: existingRules } = await supabase
      .from('error_rules')
      .select('rule_description, rule_pattern')
      .eq('active', true);

    return `Classifique este erro encontrado num documento de imigração:

Tipo de documento: ${params.docType}
Descrição do erro: ${params.errorDescription}
${params.errorLocation ? `Localização: ${params.errorLocation}` : ''}

REGRAS EXISTENTES (não duplicar):
${JSON.stringify(existingRules || [], null, 2)}

Retorne um JSON:
{
  "rule_type": "forbidden_term|formatting|content|logic|legal|terminology|visual",
  "severity": "low|medium|high|critical",
  "rule_description": "descrição clara da regra em português",
  "rule_pattern": "regex ou texto literal (null se não aplicável)",
  "rule_action": "block|warn|auto_fix",
  "auto_fix_replacement": "texto de substituição (null se não for auto_fix)",
  "doc_type": "tipo específico ou null para todos"
}

Retorne APENAS o JSON.`;
  }

  static async saveRule(ruleJson: any, docType: string) {
    const supabase = createServerClient();

    const { data: rule } = await supabase
      .from('error_rules')
      .insert({
        ...ruleJson,
        doc_type: ruleJson.doc_type || (docType === 'all' ? null : docType),
        source: 'paulo_feedback',
        active: true,
      })
      .select()
      .single();

    return rule;
  }
}
```

---

# ═══════════════════════════════════════
# BLOCO 3: API ROUTES
# ═══════════════════════════════════════

## Arquivo: src/app/api/clients/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { createClientSchema } from '@/lib/schemas';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get('status');
  const visa_type = searchParams.get('visa_type');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = supabase.from('clients').select('*, client_profiles(*)', { count: 'exact' });

  if (status) query = query.eq('status', status);
  if (visa_type) query = query.eq('visa_type', visa_type);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);

  const { data, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  if (error) return apiError(error.message);
  return apiSuccess({ data, total: count, page, totalPages: Math.ceil((count || 0) / limit) });
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const parsed = createClientSchema.safeParse(body);
  if (!parsed.success) return apiError(JSON.stringify(parsed.error.flatten()), 400);

  const { data, error } = await supabase.from('clients').insert(parsed.data).select().single();
  if (error) return apiError(error.message);

  // Criar perfil vazio
  await supabase.from('client_profiles').insert({ client_id: data.id });

  // Log
  await supabase.from('activity_log').insert({
    client_id: data.id,
    action: 'client_created',
    details: { visa_type: data.visa_type },
  });

  return apiSuccess(data, 201);
}
```

## Arquivo: src/app/api/clients/[id]/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*, client_profiles(*), documents(*), activity_log(*)')
    .eq('id', params.id)
    .single();

  if (error) return apiError('Cliente não encontrado', 404);
  return apiSuccess(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase.from('clients').update(body).eq('id', params.id).select().single();
  if (error) return apiError(error.message);
  return apiSuccess(data);
}
```

## Arquivo: src/app/api/clients/[id]/extract/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const body = await req.json().catch(() => ({}));

  const { data: client } = await supabase.from('clients').select('*, client_profiles(*)').eq('id', params.id).single();
  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

  const folderPath = body.folder_path || client.docs_folder_path;
  if (!folderPath) return NextResponse.json({ error: 'Nenhum caminho de documentos configurado' }, { status: 400 });

  // Stream SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const { ExtractorAgent } = await import('@/agents/extractor');
        const result = await ExtractorAgent.extract(folderPath, params.id, (progress) => {
          send('progress', progress);
        });

        send('complete', {
          totalFiles: result.totalFiles,
          totalTextLength: result.totalTextLength,
          inventoryCount: result.inventory.length,
          prompt: result.prompt,
        });
      } catch (err: any) {
        send('error', { message: err.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  });
}
```

## Arquivo: src/app/api/clients/[id]/profile/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('client_profiles').select('*').eq('client_id', params.id).single();
  if (error) return apiError('Perfil não encontrado', 404);
  return apiSuccess(data);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('client_profiles')
    .upsert({ client_id: params.id, ...body, extracted_at: new Date().toISOString() }, { onConflict: 'client_id' })
    .select()
    .single();

  if (error) return apiError(error.message);

  await supabase.from('activity_log').insert({
    client_id: params.id,
    action: 'profile_extracted',
    details: { fields_count: Object.keys(body).length },
  });

  return apiSuccess(data, 201);
}
```

## Arquivo: src/app/api/generate/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { generateSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) return apiError(JSON.stringify(parsed.error.flatten()), 400);

  try {
    const { WriterAgent } = await import('@/agents/writer');
    const result = await WriterAgent.generate({
      clientId: parsed.data.client_id,
      docType: parsed.data.doc_type,
      docSubtype: parsed.data.doc_subtype,
    });

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err.message);
  }
}
```

## Arquivo: src/app/api/errors/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  let query = supabase.from('error_rules').select('*');

  const active = searchParams.get('active');
  if (active !== null) query = query.eq('active', active === 'true');

  const rule_type = searchParams.get('rule_type');
  if (rule_type) query = query.eq('rule_type', rule_type);

  const severity = searchParams.get('severity');
  if (severity) query = query.eq('severity', severity);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return apiError(error.message);
  return apiSuccess(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase.from('error_rules').insert({ ...body, source: 'manual' }).select().single();
  if (error) return apiError(error.message);

  return apiSuccess(data, 201);
}
```

## Arquivo: src/app/api/errors/[id]/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase.from('error_rules').update(body).eq('id', params.id).select().single();
  if (error) return apiError(error.message);
  return apiSuccess(data);
}
```

## Arquivo: src/app/api/errors/report/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  try {
    const { AutoDebugger } = await import('@/agents/auto-debugger');
    const prompt = await AutoDebugger.buildClassificationPrompt({
      docType: body.doc_type || 'all',
      errorDescription: body.error_description,
      errorLocation: body.error_location,
    });

    return apiSuccess({ prompt, instructions: 'Cole este prompt no Claude Code. Depois cole o JSON resultante em POST /api/errors para criar a regra.' });
  } catch (err: any) {
    return apiError(err.message);
  }
}
```

## Arquivo: src/app/api/quality/stats/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  const { data: docs } = await supabase.from('documents').select('doc_type, quality_passed, quality_score');

  const stats = {
    total_documents: docs?.length || 0,
    passed: docs?.filter(d => d.quality_passed === true).length || 0,
    failed: docs?.filter(d => d.quality_passed === false).length || 0,
    pending: docs?.filter(d => d.quality_passed === null).length || 0,
  };

  return apiSuccess(stats);
}
```

## Arquivo: src/app/api/systems/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { checkSymlink, countFiles } from '@/lib/file-reader';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  const { data, error } = await supabase.from('system_versions').select('*').order('system_name');
  if (error) return apiError(error.message);

  const systemsWithStatus = await Promise.all(
    (data || []).map(async (sys) => ({
      ...sys,
      symlink_ok: await checkSymlink(sys.system_path),
      file_count_actual: await countFiles(sys.system_path),
    }))
  );

  return apiSuccess(systemsWithStatus);
}
```

## Arquivo: src/app/api/systems/setup-symlinks/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { setupSymlinks } from '@/lib/file-reader';

export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  const { data: systems } = await supabase.from('system_versions').select('*').eq('is_active', true);
  const results = await setupSymlinks(systems || []);

  return apiSuccess(results);
}
```

## Arquivo: src/app/api/dashboard/stats/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  const [clientsRes, docsRes, errorsRes] = await Promise.all([
    supabase.from('clients').select('status', { count: 'exact' }),
    supabase.from('documents').select('status, doc_type, quality_passed'),
    supabase.from('error_rules').select('severity, times_triggered', { count: 'exact' }).eq('active', true),
  ]);

  return apiSuccess({
    clients: {
      total: clientsRes.count || 0,
      active: clientsRes.data?.filter(c => c.status === 'active').length || 0,
    },
    documents: {
      total: docsRes.data?.length || 0,
      passed: docsRes.data?.filter(d => d.quality_passed === true).length || 0,
      failed: docsRes.data?.filter(d => d.quality_passed === false).length || 0,
    },
    errors: {
      active_rules: errorsRes.count || 0,
      total_triggers: errorsRes.data?.reduce((sum, r) => sum + r.times_triggered, 0) || 0,
      critical: errorsRes.data?.filter(r => r.severity === 'critical').length || 0,
    },
  });
}
```

## Arquivo: src/app/api/documents/route.ts

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  let query = supabase.from('documents').select('*, clients(name, visa_type)');

  const client_id = searchParams.get('client_id');
  if (client_id) query = query.eq('client_id', client_id);

  const doc_type = searchParams.get('doc_type');
  if (doc_type) query = query.eq('doc_type', doc_type);

  const { data, error } = await query.order('generated_at', { ascending: false }).limit(100);
  if (error) return apiError(error.message);
  return apiSuccess(data);
}
```

---

# ═══════════════════════════════════════
# BLOCO 4: SCRIPTS PYTHON
# ═══════════════════════════════════════

## Arquivo: scripts/extract_pdf.py

```python
#!/usr/bin/env python3
"""Extrai texto de um PDF usando pdfplumber."""
import sys
import pdfplumber

def extract(path):
    text = []
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text.append(t)
    except Exception as e:
        print(f"ERRO: {e}", file=sys.stderr)
        sys.exit(1)
    print('\n'.join(text))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: extract_pdf.py <caminho_pdf>", file=sys.stderr)
        sys.exit(1)
    extract(sys.argv[1])
```

## Arquivo: scripts/extract_docx.py

```python
#!/usr/bin/env python3
"""Extrai texto de um DOCX usando python-docx."""
import sys
from docx import Document

def extract(path):
    try:
        doc = Document(path)
        text = []
        for para in doc.paragraphs:
            if para.text.strip():
                text.append(para.text)
        for table in doc.tables:
            for row in table.rows:
                cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if cells:
                    text.append(' | '.join(cells))
        print('\n'.join(text))
    except Exception as e:
        print(f"ERRO: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: extract_docx.py <caminho_docx>", file=sys.stderr)
        sys.exit(1)
    extract(sys.argv[1])
```

## Arquivo: scripts/requirements.txt

```
pdfplumber==0.11.4
python-docx==1.1.2
PyMuPDF==1.24.0
Pillow==10.4.0
```

## Arquivo: scripts/setup-symlinks.sh

```bash
#!/bin/bash
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SYSTEMS_DIR="$PROJECT_ROOT/systems"
BASE="/Users/paulo1844/Documents"

echo "Configurando symlinks em $SYSTEMS_DIR..."

rm -rf "$SYSTEMS_DIR"
mkdir -p "$SYSTEMS_DIR"

link_system() {
  local name="$1"
  local target="$2"
  if [ -d "$target" ]; then
    ln -s "$target" "$SYSTEMS_DIR/$name"
    echo "  OK $name"
  else
    echo "  FALTANDO $name -> $target"
  fi
}

link_system "cover-letter-eb1a" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5"
link_system "cover-letter-eb2-niw" "$BASE/AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions"
link_system "resume-eb1a" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM"
link_system "business-plan" "$BASE/OMNI/_IMIGRAÇÃO/BP Orquestrador/SETUP_GUIDE_2"
link_system "metodologia" "$BASE/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Metodologia (PROMPTS)"
link_system "declaracao-intencoes" "$BASE/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)"
link_system "impacto" "$BASE/_Z GLOBAL/_PRODUTO NOVO/agents"
link_system "estrategia-eb2" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS"
link_system "estrategia-eb1" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)"
link_system "localizacao" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZAÇÃO - PROMPT"
link_system "quality-notes" "$BASE/Aqui OBSIDIAN/PROEX/Pareceres da Qualidade"
link_system "satellite-letters" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_2. MEUS CASOS"

echo ""
echo "Setup concluído!"
ls -la "$SYSTEMS_DIR"
```

---

# ═══════════════════════════════════════
# BLOCO 5: VERIFICAÇÕES FINAIS
# ═══════════════════════════════════════

Após criar TODOS os arquivos acima:

1. Rodar `npx tsc --noEmit` — deve ter ZERO erros
2. Verificar que NÃO existe nenhum import de `@anthropic-ai/sdk` ou `@google/generative-ai`
3. Verificar que NÃO existe nenhuma chamada a `callClaude()` ou `callGemini()` ou `anthropic.messages.create()`
4. Rodar `bash scripts/setup-symlinks.sh`
5. Verificar que `pip3 install -r scripts/requirements.txt` funciona
6. Rodar `npm run dev` e verificar que localhost:3000 carrega sem erros
7. Testar GET /api/clients retorna { data: [] }
8. Testar GET /api/errors retorna { data: [] }
9. Testar GET /api/systems retorna dados dos 10 sistemas seed
10. Testar GET /api/dashboard/stats retorna stats zerados

Commit final:
```bash
git add -A
git commit -m "feat: build completo do back-end — agentes, API routes, lib, scripts Python. Zero API paga."
git push
```

NÃO PERGUNTE NADA. EXECUTE TUDO.
