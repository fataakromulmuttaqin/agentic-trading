'use client';

import { Bot, Play, Pause, Activity, TrendingUp, TrendingDown, Brain, ChevronRight, Plus, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'learning';
  pnl: string;
  pnlPct: number;
  confidence: number;
  trades: number;
  strategy: string;
  color: string;
  glowColor: string;
  description: string;
}

const AGENTS: Agent[] = [
  {
    id: 'alpha',
    name: 'Agent Alpha',
    status: 'active',
    pnl: '+$1,847.32',
    pnlPct: 3.24,
    confidence: 87,
    trades: 142,
    strategy: 'Momentum + SMC',
    color: '#00F0FF',
    glowColor: 'rgba(0,240,255,0.2)',
    description: 'Scans multiple timeframes for momentum shifts. Best performance during trending markets.',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    status: 'active',
    pnl: '+$932.18',
    pnlPct: 1.87,
    confidence: 73,
    trades: 89,
    strategy: 'Mean Reversion',
    color: '#A855F7',
    glowColor: 'rgba(168,85,247,0.2)',
    description: 'Identifies overbought/oversold conditions. Excels in range-bound sideways markets.',
  },
  {
    id: 'quantum',
    name: 'Quantum',
    status: 'paused',
    pnl: '-$124.50',
    pnlPct: -0.32,
    confidence: 61,
    trades: 34,
    strategy: 'Grid Trading',
    color: '#39FF14',
    glowColor: 'rgba(57,255,20,0.15)',
    description: 'Places grid orders at key levels. Currently paused during high volatility.',
  },
];

const INSIGHTS = [
  { text: 'BTC approaching resistance at $69,500 in next 4h', probability: 78, direction: 'bearish' as const },
  { text: 'ETH showing strong momentum, 82% continuation probability', probability: 82, direction: 'bullish' as const },
  { text: 'SOL volatility increasing, consider wider stops', probability: 65, direction: 'neutral' as const },
  { text: 'AVAX breakout imminent, 71% probability on 4H timeframe', probability: 71, direction: 'bullish' as const },
];

function AgentCard({ agent }: { agent: Agent }) {
  const isPositive = agent.pnlPct >= 0;
  const isPaused = agent.status === 'paused';

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-[var(--bg-elevated)] border border-[var(--border)]',
        'hover:border-[var(--border-active)] hover:scale-[1.01]',
        'active:scale-[0.99]'
      )}
      style={{ boxShadow: agent.status === 'active' ? `0 0 20px ${agent.glowColor}` : undefined }}
    >
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${agent.color}, transparent)` }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}40` }}
            >
              <Bot className="w-6 h-6" style={{ color: agent.color }} />
            </div>
            <div>
              <div className="text-base font-bold text-[var(--text-primary)]">{agent.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isPaused ? 'var(--accent-amber)' : 'var(--positive)',
                    boxShadow: isPaused ? '0 0 6px var(--accent-amber)' : '0 0 6px var(--positive)',
                  }}
                />
                <span className="text-[10px] font-semibold capitalize" style={{ color: isPaused ? 'var(--accent-amber)' : 'var(--positive)' }}>
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-base font-black font-mono', isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {agent.pnl}
            </div>
            <div className={cn('text-[10px] font-bold font-mono', isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {isPositive ? '+' : ''}{agent.pnlPct.toFixed(2)}%
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">{agent.description}</p>

        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider">Confidence</span>
            <span className="font-mono font-bold" style={{ color: agent.color }}>{agent.confidence}%</span>
          </div>
          <div className="h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${agent.confidence}%`, background: agent.color, boxShadow: `0 0 8px ${agent.glowColor}` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] mb-4">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>{agent.trades} trades</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>{agent.strategy}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95',
              isPaused
                ? 'bg-[var(--positive)]/10 text-[var(--positive)] border border-[var(--positive)]/30 hover:bg-[var(--positive)]/20'
                : 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border border-[var(--accent-amber)]/30 hover:bg-[var(--accent-amber)]/20'
            )}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-glass)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-active)] hover:text-[var(--accent)] transition-all duration-150 active:scale-95">
            Edit Strategy
          </button>
          <button className="px-3 py-2.5 rounded-xl bg-[var(--accent-glow)] border border-[var(--border-active)] hover:bg-[var(--accent)]/10 transition-all active:scale-95">
            <ChevronRight className="w-4 h-4 text-[var(--accent)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AgenticPage() {

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Agentic AI</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage and monitor your trading agents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-purple)] text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <Plus className="w-4 h-4" />
          Deploy New Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total P&L Today', value: '+$2,655.00', sub: '+4.79%', positive: true },
          { label: 'Active Agents', value: '2', sub: 'of 3', positive: true },
          { label: 'Total Trades', value: '265', sub: '24h', positive: true },
          { label: 'Avg Confidence', value: '74%', sub: '+3%', positive: true },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] p-4">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-xl font-black text-[var(--text-primary)]">{stat.value}</div>
            <div className={cn('text-[10px] font-bold font-mono mt-1', stat.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Agent list */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* AI Insights Panel */}
        <div className="w-80 shrink-0">
          <div className="rounded-2xl bg-[var(--accent-purple-glow)] border border-[var(--accent-purple)]/30 overflow-hidden sticky top-0">
            <div className="px-4 py-3 border-b border-[var(--accent-purple)]/20">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[var(--accent-purple)]" />
                <span className="text-xs font-bold text-[var(--accent-purple)]">AI Market Insights</span>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {INSIGHTS.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <div className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center shrink-0',
                    insight.direction === 'bullish' ? 'bg-[var(--positive)]/15 text-[var(--positive)]' :
                    insight.direction === 'bearish' ? 'bg-[var(--negative)]/15 text-[var(--negative)]' :
                    'bg-[var(--accent)]/15 text-[var(--accent)]'
                  )}>
                    {insight.direction === 'bullish' ? <TrendingUp className="w-3.5 h-3.5" /> :
                     insight.direction === 'bearish' ? <TrendingDown className="w-3.5 h-3.5" /> :
                     <Zap className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{insight.text}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 bg-[var(--bg-base)] rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', insight.direction === 'bullish' ? 'bg-[var(--positive)]' : insight.direction === 'bearish' ? 'bg-[var(--negative)]' : 'bg-[var(--accent)]')}
                          style={{ width: `${insight.probability}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">{insight.probability}%</span>
                    </div>
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
