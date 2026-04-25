'use client';

import { useState } from 'react';
import { Menu, X, Bot, LineChart, LayoutDashboard } from 'lucide-react';
import { TopNav } from '@/components/layout/TopNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightPanel } from '@/components/layout/RightPanel';
import { AIPanel } from '@/components/layout/AIPanel';
import { ChartArea } from '@/components/dashboard/ChartArea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

// Mobile nav items
const MOBILE_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: LineChart },
  { id: 'agentic', label: 'Agents', icon: Bot, active: true },
];

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-void)] overflow-hidden">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* ─── Desktop / Tablet Layout ─── */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden">
          {/* Main Area: Chart + Right Panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chart — main area */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-[var(--border)]">
              <div className="flex-1 min-h-0 overflow-hidden">
                <ChartArea />
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-80 xl:w-96 shrink-0 overflow-hidden mobile-hidden">
              <RightPanel />
            </div>
          </div>

          {/* AI Agent Control Panel */}
          <AIPanel
            collapsed={aiPanelCollapsed}
            onToggle={() => setAiPanelCollapsed(!aiPanelCollapsed)}
          />
        </div>

        {/* ─── Mobile Layout (< 768px) ─── */}
        <div className="flex-1 flex flex-col md:hidden overflow-hidden relative">
          {/* Mobile nav tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-base)] shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>
            <div className="flex-1 flex gap-1 overflow-x-auto scrollbar-hide">
              {MOBILE_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0',
                      item.active
                        ? 'bg-[var(--accent-purple-glow)] text-[var(--accent-purple)] border border-[var(--accent-purple)]/30'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <ThemeToggle className="!w-8 !h-8" />
          </div>

          {/* Chart — full width on mobile */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChartArea />
          </div>

          {/* Mobile Bottom Sheet Tabs */}
          <div className="flex border-t border-[var(--border)] bg-[var(--bg-surface)] shrink-0">
            <button className="flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] border-t-2 border-[var(--accent)]" style={{ marginTop: '-1px' }}>
              Order Book
            </button>
            <button className="flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              Trades
            </button>
            <button className="flex-1 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              Agents
            </button>
          </div>
        </div>

        {/* Mobile menu drawer overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] animate-slide-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center font-black text-sm text-[var(--bg-void)]">
                  Δ
                </div>
                <span className="font-display text-sm text-[var(--text-primary)]">Δ-78</span>
              </div>
              <nav className="p-3 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'markets', label: 'Markets', icon: LineChart },
                  { id: 'portfolio', label: 'Portfolio', icon: Bot },
                  { id: 'agentic', label: 'Agentic AI', icon: Bot, active: true },
                  { id: 'trade', label: 'Trade', icon: Bot },
                  { id: 'analytics', label: 'Analytics', icon: Bot },
                  { id: 'signals', label: 'Signals', icon: Bot },
                  { id: 'settings', label: 'Settings', icon: Bot },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        item.active
                          ? 'bg-[var(--accent-purple-glow)] text-[var(--accent-purple)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
