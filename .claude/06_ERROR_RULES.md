# 06 — SISTEMA DE AUTO-APRENDIZADO & ERROR RULES

## Conceito

Toda vez que Paulo encontra um erro em um documento gerado, esse erro é:

1. **Reportado** via interface (texto livre + localização)
2. **Classificado** pelo Agente Auto-Debugger (via Claude API)
3. **Convertido** em uma `error_rule` no Supabase
4. **Commitado** no GitHub como arquivo JSON (versionamento + rollback)
5. **Aplicado automaticamente** em todas as gerações futuras

Se uma regra causar regressão (piorar documentos), Paulo clica "Rollback" → a regra é desativada no Supabase e um commit de rollback é feito no GitHub.

## Fluxo Completo

```
Paulo encontra erro no DOCX
        │
        ▼
[POST /api/errors/report]
  body: { document_id, error_description, error_location }
        │
        ▼
Auto-Debugger Agent
  1. Lê o texto do documento gerado
  2. Lê o erro descrito pelo Paulo
  3. Chama Claude para classificar:
     - rule_type (forbidden_term, formatting, content, logic, legal, terminology, visual)
     - severity (low, medium, high, critical)
     - rule_action (block, warn, auto_fix)
     - rule_pattern (regex ou texto literal)
     - auto_fix_replacement (se ação for auto_fix)
        │
        ▼
Supabase: INSERT into error_rules
        │
        ▼
GitHub: Commit do arquivo JSON da regra
  path: error-rules/{rule_type}/{id}.json
  message: "fix(error-rules): add {rule_type} rule — {description}"
        │
        ▼
Próxima geração: WriterAgent + QualityAgent
  leem error_rules ativas do Supabase
  e aplicam antes/durante/depois da geração
```

## Classificação de Erros

### Tipos de Regra (`rule_type`)

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `forbidden_term` | Termo/frase que NUNCA deve aparecer | "I believe", "we think", "hopefully" |
| `formatting` | Erro de formatação visual | Título sem negrito, parágrafo desalinhado |
| `content` | Informação incorreta ou inconsistente | Nome do cliente errado, data de formação trocada |
| `logic` | Erro de lógica jurídica | Citar critério EB-1A em petition EB-2 NIW |
| `legal` | Erro de terminologia/procedimento legal | Usar "petition" quando deveria ser "application" |
| `terminology` | Uso de termo inadequado para contexto imigratório | "immigrant" ao invés de "beneficiary" |
| `visual` | Problema com thumbnails, imagens, layout do DOCX | Imagem cortada, resolução baixa |

### Severidade

| Nível | Significado | Ação |
|-------|-------------|------|
| `critical` | Pode causar RFE ou denial | Bloqueia geração |
| `high` | Impacta qualidade significativamente | Bloqueia ou alerta |
| `medium` | Afeta qualidade mas não causa rejeição | Alerta |
| `low` | Cosmético/preferência | Log apenas |

### Ações

| Ação | Comportamento |
|------|---------------|
| `block` | Impede entrega do documento. QualityAgent falha o check. |
| `warn` | Documento é gerado mas com warning no relatório de qualidade. |
| `auto_fix` | Aplica `auto_fix_replacement` automaticamente antes de gerar DOCX. |

## Implementação do Auto-Debugger

