'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Zap, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIGNALS = [
  { id: 1, type: 'bullish', asset: 'BTC/USD', signal: 'Breakout above $69,000', entry: '$69,000', target: '$72,500', stop: '$67,200', probability: 78, timeframe: '4H', age: '2m ago', active: true },
  { id: 2, type: 'bullish', asset: 'ETH/USD', signal: 'Golden cross confirmed on 1D', entry: '$3,480', target: '$3,800', stop: '$3,320', probability: 72, timeframe: '1D', age: '15m ago', active: true },
  { id: 3, type: 'bearish', asset: 'SOL/USD', signal: 'RSI overbought, reversal likely', entry: '$184.00', target: '$172.00', stop: '$188.00', probability: 65, timeframe: '1H', age: '1h ago', active: true },
  { id: 4, type: 'bullish', asset: 'AVAX/USD', signal: 'Breaking out of descending triangle', entry: '$38.50', target: '$42.00', stop: '$36.80', probability: 71, timeframe: '4H', age: '3h ago', active: false },
  { id: 5, type: 'neutral', asset: 'XRP/USD', signal: 'Range bound, await breakout', entry: '$0.580', target: '$0.620', stop: '$0.550', probability: 60, timeframe: '1H', age: '5h ago', active: false },
];

export function SignalsPage() {
  const [signals, setSignals] = useState(SIGNALS);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

  const toggleActive = (id: number) => {
    setSignals((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };

  const filtered = signals.filter((s) => {
    if (filter === 'active') return s.active;
    if (filter === 'closed') return !s.active;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Signals</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">AI-generated trading signals</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded-full bg-[var(--positive)] animate-pulse" />
          <span>3 Active Signals</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] w-fit">
        {(['all', 'active', 'closed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all',
              filter === f
                ? 'bg-[var(--accent)] text-[var(--bg-void)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {f === 'all' ? 'All Signals' : f === 'active' ? 'Active' : 'Closed'}
          </button>
        ))}
      </div>

      {/* Signals list */}
      <div className="space-y-3">
        {filtered.map((signal) => (
          <div
            key={signal.id}
            className={cn(
              'rounded-2xl border transition-all duration-300 overflow-hidden',
              signal.active
                ? 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-[var(--border-active)]'
                : 'bg-[var(--bg-surface)] border-[var(--border)]/50 opacity-70'
            )}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    signal.type === 'bullish' ? 'bg-[var(--positive)]/15 text-[var(--positive)]' :
                    signal.type === 'bearish' ? 'bg-[var(--negative)]/15 text-[var(--negative)]' :
                    'bg-[var(--accent)]/15 text-[var(--accent)]'
                  )}>
                    {signal.type === 'bullish' ? <TrendingUp className="w-5 h-5" /> :
                     signal.type === 'bearish' ? <TrendingDown className="w-5 h-5" /> :
                     <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">{signal.signal}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-base)] px-2 py-0.5 rounded">{signal.asset}</span>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-base)] px-2 py-0.5 rounded">{signal.timeframe}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{signal.age}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'text-xs font-bold',
                    signal.type === 'bullish' ? 'text-[var(--positive)]' :
                    signal.type === 'bearish' ? 'text-[var(--negative)]' :
                    'text-[var(--accent)]'
                  )}>
                    {signal.probability}% probability
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={() => toggleActive(signal.id)}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        signal.active
                          ? 'text-[var(--accent)] hover:bg-[var(--accent)]/10'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                      )}
                    >
                      {signal.active ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Entry', value: signal.entry },
                  { label: 'Target', value: signal.target },
                  { label: 'Stop Loss', value: signal.stop },
                ].map((level) => (
                  <div key={level.label} className="bg-[var(--bg-base)] rounded-xl px-3 py-2">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">{level.label}</div>
                    <div className="text-sm font-mono font-bold text-[var(--text-primary)] mt-0.5">{level.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
