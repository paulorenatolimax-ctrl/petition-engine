import { SupabaseClient } from '@supabase/supabase-js';
import { getSystemForDocType } from '@/lib/system-map';

interface AssembleParams {
  client: any;
  profile: any;
  docType: string;
  docSubtype?: string;
}

/**
 * Orchestrator — assembles the complete prompt for document generation.
 * Does NOT call any LLM API. Returns the prompt for Claude Code.
 */
export class Orchestrator {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Assembles all context (system instructions, profile, error rules, preferences)
   * into a single prompt ready for Claude Code.
   */
  async assemblePrompt(params: AssembleParams) {
    const systemConfig = getSystemForDocType(params.docType);

    // 1. Fetch active error rules
    const { data: errorRules } = await this.supabase
      .from('error_rules')
      .select('*')
      .eq('active', true)
      .or(`doc_type.is.null,doc_type.eq.${params.docType}`);

    // 2. Calculate next version
    let nextVersion = 1;
    try {
      const { data } = await this.supabase.rpc('next_doc_version', {
        p_client_id: params.client.id,
        p_doc_type: params.docType,
      });
      if (data) nextVersion = data;
    } catch {
      // function may not exist yet
    }

    // 3. Use runWriter to assemble the prompt (reads system files internally)
    const { runWriter } = await import('@/agents/writer');
    const { prompt, metadata } = await runWriter({
      clientId: params.client.id,
      clientName: params.client.name,
      visaType: params.client.visa_type,
      docType: params.docType,
      systemName: systemConfig.name,
      proposedEndeavor: params.client.proposed_endeavor || undefined,
    });

    return {
      prompt,
      metadata: {
        ...metadata,
        system_name: systemConfig.name,
        system_dir: systemConfig.symlinkDir,
        next_version: nextVersion,
        error_rules_count: (errorRules || []).length,
        estimated_tokens: systemConfig.estimatedTokens,
        requires_deep_research: systemConfig.requiresDeepResearch,
        heterogeneity: systemConfig.heterogeneity || false,
        sequential_prompts: systemConfig.sequentialPrompts,
      },
    };
  }
}
