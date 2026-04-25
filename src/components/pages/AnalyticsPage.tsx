'use client';

import { Calendar, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const PERIODS = ['24H', '7D', '30D', '90D', 'All'];

const PERFORMANCE = [
  { period: '24H', pnl: '+$847.32', pnlPct: '+0.88%', trades: 12, winRate: '75%' },
  { period: '7D', pnl: '+$3,241.00', pnlPct: '+3.51%', trades: 48, winRate: '71%' },
  { period: '30D', pnl: '+$12,483.00', pnlPct: '+15.02%', trades: 186, winRate: '68%' },
  { period: '90D', pnl: '+$28,947.00', pnlPct: '+38.24%', trades: 512, winRate: '64%' },
  { period: 'All', pnl: '+$45,231.00', pnlPct: '+67.45%', trades: 1240, winRate: '61%' },
];

export function AnalyticsPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Analytics</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Trading performance and statistics</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-active)] transition-all">
          <Download className="w-3.5 h-3.5" />
          Export Report
        </button>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] w-fit">
        {PERIODS.map((p, i) => (
          <button
            key={p}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all',
              i === 2
                ? 'bg-[var(--accent)] text-[var(--bg-void)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total P&L', value: '+$12,483.00', sub: '+15.02%', positive: true },
          { label: 'Win Rate', value: '68%', sub: '126/186 trades', positive: true },
          { label: 'Avg Win', value: '+$124.50', sub: 'vs -$42.30 avg loss', positive: true },
          { label: 'Sharpe Ratio', value: '2.34', sub: 'Excellent', positive: true },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] p-4">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{stat.label}</div>
            <div className={cn('text-xl font-black', stat.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {stat.value}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Performance table */}
      <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Performance by Period</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {PERFORMANCE.map((p) => (
            <div key={p.period} className="flex items-center px-4 py-3.5 hover:bg-[var(--bg-glass)] transition-colors">
              <div className="w-20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
                  <Calendar className="w-3 h-3" />
                  {p.period}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-mono font-bold text-[var(--positive)]">{p.pnl}</div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">{p.pnlPct}</div>
              </div>
              <div className="w-24 text-right">
                <div className="text-sm font-mono text-[var(--text-primary)]">{p.trades}</div>
                <div className="text-[10px] text-[var(--text-muted)]">trades</div>
              </div>
              <div className="w-24 text-right">
                <div className="text-sm font-bold text-[var(--text-primary)]">{p.winRate}</div>
                <div className="text-[10px] text-[var(--text-muted)]">win rate</div>
              </div>
              <div className="w-32">
                <div className="h-2 bg-[var(--bg-base)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--positive)]" style={{ width: p.winRate }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
