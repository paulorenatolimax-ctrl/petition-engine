# 03 — OS 5 AGENTES DO ORQUESTRADOR

## Visão Geral

O Petition Engine opera com 5 agentes especializados, chamados sequencialmente pelo orquestrador. Cada agente tem uma responsabilidade única e um conjunto claro de inputs/outputs.

```
ORQUESTRADOR (orchestrator.ts)
  │
  ├─ 1. Agente EXTRATOR (extractor.ts)
  │    Input: pasta de docs do cliente
  │    Output: client_profile no Supabase
  │
  ├─ 2. Agente ESCRITOR (writer.ts)
  │    Input: client_profile + sistema selecionado + error_rules
  │    Output: DOCX gerado no filesystem
  │
  ├─ 3. Agente QUALIDADE (quality.ts)
  │    Input: DOCX gerado + regras do sistema + error_rules
  │    Output: quality_score (pass/fail + detalhes)
  │
  ├─ 4. Agente REVISOR USCIS (uscis-reviewer.ts)
  │    Input: DOCX gerado + tipo de visto + RAGs
  │    Output: risk_score por critério (verde/amarelo/vermelho)
  │
  └─ 5. Agente AUTO-DEBUGGER (auto-debugger.ts)
       Input: descrição do erro + documento
       Output: nova error_rule + commit GitHub
```

---

## orchestrator.ts — Lógica Central

