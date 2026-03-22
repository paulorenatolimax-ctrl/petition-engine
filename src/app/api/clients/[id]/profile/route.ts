import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('client_profiles').select('*').eq('client_id', params.id).single();
  if (error) return apiError('Perfil não encontrado', 404);
  return apiSuccess(data);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('client_profiles')
    .upsert({ client_id: params.id, ...body, extracted_at: new Date().toISOString() }, { onConflict: 'client_id' })
    .select()
    .single();

  if (error) return apiError(error.message);

  await supabase.from('activity_log').insert({
    client_id: params.id,
    action: 'profile_extracted',
    details: { fields_count: Object.keys(body).length },
  });

  return apiSuccess(data, 201);
}
