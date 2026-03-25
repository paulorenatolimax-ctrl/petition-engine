import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { execSync } from 'child_process';

interface ExtractorInput {
  clientName: string;
  visaType: string;
  docsPath: string;
  proposedEndeavor?: string;
  previousDenied?: boolean;
  denialReasons?: string;
  mode?: 'smart' | 'full' | 'category';
  maxChars?: number;
  category?: string;
}

interface ExtractedFile {
  filename: string;
  path: string;
  type: string;
  content: string;
  sizeKb: number;
  priority: number;
}

const PRIORITY_PATTERNS: { priority: number; label: string; patterns: RegExp[] }[] = [
  { priority: 1, label: 'CV/Resume/BP', patterns: [/cv/i, /resume/i, /resum[eé]/i, /curriculum/i, /business.?plan/i, /\bBP\b/, /projeto.?base/i] },
  { priority: 2, label: 'Expert/Reference', patterns: [/expert.?opinion/i, /\bEOL\b/i, /recommendation/i, /reference.?letter/i, /endorsement/i] },
  { priority: 3, label: 'Cover/Petition', patterns: [/cover.?letter/i, /petition/i, /declaration/i, /intent/i, /personal.?statement/i] },
  { priority: 4, label: 'Evidence/Exhibits', patterns: [/evidence/i, /exhibit/i, /certificate/i, /award/i, /publication/i, /diploma/i] },
  { priority: 5, label: 'RFE/Denial', patterns: [/rfe/i, /denial/i, /noid/i, /response/i, /auditoria/i] },
  { priority: 6, label: 'Other', patterns: [] },
];

function getFilePriority(filename: string): number {
  for (const p of PRIORITY_PATTERNS) {
    if (p.patterns.some(rx => rx.test(filename))) return p.priority;
  }
  return 6;
}

function listFilesRecursive(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (!entry.startsWith('.') && entry !== 'node_modules') {
          listFilesRecursive(fullPath, files);
        }
      } else {
        const ext = extname(entry).toLowerCase();
        if (['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf'].includes(ext)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Skip inaccessible files
    }
  }
  return files;
}

