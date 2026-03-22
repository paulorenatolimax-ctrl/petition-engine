import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Applies auto_fix rules to generated text before DOCX creation
 */
export async function applyAutoFixes(
  text: string,
  docType: string,
  supabase: SupabaseClient,
): Promise<string> {
  const { data: rules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true)
    .eq('rule_action', 'auto_fix')
    .or(`doc_type.is.null,doc_type.eq.${docType}`);

  let fixed = text;
  const appliedFixes: string[] = [];

  for (const rule of rules || []) {
    if (rule.rule_pattern && rule.auto_fix_replacement) {
      const regex = new RegExp(rule.rule_pattern, 'gi');
      const before = fixed;
      fixed = fixed.replace(regex, rule.auto_fix_replacement);

      if (fixed !== before) {
        appliedFixes.push(rule.rule_description);
        await supabase.rpc('increment_rule_trigger', { rule_id: rule.id });
      }
    }
  }

  if (appliedFixes.length > 0) {
    console.log(
      `[AutoFixer] ${appliedFixes.length} fixes aplicados:`,
      appliedFixes,
    );
  }

  return fixed;
}
