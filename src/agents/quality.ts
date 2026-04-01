import { createServerClient } from '@/lib/supabase';

interface QualityInput {
  documentText: string;
  docType: string;
  clientName: string;
  visaType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileJson?: any;
}

interface QualityResult {
  score: number;
  passed: boolean;
  violations: { rule: string; severity: string; match: string; location: string }[];
  warnings: string[];
  notes: string;
}

export async function runQuality(input: QualityInput): Promise<QualityResult> {
  const supabase = createServerClient();
  const violations: QualityResult['violations'] = [];
  const warnings: string[] = [];

  const { data: rules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true);

  const applicableRules = (rules || []).filter(r =>
    !r.doc_type || r.doc_type === input.docType
  );

  for (const rule of applicableRules) {
    if (rule.rule_pattern) {
      try {
        const regex = new RegExp(rule.rule_pattern, 'gi');
        const matches = input.documentText.match(regex);
        if (matches) {
          for (const match of matches) {
            violations.push({
              rule: rule.rule_description,
              severity: rule.severity,
              match: match.substring(0, 100),
              location: `Pattern: ${rule.rule_pattern}`,
            });
          }
          try {
            await supabase.rpc('increment_rule_trigger', { rule_id: rule.id });
          } catch {
            await supabase.from('error_rules')
              .update({ times_triggered: (rule.times_triggered || 0) + 1 })
              .eq('id', rule.id);
          }
        }
      } catch {
        // invalid regex
      }
    }
  }

  if (input.profileJson?.full_name && !input.documentText.includes(input.profileJson.full_name)) {
    warnings.push(`Nome "${input.profileJson.full_name}" não encontrado no documento`);
  }

  if (input.clientName && !input.documentText.toLowerCase().includes(input.clientName.toLowerCase().split(' ')[0])) {
    warnings.push(`Primeiro nome do cliente "${input.clientName.split(' ')[0]}" não encontrado no documento`);
  }

  if (input.documentText.length < 2000) {
    violations.push({
      rule: 'Documento muito curto (< 2000 caracteres)',
      severity: 'high',
      match: `${input.documentText.length} chars`,
      location: 'Documento inteiro',
    });
  }

  const criticalCount = violations.filter(v => v.severity === 'critical').length;
  const highCount = violations.filter(v => v.severity === 'high').length;
  const mediumCount = violations.filter(v => v.severity === 'medium').length;
  const lowCount = violations.filter(v => v.severity === 'low').length;

  const penalty = (criticalCount * 25) + (highCount * 15) + (mediumCount * 5) + (lowCount * 2) + (warnings.length * 1);
  const score = Math.max(0, 100 - penalty);
  const passed = score >= 80 && criticalCount === 0;

  const notes = passed
    ? `Aprovado com score ${score}. ${violations.length} violações menores.`
    : `Reprovado (score ${score}). ${criticalCount} críticas, ${highCount} altas. Revisar antes de entregar.`;

  return { score, passed, violations, warnings, notes };
}
