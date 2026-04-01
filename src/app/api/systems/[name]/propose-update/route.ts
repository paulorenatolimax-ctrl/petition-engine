import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

// POST /api/systems/[name]/propose-update — Propose a system update
export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const supabase = createServerClient();
    const { name } = params;
    const body = await request.json();

    const { change_description, original_quote, current_doc_type } = body;

    if (!change_description) {
      return apiError('change_description é obrigatório', 422);
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

    const prompt = await updater.assembleProposalPrompt({
      systemName: name,
      changeDescription: change_description,
      originalQuote: original_quote,
      currentDocType: current_doc_type,
    });

    return apiSuccess({
      prompt,
      instructions: 'Use o prompt acima no Claude Code para gerar a proposta de atualização. Depois, envie o JSON resultante via POST /api/systems/[name]/apply-update com { proposal: {...} }',
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return apiError(`Falha ao propor atualização: ${err.message}`);
  }
}
