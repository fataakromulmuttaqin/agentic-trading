'use client';

import { useState, useEffect } from 'react';

interface OrderBookEntry {
  price: string;
  volume: string;
  total: number;
}

const MOCK_BIDS: OrderBookEntry[] = [
  { price: '67,200.00', volume: '1.5421', total: 103.61 },
  { price: '67,190.00', volume: '2.3100', total: 155.18 },
  { price: '67,180.00', volume: '0.8934', total: 60.02 },
  { price: '67,170.00', volume: '3.2100', total: 215.61 },
  { price: '67,160.00', volume: '1.0234', total: 68.73 },
  { price: '67,150.00', volume: '0.5521', total: 37.07 },
  { price: '67,140.00', volume: '2.1000', total: 141.05 },
  { price: '67,130.00', volume: '0.7832', total: 52.58 },
  { price: '67,120.00', volume: '1.4532', total: 97.55 },
  { price: '67,110.00', volume: '0.6321', total: 42.43 },
];

const MOCK_ASKS: OrderBookEntry[] = [
  { price: '67,250.00', volume: '1.2100', total: 81.38 },
  { price: '67,260.00', volume: '2.0534', total: 138.02 },
  { price: '67,270.00', volume: '0.7421', total: 49.94 },
  { price: '67,280.00', volume: '1.8234', total: 122.73 },
  { price: '67,290.00', volume: '0.9123', total: 61.42 },
  { price: '67,300.00', volume: '2.1000', total: 141.33 },
  { price: '67,310.00', volume: '0.5532', total: 37.24 },
  { price: '67,320.00', volume: '1.3421', total: 90.37 },
  { price: '67,330.00', volume: '0.8234', total: 55.44 },
  { price: '67,340.00', volume: '1.1234', total: 75.66 },
];

export default function OrderBook() {
  const [bids, setBids] = useState(MOCK_BIDS);
  const [asks, setAsks] = useState(MOCK_ASKS);
  const [spread, setSpread] = useState('50.00');

  useEffect(() => {
    const interval = setInterval(() => {
      setBids((prev) =>
        prev.map((entry) => {
          const change = (Math.random() - 0.5) * 0.1;
          const newVol = Math.max(0.01, parseFloat(entry.volume) + change);
          return { ...entry, volume: newVol.toFixed(4), total: parseFloat(entry.price.replace(',', '')) * newVol };
        })
      );
      setAsks((prev) =>
        prev.map((entry) => {
          const change = (Math.random() - 0.5) * 0.1;
          const newVol = Math.max(0.01, parseFloat(entry.volume) + change);
          return { ...entry, volume: newVol.toFixed(4), total: parseFloat(entry.price.replace(',', '')) * newVol };
        })
      );
      const bestBid = parseFloat(MOCK_BIDS[0].price.replace(',', ''));
      const bestAsk = parseFloat(MOCK_ASKS[0].price.replace(',', ''));
      setSpread((bestAsk - bestBid).toFixed(2));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const maxTotal = Math.max(...bids.map((b) => b.total), ...asks.map((a) => a.total));

  return (
    <div className="h-full flex flex-col bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Order Book</h2>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-muted)]">Spread</span>
          <span className="text-[var(--accent)] font-mono font-medium">{spread}</span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-4 py-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] shrink-0">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        {[...asks].reverse().map((ask, i) => {
          const depthPct = Math.min((ask.total / maxTotal) * 100, 100);
          return (
            <div key={`ask-${i}`} className="relative grid grid-cols-3 px-4 py-2 text-sm font-mono">
              <div className="absolute inset-y-0 right-0 bg-rose-500/10" style={{ width: `${depthPct}%` }} />
              <span className="text-rose-400 relative z-10 font-medium">{ask.price}</span>
              <span className="text-[var(--text-secondary)] text-right relative z-10">{ask.volume}</span>
              <span className="text-[var(--text-muted)] text-right relative z-10">{ask.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* Mid Price */}
      <div className="px-4 py-3 bg-[var(--bg-card)] border-y border-[var(--border)] shrink-0">
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg font-bold text-emerald-400 font-mono">{MOCK_BIDS[0].price}</span>
          <span className="text-xs text-[var(--text-muted)] font-medium">BID / ASK</span>
          <span className="text-lg font-bold text-rose-400 font-mono">{MOCK_ASKS[0].price}</span>
        </div>
      </div>

      {/* Bids */}
      <div className="flex-1 overflow-y-auto">
        {bids.map((bid, i) => {
          const depthPct = Math.min((bid.total / maxTotal) * 100, 100);
          return (
            <div key={`bid-${i}`} className="relative grid grid-cols-3 px-4 py-2 text-sm font-mono">
              <div className="absolute inset-y-0 right-0 bg-emerald-500/10" style={{ width: `${depthPct}%` }} />
              <span className="text-emerald-400 relative z-10 font-medium">{bid.price}</span>
              <span className="text-[var(--text-secondary)] text-right relative z-10">{bid.volume}</span>
              <span className="text-[var(--text-muted)] text-right relative z-10">{bid.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
