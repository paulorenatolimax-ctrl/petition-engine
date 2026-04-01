import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { readSystemFiles } from '@/lib/file-reader';

const ANTEPROJETO_STAGES = [
  { id: 1, name: 'Analise do Perfil', instruction: 'Analise o perfil completo do beneficiario e identifique os pontos fortes e fracos para uma peticao EB-2 NIW.' },
  { id: 2, name: 'Proposed Endeavor', instruction: 'Defina o proposed endeavor com base no perfil. Deve ser specific, measurable, e demonstrar substantial merit e national importance.' },
  { id: 3, name: 'Prong 1 — Merit & Importance', instruction: 'Construa o argumento completo do Prong 1 de Dhanasar: substantial merit e national importance do proposed endeavor.' },
  { id: 4, name: 'Prong 2 — Well Positioned', instruction: 'Construa o argumento do Prong 2: o beneficiario esta well positioned para avancar o endeavor. Use evidencias concretas.' },
  { id: 5, name: 'Prong 3 — Balance of Factors', instruction: 'Construa o argumento do Prong 3: no balance, seria benefico waiver o requisito de labor certification.' },
  { id: 6, name: 'Mapeamento de Evidencias', instruction: 'Mapeie cada evidencia/exhibit disponivel para os prongs que ela suporta. Identifique gaps.' },
  { id: 7, name: 'Cartas Satelite Necessarias', instruction: 'Liste as cartas satelite necessarias com tipo (investor_pj, current_client_pf, etc.), nome sugerido do signatory, e argumentos que cada carta deve reforcar.' },
  { id: 8, name: 'Estrutura da Cover Letter', instruction: 'Proponha a estrutura completa da cover letter com secoes, subsecoes, e bullet points de conteudo para cada uma.' },
  { id: 9, name: 'Resumo Executivo', instruction: 'Gere um resumo executivo de 1-2 paginas que sintetize toda a estrategia para revisao final.' },
];

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const { client_id, stage } = body;
  if (!client_id || !stage) return apiError('client_id e stage sao obrigatorios', 400);

  const stageConfig = ANTEPROJETO_STAGES.find(s => s.id === stage);
  if (!stageConfig) return apiError(`Stage ${stage} nao existe. Range: 1-9`, 400);

  try {
    // Buscar dados
    const { data: client } = await supabase
      .from('clients')
      .select('*, client_profiles(*)')
      .eq('id', client_id)
      .single();

    if (!client) return apiError('Cliente nao encontrado', 404);

    // Ler sistema
    let systemContent = '';
    try {
      const result = await readSystemFiles('estrategia-eb2');
      systemContent = result.content;
    } catch {
      systemContent = '[Sistema estrategia-eb2 nao disponivel via symlink]';
    }

    // Buscar error rules
    const { data: rules } = await supabase
      .from('error_rules')
      .select('*')
      .eq('active', true)
      .or('doc_type.is.null,doc_type.eq.anteprojeto,doc_type.eq.strategy_eb2');

    const rulesText = (rules || []).map(r => `[${r.severity.toUpperCase()}] ${r.rule_description}`).join('\n');

    const profileContext = client.client_profiles
      ? JSON.stringify(client.client_profiles, null, 2)
      : '[Perfil nao extraido — gere com informacoes disponiveis]';

    const prompt = `# ANTEPROJETO EB-2 NIW — Stage ${stageConfig.id}/9: ${stageConfig.name}

## INSTRUCAO
${stageConfig.instruction}

## CONTEXTO DO SISTEMA
${systemContent.substring(0, 50000)}

## DADOS DO CLIENTE
Nome: ${client.name}
Visto: ${client.visa_type}
Endeavor: ${client.proposed_endeavor || 'A definir neste stage'}
Empresa: ${client.company_name || 'N/A'}
SOC: ${client.soc_code || '?'} — ${client.soc_title || '?'}
Localizacao: ${client.location_city || '?'}, ${client.location_state || '?'}

## PERFIL EXTRAIDO
${profileContext}

## REGRAS DE ERRO (OBEDECA TODAS)
${rulesText || 'Nenhuma regra adicional.'}

## FORMATO DE SAIDA
Gere o conteudo completo deste stage. Se necessario, use markdown para estruturar.
Ao final, adicione uma secao "## Proximo passo" indicando o que o Stage ${stageConfig.id + 1} fara.`;

    return apiSuccess({
      prompt,
      metadata: {
        stage: stageConfig.id,
        stage_name: stageConfig.name,
        total_stages: 9,
        estimated_tokens: Math.round(prompt.length / 4),
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return apiError(err.message);
  }
}