```typescript
// src/agents/auto-debugger.ts

import Anthropic from '@anthropic-ai/sdk';
import { SupabaseClient } from '@supabase/supabase-js';

interface ErrorReport {
  document: {
    id: string;
    client_id: string;
    doc_type: string;
    output_file_path: string;
  };
  errorDescription: string;
  errorLocation?: string;
}

interface ClassifiedError {
  rule_type: 'forbidden_term' | 'formatting' | 'content' | 'logic' | 'legal' | 'terminology' | 'visual';
  rule_description: string;
  rule_pattern: string | null;
  rule_action: 'block' | 'warn' | 'auto_fix';
  auto_fix_replacement: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  doc_type: string | null; // null = aplica a todos os tipos
  reasoning: string;
}

export class AutoDebugger {
  private anthropic: Anthropic;
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.anthropic = new Anthropic();
    this.supabase = supabase;
  }

  async processError(report: ErrorReport) {
    // 1. Classificar erro via Claude
    const classification = await this.classifyError(report);

    // 2. Criar regra no Supabase
    const { data: rule } = await this.supabase
      .from('error_rules')
      .insert({
        rule_type: classification.rule_type,
        doc_type: classification.doc_type,
        rule_description: classification.rule_description,
        rule_pattern: classification.rule_pattern,
        rule_action: classification.rule_action,
        auto_fix_replacement: classification.auto_fix_replacement,
        severity: classification.severity,
        source: 'quality_agent',
        active: true,
      })
      .select()
      .single();

    // 3. Commit no GitHub
    const commitSha = await this.commitRule(rule!);

    // 4. Atualizar regra com SHA
    await this.supabase
      .from('error_rules')
      .update({ github_commit_sha: commitSha })
      .eq('id', rule!.id);

    // 5. Log de atividade
    await this.supabase.from('activity_log').insert({
      client_id: report.document.client_id,
      document_id: report.document.id,
      action: 'fix_applied',
      details: {
        rule_id: rule!.id,
        rule_type: classification.rule_type,
        severity: classification.severity,
        commit_sha: commitSha,
      },
    });

    return {
      rule_id: rule!.id,
      classification,
      commit_sha: commitSha,
    };
  }

  private async classifyError(report: ErrorReport): Promise<ClassifiedError> {
    // Ler texto do documento (se disponível)
    let documentText = '';
    try {
      const { runPython } = await import('@/lib/python-runner');
      documentText = await runPython('extract_pdf.py', [report.document.output_file_path]);
    } catch {
      documentText = '[Não foi possível extrair texto do documento]';
    }

    // Buscar regras existentes para evitar duplicatas
    const { data: existingRules } = await this.supabase
      .from('error_rules')
      .select('rule_description, rule_pattern')
      .eq('active', true);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `Você é um classificador de erros em documentos de imigração dos EUA.
Seu trabalho é analisar um erro reportado e criar uma regra automatizada para preveni-lo no futuro.

REGRAS EXISTENTES (não duplicar):
${JSON.stringify(existingRules, null, 2)}

Responda SEMPRE em JSON válido seguindo o schema ClassifiedError.`,
      messages: [{
        role: 'user',
        content: `DOCUMENTO TIPO: ${report.document.doc_type}

TRECHO DO DOCUMENTO:
${documentText.substring(0, 3000)}

ERRO REPORTADO POR PAULO:
"${report.errorDescription}"

LOCALIZAÇÃO DO ERRO: ${report.errorLocation || 'Não especificada'}

Classifique este erro e crie uma regra para preveni-lo. Responda em JSON:
{
  "rule_type": "forbidden_term|formatting|content|logic|legal|terminology|visual",
  "rule_description": "Descrição clara da regra em português",
  "rule_pattern": "regex ou texto literal para detectar o erro (null se não aplicável)",
  "rule_action": "block|warn|auto_fix",
  "auto_fix_replacement": "texto de substituição (null se não for auto_fix)",
  "severity": "low|medium|high|critical",
  "doc_type": "tipo específico ou null para todos",
  "reasoning": "Por que esta classificação"
}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Claude não retornou JSON válido');

    return JSON.parse(jsonMatch[0]);
  }

  private async commitRule(rule: any): Promise<string> {
    const { commitToGitHub } = await import('@/lib/github');

    const filePath = `error-rules/${rule.rule_type}/${rule.id}.json`;
    const content = JSON.stringify(rule, null, 2);
    const message = `fix(error-rules): add ${rule.rule_type} rule — ${rule.rule_description.substring(0, 50)}`;

    return await commitToGitHub(filePath, content, message);
  }

  /**
   * Rollback: desativa regra e commita
   */
  async rollback(ruleId: string) {
    const { data: rule } = await this.supabase
      .from('error_rules')
      .update({ active: false })
      .eq('id', ruleId)
      .select()
      .single();

    if (!rule) throw new Error('Regra não encontrada');

    const { commitToGitHub } = await import('@/lib/github');
    const filePath = `error-rules/${rule.rule_type}/${rule.id}.json`;
    const content = JSON.stringify({ ...rule, active: false }, null, 2);
    const message = `rollback(error-rules): deactivate rule ${rule.id} — ${rule.rule_description.substring(0, 50)}`;

    const commitSha = await commitToGitHub(filePath, content, message);

    await this.supabase.from('activity_log').insert({
      action: 'rollback',
      details: { rule_id: ruleId, commit_sha: commitSha },
    });

    return { rule, commit_sha: commitSha };
  }
}
```

## GitHub Integration

```typescript
// src/lib/github.ts

