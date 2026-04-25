'use client';

import { useState } from 'react';
import { OrderBook, TradesTape } from '@/components/dashboard/OrderBook';
import { cn } from '@/lib/utils';

const TABS = ['Order Book', 'Trades'] as const;
type Tab = (typeof TABS)[number];

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('Order Book');

  return (
    <div className="h-full flex flex-col bg-[var(--bg-surface)] border-l border-[var(--border)]">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 relative',
              activeTab === tab
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            )}
          >
            {tab}
            {activeTab === tab && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"
                style={{ boxShadow: '0 0 8px var(--accent-glow)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'Order Book' ? <OrderBook /> : <TradesTape />}
      </div>
    </div>
  );
}
