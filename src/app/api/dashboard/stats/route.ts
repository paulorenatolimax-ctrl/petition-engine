import { createServerClient } from '@/lib/supabase';
import { apiSuccess } from '@/lib/api-helpers';

export async function GET() {
  const supabase = createServerClient();

  const [clientsRes, docsRes, errorsRes] = await Promise.all([
    supabase.from('clients').select('status', { count: 'exact' }),
    supabase.from('documents').select('status, doc_type, quality_passed'),
    supabase.from('error_rules').select('severity, times_triggered', { count: 'exact' }).eq('active', true),
  ]);

  return apiSuccess({
    clients: {
      total: clientsRes.count || 0,
      active: clientsRes.data?.filter(c => c.status === 'active').length || 0,
    },
    documents: {
      total: docsRes.data?.length || 0,
      passed: docsRes.data?.filter(d => d.quality_passed === true).length || 0,
      failed: docsRes.data?.filter(d => d.quality_passed === false).length || 0,
      quality_pass_rate: docsRes.data && docsRes.data.length > 0
        ? Math.round((docsRes.data.filter(d => d.quality_passed).length / docsRes.data.length) * 100)
        : 0,
    },
    errors: {
      active_rules: errorsRes.count || 0,
      total_triggers: errorsRes.data?.reduce((sum, r) => sum + r.times_triggered, 0) || 0,
      critical: errorsRes.data?.filter(r => r.severity === 'critical').length || 0,
    },
  });
}
