'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAIRS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD'];
const ORDER_TYPES = ['Market', 'Limit', 'Stop-Limit'];
const TIMES = ['GTC', 'IOC', 'FOK'];

export function TradePage() {
  const [pair, setPair] = useState('BTC/USD');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState('Market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState('GTC');

  const prices: Record<string, string> = {
    'BTC/USD': '68,372.45',
    'ETH/USD': '3,521.80',
    'SOL/USD': '182.45',
    'XRP/USD': '0.5842',
  };

  const currentPrice = prices[pair] || '0.00';

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-black text-[var(--text-primary)]">Trade</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Place orders on Kraken exchange</p>
      </div>

      <div className="flex gap-6">
        {/* Order form */}
        <div className="w-96 shrink-0">
          <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
            {/* Pair selector */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="relative">
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="w-full appearance-none bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)]"
                >
                  {PAIRS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              </div>
              <div className="mt-2 text-xs text-[var(--text-muted)]">
                Current price: <span className="font-mono font-bold text-[var(--text-primary)]">{currentPrice}</span>
              </div>
            </div>

            {/* Buy/Sell toggle */}
            <div className="grid grid-cols-2 border-b border-[var(--border)]">
              <button
                onClick={() => setSide('buy')}
                className={cn(
                  'flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all',
                  side === 'buy'
                    ? 'bg-[var(--positive)] text-[var(--bg-void)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                )}
              >
                <ArrowDownRight className="w-4 h-4" />
                Buy
              </button>
              <button
                onClick={() => setSide('sell')}
                className={cn(
                  'flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all',
                  side === 'sell'
                    ? 'bg-[var(--negative)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                )}
              >
                <ArrowUpRight className="w-4 h-4" />
                Sell
              </button>
            </div>

            {/* Order type */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Order Type</div>
              <div className="flex gap-2">
                {ORDER_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-bold transition-all',
                      orderType === type
                        ? 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-active)]'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-active)]'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Amount</label>
                <span className="text-[10px] text-[var(--text-muted)]">Available: <span className="font-mono font-bold">12,420 USDC</span></span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base font-mono font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">{pair.split('/')[0]}</span>
              </div>
            </div>

            {/* Price (for limit orders) */}
            {orderType !== 'Market' && (
              <div className="p-4 border-b border-[var(--border)]">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Price</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={currentPrice}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base font-mono font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">USDC</span>
                </div>
              </div>
            )}

            {/* Time in force */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Time in Force</label>
              </div>
              <div className="flex gap-2">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeInForce(t)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all',
                      timeInForce === t
                        ? 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-active)]'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3 text-xs text-[var(--text-muted)]">
                <span>Est. Total</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {amount ? `$${(parseFloat(amount) * parseFloat(price || currentPrice.replace(',',''))).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '--'}
                </span>
              </div>
              <button
                className={cn(
                  'w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-95',
                  side === 'buy'
                    ? 'bg-[var(--positive)] text-[var(--bg-void)] hover:brightness-110 shadow-[0_0_20px_rgba(57,255,20,0.2)]'
                    : 'bg-[var(--negative)] text-white hover:brightness-110 shadow-[0_0_20px_rgba(255,59,107,0.2)]'
                )}
              >
                {side === 'buy' ? 'Buy' : 'Sell'} {pair.split('/')[0]}
              </button>
            </div>
          </div>
        </div>

        {/* Order book preview */}
        <div className="flex-1">
          <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Order Book — {pair}</h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Spread: $0.50</span>
            </div>
            <div className="grid grid-cols-3 px-4 py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>
            {/* Asks */}
            <div className="max-h-48 overflow-hidden">
              {[68.372, 68.371, 68.370, 68.369, 68.368].map((p, i) => (
                <div key={`ask-${i}`} className="grid grid-cols-3 px-4 py-1.5 text-[11px] font-mono">
                  <span className="text-[var(--negative)]">{(68372 + i * 0.5).toFixed(2)}</span>
                  <span className="text-right text-[var(--text-secondary)]">{(Math.random() * 2).toFixed(4)}</span>
                  <span className="text-right text-[var(--text-muted)]">{(Math.random() * 1000).toFixed(0)}</span>
                </div>
              ))}
            </div>
            {/* Mid */}
            <div className="px-4 py-2 bg-[var(--bg-surface)] border-y border-[var(--border)] text-center">
              <span className="text-base font-black font-mono text-[var(--accent)]">{currentPrice}</span>
            </div>
            {/* Bids */}
            <div className="max-h-48 overflow-hidden">
              {[68.371, 68.370, 68.369, 68.368, 68.367].map((p, i) => (
                <div key={`bid-${i}`} className="grid grid-cols-3 px-4 py-1.5 text-[11px] font-mono">
                  <span className="text-[var(--positive)]">{(68371.5 - i * 0.5).toFixed(2)}</span>
                  <span className="text-right text-[var(--text-secondary)]">{(Math.random() * 2).toFixed(4)}</span>
                  <span className="text-right text-[var(--text-muted)]">{(Math.random() * 1000).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
