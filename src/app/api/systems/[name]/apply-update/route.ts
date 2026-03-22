import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

// POST /api/systems/[name]/apply-update — Apply a confirmed system update
export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const supabase = createServerClient();
    const { name } = params;
    const body = await request.json();

    const { proposal } = body;

    if (!proposal) {
      return apiError('proposal é obrigatório', 422);
    }

    // Verify system exists
    const { data: system, error: sysError } = await supabase
      .from('system_versions')
      .select('*')
      .eq('system_name', name)
      .single();

    if (sysError || !system) {
      return apiError(`Sistema não encontrado: ${name}`, 404);
    }

    // Dynamic import to avoid bundling agent in client
    const { SystemUpdater } = await import('@/agents/system-updater');
    const updater = new SystemUpdater(supabase);

    const result = await updater.applyUpdate({
      ...proposal,
      systemName: name,
    });

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(`Falha ao aplicar atualização: ${err.message}`);
  }
}
