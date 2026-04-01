import { NextResponse } from 'next/server';

export function apiError(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message, timestamp: new Date().toISOString() },
    { status }
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiSuccess(data: any, status: number = 200) {
  return NextResponse.json(
    { data, timestamp: new Date().toISOString() },
    { status }
  );
}
