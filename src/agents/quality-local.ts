/**
 * Quality Agent — Local Version (reads from data/error_rules.json)
 * Runs ALL checks: error_rules + CoT detection + orphan headings + broken lines + structural validation
 * Returns: score, passed, violations[], autoFixes[]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const RULES_PATH = path.join(process.cwd(), 'data', 'error_rules.json');

interface QualityInput {
  documentText: string;
  docType: string;
  clientName: string;
}

interface Violation {
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  match: string;
  location: string;
  autoFixable: boolean;
}

interface AutoFix {
  description: string;
  pattern: string;
  replacement: string;
  count: number;
}

interface QualityResult {
  score: number;
  passed: boolean;
  violations: Violation[];
  autoFixes: AutoFix[];
  warnings: string[];
  cleanedText: string; // Text after auto-fixes applied
  notes: string;
}

// Chain-of-thought patterns that should NEVER appear in output
const COT_PATTERNS = [
  /Vou estruturar.*/gi,
  /Agora vou redigir.*/gi,
  /Vou redigir.*/gi,
  /Vou elaborar.*/gi,
  /Vou pesquisar.*/gi,
  /Vou apresentar.*/gi,
  /Contagem de palavras.*/gi,
  /Com base nos dados.*redigir.*/gi,
  /Excelente\.?\s*Tenho dados.*/gi,
  /anti-alucinação absoluta.*/gi,
  /seção de prosa,?\s*dados verificados.*/gi,
  /respeitando rigorosamente.*/gi,
  /português brasileiro 100%.*/gi,
  /com base nas informações pesquisadas.*/gi,
  /em português brasileiro.*com rigor.*/gi,
  /— — — —/g,
];

// Orphan headings that shouldn't appear standalone
const ORPHAN_HEADINGS = [
  /^Introdução$/i,
  /^Conclusão$/i,
  /^Mapa Perceptual$/i,
  /^#{1,3}\s+/,  // Markdown headings leaking
];

