/**
 * Detects feedback patterns in Paulo's messages that may indicate
 * system updates, error rules, or preferences.
 */

const SYSTEM_UPDATE_PATTERNS = [
  /(?:o tom|a linguagem|o estilo|a abordagem)\s+(?:tá|está|ficou)\s+(?:muito|bem|pouco)/i,
  /(?:quero|prefiro)\s+(?:mais|menos)\s+(?:assertivo|acadêmico|formal|direto|técnico)/i,
  /(?:sempre|nunca)\s+(?:inclua|coloque|mencione|cite|use)/i,
  /(?:na seção|no critério|na parte)\s+(?:de|do|da)\s+/i,
  /(?:incorpora|integra|atualiza)\s+(?:isso|essa mudança|esse ajuste)\s+(?:no sistema|no prompt)/i,
  /(?:a partir de agora|daqui pra frente|sempre que gerar)/i,
  /(?:toda vez que|sempre que)\s+(?:eu|gerar|criar|fazer)/i,
  /(?:esse padrão|essa lógica|essa estrutura)\s+(?:é|tá)\s+(?:boa|certa|perfeita)/i,
];

export interface DetectedFeedback {
  type: 'system_update' | 'error_rule' | 'preference' | 'one_time';
  confidence: number;
  affected_system?: string;
  affected_section?: string;
  change_description: string;
  original_quote: string;
}

export function detectFeedback(
  message: string,
  currentContext: {
    doc_type?: string;
    document_id?: string;
    system_name?: string;
  },
): DetectedFeedback | null {
  const matchedPatterns = SYSTEM_UPDATE_PATTERNS.filter((p) => p.test(message));

  if (matchedPatterns.length === 0) return null;

  const confidence = Math.min(matchedPatterns.length / 3, 1);

  if (confidence < 0.3) return null;

  const isPermanent =
    /sempre|nunca|a partir de agora|daqui pra frente|toda vez/i.test(message);
  const isError = /erro|bug|errado|incorreto|não deveria/i.test(message);

  let type: DetectedFeedback['type'];
  if (isError) type = 'error_rule';
  else if (isPermanent) type = 'system_update';
  else type = 'one_time';

  return {
    type,
    confidence,
    affected_system: currentContext.system_name,
    change_description: message.substring(0, 200),
    original_quote: message,
  };
}
