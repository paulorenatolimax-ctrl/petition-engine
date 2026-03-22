import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('generation_queue')
      .select(`
        *,
        clients(name, visa_type),
        documents(*)
      `)
      .order('queued_at', { ascending: false })
      .limit(50);

    // Optional status filter
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return apiError(`Erro ao buscar fila: ${error.message}`, 500);
    }

    return apiSuccess(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro interno do servidor';
    return apiError(message, 500);
  }
}
