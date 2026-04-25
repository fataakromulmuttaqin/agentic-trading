'use client';

import { useState } from 'react';
import { ChartArea } from '@/components/dashboard/ChartArea';
import { OrderBook } from '@/components/dashboard/OrderBook';
import { AIPanel } from '@/components/layout/AIPanel';

export function DashboardHomePage() {
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Main grid: chart + orderbook */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Chart — takes most space */}
        <div className="flex-1 min-h-0 overflow-hidden border-r border-[var(--border)]">
          <ChartArea />
        </div>

        {/* OrderBook sidebar */}
        <div className="w-72 xl:w-80 shrink-0 overflow-hidden border-r border-[var(--border)]">
          <OrderBook />
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
