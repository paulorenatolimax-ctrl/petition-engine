import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { readFileSync } from 'fs';

export async function POST(req: NextRequest) {
  const body = await req.json();

  let documentText = body.text || '';
  if (!documentText && body.file_path) {
    try {
      documentText = readFileSync(body.file_path, 'utf-8');
    } catch {
      return apiError('Não foi possível ler o arquivo', 400);
    }
  }

  if (!documentText) return apiError('text ou file_path é obrigatório', 400);

  const { runQuality } = await import('@/agents/quality');
  const result = await runQuality({
    documentText,
    docType: body.doc_type || 'unknown',
    clientName: body.client_name || '',
    visaType: body.visa_type || '',
    profileJson: body.profile || null,
  });

  return apiSuccess(result);
}
