'use client';

import { useState } from 'react';
import { Zap, CheckCircle2, XCircle } from 'lucide-react';

type OrderType = 'market' | 'limit';
type Action = 'buy' | 'sell';

interface OrderResult {
  status: 'success' | 'error';
  message: string;
}

const PAIRS = ['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD', 'ADAUSD', 'DOGEUSD'];
const PRICES: Record<string, number> = { BTCUSD: 67245, ETHUSD: 3521, SOLUSD: 182, XRPUSD: 0.58, ADAUSD: 0.45, DOGEUSD: 0.15 };

export default function TradePanel() {
  const [action, setAction] = useState<Action>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [pair, setPair] = useState('BTCUSD');
  const [volume, setVolume] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volume) return;

    setLoading(true);
    setResult(null);

    try {
      const payload: Record<string, string> = { action, pair, volume };
      if (orderType === 'limit' && price) payload.price = price;

      const res = await fetch('/api/kraken/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error && data.error.length > 0) {
        setResult({ status: 'error', message: data.error[0] });
      } else {
        setResult({ status: 'success', message: `Order placed! TXID: ${data.txid?.[0] || 'N/A'}` });
        setVolume('');
        setPrice('');
      }
    } catch {
      setResult({ status: 'error', message: 'Network error. Try again.' });
    }

    setLoading(false);
  };

  const estimatedValue = () => {
    const p = PRICES[pair] || 0;
    const v = parseFloat(volume) || 0;
    const pr = parseFloat(price) || p;
    return `$${(v * pr).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-surface)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--accent)]" />
          Place Order
        </h2>
        <select
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          className="bg-[var(--bg-card)] text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--border-active)] transition-colors"
        >
          {PAIRS.map((p) => (
            <option key={p} value={p}>{p.replace('USD', '/USD')}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--bg-base)] rounded-2xl border border-[var(--border)]">
          {(['buy', 'sell'] as Action[]).map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setAction(act)}
              className={`py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                action === act
                  ? act === 'buy'
                    ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-gradient-to-b from-rose-500/20 to-rose-600/20 text-rose-400 border border-rose-500/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        {/* Order Type */}
        <div className="flex gap-2">
          {(['market', 'limit'] as OrderType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                orderType === type
                  ? 'bg-[var(--accent-glow)] text-[var(--accent)] border-[var(--border-active)]'
                  : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-active)]'
              }`}
            >
              {type === 'market' ? 'Market' : 'Limit'}
            </button>
          ))}
        </div>

        {/* Volume */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] mb-2">Amount</label>
          <div className="relative">
            <input
              type="number"
              step="0.0001"
              min="0"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-base font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] font-medium">
              {pair.replace('USD', '')}
            </span>
          </div>
        </div>

        {/* Limit Price */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-2">Price (USD)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-base font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">USD</span>
            </div>
          </div>
        )}

        {/* Estimated Total */}
        <div className="flex items-center justify-between text-sm px-4 py-3 bg-[var(--bg-base)] rounded-xl border border-[var(--border)]">
          <span className="text-[var(--text-muted)] font-medium">Estimated Total</span>
          <span className="text-[var(--text-primary)] font-bold font-mono">{estimatedValue()}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !volume}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl text-base font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${
            action === 'buy'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-[0_4px_20px_rgba(16,185,129,0.25)]'
              : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-[0_4px_20px_rgba(244,63,94,0.25)]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Processing...
            </span>
          ) : (
            `${action === 'buy' ? 'Buy' : 'Sell'} ${pair.replace('USD', '/USD')}`
          )}
        </button>

        {/* Result */}
        {result && (
          <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
            result.status === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {result.status === 'success'
              ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            }
            <span className="font-medium">{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
