import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runExtractor } from '@/agents/extractor';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Buscar dados do cliente
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    if (!client.docs_folder_path) {
      return NextResponse.json({
        error: 'Cliente não tem pasta de documentos configurada. Vá em Clientes → Editar e preencha o campo "Pasta dos documentos".'
      }, { status: 400 });
    }

    // 2. Ler parâmetros do body
    const body = await request.json().catch(() => ({}));
    const mode = body.mode || 'smart';
    const maxChars = body.max_chars || 320000;

    // 3. Rodar extractor
    const result = runExtractor({
      clientName: client.name,
      visaType: client.visa_type,
      docsPath: client.docs_folder_path,
      proposedEndeavor: client.proposed_endeavor,
      previousDenied: client.previous_petition_denied,
      denialReasons: client.denial_reasons,
      mode,
      maxChars,
    });

    // 3. Registrar atividade
    await supabase.from('activity_log').insert({
      client_id: params.id,
      action: 'extraction_started',
      details: {
        filesFound: result.metadata.filesFound,
        filesExtracted: result.metadata.filesExtracted,
        totalChars: result.metadata.totalChars,
      },
    });

    return NextResponse.json({
      data: {
        prompt: result.prompt,
        metadata: result.metadata,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
