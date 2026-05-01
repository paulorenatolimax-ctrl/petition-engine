/**
 * POST /api/quality/accept-violation
 *
 * CHUNK 8 (F2.3) — Fallback manual: humano acolhe uma violação detectada
 * pelo Quality Gate e força criação de regra correspondente, mesmo se o
 * auto-debugger filtrou ou não conseguiu classificar.
 *
 * Body:
 *   {
 *     errorDescription: string,    // descrição livre da violação
 *     docType?: string,            // doc_type específico (ou null = global)
 *     severity?: 'critical' | 'high' | 'medium' | 'low',
 *     violationPattern?: string,   // regex opcional pra detection automática futura
 *     sourceGenId?: string         // gen_id de referência (audit trail)
 *   }
 *
 * Retorna o resultado do auto-debugger:
 *   { action: 'new_rule_created' | 'existing_rule_updated' | 'skipped_duplicate',
 *     rule_id, message, rule? }
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { errorDescription, docType, severity, violationPattern, sourceGenId } = body;

    if (!errorDescription || typeof errorDescription !== 'string' || errorDescription.length < 5) {
      return NextResponse.json(
        { error: 'errorDescription obrigatório (mínimo 5 chars)' },
        { status: 400 },
      );
    }

    const { reportErrorLocal } = await import('@/agents/auto-debugger-local');
    const result = reportErrorLocal({
      errorDescription: errorDescription.slice(0, 500),
      docType: docType || null,
      severity: severity || 'medium',
      violationPattern: violationPattern || null,
      sourceGenId: sourceGenId || `manual_${Date.now()}`,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
