import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { document_id } = body;

    if (!document_id) {
      return apiError('document_id é obrigatório', 400);
    }

    const supabase = createServerClient();

    // Fetch document with full client data and profile
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select(`
        *,
        clients(*, client_profiles(*))
      `)
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      return apiError('Documento não encontrado', 404);
    }

    if (!document.clients) {
      return apiError('Cliente associado não encontrado', 404);
    }

    const client = document.clients as Record<string, unknown>;
    const profiles = client.client_profiles as Record<string, unknown>[] | null;

    if (!profiles || profiles.length === 0) {
      return apiError(
        'Perfil do cliente não encontrado. Execute a extração primeiro.',
        400,
      );
    }

    // Dynamically import runQuality
    const { runQuality } = await import('@/agents/quality');

    // Re-run quality validation
    const clientName = (client.name as string) || '';
    // For now, use output_file_path as placeholder text — in production, extract text from DOCX first
    const documentText = document.output_file_path || '';
    const qualityResult = await runQuality({ documentText, docType: document.doc_type as string, clientName, visaType: (client.visa_type as string) || '' });

    // Update document with new quality results
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        quality_score: { score: qualityResult.score, violations: qualityResult.violations },
        quality_passed: qualityResult.passed,
        quality_notes: qualityResult.notes,
        status: qualityResult.passed ? 'review_pending' : 'quality_check',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', document_id);

    if (updateError) {
      return apiError(`Erro ao atualizar documento: ${updateError.message}`, 500);
    }

    // Create activity log entry
    await supabase.from('activity_log').insert({
      entity_type: 'document',
      entity_id: document_id,
      action: 'quality_recheck',
      details: {
        previous_score: document.quality_score,
        new_score: qualityResult.score,
        previous_passed: document.quality_passed,
        new_passed: qualityResult.passed,
      },
      created_at: new Date().toISOString(),
    });

    return apiSuccess({
      document_id,
      quality_score: qualityResult.score,
      quality_passed: qualityResult.passed,
      quality_notes: qualityResult.notes,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro interno do servidor';
    return apiError(message, 500);
  }
}
