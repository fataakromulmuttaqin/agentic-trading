'use client';

import { useState } from 'react';
import { Bot, Pause, Play, Activity, Brain, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  pnl: string;
  pnlPct: number;
  confidence: number;
  trades: number;
  strategy: string;
  color: string;
  glowColor: string;
  avatar: string;
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
    color: '#00F5FF',
    glowColor: 'rgba(0,245,255,0.2)',
    avatar: 'A',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    status: 'paused',
    pnl: '+$932.18',
    pnlPct: 1.87,
    confidence: 73,
    trades: 89,
    strategy: 'Mean Reversion',
    color: '#A855F7',
    glowColor: 'rgba(168,85,247,0.2)',
    avatar: 'N',
  },
  {
    id: 'quantum',
    name: 'Quantum',
    status: 'error',
    pnl: '-$124.50',
    pnlPct: -0.32,
    confidence: 61,
    trades: 34,
    strategy: 'Grid Trading',
    color: '#FF3366',
    glowColor: 'rgba(255,51,102,0.2)',
    avatar: 'Q',
  },
];

function ConfidenceCircle({ value, color }: { value: number; color: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="var(--bg-base)"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black font-mono" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Agent['status'] }) {
  const config = {
    active: { label: 'ACTIVE', color: 'var(--positive)', bg: 'rgba(0,255,170,0.1)', border: 'rgba(0,255,170,0.3)' },
    paused: { label: 'PAUSED', color: 'var(--warning)', bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.3)' },
    error: { label: 'ERROR', color: 'var(--negative)', bg: 'rgba(255,51,102,0.1)', border: 'rgba(255,51,102,0.3)' },
  };
  const { label, color, bg, border } = config[status];

  return (
    <span
      className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {label}
    </span>
  );
}

interface AgentCardProps {
  agent: Agent;
  onTogglePause: (id: string) => void;
}

function AgentCard({ agent, onTogglePause }: AgentCardProps) {
  const isPositive = agent.pnlPct >= 0;
  const isPaused = agent.status === 'paused';
  const isError = agent.status === 'error';

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-[var(--bg-elevated)] border border-[var(--border)]',
        'hover:border-[var(--border-active)] hover:translate-y-[-2px]',
        'active:scale-[0.98]',
        isError && 'border-[var(--negative)]/30'
      )}
      style={{
        boxShadow: agent.status === 'active' ? `0 0 20px ${agent.glowColor}` : undefined,
      }}
    >
      {/* Glow bar top */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${agent.color}, transparent)` }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}40`, color: agent.color }}
            >
              {agent.avatar}
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">{agent.name}</div>
              <div className="mt-1">
                <StatusBadge status={agent.status} />
              </div>
            </div>
          </div>

          {/* Confidence Circle */}
          <ConfidenceCircle value={agent.confidence} color={agent.color} />
        </div>

        {/* P&L */}
        <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-[var(--bg-base)]">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">PnL</div>
          <div className="text-right">
            <div className={cn('text-sm font-black font-mono', isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {agent.pnl}
            </div>
            <div className={cn('text-[10px] font-bold font-mono', isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {isPositive ? '+' : ''}{agent.pnlPct.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Strategy */}
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-3 h-3 text-[var(--text-muted)]" />
          <span className="text-[11px] text-[var(--text-secondary)] truncate">{agent.strategy}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] mb-4">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>{agent.trades} trades</span>
          </div>
        </div>

        {/* Pause/Resume Button */}
        <button
          onClick={() => onTogglePause(agent.id)}
          disabled={isError}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95',
            isError
              ? 'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed'
              : isPaused
              ? 'bg-[var(--positive)]/10 text-[var(--positive)] border border-[var(--positive)]/30 hover:bg-[var(--positive)]/20'
              : 'bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30 hover:bg-[var(--warning)]/20'
          )}
        >
          {isError ? (
            <>
              <span>Error State</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface AIPanelProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AIPanel({ collapsed = false, onToggle }: AIPanelProps) {
  const [agents, setAgents] = useState(AGENTS);

  const handleTogglePause = (id: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id
          ? { ...agent, status: agent.status === 'paused' ? 'active' : 'paused' }
          : agent
      )
    );
  };

  const activeCount = agents.filter((a) => a.status === 'active').length;

  return (
    <div
      className={cn(
        'border-t border-[var(--border)] bg-[var(--bg-base)] transition-all duration-300 overflow-hidden',
        collapsed ? 'h-12' : 'h-auto min-h-[220px]'
      )}
    >
      {/* Panel Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 h-12 border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">AI Agent Control Center</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--positive)]/10 border border-[var(--positive)]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--positive)] animate-pulse-dot" />
            <span className="text-[10px] font-bold text-[var(--positive)]">{activeCount} Active</span>
          </div>
        </div>
        {collapsed ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        )}
      </button>

      {!collapsed && (
        <div className="p-4">
          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onTogglePause={handleTogglePause} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { AgentCard, ConfidenceCircle, StatusBadge };
export type { Agent };
