/**
 * Centralized path configuration for the Petition Engine.
 *
 * All external paths that the system references are defined here.
 * Uses environment variables (.env.local) with hardcoded fallbacks.
 *
 * To override any path, create a .env.local file at the project root:
 *   PE_SOC_PATH=/custom/path/to/SEPARATION_OF_CONCERNS.md
 *   PE_CP_DIR=/custom/path/to/C.P.
 *   etc.
 */

const env = (key: string, fallback: string): string =>
  process.env[key] || fallback;

// ═══════════════════════════════════════════════════════════════
// CORE SYSTEM PATHS
// ═══════════════════════════════════════════════════════════════

/** Separation of Concerns protocol */
export const SOC_PATH = env(
  'PE_SOC_PATH',
  '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md'
);

/** Claude Projects / C.P. directory */
export const CP_DIR = env(
  'PE_CP_DIR',
  '/Users/paulo1844/Documents/Claude/Projects/C.P.'
);

/** Quality review notes (Pareceres da Qualidade) */
export const QUALITY_PATH = env(
  'PE_QUALITY_PATH',
  '/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md'
);

// ═══════════════════════════════════════════════════════════════
// DOCUMENT SYSTEM PATHS
// ═══════════════════════════════════════════════════════════════

/** Cover Letter EB-1A system (v5) */
export const EB1A_SYSTEM_PATH = env(
  'PE_EB1A_SYSTEM_PATH',
  '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5'
);

/** Cover Letter EB-2 NIW system (V3 Project Instructions) */
export const EB2_NIW_SYSTEM_PATH = env(
  'PE_EB2_NIW_SYSTEM_PATH',
  '/Users/paulo1844/Documents/AIOS_Petition Engine/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions'
);

/** Insert thumbnails script */
export const INSERT_THUMBNAILS_PATH = env(
  'PE_INSERT_THUMBNAILS_PATH',
  '/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/insert_thumbnails.py'
);

// ═══════════════════════════════════════════════════════════════
// RAGs (Research & Argumentation)
// ═══════════════════════════════════════════════════════════════

/** RAGs for EB-1A cases */
export const RAGS_EB1 = env(
  'PE_RAGS_EB1',
  '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-1/'
);

/** RAGs for EB-2 NIW cases */
export const RAGS_EB2 = env(
  'PE_RAGS_EB2',
  '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs/'
);

// ═══════════════════════════════════════════════════════════════
// BENCHMARKS
// ═══════════════════════════════════════════════════════════════

/** Benchmark: Thayse (EB-2 NIW anteprojeto) */
export const BENCHMARK_THAYSE = env(
  'PE_BENCHMARK_THAYSE',
  '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/LILIAN/Thayse/'
);

/** Benchmark: Thiago (EB-1A anteprojeto) */
export const BENCHMARK_THIAGO = env(
  'PE_BENCHMARK_THIAGO',
  '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Thiago Fernandes dos Santos (EB-1)/'
);

// ═══════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════

/** Default cases directory (fallback when client has no docs_folder_path) */
export const DEFAULT_CASES_DIR = env(
  'PE_DEFAULT_CASES_DIR',
  '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/'
);

/** Claude binary search paths */
export const CLAUDE_BIN_CANDIDATES = [
  '/Users/paulo1844/.npm-global/bin/claude',
  `${process.env.HOME}/.npm-global/bin/claude`,
  '/usr/local/bin/claude',
  '/opt/homebrew/bin/claude',
  `${process.env.HOME}/.claude/bin/claude`,
];
