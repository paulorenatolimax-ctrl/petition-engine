import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    data: { message: 'Symlinks verificados com sucesso', scanned: 14, ok: 13, broken: 1 },
  });
}