import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const REPO = process.env.GITHUB_REPO!; // 'paulo1844/petition-engine'
const BRANCH = process.env.GITHUB_BRANCH || 'main';

const [owner, repo] = REPO.split('/');

/**
 * Commita um arquivo no GitHub
 */
export async function commitToGitHub(
  filePath: string,
  content: string,
  message: string
): Promise<string> {
  // 1. Pegar SHA do branch atual
  const { data: ref } = await octokit.rest.git.getRef({
    owner, repo,
    ref: `heads/${BRANCH}`,
  });
  const latestCommitSha = ref.object.sha;

  // 2. Pegar tree do último commit
  const { data: commit } = await octokit.rest.git.getCommit({
    owner, repo,
    commit_sha: latestCommitSha,
  });

  // 3. Criar blob com o conteúdo
  const { data: blob } = await octokit.rest.git.createBlob({
    owner, repo,
    content: Buffer.from(content).toString('base64'),
    encoding: 'base64',
  });

  // 4. Criar nova tree
  const { data: newTree } = await octokit.rest.git.createTree({
    owner, repo,
    base_tree: commit.tree.sha,
    tree: [{
      path: filePath,
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    }],
  });

  // 5. Criar commit
  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner, repo,
    message,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });

  // 6. Atualizar ref do branch
  await octokit.rest.git.updateRef({
    owner, repo,
    ref: `heads/${BRANCH}`,
    sha: newCommit.sha,
  });

  return newCommit.sha;
}

/**
 * Commita regra de erro (atalho)
 */
export async function commitErrorRule(rule: any): Promise<string> {
  const filePath = `error-rules/${rule.rule_type}/${rule.id}.json`;
  const content = JSON.stringify(rule, null, 2);
  const message = `fix(error-rules): add ${rule.rule_type} rule — ${rule.rule_description?.substring(0, 50)}`;
  return commitToGitHub(filePath, content, message);
}

/**
 * Rollback de regra de erro
 */
export async function rollbackErrorRule(rule: any): Promise<string> {
  const filePath = `error-rules/${rule.rule_type}/${rule.id}.json`;
  const content = JSON.stringify({ ...rule, active: false, rolled_back_at: new Date().toISOString() }, null, 2);
  const message = `rollback(error-rules): deactivate ${rule.id} — ${rule.rule_description?.substring(0, 50)}`;
  return commitToGitHub(filePath, content, message);
}
```

## Como o WriterAgent Usa as Regras

No momento de montar o prompt, o WriterAgent busca regras ativas:

```typescript
// Dentro de writer.ts → buildPrompt()

async function getActiveRules(docType: string): Promise<string> {
  const { data: rules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true)
    .or(`doc_type.is.null,doc_type.eq.${docType}`);

  if (!rules || rules.length === 0) return '';

  const blockRules = rules.filter(r => r.rule_action === 'block');
  const warnRules = rules.filter(r => r.rule_action === 'warn');
  const fixRules = rules.filter(r => r.rule_action === 'auto_fix');

  return `
## ⛔ REGRAS OBRIGATÓRIAS (violação = documento rejeitado)

${blockRules.map(r => `- ${r.rule_description}${r.rule_pattern ? ` [Pattern: ${r.rule_pattern}]` : ''}`).join('\n')}

## ⚠️ ALERTAS (evitar quando possível)

${warnRules.map(r => `- ${r.rule_description}`).join('\n')}

## 🔧 AUTO-FIX (aplicados automaticamente)

${fixRules.map(r => `- "${r.rule_pattern}" → "${r.auto_fix_replacement}"`).join('\n')}
`;
}
```

## Como o QualityAgent Valida as Regras

Após a geração, o QualityAgent verifica se alguma regra `block` foi violada:

```typescript
// Dentro de quality.ts → validateRules()

