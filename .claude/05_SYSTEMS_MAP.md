# 05 — MAPA DE SISTEMAS (SYMLINKS)

Os sistemas de geração JÁ EXISTEM como coleções de arquivos `.md` nas pastas do Paulo. O Petition Engine usa **symlinks** para apontar para essas pastas — zero duplicação.

## Diretório `systems/`

```
petition-engine/
└── systems/                          ← TODOS são symlinks
    ├── cover-letter-eb1a/            → /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5
    ├── cover-letter-eb2-niw/         → /Users/paulo1844/Documents/AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions
    ├── resume-eb1a/                  → /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM
    ├── business-plan/                → /Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/BP Orquestrador/SETUP_GUIDE_2
    ├── metodologia/                  → /Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Metodologia (PROMPTS)
    ├── declaracao-intencoes/         → /Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)
    ├── impacto/                      → /Users/paulo1844/Documents/_Z GLOBAL/_PRODUTO NOVO/agents
    ├── estrategia-eb2/               → /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS
    ├── estrategia-eb1/               → /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)
    ├── localizacao/                  → /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZAÇÃO - PROMPT
    ├── quality-notes/                → /Users/paulo1844/Documents/Aqui OBSIDIAN/PROEX/Pareceres da Qualidade
    ├── satellite-letters/            → /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_2. MEUS CASOS
    ├── eb2-niw-letters-skill/        → /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Mariana Kasza (DIRETO)/eb2-niw-letters.skill
    └── rags-eb2-niw/                 → (RAGs EB-2 NIW — identificar pasta exata)
```

## Script de Setup dos Symlinks

Criar em `scripts/setup-symlinks.sh`:

```bash
#!/bin/bash
# ============================================
# PETITION ENGINE — Setup de Symlinks
# Roda uma vez no setup inicial, ou quando
# um sistema muda de pasta.
# ============================================

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SYSTEMS_DIR="$PROJECT_ROOT/systems"
BASE="/Users/paulo1844/Documents"

echo "🔗 Configurando symlinks em $SYSTEMS_DIR..."

# Limpar diretório systems (remove symlinks antigos, não os targets)
rm -rf "$SYSTEMS_DIR"
mkdir -p "$SYSTEMS_DIR"

# Função helper
link_system() {
  local name="$1"
  local target="$2"

  if [ -d "$target" ]; then
    ln -s "$target" "$SYSTEMS_DIR/$name"
    echo "  ✅ $name → $target"
  else
    echo "  ❌ $name → DIRETÓRIO NÃO ENCONTRADO: $target"
  fi
}

# ============================================
# SYMLINKS
# ============================================

link_system "cover-letter-eb1a" \
  "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5"

link_system "cover-letter-eb2-niw" \
  "$BASE/AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions"

link_system "resume-eb1a" \
  "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM"

link_system "business-plan" \
  "$BASE/OMNI/_IMIGRAÇÃO/BP Orquestrador/SETUP_GUIDE_2"

link_system "metodologia" \
  "$BASE/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Metodologia (PROMPTS)"

link_system "declaracao-intencoes" \
  "$BASE/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)"

link_system "impacto" \
  "$BASE/_Z GLOBAL/_PRODUTO NOVO/agents"

link_system "estrategia-eb2" \
  "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS"

link_system "estrategia-eb1" \
  "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)"

link_system "localizacao" \
  "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZAÇÃO - PROMPT"

link_system "quality-notes" \
  "$BASE/Aqui OBSIDIAN/PROEX/Pareceres da Qualidade"

link_system "satellite-letters" \
  "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_2. MEUS CASOS"

echo ""
echo "✅ Setup de symlinks concluído!"
echo "   Diretório: $SYSTEMS_DIR"
ls -la "$SYSTEMS_DIR"
```

## Mapeamento `doc_type` → Sistema

Usado pelo Orchestrator (`src/lib/orchestrator.ts`) para saber qual sistema ler:

