'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  LayoutDashboard,
  LineChart,
  Wallet,
  Bot,
  Zap,
  BarChart2,
  Radio,
  Settings,
  ChevronRight,
  Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
  shortcut?: string;
  action: () => void;
}

interface CommandBarProps {
  onNavigate?: (pageId: string) => void;
  onClose?: () => void;
}

function CommandListItem({
  item,
  isSelected,
  onClick,
}: {
  item: CommandItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-100',
        isSelected
          ? 'bg-[var(--accent-purple-glow)] text-[var(--accent-purple)] border border-[var(--accent-purple)]/30'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isSelected ? 'bg-[var(--accent-purple)]/20' : 'bg-[var(--bg-base)]'
        )}
      >
        <Icon className="w-4 h-4" style={isSelected ? { color: 'var(--accent-purple)' } : undefined} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{item.label}</div>
        <div className="text-[11px] text-[var(--text-muted)] truncate">{item.description}</div>
      </div>
      {isSelected && <ChevronRight className="w-4 h-4 text-[var(--accent-purple)] shrink-0" />}
      {item.shortcut && (
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {item.shortcut.split('+').map((key, i) => (
            <kbd
              key={i}
              className="px-1.5 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-muted)]"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
    </button>
  );
}

export function CommandBar({ onNavigate, onClose }: CommandBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const COMMANDS: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      description: 'View your trading dashboard overview',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => { onNavigate?.('dashboard'); setOpen(false); },
    },
    {
      id: 'markets',
      label: 'Go to Markets',
      description: 'Browse and analyze market pairs',
      icon: LineChart,
      shortcut: 'G M',
      action: () => { onNavigate?.('markets'); setOpen(false); },
    },
    {
      id: 'portfolio',
      label: 'Go to Portfolio',
      description: 'View your holdings and allocation',
      icon: Wallet,
      shortcut: 'G P',
      action: () => { onNavigate?.('portfolio'); setOpen(false); },
    },
    {
      id: 'agentic',
      label: 'Go to Agents',
      description: 'Manage AI trading agents',
      icon: Bot,
      shortcut: 'G A',
      action: () => { onNavigate?.('agentic'); setOpen(false); },
    },
    {
      id: 'trade',
      label: 'Go to Trade',
      description: 'Execute trades and manage orders',
      icon: Zap,
      shortcut: 'G T',
      action: () => { onNavigate?.('trade'); setOpen(false); },
    },
    {
      id: 'analytics',
      label: 'Go to Analytics',
      description: 'View performance analytics and reports',
      icon: BarChart2,
      shortcut: 'G A',
      action: () => { onNavigate?.('analytics'); setOpen(false); },
    },
    {
      id: 'signals',
      label: 'Go to Signals',
      description: 'Browse trading signals and alerts',
      icon: Radio,
      shortcut: 'G S',
      action: () => { onNavigate?.('signals'); setOpen(false); },
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      description: 'Configure dashboard preferences',
      icon: Settings,
      shortcut: 'G S',
      action: () => { onNavigate?.('settings'); setOpen(false); },
    },
  ];

  const filtered = COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const buttons = list.querySelectorAll('button');
    if (buttons[selectedIndex]) {
      buttons[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    },
    [filtered, selectedIndex]
  );

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[480px] max-w-[calc(100vw-32px)] z-[101] animate-scale-in">
        <div className="rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd className="px-2 py-1 rounded bg-[var(--bg-base)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-muted)]">
                ESC
              </kbd>
            </div>
          </div>

          {/* Command list */}
          <div ref={listRef} className="max-h-72 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {filtered.length > 0 ? (
              filtered.map((cmd, i) => (
                <CommandListItem
                  key={cmd.id}
                  item={cmd}
                  isSelected={i === selectedIndex}
                  onClick={() => cmd.action()}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                No commands found for &quot;{query}&quot;
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg-elevated)]">
            <Keyboard className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)]">
              Use <kbd className="px-1 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border)]">↑↓</kbd> to navigate,{' '}
              <kbd className="px-1 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border)]">↵</kbd> to select,{' '}
              <kbd className="px-1 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border)]">ESC</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to expose CMD+K functionality
export function useCommandBar() {
  return { CommandBar };
}
