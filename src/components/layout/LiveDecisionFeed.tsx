'use client';

import { useState, useEffect, useRef } from 'react';
import { Brain, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionEntry {
  id: string;
  agent: string;
  agentColor: string;
  action: string;
  asset: string;
  reasoning: string;
  timestamp: Date;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

const INITIAL_DECISIONS: DecisionEntry[] = [
  {
    id: 'd1',
    agent: 'Alpha',
    agentColor: '#00F5FF',
    action: 'BUY',
    asset: 'BTC/USD',
    reasoning: 'Momentum breakout above $69,500 resistance with volume confirmation. RSI divergence positive.',
    timestamp: new Date(Date.now() - 12 * 1000),
    sentiment: 'bullish',
  },
  {
    id: 'd2',
    agent: 'Nebula',
    agentColor: '#A855F7',
    action: 'HOLD',
    asset: 'ETH/USD',
    reasoning: 'Consolidating near support. Awaiting clearer signal before committing additional capital.',
    timestamp: new Date(Date.now() - 28 * 1000),
    sentiment: 'neutral',
  },
  {
    id: 'd3',
    agent: 'Quantum',
    agentColor: '#FF3366',
    action: 'SELL',
    asset: 'SOL/USD',
    reasoning: 'Grid levels hit. Taking profit at 182.45 target as planned.',
    timestamp: new Date(Date.now() - 45 * 1000),
    sentiment: 'bearish',
  },
  {
    id: 'd4',
    agent: 'Alpha',
    agentColor: '#00F5FF',
    action: 'CLOSE',
    asset: 'DOGE/USD',
    reasoning: 'Stop-loss triggered. Position closed at 0.1480 for -1.2% loss.',
    timestamp: new Date(Date.now() - 67 * 1000),
    sentiment: 'bearish',
  },
];

function formatTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

function TypewriterText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}<span className="animate-pulse-dot">|</span></span>;
}

function DecisionCard({ entry, isNew }: { entry: DecisionEntry; isNew: boolean }) {
  const sentimentColor = entry.sentiment === 'bullish' ? 'var(--positive)' : entry.sentiment === 'bearish' ? 'var(--negative)' : 'var(--accent)';

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden transition-all duration-300',
        'bg-[var(--bg-elevated)] border border-[var(--border)]',
        'hover:border-[var(--border-active)]',
        isNew ? 'animate-slide-up' : ''
      )}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: entry.agentColor }} />

      <div className="pl-3 pr-3 py-2.5">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black"
            style={{ background: `${entry.agentColor}20`, border: `1px solid ${entry.agentColor}40`, color: entry.agentColor }}
          >
            {entry.agent[0]}
          </div>
          <span className="text-[10px] font-bold" style={{ color: entry.agentColor }}>{entry.agent}</span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase"
            style={{ color: sentimentColor, background: `${sentimentColor}15`, border: `1px solid ${sentimentColor}30` }}
          >
            {entry.action}
          </span>
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] ml-auto">{entry.asset}</span>
          <div className="flex items-center gap-1 text-[9px] text-[var(--text-muted)]">
            <Clock className="w-3 h-3" />
            {formatTime(entry.timestamp)}
          </div>
        </div>

        {/* Reasoning with typewriter */}
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pl-7">
          <TypewriterText text={entry.reasoning} speed={15} />
        </p>
      </div>
    </div>
  );
}

export function LiveDecisionFeed() {
  const [entries, setEntries] = useState<DecisionEntry[]>(INITIAL_DECISIONS);
  const [collapsed, setCollapsed] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Simulate new decisions arriving periodically
  useEffect(() => {
    const actions = ['BUY', 'SELL', 'HOLD', 'CLOSE', 'SCALE UP', 'SCALE DOWN'];
    const assets = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD', 'ADA/USD', 'DOGE/USD', 'AVAX/USD'];
    const agents = [
      { name: 'Alpha', color: '#00F5FF' },
      { name: 'Nebula', color: '#A855F7' },
      { name: 'Quantum', color: '#FF3366' },
    ];
    const reasonings = [
      'Order book imbalance detected. Heavy sell wall dissolving at current level.',
      'Funding rate shift indicates potential market direction change. Monitoring closely.',
      'On-chain whale activity suggests accumulation phase. Position sizing adjusted.',
      'Volatility compression detected. Expecting breakout move within next 15-30 minutes.',
      'Correlation matrix showing sector rotation. Reducing altcoin exposure.',
      'Risk-off sentiment building. Hedging 20% of BTC position with perpetual shorts.',
      'Time-weighted decision making. No action taken - parameters not met.',
    ];
    const sentiments: Array<'bullish' | 'bearish' | 'neutral'> = ['bullish', 'bearish', 'neutral'];

    const interval = setInterval(() => {
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const newEntry: DecisionEntry = {
        id: `d${Date.now()}`,
        agent: agent.name,
        agentColor: agent.color,
        action: actions[Math.floor(Math.random() * actions.length)],
        asset: assets[Math.floor(Math.random() * assets.length)],
        reasoning: reasonings[Math.floor(Math.random() * reasonings.length)],
        timestamp: new Date(),
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      };

      setNewIds(new Set([newEntry.id]));
      setEntries((prev) => {
        const updated = [newEntry, ...prev];
        return updated.slice(0, 8);
      });

      setTimeout(() => setNewIds(new Set()), 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 w-[340px] z-50 rounded-2xl overflow-hidden',
        'bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl',
        'transition-all duration-300',
        collapsed ? 'h-12' : 'max-h-[420px]'
      )}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 h-12 border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]/50 transition-colors shrink-0"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[var(--accent-purple)]" />
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">AI Decision Feed</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--accent-purple-glow)] border border-[var(--accent-purple)]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-pulse-dot" />
            <span className="text-[10px] font-bold text-[var(--accent-purple)]">LIVE</span>
          </div>
        </div>
        {collapsed ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        )}
      </button>

      {!collapsed && (
        <div className="p-2 space-y-2 overflow-y-auto max-h-[360px] scrollbar-hide">
          {entries.map((entry) => (
            <DecisionCard key={entry.id} entry={entry} isNew={newIds.has(entry.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
