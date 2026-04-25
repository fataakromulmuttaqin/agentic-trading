'use client';

import { ChartArea } from '@/components/dashboard/ChartArea';
import { RightPanel } from '@/components/layout/RightPanel';
import { AIPanel } from '@/components/layout/AIPanel';
import { useState } from 'react';

export function DashboardHomePage() {
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);

  return (
    <>
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
    </>
  );
}
