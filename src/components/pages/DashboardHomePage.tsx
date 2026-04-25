'use client';

import { useState } from 'react';
import { ChartArea } from '@/components/dashboard/ChartArea';
import { OrderBook } from '@/components/dashboard/OrderBook';
import { AIPanel } from '@/components/layout/AIPanel';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

export function DashboardHomePage() {
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);
  const [mobileOrderBookOpen, setMobileOrderBookOpen] = useState(false);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Main grid: chart + orderbook */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Chart — always full width on mobile, flex-1 on desktop */}
        <div className="flex-1 min-h-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--border)]">
          <ChartArea />
        </div>

        {/* Desktop: OrderBook sidebar (always visible) | Mobile: collapsible bottom panel */}
        <div
          className={cn(
            'shrink-0 overflow-hidden border-[var(--border)]',
            // Desktop sidebar
            'hidden lg:block lg:w-72 xl:w-80 lg:border-r lg:border-b-0',
            'border-r border-b-0',
            // Mobile: full-width bottom section, collapsible
            'lg:hidden w-full'
          )}
        >
          {/* Mobile: toggle button + content */}
          <div className="lg:hidden">
            {/* Mobile toggle header */}
            <button
              onClick={() => setMobileOrderBookOpen(!mobileOrderBookOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
            >
              <span>{mobileOrderBookOpen ? '▼' : '▶'} Order Book</span>
              {mobileOrderBookOpen ? (
                <Minus className="w-3 h-3" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
            </button>
            {/* Content */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                mobileOrderBookOpen ? 'max-h-[300px]' : 'max-h-0'
              )}
            >
              <div className="h-[280px]">
                <OrderBook />
              </div>
            </div>
          </div>

          {/* Desktop: full height */}
          <div className="hidden lg:block h-full">
            <OrderBook />
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
