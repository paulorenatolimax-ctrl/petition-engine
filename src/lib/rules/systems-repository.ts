/**
 * SystemsRepository — Sandeco Cap. 4 Repository pattern aplicado a `data/systems.json`.
 *
 * CHUNK 15 (F4.2) — Auditoria 30/abr identificou que `systems.json` (mapping
 * 22 doc_types → system_path) era lido ad-hoc em 15+ locais, cada um com sua
 * própria leitura/parse/cache. Cascata: quando um pipeline novo precisa do
 * system_path, alguém esquece de cabear → silêncio. Isto é a raiz da
 * regressão "passo 363 → 13" descrita pelo dono.
 *
 * Este Repository é o ÚNICO ponto de leitura. Todos os pipelines/handlers
 * devem chamar `getSystemForDocType(docType)` aqui em vez de fazer JSON.parse
 * direto. Acopla camada de dados (data/systems.json) à camada de domínio
 * (pipelines) através de um único contrato tipado.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

const SYSTEMS_FILE = path.join(process.cwd(), 'data', 'systems.json');

export interface SystemRegistryEntry {
  id: string;
  system_name: string;
  system_path: string;
  version_tag?: string;
  file_count?: number;
  is_active?: boolean;
  recommended_model?: string;
  doc_type: string;
  notes?: string;
  created_at?: string;
}

let _cache: SystemRegistryEntry[] | null = null;
let _cacheMtime = 0;

function loadAll(): SystemRegistryEntry[] {
  if (!existsSync(SYSTEMS_FILE)) return [];
  // Cache invalidate quando mtime muda (dev mode com edits manuais)
  let mtime = 0;
  try { mtime = statSync(SYSTEMS_FILE).mtimeMs; } catch { /* ignore */ }
  if (_cache && mtime === _cacheMtime) return _cache;
  try {
    const raw = JSON.parse(readFileSync(SYSTEMS_FILE, 'utf-8'));
    _cache = (Array.isArray(raw) ? raw : (raw.systems || [])) as SystemRegistryEntry[];
    _cacheMtime = mtime;
    return _cache;
  } catch {
    return [];
  }
}

/**
 * Retorna a entry registrada para o doc_type, ou null se não houver.
 * Considera `is_active`: se explicitamente false, retorna null.
 */
export function getSystemForDocType(docType: string): SystemRegistryEntry | null {
  const all = loadAll();
  const found = all.find(s => s.doc_type === docType);
  if (!found) return null;
  if (found.is_active === false) return null;
  return found;
}

export function listSystems(): SystemRegistryEntry[] {
  return loadAll().filter(s => s.is_active !== false);
}

/** Test/dev hook — invalidar cache manualmente. */
export function _clearSystemsCache() {
  _cache = null;
  _cacheMtime = 0;
}

// ────────────────────────────────────────────────────────────────────────────
// System file digest — leitura controlada do diretório system_path
// ────────────────────────────────────────────────────────────────────────────

export interface SystemFile {
  relativePath: string;
  absolutePath: string;
  size_bytes: number;
}

/**
 * Lista arquivos .md / .json relevantes do system_path, recursivamente até
 * `maxDepth` níveis. Filtra .DS_Store e arquivos > 1MB.
 *
 * Uso: pipelines podem listar arquivos do sistema antes de mandar o
 * sub-claude ler — em vez de só passar uma string interpolada.
 */
export function listSystemFiles(systemPath: string, maxDepth = 3): SystemFile[] {
  if (!systemPath || !existsSync(systemPath)) return [];
  const out: SystemFile[] = [];
  function walk(dir: string, depth: number) {
    if (depth > maxDepth) return;
    let entries: string[] = [];
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      if (name.startsWith('.')) continue;
      const full = path.join(dir, name);
      let st;
      try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) {
        walk(full, depth + 1);
      } else if (st.isFile()) {
        const ext = path.extname(name).toLowerCase();
        if (!['.md', '.json', '.txt', '.yaml', '.yml'].includes(ext)) continue;
        if (st.size > 1024 * 1024) continue; // skip > 1MB
        out.push({
          relativePath: path.relative(systemPath, full),
          absolutePath: full,
          size_bytes: st.size,
        });
      }
    }
  }
  walk(systemPath, 0);
  return out.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

/**
 * Constrói uma string-digest do system_path para INJETAR em prompts.
 * Lista arquivos relevantes + primeiros N chars de cada (controle de tamanho).
 * O sub-claude vê o esqueleto do sistema sem precisar fazer ls/cat.
 */
export function buildSystemDigest(systemPath: string, options: { maxBytesPerFile?: number; maxTotalBytes?: number } = {}): string {
  const { maxBytesPerFile = 4000, maxTotalBytes = 30000 } = options;
  const files = listSystemFiles(systemPath);
  if (files.length === 0) return `(system_path "${systemPath}" não tem arquivos legíveis)`;

  const lines: string[] = [];
  lines.push(`# DIGEST DO SISTEMA — ${systemPath}`);
  lines.push(`Total de arquivos: ${files.length}\n`);

  let totalSent = 0;
  for (const f of files) {
    if (totalSent >= maxTotalBytes) {
      lines.push(`\n[... ${files.length - files.indexOf(f)} arquivo(s) omitido(s) por limite de tamanho]`);
      break;
    }
    let content = '';
    try { content = readFileSync(f.absolutePath, 'utf-8'); } catch { continue; }
    const preview = content.slice(0, maxBytesPerFile);
    lines.push(`## ${f.relativePath} (${f.size_bytes} bytes)`);
    lines.push(preview);
    if (content.length > preview.length) lines.push(`[... +${content.length - preview.length} chars truncados]`);
    lines.push('');
    totalSent += preview.length;
  }
  return lines.join('\n');
}
