import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*, client_profiles(*), documents(*), activity_log(*)')
    .eq('id', params.id)
    .single();

  if (error) return apiError('Cliente não encontrado', 404);
  return apiSuccess(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase.from('clients').update(body).eq('id', params.id).select().single();
  if (error) return apiError(error.message);
  return apiSuccess(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  await supabase.from('activity_log').delete().eq('client_id', params.id);
  await supabase.from('documents').delete().eq('client_id', params.id);
  await supabase.from('client_profiles').delete().eq('client_id', params.id);
  const { error } = await supabase.from('clients').delete().eq('id', params.id);
  if (error) return apiError(error.message);
  return apiSuccess({ deleted: params.id });
}
