'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  marketCapRank: number;
  thumb: string;
  large: string;
  priceBtc: number;
  priceUsd: number;
  priceChange24h: number;
  priceChangePct24h: number;
  marketCap: number;
  totalVolume: number;
  sparkline?: string;
}

interface CoinGeckoTrendingResponse {
  coins: Array<{
    item: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      large: string;
      data: {
        price: string;
        price_change_percentage_24h: { usd: number };
        market_cap: string;
        total_volume: string;
        sparkline?: string;
      };
    };
  }>;
}

// ─── CoinGecko Free API (no API key required) ─────────────────────────────────

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const REFRESH_INTERVAL = 60_000; // 60 sec — CoinGecko free rate limit: 10-30 calls/min

function parseTrendingCoin(raw: CoinGeckoTrendingResponse['coins'][0]['item']): TrendingCoin {
  const priceUsd = parseFloat(raw.data.price) || 0;
  const priceBtc = priceUsd / 50000; // rough estimate if needed
  return {
    id: raw.id,
    name: raw.name,
    symbol: raw.symbol.toUpperCase(),
    marketCapRank: raw.market_cap_rank || 0,
    thumb: raw.thumb,
    large: raw.large,
    priceBtc,
    priceUsd,
    priceChange24h: raw.data.price_change_percentage_24h?.usd || 0,
    priceChangePct24h: raw.data.price_change_percentage_24h?.usd || 0,
    marketCap: parseInt(raw.data.market_cap) || 0,
    totalVolume: parseInt(raw.data.total_volume) || 0,
    sparkline: raw.data.sparkline,
  };
}

export function useTrendingCoins() {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch(`${COINGECKO_API}/search/trending`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CoinGeckoTrendingResponse = await res.json();
      const parsed = data.coins.map((c) => parseTrendingCoin(c.item));
      setCoins(parsed);
      setError(null);
      setLastUpdate(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch trending');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    intervalRef.current = setInterval(fetchTrending, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchTrending]);

  return { coins, loading, error, lastUpdate, refresh: fetchTrending };
}
