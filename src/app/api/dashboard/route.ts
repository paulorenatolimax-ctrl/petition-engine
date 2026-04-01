import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readJsonFile(filename: string): any {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET() {
  // Read clients
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clients: any[] = readJsonFile('clients.json') || [];
  const activeClients = clients.filter(c => c.status === 'active');
  const byVisa: Record<string, number> = {};
  for (const c of clients) {
    if (c.visa_type) {
      byVisa[c.visa_type] = (byVisa[c.visa_type] || 0) + 1;
    }
  }

  // Read systems
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const systems: any[] = readJsonFile('systems.json') || [];
  const activeSystems = systems.filter(s => s.is_active);

  // Read error rules
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorRules: any[] = readJsonFile('error_rules.json') || [];

  // Read generations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generations: any[] = readJsonFile('generations.json') || [];

  // Calculate document stats
  const today = new Date().toISOString().slice(0, 10);
  const generatedToday = generations.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (g: any) => g.created_at && g.created_at.startsWith(today)
  );
  const qualityPassed = generations.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (g: any) => g.quality_status === 'passed' || g.quality_score >= 90
  );
  const qualityPassRate = generations.length > 0
    ? Math.round((qualityPassed.length / generations.length) * 100)
    : 0;

  // Calculate triggered today
  const triggeredToday = errorRules.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.last_triggered_at && r.last_triggered_at.startsWith(today)
  );

  return NextResponse.json({
    data: {
      clients: {
        total: clients.length,
        active: activeClients.length,
        by_visa: byVisa,
      },
      documents: {
        total: generations.length,
        generated_today: generatedToday.length,
        quality_pass_rate: qualityPassRate,
      },
      systems: {
        total: systems.length,
        active: activeSystems.length,
      },
      errors: {
        total_rules: errorRules.length,
        triggered_today: triggeredToday.length,
      },
    },
  });
}
