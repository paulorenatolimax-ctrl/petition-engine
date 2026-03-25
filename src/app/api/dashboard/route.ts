import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      clients: {
        total: 3,
        active: 2,
        by_visa: {
          'EB-2-NIW': 2,
          'EB-1A': 1,
        },
      },
      documents: {
        total: 5,
        generated_today: 1,
        quality_pass_rate: 94,
      },
      systems: {
        total: 14,
        active: 13,
      },
      errors: {
        total_rules: 50,
        triggered_today: 2,
      },
    },
  });
}
