// src/agents/writer.ts
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface WriterInput {
  clientId: string;
  clientName: string;
  visaType: string;
  docType: string;
  systemName: string;
  systemPath?: string;
  profileJson?: any;
  proposedEndeavor?: string;
  previousDenied?: boolean;
  denialReasons?: string;
}

export async function runWriter(input: WriterInput): Promise<{
  prompt: string;
  metadata: {
    systemName: string;
    systemVersion: string;
    filesRead: number;
    rulesApplied: number;
    estimatedTokens: number;
  };
}> {
  // 1. Buscar system_version do Supabase (tentar por nome exato, depois ilike)
  let system: any = null;
  const { data: exactMatch } = await supabase
    .from('system_versions')
    .select('*')
    .eq('system_name', input.systemName)
    .eq('is_active', true)
    .single();

  if (exactMatch) {
    system = exactMatch;
  } else {
    // Fallback: buscar por ilike (ignora acentos/case)
    const { data: fuzzyMatch } = await supabase
      .from('system_versions')
      .select('*')
      .ilike('system_name', `%${input.systemName.replace(/[^a-zA-Z0-9 ]/g, '%')}%`)
      .eq('is_active', true)
      .limit(1);
    if (fuzzyMatch && fuzzyMatch.length > 0) system = fuzzyMatch[0];
  }

  // Se ainda não encontrou, usar o systemPath do input (fallback direto do SYSTEM_MAP)
  const systemPath = system?.system_path || input.systemPath;
  const systemVersion = system?.version_tag || 'unknown';

  if (!systemPath) {
    throw new Error(`Sistema ${input.systemName} não encontrado e sem system_path de fallback`);
  }

  // 2. Ler todos os arquivos .md do sistema
  let systemFiles: { name: string; content: string }[] = [];

  if (existsSync(systemPath)) {
    const files = readdirSync(systemPath).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    systemFiles = files.map(f => ({
      name: f,
      content: readFileSync(join(systemPath, f), 'utf-8'),
    }));
  }

  // 3. Buscar error_rules aplicáveis
  const { data: rules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true)
    .or(`doc_type.is.null,doc_type.eq.${input.docType}`);

  // 4. Buscar perfil do cliente (se existe)
  let profileSection = '';
  if (input.profileJson) {
    profileSection = `\n## PERFIL DO BENEFICIÁRIO (extraído dos documentos)\n\`\`\`json\n${JSON.stringify(input.profileJson, null, 2)}\n\`\`\`\n`;
  } else {
    const { data: profile } = await supabase
      .from('client_profiles')
      .select('profile_data')
      .eq('client_id', input.clientId)
      .single();

    if (profile?.profile_data) {
      profileSection = `\n## PERFIL DO BENEFICIÁRIO (extraído dos documentos)\n\`\`\`json\n${JSON.stringify(profile.profile_data, null, 2)}\n\`\`\`\n`;
    }
  }

  // 5. Montar seção de regras de erro
  const rulesSection = (rules || []).map(r =>
    `- [${r.severity}/${r.rule_action}] ${r.rule_description}${r.rule_pattern ? ` (padrão: ${r.rule_pattern})` : ''}`
  ).join('\n');

  // 6. Montar seção dos arquivos do sistema
  const systemSection = systemFiles.map(f =>
    `### ${f.name}\n${f.content}`
  ).join('\n\n---\n\n');

  // 7. Contexto de negativa anterior
  const denialContext = input.previousDenied
    ? `\n## ⚠️ ATENÇÃO: PETIÇÃO ANTERIOR NEGADA\nMotivos da negativa: ${input.denialReasons || 'Não especificados'}\nEste é um REFILE. O documento DEVE endereçar explicitamente cada motivo de negativa.\nNunca contradizer o que foi dito na petição original — apenas fortalecer e complementar.\n`
    : '';

  // 8. Montar o prompt final
  const prompt = `# GERAÇÃO DE DOCUMENTO: ${input.docType}
## Cliente: ${input.clientName} | Visto: ${input.visaType}
## Sistema: ${input.systemName} v${systemVersion}

${denialContext}
${profileSection}

## REGRAS DE ERRO (${(rules || []).length} regras ativas — RESPEITAR TODAS)
${rulesSection}

## ARQUIVOS DO SISTEMA DE GERAÇÃO
Os arquivos abaixo contêm as instruções completas para gerar este tipo de documento.
Siga TODAS as instruções presentes nestes arquivos.

${systemSection}

## INSTRUÇÃO FINAL
Gere o documento completo seguindo as instruções dos arquivos do sistema acima.
Use os dados do perfil do beneficiário — NÃO invente dados.
Respeite TODAS as regras de erro listadas.
${input.previousDenied ? 'CRÍTICO: Endereçe cada motivo de negativa anterior.' : ''}
`;

  const estimatedTokens = Math.round(prompt.length / 4);

  return {
    prompt,
    metadata: {
      systemName: input.systemName,
      systemVersion: systemVersion,
      filesRead: systemFiles.length,
      rulesApplied: (rules || []).length,
      estimatedTokens,
    },
  };
}