```typescript
// src/lib/orchestrator.ts

import { ExtractorAgent } from '@/agents/extractor';
import { WriterAgent } from '@/agents/writer';
import { QualityAgent } from '@/agents/quality';
import { USCISReviewer } from '@/agents/uscis-reviewer';
import { supabase } from '@/lib/supabase';

interface GenerationRequest {
  clientId: string;
  docType: string;
  docSubtype?: string;
  config?: Record<string, any>;
}

interface GenerationResult {
  documentId: string;
  outputPath: string;
  qualityScore: Record<string, any>;
  qualityPassed: boolean;
  uscisRiskScore: Record<string, any>;
  generationTime: number;
  tokensUsed: number;
  costUsd: number;
}

export async function orchestrate(request: GenerationRequest): Promise<GenerationResult> {
  const startTime = Date.now();

  // 1. Buscar cliente
  const { data: client } = await supabase
    .from('clients')
    .select('*, client_profiles(*)')
    .eq('id', request.clientId)
    .single();

  if (!client) throw new Error('Cliente não encontrado');

  // 2. Verificar/criar profile
  let profile = client.client_profiles;
  if (!profile) {
    profile = await ExtractorAgent.extract(client.docs_folder_path, client.id);
  }

  // 3. Buscar sistema correto
  const systemMap = getSystemForDocType(request.docType);

  // 4. Buscar error_rules ativas
  const { data: errorRules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true)
    .or(`doc_type.is.null,doc_type.eq.${request.docType}`);

  // 5. Calcular próxima versão
  const { data: nextVersion } = await supabase
    .rpc('next_doc_version', { p_client_id: request.clientId, p_doc_type: request.docType });

  // 6. Criar registro do documento (status: generating)
  const { data: doc } = await supabase
    .from('documents')
    .insert({
      client_id: request.clientId,
      doc_type: request.docType,
      doc_subtype: request.docSubtype,
      version: nextVersion,
      status: 'generating',
      system_used: systemMap.name,
      system_path: systemMap.path,
      model_used: systemMap.preferredModel
    })
    .select()
    .single();

  // 7. AGENTE ESCRITOR — gera o documento
  const writeResult = await WriterAgent.generate({
    client,
    profile,
    docType: request.docType,
    docSubtype: request.docSubtype,
    systemPath: systemMap.path,
    systemFiles: systemMap.files,
    errorRules: errorRules || [],
    version: nextVersion,
    model: systemMap.preferredModel
  });

  // 8. Atualizar documento com output
  await supabase
    .from('documents')
    .update({
      status: 'quality_check',
      output_file_path: writeResult.outputPath,
      output_file_size: writeResult.fileSize,
      page_count: writeResult.pageCount,
      tokens_used: writeResult.tokensUsed,
      cost_usd: writeResult.costUsd
    })
    .eq('id', doc.id);

  // 9. AGENTE DE QUALIDADE — valida
  const qualityResult = await QualityAgent.validate({
    docxPath: writeResult.outputPath,
    docType: request.docType,
    systemPath: systemMap.path,
    errorRules: errorRules || [],
    profile
  });

  // 10. AGENTE REVISOR USCIS — avalia risco
  const uscisResult = await USCISReviewer.review({
    docxPath: writeResult.outputPath,
    docType: request.docType,
    visaType: client.visa_type,
    profile
  });

  // 11. Atualizar documento final
  const generationTime = Math.round((Date.now() - startTime) / 1000);

  await supabase
    .from('documents')
    .update({
      status: qualityResult.passed ? 'review_pending' : 'error',
      quality_score: qualityResult.score,
      quality_passed: qualityResult.passed,
      quality_notes: qualityResult.notes,
      uscis_risk_score: uscisResult.riskScore,
      generation_time_seconds: generationTime
    })
    .eq('id', doc.id);

  // 12. Log de atividade
  await supabase.from('activity_log').insert({
    client_id: request.clientId,
    document_id: doc.id,
    action: qualityResult.passed ? 'quality_passed' : 'quality_failed',
    details: { quality: qualityResult.score, uscis: uscisResult.riskScore }
  });

  return {
    documentId: doc.id,
    outputPath: writeResult.outputPath,
    qualityScore: qualityResult.score,
    qualityPassed: qualityResult.passed,
    uscisRiskScore: uscisResult.riskScore,
    generationTime,
    tokensUsed: writeResult.tokensUsed,
    costUsd: writeResult.costUsd
  };
}

// Mapa de qual sistema usar para cada doc_type
function getSystemForDocType(docType: string) {
  const map: Record<string, { name: string; path: string; files: string[]; preferredModel: string }> = {
    'resume': {
      name: 'EB1A_RESUME_SYSTEM',
      path: 'systems/resume_eb1a',
      files: ['ARCHITECT_RESUME_EB1.md', 'SISTEMA_RESUME_EB1A.md', 'TEMPLATE_RESUME.md',
              'FORMATTING_SPEC_RESUME.md', 'FORBIDDEN_CONTENT_RESUME.md', 'QUALITY_GATES_RESUME.md',
              'PROTOCOLO_INTERACAO_RESUME.md', 'MAPA_DE_ERROS.md'],
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'cover_letter_eb1a': {
      name: 'EB1A_SYSTEM_v5',
      path: 'systems/cover_letter_eb1a',
      files: ['PROTOCOLO_DE_INTERACAO.md'], // v5 tem arquivos próprios — ler todos do diretório
      preferredModel: process.env.OPUS_MODEL!
    },
    'cover_letter_eb2_niw': {
      name: 'CONSTRUTOR_EB2_NIW_v3',
      path: 'systems/cover_letter_eb2_niw',
      files: ['README_NIW_v3.md', 'ARCHITECT_COVER_LETTER_EB2_NIW_v3.md', 'SISTEMA_COVER_LETTER_EB2_NIW_v3.md',
              'DOCX_PRODUCTION_PIPELINE_NIW.md', 'FORMATTING_SPEC_NIW.md', 'FORBIDDEN_CONTENT_NIW.md',
              'LEGAL_FRAMEWORK_NIW_2026.md', 'QUALITY_GATES_NIW.md', 'EVIDENCE_NAMING_CONVENTION_NIW.md',
              'LICOES_TECNICAS_ANDREA.md', 'QUALITY_AGENT.md', 'RESEARCH_AGENT.md',
              'TEMPLATE_ELIGIBILITY.md', 'TEMPLATE_PRONG1.md', 'TEMPLATE_PRONG2.md', 'TEMPLATE_PRONG3.md',
              'CHECKLIST_PRE_PRODUCAO_NIW.md'],
      preferredModel: process.env.OPUS_MODEL!
    },
    'business_plan': {
      name: 'BP_SETUP_GUIDE_2',
      path: 'systems/business_plan',
      files: ['CLAUDE.md', 'SETUP_GUIDE.md'],
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'methodology': {
      name: 'Metodologia_v2.1',
      path: 'systems/methodology',
      files: [], // ler todos os .md do diretório (P0-P4 + ajustes)
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'declaration_of_intentions': {
      name: 'Declaracao_v2.1',
      path: 'systems/declaration',
      files: [], // ler todos os .md do diretório (P0-P5)
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'impacto_report': {
      name: 'IMPACTO_6_Agents',
      path: 'systems/impacto',
      files: ['AGENT_MASTER.md', 'AGENT_01_INTAKE.md', 'AGENT_02_RESEARCH.md',
              'AGENT_03_CALCULATOR.md', 'AGENT_04_BUILDER.md', 'AGENT_05_QA.md'],
      preferredModel: process.env.OPUS_MODEL!
    },
    'strategy_eb2': {
      name: 'Estrategia_EB2_9Prompts',
      path: 'systems/strategy_eb2',
      files: [], // 9 prompts sequenciais — ler em ordem numérica
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'strategy_eb1': {
      name: 'Assistente_EB1A',
      path: 'systems/strategy_eb1',
      files: [],
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'location_analysis': {
      name: 'Localizacao',
      path: 'systems/location',
      files: [],
      preferredModel: 'gemini-deep-research' // usa Gemini para pesquisa + Claude para formato
    },
    'anteprojeto': {
      name: 'Anteprojeto',
      path: 'systems/anteprojeto',
      files: [],
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'satellite_letter': {
      name: 'Cartas_Satelite',
      path: 'systems/satellite_letters',
      files: [],
      preferredModel: process.env.DEFAULT_MODEL!
    },
    'rfe_response': {
      name: 'RFE_Response',
      path: 'systems/rfe_response',
      files: [],
      preferredModel: process.env.OPUS_MODEL!
    }
  };

  const system = map[docType];
  if (!system) throw new Error(`Sistema não encontrado para doc_type: ${docType}`);
  return system;
}
```

