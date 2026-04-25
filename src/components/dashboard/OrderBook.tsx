'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OrderBookEntry {
  price: string;
  size: string;
  total: number;
}

function generateEntries(base: number, direction: 'bid' | 'ask', count = 12): OrderBookEntry[] {
  const entries: OrderBookEntry[] = [];
  let price = base;
  for (let i = 0; i < count; i++) {
    const step = direction === 'bid' ? -0.5 : 0.5;
    price = base + step * (i + 1);
    const size = (Math.random() * 3 + 0.1).toFixed(4);
    entries.push({
      price: price.toFixed(2),
      size,
      total: parseFloat(size) * price,
    });
  }
  return entries;
}

const BASE_PRICE = 68372.45;

export function OrderBook() {
  const [bids, setBids] = useState(() => generateEntries(BASE_PRICE, 'bid'));
  const [asks, setAsks] = useState(() => generateEntries(BASE_PRICE, 'ask'));
  const [spread, setSpread] = useState('0.50');

  useEffect(() => {
    const interval = setInterval(() => {
      setBids((prev) => {
        return prev.map((e) => {
          const delta = (Math.random() - 0.5) * 0.05;
          const newSize = Math.max(0.01, parseFloat(e.size) + delta).toFixed(4);
          return { ...e, size: newSize, total: parseFloat(newSize) * parseFloat(e.price) };
        });
      });
      setAsks((prev) => {
        return prev.map((e) => {
          const delta = (Math.random() - 0.5) * 0.05;
          const newSize = Math.max(0.01, parseFloat(e.size) + delta).toFixed(4);
          return { ...e, size: newSize, total: parseFloat(newSize) * parseFloat(e.price) };
        });
      });
      setSpread((prev) => {
        const current = parseFloat(prev);
        const newSpread = Math.max(0.1, current + (Math.random() - 0.5) * 0.2);
        return newSpread.toFixed(2);
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const maxTotal = Math.max(
    ...bids.map((b) => b.total),
    ...asks.map((a) => a.total)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Order Book</h3>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[var(--text-muted)]">Spread</span>
          <span className="font-mono font-bold text-[var(--accent)]">{spread}</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-4 py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] shrink-0">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks — reversed so lowest ask at bottom */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        {[...asks].reverse().map((ask, i) => {
          const depthPct = Math.min((ask.total / maxTotal) * 100, 100);
          return (
            <div key={`ask-${i}`} className="relative grid grid-cols-3 px-4 py-[3px] text-[11px] font-mono group hover:bg-[var(--bg-elevated)]/50 transition-colors cursor-pointer">
              <div
                className="absolute inset-y-0 right-0 bg-[var(--negative)]/8 pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-[var(--negative)] relative z-10 font-medium">{ask.price}</span>
              <span className="text-[var(--text-secondary)] text-right relative z-10">{ask.size}</span>
              <span className="text-[var(--text-muted)] text-right relative z-10">{ask.total.toFixed(0)}</span>
            </div>
          );
        })}
      </div>

      {/* Mid price */}
      <div className="px-4 py-2.5 bg-[var(--bg-elevated)] border-y border-[var(--border)] shrink-0">
        <div className="flex items-center justify-center gap-3">
          <span className="text-base font-black font-mono text-[var(--accent)]">{BASE_PRICE.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Bids */}
      <div className="flex-1 overflow-y-auto">
        {bids.map((bid, i) => {
          const depthPct = Math.min((bid.total / maxTotal) * 100, 100);
          return (
            <div key={`bid-${i}`} className="relative grid grid-cols-3 px-4 py-[3px] text-[11px] font-mono group hover:bg-[var(--bg-elevated)]/50 transition-colors cursor-pointer">
              <div
                className="absolute inset-y-0 right-0 bg-[var(--positive)]/8 pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-[var(--positive)] relative z-10 font-medium">{bid.price}</span>
              <span className="text-[var(--text-secondary)] text-right relative z-10">{bid.size}</span>
              <span className="text-[var(--text-muted)] text-right relative z-10">{bid.total.toFixed(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Trade {
  id: number;
  time: string;
  price: string;
  size: string;
  side: 'buy' | 'sell';
}

export function TradesTape() {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const initial: Trade[] = [];
    let id = 0;
    for (let i = 0; i < 20; i++) {
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      initial.push({
        id: id++,
        time: new Date(Date.now() - i * 2000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: (BASE_PRICE + (Math.random() - 0.5) * 10).toFixed(2),
        size: (Math.random() * 2 + 0.01).toFixed(4),
        side,
      });
    }
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const newTrade: Trade = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: (BASE_PRICE + (Math.random() - 0.5) * 10).toFixed(2),
        size: (Math.random() * 2 + 0.01).toFixed(4),
        side,
      };
      setTrades((prev) => [newTrade, ...prev.slice(0, 29)]);
    }, 500 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Recent Trades</h3>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">Time · Price · Size</span>
      </div>

      {/* Trades list */}
      <div className="flex-1 overflow-y-auto">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="grid grid-cols-3 px-4 py-[3px] text-[11px] font-mono hover:bg-[var(--bg-elevated)]/50 transition-colors animate-slide-down"
          >
            <span className="text-[var(--text-muted)]">{trade.time}</span>
            <span className={cn('text-right font-medium', trade.side === 'buy' ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {trade.price}
            </span>
            <span className="text-right text-[var(--text-secondary)]">{trade.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
