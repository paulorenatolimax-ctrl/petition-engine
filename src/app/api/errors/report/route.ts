import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import fs from 'fs';
import path from 'path';

const RULES_PATH = path.join(process.cwd(), 'data', 'error_rules.json');

function readRules() {
  try { return JSON.parse(fs.readFileSync(RULES_PATH, 'utf-8')); }
  catch { return []; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeRules(rules: any[]) {
  fs.writeFileSync(RULES_PATH, JSON.stringify(rules, null, 2));
}

function classifyType(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes('nunca usar') || d.includes('proibid') || d.includes('forbidden') || d.includes('never use')) return 'forbidden_term';
  if (d.includes('formato') || d.includes('formatting') || d.includes('font') || d.includes('margin') || d.includes('spacing')) return 'formatting';
  if (d.includes('codigo') || d.includes('soc') || d.includes('o*net') || d.includes('legal') || d.includes('licen')) return 'legal';
  if (d.includes('logica') || d.includes('logic') || d.includes('dhanasar') || d.includes('kazarian')) return 'logic';
  return 'content';
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const errorDescription = body.error_description || body.errorDescription;

  if (!errorDescription) {
    return apiError('error_description e obrigatorio', 400);
  }

  // Try auto-debugger agent first, fallback to local JSON
  try {
    const { reportError } = await import('@/agents/auto-debugger');
    const result = await reportError({
      errorDescription,
      docType: body.doc_type,
      documentId: body.document_id,
    });
    return apiSuccess(result, 201);
  } catch {
    // Fallback: save directly to error_rules.json
    const rules = readRules();
    const newRule = {
      id: `r${Date.now()}`,
      rule_type: classifyType(errorDescription),
      doc_type: body.doc_type || null,
      rule_description: errorDescription,
      rule_pattern: null,
      rule_action: body.severity === 'critical' ? 'block' : 'warn',
      severity: body.severity || 'high',
      source: 'paulo_feedback',
      active: true,
      times_triggered: 0,
      created_at: new Date().toISOString(),
    };
    rules.push(newRule);
    writeRules(rules);
    return apiSuccess({ message: 'Regra criada via fallback local', rule: newRule }, 201);
  }
}
