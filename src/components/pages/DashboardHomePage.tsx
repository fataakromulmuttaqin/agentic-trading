'use client';
import { useState } from 'react';
import { ChartArea } from '@/components/dashboard/ChartArea';
import { OrderBook } from '@/components/dashboard/OrderBook';
import { TrendingCoins } from '@/components/dashboard/TrendingCoins';
import { AIPanel } from '@/components/layout/AIPanel';
import { cn } from '@/lib/utils';
import { BookOpen, TrendingUp, Minus, Plus } from 'lucide-react';

const RIGHT_TABS = [
  { id: 'orderbook', label: 'Order Book', icon: BookOpen },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
] as const;
type RightTab = (typeof RIGHT_TABS)[number]['id'];

export function DashboardHomePage() {
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);
  const [mobileOrderBookOpen, setMobileOrderBookOpen] = useState(false);
  const [rightTab, setRightTab] = useState<RightTab>('trending');

  const renderRightPanel = () => {
    if (rightTab === 'trending') return <TrendingCoins />;
    return <OrderBook />;
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Main grid: chart + right sidebar */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Chart — always full width on mobile, flex-1 on desktop */}
        <div className="flex-1 min-h-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--border)]">
          <ChartArea />
        </div>

        {/* Desktop: tabbed sidebar | Mobile: collapsible bottom panel */}
        <div
          className={cn(
            'shrink-0 overflow-hidden border-[var(--border)]',
            'hidden lg:block lg:w-72 xl:w-80 lg:border-r lg:border-b-0',
            'border-r border-b-0',
            'lg:hidden w-full'
          )}
        >
          {/* Desktop: tab bar + content */}
          <div className="hidden lg:flex h-full flex-col">
            {/* Tab bar */}
            <div className="flex border-b border-[var(--border)] shrink-0">
              {RIGHT_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold transition-colors',
                      rightTab === tab.id
                        ? 'text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[var(--accent)]/5'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {/* Panel content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {renderRightPanel()}
            </div>
          </div>

          {/* Mobile: toggle + content */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOrderBookOpen(!mobileOrderBookOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
            >
              <span>{mobileOrderBookOpen ? '▼' : '▶'} {rightTab === 'trending' ? 'Trending' : 'Order Book'}</span>
              {mobileOrderBookOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                mobileOrderBookOpen ? 'max-h-[300px]' : 'max-h-0'
              )}
            >
              <div className="h-[280px]">
                {renderRightPanel()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Panel — fixed height at bottom */}
      <AIPanel
        collapsed={aiPanelCollapsed}
        onToggle={() => setAiPanelCollapsed(!aiPanelCollapsed)}
      />
    </div>
  );
}
