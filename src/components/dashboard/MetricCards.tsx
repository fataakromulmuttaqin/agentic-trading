'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  live?: boolean;
  delay?: number;
}

function MetricCard({ icon, label, value, change, positive = true, live = false, delay = 0 }: MetricCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-4 transition-all duration-300',
        'bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border)]',
        'hover:border-[var(--border-active)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,240,255,0.08)]',
        'active:scale-[0.98]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: positive
            ? 'radial-gradient(circle at top right, var(--positive) 0%, transparent 60%)'
            : 'radial-gradient(circle at top right, var(--negative) 0%, transparent 60%)',
        }}
      />

      {/* Icon */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center mb-3',
          positive
            ? 'bg-[var(--accent-lime-glow)] text-[var(--positive)]'
            : 'bg-[var(--accent-rose)]/10 text-[var(--negative)]'
        )}
      >
        {icon}
      </div>

      {/* Label */}
      <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
        {label}
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className="text-xl font-black font-mono text-[var(--text-primary)] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              'text-xs font-bold font-mono mb-0.5 flex items-center gap-0.5',
              positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
            )}
          >
            {positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>

      {/* Live indicator */}
      {live && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="live-dot" />
          <span className="text-[9px] font-black text-[var(--accent-rose)] uppercase tracking-widest">
            Live
          </span>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px var(--accent-glow)',
        }}
      />
    </div>
  );
}

interface MetricData {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  live?: boolean;
}

const INITIAL_METRICS: MetricData[] = [
  {
    id: 'portfolio',
    icon: <DollarSign className="w-4 h-4" />,
    label: 'Portfolio Value',
    value: '$127,845.32',
    change: '+12.45%',
    positive: true,
    live: true,
  },
  {
    id: 'pnl',
    icon: <BarChart3 className="w-4 h-4" />,
    label: "Today's P&L",
    value: '+$3,847.20',
    change: '+5.27%',
    positive: true,
    live: true,
  },
  {
    id: 'winrate',
    icon: <Activity className="w-4 h-4" />,
    label: 'Win Rate',
    value: '73.8%',
    change: '+2.1%',
    positive: true,
  },
  {
    id: 'active',
    icon: <Zap className="w-4 h-4" />,
    label: 'Active Positions',
    value: '8',
    change: '-3',
    positive: false,
  },
];

export function MetricCards() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          if (!m.live) return m;

          // Random walk for values
          const delta = (Math.random() - 0.5) * 0.002;
          const currentValue = parseFloat(m.value.replace(/[^0-9.-]/g, ''));
          const newValue = currentValue * (1 + delta);

          // Format based on original format
          let formatted: string;
          if (m.id === 'winrate') {
            formatted = `${newValue.toFixed(1)}%`;
          } else if (m.id === 'active') {
            formatted = Math.round(newValue).toString();
          } else {
            formatted = `$${newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }

          return { ...m, value: formatted };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.id}
          icon={metric.icon}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          positive={metric.positive}
          live={metric.live}
          delay={index * 100}
        />
      ))}
    </div>
  );
}
