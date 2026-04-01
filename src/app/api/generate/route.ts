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

function readRules(): any[] {
  try { return JSON.parse(readFileSync(RULES_FILE, 'utf-8')); }
  catch { return []; }
}

function buildRulesSection(docType: string): string {
  const rules = readRules().filter((r: any) => r.active);
  const global = rules.filter((r: any) => !r.doc_type);
  const specific = rules.filter((r: any) => r.doc_type === docType);
  const all = [...global, ...specific];

  const lines = [
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
};

const RAGS_EB1 = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-1/';
const RAGS_EB2 = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs/';
const BENCHMARK_THAYSE = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/LILIAN/Thayse/';
const BENCHMARK_THIAGO = '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Thiago Fernandes dos Santos (EB-1)/';

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
    '- 100% em PORTUGUES. Nunca misturar ingles com portugues.',
    '- NUNCA usar a palavra "PROMPT" no output. E termo interno.',
    '- NUNCA mencionar PROEX, Kortix, nomes de outros clientes.',
    '- NUNCA usar codigos SOC que exigem validacao de diploma nos EUA (advogado 23-1011, medico 29-1069, engenheiro 17-201X, contador 13-2011). Usar alternativas.',
    '- NUNCA propor endeavors genericos como "consultoria" ou "assessoria". USCIS tende a negar.',
    '- Verificar compatibilidade educacional do codigo SOC com formacao do peticionario.',
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
    lines.push(`Endeavor escolhido: ${selectedEndeavor || '[NAO SELECIONADO — PERGUNTAR AO PAULO]'}`);
    lines.push(`Codigo SOC escolhido: ${selectedSocCode || '[NAO SELECIONADO — PERGUNTAR AO PAULO]'}`);
    lines.push('Execute TODOS os prompts do sistema (1-9 para EB-2 ou 1-4 para EB-1) focando EXCLUSIVAMENTE neste endeavor.');
  } else {
    lines.push('');
    lines.push('## MODO ANTEPROJETO (EXECUCAO PARCIAL)');
    if (!isEB1) {
      lines.push('Execute APENAS os prompts 1-3 do sistema EB-2 NIW.');
      lines.push('O output deve conter:');
      lines.push('1. Quadro-resumo comparativo com 3 endeavors distintos');
      lines.push('2. Para cada endeavor: descricao tecnica, publico-alvo, modelo de receita, projecao Y1/Y2');
      lines.push('3. 3 codigos SOC/BLS para cada endeavor (com validacao de compatibilidade educacional)');
      lines.push('4. Analise de risco de negacao pelo USCIS para cada endeavor');
      lines.push('5. Alinhamento com politicas federais');
    } else {
      lines.push('Execute APENAS os prompts 1-3 do sistema EB-1A (Kortix).');
      lines.push('O output deve conter:');
      lines.push('1. Mapeamento completo do perfil (10 categorias)');
      lines.push('2. Analise detalhada dos 10 criterios EB-1A (forca: ROBUSTA/PROMISSORA/EM DESENVOLVIMENTO)');
      lines.push('3. 3 codigos SOC/BLS alternativos com validacao');
      lines.push('4. Quadro-resumo com endeavor proposto e criterios mais fortes');
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
  const client = clients.find((c: any) => c.id === client_id);
  if (!client) {
    return NextResponse.json({ error: `Cliente ${client_id} nao encontrado` }, { status: 404 });
  }

  const systems = readJson(SYSTEMS_FILE);
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
        '## REGRAS ABSOLUTAS',
        '- Leia TODOS os arquivos de sistema ANTES de gerar conteudo.',
        '- NAO invente dados. Use APENAS informacoes do perfil e documentos do cliente.',
        '- Cada afirmacao deve ter evidencia. Sem linguagem generica.',
        '- 100% em INGLES para documentos USCIS.',
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
        isResume ? [
          '',
          '## REGRAS ESPECIFICAS PARA RESUME (CRITICO — V2.0 Premium)',
          '- BENCHMARKS: Thiago (61 imgs, 78 tabelas, 54pg) e Andre Cerbasi (37 imgs, 48 tabelas)',
          '- HEADER: Tabela Navy (#2D4F5F) 1x2 colunas — nome esquerda, contato direita. TODAS as paginas.',
          '- FOOTER: "Page X of Y" alinhado direita, Arial 9pt cinza #666666. SEM barra navy no footer.',
          '- MARGENS: 0.59" laterais, ~0.4" topo. NAO 1" padrao. Margens estreitas = visual premium.',
          '- SECTION HEADERS: Barra Navy full-width com texto branco centralizado, 11pt Bold.',
          '- EVIDENCE BLOCKS: Tabela 2 colunas — metadata ESQUERDA (5797 DXA), thumbnail DIREITA (4743 DXA).',
          '  Thumbnail da 1a pagina do PDF de evidencia. Gerar com PyMuPDF/fitz.',
          '  Se PDF nao encontrado: placeholder "[THUMBNAIL — Evidence X]" em italico cinza.',
          '- FONT: Arial em TODO o documento. 14pt nome, 11pt secao, 10pt corpo, 9pt contact.',
          '- COR: Titulos Navy #2D4F5F (NAO preto). Corpo preto. Secundario #333333. Terciario #666666.',
          '- CONCISAO: Max 18K chars. Description & Impact = 2-3 paragrafos MAX.',
          '- BOXES INSTITUCIONAIS: Fundo #F5F5F5, borda #CCCCCC, texto 9.5pt italic #333333.',
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
        'Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.',
        '',
        '## OUTPUT',
        `Crie a pasta se nao existir: ${outputDir}`,
        `Gere o documento .docx final e salve em: ${outputDir}`,
        `Naming: ${doc_type}_${clientSlug}.docx`,
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
