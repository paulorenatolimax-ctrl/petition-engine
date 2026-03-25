import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      total_documents: 5,
      passed: 4,
      failed: 1,
      pending: 0,
      average_score: 94,
      by_doc_type: {
        resume_eb2_niw: { total: 2, passed: 2, avg_score: 96 },
        cover_letter_eb2_niw: { total: 1, passed: 1, avg_score: 92 },
        business_plan: { total: 1, passed: 0, avg_score: 72 },
        cover_letter_eb1a: { total: 1, passed: 1, avg_score: 97 },
      },
    },
  });
}
