import { createServerClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api-helpers';

/**
 * POST /api/errors/[id]/rollback — Deactivate a rule and rollback the commit
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    if (!id) {
      return apiError('Rule ID is required', 400);
    }

    // Fetch the rule first
    const { data: rule, error: fetchError } = await supabase
      .from('error_rules')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !rule) {
      return apiError('Error rule not found', 404);
    }

    if (!rule.active) {
      return apiError('Rule is already inactive', 400);
    }

    // Deactivate the rule
    const { error: updateError } = await supabase
      .from('error_rules')
      .update({ active: false })
      .eq('id', id);

    if (updateError) {
      return apiError(`Failed to deactivate rule: ${updateError.message}`, 500);
    }

    // Commit the deactivated rule to GitHub
    let rollbackSha: string | null = null;
    try {
      const { commitToGitHub } = await import('@/lib/github');
      const filePath = `error-rules/${rule.rule_type}/${rule.id}.json`;
      const content = JSON.stringify({ ...rule, active: false }, null, 2);
      rollbackSha = await commitToGitHub(filePath, content, `rollback(error-rules): deactivate rule ${rule.id}`);
    } catch (gitErr: any) {
      console.error('GitHub rollback failed (rule still deactivated):', gitErr.message);
    }

    return apiSuccess({
      message: `Rule ${id} deactivated and rollback committed`,
      rollback_commit_sha: rollbackSha,
    });
  } catch (err: any) {
    return apiError(`Unexpected error: ${err.message}`, 500);
  }
}
