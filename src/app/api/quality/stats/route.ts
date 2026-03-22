import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  const { data: docs } = await supabase.from('documents').select('doc_type, quality_passed, quality_score');

  const stats = {
    total_documents: docs?.length || 0,
    passed: docs?.filter(d => d.quality_passed === true).length || 0,
    failed: docs?.filter(d => d.quality_passed === false).length || 0,
    pending: docs?.filter(d => d.quality_passed === null).length || 0,
  };

  return apiSuccess(stats);
}
