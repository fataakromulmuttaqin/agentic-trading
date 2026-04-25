'use client';

import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTrendingCoins, TrendingCoin } from '@/hooks/useTrendingCoins';
import { cn } from '@/lib/utils';

function formatPrice(price: number): string {
  if (price >= 1) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 0.01) return '$' + price.toFixed(4);
  return '$' + price.toFixed(6);
}



export function TrendingCoins() {
  const { coins, loading, error, lastUpdate, refresh } = useTrendingCoins();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h3 className="text-sm font-black text-[var(--text-primary)]">🔥 Trending</h3>
          {lastUpdate && (
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Updated {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={refresh}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-glass)] transition-colors"
          title="Refresh"
        >
          <RefreshCw className={cn('w-3.5 h-3.5 text-[var(--text-muted)]', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="px-4 py-3 text-xs text-[var(--negative)]">
          ⚠ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && coins.length === 0 && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-20 bg-[var(--bg-elevated)] rounded" />
                <div className="h-2.5 w-12 bg-[var(--bg-elevated)] rounded" />
              </div>
              <div className="space-y-1.5 text-right">
                <div className="h-3 w-16 bg-[var(--bg-elevated)] rounded" />
                <div className="h-2.5 w-10 bg-[var(--bg-elevated)] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coin list */}
      {!loading && coins.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          {coins.slice(0, 10).map((coin) => (
            <TrendingCoinRow key={coin.id} coin={coin} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrendingCoinRow({ coin }: { coin: TrendingCoin }) {
  const isPositive = coin.priceChangePct24h >= 0;

  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[var(--bg-glass)] transition-colors cursor-pointer group">
      {/* Rank */}
      <span className="w-5 text-[10px] font-bold text-[var(--text-muted)] text-center">
        {coin.marketCapRank || '?'}
      </span>

      {/* Icon + Name */}
      <img
        src={coin.thumb}
        alt={coin.name}
        className="w-7 h-7 rounded-full"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-[var(--text-primary)] truncate">{coin.name}</div>
        <div className="text-[10px] text-[var(--text-muted)]">{coin.symbol}</div>
      </div>

      {/* Price info */}
      <div className="text-right shrink-0">
        <div className="text-xs font-mono font-medium text-[var(--text-primary)]">
          {formatPrice(coin.priceUsd)}
        </div>
        <div className="flex items-center justify-end gap-0.5">
          {isPositive ? (
            <TrendingUp className="w-2.5 h-2.5 text-[var(--positive)]" />
          ) : (
            <TrendingDown className="w-2.5 h-2.5 text-[var(--negative)]" />
          )}
          <span
            className={cn(
              'text-[10px] font-mono font-bold',
              isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
            )}
          >
            {isPositive ? '+' : ''}
            {coin.priceChangePct24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