function extractFileContent(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  try {
    if (ext === '.txt' || ext === '.md') {
      return readFileSync(filePath, 'utf-8').slice(0, 50000);
    }
    if (ext === '.pdf') {
      const result = execSync(
        `python3 scripts/extract_pdf.py "${filePath.replace(/"/g, '\\"')}"`,
        { encoding: 'utf-8', timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
      );
      return result.slice(0, 50000);
    }
    if (ext === '.docx' || ext === '.doc') {
      const result = execSync(
        `python3 scripts/extract_docx.py "${filePath.replace(/"/g, '\\"')}"`,
        { encoding: 'utf-8', timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
      );
      return result.slice(0, 50000);
    }
  } catch (e: any) {
    return `[ERRO AO EXTRAIR: ${e.message}]`;
  }
  return '[FORMATO NÃO SUPORTADO]';
}

export function runExtractor(input: ExtractorInput): {
  prompt: string;
  metadata: {
    filesFound: number;
    filesExtracted: number;
    filesSkipped: number;
    totalChars: number;
    fileList: string[];
    mode: string;
    maxChars: number;
    prioritiesIncluded: string[];
  };
} {
  const mode = input.mode || 'smart';
  const maxChars = input.maxChars || 320000;
  const allFiles = listFilesRecursive(input.docsPath);

  // Extract all files with their priority
  const allExtracted: ExtractedFile[] = [];
  for (const filePath of allFiles) {
    const content = extractFileContent(filePath);
    if (content.length < 100) continue; // Skip near-empty files
    allExtracted.push({
      filename: basename(filePath),
      path: filePath,
      type: extname(filePath).toLowerCase().replace('.', ''),
      content,
      sizeKb: Math.round(content.length / 1024),
      priority: getFilePriority(basename(filePath)),
    });
  }

  let selected: ExtractedFile[];
  const prioritiesIncluded: string[] = [];

  if (mode === 'full') {
    selected = allExtracted;
    prioritiesIncluded.push('ALL');
  } else {
    // Smart mode: add files by priority until maxChars
    selected = [];
    let currentChars = 0;

    // Sort by priority then by size (smaller files first within same priority)
    const sorted = [...allExtracted].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.content.length - b.content.length;
    });

    const includedPriorities = new Set<number>();

    for (const file of sorted) {
      if (currentChars + file.content.length > maxChars) continue;
      selected.push(file);
      currentChars += file.content.length;
      includedPriorities.add(file.priority);
    }

    for (const p of Array.from(includedPriorities)) {
      const label = PRIORITY_PATTERNS.find(pp => pp.priority === p)?.label || `P${p}`;
      prioritiesIncluded.push(label);
    }
  }

  const totalChars = selected.reduce((sum, f) => sum + f.content.length, 0);
  const filesSkipped = allExtracted.length - selected.length;

  // Build prompt
  const filesSection = selected.map((f, i) =>
    `### ARQUIVO ${i + 1}: ${f.filename} (${f.type}, ${f.sizeKb}KB, prioridade ${f.priority})\n${f.content}\n`
  ).join('\n---\n\n');

  const prompt = `# EXTRAÇÃO DE PERFIL DO CLIENTE: ${input.clientName}

## CONTEXTO
- Tipo de visto: ${input.visaType}
- Proposed Endeavor: ${input.proposedEndeavor || 'Não informado'}
- Petição anterior negada: ${input.previousDenied ? 'SIM — ' + (input.denialReasons || 'motivos não especificados') : 'NÃO'}
- Total de documentos na pasta: ${allFiles.length}
- Documentos incluídos neste prompt: ${selected.length} (modo: ${mode}, limite: ${maxChars.toLocaleString()} chars)
- Documentos pulados: ${filesSkipped}
- Total de caracteres: ${totalChars.toLocaleString()}

## INSTRUÇÃO
Analise TODOS os documentos abaixo e gere um JSON completo com o perfil do beneficiário.
O JSON deve conter TODOS os campos relevantes para a petição ${input.visaType}.

### Estrutura esperada do JSON:

\`\`\`json
{
  "personal": {
    "full_name": "",
    "nationality": "",
    "date_of_birth": "",
    "education": [{ "degree": "", "field": "", "institution": "", "year": "", "country": "" }],
    "languages": []
  },
  "professional": {
    "current_title": "",
    "current_employer": "",
    "years_experience": 0,
    "specialization": "",
    "employment_history": [{ "title": "", "company": "", "dates": "", "description": "" }],
    "skills": [],
    "certifications": [{ "name": "", "issuer": "", "year": "" }]
  },
  "academic": {
    "publications": [{ "title": "", "journal": "", "year": "", "citations": 0 }],
    "peer_review": { "journals": [], "count": 0 },
    "memberships": [{ "organization": "", "level": "", "since": "" }],
    "awards": [],
    "presentations": []
  },
  "immigration": {
    "proposed_endeavor": "",
    "field_of_expertise": "",
    "national_importance_argument": "",
    "well_positioned_argument": "",
    "balance_of_factors_argument": "",
    "soc_code": "",
    "soc_title": "",
    "target_location": { "city": "", "state": "" }
  },
  "business": {
    "company_name": "",
    "company_type": "",
    "naics_code": "",
    "business_plan_exists": false,
    "revenue_projections": [],
    "employees_planned": 0,
    "investment_amount": ""
  },
  "evidence": {
    "support_letters": [{ "from": "", "title": "", "organization": "", "relationship": "" }],
    "exhibits": [{ "number": 0, "description": "", "source_file": "" }]
  },
  "previous_petition": {
    "denied": ${input.previousDenied || false},
    "denial_reasons": "${input.denialReasons || ''}",
    "rfe_history": [],
    "improvements_needed": []
  }
}
\`\`\`

Extraia TODOS os dados dos documentos. Não invente nada. Se um campo não tem informação nos documentos, use null.
Para evidências e exhibits, referencie o arquivo de origem.

## DOCUMENTOS EXTRAÍDOS

${filesSection}

## RESPOSTA

Gere o JSON completo acima com todos os dados extraídos dos documentos.`;

  return {
    prompt,
    metadata: {
      filesFound: allFiles.length,
      filesExtracted: selected.length,
      filesSkipped,
      totalChars,
      fileList: selected.map(f => f.filename),
      mode,
      maxChars,
      prioritiesIncluded,
    },
  };
}
