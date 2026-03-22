import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { setupSymlinks } from '@/lib/file-reader';

export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  const { data: systems } = await supabase.from('system_versions').select('*').eq('is_active', true);
  const results = await setupSymlinks(systems || []);

  return apiSuccess(results);
}
