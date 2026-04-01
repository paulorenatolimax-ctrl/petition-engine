import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');

  if (!clientId) {
    return apiError('client_id is required', 400);
  }

  const supabase = createServerClient();

  // Fetch client to get docs_folder_path
  const { data: client, error } = await supabase
    .from('clients')
    .select('id, name, docs_folder_path')
    .eq('id', clientId)
    .single();

  if (error || !client) {
    return apiError('Client not found', 404);
  }

  if (!client.docs_folder_path) {
    return apiSuccess({
      exists: false,
      files: [],
      path: null,
      message: 'Client has no docs_folder_path configured',
    });
  }

  const researchPackPath = path.join(client.docs_folder_path, 'RESEARCH_PACK');
  const exists = fs.existsSync(researchPackPath);

  let files: string[] = [];
  if (exists) {
    try {
      files = fs
        .readdirSync(researchPackPath)
        .filter((f) => f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.json'));
    } catch {
      // Directory exists but cannot be read
      files = [];
    }
  }

  return apiSuccess({
    exists,
    files,
    path: researchPackPath,
    ready: files.length >= 4,
  });
}
