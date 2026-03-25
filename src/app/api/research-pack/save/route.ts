import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import fs from 'fs';
import path from 'path';

interface ResearchResult {
  filename: string;
  content: string;
}

export async function POST(req: NextRequest) {
  let body: { client_id: string; results: ResearchResult[] };

  try {
    body = await req.json();
  } catch {
    return apiError('Invalid JSON body', 400);
  }

  const { client_id, results } = body;

  if (!client_id) {
    return apiError('client_id is required', 400);
  }

  if (!results || !Array.isArray(results) || results.length === 0) {
    return apiError('results array is required and must not be empty', 400);
  }

  const supabase = createServerClient();

  // Fetch client to get docs_folder_path
  const { data: client, error } = await supabase
    .from('clients')
    .select('id, name, docs_folder_path')
    .eq('id', client_id)
    .single();

  if (error || !client) {
    return apiError('Client not found', 404);
  }

  if (!client.docs_folder_path) {
    return apiError('Client has no docs_folder_path configured', 400);
  }

  const researchPackPath = path.join(client.docs_folder_path, 'RESEARCH_PACK');

  // Create RESEARCH_PACK directory if it doesn't exist
  if (!fs.existsSync(researchPackPath)) {
    fs.mkdirSync(researchPackPath, { recursive: true });
  }

  let savedCount = 0;
  const savedFiles: string[] = [];
  const errors: string[] = [];

  for (const result of results) {
    if (!result.filename || !result.content) {
      errors.push(`Skipped entry: missing filename or content`);
      continue;
    }

    try {
      const filePath = path.join(researchPackPath, result.filename);
      fs.writeFileSync(filePath, result.content, 'utf-8');
      savedCount++;
      savedFiles.push(result.filename);
    } catch (writeError: unknown) {
      const msg = writeError instanceof Error ? writeError.message : String(writeError);
      errors.push(`Failed to write ${result.filename}: ${msg}`);
    }
  }

  // Count total files in RESEARCH_PACK
  const allFiles = fs
    .readdirSync(researchPackPath)
    .filter((f) => f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.json'));

  return apiSuccess({
    saved: savedCount,
    saved_files: savedFiles,
    path: researchPackPath,
    total_files: allFiles.length,
    ready: allFiles.length >= 4,
    errors: errors.length > 0 ? errors : undefined,
  });
}
