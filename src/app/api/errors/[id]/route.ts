import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({
    data: { id: params.id, ...body, updated: true },
  });
}
