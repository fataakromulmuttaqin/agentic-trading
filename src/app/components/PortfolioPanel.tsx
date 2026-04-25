'use client';

import useSWR from 'swr';
import { TrendingUp, TrendingDown, Wallet, RefreshCw } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BalanceData {
  [asset: string]: { total?: string } | string;
}

interface AssetHolding {
  asset: string;
  amount: string;
  value: string;
  change24h: string;
  positive: boolean;
  color: string;
}

const MOCK_HOLDINGS: AssetHolding[] = [
  { asset: 'BTC', amount: '0.0521', value: '$3,502.45', change24h: '+1.24%', positive: true, color: '#F7931A' },
  { asset: 'ETH', amount: '1.2340', value: '$4,344.82', change24h: '+2.15%', positive: true, color: '#627EEA' },
  { asset: 'SOL', amount: '12.5000', value: '$2,280.63', change24h: '-0.83%', positive: false, color: '#00FFA3' },
  { asset: 'USDT', amount: '1,250.00', value: '$1,250.00', change24h: '0.00%', positive: true, color: '#26A17B' },
];

export default function PortfolioPanel() {
  const { data, error, isValidating } = useSWR<BalanceData>('/api/kraken/balance', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const holdings = MOCK_HOLDINGS;
  const totalValue = holdings.reduce((acc, h) => acc + parseFloat(h.value.replace(/[$,]/g, '')), 0);
  const totalChange = holdings.reduce((acc, h) => {
    const val = parseFloat(h.value.replace(/[$,]/g, ''));
    const pct = parseFloat(h.change24h.replace(/[%+-]/g, '')) / 100;
    return acc + val * pct;
  }, 0);
  const totalChangePct = (totalChange / totalValue) * 100;
  const isPositive = totalChange >= 0;

  return (
    <div className="h-full flex flex-col bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[var(--accent)]" />
          Portfolio
        </h2>
        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw className={`w-4 h-4 text-[var(--text-muted)] ${isValidating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Total Balance */}
      <div className="px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        <div className="text-[10px] text-[var(--text-muted)] mb-1 font-semibold uppercase tracking-wider">Total Balance</div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className={`flex items-center gap-1 text-xs font-bold mb-1 ${isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositive ? '+' : ''}{totalChangePct.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="px-4 py-8 text-center">
            <div className="text-rose-400 text-sm mb-1">Failed to load balance</div>
            <div className="text-[var(--text-muted)] text-xs">Check API credentials</div>
          </div>
        )}

        {data && !data.error && Object.keys(data).length === 0 && (
          <div className="px-4 py-8 text-center">
            <div className="text-[var(--text-secondary)] text-sm mb-1">No assets found</div>
            <div className="text-[var(--text-muted)] text-xs">Deposit funds to get started</div>
          </div>
        )}

        {!data && !error && (
          <div className="px-4 py-8 text-center">
            <div className="animate-pulse flex justify-center mb-2">
              <div className="w-24 h-2 bg-[var(--bg-elevated)] rounded" />
            </div>
            <div className="text-[var(--text-muted)] text-xs">Loading portfolio...</div>
          </div>
        )}

        {holdings.map((holding) => (
          <div
            key={holding.asset}
            className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-[var(--border)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
                style={{ backgroundColor: `${holding.color}15`, border: `1px solid ${holding.color}30`, color: holding.color }}
              >
                {holding.asset.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{holding.asset}</div>
                <div className="text-xs text-[var(--text-muted)]">{holding.amount}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{holding.value}</div>
              <div className={`text-xs font-medium ${holding.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                {holding.change24h}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[var(--border)] shrink-0">
        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <span>Powered by Kraken</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--positive)] animate-pulse-dot" />
            Auto-refresh: 30s
          </span>
        </div>
      </div>
    </div>
  );
}
