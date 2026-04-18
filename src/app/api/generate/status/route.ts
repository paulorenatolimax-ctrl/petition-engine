import { NextResponse } from 'next/server';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const GENERATIONS_FILE = path.join(process.cwd(), 'data', 'generations.json');

/**
 * Watchdog lazy: qualquer entrada com status='processing' e started_at mais
 * antigo que `maxAgeMinutes` é marcada automaticamente como 'failed'.
 * Isso limpa "ghost processes" (casos em que o subprocess claude -p crashou
 * silenciosamente e nunca atualizou o status). Executado a cada GET sem
 * necessidade de cron/daemon separado.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function markStaleProcessesAsFailed(generations: any[], maxAgeMinutes = 30): boolean {
  const now = Date.now();
  const threshold = maxAgeMinutes * 60 * 1000;
  let changed = false;
  for (const g of generations) {
    if (g.status !== 'processing' || !g.started_at) continue;
    const startedMs = new Date(g.started_at).getTime();
    if (Number.isNaN(startedMs)) continue;
    const age = now - startedMs;
    if (age > threshold) {
      g.status = 'failed';
      g.completed_at = new Date().toISOString();
      const ageMin = Math.floor(age / 60000);
      g.error_message = g.error_message
        || `Process timed out (>${ageMin}min) — auto-marked failed by watchdog`;
      changed = true;
    }
  }
  return changed;
}

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

  // Lazy watchdog: limpa ghost processes antes de enriquecer
  if (markStaleProcessesAsFailed(generations, 30)) {
    try {
      writeFileSync(GENERATIONS_FILE, JSON.stringify(generations, null, 2), 'utf-8');
    } catch {
      // Se write falhar, segue entregando dados in-memory — melhor que bloquear
    }
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
