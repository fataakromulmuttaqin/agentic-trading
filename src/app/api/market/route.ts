import { NextRequest, NextResponse } from 'next/server';

// In-memory cache (Module-level, persists across requests)
// Vercel serverless: may reset on cold start, but stays warm within session
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Cache TTL in ms
const PRICE_CACHE_TTL = 30_000;    // 30 sec for prices
const COIN_CACHE_TTL = 3600_000;   // 1 hour for coin list

// All supported symbols with metadata (shared with PairSelector)
const SUPPORTED_SYMBOLS: Record<string, {
  fsym: string;
  tsym: string;
  name: string;
  icon: string;
  rank: number;
}> = {
  BTCUSDT: { fsym: 'BTC',  tsym: 'USDT', name: 'Bitcoin',    icon: '₿',  rank: 1  },
  ETHUSDT: { fsym: 'ETH',  tsym: 'USDT', name: 'Ethereum',  icon: 'Ξ',  rank: 2  },
  SOLUSDT: { fsym: 'SOL',  tsym: 'USDT', name: 'Solana',    icon: '◎',  rank: 3  },
  BNBUSDT: { fsym: 'BNB',  tsym: 'USDT', name: 'BNB',       icon: '◈',  rank: 4  },
  XRPUSDT: { fsym: 'XRP',  tsym: 'USDT', name: 'Ripple',    icon: '✕',  rank: 5  },
  ADAUSDT: { fsym: 'ADA',  tsym: 'USDT', name: 'Cardano',   icon: '₳',  rank: 6  },
  DOGEUSDT: { fsym: 'DOGE', tsym: 'USDT', name: 'Dogecoin', icon: 'Ð',  rank: 7  },
  DOTUSDT: { fsym: 'DOT',  tsym: 'USDT', name: 'Polkadot',  icon: '●',  rank: 8  },
  AVAXUSDT: { fsym: 'AVAX', tsym: 'USDT', name: 'Avalanche',icon: '▲',  rank: 9  },
  MATICUSDT: { fsym: 'MATIC', tsym: 'USDT', name: 'Polygon', icon: '⬡', rank: 10 },
  LINKUSDT: { fsym: 'LINK', tsym: 'USDT', name: 'Chainlink',icon: '⬡', rank: 11 },
  UNIUSDT: { fsym: 'UNI',  tsym: 'USDT', name: 'Uniswap',  icon: '🦄', rank: 12 },
  LTCUSDT: { fsym: 'LTC',  tsym: 'USDT', name: 'Litecoin',  icon: 'Ł',  rank: 13 },
  ATOMUSDT: { fsym: 'ATOM', tsym: 'USDT', name: 'Cosmos',   icon: '⚛',  rank: 14 },
  ETCUSDT: { fsym: 'ETC',  tsym: 'USDT', name: 'Ethereum Classic', icon: 'Ξ', rank: 15 },
  XLMUSDT: { fsym: 'XLM',  tsym: 'USDT', name: 'Stellar',   icon: '✕',  rank: 16 },
  NEARUSDT: { fsym: 'NEAR', tsym: 'USDT', name: 'NEAR',     icon: '◈',  rank: 17 },
  APTUSDT: { fsym: 'APT',  tsym: 'USDT', name: 'Aptos',     icon: '●',  rank: 18 },
  ARBUSDT: { fsym: 'ARB',  tsym: 'USDT', name: 'Arbitrum',  icon: '▲',  rank: 19 },
  OPUSDT: { fsym: 'OP',   tsym: 'USDT', name: 'Optimism',   icon: '⬡',  rank: 20 },
};

// ─── Rate Limiter (simple token bucket) ───────────────────────────────────────
// CryptoCompare free: ~5 calls/min without API key
// We track calls to avoid hitting the limit

interface RateLimitState {
  calls: number[];
}

const rateLimitState: RateLimitState = { calls: [] };

function canMakeCall(): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute window
  // Clean old calls
  rateLimitState.calls = rateLimitState.calls.filter(t => now - t < windowMs);
  return rateLimitState.calls.length < 4; // Keep 1 spare (max 4 of 5)
}

function recordCall(): void {
  rateLimitState.calls.push(Date.now());
}

// ─── Cache helpers ─────────────────────────────────────────────────────────────

function getCached<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── Price Fetcher (batched) ───────────────────────────────────────────────────

async function fetchPricesBatch(symbols: string[]): Promise<Record<string, {
  price: number;
  change24h: number;
  changePct24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}>> {
  const fsyms = symbols.map(s => SUPPORTED_SYMBOLS[s]?.fsym).filter(Boolean).join(',');
  if (!fsyms) return {};

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=USDT`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    recordCall();
    const json = await res.json();
    const raw = json.RAW || {};

    const result: Record<string, {
      price: number;
      change24h: number;
      changePct24h: number;
      high24h: number;
      low24h: number;
      volume24h: number;
    }> = {};

    for (const [sym, usdData] of Object.entries(raw) as [string, Record<string, unknown>][]) {
      const d = usdData as Record<string, number>;
      const pairKey = Object.entries(SUPPORTED_SYMBOLS).find(([, v]) => v.fsym === sym)?.[0];
      if (!pairKey) continue;

      result[pairKey] = {
        price: d.PRICE || 0,
        change24h: d.CHANGE24HOUR || 0,
        changePct24h: d.CHANGEPCT24HOUR || 0,
        high24h: d.HIGH24HOUR || 0,
        low24h: d.LOW24HOUR || 0,
        volume24h: d.TOPTIERVOLUME24HOUR || 0,
      };
    }

    return result;
  } catch (error) {
    console.error('Price fetch error:', error);
    return {};
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'prices';

  // ── PRICES: batched live prices for all symbols ──────────────────────────────
  if (type === 'prices') {
    const cacheKey = 'prices_batch';
    const cached = getCached<ReturnType<typeof fetchPricesBatch>>(cacheKey, PRICE_CACHE_TTL);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=30' },
      });
    }

    if (!canMakeCall()) {
      // Return stale cache if rate limited
      const stale = cache.get('prices_batch_stale');
      if (stale) {
        return NextResponse.json(stale.data, {
          headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, max-age=60' },
        });
      }
      return NextResponse.json({ error: 'Rate limited, try again soon' }, { status: 429 });
    }

    const symbols = Object.keys(SUPPORTED_SYMBOLS);
    const data = await fetchPricesBatch(symbols);
    setCached(cacheKey, data);
    cache.set('prices_batch_stale', { data, timestamp: Date.now() }); // stale backup

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=30' },
    });
  }

  // ── COINS: list of supported symbols ────────────────────────────────────────
  if (type === 'coins') {
    const cacheKey = 'coins_list';
    const cached = getCached<typeof SUPPORTED_SYMBOLS>(cacheKey, COIN_CACHE_TTL);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=3600' },
      });
    }

    setCached(cacheKey, SUPPORTED_SYMBOLS);
    return NextResponse.json(SUPPORTED_SYMBOLS, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  }

  // ── COIN: single coin info ────────────────────────────────────────────────────
  if (type === 'coin') {
    const symbol = searchParams.get('symbol') || '';
    const coin = SUPPORTED_SYMBOLS[symbol];
    if (!coin) return NextResponse.json({ error: 'Unknown symbol' }, { status: 404 });
    return NextResponse.json(coin);
  }

  return NextResponse.json({ error: 'Invalid type param' }, { status: 400 });
}
