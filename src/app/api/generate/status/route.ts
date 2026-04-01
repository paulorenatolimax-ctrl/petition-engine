import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const GENERATIONS_FILE = path.join(process.cwd(), 'data', 'generations.json');

export async function GET() {
  if (!existsSync(GENERATIONS_FILE)) {
    return NextResponse.json({ data: [] });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let generations: any[];
  try {
    generations = JSON.parse(readFileSync(GENERATIONS_FILE, 'utf-8'));
  } catch {
    return NextResponse.json({ data: [] });
  }

  // Enrich with computed fields
  const now = Date.now();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = generations.map((g: any) => ({
    ...g,
    age_seconds: g.started_at ? Math.round((now - new Date(g.started_at).getTime()) / 1000) : 0,
    duration_display: g.duration_seconds != null
      ? g.duration_seconds >= 60 ? `${Math.floor(g.duration_seconds / 60)}m ${g.duration_seconds % 60}s` : `${g.duration_seconds}s`
      : g.started_at && g.status === 'processing'
        ? `${Math.round((now - new Date(g.started_at).getTime()) / 1000)}s (rodando)`
        : null,
  }));

  // Sort by started_at descending
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enriched.sort((a: any, b: any) => new Date(b.started_at || 0).getTime() - new Date(a.started_at || 0).getTime());

  return NextResponse.json({ data: enriched });
}
