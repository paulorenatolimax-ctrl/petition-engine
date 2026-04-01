import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ERROR_RULES_PATH = path.join(process.cwd(), 'data', 'error_rules.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readRules(): any[] {
  try {
    const raw = fs.readFileSync(ERROR_RULES_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeRules(rules: any[]): void {
  fs.writeFileSync(ERROR_RULES_PATH, JSON.stringify(rules, null, 2), 'utf-8');
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rules = readRules();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rule = rules.find((r: any) => r.id === params.id);

  if (!rule) {
    return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
  }

  return NextResponse.json({ data: rule });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const rules = readRules();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = rules.findIndex((r: any) => r.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    const updatedRule = { ...rules[index], ...body, id: params.id };
    rules[index] = updatedRule;
    writeRules(rules);

    return NextResponse.json({ success: true, data: updatedRule });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
