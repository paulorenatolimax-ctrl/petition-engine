import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  let query = supabase.from('documents').select('*, clients(name, visa_type)');

  const client_id = searchParams.get('client_id');
  if (client_id) query = query.eq('client_id', client_id);

  const doc_type = searchParams.get('doc_type');
  if (doc_type) query = query.eq('doc_type', doc_type);

  const { data, error } = await query.order('generated_at', { ascending: false }).limit(100);
  if (error) return apiError(error.message);
  return apiSuccess(data);
}
