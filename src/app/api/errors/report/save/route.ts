import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.error_description) {
      return apiError('error_description é obrigatório', 400);
    }

    const { reportError } = await import('@/agents/auto-debugger');
    const result = await reportError({
      errorDescription: body.error_description,
      docType: body.doc_type,
      documentId: body.document_id,
    });

    return apiSuccess(result, 201);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return apiError(`Erro ao salvar regra: ${err.message}`, 500);
  }
}
