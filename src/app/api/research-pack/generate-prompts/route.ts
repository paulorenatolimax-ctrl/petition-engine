import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import {
  RESEARCH_TEMPLATES,
  fillTemplate,
  TemplateVars,
} from '@/lib/research-templates';

export async function POST(req: NextRequest) {
  let body: { client_id: string };

  try {
    body = await req.json();
  } catch {
    return apiError('Invalid JSON body', 400);
  }

  const { client_id } = body;

  if (!client_id) {
    return apiError('client_id is required', 400);
  }

  const supabase = createServerClient();

  // Fetch client with profile
  const { data: client, error } = await supabase
    .from('clients')
    .select('*, client_profiles(*)')
    .eq('id', client_id)
    .single();

  if (error || !client) {
    return apiError('Client not found', 404);
  }

  // Build template variables from client data
  const vars: TemplateVars = {
    EMPRESA: client.company_name || client.name || '',
    SETOR: client.proposed_endeavor || '',
    CIDADE: client.location_city || '',
    ESTADO: client.location_state || '',
    SOC_CODE: client.soc_code || '',
    SOC_TITULO: client.soc_title || '',
    NAICS: client.naics_code || '',
    SERVICOS: client.proposed_endeavor || '',
  };

  // Check for missing critical fields
  const missingFields: string[] = [];
  if (!vars.EMPRESA) missingFields.push('company_name or name');
  if (!vars.SETOR) missingFields.push('proposed_endeavor');
  if (!vars.CIDADE) missingFields.push('location_city');
  if (!vars.ESTADO) missingFields.push('location_state');

  // Generate prompts from all 8 templates
  const prompts = RESEARCH_TEMPLATES.map((template) => ({
    id: template.id,
    title: template.title,
    filename: template.filename,
    prompt_text: fillTemplate(template.prompt, vars),
  }));

  return apiSuccess({
    prompts,
    client_name: client.name,
    missing_fields: missingFields.length > 0 ? missingFields : undefined,
    warning:
      missingFields.length > 0
        ? `Some client fields are missing. Prompts may contain empty placeholders: ${missingFields.join(', ')}`
        : undefined,
  });
}
