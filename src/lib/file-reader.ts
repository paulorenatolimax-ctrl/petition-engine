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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      results.push({ name: sys.system_name, status: 'error', message: err.message });
    }
  }

  return results;
}
