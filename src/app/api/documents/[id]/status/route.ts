import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

// PATCH /api/documents/[id]/status — Update document status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    const body = await request.json();

    const { status } = body;

    if (!status) {
      return apiError('status é obrigatório', 422);
    }

    const validStatuses = [
      'draft',
      'review_pending',
      'approved',
      'revision_needed',
      'delivered',
    ];
    if (!validStatuses.includes(status)) {
      return apiError(
        `Status inválido: ${status}. Valores aceitos: ${validStatuses.join(', ')}`,
        422,
      );
    }

    // Build update payload with conditional timestamps
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = { status };

    if (status === 'approved') {
      updateData.reviewed_at = new Date().toISOString();
    }

    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select('*, clients(name)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('Documento não encontrado', 404);
      }
      return apiError(error.message, 400);
    }

    // Log the status change
    const { error: logError } = await supabase
      .from('activity_log')
      .insert({
        client_id: data.client_id,
        document_id: id,
        action:
          status === 'approved'
            ? 'document_approved'
            : status === 'delivered'
              ? 'document_delivered'
              : `document_status_${status}`,
        details: {
          new_status: status,
          document_type: data.doc_type,
        },
      });

    if (logError) {
      console.error('Erro ao registrar atividade:', logError.message);
    }

    return apiSuccess(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return apiError(`Falha ao atualizar status do documento: ${err.message}`);
  }
}
