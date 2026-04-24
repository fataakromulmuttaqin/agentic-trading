import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair') || 'BTCUSD';

    const res = await fetch(`${BACKEND_URL}/api/ticker/${pair}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
