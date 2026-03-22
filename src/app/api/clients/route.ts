import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { createClientSchema } from '@/lib/schemas';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get('status');
  const visa_type = searchParams.get('visa_type');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = supabase.from('clients').select('*, client_profiles(*)', { count: 'exact' });

  if (status) query = query.eq('status', status);
  if (visa_type) query = query.eq('visa_type', visa_type);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);

  const { data, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  if (error) return apiError(error.message);
  return NextResponse.json({ data: data || [], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) });
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const parsed = createClientSchema.safeParse(body);
  if (!parsed.success) return apiError(JSON.stringify(parsed.error.flatten()), 400);

  // Strip fields that may not exist in the Supabase clients table yet
  const { case_number, previous_petition_denied, denial_reasons, priority, ...clientData } = parsed.data;
  const { data, error } = await supabase.from('clients').insert(clientData).select().single();
  if (error) return apiError(error.message);

  await supabase.from('client_profiles').insert({ client_id: data.id });

  await supabase.from('activity_log').insert({
    client_id: data.id,
    action: 'client_created',
    details: { visa_type: data.visa_type },
  });

  return apiSuccess(data, 201);
}
