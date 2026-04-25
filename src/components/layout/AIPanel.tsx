'use client';

import { useState } from 'react';
import { Bot, Pause, Play, Activity, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Brain, Zap } from 'lucide-react';
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
  },
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
      {/* Glow bar top */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${agent.color}, transparent)` }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}40` }}
            >
              <Bot className="w-5 h-5" style={{ color: agent.color }} />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">{agent.name}</div>
              <div className="flex items-center gap-1.5">
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

          {/* P&L */}
          <div className="text-right">
            <div className={cn('text-sm font-black font-mono', isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {agent.pnl}
            </div>
            <div className={cn('text-[10px] font-bold font-mono', isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {isPositive ? '+' : ''}{agent.pnlPct.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
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

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] mb-3">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>{agent.trades} trades</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>{agent.strategy}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95',
              isPaused
                ? 'bg-[var(--positive)]/10 text-[var(--positive)] border border-[var(--positive)]/30 hover:bg-[var(--positive)]/20'
                : 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border border-[var(--accent-amber)]/30 hover:bg-[var(--accent-amber)]/20'
            )}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-[var(--bg-glass)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-active)] hover:text-[var(--accent)] transition-all duration-150 active:scale-95">
            Edit Strategy
          </button>
          <button className="px-3 py-2 rounded-xl text-xs font-bold bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-active)] hover:bg-[var(--accent)]/10 transition-all duration-150 active:scale-95">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function AIInsightCard() {
  const [insightExpanded, setInsightExpanded] = useState(true);

  const insights = [
    { text: 'BTC approaching resistance at $69,500 in next 4h', probability: 78, direction: 'bearish' },
    { text: 'ETH showing strong momentum, 82% continuation probability', probability: 82, direction: 'bullish' },
    { text: 'SOL volatility increasing, consider wider stops', probability: 65, direction: 'neutral' },
  ];

  return (
    <div className="rounded-2xl bg-[var(--accent-purple-glow)] border border-[var(--accent-purple)]/30 overflow-hidden">
      <button
        onClick={() => setInsightExpanded(!insightExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[var(--accent-purple)]" />
          <span className="text-xs font-bold text-[var(--accent-purple)]">AI Market Insight</span>
        </div>
        {insightExpanded ? (
          <ChevronDown className="w-4 h-4 text-[var(--accent-purple)]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-[var(--accent-purple)]" />
        )}
      </button>

      {insightExpanded && (
        <div className="px-4 pb-3 space-y-2">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className={cn(
                'w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                insight.direction === 'bullish' ? 'bg-[var(--positive)]/15 text-[var(--positive)]' :
                insight.direction === 'bearish' ? 'bg-[var(--negative)]/15 text-[var(--negative)]' :
                'bg-[var(--accent)]/15 text-[var(--accent)]'
              )}>
                {insight.direction === 'bullish' ? <TrendingUp className="w-3 h-3" /> :
                 insight.direction === 'bearish' ? <TrendingDown className="w-3 h-3" /> :
                 <Zap className="w-3 h-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{insight.text}</p>
                <div className="flex items-center gap-2 mt-1">
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
      )}
    </div>
  );
}

export function AIPanel({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const allPaused = AGENTS.every((a) => a.status === 'paused');

  return (
    <div
      className={cn(
        'border-t border-[var(--border)] bg-[var(--bg-base)] transition-all duration-300 overflow-hidden',
        collapsed ? 'h-12' : 'h-[220px]'
      )}
    >
      {/* Panel Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 h-12 border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[var(--accent-purple)]" />
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">AI Agent Control Center</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--positive)]/10 border border-[var(--positive)]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--positive)] animate-pulse-dot" />
            <span className="text-[10px] font-bold text-[var(--positive)]">2 Active</span>
          </div>
        </div>
        {collapsed ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        )}
      </button>

      {!collapsed && (
        <div className="h-[calc(100%-48px)] flex gap-3 p-3 overflow-hidden">
          {/* Agent cards */}
          <div className="flex-1 flex gap-3 overflow-x-auto scrollbar-hide">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="w-64 shrink-0">
                <AgentCard agent={agent} />
              </div>
            ))}
          </div>

          {/* Right side: AI Insight + Actions */}
          <div className="w-64 shrink-0 flex flex-col gap-2 overflow-y-auto">
            <AIInsightCard />
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-[10px] font-bold bg-[var(--accent-purple-glow)] text-[var(--accent-purple)] border border-[var(--accent-purple)]/30 hover:bg-[var(--accent-purple)]/20 transition-all active:scale-95">
                Deploy Agent
              </button>
              <button className={cn(
                'flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all active:scale-95',
                allPaused
                  ? 'bg-[var(--positive)]/10 text-[var(--positive)] border-[var(--positive)]/30 hover:bg-[var(--positive)]/20'
                  : 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border-[var(--accent-amber)]/30 hover:bg-[var(--accent-amber)]/20'
              )}>
                {allPaused ? 'Resume All' : 'Pause All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
