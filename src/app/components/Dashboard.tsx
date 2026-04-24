'use client';

import { useState } from 'react';
import PriceChart from './PriceChart';
import OrderBook from './OrderBook';
import PortfolioPanel from './PortfolioPanel';
import TradePanel from './TradePanel';
import AgentStatus from './AgentStatus';
import ChatPanel from './ChatPanel';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'trading' | 'agent' | 'chat'>('trading');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <p className="text-gray-400 text-sm">Kraken + Hermes Agent</p>
      </header>

      <nav className="flex gap-4 mb-6 border-b border-gray-700 pb-2">
        {(['trading', 'agent', 'chat'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {activeTab === 'trading' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PriceChart />
          </div>
          <div>
            <OrderBook />
          </div>
          <div>
            <PortfolioPanel />
          </div>
          <div className="lg:col-span-2">
            <TradePanel />
          </div>
        </div>
      )}

      {activeTab === 'agent' && <AgentStatus />}
      {activeTab === 'chat' && <ChatPanel />}
    </div>
  );
}
