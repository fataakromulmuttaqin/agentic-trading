'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarket } from '@/components/providers/MarketProvider';

interface TickerItem {
  symbol: string;
  binanceSymbol: string;
  price: string;
  change: string;
  positive: boolean;
}

const TICKER_PAIRS: TickerItem[] = [
  { symbol: 'BTC/USD', binanceSymbol: 'BTCUSDT', price: '—', change: '—', positive: true },
  { symbol: 'ETH/USD', binanceSymbol: 'ETHUSDT', price: '—', change: '—', positive: true },
  { symbol: 'SOL/USD', binanceSymbol: 'SOLUSDT', price: '—', change: '—', positive: true },
  { symbol: 'XRP/USD', binanceSymbol: 'XRPUSDT', price: '—', change: '—', positive: true },
  { symbol: 'ADA/USD', binanceSymbol: 'ADAUSDT', price: '—', change: '—', positive: true },
  { symbol: 'DOGE/USD', binanceSymbol: 'DOGEUSDT', price: '—', change: '—', positive: true },
  { symbol: 'AVAX/USD', binanceSymbol: 'AVAXUSDT', price: '—', change: '—', positive: true },
  { symbol: 'DOT/USD', binanceSymbol: 'DOTUSDT', price: '—', change: '—', positive: true },
  { symbol: 'LINK/USD', binanceSymbol: 'LINKUSDT', price: '—', change: '—', positive: true },
  { symbol: 'MATIC/USD', binanceSymbol: 'MATICUSDT', price: '—', change: '—', positive: true },
  { symbol: 'ATOM/USD', binanceSymbol: 'ATOMUSDT', price: '—', change: '—', positive: true },
  { symbol: 'UNI/USD', binanceSymbol: 'UNIUSDT', price: '—', change: '—', positive: true },
];

function TickerCard({ item }: { item: TickerItem }) {
  return (
    <div className="flex items-center gap-2 px-4 shrink-0">
      <span className="text-[11px] font-bold text-[var(--text-primary)]">{item.symbol}</span>
      <span className="text-[11px] font-mono text-[var(--text-secondary)]">{item.price}</span>
      <span
        className={cn(
          'flex items-center gap-0.5 text-[10px] font-mono font-bold',
          item.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
        )}
      >
        {item.positive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {item.change}
      </span>
      <span className="w-px h-4 bg-[var(--border)] mx-2" />
    </div>
  );
}

export function RunningTicker() {
  const { tickers } = useMarket();
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();

  // Merge static pair labels with real ticker data
  const items: TickerItem[] = TICKER_PAIRS.map((pair) => {
    const t = tickers[pair.binanceSymbol];
    if (t) {
      return { ...pair, price: t.price, change: t.change, positive: t.positive };
    }
    return pair;
  });

  // Duplicate items for seamless loop
  const allItems = [...items, ...items, ...items];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime: number | null = null;
    const speed = 0.4; // pixels per frame

    const animate = (time: number) => {
      if (lastTime !== null) {
        const delta = time - lastTime;
        setOffset((prev) => {
          const maxOffset = -(container.scrollWidth / 3);
          const next = prev - (speed * delta) / 16;
          return next <= maxOffset ? 0 : next;
        });
      }
      lastTime = time;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [allItems.length]);

  return (
    <div className="h-8 flex items-center overflow-hidden bg-[var(--bg-base)] border-b border-[var(--border)] shrink-0">
      {/* Left fade gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="flex items-center whitespace-nowrap"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {allItems.map((item, i) => (
          <TickerCard key={`${item.symbol}-${i}`} item={item} />
        ))}
      </div>

      {/* Right fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />
    </div>
  );
}