---

## Agente Extrator (extractor.ts)

```typescript
// src/agents/extractor.ts

import { runPython } from '@/lib/python-runner';
import { callClaude } from '@/lib/anthropic';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export class ExtractorAgent {
  static async extract(folderPath: string, clientId: string) {

    // 1. Inventariar arquivos da pasta
    const files = fs.readdirSync(folderPath, { recursive: true }) as string[];
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    const docxFiles = files.filter(f => f.toLowerCase().endsWith('.docx'));
    const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

    // 2. Extrair texto dos PDFs via Python
    let allText = '';
    for (const pdf of pdfFiles) {
      const fullPath = path.join(folderPath, pdf);
      const text = await runPython('extract_pdf.py', [fullPath]);
      allText += `\n\n=== ${pdf} ===\n${text}`;
    }

    // 3. Extrair texto dos DOCX via Python
    for (const docx of docxFiles) {
      const fullPath = path.join(folderPath, docx);
      const text = await runPython('extract_docx.py', [fullPath]);
      allText += `\n\n=== ${docx} ===\n${text}`;
    }

    // 4. Inventariar imagens como evidências
    const evidenceInventory = imageFiles.map((img, i) => ({
      number: i + 1,
      type: 'image',
      file_path: path.join(folderPath, img),
      description: img.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
    }));

    // Adicionar PDFs como evidências também
    pdfFiles.forEach((pdf, i) => {
      if (pdf.toLowerCase().includes('evidence')) {
        evidenceInventory.push({
          number: evidenceInventory.length + 1,
          type: 'pdf',
          file_path: path.join(folderPath, pdf),
          description: pdf.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        });
      }
    });

    // 5. Enviar ao Claude para extração estruturada
    const extractionPrompt = `Você é um agente extrator de dados para petições de imigração.

Analise o texto abaixo, extraído dos documentos de um cliente, e retorne um JSON com:

{
  "full_name": "nome completo",
  "nationality": "nacionalidade",
  "date_of_birth": "YYYY-MM-DD ou null",
  "current_visa_status": "status atual",
  "education": [{"degree": "", "institution": "", "year": 0, "country": "", "field": ""}],
  "work_experience": [{"company": "", "title": "", "start_date": "", "end_date": "", "country": "", "description": ""}],
  "total_years_experience": 0,
  "publications": [{"title": "", "journal": "", "date": "", "citations": 0}],
  "media_coverage": [{"outlet": "", "title": "", "date": ""}],
  "awards": [{"name": "", "granting_body": "", "date": "", "significance": ""}],
  "financial_data": {"revenue_projections": [], "investment": 0, "npv": 0, "irr": 0},
  "satellite_letters_needed": [{"type": "investor_pj|investor_pf|current_client_pj|current_client_pf|potential_client_pj|potential_client_pf|strategic_partner|volunteer|recommendation|support|expert_opinion", "status": "needed"}]
}

Retorne APENAS o JSON, sem markdown, sem explicação.

