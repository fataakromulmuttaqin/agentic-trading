import { NextRequest, NextResponse } from 'next/server';

// In-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const chartCache = new Map<string, CacheEntry<unknown>>();
const CHART_CACHE_TTL = 300_000;

type Bar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const INTERVAL_TO_ENDPOINT: Record<string, string> = {
  '1m': 'histominute', '5m': 'histominute', '15m': 'histominute', '30m': 'histominute',
  '1h': 'histohour', '4h': 'histohour', '1d': 'histoday', '1w': 'histoday',
};

function getCached<T>(key: string, ttl: number): T | null {
  const entry = chartCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttl) { chartCache.delete(key); return null; }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  chartCache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const interval = searchParams.get('interval') || '1h';
  const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 500);

  const endpoint = INTERVAL_TO_ENDPOINT[interval] || 'histominute';
  const fsym = symbol.replace('USDT', '');
  const cacheKey = `${symbol}:${interval}:${limit}`;

  const cached = getCached<Bar[]>(cacheKey, CHART_CACHE_TTL);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=300' },
    });
  }

  const url = `https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${fsym}&tsym=USDT&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `CryptoCompare error: ${res.status}` }, { status: res.status });
    }

    const json = await res.json();
    if (json.Response !== 'Success') {
      return NextResponse.json({ error: json.Message || 'API error' }, { status: 500 });
    }

    const bars: Bar[] = json.Data.Data.map((k: { time: number; high: number; low: number; open: number; close: number; volumefrom: number }) => ({
      time: k.time, open: k.open, high: k.high, low: k.low, close: k.close, volume: k.volumefrom,
    }));

    setCached(cacheKey, bars);

    return NextResponse.json(bars, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('Chart data error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}
