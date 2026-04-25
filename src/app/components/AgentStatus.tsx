'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { Bot, Activity, Cpu, MemoryStick, Zap, Shield } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LogEntry {
  time: string;
  level: string;
  msg: string;
}

const AGENT_LOGS: LogEntry[] = [
  { time: '14:32:01', level: 'INFO', msg: 'Agent initialized' },
  { time: '14:32:05', level: 'INFO', msg: 'Connected to Kraken API' },
  { time: '14:32:10', level: 'INFO', msg: 'Portfolio: 4 assets detected' },
  { time: '14:32:15', level: 'WARN', msg: 'BTC position below threshold' },
  { time: '14:32:20', level: 'INFO', msg: 'Market scan: 6 pairs' },
  { time: '14:32:25', level: 'INFO', msg: 'No trade signals detected' },
  { time: '14:32:30', level: 'INFO', msg: 'Risk parameters within limits' },
  { time: '14:32:35', level: 'DEBUG', msg: 'WebSocket heartbeat OK' },
];

export default function AgentStatus() {
  const { data } = useSWR('/api/agent', fetcher, { refreshInterval: 10000 });
  const [logs] = useState(AGENT_LOGS);
  const [isEnabled, setIsEnabled] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const metrics = [
    { label: 'Status', value: isEnabled ? 'Active' : 'Paused', icon: Activity, color: isEnabled ? 'emerald' : 'gray' },
    { label: 'Max Trade', value: `$${data?.maxTradeUsd || 50}`, icon: Zap, color: 'cyan' },
    { label: 'CPU', value: '12%', icon: Cpu, color: 'blue' },
    { label: 'Memory', value: '48MB', icon: MemoryStick, color: 'violet' },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    gray: { bg: 'bg-gray-500/15', border: 'border-gray-500/30', text: 'text-gray-400' },
    cyan: { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    blue: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400' },
    violet: { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-400' },
  };

  const levelStyle = (level: string) => {
    if (level === 'ERROR') return 'bg-rose-500/20 text-rose-400';
    if (level === 'WARN') return 'bg-amber-500/20 text-amber-400';
    if (level === 'DEBUG') return 'bg-gray-500/20 text-gray-400';
    return 'bg-cyan-500/20 text-cyan-400';
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-blue-500/20 border border-[var(--border-active)] flex items-center justify-center">
            <Bot className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Hermes Agent</h2>
            <p className="text-xs text-[var(--text-muted)]">AI-powered trading</p>
          </div>
        </div>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`relative w-14 h-8 rounded-full transition-colors ${isEnabled ? 'bg-[var(--positive)]' : 'bg-[var(--text-muted)]'}`}
        >
          <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${isEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b border-[var(--border)] shrink-0">
        {metrics.map((m) => {
          const c = colorMap[m.color];
          const Icon = m.icon;
          return (
            <div key={m.label} className={`p-4 rounded-2xl border ${c.bg} ${c.border}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 text-[var(--text-secondary)]">{m.label}</span>
                <Icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <div className={`text-xl font-black ${c.text}`}>{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Logs */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] shrink-0">
          <Shield className="w-4 h-4 text-[var(--positive)]" />
          <span className="text-sm font-semibold text-[var(--text-secondary)]">Activity Log</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-xs text-[var(--text-muted)] font-mono shrink-0 mt-0.5">{log.time}</span>
              <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold ${levelStyle(log.level)}`}>{log.level}</span>
              <span className="text-sm text-[var(--text-secondary)]">{log.msg}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