TEXTO EXTRAÍDO:
${allText.substring(0, 100000)}`; // Limitar a 100K chars para caber no contexto

    const result = await callClaude(extractionPrompt, process.env.DEFAULT_MODEL!);

    // 6. Parsear e salvar no Supabase
    const profileData = JSON.parse(result);
    profileData.evidence_inventory = evidenceInventory;
    profileData.total_evidence_count = evidenceInventory.length;
    profileData.raw_extracted_text = allText.substring(0, 500000); // guardar até 500K

    const { data: profile } = await supabase
      .from('client_profiles')
      .upsert({
        client_id: clientId,
        ...profileData,
        extracted_at: new Date().toISOString()
      })
      .select()
      .single();

    return profile;
  }
}
```

---

## Agente Escritor (writer.ts)

```typescript
// src/agents/writer.ts

import { callClaude } from '@/lib/anthropic';
import { callGeminiDeepResearch } from '@/lib/gemini';
import { runPython } from '@/lib/python-runner';
import { readSystemFiles } from '@/lib/file-reader';
import fs from 'fs';
import path from 'path';

interface WriteRequest {
  client: any;
  profile: any;
  docType: string;
  docSubtype?: string;
  systemPath: string;
  systemFiles: string[];
  errorRules: any[];
  version: number;
  model: string;
}

export class WriterAgent {
  static async generate(request: WriteRequest) {

    // 1. Ler todos os arquivos .md do sistema
    const systemInstructions = await readSystemFiles(request.systemPath, request.systemFiles);

    // 2. Montar error_rules como instruções adicionais
    const errorRulesText = request.errorRules
      .map(r => `[${r.severity.toUpperCase()}] ${r.rule_description}${r.rule_pattern ? ` (padrão: ${r.rule_pattern})` : ''}`)
      .join('\n');

    // 3. Montar client profile como contexto
    const profileContext = JSON.stringify(request.profile, null, 2);

    // 4. Para LOCALIZAÇÃO: usar Gemini DeepResearch primeiro
    let researchData = '';
    if (request.docType === 'location_analysis') {
      researchData = await callGeminiDeepResearch(
        request.client.location_city,
        request.client.location_state,
        request.client.proposed_endeavor,
        request.client.naics_code
      );
    }

    // 5. Montar prompt final
    const prompt = `${systemInstructions}

=== DADOS DO CLIENTE ===
${profileContext}

=== REGRAS DE ERRO ACUMULADAS (OBEDEÇA TODAS) ===
${errorRulesText || 'Nenhuma regra adicional.'}

${researchData ? `=== DADOS DE PESQUISA (GEMINI DEEPRESEARCH) ===\n${researchData}` : ''}

=== INSTRUÇÃO ===
Gere o documento completo para ${request.client.name}.
SOC: ${request.client.soc_code} — ${request.client.soc_title}
Tipo de visto: ${request.client.visa_type}
Endeavor: ${request.client.proposed_endeavor}
Empresa: ${request.client.company_name}
Localização: ${request.client.location_city}, ${request.client.location_state}

Siga RIGOROSAMENTE as instruções do sistema. O output deve ser o texto completo do documento, formatado conforme especificado.`;

    // 6. Chamar Claude API
    const content = await callClaude(prompt, request.model);

    // 7. Gerar DOCX via Python
    const clientOutputDir = path.join(
      process.env.LOCAL_OUTPUTS_BASE!,
      request.client.name.replace(/\s+/g, '_')
    );
    fs.mkdirSync(clientOutputDir, { recursive: true });

    const filename = `VF_${request.docType.toUpperCase()}_${request.client.name.replace(/\s+/g, '_')}_v${request.version}.docx`;
    const outputPath = path.join(clientOutputDir, filename);

    // Salvar conteúdo temporário para Python processar
    const tempContentPath = path.join(clientOutputDir, `_temp_content_${Date.now()}.md`);
    fs.writeFileSync(tempContentPath, content);

    // Gerar DOCX
    await runPython('generate_docx.py', [
      tempContentPath,
      outputPath,
      request.docType,
      request.client.docs_folder_path // para thumbnails
    ]);

    // Limpar temp
    fs.unlinkSync(tempContentPath);

    // 8. Calcular métricas
    const stats = fs.statSync(outputPath);

    return {
      outputPath,
      fileSize: stats.size,
      pageCount: 0, // será calculado pelo Python
      tokensUsed: content.length / 4, // estimativa
      costUsd: 0 // calcular baseado no modelo
    };
  }
}
```

---

## Agente de Qualidade (quality.ts)