function readRules(): any[] {
  try {
    return JSON.parse(readFileSync(RULES_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function updateRuleTrigger(ruleId: string): void {
  try {
    const rules = readRules();
    const rule = rules.find((r: any) => r.id === ruleId);
    if (rule) {
      rule.times_triggered = (rule.times_triggered || 0) + 1;
      writeFileSync(RULES_PATH, JSON.stringify(rules, null, 2));
    }
  } catch {}
}

export async function runQualityLocal(input: QualityInput): Promise<QualityResult> {
  const violations: Violation[] = [];
  const autoFixes: AutoFix[] = [];
  const warnings: string[] = [];
  let cleanedText = input.documentText;

  // ============================================================
  // 1. ERROR RULES CHECK (from error_rules.json)
  // ============================================================
  const allRules = readRules().filter((r: any) => r.active);
  const applicableRules = allRules.filter((r: any) =>
    !r.doc_type || r.doc_type === input.docType
  );

  for (const rule of applicableRules) {
    if (rule.rule_pattern) {
      try {
        const regex = new RegExp(rule.rule_pattern, 'gi');
        const matches = cleanedText.match(regex);
        if (matches) {
          violations.push({
            rule: rule.rule_description,
            severity: rule.severity,
            match: matches.slice(0, 3).join(', '),
            location: `${matches.length} ocorrencia(s)`,
            autoFixable: rule.rule_action === 'auto_fix' && !!rule.auto_fix_replacement,
          });

          // Auto-fix if configured
          if (rule.rule_action === 'auto_fix' && rule.auto_fix_replacement) {
            const before = cleanedText;
            cleanedText = cleanedText.replace(regex, rule.auto_fix_replacement);
            const fixCount = (before.length - cleanedText.length) > 0 ? matches.length : 0;
            if (fixCount > 0) {
              autoFixes.push({
                description: rule.rule_description,
                pattern: rule.rule_pattern,
                replacement: rule.auto_fix_replacement,
                count: fixCount,
              });
            }
          }

          updateRuleTrigger(rule.id);
        }
      } catch {}
    }
  }

  // ============================================================
  // 2. COT DETECTION (chain-of-thought leaking)
  // ============================================================
  for (const pattern of COT_PATTERNS) {
    const matches = cleanedText.match(pattern);
    if (matches) {
      violations.push({
        rule: 'Chain-of-thought vazando no documento',
        severity: 'critical',
        match: matches[0].substring(0, 80),
        location: `${matches.length} ocorrencia(s)`,
        autoFixable: true,
      });
      cleanedText = cleanedText.replace(pattern, '');
      autoFixes.push({
        description: 'Remover chain-of-thought',
        pattern: pattern.source,
        replacement: '',
        count: matches.length,
      });
    }
  }

  // ============================================================
  // 3. ORPHAN HEADINGS CHECK
  // ============================================================
  const lines = cleanedText.split('\n');
  let orphanCount = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    for (const pattern of ORPHAN_HEADINGS) {
      if (pattern.test(trimmed)) {
        orphanCount++;
      }
    }
  }
  if (orphanCount > 0) {
    violations.push({
      rule: 'Headings orfaos encontrados (Introducao, Conclusao, Mapa Perceptual, ou markdown #)',
      severity: 'high',
      match: `${orphanCount} headings orfaos`,
      location: 'Ao longo do documento',
      autoFixable: true,
    });
    // Auto-remove orphan headings
    const cleanedLines = lines.filter(line => {
      const t = line.trim();
      return !ORPHAN_HEADINGS.some(p => p.test(t));
    });
    cleanedText = cleanedLines.join('\n');
    autoFixes.push({
      description: 'Remover headings orfaos',
      pattern: 'Introducao|Conclusao|Mapa Perceptual|^#',
      replacement: '',
      count: orphanCount,
    });
  }

  // ============================================================
  // 4. STRUCTURAL CHECKS
  // ============================================================

  // Client name present?
  if (input.clientName) {
    const firstName = input.clientName.split(' ')[0].toLowerCase();
    if (!cleanedText.toLowerCase().includes(firstName)) {
      warnings.push(`Nome do cliente "${input.clientName}" nao encontrado no documento`);
    }
  }

  // Document too short?
  if (cleanedText.length < 5000) {
    violations.push({
      rule: 'Documento muito curto (< 5000 caracteres)',
      severity: 'high',
      match: `${cleanedText.length} chars`,
      location: 'Documento inteiro',
      autoFixable: false,
    });
  }

  // Multiple consecutive empty lines?
  const multipleEmptyLines = cleanedText.match(/\n{4,}/g);
  if (multipleEmptyLines) {
    cleanedText = cleanedText.replace(/\n{4,}/g, '\n\n');
    autoFixes.push({
      description: 'Comprimir linhas vazias consecutivas',
      pattern: '\\n{4,}',
      replacement: '\\n\\n',
      count: multipleEmptyLines.length,
    });
  }

  // ============================================================
  // 5. FORBIDDEN CONTENT (hardcoded critical checks)
  // ============================================================
  const forbiddenTerms = [
    { term: 'PROEX', severity: 'critical' as const },
    { term: 'Kortix', severity: 'critical' as const },
    { term: 'Carlos Avelino', severity: 'critical' as const },
    { term: 'prompt', severity: 'critical' as const },
  ];

  for (const { term, severity } of forbiddenTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = cleanedText.match(regex);
    if (matches) {
      violations.push({
        rule: `Termo proibido "${term}" encontrado no documento`,
        severity,
        match: matches[0],
        location: `${matches.length} ocorrencia(s)`,
        autoFixable: false,
      });
    }
  }

  // ============================================================
  // SCORING
  // ============================================================
  const criticalCount = violations.filter(v => v.severity === 'critical').length;
  const highCount = violations.filter(v => v.severity === 'high').length;
  const mediumCount = violations.filter(v => v.severity === 'medium').length;
  const lowCount = violations.filter(v => v.severity === 'low').length;

  const penalty = (criticalCount * 25) + (highCount * 15) + (mediumCount * 5) + (lowCount * 2) + (warnings.length * 1);
  const score = Math.max(0, 100 - penalty);
  const passed = score >= 80 && criticalCount === 0;

  const notes = passed
    ? `APROVADO (score ${score}/100). ${autoFixes.length} auto-fixes aplicados. ${violations.length} violacoes menores.`
    : `REPROVADO (score ${score}/100). ${criticalCount} criticas, ${highCount} altas. ${autoFixes.length} auto-fixes aplicados. Necessita revisao.`;

  return { score, passed, violations, autoFixes, warnings, cleanedText, notes };
}
