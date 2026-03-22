import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

// POST /api/systems/scan — Scan a system directory and register/update
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { system_name, system_path } = body;

    if (!system_name || !system_path) {
      return apiError('system_name e system_path são obrigatórios', 422);
    }

    // Dynamic import to avoid bundling Node.js fs in client
    const { scanSystemDirectory } = await import('@/lib/file-reader');
    const scan = await scanSystemDirectory(system_path);

    if (!scan.exists) {
      return apiError(`Diretório não encontrado: ${system_path}`, 404);
    }

    // Upsert into system_versions
    const { data, error } = await supabase
      .from('system_versions')
      .upsert(
        {
          system_name,
          system_path,
          version_tag: scan.detected_version || 'unknown',
          file_count: scan.file_count,
          is_active: true,
        },
        { onConflict: 'system_name' },
      )
      .select()
      .single();

    if (error) {
      return apiError(error.message, 400);
    }

    return apiSuccess({ system: data, scan });
  } catch (err: any) {
    return apiError(`Falha ao escanear sistema: ${err.message}`);
  }
}
