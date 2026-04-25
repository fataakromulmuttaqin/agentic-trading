'use client';

import { useState } from 'react';
import { Menu, X, Bot, LineChart, LayoutDashboard, PieChart, TrendingUp, BarChart2, Bell, Settings, Activity } from 'lucide-react';
import { TopNav } from '@/components/layout/TopNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { DashboardHomePage } from '@/components/pages/DashboardHomePage';
import { AgenticPage } from '@/components/pages/AgenticPage';
import { MarketsPage } from '@/components/pages/MarketsPage';
import { PortfolioPage } from '@/components/pages/PortfolioPage';
import { TradePage } from '@/components/pages/TradePage';
import { AnalyticsPage } from '@/components/pages/AnalyticsPage';
import { SignalsPage } from '@/components/pages/SignalsPage';
import { SettingsPage } from '@/components/pages/SettingsPage';

const MOBILE_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: LineChart },
  { id: 'agentic', label: 'Agents', icon: Bot },
];

function renderPage(id: string) {
  switch (id) {
    case 'dashboard': return <DashboardHomePage />;
    case 'agentic': return <AgenticPage />;
    case 'markets': return <MarketsPage />;
    case 'portfolio': return <PortfolioPage />;
    case 'trade': return <TradePage />;
    case 'analytics': return <AnalyticsPage />;
    case 'signals': return <SignalsPage />;
    case 'settings': return <SettingsPage />;
    default: return <DashboardHomePage />;
  }
}

export default function DashboardPage() {
  const [activeId, setActiveId] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-void)] overflow-hidden">
      {/* Top Navigation — fixed height */}
      <TopNav />

      {/* Body: sidebar + content — takes remaining height */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">

        {/* Desktop Sidebar */}
        <Sidebar activeId={activeId} onSelect={setActiveId} />

        {/* Main content area — fills remaining space, proper overflow */}
        <div className="hidden md:flex flex-col flex-1 min-h-0 overflow-hidden">
          {renderPage(activeId)}
        </div>

        {/* ─── Mobile Layout ─── */}
        <div className="flex-1 flex flex-col md:hidden min-h-0 overflow-hidden relative">
          {/* Mobile top bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-base)] shrink-0">
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
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0',
                      activeId === item.id
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
            <ThemeToggle className="!w-8 !h-8 shrink-0" />
          </div>

          {/* Page content — scrolls if needed */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {renderPage(activeId)}
          </div>
        </div>

        {/* Mobile drawer overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] animate-slide-right flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)] flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center font-black text-sm text-[var(--bg-void)]">
                  Δ
                </div>
                <span className="font-display text-sm text-[var(--text-primary)]">Δ-78</span>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'markets', label: 'Markets', icon: LineChart },
                  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
                  { id: 'agentic', label: 'Agentic AI', icon: Activity },
                  { id: 'trade', label: 'Trade', icon: TrendingUp },
                  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                  { id: 'signals', label: 'Signals', icon: Bell },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveId(item.id); setMobileMenuOpen(false); }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        activeId === item.id
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
