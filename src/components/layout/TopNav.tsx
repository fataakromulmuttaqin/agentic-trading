'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useMarket } from '@/components/providers/MarketProvider';

const PAIRS = [
  { symbol: 'BTC/USD', binanceSymbol: 'BTCUSDT' },
  { symbol: 'ETH/USD', binanceSymbol: 'ETHUSDT' },
  { symbol: 'SOL/USD', binanceSymbol: 'SOLUSDT' },
  { symbol: 'XRP/USD', binanceSymbol: 'XRPUSDT' },
  { symbol: 'ADA/USD', binanceSymbol: 'ADAUSDT' },
  { symbol: 'DOGE/USD', binanceSymbol: 'DOGEUSDT' },
  { symbol: 'AVAX/USD', binanceSymbol: 'AVAXUSDT' },
  { symbol: 'DOT/USD', binanceSymbol: 'DOTUSDT' },
];

type TickerDisplay = {
  price: string;
  change: string;
  positive: boolean;
  volume: string;
  high: string;
  low: string;
};

function AssetSelector({
  selected,
  onSelect,
  tickers,
}: {
  selected: (typeof PAIRS)[0];
  onSelect: (pair: (typeof PAIRS)[0]) => void;
  tickers: Record<string, TickerDisplay>;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = PAIRS.filter((p) =>
    p.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTicker = tickers[selected.binanceSymbol];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-3 px-4 py-2 rounded-xl',
          'bg-[var(--bg-elevated)] border border-[var(--border)]',
          'hover:border-[var(--border-active)] transition-all duration-150',
          'min-w-[220px]'
        )}
      >
        <div className="flex flex-col items-start">
          <span className="font-bold text-sm text-[var(--text-primary)]">{selected.symbol}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {selectedTicker?.price ?? '—'}
            </span>
            <span
              className={cn(
                'text-[10px] font-bold font-mono',
                selectedTicker?.positive !== false ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
              )}
            >
              {selectedTicker?.change ?? '—'}
            </span>
          </div>
        </div>
        {(selectedTicker?.positive !== false) ? (
          <TrendingUp className="w-4 h-4 text-[var(--positive)] ml-auto" />
        ) : (
          <TrendingDown className="w-4 h-4 text-[var(--negative)] ml-auto" />
        )}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--text-muted)] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-80 rounded-2xl overflow-hidden z-50 animate-scale-in"
          style={{ transformOrigin: 'top left' }}
        >
          <div className="p-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)]"
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto bg-[var(--bg-elevated)] border border-[var(--border)] rounded-b-2xl">
            {filtered.map((pair) => {
              const t = tickers[pair.binanceSymbol];
              return (
                <button
                  key={pair.symbol}
                  onClick={() => { onSelect(pair); setOpen(false); setSearch(''); }}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-glass-light)] transition-colors',
                    selected.symbol === pair.symbol && 'bg-[var(--accent-glow)]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black',
                        (t?.positive !== false) ? 'bg-[var(--positive)]/10 text-[var(--positive)]' : 'bg-[var(--negative)]/10 text-[var(--negative)]'
                      )}
                    >
                      {pair.symbol.slice(0, 1)}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{pair.symbol}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Vol: {t?.volume ?? '—'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-[var(--text-primary)]">{t?.price ?? '—'}</div>
                    <div className={cn('text-[10px] font-bold font-mono', (t?.positive !== false) ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
                      {t?.change ?? '—'}
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">No assets found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AgentPill() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-purple-glow)] border border-[var(--accent-purple)]/30 glow-purple">
      <div className="relative flex -space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full border border-[var(--accent-purple)] bg-[var(--accent-purple)]/60"
            style={{ zIndex: 3 - i }}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-[var(--accent-purple)]">3 Agents Live</span>
      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-pulse-dot" />
    </div>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);

  const notifications = [
    { id: 1, type: 'signal', text: 'BTC approaching resistance at $69,500', time: '2m ago', unread: true },
    { id: 2, type: 'trade', text: 'Agent Alpha closed ETH position +2.4%', time: '15m ago', unread: true },
    { id: 3, type: 'alert', text: 'SOL volume spike detected (3.2x avg)', time: '1h ago', unread: false },
  ];
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'relative w-9 h-9 rounded-lg flex items-center justify-center',
          'bg-[var(--bg-elevated)] border border-[var(--border)]',
          'hover:border-[var(--border-active)] transition-all duration-150',
          'active:scale-95'
        )}
      >
        <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent-rose)] text-[9px] font-black text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-80 rounded-2xl overflow-hidden z-50 animate-scale-in border border-[var(--border)]"
          style={{ transformOrigin: 'top right' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <span className="text-sm font-bold text-[var(--text-primary)]">Notifications</span>
            <button className="text-[10px] font-semibold text-[var(--accent)] hover:underline">Mark all read</button>
          </div>
          <div className="max-h-72 overflow-y-auto bg-[var(--bg-elevated)]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 hover:bg-[var(--bg-glass-light)] transition-colors border-b border-[var(--border)]',
                  n.unread && 'bg-[var(--accent-glow)]/5'
                )}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full mt-1.5 shrink-0',
                  n.unread ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] leading-snug">{n.text}</p>
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-elevated)] text-center">
            <button className="text-xs font-semibold text-[var(--accent)] hover:underline">View all notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TopNav() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const { tickers } = useMarket();

  const displayTickers: Record<string, TickerDisplay> = Object.fromEntries(
    Object.entries(tickers).map(([k, v]) => [k, {
      price: v.price,
      change: v.change,
      positive: v.positive,
      volume: v.volume,
      high: v.high,
      low: v.low,
    }])
  );

  const selectedTicker = displayTickers[selectedPair.binanceSymbol];

  return (
    <header className="h-14 flex items-center px-4 gap-4 border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-xl shrink-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 mobile-hidden">
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center font-black text-sm text-[var(--bg-void)] animate-glow-pulse">
            Δ
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--positive)] border-2 border-[var(--bg-base)]" />
        </div>
        <div>
          <span className="font-display text-sm tracking-tight text-[var(--text-primary)]">Δ-78</span>
          <span className="text-[var(--text-muted)] text-[10px] block -mt-0.5 leading-none">Agentic Trading</span>
        </div>
      </div>

      {/* Asset Selector — center */}
      <div className="flex-1 flex justify-center">
        <AssetSelector selected={selectedPair} onSelect={setSelectedPair} tickers={displayTickers} />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Live stats — desktop only */}
        <div className="hidden xl:flex items-center gap-4 text-[10px] mr-2">
          <div className="text-center">
            <div className="text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-0.5">24h High</div>
            <div className="font-mono font-semibold text-[var(--positive)]">{selectedTicker?.high ?? '—'}</div>
          </div>
          <div className="text-center">
            <div className="text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-0.5">24h Low</div>
            <div className="font-mono font-semibold text-[var(--negative)]">{selectedTicker?.low ?? '—'}</div>
          </div>
          <div className="text-center">
            <div className="text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-0.5">Volume</div>
            <div className="font-mono font-semibold text-[var(--text-secondary)]">{selectedTicker?.volume ?? '—'}</div>
          </div>
        </div>

        <AgentPill />
        <NotificationBell />
        <ThemeToggle />

        {/* User avatar */}
        <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent)] flex items-center justify-center font-bold text-sm text-white hover:scale-105 active:scale-95 transition-transform">
          F
        </button>
      </div>
    </header>
  );
}