```typescript
// src/lib/system-map.ts

export interface SystemConfig {
  name: string;
  symlinkDir: string;        // nome da pasta em systems/
  preferredModel: string;     // modelo Claude para este tipo
  requiresProfile: boolean;   // precisa de client_profile extraído?
  requiresDeepResearch: boolean; // usa Gemini DeepResearch?
  outputFormat: 'docx' | 'pdf' | 'md';
  estimatedTokens: number;    // estimativa de tokens por geração
  multiAgent: boolean;        // usa múltiplos agentes (IMPACTO)?
  sequentialPrompts?: number; // pipeline de N prompts sequenciais (Anteprojeto = 9)
  heterogeneity?: boolean;    // variação visual anti-ATLAS (cartas satélite)
  skillFile?: string;         // skill file separado (.skill) com instruções adicionais
}

export const SYSTEM_MAP: Record<string, SystemConfig> = {
  // ── Cover Letters ──
  cover_letter_eb1a: {
    name: 'Cover Letter EB-1A',
    symlinkDir: 'cover-letter-eb1a',
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 80000,
    multiAgent: false,
  },
  cover_letter_eb2_niw: {
    name: 'Cover Letter EB-2 NIW',
    symlinkDir: 'cover-letter-eb2-niw',
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 80000,
    multiAgent: false,
  },
  cover_letter_o1: {
    name: 'Cover Letter O-1',
    symlinkDir: 'cover-letter-eb1a', // usa mesmo sistema do EB-1A com adaptações
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 80000,
    multiAgent: false,
  },

  // ── Résumé ──
  resume: {
    name: 'Résumé EB-1A',
    symlinkDir: 'resume-eb1a',
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 40000,
    multiAgent: false,
  },

  // ── Business Plan ──
  business_plan: {
    name: 'Business Plan',
    symlinkDir: 'business-plan',
    preferredModel: 'claude-opus-4-20250115',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 120000,
    multiAgent: false,
  },

  // ── Metodologia & Declaração ──
  methodology: {
    name: 'Metodologia',
    symlinkDir: 'metodologia',
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 60000,
    multiAgent: false,
  },
  declaration_of_intentions: {
    name: 'Declaração de Intenções',
    symlinkDir: 'declaracao-intencoes',
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 50000,
    multiAgent: false,
  },

  // ── Anteprojeto (Pré-Projeto Base) ──
  // PIPELINE DE 9 PROMPTS SEQUENCIAIS — NÃO é derivado do BP, é o CONTRÁRIO (vem ANTES do BP)
  // Sistema real: os 9 prompts de EB-2 ESTRATÉGIAS
  // Fluxo: CV → prioridades nacionais → foco de negócio → serviços → políticas gov → missão/visão → BLS codes → síntese
  // Output: 20-40 páginas com 3 propostas concretas + 3-5 SOC codes
  // Após validação do cliente → alimenta o Projeto Base (BP)
  anteprojeto: {
    name: 'Anteprojeto (Pré-Projeto Base)',
    symlinkDir: 'estrategia-eb2', // os 9 prompts da estratégia EB-2 SÃO o anteprojeto
    preferredModel: 'claude-opus-4-20250115', // Opus pela complexidade estratégica
    requiresProfile: true,
    requiresDeepResearch: true, // precisa de dados de mercado, BLS, políticas governamentais
    outputFormat: 'docx',
    estimatedTokens: 200000, // 9 prompts sequenciais = muitos tokens
    multiAgent: false,
    sequentialPrompts: 9, // PIPELINE: executa 9 prompts em sequência
  },

  // ── Localização (DeepResearch) ──
  location_analysis: {
    name: 'Análise de Localização',
    symlinkDir: 'localizacao',
    preferredModel: 'gemini-2.0-flash', // usa Gemini, não Claude
    requiresProfile: true,
    requiresDeepResearch: true,
    outputFormat: 'docx',
    estimatedTokens: 100000,
    multiAgent: false,
  },

  // ── IMPACTO® (multi-agente) ──
  impacto_report: {
    name: 'IMPACTO®',
    symlinkDir: 'impacto',
    preferredModel: 'claude-opus-4-20250115',
    requiresProfile: true,
    requiresDeepResearch: true, // combina com DeepResearch
    outputFormat: 'docx',
    estimatedTokens: 200000,
    multiAgent: true, // 6 agentes especializados
  },

  // ── Cartas Satélite (com sistema de heterogeneidade anti-ATLAS) ──
  // A skill eb2-niw-letters.skill contém:
  //   - SKILL.md: instruções de geração (3 tipos: Satellite, Recommendation, Testimonial)
  //   - formatting-catalog.md: 15 combinações fonte×cor, 8 estilos de header, 6 formatos
  //   - docx-code-patterns.md: templates Node.js/docx-js
  // HETEROGENEIDADE: cada carta deve ter combinação visual ÚNICA (fonte, cor, estrutura, formato)
  // Objetivo: derrotar USCIS ATLAS/ATA anti-boilerplate detection
  satellite_letter: {
    name: 'Carta Satélite',
    symlinkDir: 'satellite-letters',
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 30000,
    multiAgent: false,
    heterogeneity: true,          // CRÍTICO: variação visual anti-ATLAS
    skillFile: 'eb2-niw-letters-skill', // skill com catálogo de formatação
  },

  // ── Relatório Fotográfico ──
  photographic_report: {
    name: 'Relatório Fotográfico',
    symlinkDir: 'quality-notes', // referencia pareceres para saber quais evidências
    preferredModel: 'claude-sonnet-4-20250514',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 20000,
    multiAgent: false,
  },

  // ── RFE Response ──
  rfe_response: {
    name: 'Resposta a RFE',
    symlinkDir: 'cover-letter-eb1a', // usa sistema de cover letter como base
    preferredModel: 'claude-opus-4-20250115', // Opus para RFE (alta complexidade)
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 150000,
    multiAgent: false,
  },

  // ── Estratégias ──
  strategy_eb1: {
    name: 'Estratégia EB-1A',
    symlinkDir: 'estrategia-eb1',
    preferredModel: 'claude-opus-4-20250115',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 100000,
    multiAgent: false,
  },
  strategy_eb2: {
    name: 'Estratégia EB-2 NIW',
    symlinkDir: 'estrategia-eb2',
    preferredModel: 'claude-opus-4-20250115',
    requiresProfile: true,
    requiresDeepResearch: false,
    outputFormat: 'docx',
    estimatedTokens: 100000,
    multiAgent: false,
  },
};
```

