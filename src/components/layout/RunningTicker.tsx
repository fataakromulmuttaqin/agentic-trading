'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  { symbol: 'BTC/USD', price: '68,372.45', change: '+5.24%', positive: true },
  { symbol: 'ETH/USD', price: '3,521.80', change: '+2.15%', positive: true },
  { symbol: 'SOL/USD', price: '182.45', change: '-0.83%', positive: false },
  { symbol: 'XRP/USD', price: '0.5842', change: '+0.42%', positive: true },
  { symbol: 'ADA/USD', price: '0.4521', change: '-1.12%', positive: false },
  { symbol: 'DOGE/USD', price: '0.1523', change: '+3.21%', positive: true },
  { symbol: 'AVAX/USD', price: '38.72', change: '+1.87%', positive: true },
  { symbol: 'DOT/USD', price: '7.34', change: '-0.54%', positive: false },
  { symbol: 'LINK/USD', price: '14.82', change: '+1.45%', positive: true },
  { symbol: 'MATIC/USD', price: '0.7182', change: '-0.92%', positive: false },
  { symbol: 'ATOM/USD', price: '8.42', change: '+0.78%', positive: true },
  { symbol: 'UNI/USD', price: '9.23', change: '-1.34%', positive: false },
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
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();

  // Duplicate items for seamless loop
  const allItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

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
  }, []);

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
