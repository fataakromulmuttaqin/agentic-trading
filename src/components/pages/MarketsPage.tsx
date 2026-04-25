'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrendingCoins } from '@/hooks/useTrendingCoins';

const CATEGORIES = ['All', 'Crypto', 'DeFi', 'Layer 1', 'Layer 2', 'Meme'];

function formatPrice(price: number): string {
  if (!price || price === 0) return '—';
  if (price >= 1000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 1) return '$' + price.toFixed(4);
  return '$' + price.toFixed(6);
}

function formatVolume(v: number): string {
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
  return '$' + v.toFixed(0);
}

function formatMarketCap(v: number): string {
  if (v >= 1e12) return '$' + (v / 1e12).toFixed(2) + 'T';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  return '$' + v.toLocaleString();
}

export function MarketsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['BTC', 'ETH']));

  const { coins, loading, error, lastUpdate, refresh } = useTrendingCoins();

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const filtered = coins.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.symbol.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Markets</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {lastUpdate
              ? `Live data · Updated ${lastUpdate.toLocaleTimeString()}`
              : 'Connecting to CoinGecko...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs text-[var(--negative)]">⚠ {error}</span>
          )}
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <div
              className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                loading ? 'bg-yellow-400' : 'bg-[var(--positive)]'
              )}
            />
            <span>{loading ? 'Loading...' : 'Live'}</span>
          </div>
          <button
            onClick={refresh}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-[var(--text-muted)]', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coins..."
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)]"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150',
                category === cat
                  ? 'bg-[var(--accent)] text-[var(--bg-void)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
        <div className="grid grid-cols-7 px-4 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">
          <span>#</span>
          <span>Coin</span>
          <span>Price</span>
          <span>24h Change</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Market Cap</span>
          <span className="text-right">Actions</span>
        </div>

        {loading && filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)]">
            Loading trending coins...
          </div>
        ) : (
          filtered.map((coin, i) => {
            const isPositive = coin.priceChangePct24h >= 0;
            return (
              <div
                key={coin.id}
                className={cn(
                  'grid grid-cols-7 px-4 py-3.5 items-center hover:bg-[var(--bg-glass)] transition-colors cursor-pointer',
                  i !== filtered.length - 1 && 'border-b border-[var(--border)]'
                )}
              >
                {/* Rank */}
                <span className="text-xs text-[var(--text-muted)]">{coin.marketCapRank || '—'}</span>

                {/* Coin */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => toggleFavorite(coin.symbol)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        'w-3.5 h-3.5',
                        favorites.has(coin.symbol)
                          ? 'fill-[var(--accent)] text-[var(--accent)]'
                          : 'text-[var(--text-muted)]'
                      )}
                    />
                  </button>
                  <img
                    src={coin.thumb}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">{coin.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase">{coin.symbol}</div>
                  </div>
                </div>

                {/* Price */}
                <span className="text-sm font-mono font-medium text-[var(--text-primary)]">
                  {formatPrice(coin.priceUsd)}
                </span>

                {/* Change */}
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--positive)]" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-[var(--negative)]" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-bold font-mono',
                      isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
                    )}
                  >
                    {isPositive ? '+' : ''}
                    {coin.priceChangePct24h.toFixed(2)}%
                  </span>
                </div>

                {/* Volume */}
                <span className="text-sm font-mono text-[var(--text-secondary)] text-right">
                  {formatVolume(coin.totalVolume)}
                </span>

                {/* Market Cap */}
                <span className="text-sm font-mono text-[var(--text-secondary)] text-right">
                  {formatMarketCap(coin.marketCap)}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-colors">
                    Trade
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
