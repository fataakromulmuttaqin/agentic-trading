'use client';

import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const HOLDINGS = [
  { asset: 'BTC', balance: '0.8342', value: '$57,045.12', pnl: '+$4,212.00', pnlPct: '+7.97%', positive: true, allocation: 42 },
  { asset: 'ETH', balance: '4.2180', value: '$14,856.32', pnl: '+$892.40', pnlPct: '+6.39%', positive: true, allocation: 11 },
  { asset: 'SOL', balance: '28.4400', value: '$5,190.47', pnl: '-$142.18', pnlPct: '-2.66%', positive: false, allocation: 4 },
  { asset: 'USDC', balance: '12,420.00', value: '$12,420.00', pnl: '$0.00', pnlPct: '0.00%', positive: true, allocation: 9 },
  { asset: 'KRW', balance: '8,420,000', value: '$6,234.00', pnl: '+$124.00', pnlPct: '+2.03%', positive: true, allocation: 5 },
];

const RECENT_TRANSACTIONS = [
  { type: 'buy', asset: 'BTC', amount: '0.0500', price: '$67,840.00', time: '2h ago', total: '$3,392.00' },
  { type: 'sell', asset: 'ETH', amount: '1.2000', price: '$3,480.00', time: '5h ago', total: '$4,176.00' },
  { type: 'buy', asset: 'SOL', amount: '10.0000', price: '$178.00', time: '8h ago', total: '$1,780.00' },
  { type: 'buy', asset: 'BTC', amount: '0.0200', price: '$68,100.00', time: '1d ago', total: '$1,362.00' },
];

const STATS = [
  { label: 'Total Portfolio Value', value: '$95,745.91', change: '+$5,086.22', changePct: '+5.61%', positive: true },
  { label: 'Available Cash', value: '$18,654.00', change: '+$240.00', changePct: '+1.30%', positive: true },
  { label: 'Total P&L (All Time)', value: '+$12,483.00', change: '+15.0%', changePct: '', positive: true },
  { label: 'Open Positions', value: '3', change: '2 active', changePct: '', positive: true },
];

export function PortfolioPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Portfolio</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Your holdings and asset allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-active)] transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] p-4">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-xl font-black text-[var(--text-primary)]">{stat.value}</div>
            {stat.change && (
              <div className={cn('text-[10px] font-bold font-mono mt-1', stat.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
                {stat.changePct ? `${stat.changePct} (${stat.change})` : stat.change}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Holdings table */}
        <div className="flex-1">
          <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Holdings</h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {HOLDINGS.map((h) => (
                <div key={h.asset} className="flex items-center px-4 py-3.5 hover:bg-[var(--bg-glass)] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center font-black text-sm text-[var(--accent)] mr-3">
                    {h.asset.slice(0, 1)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[var(--text-primary)]">{h.asset}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">{h.balance}</div>
                  </div>
                  <div className="text-right mr-6">
                    <div className="text-sm font-mono font-medium text-[var(--text-primary)]">{h.value}</div>
                    <div className={cn('text-[10px] font-bold font-mono', h.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
                      {h.pnlPct}
                    </div>
                  </div>
                  {/* Allocation bar */}
                  <div className="w-24">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-[var(--text-muted)]">Alloc</span>
                      <span className="font-mono font-bold text-[var(--text-secondary)]">{h.allocation}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${h.allocation}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="w-80 shrink-0">
          <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {RECENT_TRANSACTIONS.map((tx, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-glass)] transition-colors">
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                    tx.type === 'buy' ? 'bg-[var(--positive)]/15 text-[var(--positive)]' : 'bg-[var(--negative)]/15 text-[var(--negative)]'
                  )}>
                    {tx.type === 'buy' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)]">{tx.type.toUpperCase()} {tx.asset}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{tx.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-medium text-[var(--text-primary)]">{tx.total}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">@ {tx.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
