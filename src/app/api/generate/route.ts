import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { generateSchema } from '@/lib/schemas';
import { SYSTEM_MAP } from '@/lib/system-map';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) return apiError(JSON.stringify(parsed.error.flatten()), 400);

  try {
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*, client_profiles(*)')
      .eq('id', parsed.data.client_id)
      .single();

    if (clientError || !client) return apiError('Cliente não encontrado', 404);

    const systemConfig = SYSTEM_MAP[parsed.data.doc_type];
    if (!systemConfig) return apiError(`Sistema não encontrado para doc_type: ${parsed.data.doc_type}`, 400);

    const { runWriter } = await import('@/agents/writer');
    const result = await runWriter({
      clientId: parsed.data.client_id,
      clientName: client.name,
      visaType: client.visa_type,
      docType: parsed.data.doc_type,
      systemName: systemConfig.name,
      systemPath: systemConfig.symlinkDir ? `${process.cwd()}/systems/${systemConfig.symlinkDir}` : undefined,
      proposedEndeavor: client.proposed_endeavor || undefined,
      previousDenied: client.previous_petition_denied || false,
      denialReasons: client.denial_reasons || undefined,
    });

    // Save prompt as .md file in client's output folder
    let promptPath = '';
    let promptFileName = '';
    try {
      const clientOutputDir = path.join(
        client.docs_folder_path || path.join(process.cwd(), 'outputs', client.name.replace(/\s+/g, '_')),
        'prompts'
      );
      if (!existsSync(clientOutputDir)) mkdirSync(clientOutputDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      promptFileName = `GERAR_${parsed.data.doc_type}_${timestamp}.md`;
      promptPath = path.join(clientOutputDir, promptFileName);

      writeFileSync(promptPath, result.prompt, 'utf-8');
    } catch {
      // Non-blocking: file save failed, still return prompt
    }

    return apiSuccess({
      ...result,
      prompt_path: promptPath,
      prompt_file_name: promptFileName,
      claude_command: promptPath
        ? `Leia ${promptPath} e gere o documento DOCX completo. Salve na mesma pasta.`
        : undefined,
    });
  } catch (err: any) {
    return apiError(err.message);
  }
}