```typescript
// src/agents/quality.ts

import { runPython } from '@/lib/python-runner';
import { readSystemFiles } from '@/lib/file-reader';
import { supabase } from '@/lib/supabase';

interface QualityRequest {
  docxPath: string;
  docType: string;
  systemPath: string;
  errorRules: any[];
  profile: any;
}

export class QualityAgent {
  static async validate(request: QualityRequest) {

    // 1. Extrair texto do DOCX gerado
    const docText = await runPython('extract_docx.py', [request.docxPath]);

    // 2. Ler FORBIDDEN_CONTENT e QUALITY_GATES do sistema
    const forbiddenFile = await readSystemFiles(request.systemPath, ['FORBIDDEN_CONTENT*.md']);
    const qualityGatesFile = await readSystemFiles(request.systemPath, ['QUALITY_GATES*.md']);

    // 3. Rodar quality_scanner.py (validação automatizada)
    const scanResult = await runPython('quality_scanner.py', [
      request.docxPath,
      request.docType,
      JSON.stringify(request.errorRules.map(r => r.rule_pattern).filter(Boolean))
    ]);

    const scanData = JSON.parse(scanResult);

    // 4. Verificar consistência com profile
    const consistencyErrors: string[] = [];
    if (request.profile.full_name && !docText.includes(request.profile.full_name)) {
      consistencyErrors.push(`Nome "${request.profile.full_name}" não encontrado no documento`);
    }

    // 5. Incrementar times_triggered para regras que matcharam
    for (const triggeredRule of scanData.triggered_rules || []) {
      await supabase.rpc('increment_rule_trigger', { rule_id: triggeredRule });
    }

    // 6. Calcular score
    const totalViolations = (scanData.forbidden_terms_found || 0)
      + (scanData.char_limit_violations || 0)
      + (scanData.formatting_issues || 0)
      + consistencyErrors.length;

    const score = {
      forbidden_terms: scanData.forbidden_terms_found || 0,
      char_limit_violations: scanData.char_limit_violations || 0,
      formatting_issues: scanData.formatting_issues || 0,
      consistency_errors: consistencyErrors.length,
      total_violations: totalViolations,
      details: scanData.details || [],
      consistency_details: consistencyErrors
    };

    const passed = totalViolations === 0;
    const notes = passed
      ? 'Todas as validações passaram.'
      : `${totalViolations} violação(ões) encontrada(s). Detalhes no quality_score.`;

    return { score, passed, notes };
  }
}
```

---

## Agente Revisor USCIS (uscis-reviewer.ts)

```typescript
// src/agents/uscis-reviewer.ts

import { callClaude } from '@/lib/anthropic';
import { runPython } from '@/lib/python-runner';

interface ReviewRequest {
  docxPath: string;
  docType: string;
  visaType: string;
  profile: any;
}

export class USCISReviewer {
  static async review(request: ReviewRequest) {

    // 1. Extrair texto do DOCX
    const docText = await runPython('extract_docx.py', [request.docxPath]);

    // 2. Montar prompt de revisão USCIS
    const prompt = `Você é um oficial adjudicador da USCIS (U.S. Citizenship and Immigration Services).

Você está revisando uma petição de imigração do tipo ${request.visaType}.

${request.visaType === 'EB-1A' ? `
CRITÉRIOS EB-1A (avalie cada um):
C1: Awards/Prizes of national or international recognition
C2: Membership in associations requiring outstanding achievement
C3: Published material about the beneficiary
C4: Judging the work of others
C5: Original contributions of major significance
C6: Scholarly articles
C7: Exhibition of work
C8: Leading or critical role in distinguished organizations
C9: High salary or remuneration
C10: Commercial success in the performing arts

Use o Kazarian 2-step analysis:
- Step 1: O critério é satisfeito pela evidência apresentada?
- Step 2: A totalidade das evidências demonstra sustained national/international acclaim?
` : ''}

${request.visaType === 'EB-2-NIW' ? `
PILARES DHANASAR (avalie cada um):
Prong 1: O proposed endeavor tem mérito substancial e importância nacional?
Prong 2: O peticionário está bem posicionado para avançar o endeavor?
Prong 3: No balanço, seria benéfico para os EUA dispensar o requisito de oferta de emprego?

Avalie a força de cada pilar baseado nas evidências apresentadas.
` : ''}

