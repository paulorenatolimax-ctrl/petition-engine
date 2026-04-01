import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import fs from 'fs/promises';
import path from 'path';

// GET /api/systems/[name]/versions — List versions of a system
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const { name } = params;
    const metaPath = path.join(process.cwd(), 'systems', name, 'meta.json');

    let meta: {
      current_version?: string;
      versions?: Array<{
        version: string;
        date: string;
        changelog?: string;
      }>;
    };

    try {
      const raw = await fs.readFile(metaPath, 'utf-8');
      meta = JSON.parse(raw);
    } catch {
      return apiError(
        `meta.json não encontrado para o sistema: ${name}. Verifique se o symlink existe em systems/${name}/`,
        404,
      );
    }

    const versions = meta.versions || [];

    return apiSuccess({
      system_name: name,
      current_version: meta.current_version || null,
      versions,
      total_versions: versions.length,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return apiError(`Falha ao listar versões: ${err.message}`);
  }
}
