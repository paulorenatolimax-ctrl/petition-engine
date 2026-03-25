import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ERROR_RULES_PATH = path.join(process.cwd(), 'data', 'error_rules.json');

function readRules(): any[] {
  try {
    const raw = fs.readFileSync(ERROR_RULES_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeRules(rules: any[]): void {
  fs.writeFileSync(ERROR_RULES_PATH, JSON.stringify(rules, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ruleType = searchParams.get('rule_type') || '';
  const severity = searchParams.get('severity') || '';
  const active = searchParams.get('active');

  let filtered = readRules();
  if (ruleType) filtered = filtered.filter(r => r.rule_type === ruleType);
  if (severity) filtered = filtered.filter(r => r.severity === severity);
  if (active === 'true') filtered = filtered.filter(r => r.active);

  return NextResponse.json({ data: filtered });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const rules = readRules();
    const index = rules.findIndex((r: any) => r.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    const updatedRule = { ...rules[index], ...body };
    rules[index] = updatedRule;
    writeRules(rules);

    return NextResponse.json({ success: true, data: updatedRule });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