${request.visaType === 'O-1' ? `
CRITÉRIOS O-1 (avalie cada um):
1. Awards/prizes of national or international significance
2. Membership in associations requiring outstanding achievement
3. Published material about the beneficiary
4. Judging the work of others
5. Original contributions of major significance
6. Scholarly articles in professional journals
7. Employment in a critical or essential capacity
8. High salary or remuneration
` : ''}

Para cada critério/pilar, classifique como:
- 🟢 VERDE: Forte, evidência convincente, improvável gerar RFE
- 🟡 AMARELO: Adequado mas poderia ser reforçado, risco moderado de RFE
- 🔴 VERMELHO: Fraco, alta probabilidade de RFE, precisa de mais evidência

Também identifique:
- Argumentos que um oficial cético questionaria
- Evidências faltantes ou insuficientes
- Inconsistências lógicas
- Claims sem suporte factual

Retorne um JSON:
{
  "overall_risk": "green|yellow|red",
  "criteria": {
    "C1": {"risk": "green|yellow|red", "assessment": "...", "suggestions": "..."},
    ...
  },
  "rfe_likely_topics": ["..."],
  "strengths": ["..."],
  "weaknesses": ["..."]
}

DOCUMENTO PARA REVISÃO:
${docText.substring(0, 100000)}`;

    const result = await callClaude(prompt, process.env.OPUS_MODEL!);

    const riskScore = JSON.parse(result);

    return { riskScore };
  }
}
```

---

## Agente Auto-Debugger (auto-debugger.ts)

```typescript
// src/agents/auto-debugger.ts

import { callClaude } from '@/lib/anthropic';
import { supabase } from '@/lib/supabase';
import { commitToGitHub } from '@/lib/github';

interface ErrorReport {
  documentId: string;
  docType: string;
  errorDescription: string;
  errorLocation?: string; // "página 15, parágrafo 3"
}

export class AutoDebugger {
  static async processError(report: ErrorReport) {

    // 1. Classificar o erro via Claude
    const classificationPrompt = `Classifique este erro encontrado num documento de imigração:

Tipo de documento: ${report.docType}
Descrição do erro: ${report.errorDescription}
${report.errorLocation ? `Localização: ${report.errorLocation}` : ''}

Retorne um JSON:
{
  "rule_type": "forbidden_term|formatting|content|logic|legal|terminology|visual",
  "severity": "low|medium|high|critical",
  "rule_description": "descrição clara da regra para prevenir este erro no futuro",
  "rule_pattern": "padrão regex ou texto literal para detectar o erro (se aplicável, senão null)",
  "rule_action": "block|warn|auto_fix",
  "auto_fix_replacement": "texto de substituição se action=auto_fix, senão null"
}

Retorne APENAS o JSON.`;

    const result = await callClaude(classificationPrompt, process.env.DEFAULT_MODEL!);
    const rule = JSON.parse(result);

    // 2. Inserir regra no Supabase
    const { data: newRule } = await supabase
      .from('error_rules')
      .insert({
        ...rule,
        doc_type: report.docType === 'all' ? null : report.docType,
        source: 'paulo_feedback',
        active: true
      })
      .select()
      .single();

    // 3. Commit no GitHub
    const commitMessage = `fix(${report.docType}): ${rule.rule_description}\n\nError rule ID: ${newRule?.id}\nSeverity: ${rule.severity}\nType: ${rule.rule_type}`;

    const commitSha = await commitToGitHub(
      `error_rules/${newRule?.id}.json`,
      JSON.stringify(rule, null, 2),
      commitMessage
    );

    // 4. Atualizar regra com SHA do commit
    if (commitSha && newRule) {
      await supabase
        .from('error_rules')
        .update({ github_commit_sha: commitSha })
        .eq('id', newRule.id);
    }

    // 5. Log de atividade
    await supabase.from('activity_log').insert({
      document_id: report.documentId,
      action: 'fix_applied',
      details: { rule_id: newRule?.id, commit_sha: commitSha, rule }
    });

    return { ruleId: newRule?.id, commitSha, rule };
  }

  static async rollback(ruleId: string) {
    // 1. Buscar regra
    const { data: rule } = await supabase
      .from('error_rules')
      .select('*')
      .eq('id', ruleId)
      .single();

    if (!rule?.github_commit_sha) throw new Error('Sem commit para reverter');

    // 2. Reverter no GitHub
    // Nota: git revert via Octokit API
    // Na prática, desativamos a regra no Supabase (mais seguro que revert)
    await supabase
      .from('error_rules')
      .update({ active: false })
      .eq('id', ruleId);

    return { reverted: true };
  }
}
```
