'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  Bot,
  Zap,
  BarChart2,
  Radio,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: LineChart },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'agentic', label: 'Agentic AI', icon: Bot, active: true, glow: 'var(--accent-purple)' },
  { id: 'trade', label: 'Trade', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'signals', label: 'Signals', icon: Radio, badge: 3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function NavItem({
  item,
  expanded,
}: {
  item: (typeof NAV_ITEMS)[0];
  expanded: boolean;
}) {
  const Icon = item.icon;
  const isActive = item.active;

  return (
    <button
      className={cn(
        'relative w-full flex items-center gap-3 rounded-xl transition-all duration-150 group',
        'hover:scale-[1.02] active:scale-[0.98]',
        isActive
          ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
        expanded ? 'px-3 py-2.5' : 'justify-center px-0 py-2.5'
      )}
      style={isActive && item.glow ? { '--tw-glow': item.glow } as React.CSSProperties : undefined}
    >
      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
          style={{ background: 'var(--accent-purple)', boxShadow: '0 0 8px var(--accent-purple)' }}
        />
      )}

      <Icon
        className={cn('w-5 h-5 shrink-0', isActive && 'drop-shadow-[0_0_6px_var(--accent-purple)]')}
        style={isActive ? { color: 'var(--accent-purple)' } : undefined}
      />

      {expanded && (
        <>
          <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="min-w-[18px] h-[18px] rounded-full bg-[var(--accent)] text-[9px] font-black text-[var(--bg-void)] flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip on collapsed */}
      {!expanded && (
        <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
          {item.label}
          {item.badge && (
            <span className="ml-1.5 min-w-[16px] h-4 rounded-full bg-[var(--accent)] text-[9px] font-black text-[var(--bg-void)] flex items-center justify-center inline-flex">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-full border-r border-[var(--border)] bg-[var(--bg-base)] transition-all duration-300 shrink-0 relative',
        expanded ? 'w-[220px]' : 'w-[64px]'
      )}
    >
      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.id} item={item} expanded={expanded} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl transition-all duration-150',
            'px-3 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
            'active:scale-[0.98]'
          )}
        >
          {expanded ? (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-5 h-5 mx-auto" />
          )}
        </button>
      </div>
    </aside>
  );
}
