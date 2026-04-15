/**
 * Rules Repository — Single source of truth for error rules.
 *
 * Applies the Repository pattern (Sandeco, Ch. 4.6):
 * Business logic accesses rules through this abstraction,
 * never directly reading the JSON file.
 *
 * If storage changes (JSON → database), only this file changes.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const RULES_FILE = path.join(process.cwd(), 'data', 'error_rules.json');

export interface ErrorRule {
  id: string;
  rule_type: string;
  doc_type: string | null;
  rule_description: string;
  rule_pattern: string | null;
  rule_action: 'block' | 'auto_fix' | 'warn';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  active: boolean;
  times_triggered: number;
  created_at: string;
}

/**
 * Read all rules from storage.
 */
export function readAllRules(): ErrorRule[] {
  try {
    if (!existsSync(RULES_FILE)) return [];
    return JSON.parse(readFileSync(RULES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

/**
 * Read only active rules.
 */
export function readActiveRules(): ErrorRule[] {
  return readAllRules().filter(r => r.active);
}

/**
 * Read rules applicable to a specific document type.
 * Returns global rules (doc_type = null) + doc-type-specific rules.
 */
export function readRulesForDocType(docType: string): ErrorRule[] {
  const active = readActiveRules();
  const global = active.filter(r => !r.doc_type);
  const specific = active.filter(r => r.doc_type === docType);
  return [...global, ...specific];
}

/**
 * Build the rules section to inject into generation prompts.
 * This is the formatted text that claude -p receives.
 */
export function buildRulesSection(docType: string): string {
  const rules = readRulesForDocType(docType);

  const globalCount = rules.filter(r => !r.doc_type).length;
  const specificCount = rules.filter(r => r.doc_type === docType).length;

  const lines: string[] = [
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

  if (rules.length > 0) {
    lines.push('## REGRAS DE ERRO ATIVAS (AUTO-LEARNING)');
    lines.push(`Total: ${rules.length} regras (${globalCount} globais + ${specificCount} especificas para ${docType})`);
    lines.push('RESPEITE TODAS. Violacao de regra BLOCK = rejeicao automatica.');
    lines.push('');
    for (const r of rules) {
      const prefix = r.rule_action === 'block' ? 'BLOCK' : r.rule_action === 'auto_fix' ? 'AUTO-FIX' : 'WARN';
      lines.push(`- [${r.severity.toUpperCase()}/${prefix}] ${r.rule_description}${r.rule_pattern ? ` (regex: ${r.rule_pattern})` : ''}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Increment the times_triggered counter for a rule.
 */
export function incrementTrigger(ruleId: string): void {
  try {
    const rules = readAllRules();
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      rule.times_triggered = (rule.times_triggered || 0) + 1;
      writeFileSync(RULES_FILE, JSON.stringify(rules, null, 2), 'utf-8');
    }
  } catch {
    // Silent fail — don't break generation for a counter update
  }
}
