import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({
    data: { id: params.id, profile_saved: true, ...body },
  });
}