## Utilitário `file-reader.ts`

```typescript
// src/lib/file-reader.ts

import fs from 'fs/promises';
import path from 'path';

const SYSTEMS_BASE = path.join(process.cwd(), 'systems');

/**
 * Lê todos os arquivos .md de um sistema e retorna concatenado
 */
export async function readSystemFiles(symlinkDir: string): Promise<string> {
  const systemPath = path.join(SYSTEMS_BASE, symlinkDir);

  // Verificar se symlink existe e é válido
  try {
    const stat = await fs.stat(systemPath);
    if (!stat.isDirectory()) throw new Error(`${systemPath} não é um diretório`);
  } catch {
    throw new Error(`Sistema não encontrado: ${symlinkDir}. Execute scripts/setup-symlinks.sh`);
  }

  // Ler todos os .md recursivamente
  const files = await getMarkdownFiles(systemPath);

  if (files.length === 0) {
    throw new Error(`Nenhum arquivo .md encontrado em ${symlinkDir}`);
  }

  // Ordenar por nome (garante ordem consistente)
  files.sort();

  // Concatenar com separadores
  const contents: string[] = [];
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const relativePath = path.relative(systemPath, file);
    contents.push(`\n<!-- === ${relativePath} === -->\n${content}`);
  }

  return contents.join('\n');
}

/**
 * Lista recursiva de arquivos .md
 */
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

/**
 * Verifica se symlink está ok
 */
export async function checkSymlinks(systemPath: string): Promise<boolean> {
  try {
    await fs.access(systemPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Conta arquivos em um diretório
 */
export async function countFiles(dir: string): Promise<number> {
  try {
    const files = await getMarkdownFiles(dir);
    return files.length;
  } catch {
    return 0;
  }
}

/**
 * Escaneia diretório de sistema
 */
export async function scanSystemDirectory(systemPath: string) {
  try {
    await fs.access(systemPath);
    const files = await getMarkdownFiles(systemPath);

    // Detectar versão pelo nome da pasta
    const dirName = path.basename(systemPath);
    const versionMatch = dirName.match(/v(\d+)/i);

    return {
      exists: true,
      file_count: files.length,
      files: files.map(f => path.relative(systemPath, f)),
      detected_version: versionMatch ? `v${versionMatch[1]}.0.0` : null,
      hash: files.length.toString(), // simplificado; em produção usar hash real
    };
  } catch {
    return { exists: false, file_count: 0, files: [], detected_version: null, hash: null };
  }
}

/**
 * Cria symlinks baseado nos registros do Supabase
 */
export async function setupSymlinks(systems: Array<{ system_name: string; system_path: string }>) {
  const results: Array<{ name: string; status: 'ok' | 'error'; message?: string }> = [];

  // Criar diretório systems se não existir
  await fs.mkdir(SYSTEMS_BASE, { recursive: true });

  for (const sys of systems) {
    const linkName = sys.system_name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const linkPath = path.join(SYSTEMS_BASE, linkName);

    try {
      // Remover symlink antigo se existir
      try { await fs.unlink(linkPath); } catch {}

      // Verificar se target existe
      await fs.access(sys.system_path);

      // Criar symlink
      await fs.symlink(sys.system_path, linkPath);
      results.push({ name: sys.system_name, status: 'ok' });
    } catch (err: any) {
      results.push({ name: sys.system_name, status: 'error', message: err.message });
    }
  }

  return results;
}
```

