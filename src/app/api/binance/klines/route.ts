import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const interval = searchParams.get('interval') || '1m';
  const limit = searchParams.get('limit') || '300';

  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Binance API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Transform to lightweight-charts format
    const bars = data.map((k: (string | number)[]) => ({
      time: Math.floor(Number(k[0]) / 1000),
      open: parseFloat(k[1] as string),
      high: parseFloat(k[2] as string),
      low: parseFloat(k[3] as string),
      close: parseFloat(k[4] as string),
      volume: parseFloat(k[5] as string),
    }));

    return NextResponse.json(bars, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Binance proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Binance' },
      { status: 500 }
    );
  }
}
