import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { checkSymlink, countFiles } from '@/lib/file-reader';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  const { data, error } = await supabase.from('system_versions').select('*').order('system_name');
  if (error) return apiError(error.message);

  const systemsWithStatus = await Promise.all(
    (data || []).map(async (sys) => ({
      ...sys,
      symlink_ok: await checkSymlink(sys.system_path),
      file_count_actual: await countFiles(sys.system_path),
    }))
  );

  return apiSuccess(systemsWithStatus);
}