---

## Pipeline de 9 Prompts: Anteprojeto EB-2 NIW

O sistema de Estratégias EB-2 (`estrategia-eb2/`) contém 9 prompts que executam sequencialmente. O Anteprojeto Agent deve executá-los em ordem, alimentando cada prompt com o output do anterior.

```typescript
// src/agents/anteprojeto-pipeline.ts

export const ANTEPROJETO_PROMPTS = [
  {
    step: 1,
    name: 'Mapeamento CV → Prioridades Nacionais',
    description: 'Mapeia CV do cliente para áreas prioritárias nacionais dos EUA + encontra 3-5 políticas governamentais alinhadas',
    input: ['client_profile', 'cv_text'],
    output: 'national_priorities_map',
    requiresWebSearch: true, // precisa de dados de políticas atuais
  },
  {
    step: 2,
    name: 'Foco de Negócio Concentrado',
    description: 'Extrai UM foco de negócio concentrado a partir do mapeamento',
    input: ['national_priorities_map'],
    output: 'business_focus_statement',
    requiresWebSearch: false,
  },
  {
    step: 3,
    name: 'Serviços + Curso + Setores',
    description: 'Define 5 serviços estratégicos, 4 módulos de curso, 4 setores-alvo',
    input: ['business_focus_statement', 'client_profile'],
    output: 'services_sectors_definition',
    requiresWebSearch: false,
  },
  {
    step: 4,
    name: 'Alinhamento Dimensional — Negócio',
    description: 'Alinhamento com políticas governamentais — dimensão negócio (3-5 políticas)',
    input: ['business_focus_statement'],
    output: 'policy_alignment_business',
    requiresWebSearch: true,
  },
  {
    step: 5,
    name: 'Alinhamento Dimensional — Serviços',
    description: 'Alinhamento com políticas governamentais — dimensão serviços (3-5 políticas)',
    input: ['services_sectors_definition'],
    output: 'policy_alignment_services',
    requiresWebSearch: true,
  },
  {
    step: 6,
    name: 'Alinhamento Dimensional — Setores',
    description: 'Alinhamento com políticas governamentais — dimensão setores (3-5 políticas)',
    input: ['services_sectors_definition'],
    output: 'policy_alignment_sectors',
    requiresWebSearch: true,
  },
  {
    step: 7,
    name: 'Missão / Visão / Valores',
    description: 'Formaliza Missão, Visão e Valores do empreendimento',
    input: ['business_focus_statement', 'services_sectors_definition'],
    output: 'mission_vision_values',
    requiresWebSearch: false,
  },
  {
    step: 8,
    name: 'Códigos BLS de Ocupação',
    description: 'Identifica 4 códigos de ocupação BLS com citações oficiais',
    input: ['business_focus_statement', 'client_profile'],
    output: 'bls_occupation_codes',
    requiresWebSearch: true, // precisa consultar BLS.gov
  },
  {
    step: 9,
    name: 'Síntese Final — Anteprojeto Completo',
    description: 'Sintetiza tudo em documento executivo de 20-40 páginas com 3 propostas concretas + quadro comparativo',
    input: ['ALL_PREVIOUS_OUTPUTS'],
    output: 'anteprojeto_complete',
    requiresWebSearch: false,
  },
];

// Tempo estimado: 2-3 horas de execução automatizada
// Output final: DOCX com ~20-40 páginas
// Estrutura do output:
//   I. Quadro Comparativo dos 3 Proposed Endeavors (tabela 14 linhas)
//   II. Contextualização: Déficit Estrutural nos EUA
//   III. Perfil do Peticionário como Ativo Estratégico
//   IV. Proposed Endeavor 1, 2 e 3 (detalhamento)
//   V. Análise de Risco USCIS por proposta
//   VI. Códigos SOC/BLS recomendados
//   VII. Próximos passos (validação do cliente)
```

