import { NextRequest, NextResponse } from 'next/server';

// CryptoCompare API - free tier, no geo-blocking, supports all intervals
// Docs: https://min-api.cryptocompare.com/

const SYMBOL_MAP: Record<string, { fsym: string; tsym: string }> = {
  BTCUSDT: { fsym: 'BTC', tsym: 'USDT' },
  ETHUSDT: { fsym: 'ETH', tsym: 'USDT' },
  SOLUSDT: { fsym: 'SOL', tsym: 'USDT' },
  BNBUSDT: { fsym: 'BNB', tsym: 'USDT' },
  XRPUSDT: { fsym: 'XRP', tsym: 'USDT' },
  ADAUSDT: { fsym: 'ADA', tsym: 'USDT' },
  DOGEUSDT: { fsym: 'DOGE', tsym: 'USDT' },
  DOTUSDT: { fsym: 'DOT', tsym: 'USDT' },
  AVAXUSDT: { fsym: 'AVAX', tsym: 'USDT' },
  MATICUSDT: { fsym: 'MATIC', tsym: 'USDT' },
};

const INTERVAL_TO_ENDPOINT: Record<string, string> = {
  '1m': 'histominute',
  '5m': 'histominute',
  '15m': 'histominute',
  '30m': 'histominute',
  '1h': 'histohour',
  '4h': 'histohour',
  '1d': 'histoday',
  '1w': 'histoday',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const interval = searchParams.get('interval') || '1m';
  const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 2000);

  const pair = SYMBOL_MAP[symbol];
  if (!pair) {
    return NextResponse.json({ error: `Unsupported symbol: ${symbol}` }, { status: 400 });
  }

  const endpoint = INTERVAL_TO_ENDPOINT[interval] || 'histominute';
  const url = `https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${pair.fsym}&tsym=${pair.tsym}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `CryptoCompare error: ${res.status}` }, { status: res.status });
    }

    const json = await res.json();
    if (json.Response !== 'Success') {
      return NextResponse.json({ error: json.Message || 'API error' }, { status: 500 });
    }

    const bars = json.Data.Data.map((k: {
      time: number;
      high: number;
      low: number;
      open: number;
      close: number;
      volumefrom: number;
    }) => ({
      time: k.time,
      open: k.open,
      high: k.high,
      low: k.low,
      close: k.close,
      volume: k.volumefrom,
    }));

    return NextResponse.json(bars, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Chart data error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}
