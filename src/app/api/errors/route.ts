import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  let query = supabase.from('error_rules').select('*');

  const active = searchParams.get('active');
  if (active !== null) query = query.eq('active', active === 'true');

  const rule_type = searchParams.get('rule_type');
  if (rule_type) query = query.eq('rule_type', rule_type);

  const severity = searchParams.get('severity');
  if (severity) query = query.eq('severity', severity);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return apiError(error.message);
  return apiSuccess(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase.from('error_rules').insert({ ...body, source: 'manual' }).select().single();
  if (error) return apiError(error.message);

  return apiSuccess(data, 201);
}
