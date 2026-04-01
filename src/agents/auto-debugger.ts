import { createServerClient } from '@/lib/supabase';

interface ErrorReport {
  errorDescription: string;
  docType?: string;
  documentId?: string;
}

interface ClassifiedRule {
  rule_type: string;
  severity: string;
  rule_description: string;
  rule_pattern: string | null;
  rule_action: string;
}

function classifyError(description: string): ClassifiedRule {
  const desc = description.toLowerCase();

  let rule_type = 'content';
  if (desc.includes('formatação') || desc.includes('formatting') || desc.includes('espaço') || desc.includes('margem')) {
    rule_type = 'formatting';
  } else if (desc.includes('proibido') || desc.includes('forbidden') || desc.includes('nunca usar') || desc.includes('não pode')) {
    rule_type = 'forbidden_term';
  } else if (desc.includes('lógica') || desc.includes('logic') || desc.includes('inconsistente') || desc.includes('contradição')) {
    rule_type = 'logic';
  } else if (desc.includes('legal') || desc.includes('uscis') || desc.includes('lei') || desc.includes('regulamento')) {
    rule_type = 'legal';
  } else if (desc.includes('termo') || desc.includes('terminology') || desc.includes('palavra')) {
    rule_type = 'terminology';
  }

  let severity = 'medium';
  if (desc.includes('crítico') || desc.includes('critical') || desc.includes('grave') || desc.includes('nunca')) {
    severity = 'critical';
  } else if (desc.includes('alto') || desc.includes('high') || desc.includes('importante')) {
    severity = 'high';
  } else if (desc.includes('baixo') || desc.includes('low') || desc.includes('menor')) {
    severity = 'low';
  }

  let rule_pattern: string | null = null;
  const quotedMatch = description.match(/"([^"]+)"/);
  if (quotedMatch) {
    rule_pattern = quotedMatch[1];
  }

  return {
    rule_type,
    severity,
    rule_description: description,
    rule_pattern,
    rule_action: severity === 'critical' ? 'block' : 'warn',
  };
}

export async function reportError(report: ErrorReport) {
  const supabase = createServerClient();

  const classified = classifyError(report.errorDescription);

  // Check for existing similar rule
  const { data: existing } = await supabase
    .from('error_rules')
    .select('id, rule_description, times_triggered')
    .ilike('rule_description', `%${report.errorDescription.substring(0, 50)}%`)
    .limit(1);

  if (existing && existing.length > 0) {
    await supabase.from('error_rules')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ times_triggered: ((existing[0] as any).times_triggered || 0) + 1 })
      .eq('id', existing[0].id);

    return {
      action: 'existing_rule_updated',
      rule_id: existing[0].id,
      message: `Regra similar já existe: "${existing[0].rule_description}". Incrementado trigger count.`,
    };
  }

  const { data: newRule, error } = await supabase
    .from('error_rules')
    .insert({
      ...classified,
      doc_type: report.docType || null,
      source: 'paulo_feedback',
      active: true,
      times_triggered: 1,
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar regra: ${error.message}`);

  if (report.documentId) {
    await supabase.from('activity_log').insert({
      document_id: report.documentId,
      action: 'error_reported',
      details: { rule_id: newRule?.id, classified },
    });
  }

  return {
    action: 'new_rule_created',
    rule_id: newRule?.id,
    rule: classified,
    message: `Nova regra criada: [${classified.severity}/${classified.rule_type}] ${classified.rule_description}`,
  };
}