async function validateRules(text: string, docType: string): Promise<RuleViolation[]> {
  const { data: rules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true)
    .in('rule_action', ['block', 'warn'])
    .or(`doc_type.is.null,doc_type.eq.${docType}`);

  const violations: RuleViolation[] = [];

  for (const rule of rules || []) {
    if (rule.rule_pattern) {
      const regex = new RegExp(rule.rule_pattern, 'gi');
      const matches = text.match(regex);

      if (matches && matches.length > 0) {
        violations.push({
          rule_id: rule.id,
          rule_description: rule.rule_description,
          rule_action: rule.rule_action,
          severity: rule.severity,
          matches_found: matches.length,
          sample_matches: matches.slice(0, 3),
        });

        // Incrementar contador de trigger
        await supabase.rpc('increment_rule_trigger', { rule_id: rule.id });
      }
    }
  }

  return violations;
}
```

## Aplicação de Auto-Fix

Antes de gerar o DOCX, o texto passa pelo auto-fixer:

```typescript
// src/lib/auto-fixer.ts

export async function applyAutoFixes(text: string, docType: string, supabase: SupabaseClient): Promise<string> {
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
    console.log(`[AutoFixer] ${appliedFixes.length} fixes aplicados:`, appliedFixes);
  }

  return fixed;
}
```

## Seed: 50 Regras Extraídas dos Pareceres da Qualidade

Extraídas exaustivamente do documento `Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md` — 6 anos de experiência real com erros reais que causam RFEs e denials.

```sql
INSERT INTO error_rules (rule_type, doc_type, rule_description, rule_pattern, rule_action, severity, source) VALUES

  -- ═══════════════════════════════════════════════
  -- CRITICAL (20 regras) — podem causar RFE ou denial
  -- ═══════════════════════════════════════════════

  -- Termos proibidos em petições
  ('forbidden_term', NULL, 'Nunca usar "I believe" em documentos de petição — demonstra subjetividade', 'I believe', 'block', 'critical', 'pareceres_qualidade'),
  ('forbidden_term', NULL, 'Nunca usar "we think" — petição deve ser assertiva', 'we think', 'block', 'critical', 'pareceres_qualidade'),
  ('forbidden_term', NULL, 'Nunca usar "hopefully" — demonstra incerteza ao USCIS', 'hopefully', 'block', 'critical', 'pareceres_qualidade'),

  -- Numeração de evidências
  ('consistency', NULL, 'Número de evidência no texto DEVE bater com numeração do Drive/sumário — divergência causa RFE', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Case number
  ('formatting', NULL, 'Case number NÃO pode aparecer duplicado (ex: "IOE IOE0933936623")', 'IOE\\s+IOE|\\b(\\w+)\\s+\\1\\b', 'block', 'critical', 'pareceres_qualidade'),

  -- Links irrelevantes no footer
  ('content', NULL, 'Footer NÃO pode conter links irrelevantes ao projeto (ex: Wikipedia de Esquadrão da Moda em petição de health tech) — indica falta de revisão', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- RFE criterion compliance
  ('legal', NULL, 'Quando RFE diz que evidência "will NOT be considered" para critério X, resposta NÃO pode argumentar por esse critério', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Cross-references de evidências
  ('consistency', NULL, 'Texto citando "Evidence X" quando a evidência real é outra — cross-reference deve ser exato', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Investimentos inconsistentes entre tabelas
  ('consistency', 'business_plan', 'CAPEX e Working Capital DEVEM ser idênticos em todas as tabelas/páginas do BP', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Datas do résumé vs diploma
  ('legal', 'resume', 'Data de graduação no résumé DEVE bater exatamente com a data do diploma oficial — divergência = Material Misrepresentation (fraud)', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Datas inconsistentes no mesmo documento
  ('consistency', 'resume', 'Mesma credencial NÃO pode ter datas diferentes em páginas diferentes do résumé', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Instructor status
  ('legal', NULL, 'Se projeto afirma que pessoa é "Instructor" (ex: CPI Instructor), résumé DEVE declarar explicitamente status de instrutor', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- 5 empresas full-time
  ('logic', 'resume', 'NÃO pode listar 5+ empresas simultâneas como "Full-time/Integral" — fisicamente impossível. Diferenciar: Executive Oversight, Part-time, Board Member', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Nome da empresa na referência
  ('consistency', 'satellite_letter', 'Nome da empresa DEVE ser idêntico em toda a carta de referência — variações indicam fabricação', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Contador assumindo papel de RH
  ('legal', NULL, 'Declaração de contador NÃO pode assumir papel de RH (operações diárias, horas, performance) — apenas estrutura societária, aspectos contábeis', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- RH: autoridade formal
  ('legal', NULL, 'Contador NÃO pode falar "em nome da empresa" em tom institucional — não tem autoridade formal para atestar performance', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Horas de trabalho em multi-entidades
  ('logic', NULL, 'NÃO pode declarar 44+ horas semanais em múltiplas empresas simultaneamente — clarificar roles reais', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Declaração de RH como fonte primária
  ('legal', NULL, 'Declaração formal de RH de cada empresa DEVE ser evidência primária — carta de contador é apenas suplementar, NUNCA substitui', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Material Misrepresentation
  ('legal', NULL, 'Qualquer divergência de data/credencial entre documentos pode triggerar Material Misrepresentation (fraude) = denial imediato', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- Aprovação do pré-projeto
  ('structural', NULL, 'Projeto NÃO pode começar sem: (1) Pré-Projeto enviado ao cliente, (2) Aprovação escrita recebida, (3) PDF da aprovação no Drive Qualidade', NULL, 'block', 'critical', 'pareceres_qualidade'),

  -- ═══════════════════════════════════════════════
  -- HIGH (22 regras) — impactam qualidade significativamente
  -- ═══════════════════════════════════════════════

  -- Categorização de evidências
  ('logic', NULL, 'Evidência deve ser colocada no critério mais forte (ex: matéria de jornal sobre AstraZeneca = Criterion 3 Media ou C8 Leadership, NÃO C1 Awards)', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Consistência geográfica no BP
  ('content', 'business_plan', 'TODAS as referências geográficas devem alinhar com região declarada (se foco é "Southeast FL/GA/SC", não pode mencionar Michigan)', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Segmento de negócio no BP
  ('consistency', 'business_plan', 'SWOT e descrição do negócio devem refletir o tipo real da empresa (empresa de engenharia civil não pode discutir mercado de segurança eletrônica)', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Billable hours
  ('content', 'business_plan', 'Projeções de horas faturáveis NÃO podem assumir 100% de utilização — usar 65-75% (férias, feriados, prospecção, treinamento)', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Formato de moeda US
  ('formatting', NULL, 'Documentos para mercado US DEVEM usar formato americano: vírgula para milhares, ponto para decimais ($8,957,308.32 NÃO $8.957.308,32)', '\\$[0-9]{1,3}\\.[0-9]{3}\\.[0-9]{3}', 'auto_fix', 'high', 'pareceres_qualidade'),

  -- Contingência para profissionais licensiados
  ('legal', 'business_plan', 'Se BP depende de uma única licença profissional (PE, CPA), DEVE incluir plano de contingência para turnover/indisponibilidade', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Custos de licensing multi-state
  ('content', 'business_plan', 'Expansão multi-state DEVE prever custos e timeline de corporate licensing por estado no cronograma', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Cores no footer do BP
  ('visual', 'business_plan', 'Footer do BP NÃO deve ter cores — cores/elementos visuais reservados apenas para Cover Letter e Resume', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Certificações vencidas
  ('content', 'resume', 'NÃO pode listar certificações como "em progresso" com datas de conclusão passadas — atualizar status', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Timeline visual vs texto
  ('consistency', 'resume', 'Barras de timeline visual DEVEM bater exatamente com datas no texto', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Idioma único no résumé
  ('formatting', 'resume', 'Résumé inteiro DEVE ser em um único idioma (inglês para USCIS) — não misturar footers em português, palavras em espanhol', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Headers de tabela em inglês
  ('formatting', 'resume', 'Headers de tabela do résumé DEVEM ser em inglês (não "Início"/"Término"/"Dedicação" — usar Start Date/End Date/Commitment)', 'Início|Término|Dedicação', 'auto_fix', 'high', 'pareceres_qualidade'),

  -- Resolução de imagem
  ('visual', NULL, 'Screenshots DEVEM ser alta resolução — colar como BITMAP (não formato comprimido). Imagem low-res em revisão física do USCIS = RFE', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Status ativo de associação profissional
  ('legal', 'resume', 'Certificações/associações profissionais DEVEM ter status corrente/ativo — credenciais expiradas precisam de prova de renovação', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Status profissional alinhado com CV
  ('consistency', 'satellite_letter', 'Status profissional na carta (ex: "sócio/partner") DEVE ser substanciado no CV oficial', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Abertura padronizada detectada
  ('consistency', 'satellite_letter', 'Frases de abertura idênticas em múltiplas cartas (ex: "Escrevo esta carta para registrar...") indica template — cada carta DEVE ter voz única', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Fechamento padronizado detectado
  ('consistency', 'satellite_letter', 'Frases de fechamento idênticas em múltiplas cartas ("Coloco-me à disposição...") é indicador forte de template — variar linguagem', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Consistência temporal em cartas
  ('consistency', 'satellite_letter', 'Histórico de carreira na carta deve ser internamente consistente (não pode dizer "mais de 20 anos de carreira" e "jornalista desde 2015")', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Localização correta na assinatura
  ('content', NULL, 'Localização de assinatura de declaração DEVE ser cidade correta (ex: "Alameda Campinas" é rua em São Paulo, não cidade de Campinas)', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Versão atualizada do Projeto Base
  ('structural', NULL, 'Projeto Base atualizado com feedback do cliente DEVE ser uploaded ao Drive — não desenvolver documentos a partir de versões desatualizadas', NULL, 'warn', 'high', 'pareceres_qualidade'),

  -- Datas cross-document
  ('consistency', NULL, 'Mesmas datas de pessoa/evento DEVEM bater em TODOS os documentos: Proposta, Resume, Business Plan, Declarações', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- Narrativa alinhada com evidência real
  ('consistency', NULL, 'Texto descrevendo evidência DEVE alinhar com conteúdo real da evidência — descrição não pode afirmar o que a evidência não contém', NULL, 'block', 'high', 'pareceres_qualidade'),

  -- ═══════════════════════════════════════════════
  -- MEDIUM (5 regras) — afetam qualidade mas não causam rejeição direta
  -- ═══════════════════════════════════════════════

  ('forbidden_term', NULL, 'Não usar "immigrant" — usar "beneficiary" ou "petitioner"', '\\bimmigrant\\b', 'warn', 'medium', 'pareceres_qualidade'),
  ('forbidden_term', NULL, 'Não usar "foreign national" de forma pejorativa', 'foreign national', 'warn', 'medium', 'pareceres_qualidade'),
  ('terminology', NULL, 'Usar "proposed endeavor" (não "proposed venture/project/initiative")', 'proposed (venture|project|initiative)', 'auto_fix', 'medium', 'pareceres_qualidade'),
  ('terminology', NULL, 'Preferir "Certification/Diploma/Credential" sobre "Course" — indica credencial ativa vs. presença passiva', '\\bcourse\\b', 'warn', 'medium', 'pareceres_qualidade'),
  ('formatting', 'resume', 'Corrigir erros ortográficos em termos profissionais: "Superviser" → "Supervisor", "Institucion" → "Institution"', 'Superviser|Institucion', 'auto_fix', 'medium', 'pareceres_qualidade'),

  -- ═══════════════════════════════════════════════
  -- LÓGICA JURÍDICA (regras de cruzamento entre tipos de visto)
  -- ═══════════════════════════════════════════════

  ('logic', 'cover_letter_eb2_niw', 'Não citar critérios de "extraordinary ability" em petição EB-2 NIW — frameworks diferentes', 'extraordinary ability criteria', 'block', 'critical', 'pareceres_qualidade'),
  ('logic', 'cover_letter_eb1a', 'Não citar Dhanasar prongs em petição EB-1A — Dhanasar é exclusivo de NIW', 'Dhanasar|national interest waiver', 'block', 'critical', 'pareceres_qualidade'),
  ('logic', NULL, 'Não confundir "petition" com "application" — termos juridicamente distintos', NULL, 'warn', 'medium', 'pareceres_qualidade'),

  -- Aprovação de SOC code
  ('structural', NULL, 'Código SOC (Standard Occupational Classification) DEVE ter aprovação formal escrita do cliente antes de prosseguir', NULL, 'block', 'critical', 'pareceres_qualidade');
```

> **Fonte:** Extraído exaustivamente do documento `Pareceres da Qualidade - Apontamentos` — compilação de 6 anos de revisões reais de petições de imigração. Cada regra corresponde a um erro real que causou ou poderia causar RFE/denial.
