'use client';

import { LayoutDashboard, LineChart, Bot, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: LineChart },
  { id: 'agentic', label: 'Agents', icon: Bot },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export function BottomNav ({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur-xl z-50 safe-bottom">
      <div className="flex items-center justify-around h-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-150 min-w-[64px]',
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-all duration-150',
                  isActive && 'drop-shadow-[0_0_8px_var(--accent)]'
                )}
                style={isActive ? { color: 'var(--accent)' } : undefined}
              />
              <span
                className={cn(
                  'text-[10px] font-semibold transition-all duration-150',
                  isActive ? 'opacity-100' : 'opacity-0'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-2 w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
