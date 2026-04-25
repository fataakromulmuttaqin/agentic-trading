'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  Bot,
  LineChart,
  LayoutDashboard,
  BarChart2,
  Bell,
  Settings,
  Wallet,
  Zap,
} from 'lucide-react';
import { TopNav } from '@/components/layout/TopNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { RunningTicker } from '@/components/layout/RunningTicker';
import { CommandBar } from '@/components/layout/CommandBar';
import { LiveDecisionFeed } from '@/components/layout/LiveDecisionFeed';
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

/* ─── Page registry ─── */
function renderPage(id: string) {
  switch (id) {
    case 'dashboard':  return <DashboardHomePage />;
    case 'agentic':   return <AgenticPage />;
    case 'markets':   return <MarketsPage />;
    case 'portfolio': return <PortfolioPage />;
    case 'trade':     return <TradePage />;
    case 'analytics': return <AnalyticsPage />;
    case 'signals':   return <SignalsPage />;
    case 'settings':  return <SettingsPage />;
    default:          return <DashboardHomePage />;
  }
}

/* ─── Desktop navigation items ─── */
const DESKTOP_NAV = [
  { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'markets',    label: 'Markets',      icon: LineChart        },
  { id: 'portfolio',  label: 'Portfolio',    icon: Wallet           },
  { id: 'agentic',   label: 'Agents',       icon: Bot              },
  { id: 'trade',      label: 'Trade',        icon: Zap              },
  { id: 'analytics',  label: 'Analytics',   icon: BarChart2        },
  { id: 'signals',    label: 'Signals',      icon: Bell,   badge: 3 },
  { id: 'settings',   label: 'Settings',     icon: Settings         },
];

/* ─── Mobile tab items (priority 5) ─── */
const MOBILE_TABS: Array<{ id: string; label: string; icon: typeof LayoutDashboard; badge?: number }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets',   label: 'Markets',   icon: LineChart        },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet           },
  { id: 'agentic',  label: 'Agents',    icon: Bot              },
  { id: 'trade',     label: 'Trade',     icon: Zap              },
];

/* ─── Mobile drawer items (full list) ─── */
const DRAWER_NAV: typeof DESKTOP_NAV = DESKTOP_NAV.map((item) => ({
  ...item,
  icon: item.icon as typeof item.icon,
}));

/* ─── Page key for transition ─── */
function PageContent({ activeId }: { activeId: string }) {
  return (
    <div key={activeId} className="flex flex-col flex-1 min-h-0 overflow-hidden animate-page-enter">
      {renderPage(activeId)}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD PAGE
══════════════════════════════════════ */
export default function DashboardPage() {
  const [activeId, setActiveId]     = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-void)] overflow-hidden">

      {/* ─── Running Ticker ─── */}
      <RunningTicker />

      {/* ─── Top Navigation ─── */}
      <TopNav />

      {/* ─── Body: sidebar + content ─── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">

        {/* Desktop Sidebar */}
        <Sidebar activeId={activeId} onSelect={setActiveId} />

        {/* Desktop content area */}
        <div className="hidden md:flex flex-col flex-1 min-h-0 overflow-hidden">
          <PageContent activeId={activeId} />
        </div>

        {/* ─── Mobile Layout ─── */}
        <div className="flex-1 flex flex-col md:hidden min-h-0 overflow-hidden relative">

          {/* Mobile top bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-base)] shrink-0 z-10">
            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>

            {/* Scrollable tab pills */}
            <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-hide">
              {MOBILE_TABS.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0',
                      isActive
                        ? 'bg-[var(--accent-purple-glow)] text-[var(--accent-purple)] border border-[var(--accent-purple)]/30 shadow-sm'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {item.badge && (
                      <span className="min-w-[16px] h-4 rounded-full bg-[var(--accent-rose)] text-[9px] font-black text-white flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Theme toggle */}
            <ThemeToggle className="!w-8 !h-8 shrink-0" />
          </div>

          {/* Mobile page content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <PageContent activeId={activeId} />
          </div>

          {/* Bottom safe area */}
          <div className="safe-bottom shrink-0" />
        </div>

        {/* ─── Mobile drawer overlay ─── */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
            </div>

            {/* Drawer panel */}
            <div
              className="absolute left-0 top-0 bottom-0 w-64 z-50 md:hidden animate-slide-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border)] shadow-2xl">
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center font-black text-sm text-[var(--bg-void)] animate-glow-pulse">
                      Δ
                    </div>
                    <div>
                      <span className="font-display text-sm text-[var(--text-primary)]">Δ-78</span>
                      <span className="text-[var(--text-muted)] text-[10px] block -mt-0.5 leading-none">Agentic Trading</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <X className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                </div>

                {/* Drawer nav */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                  {DRAWER_NAV.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveId(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                          isActive
                            ? 'bg-[var(--accent-purple-glow)] text-[var(--accent-purple)] shadow-sm'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                        )}
                      >
                        <Icon
                          className="w-4 h-4 shrink-0"
                          style={isActive ? { color: 'var(--accent-purple)' } : undefined}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="min-w-[18px] h-[18px] rounded-full bg-[var(--accent-rose)] text-[9px] font-black text-white flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Drawer footer */}
                <div className="p-3 border-t border-[var(--border)] shrink-0">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--accent-purple-glow)] border border-[var(--accent-purple)]/20">
                    <div className="relative flex -space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-[var(--accent-purple)] bg-[var(--accent-purple)]/60"
                          style={{ zIndex: 3 - i }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--accent-purple)]">3 Agents Live</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">Portfolio · Signals · Arbitrage</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-pulse-dot shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Command Bar (CMD+K) ─── */}
      <CommandBar onNavigate={setActiveId} />

      {/* ─── Live Decision Feed ─── */}
      <LiveDecisionFeed />
    </div>
  );
}