---

## Sistema de Heterogeneidade Anti-ATLAS (Cartas Satélite)

O USCIS usa o sistema ATLAS/ATA para detectar boilerplate em cartas de referência. Cartas com mesma fonte, estrutura e linguagem levantam red flags.

O `eb2-niw-letters.skill` contém um catálogo de variações visuais:

```typescript
// src/lib/heterogeneity.ts

// 15 combinações de fonte × cor
const FONT_COMBOS = [
  { font: 'Times New Roman', headerColor: '#1a365d' },
  { font: 'Calibri', headerColor: '#2d3748' },
  { font: 'Garamond', headerColor: '#1a202c' },
  { font: 'Georgia', headerColor: '#2c5282' },
  { font: 'Cambria', headerColor: '#2b6cb0' },
  { font: 'Book Antiqua', headerColor: '#1e3a5f' },
  { font: 'Palatino', headerColor: '#2a4365' },
  { font: 'Century Schoolbook', headerColor: '#234e70' },
  { font: 'Bookman Old Style', headerColor: '#1b3a4b' },
  { font: 'Arial', headerColor: '#2d3748' },
  { font: 'Trebuchet MS', headerColor: '#1a365d' },
  { font: 'Verdana', headerColor: '#2c5282' },
  { font: 'Tahoma', headerColor: '#1e3a5f' },
  { font: 'Lucida Sans', headerColor: '#2a4365' },
  { font: 'Franklin Gothic', headerColor: '#234e70' },
];

// 8 estilos de header
const HEADER_STYLES = ['centered', 'left-aligned', 'right-logo', 'minimal', 'bordered', 'underlined', 'bold-caps', 'italic-serif'];

// 6 formatos de documento
const DOC_FORMATS = ['traditional-letter', 'modern-block', 'semi-block', 'academic-style', 'corporate-memo', 'executive-brief'];

// 3 tipos de carta
const LETTER_TYPES = ['satellite', 'recommendation', 'testimonial'];

/**
 * Seleciona combinação visual ÚNICA para cada carta de um mesmo caso
 * Garante que nenhuma carta do mesmo cliente tenha a mesma combo
 */
export function selectHeterogeneousFormat(
  clientId: string,
  letterIndex: number,
  existingCombos: string[] = []
): LetterFormat {
  // Hash determinístico baseado no clientId + index
  // Garante reprodutibilidade mas variação entre cartas
  const seed = hashCode(`${clientId}-${letterIndex}`);

  let combo: string;
  let attempts = 0;

  do {
    const fontIdx = (seed + attempts) % FONT_COMBOS.length;
    const headerIdx = (seed + attempts * 3) % HEADER_STYLES.length;
    const formatIdx = (seed + attempts * 7) % DOC_FORMATS.length;

    combo = `${fontIdx}-${headerIdx}-${formatIdx}`;
    attempts++;
  } while (existingCombos.includes(combo) && attempts < 100);

  const fontIdx = parseInt(combo.split('-')[0]);
  const headerIdx = parseInt(combo.split('-')[1]);
  const formatIdx = parseInt(combo.split('-')[2]);

  return {
    font: FONT_COMBOS[fontIdx].font,
    headerColor: FONT_COMBOS[fontIdx].headerColor,
    headerStyle: HEADER_STYLES[headerIdx],
    docFormat: DOC_FORMATS[formatIdx],
    comboKey: combo,
  };
}
```

---

## Pastas Montadas no Cowork

Para referência, estas são as pastas que Paulo monta no Cowork e seus conteúdos:

| Pasta Montada | Conteúdo |
|---|---|
| `C.P.` | Pasta de trabalho principal (onde este projeto vive) |
| `_IMIGRAÇÃO` | BP Orquestrador, templates de casos |
| `_PROEX (A COMPLEMENTAR)` | PROMPTs de todos os sistemas: Cover Letter, Résumé, Estratégias, Localização, Casos |
| `_Z GLOBAL` | Z_PROMPTS (Metodologia, Declaração), IMPACTO® agents |
| `AIOS` | Construtor Cover EB-2 NIW v3 |
| `Aqui OBSIDIAN` | Notas do Obsidian, Pareceres da Qualidade |
