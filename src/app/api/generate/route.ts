import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
import { SYSTEM_MAP } from '@/lib/system-map';

const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');
const SYSTEMS_FILE = path.join(process.cwd(), 'data', 'systems.json');
const RULES_FILE = path.join(process.cwd(), 'data', 'error_rules.json');
const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts');
const SOC_PATH = '/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md';
const CP_DIR = '/Users/paulo1844/Documents/Claude/Projects/C.P.';
const PPTX_GENERATOR = path.join(process.cwd(), 'scripts', 'generate_pptx_v2.py');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readRules(): any[] {
  try { return JSON.parse(readFileSync(RULES_FILE, 'utf-8')); }
  catch { return []; }
}

function buildRulesSection(docType: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rules = readRules().filter((r: any) => r.active);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = rules.filter((r: any) => !r.doc_type);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specific = rules.filter((r: any) => r.doc_type === docType);
  const all = [...global, ...specific];

  const lines = [
    '',
    '## PROTOCOLO ANTI-ALUCINACAO (OBRIGATORIO — EXECUTAR ANTES DE ESCREVER)',
    '',
    '### Passo 0: INVENTARIO DE EVIDENCIAS',
    'ANTES de escrever qualquer linha do documento:',
    '1. Faca ls -la RECURSIVO na pasta de documentos do cliente',
    '2. Liste CADA arquivo de evidencia com: nome, tipo (diploma, certificado, artigo, premio, etc.), tamanho',
    '3. Para CADA evidence block que voce pretende criar, mapeie o arquivo EXATO que sera referenciado',
    '4. Se um arquivo nao existe na pasta, NAO crie evidence block para ele',
    '5. NUNCA use a mesma evidencia em 2 lugares diferentes do documento',
    '6. GERAR thumbnail_map.json JUNTO com o DOCX: para CADA exhibit, registrar {exhibit_number, description, pdf_path} com caminho ABSOLUTO do arquivo de evidencia. NUNCA deixar pdf_path vazio ou description como Unknown.',
    '',
    '### Passo 0.03: CROSS-VALIDATION (CARTAS DE TESTEMUNHO)',
    'Se estiver gerando cartas de testemunho/recomendacao:',
    '1. Ler TODOS os documentos da pasta do cliente (CV, certificados, declaracoes RH, contratos, premiacoes, publicacoes)',
    '2. Ler TODOS os Profiles dos recomendadores (LinkedIn PDF, CV)',
    '3. Ler o Quadro de Informacoes e o Projeto Base',
    '4. CRUZAR datas: se o recomendador diz "nos conhecemos em 2005" mas o certificado e de 2003, e ERRO',
    '5. CRUZAR empresas: se diz "trabalhamos juntos na X" mas os CVs mostram que as datas nao batem, e INCONSISTENCIA',
    '6. INCORPORAR dados que o recomendador ESQUECEU mas que estao nos documentos (premiacoes, certificados, resultados)',
    '7. Se existirem Tentativas anteriores (Tentativa 1, 2, 3), ler TODAS e pegar o melhor de cada uma',
    '8. Definir MATRIZ DE PRISMAS antes de escrever: cada carta endossa um angulo DIFERENTE (lideranca, tecnico, mentoria, impacto, visao estrategica) mas TODAS ratificam resultados',
    '',
    '### Passo 0.05: CODIGO SOC ESCAMOTEADO',
    'O numero do codigo SOC (ex: 11-3021, 11-9041.00) SO aparece no CABECALHO do documento.',
    'No corpo do texto, usar APENAS as keywords/tarefas do codigo de forma NATURAL e organica.',
    'NUNCA escrever o numero do codigo no meio de um paragrafo.',
    '',
    '### Passo 0.1: VERIFICACAO DE CREDENCIAIS',
    'Para CADA pessoa mencionada no documento (peticionario, recomendadores, parceiros):',
    '1. Liste as credenciais que voce ENCONTROU nos documentos (diploma, certificacao, titulo)',
    '2. NAO adicione NENHUMA credencial que nao esteja nos documentos — ZERO tolerancia para alucinacao',
    '3. Se nao tem certeza se a pessoa tem MBA/PhD/certificacao, NAO MENCIONE',
    '',
    '### Passo 0.2: VALIDACAO DE DATAS',
    'A tabela de experiencia profissional DEVE ir ate a data ATUAL (2026).',
    'Se o peticionario esta ativo em uma empresa, a data final e "Presente".',
    '',
    '## PESQUISA WEB OBRIGATORIA',
    'ANTES de gerar o documento, faca pesquisas na web para garantir dados ULTRA-ATUALIZADOS:',
    '- Pesquise Executive Orders e Policy Alerts da USCIS de 2025-2026',
    '- Pesquise dados BLS/Census mais recentes para o setor do cliente',
    '- Pesquise politicas federais relevantes para o proposed endeavor',
    '- Se o cliente atua em tecnologia: pesquise regulacoes de AI, GPU, chips, CISA',
    '- Use WebSearch e WebFetch para acessar fontes oficiais (uscis.gov, bls.gov, federalregister.gov)',
    '- Integre dados encontrados no documento com citacao de fonte e data',
    '- Os RAGs locais sao a BASE — a pesquisa web COMPLEMENTA com dados em tempo real',
    '',
  ];

  if (all.length > 0) {
    lines.push('## REGRAS DE ERRO ATIVAS (AUTO-LEARNING)');
    lines.push(`Total: ${all.length} regras (${global.length} globais + ${specific.length} especificas para ${docType})`);
    lines.push('RESPEITE TODAS. Violacao de regra BLOCK = rejeicao automatica.');
    lines.push('');
    for (const r of all) {
      const prefix = r.rule_action === 'block' ? 'BLOCK' : r.rule_action === 'auto_fix' ? 'AUTO-FIX' : 'WARN';
      lines.push(`- [${r.severity.toUpperCase()}/${prefix}] ${r.rule_description}${r.rule_pattern ? ` (regex: ${r.rule_pattern})` : ''}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readJson(file: string): any[] {
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, 'utf-8'));
}

// Map doc_type to search patterns for existing instruction files
const DOC_TYPE_PATTERNS: Record<string, string[]> = {
  cover_letter_eb1a: ['GERAR_COVER_EB1A_', 'GERAR_COVER_EB-1A_'],
  cover_letter_eb2_niw: ['GERAR_COVER_EB2NIW_', 'GERAR_COVER_EB-2_'],
  resume_eb2_niw: ['GERAR_RESUME_', 'GERAR_RESUME_EB2_'],
  resume_eb1a: ['GERAR_RESUME_EB1A_', 'GERAR_RESUME_EB-1A_'],
  business_plan: ['GERAR_BP_'],
  methodology: ['GERAR_METODOLOGIA_'],
  declaration_of_intentions: ['GERAR_DECLARACAO_'],
  impacto_report: ['GERAR_IMPACTO_'],
  strategy_eb1: ['GERAR_ESTRATEGIA_EB1_'],
  strategy_eb2: ['GERAR_ESTRATEGIA_EB2_'],
  saas_evidence: ['GERAR_SAAS_', 'GERAR_SAAS_EVIDENCE_'],
  satellite_letter_eb1: ['GERAR_CARTAS_EB1_', 'GERAR_SATELLITE_EB1_'],
  satellite_letter_eb2: ['GERAR_CARTAS_EB2_', 'GERAR_SATELLITE_EB2_', 'GERAR_CARTAS_NIW_'],
  anteprojeto_eb2_niw: ['GERAR_ANTEPROJETO_EB2_'],
  anteprojeto_eb1a: ['GERAR_ANTEPROJETO_EB1_'],
  projeto_base_eb2_niw: ['GERAR_PROJETO_BASE_EB2_'],
  projeto_base_eb1a: ['GERAR_PROJETO_BASE_EB1_'],
  endeavor_assessment: ['AVALIAR_ENDEAVOR_', 'ENDEAVOR_ASSESSMENT_'],
};

const RAGS_EB1 = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-1/';
const RAGS_EB2 = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs/';
const BENCHMARK_THAYSE = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/LILIAN/Thayse/';
const BENCHMARK_THIAGO = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Thiago Fernandes dos Santos (EB-1)/';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildAnteprojetoInstruction(client: any, system: any, docType: string, outputDir: string, rulesSection: string, selectedEndeavor?: string, selectedSocCode?: string): string {
  const isEB1 = docType.includes('eb1');
  const isProjetoBase = docType.includes('projeto_base');
  const ragsPath = isEB1 ? RAGS_EB1 : RAGS_EB2;
  const benchmarkPath = isEB1 ? BENCHMARK_THIAGO : BENCHMARK_THAYSE;

  const lines = [
    `# ${isProjetoBase ? 'PROJETO-BASE' : 'ANTEPROJETO'} ${isEB1 ? 'EB-1A' : 'EB-2 NIW'}`,
    `## Cliente: ${client.name}`,
    `## Visto: ${client.visa_type}`,
    '',
    '## REGRAS ABSOLUTAS',
    '- Output SEMPRE em .md (para Obsidian). NUNCA .docx para anteprojeto/projeto-base.',
    '- ACENTUAÇÃO PORTUGUESA É INEGOCIÁVEL. Todo output DEVE ter acentos corretos. EXEMPLOS DE VIOLAÇÃO: "introducao" (correto: introdução), "peticao" (correto: petição), "informacao" (correto: informação), "certificacao" (correto: certificação), "area" (correto: área), "tambem" (correto: também), "ja" (correto: já), "ate" (correto: até), "nao" (correto: não), "sera" (correto: será), "apos" (correto: após), "servico" (correto: serviço), "codigo" (correto: código), "negocio" (correto: negócio), "gestao" (correto: gestão), "analise" (correto: análise). USAR: ção, ções, ão, ões, é, ê, á, í, ú, ã, õ, ç em TODAS as palavras. Se o output sair sem acentos, é REJEIÇÃO AUTOMÁTICA.',
    '- NUNCA usar a palavra "PROMPT" no output. E termo interno.',
    '- NUNCA mencionar PROEX, Kortix, nomes de outros clientes.',
    '- NUNCA usar codigos SOC que exigem validacao de diploma nos EUA (advogado 23-1011, medico 29-1069, engenheiro 17-201X, contador 13-2011). Usar alternativas.',
    '- NUNCA propor endeavors genericos como "consultoria" ou "assessoria". USCIS tende a negar.',
    '- Verificar compatibilidade educacional do codigo SOC com formacao do peticionario.',
    '- SEGREDO INDUSTRIAL — NUNCA expor infraestrutura interna no documento:',
    '  - NUNCA mencionar RAG, RAG I, RAG II, RAG III, repositorio de argumentacao',
    '  - NUNCA mencionar Petition Engine, Forjado por, gerado automaticamente, gerado por IA/Claude',
    '  - NUNCA mencionar Obsidian, formato .md, markdown, ferramentas de producao',
    '  - NUNCA incluir versao (V1, V2), Separation of Concerns, Quality Gate no documento',
    '  - NUNCA incluir glossarios de ferramentas internas',
    '  - O documento DEVE parecer produzido por ESPECIALISTA HUMANO experiente',
    '- TERMINOLOGIA ADMINISTRATIVA:',
    '  - NUNCA: equipe juridica, advogado, escritorio de advocacia, traducao juramentada, tribunal, juiz, sentenca',
    '  - USAR: equipe tecnica, consultor, consultoria, traducao certificada, processo administrativo, oficial de imigracao',
    '',
    '## SISTEMA DE GERACAO',
    `Leia TODOS os arquivos .md em: ${system.system_path}`,
    `Versao: ${system.version_tag}`,
    '',
    '## RAGs OBRIGATORIOS (LEIA ANTES DE GERAR)',
    `Leia TODOS os arquivos em: ${ragsPath}`,
  ];

  if (!isEB1) {
    lines.push('Atencao especial para:');
    lines.push('- "II - (EB-2 NIW) - Analise Abrangente da Adjudicacao" — padroes de negacao');
    lines.push('- "O Adjudicador Algoritmico - 2026.pdf" — como AI do USCIS avalia peticoes');
    lines.push('- "Construindo o Caso EB-2 NIW para 2026" — guia de arquitetura de prova');
  } else {
    lines.push('Atencao especial para:');
    lines.push('- "Analise Aprofundada dos Criterios de Aprovacao e Negacao" — estatisticas por criterio');
    lines.push('- "O que os Oficiais de Imigracao Esperam Ver" — expectativas dos oficiais');
    lines.push('- "Pesquisas do que os outros escritorios estao fazendo" — inteligencia competitiva');
  }

  lines.push('');
  lines.push('## BENCHMARK (leia como referencia de qualidade)');
  if (!isEB1) {
    lines.push(`Anteprojeto Thayse: ${benchmarkPath}Anteprojeto Thayse.pdf`);
    lines.push(`Projeto-Base Thayse: ${benchmarkPath}Projeto-Base Completo - Thayse Sopper Boti Cei - EB-2 NIW.pdf`);
  } else {
    lines.push(`Anteprojeto Thiago: ${benchmarkPath}ANTEPROJETO_EB1A_v3.pdf`);
    lines.push(`Projeto Estrategico Thiago: ${benchmarkPath}PROJETO_ESTRATEGICO_EB1A_Continuidade_do_Trabalho.md`);
  }

  lines.push('');
  lines.push('## DADOS DO CLIENTE');
  lines.push(`Pasta de documentos: ${client.docs_folder_path || 'NAO DEFINIDA'}`);
  lines.push('Leia TODOS os documentos do cliente (CV, certificados, evidencias) ANTES de gerar.');

  if (isProjetoBase) {
    lines.push('');
    lines.push('## ENDEAVOR E CODIGO SELECIONADOS');
    if (selectedEndeavor) {
      lines.push(`Endeavor escolhido: ${selectedEndeavor}`);
    } else {
      lines.push('Endeavor escolhido: NAO PRE-SELECIONADO.');
      lines.push('INSTRUCAO: Leia TODOS os documentos do cliente (CV, certificados, Anteprojeto se existir) e SELECIONE AUTONOMAMENTE o melhor endeavor.');
      lines.push('Se existir um Anteprojeto na pasta do cliente, use o endeavor recomendado nele.');
      lines.push('Se nao existir Anteprojeto, analise o perfil e proponha o endeavor mais forte com justificativa.');
      lines.push('NUNCA pare para perguntar — DECIDA e execute.');
    }
    if (selectedSocCode) {
      lines.push(`Codigo SOC escolhido: ${selectedSocCode}`);
    } else {
      lines.push('Codigo SOC escolhido: NAO PRE-SELECIONADO.');
      lines.push('INSTRUCAO: Selecione o codigo SOC/BLS mais adequado ao endeavor escolhido.');
      lines.push('Valide compatibilidade educacional com a formacao do cliente.');
      lines.push('NUNCA usar codigos que exigem validacao de diploma nos EUA (23-1011, 29-1069, 17-201X, 13-2011).');
    }
    lines.push('Execute TODOS os prompts do sistema (1-9 para EB-2 ou 1-4 para EB-1) focando EXCLUSIVAMENTE neste endeavor.');
  } else {
    lines.push('');
    lines.push('## MODO ANTEPROJETO (EXECUCAO PARCIAL)');
    lines.push('');
    lines.push('## CLAUSULA PETREA — NEUTRALIDADE ABSOLUTA (INEGOCIAVEL)');
    lines.push('Os 3 endeavors DEVEM ser apresentados com IGUAL profundidade, IGUAL respeito, e ZERO juizo de valor.');
    lines.push('O documento existe para o CLIENTE ESCOLHER com autonomia e co-responsabilidade.');
    lines.push('NUNCA:');
    lines.push('- Recomendar um endeavor sobre outro');
    lines.push('- Usar "recomendamos", "sugerimos", "o mais forte", "melhor opcao", "menor risco"');
    lines.push('- Rankear endeavors por preferencia ou forca');
    lines.push('- Incluir secao "Recomendacao Estrategica" ou "Recomendacao Final"');
    lines.push('- Classificar risco de negacao de forma que induza escolha (ex: um BAIXO e dois ALTO)');
    lines.push('- Usar "destaca-se", "claramente superior", "se sobressai"');
    lines.push('- Concluir com "portanto o endeavor X e o mais indicado"');
    lines.push('FAZER:');
    lines.push('- Apresentar FATOS objetivos: mercado, SOC, politicas, riscos — sem conclusao de "qual e melhor"');
    lines.push('- Cada endeavor tem pros E contras — mostrar AMBOS igualmente');
    lines.push('- A secao final deve ser "PROXIMOS PASSOS" (escolher, enriquecer CV, coletar evidencias)');
    lines.push('- Se os 3 endeavors tiverem riscos diferentes, apresentar como FATO, nao como argumento de escolha');
    lines.push('VIOLACAO DESTA REGRA = REJEICAO AUTOMATICA DO DOCUMENTO INTEIRO.');
    lines.push('');
    if (!isEB1) {
      lines.push('Execute APENAS os prompts 1-3 do sistema EB-2 NIW.');
      lines.push('O output deve conter:');
      lines.push('1. Quadro-resumo comparativo com 3 endeavors distintos (apresentacao NEUTRA, sem ranking)');
      lines.push('2. Para cada endeavor: descricao tecnica, publico-alvo, modelo de receita, projecao Y1/Y2');
      lines.push('3. 3 codigos SOC/BLS para cada endeavor (com validacao de compatibilidade educacional)');
      lines.push('4. Analise de risco para cada endeavor (apresentar como FATO, sem induzir escolha)');
      lines.push('5. Alinhamento com politicas federais');
      lines.push('6. Secao final: PROXIMOS PASSOS (NAO "Recomendacao")');
    } else {
      lines.push('Execute APENAS os prompts 1-3 do sistema EB-1A (Kortix).');
      lines.push('O output deve conter:');
      lines.push('1. Mapeamento completo do perfil (10 categorias)');
      lines.push('2. Analise detalhada dos 10 criterios EB-1A (forca: ROBUSTA/PROMISSORA/EM DESENVOLVIMENTO)');
      lines.push('3. 3 codigos SOC/BLS alternativos com validacao');
      lines.push('4. Quadro-resumo com endeavor proposto e criterios — SEM ranking ou recomendacao');
      lines.push('5. Secao final: PROXIMOS PASSOS (NAO "Recomendacao")');
    }
  }

  lines.push('');
  lines.push('## OUTPUT');
  lines.push(`Salve o arquivo .md em: ${outputDir}`);
  const prefix = isProjetoBase ? 'Projeto_Base' : 'Anteprojeto';
  const suffix = isEB1 ? 'EB1A' : 'EB2_NIW';
  const slug = client.name.replace(/\s+/g, '_');
  lines.push(`Nome: ${prefix}_${suffix}_${slug}.md`);

  if (rulesSection) {
    lines.push(rulesSection);
  }

  return lines.join('\n');
}

// Search for an existing specific instruction file for this client + doc_type
function findExistingInstruction(clientName: string, docType: string, clientDocsPath: string): string | null {
  const nameTokens = clientName.toUpperCase().split(/\s+/).filter(t => t.length > 2);
  const patterns = DOC_TYPE_PATTERNS[docType] || [`GERAR_${docType.toUpperCase()}_`];

  // 1. Search in C.P. folder (Paulo's main instruction folder)
  if (existsSync(CP_DIR)) {
    try {
      const cpFiles = readdirSync(CP_DIR).filter(f => f.endsWith('.md'));
      for (const pat of patterns) {
        const match = cpFiles.find(f => {
          const upper = f.toUpperCase();
          return upper.startsWith(pat.toUpperCase()) && nameTokens.some(t => upper.includes(t));
        });
        if (match) return path.join(CP_DIR, match);
      }
    } catch {}
  }

  // 2. Search in client's docs folder for MEGA_PROMPT or GERAR_ files
  if (clientDocsPath && existsSync(clientDocsPath)) {
    try {
      const searchDirs = [clientDocsPath];
      // Also check immediate subdirectories
      const subs = readdirSync(clientDocsPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => path.join(clientDocsPath, d.name));
      searchDirs.push(...subs);

      for (const dir of searchDirs) {
        try {
          const files = readdirSync(dir).filter(f => f.endsWith('.md'));
          const mega = files.find(f => f.toUpperCase().includes('MEGA_PROMPT'));
          if (mega) return path.join(dir, mega);
          for (const pat of patterns) {
            const match = files.find(f => f.toUpperCase().startsWith(pat.toUpperCase()));
            if (match) return path.join(dir, match);
          }
        } catch {}
      }
    } catch {}
  }

  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, doc_type, generation_instructions } = body;

  if (!client_id || !doc_type) {
    return NextResponse.json({ error: 'client_id e doc_type sao obrigatorios' }, { status: 400 });
  }

  const clients = readJson(CLIENTS_FILE);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = clients.find((c: any) => c.id === client_id);
  if (!client) {
    return NextResponse.json({ error: `Cliente ${client_id} nao encontrado` }, { status: 404 });
  }

  const systems = readJson(SYSTEMS_FILE);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const system = systems.find((s: any) => s.doc_type === doc_type);
  if (!system) {
    return NextResponse.json({ error: `Sistema ${doc_type} nao encontrado` }, { status: 404 });
  }

  const clientSlug = client.name.replace(/\s+/g, '_');
  const clientBaseDir = client.docs_folder_path || `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/${client.name}/`;
  const outputDir = path.join(clientBaseDir, '_Forjado por Petition Engine') + '/';

  // Try to find existing specific instruction first
  const existingInstruction = findExistingInstruction(client.name, doc_type, clientBaseDir);

  let promptPath: string;
  let instructionSource: 'existing' | 'generated';
  let prompt: string;

  const rulesSection = buildRulesSection(doc_type);
  const { selected_endeavor, selected_soc_code } = body;

  // Special handling for endeavor assessment
  if (doc_type === 'endeavor_assessment') {
    const isEB1 = client.visa_type?.includes('EB-1') || client.visa_type?.includes('EB1');
    const ragsPath = isEB1 ? RAGS_EB1 : RAGS_EB2;
    const assessmentPrompt = [
      '# AVALIAÇÃO DE ENDEAVOR — Parecer Estratégico',
      `## Cliente: ${client.name}`,
      `## Visto: ${client.visa_type}`,
      '',
      '## MISSÃO',
      'Você é um estrategista de imigração sênior. O cliente enviou uma sugestão de endeavor (negócio/empreendimento)',
      'e precisa de um PARECER ESTRATÉGICO antes de investir tempo e dinheiro nessa direção.',
      '',
      'Sua análise deve ser HONESTA e DIRETA — se a ideia é ruim, diga. Se é boa, diga por quê.',
      'Se precisa de ajustes, especifique exatamente o quê.',
      '',
      '## O QUE AVALIAR',
      '',
      '### 1. VIABILIDADE IMIGRATÓRIA (peso 40%)',
      '- A proposta atende aos requisitos do visto? (Dhanasar 3 prongs para EB-2 NIW, ou 10 critérios para EB-1A)',
      '- O endeavor é específico o suficiente ou soa como "consultoria genérica"?',
      '- Existe produto/serviço tangível ou é só conceito?',
      '- O perfil do peticionário conecta com o endeavor? (formação + experiência → endeavor)',
      '- Risco de anti-Cristine: o endeavor funciona SEM o peticionário? Se sim, mata Prong 3.',
      '',
      '### 2. VIABILIDADE DE MERCADO (peso 30%)',
      '- O mercado-alvo existe e tem tamanho documentável? (dados SBA, BLS, Census)',
      '- O pricing faz sentido pro público-alvo?',
      '- Existe lacuna real que o endeavor preenche?',
      '- Há concorrentes diretos? Se sim, qual o diferencial?',
      '',
      '### 3. ALINHAMENTO COM O ANTEPROJETO (peso 20%)',
      '- Como essa sugestão se compara com os endeavors já propostos no anteprojeto?',
      '- É melhor, pior, ou complementar?',
      '- Pode ser hibridizado com algum endeavor existente?',
      '',
      '### 4. RISCOS ESPECÍFICOS (peso 10%)',
      '- Riscos de RFE (Request for Evidence)',
      '- Riscos de negação',
      '- Riscos de nomenclatura (nome da empresa soa como algo que não é?)',
      '- Riscos de anti-Cristine (termos que provam que funciona sem o peticionário)',
      '',
      '## FONTES OBRIGATÓRIAS',
      `Leia os RAGs ANTES de avaliar: ${ragsPath}`,
      '',
      '## DADOS DO CLIENTE',
      `Pasta de documentos: ${client.docs_folder_path || 'NAO DEFINIDA'}`,
      'Leia TODOS os documentos do cliente — especialmente:',
      '- O anteprojeto existente (se houver) para comparar os endeavors propostos',
      '- O documento/PDF que o cliente enviou com a sugestão',
      '- CV, timeline, certificados para validar conexão perfil ↔ endeavor',
      '',
      generation_instructions ? `## CONTEXTO ADICIONAL DO PAULO\n${generation_instructions}\n` : '',
      '## PESQUISA WEB OBRIGATÓRIA',
      '- Pesquise dados BLS/SBA/Census sobre o mercado-alvo do endeavor proposto',
      '- Pesquise concorrentes diretos nos EUA',
      '- Pesquise códigos SOC compatíveis',
      '- Verifique se o nome da empresa já existe (sunbiz.org, Secretary of State)',
      '',
      '## OUTPUT',
      'Formato: .md (documento interno de trabalho)',
      `Salvar em: ${outputDir}`,
      `Nome: Parecer_Endeavor_${clientSlug}.md`,
      '',
      '## ESTRUTURA DO PARECER',
      '',
      '### Cabeçalho',
      '- Cliente, visto, data, endeavor avaliado',
      '',
      '### Resumo Executivo (3-5 linhas)',
      '- Veredicto: ADOTAR / ADAPTAR / REJEITAR',
      '- Score de viabilidade: 0-100',
      '',
      '### Análise de Viabilidade Imigratória',
      '- Prong 1 (Mérito + Importância Nacional): nota + justificativa',
      '- Prong 2 (Bem Posicionado): nota + justificativa',
      '- Prong 3 (Waiver): nota + justificativa + check anti-Cristine',
      '',
      '### Análise de Mercado',
      '- Tamanho do mercado com fontes',
      '- Lacuna identificada',
      '- Pricing: realista ou não?',
      '- Concorrentes',
      '',
      '### Comparação com Anteprojeto',
      '- Tabela comparativa: endeavor sugerido vs. endeavors do anteprojeto',
      '- Recomendação de hibridização (se aplicável)',
      '',
      '### Riscos e Mitigações',
      '- Tabela: risco | nível | mitigação',
      '',
      '### Correções Necessárias',
      '- Lista específica do que precisa mudar pra funcionar',
      '',
      '### Códigos SOC Recomendados',
      '- Tabela: código | ocupação | salário mediano | compatibilidade',
      '',
      '### Veredicto Final',
      '- ADOTAR: usar como está',
      '- ADAPTAR: usar com as correções listadas',
      '- REJEITAR: não usar, motivo claro',
      '- Se ADAPTAR: formulação sugerida do endeavor final',
      '',
      '## REGRAS',
      '- NUNCA expor infraestrutura interna (RAGs, Petition Engine, Obsidian)',
      '- NUNCA usar terminologia jurídica (advogado, tribunal, tradução juramentada)',
      '- USAR terminologia administrativa (consultor, oficial de imigração, tradução certificada)',
      '- Ser HONESTO — não inflar uma ideia ruim pra agradar o cliente',
      '- Dados SEMPRE com fonte verificável',
      rulesSection,
    ].filter(Boolean).join('\n');

    const promptFileName = `AVALIAR_ENDEAVOR_${clientSlug}.md`;
    if (!existsSync(PROMPTS_DIR)) mkdirSync(PROMPTS_DIR, { recursive: true });
    const assessmentPromptPath = path.join(PROMPTS_DIR, promptFileName);
    writeFileSync(assessmentPromptPath, assessmentPrompt, 'utf-8');

    const claudeCommand = `claude -p "Leia ${assessmentPromptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch`;

    return NextResponse.json({
      data: {
        prompt: assessmentPrompt,
        metadata: {
          system: 'Endeavor Assessment',
          systemName: 'Endeavor Assessment',
          doc_type: 'endeavor_assessment',
          client_name: client.name,
          client_id: client.id,
          output_dir: outputDir,
          recommended_model: 'claude-opus-4',
          instruction_source: 'endeavor_assessment_generator',
          instruction_path: assessmentPromptPath,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rulesInjected: readRules().filter((r: any) => r.active && (!r.doc_type || r.doc_type === doc_type)).length,
          rags_path: ragsPath,
          pipeline: ['endeavor_assessment', 'quality_gate'],
        },
        prompt_path: assessmentPromptPath,
        prompt_file: assessmentPromptPath,
        claude_command: claudeCommand,
      },
    });
  }

  // Special handling for anteprojeto/projeto-base
  const isAnteprojeto = doc_type.startsWith('anteprojeto_') || doc_type.startsWith('projeto_base_');
  if (isAnteprojeto) {
    let specialPrompt = buildAnteprojetoInstruction(client, system, doc_type, outputDir, rulesSection, selected_endeavor, selected_soc_code);
    if (generation_instructions) {
      specialPrompt += '\n\n## INSTRUCOES ESPECIFICAS PARA ESTA GERACAO\n' + generation_instructions + '\n';
    }
    const promptFileName = `GERAR_${doc_type.toUpperCase()}_${clientSlug}.md`;
    if (!existsSync(PROMPTS_DIR)) mkdirSync(PROMPTS_DIR, { recursive: true });
    const specialPromptPath = path.join(PROMPTS_DIR, promptFileName);
    writeFileSync(specialPromptPath, specialPrompt, 'utf-8');

    const claudeCommand = `claude -p "Leia ${specialPromptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep`;

    return NextResponse.json({
      data: {
        prompt: specialPrompt,
        metadata: {
          system: system.system_name,
          systemName: system.system_name,
          doc_type: system.doc_type,
          client_name: client.name,
          client_id: client.id,
          system_path: system.system_path,
          output_dir: outputDir,
          filesRead: system.file_count,
          recommended_model: system.recommended_model,
          estimatedTokens: system.file_count * 5000,
          instruction_source: 'anteprojeto_generator',
          instruction_path: specialPromptPath,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rulesInjected: readRules().filter((r: any) => r.active && (!r.doc_type || r.doc_type === doc_type)).length,
          selected_endeavor: selected_endeavor || null,
          selected_soc_code: selected_soc_code || null,
          rags_path: doc_type.includes('eb1') ? RAGS_EB1 : RAGS_EB2,
          pipeline: ['anteprojeto_generation', 'separation_of_concerns'],
          soc_enabled: true,
        },
        prompt_path: specialPromptPath,
        prompt_file: specialPromptPath,
        claude_command: claudeCommand,
      },
    });
  }

  if (existingInstruction) {
    // Use the existing real instruction file (written by Paulo/Cowork)
    promptPath = existingInstruction;
    instructionSource = 'existing';
    prompt = readFileSync(existingInstruction, 'utf-8');
    // Inject generation-specific instructions
    if (generation_instructions) {
      prompt += '\n\n## INSTRUCOES ESPECIFICAS PARA ESTA GERACAO\n' + generation_instructions + '\n';
    }
    // Inject active error rules at the end of existing instruction
    if (rulesSection) {
      prompt += '\n' + rulesSection;
    }
  } else {
    // Generate a fallback instruction
    instructionSource = 'generated';
    const promptFileName = `GERAR_${doc_type.toUpperCase()}_${clientSlug}.md`;
    if (!existsSync(PROMPTS_DIR)) mkdirSync(PROMPTS_DIR, { recursive: true });
    promptPath = path.join(PROMPTS_DIR, promptFileName);

    // Check if this doc_type outputs PPTX
    const systemMapEntry = SYSTEM_MAP[doc_type];
    const isPptx = systemMapEntry?.outputFormat === 'pptx';

    if (isPptx) {
      // PPTX pipeline: Claude generates structured JSON → Python script builds PPTX
      const jsonOutputPath = path.join(outputDir, `${doc_type}_${clientSlug}_content.json`);
      const pptxOutputPath = path.join(outputDir, `${doc_type}_${clientSlug}.pptx`);

      prompt = [
        `# Instrucao de Geracao PPTX: ${system.system_name}`,
        `## Cliente: ${client.name}`,
        `## Visto: ${client.visa_type}`,
        client.company_name ? `## Empresa: ${client.company_name}` : null,
        '',
        '## PIPELINE DE 2 ETAPAS',
        'Etapa 1: Voce gera o conteudo estruturado como JSON.',
        'Etapa 2: O script Python generate_pptx.py monta o PPTX profissional.',
        '',
        '## ENGINEERING SPEC (OBRIGATÓRIO — LER ANTES DE GERAR)',
        `Leia o spec de engenharia PPTX: ${path.join(process.cwd(), 'systems/pptx-engineering-spec/eb2_niw_pptx_engineering_spec.md')}`,
        'Este arquivo contém TODAS as coordenadas pixel-perfect, paleta de cores, tipografia, e 9 armadilhas documentadas.',
        'Siga EXATAMENTE as coordenadas e regras do spec. Qualquer desvio = rejeição.',
        '',
        '## REGRAS ABSOLUTAS',
        '- Leia TODOS os arquivos de sistema ANTES de gerar conteúdo.',
        '- NÃO invente dados. Use APENAS informações do perfil e documentos do cliente.',
        '- Cada afirmação deve ter evidência. Sem linguagem genérica.',
        '- 100% em INGLÊS para documentos USCIS.',
        '- FONT: Palatino Linotype para títulos, Garamond para corpo. NUNCA Arial/Calibri exceto pipeline labels.',
        '- CORES: Navy #1B2A4A, Gold #C9A96E, Cream #F5F0E8. GRADIENTES obrigatórios (nunca solid fill).',
        '- CARD BODY: 9.5pt MÁXIMO. NUNCA 14pt (overflow documentado em 18/26 slides).',
        '- FOOTER: bg GoldDark #8B7355, texto Beige #E8D5B7. NUNCA navy sobre navy (invisível).',
        '- TITLEBAR: x=0 w=720 (edge-to-edge). Só texto tem margin.',
        '- GOLD RULES: Section headers = 600pt centered (x=60). Title slide = 720pt full-width.',
        '- VARIAÇÃO: NUNCA 2 slides consecutivos do mesmo layout type.',
        '- LETTER-SPACING: Hierárquico — name spc=400, titlebar spc=300, section spc=200, card spc=100, pipeline spc=-100.',
        '',
        '## SISTEMA DE GERACAO',
        `Leia TODOS os arquivos .md em: ${system.system_path}`,
        `Versao: ${system.version_tag} | Modelo recomendado: ${system.recommended_model}`,
        '',
        '## DADOS DO CLIENTE',
        `Pasta de documentos: ${client.docs_folder_path || 'NAO DEFINIDA'}`,
        'Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.',
        '',
        '## ETAPA 1: GERAR JSON ESTRUTURADO',
        `Salve o JSON em: ${jsonOutputPath}`,
        '',
        'O JSON DEVE seguir EXATAMENTE esta estrutura:',
        '```json',
        '{',
        `  "client_name": "${client.name}",`,
        `  "visa_type": "${client.visa_type}",`,
        `  "doc_label": "Professional ${doc_type === 'methodology' ? 'Methodology' : 'Declaration of Intentions'} Dossier",`,
        `  "title": "${doc_type === 'methodology' ? 'Methodology — Comprehensive Analysis' : 'Statement of Intentions — Strategic Declaration'}",`,
        '  "subtitle": "Detailed documentation...",',
        '  "sections": [',
        '    {',
        '      "title": "Section Title (short, impactful)",',
        '      "subtitle": "One-line description for divider slide",',
        '      "slides": [',
        '        {',
        '          "type": "content",',
        '          "title": "Slide Title",',
        '          "paragraphs": ["Paragraph 1...", "Paragraph 2..."],',
        '          "bullets": ["Bullet 1...", "Bullet 2..."]',
        '        },',
        '        {',
        '          "type": "metrics",',
        '          "title": "Key Metrics",',
        '          "metrics": [{"value": "500+", "label": "Clients Reached"}]',
        '        },',
        '        {',
        '          "type": "table",',
        '          "title": "Evidence Summary",',
        '          "headers": ["Criterion", "Evidence", "Impact"],',
        '          "rows": [["Awards", "ABRASCI Chair", "Lifetime honor"]]',
        '        },',
        '        {',
        '          "type": "two_column",',
        '          "title": "Comparison",',
        '          "left": {"heading": "Before", "paragraphs": ["..."]},',
        '          "right": {"heading": "After", "paragraphs": ["..."]}',
        '        },',
        '        {',
        '          "type": "quote",',
        '          "quote": "The actual quote text...",',
        '          "attribution": "Source, Year"',
        '        },',
        '        {',
        '          "type": "process_flow",',
        '          "title": "Methodology Pipeline",',
        '          "steps": [',
        '            {"title": "CHALLENGE", "description": "Problem identified...", "icon": "target"},',
        '            {"title": "SOLUTION", "description": "Method applied...", "icon": "methodology"},',
        '            {"title": "IMPACT", "description": "Result measured...", "icon": "impact"}',
        '          ]',
        '        },',
        '        {',
        '          "type": "icon_grid",',
        '          "title": "Core Pillars",',
        '          "intro_text": "The methodology operates through...",',
        '          "items": [',
        '            {"title": "PILLAR NAME", "description": "Description...", "icon": "innovation"},',
        '            {"title": "PILLAR NAME", "description": "Description...", "icon": "leadership"},',
        '            {"title": "PILLAR NAME", "description": "Description...", "icon": "strategy"}',
        '          ]',
        '        },',
        '        {',
        '          "type": "icon_list",',
        '          "title": "Key Competencies",',
        '          "items": [',
        '            {"title": "COMP NAME", "description": "Description...", "icon": "validation"},',
        '            {"title": "COMP NAME", "description": "Description...", "icon": "research"}',
        '          ]',
        '        },',
        '        {',
        '          "type": "photo_content",',
        '          "title": "Professional Profile",',
        '          "paragraphs": ["Text about the petitioner..."],',
        '          "photo_side": "left"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        `  "client_docs_path": "${client.docs_folder_path || ''}",`,
        '  "closing_message": "Comprehensive Documentation Complete"',
        '}',
        '```',
        '',
        '### TIPOS DE SLIDE DISPONIVEIS (10 tipos):',
        '- **content**: Title bar navy + paragrafos + bullets (MAX 3 paragrafos curtos)',
        '- **metrics**: Cards navy com numeros gold grandes (KPIs, stats)',
        '- **table**: Tabela profissional navy header + alternating rows',
        '- **comparison**: Lado a lado (Antes/Depois, Convencional/Inovador)',
        '- **quote**: Citacao elegante em slide navy escuro',
        '- **process_flow**: Pipeline horizontal com circulos numerados, setas gold, cards. steps: [{num, title, body}]',
        '- **hub_spoke**: Circulo central + 4 cards ao redor. hub_text + cards: [{metric, title, description}]',
        '- **icon_cards**: Grid 2x3 de cards numerados com circulos dourados. items: [{title, description}]',
        '- **timeline**: Linha horizontal com dots e cards. milestones: [{year, title, description}]',
        '- **two_column**: Alias para comparison',
        '',
        '### DESIGN DNA (OBRIGATORIO):',
        '- Fontes: Palatino Linotype (titulos, headings) + Garamond (corpo, bullets)',
        '- Cores: Navy #1B2A4A (estrutura) | Gold #B8860B (importancia) | Cream #E8D5B7 (footer)',
        '- Title bar: navy 58pt height em todo content slide',
        '- Footer: Garamond 9pt cream em y=367 de todo slide',
        '- Cards: roundRect, gold accent bar 3pt no topo, padding 10pt',
        '- Line spacing: 22pt para body text (generoso, profissional)',
        '',
        '### REGRAS DO JSON:',
        '- Minimo 5 sections, cada section com 2-4 slides',
        '- Total esperado: 25-35 slides de conteudo',
        '- VARIE os tipos — NUNCA mais que 2 slides "content" consecutivos',
        '- Use process_flow para METHOD→RESULT→IMPACT (obrigatorio em Metodologia)',
        '- Use hub_spoke para framework central com pilares',
        '- Use icon_cards para competencias, certificacoes, features',
        '- Use timeline para evolucao cronologica',
        '- Use metrics para KPIs e numeros de impacto',
        '- Use comparison para Convencional vs. Proposto',
        '- Paragrafos: MAX 3 frases curtas (NUNCA paredes de texto)',
        '- Metricas com numeros REAIS do perfil do cliente (nao inventar)',
        '- Tabelas com dados concretos (evidencias, criterios, impacto)',
        '',
        '## ETAPA 2: GERAR PPTX',
        `Apos salvar o JSON, execute:`,
        `python3 ${PPTX_GENERATOR} --content "${jsonOutputPath}" --output "${pptxOutputPath}" --type ${doc_type === 'methodology' ? 'methodology' : 'declaration'}`,
        '',
        '## POS-GERACAO: SEPARATION OF CONCERNS',
        'Apos gerar, NAO considere finalizado.',
        'Revisao cruzada obrigatoria em SESSAO LIMPA.',
        `Instrucao: ${SOC_PATH}`,
        generation_instructions ? `\n## INSTRUCOES ESPECIFICAS\n${generation_instructions}\n` : null,
        rulesSection,
      ].filter(Boolean).join('\n');
    } else {
      // Standard DOCX pipeline
      const isResume = doc_type.startsWith('resume');
      prompt = [
        `# Instrucao de Geracao: ${system.system_name}`,
        `## Cliente: ${client.name}`,
        `## Visto: ${client.visa_type}`,
        client.company_name ? `## Empresa: ${client.company_name}` : null,
        '',
        '## REGRAS ABSOLUTAS',
        '- Output SEMPRE .docx (python-docx). NUNCA .md, NUNCA texto puro.',
        '- Leia TODOS os arquivos de sistema ANTES de escrever codigo.',
        '- Instrucoes estrategicas — NAO invente parametrizacoes.',
        '- ACENTUAÇÃO PORTUGUESA É INEGOCIÁVEL (para docs em PT-BR): EXEMPLOS DE VIOLAÇÃO: "introducao" (→ introdução), "peticao" (→ petição), "informacao" (→ informação), "certificacao" (→ certificação), "area" (→ área), "tambem" (→ também), "ja" (→ já), "ate" (→ até), "nao" (→ não), "sera" (→ será), "apos" (→ após), "servico" (→ serviço), "codigo" (→ código), "negocio" (→ negócio), "gestao" (→ gestão), "analise" (→ análise). Se sair sem acentos = REJEIÇÃO AUTOMÁTICA.',
        '- SEGREDO INDUSTRIAL — NUNCA expor infraestrutura interna no documento:',
        '  - NUNCA mencionar RAG, RAG I, RAG II, RAG III, repositorio de argumentacao, base de conhecimento',
        '  - NUNCA mencionar Petition Engine, Forjado por, gerado automaticamente, gerado por IA/Claude/sistema',
        '  - NUNCA mencionar Obsidian, formato .md, markdown, ferramentas de producao, pipeline',
        '  - NUNCA incluir versao (V1, V2, V3), Separation of Concerns, Quality Gate, auto-learning no documento',
        '  - NUNCA incluir disclaimers tipo DOCUMENTO INTERNO, Rascunho, Para Revisao',
        '  - NUNCA incluir glossarios de ferramentas internas (RAG I = tal coisa)',
        '  - O documento DEVE parecer produzido por ESPECIALISTA HUMANO experiente, NAO por sistema automatizado',
        '- TERMINOLOGIA ADMINISTRATIVA — NUNCA usar linguagem juridica/advocaticia:',
        '  - NUNCA: equipe juridica, advogado, escritorio de advocacia, representacao legal, traducao juramentada',
        '  - USAR: equipe tecnica, consultor/especialista, consultoria, suporte tecnico, traducao certificada',
        '  - USCIS eh processo ADMINISTRATIVO. NUNCA: tribunal, juiz, sentenca, julgamento, litigio',
        doc_type === 'saas_evidence' ? [
          '',
          '## REGRAS ESPECIFICAS PARA SAAS EVIDENCE (OBRIGATORIO)',
          '- Alem do .docx principal, DEVE gerar um arquivo LOVABLE_BUILD_SPEC.md na MESMA pasta.',
          '- O LOVABLE_BUILD_SPEC.md eh um mega prompt completo pro Lovable construir o SaaS como app web.',
          '- DEVE conter: tech stack, paleta de cores, tipografia, componentes globais (KPI card, sidebar, data table),',
          '  e 7+ paginas detalhadas (landing, dashboard, modulos do produto, settings, pricing page).',
          '- Adaptar CADA secao ao produto ESPECIFICO do cliente — NAO usar template generico.',
          '- Dados mock devem usar terminologia REAL do dominio do cliente.',
          '- Pricing page DEVE bater EXATAMENTE com o pricing do docx principal.',
          '- Visual: enterprise SaaS (Stripe, Notion, Linear). Navy #1B2A4A + Gold #B8860B.',
          '- SEM este arquivo o output esta INCOMPLETO. Verificar que foi salvo antes de finalizar.',
          '',
        ].join('\n') : null,
        doc_type === 'business_plan' ? [
          '',
          '## REGRAS ESPECÍFICAS PARA BUSINESS PLAN (OBRIGATÓRIO)',
          '- IDIOMA: 100% em INGLÊS (en-US). Texto, tabelas, gráficos, headers — TUDO em inglês.',
          '- GRÁFICOS OBRIGATÓRIOS (MÍNIMO 6): Gerar com matplotlib/plotly e inserir no DOCX como imagem.',
          '  1. Revenue Projection Chart (Y1-Y5 bar chart)',
          '  2. Expense Breakdown (pie chart ou stacked bar)',
          '  3. Profit/Loss Projection (line chart Y1-Y5)',
          '  4. Market Size & Growth (bar chart com CAGR)',
          '  5. Customer Acquisition Timeline (line chart)',
          '  6. Investment Allocation (pie chart — startup costs)',
          '  Código Python: import matplotlib.pyplot as plt → gerar PNG → doc.add_picture()',
          '  Labels, títulos e legendas dos gráficos SEMPRE em INGLÊS.',
          '  Dados REAIS do cliente (não inventar). Se não tiver dados, usar projeções conservadoras.',
          '  Estilo visual: fundo branco, cores Navy #1B2A4A + Gold #B8860B + cinza #666666.',
          '- TABELAS: Mínimo 8 tabelas. Header marrom claro (#DEDACB), corpo branco, SEM bordas laterais.',
          '  Toda tabela DEVE ter parágrafo introdutório (2+ frases) ANTES e parágrafo analítico (1+ frase) DEPOIS.',
          '- FORMATAÇÃO:',
          '  - Fonte: Garamond 12pt corpo, 14pt títulos (bold), 10pt notas de rodapé',
          '  - Margens: top 0.7in, bottom 0.6in, left 0.8in, right 0.6in',
          '  - Entrelinhas: 1.15',
          '  - Espaço entre parágrafos: 6pt',
          '  - Footer: "CONFIDENTIAL — [COMPANY NAME] — Business Plan 2026" em barra marrom (#8B7355)',
          '  - Page break antes de cada nova seção principal',
          '- FOOTNOTES: Mínimo 10 referências. Dados de mercado DEVEM ter fonte (BLS, Census, IBISWorld, Statista).',
          '  Formato: número sobrescrito no texto → bloco separado no final da seção com linha separadora.',
          '- PARÁGRAFOS: Máximo 1200 caracteres. Se maior, dividir em dois. Nunca paredes de texto.',
          '- SEÇÕES OBRIGATÓRIAS: Executive Summary, Company Description, Market Analysis, Products/Services,',
          '  Marketing Strategy, Operations Plan, Management Team, Financial Projections (5-year),',
          '  Funding Requirements, Risk Analysis, Appendices.',
          '- NÃO usar "pé quadrado" — usar "square feet" ou "sq ft".',
          '- NÃO usar zebra striping nas tabelas (linhas alternadas coloridas).',
          '- BENCHMARK: VF_business plan_ikaro ferreira souza.docx — COPIAR o nível de densidade e visual.',
          '',
        ].join('\n') : null,
        isResume && doc_type === 'resume_eb2_niw' ? [
          '',
          '## REGRAS ESPECIFICAS PARA RESUME EB-2 NIW (CRITICO — V2.0 Premium)',
          '- IDIOMA: 100% em PORTUGUES BRASILEIRO. Todo texto corrido em portugues. Termos tecnicos e nomes proprios em italico podem ficar em ingles. ACENTUACAO OBRIGATORIA.',
          '- FONT: Garamond em TODO o documento. 20pt nome, 11pt secao, 10.5pt corpo, 9pt contact/footer. ZERO Arial, ZERO Calibri.',
          '- HEADER: Tabela 3 rows x 2 cols. Row 0-1: Navy #2D3E50 (nome + RESUME + EB-2 NIW + SOC code). Row 2: Teal #3498A2 accent.',
          '- FOOTER: Barra Navy com "Page X of Y" em branco, Garamond 9pt.',
          '- MARGENS: 0.65" laterais, 0" topo (header colado), 0.5" bottom.',
          '- SECTION HEADERS: Barra Navy #2D3E50 full-width com texto branco centralizado, Garamond 11pt Bold.',
          '- SUB-HEADERS: Barra Teal #3498A2 full-width, Garamond 10pt Bold branco.',
          '- EVIDENCE BLOCKS: Tabela 2 colunas — metadata ESQUERDA (5760 DXA), thumbnail DIREITA (4320 DXA).',
          '  Borda #CCCCCC. Impact label "Descricao e Impacto" em bold #2D3E50, texto italic #333333.',
          '  Impact DENTRO do bloco, NUNCA abaixo. Minimo 4 linhas por paragrafo de impacto.',
          '  Thumbnail: NAO tente gerar imagem. SEMPRE coloque o placeholder exato: [THUMBNAIL — Evidencia N]',
          '  onde N eh o numero sequencial da evidencia (1, 2, 3...). O script insert_thumbnails.py vai substituir depois.',
          '  CADA evidence block DEVE ter um placeholder [THUMBNAIL — Evidencia N] na celula da direita.',
          '  NUNCA usar a palavra "Exhibit" no resume — "Exhibit" eh exclusivo de Cover Letter. Usar "Evidencia".',
          '- CORES PERMITIDAS: Navy #2D3E50, Teal #3498A2, White, Black, #333333, #666666, #F5F5F5, #CCCCCC. NENHUMA outra.',
          '- PAGE BREAKS: Cada secao principal (Navy header) DEVE comecar em pagina nova.',
          '',
          '## ESTRUTURA POR EXPERIENCIA PROFISSIONAL (OBRIGATORIO — padrao validado em 5 benchmarks)',
          '- CADA entrada de experiencia (emprego/empresa) DEVE ter:',
          '  1. Header: Nome do Cargo | Empresa | Periodo',
          '  2. Sub-secao "PRINCIPAIS RESPONSABILIDADES" — lista do que fazia no dia a dia',
          '  3. Sub-secao "PRINCIPAIS RESULTADOS E IMPACTOS" — metricas, transformacoes, efeitos do trabalho com INFERENCIAS',
          '  4. Evidence blocks com thumbnails das evidencias documentais',
          '- NUNCA fazer bloco unico de experiencia sem essas sub-secoes.',
          '',
          '## SINTESE PROFISSIONAL (500-700 PALAVRAS MINIMO)',
          '- Narrativa densa em terceira pessoa com inferencias EMBUTIDAS no fluxo textual.',
          '- Cada paragrafo: fato + inferencia tecnica + nexo com qualificacao.',
          '- NAO fazer sintese rasa de 4 paragrafos sem inferencia.',
          '- Benchmark: Rafael Almeida V4 — 700+ palavras de narrativa inferencial.',
          '',
          '## ESTRUTURA EB-2 NIW (OBRIGATORIA — NAO usar estrutura EB-1A)',
          '- NAO organizar por criterio C1-C10 (isso eh EB-1A). Organizar por TEMA.',
          '- NAO mencionar Dhanasar no corpo do resume (pertence a Cover Letter).',
          '- NAO citar numeros de evidencia no texto corrido ([Exhibit 1], [Evidence 3] etc.).',
          '- NAO mencionar cartas de recomendacao no corpo do resume.',
          '- NAO listar evidencias no final do documento.',
          '- INCLUIR inferencias tecnicas e nexos causais: cada realizacao deve ter conexao explicita com a qualificacao.',
          '- Secoes obrigatorias: Sintese Profissional (500-700 pal), Historico (Gantt), Experiencia Profissional (com Responsabilidades + Resultados por empresa), Contribuicoes Tecnicas (por TEMA), Publicacoes, Formacao, Cursos.',
          '- NUNCA incluir secao de PROPOSED ENDEAVORS, ENDEAVORS ou escolha de endeavor. Isso pertence ao Anteprojeto, NAO ao resume.',
          '- NUNCA incluir dados financeiros (revenue, projecao, receita, faturamento, lucro, investimento, ROI). Isso pertence ao Business Plan.',
          '- NUNCA copiar conteudo de arquivos de Anteprojeto ou Projeto-Base. Ignorar completamente esses arquivos.',
          '- NUNCA incluir codigos SOC alternativos ou comparativos de endeavors. O resume apresenta UM perfil, nao opcoes.',
          '',
          '- Apos gerar: rodar QUALITY_REVIEWER.md (script de QA obrigatorio no sistema).',
          '',
        ].join('\n') : null,
        isResume && doc_type !== 'resume_eb2_niw' ? [
          '',
          '## REGRAS ESPECIFICAS PARA RESUME EB-1A (CRITICO — V2.0 Premium)',
          '- BENCHMARKS: Thiago (61 imgs, 78 tabelas, 54pg) e Andre Cerbasi (37 imgs, 48 tabelas)',
          '- HEADER: Tabela Navy (#2D3E50) 3 rows x 2 colunas — nome + RESUME + EB-1A + SOC.',
          '- FOOTER: Barra Navy com "Page X of Y" em branco, Garamond 9pt.',
          '- MARGENS: 0.65" laterais, 0" topo, 0.5" bottom.',
          '- SECTION HEADERS: Barra Navy full-width com texto branco centralizado, 11pt Bold.',
          '- EVIDENCE BLOCKS: Tabela 2 colunas — metadata ESQUERDA (5760 DXA), thumbnail DIREITA (4320 DXA).',
          '  Thumbnail: NAO tente gerar imagem. SEMPRE coloque o placeholder exato: [THUMBNAIL — Evidencia N]',
          '  onde N eh o numero sequencial. O script insert_thumbnails.py vai substituir depois.',
          '  CADA evidence block DEVE ter um placeholder [THUMBNAIL — Evidencia N] na celula da direita.',
          '  NUNCA usar "Exhibit" no resume — "Exhibit" eh exclusivo de Cover Letter. Usar "Evidencia".',
          '',
          '## ESTRUTURA POR EXPERIENCIA PROFISSIONAL (OBRIGATORIO)',
          '- CADA entrada de experiencia DEVE ter:',
          '  1. Header: Nome do Cargo | Empresa | Periodo',
          '  2. Sub-secao "PRINCIPAIS RESPONSABILIDADES"',
          '  3. Sub-secao "PRINCIPAIS RESULTADOS E IMPACTOS" — com inferencias tecnicas',
          '  4. Evidence blocks com thumbnails',
          '',
          '## SINTESE PROFISSIONAL (500-700 PALAVRAS)',
          '- Narrativa densa em terceira pessoa com inferencias EMBUTIDAS.',
          '- Cada paragrafo: fato + inferencia + nexo.',
          '- FONT: Garamond em TODO o documento. 20pt nome, 11pt secao, 10.5pt corpo, 9pt contact.',
          '- COR: Navy #2D3E50 (NAO preto). Corpo preto. Secundario #333333. Terciario #666666.',
          '- CONCISAO: Description & Impact = minimo 4 linhas por paragrafo.',
          '- BOXES INSTITUCIONAIS: Fundo #F5F5F5, borda #CCCCCC, texto 9.5pt italic #333333.',
          '- PAGE BREAKS: Cada secao principal DEVE comecar em pagina nova.',
          '- Apos gerar: rodar QUALITY_REVIEWER.md (script de QA obrigatorio no sistema).',
          '',
        ].join('\n') : null,
        '',
        '## SISTEMA DE GERACAO',
        `Leia TODOS os arquivos .md em: ${system.system_path}`,
        `Versao: ${system.version_tag} | Modelo recomendado: ${system.recommended_model}`,
        '',
        '## DADOS DO CLIENTE',
        `Pasta de documentos: ${client.docs_folder_path || 'NAO DEFINIDA'}`,
        isResume ? [
          'Leia APENAS os seguintes tipos de documentos do cliente:',
          '- CV / curriculum vitae / timeline',
          '- Diplomas, certificados, cursos',
          '- Artigos, publicacoes, capitulos de livro',
          '- Premiacoes, reconhecimentos',
          '- Cartas de recomendacao / apoio',
          '- Documentos pessoais (passaporte, RG) para dados biograficos',
          '- Evidencias de contribuicao (relatorios, projetos, patentes)',
          '',
          'NUNCA LEIA estes arquivos (pertencem a outras etapas do pipeline):',
          '- Anteprojeto*.md / Anteprojeto*.pdf (etapa de pre-projeto com 3 endeavors — IRRELEVANTE para resume)',
          '- Projeto_Base*.md / Projeto_Base*.pdf (etapa de projeto)',
          '- Business*Plan* / BP_* (etapa de business plan — dados financeiros NAO pertencem ao resume)',
          '- Cover*Letter* / COVER_* (etapa de cover letter)',
          '- Metodologia* / Declaracao* (etapas separadas)',
          '- Qualquer arquivo na subpasta _Forjado por Petition Engine/',
          '- Planilhas financeiras / projecoes de receita',
        ].join('\n') : 'Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.',
        '',
        '## OUTPUT',
        `Crie a pasta se nao existir: ${outputDir}`,
        `Gere o documento .docx final e salve em: ${outputDir}`,
        `Naming: Use SEMPRE o prefixo V[N]_ no nome do arquivo. Verifique na pasta de output qual eh o ultimo V[N] existente e use V[N+1]. Exemplo: se existem V1_resume.docx e V2_resume.docx, salve como V3_resume_${clientSlug}.docx. Se nao existe nenhum, salve como V1_${doc_type}_${clientSlug}.docx. NUNCA salvar sem prefixo V[N]_.`,
        '',
        '## POS-GERACAO: SEPARATION OF CONCERNS',
        'Apos gerar o documento, NAO considere finalizado.',
        'O documento DEVE passar por revisao cruzada em SESSAO LIMPA.',
        `Instrucao: ${SOC_PATH}`,
        generation_instructions ? `\n## INSTRUCOES ESPECIFICAS PARA ESTA GERACAO\n${generation_instructions}\n` : null,
        rulesSection,
      ].filter(Boolean).join('\n');
    }

    writeFileSync(promptPath, prompt, 'utf-8');
  }

  const claudeCommand = `claude -p "Leia ${promptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep`;

  return NextResponse.json({
    data: {
      prompt,
      metadata: {
        system: system.system_name,
        systemName: system.system_name,
        doc_type: system.doc_type,
        client_name: client.name,
        client_id: client.id,
        system_path: system.system_path,
        output_dir: outputDir,
        filesRead: system.file_count,
        recommended_model: system.recommended_model,
        estimatedTokens: system.file_count * 3000,
        instruction_source: instructionSource,
        instruction_path: promptPath,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rulesInjected: readRules().filter((r: any) => r.active && (!r.doc_type || r.doc_type === doc_type)).length,
        pipeline: ['generation', 'separation_of_concerns'],
        soc_enabled: true,
      },
      prompt_path: promptPath,
      prompt_file: promptPath,
      claude_command: claudeCommand,
    },
  });
}
