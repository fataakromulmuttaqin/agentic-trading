'use client';

import { TrendingUp, TrendingDown, Minus, Clock, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

type Sentiment = 'bullish' | 'bearish' | 'neutral';

interface AIInsight {
  id: string;
  sentiment: Sentiment;
  prediction: string;
  confidence: number;
  timestamp: Date;
  asset?: string;
}

const INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    sentiment: 'bullish',
    prediction: 'BTC approaching key resistance at $69,500. Momentum indicators suggest a 78% probability of breakout above this level within the next 4 hours.',
    confidence: 78,
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    asset: 'BTC/USD',
  },
  {
    id: 'insight-2',
    sentiment: 'bearish',
    prediction: 'ETH showing increasing sell pressure. On-chain metrics indicate distribution phase with potential 65% downside risk if $3,200 support breaks.',
    confidence: 65,
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
    asset: 'ETH/USD',
  },
];

function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const config = {
    bullish: {
      label: 'BULLISH',
      color: 'var(--positive)',
      bg: 'rgba(0,255,170,0.1)',
      border: 'rgba(0,255,170,0.3)',
      icon: TrendingUp,
    },
    bearish: {
      label: 'BEARISH',
      color: 'var(--negative)',
      bg: 'rgba(255,51,102,0.1)',
      border: 'rgba(255,51,102,0.3)',
      icon: TrendingDown,
    },
    neutral: {
      label: 'NEUTRAL',
      color: 'var(--accent)',
      bg: 'rgba(0,245,255,0.1)',
      border: 'rgba(0,245,255,0.3)',
      icon: Minus,
    },
  };

  const { label, color, bg, border, icon: Icon } = config[sentiment];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function ConfidenceBar({ value, sentiment }: { value: number; sentiment: Sentiment }) {
  const barColor =
    sentiment === 'bullish'
      ? 'var(--positive)'
      : sentiment === 'bearish'
      ? 'var(--negative)'
      : 'var(--accent)';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}`,
          }}
        />
      </div>
      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] w-8 text-right">
        {value}%
      </span>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface InsightCardProps {
  insight: AIInsight;
}

function InsightCard({ insight }: InsightCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-[var(--bg-elevated)] border border-[var(--border)]',
        'hover:border-[var(--border-active)] hover:translate-y-[-2px]',
        'active:scale-[0.98]'
      )}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            insight.sentiment === 'bullish'
              ? 'linear-gradient(90deg, var(--positive), transparent)'
              : insight.sentiment === 'bearish'
              ? 'linear-gradient(90deg, var(--negative), transparent)'
              : 'linear-gradient(90deg, var(--accent), transparent)',
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-[var(--accent-purple)]" />
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              AI Prediction
            </span>
          </div>
          <SentimentBadge sentiment={insight.sentiment} />
        </div>

        {/* Asset tag */}
        {insight.asset && (
          <div className="mb-2">
            <span className="text-[11px] font-bold text-[var(--text-secondary)]">{insight.asset}</span>
          </div>
        )}

        {/* Prediction text */}
        <p className="text-[12px] text-[var(--text-primary)] leading-relaxed mb-4">
          {insight.prediction}
        </p>

        {/* Confidence bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider">
              Confidence
            </span>
          </div>
          <ConfidenceBar value={insight.confidence} sentiment={insight.sentiment} />
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
          <Clock className="w-3 h-3" />
          <span>{formatTimestamp(insight.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

interface AIInsightPanelProps {
  insights?: AIInsight[];
}

export function AIInsightPanel({ insights = INSIGHTS }: AIInsightPanelProps) {
  return (
    <div className="border-t border-[var(--border)] bg-[var(--bg-base)]">
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-[var(--border)]">
        <Brain className="w-4 h-4 text-[var(--accent-purple)]" />
        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          AI Market Insights
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">Powered by Meridian</span>
      </div>

      {/* Insights Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { InsightCard, SentimentBadge, ConfidenceBar };
export type { AIInsight, Sentiment };
