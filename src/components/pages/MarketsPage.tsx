'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const MARKETS = [
  { symbol: 'BTC/USD', price: '68,372.45', change: '+5.24%', positive: true, vol: '24.8B', marketCap: '1.34T' },
  { symbol: 'ETH/USD', price: '3,521.80', change: '+2.15%', positive: true, vol: '12.3B', marketCap: '423B' },
  { symbol: 'SOL/USD', price: '182.45', change: '-0.83%', positive: false, vol: '3.1B', marketCap: '82B' },
  { symbol: 'XRP/USD', price: '0.5842', change: '+0.42%', positive: true, vol: '1.8B', marketCap: '32B' },
  { symbol: 'ADA/USD', price: '0.4521', change: '-1.12%', positive: false, vol: '890M', marketCap: '16B' },
  { symbol: 'DOGE/USD', price: '0.1523', change: '+3.21%', positive: true, vol: '1.2B', marketCap: '22B' },
  { symbol: 'AVAX/USD', price: '38.72', change: '+1.87%', positive: true, vol: '620M', marketCap: '14B' },
  { symbol: 'DOT/USD', price: '7.34', change: '-0.54%', positive: false, vol: '410M', marketCap: '9.8B' },
  { symbol: 'LINK/USD', price: '14.82', change: '+4.12%', positive: true, vol: '380M', marketCap: '8.7B' },
  { symbol: 'MATIC/USD', price: '0.7124', change: '+1.54%', positive: true, vol: '290M', marketCap: '6.6B' },
  { symbol: 'UNI/USD', price: '9.84', change: '-2.31%', positive: false, vol: '180M', marketCap: '5.9B' },
  { symbol: 'ATOM/USD', price: '8.92', change: '+0.87%', positive: true, vol: '145M', marketCap: '3.4B' },
];

const CATEGORIES = ['All', 'Crypto', 'DeFi', 'Layer 1', 'Layer 2', 'Meme'];

export function MarketsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['BTC/USD', 'ETH/USD']));

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const filtered = MARKETS.filter((m) => {
    const matchSearch = m.symbol.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Markets</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Real-time market data across all pairs</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded-full bg-[var(--positive)] animate-pulse" />
          <span>Live Prices</span>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search markets..."
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
        <div className="grid grid-cols-6 px-4 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">
          <span>Pair</span>
          <span>Price</span>
          <span>24h Change</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Market Cap</span>
          <span className="text-right">Actions</span>
        </div>
        {filtered.map((market, i) => (
          <div
            key={market.symbol}
            className={cn(
              'grid grid-cols-6 px-4 py-3.5 items-center hover:bg-[var(--bg-glass)] transition-colors cursor-pointer',
              i !== filtered.length - 1 && 'border-b border-[var(--border)]'
            )}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleFavorite(market.symbol)}
                className="focus:outline-none"
              >
                <Star
                  className={cn('w-4 h-4', favorites.has(market.symbol) ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)]')}
                />
              </button>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">{market.symbol}</div>
              </div>
            </div>
            <span className="text-sm font-mono font-medium text-[var(--text-primary)]">{market.price}</span>
            <div className="flex items-center gap-1">
              {market.positive ? (
                <TrendingUp className="w-3.5 h-3.5 text-[var(--positive)]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-[var(--negative)]" />
              )}
              <span className={cn('text-sm font-bold font-mono', market.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
                {market.change}
              </span>
            </div>
            <span className="text-sm font-mono text-[var(--text-secondary)] text-right">{market.vol}</span>
            <span className="text-sm font-mono text-[var(--text-secondary)] text-right">${market.marketCap}</span>
            <div className="flex items-center justify-end gap-2">
              <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-colors">
                Trade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
