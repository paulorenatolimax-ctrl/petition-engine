import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const errorDescription = body.error_description || body.errorDescription;

  if (!errorDescription) {
    return apiError('error_description é obrigatório', 400);
  }

  try {
    const { reportError } = await import('@/agents/auto-debugger');
    const result = await reportError({
      errorDescription: errorDescription,
      docType: body.doc_type,
      documentId: body.document_id,
    });
    return apiSuccess(result, 201);
  } catch (err: any) {
    return apiError(err.message);
  }
}
