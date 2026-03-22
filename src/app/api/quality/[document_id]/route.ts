import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(
  _req: NextRequest,
  { params }: { params: { document_id: string } },
) {
  try {
    const { document_id } = params;

    if (!document_id) {
      return apiError('document_id é obrigatório', 400);
    }

    const supabase = createServerClient();

    const { data: document, error } = await supabase
      .from('documents')
      .select(`
        id,
        doc_type,
        doc_subtype,
        version,
        status,
        quality_score,
        quality_passed,
        quality_notes,
        uscis_risk_score,
        generated_at,
        reviewed_at,
        clients(name, visa_type)
      `)
      .eq('id', document_id)
      .single();

    if (error || !document) {
      return apiError('Documento não encontrado', 404);
    }

    return apiSuccess({
      document_id: document.id,
      doc_type: document.doc_type,
      doc_subtype: document.doc_subtype,
      version: document.version,
      status: document.status,
      quality_score: document.quality_score,
      quality_passed: document.quality_passed,
      quality_notes: document.quality_notes,
      uscis_risk_score: document.uscis_risk_score,
      generated_at: document.generated_at,
      reviewed_at: document.reviewed_at,
      client: document.clients,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro interno do servidor';
    return apiError(message, 500);
  }
}
