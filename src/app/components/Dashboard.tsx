'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { X, ChevronUp, MessageSquare, Wallet, Bot } from 'lucide-react';

const PriceChart = dynamic(() => import('./PriceChart'), { ssr: false });
const OrderBook = dynamic(() => import('./OrderBook'), { ssr: false });
const PortfolioPanel = dynamic(() => import('./PortfolioPanel'), { ssr: false });
const TradePanel = dynamic(() => import('./TradePanel'), { ssr: false });
const AgentStatus = dynamic(() => import('./AgentStatus'), { ssr: false });
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

/* ─── Constants ─── */
const PAIRS = ['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD', 'ADAUSD', 'DOGEUSD'];
const MOCK_PRICES: Record<string, { price: string; change: string; positive: boolean }> = {
  BTCUSD: { price: '67,245.50', change: '+1.24%', positive: true },
  ETHUSD: { price: '3,521.80', change: '+2.15%', positive: true },
  SOLUSD: { price: '182.45', change: '-0.83%', positive: false },
  XRPUSD: { price: '0.5842', change: '+0.42%', positive: true },
  ADAUSD: { price: '0.4521', change: '-1.12%', positive: false },
  DOGEUSD: { price: '0.1523', change: '+3.21%', positive: true },
};

type PanelId = 'none' | 'portfolio' | 'agent' | 'chat';

interface BottomSheetProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function BottomSheet({ label, icon, active, onToggle, children }: BottomSheetProps) {
  return (
    <>
      {/* Mobile trigger button */}
      <button
        onClick={onToggle}
        className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all flex-1 min-w-0 active:scale-95 desktop-hide ${
          active
            ? 'text-[var(--accent)]'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
        }`}
      >
        <span className="text-lg leading-none">{icon}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider leading-none">{label}</span>
      </button>

      {/* Bottom Sheet Overlay */}
      {active && (
        <div className="fixed inset-0 z-50 desktop-hide" onClick={onToggle}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[var(--bg-surface)] border-t border-[var(--border)] rounded-t-3xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2" onClick={onToggle}>
              <div className="w-10 h-1 bg-[var(--text-muted)] rounded-full" />
            </div>
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                {icon}
                <span>{label}</span>
              </div>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>
            {/* Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 60px)' }}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Mobile Bottom Bar ─── */
function MobileBottomBar({
  activePanel,
  onToggle,
}: {
  activePanel: PanelId;
  onToggle: (id: PanelId) => void;
}) {
  const tabs: { id: PanelId; label: string; icon: React.ReactNode }[] = [
    { id: 'portfolio', label: 'Portfolio', icon: <Wallet className="w-5 h-5" /> },
    { id: 'agent', label: 'Agent', icon: <Bot className="w-5 h-5" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <nav className="desktop-hide bg-[var(--bg-surface)] border-t border-[var(--border)] px-1 pt-1 pb-1 shrink-0 safe-area-bottom">
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onToggle(activePanel === tab.id ? 'none' : tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all flex-1 min-w-0 active:scale-95 ${
              activePanel === tab.id
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            <span className="relative">
              {tab.icon}
              {activePanel === tab.id && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              )}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ─── Pair Ticker ─── */
function PairTicker({
  selectedPair,
  onSelectPair,
}: {
  selectedPair: string;
  onSelectPair: (pair: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-active)] rounded-xl px-3 py-2 transition-all"
      >
        <span className="font-bold text-sm">{selectedPair.replace('USD', '/USD')}</span>
        <ChevronUp className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform ${showPicker ? 'rotate-180' : ''}`} />
      </button>

      {showPicker && (
        <div className="absolute top-full left-0 mt-2 z-40 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-2 shadow-2xl shadow-black/50 animate-slide-up min-w-[180px]">
          {PAIRS.map((pair) => {
            const d = MOCK_PRICES[pair];
            return (
              <button
                key={pair}
                onClick={() => { onSelectPair(pair); setShowPicker(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 ${
                  selectedPair === pair ? 'bg-[var(--accent-glow)]' : ''
                }`}
              >
                <span className={`text-sm font-medium ${selectedPair === pair ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                  {pair.replace('USD', '/USD')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-secondary)]">{d.price}</span>
                  <span className={`text-xs font-semibold ${d.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                    {d.change}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState('BTCUSD');
  const [wsConnected, setWsConnected] = useState(false);
  const [activeBottomSheet, setActiveBottomSheet] = useState<PanelId>('none');

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL;
    if (!wsUrl) return;
    const ws = new WebSocket(`${wsUrl}?pair=${selectedPair}`);
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    return () => ws.close();
  }, [selectedPair]);

  const currentPrice = MOCK_PRICES[selectedPair];

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-base)] overflow-hidden">
      {/* ─── Header ─── */}
      <header className="shrink-0 bg-[var(--bg-surface)] border-b border-[var(--border)] safe-area-top z-30">
        <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center font-black text-sm text-white shadow-lg animate-glow-pulse">
              H
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:block">
              Hermes<span className="text-[var(--accent)]">Markets</span>
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-[var(--positive)] animate-pulse-dot' : 'bg-[var(--negative)]'}`} />
              <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mobile-hide">
                {wsConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            {/* Pair selector */}
            <PairTicker selectedPair={selectedPair} onSelectPair={setSelectedPair} />
          </div>
        </div>

        {/* Price + Change row */}
        <div className="px-4 pb-2.5 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)] leading-none">
              {currentPrice.price}
            </div>
            <div className={`text-xs font-semibold mt-0.5 ${currentPrice.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
              {currentPrice.change}
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
            <div className="text-center">
              <div className="text-[var(--text-muted)] mb-0.5 font-semibold uppercase">24h High</div>
              <div className="text-[var(--text-secondary)] font-mono font-medium">68,450</div>
            </div>
            <div className="text-center">
              <div className="text-[var(--text-muted)] mb-0.5 font-semibold uppercase">24h Low</div>
              <div className="text-[var(--text-secondary)] font-mono font-medium">65,120</div>
            </div>
            <span className="px-2 py-1 bg-[var(--accent-glow)] text-[var(--accent)] rounded-lg font-bold border border-[var(--border-active)]">
              Spot
            </span>
          </div>
        </div>

        {/* Pair strip — all pairs quick view */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {PAIRS.map((pair) => {
            const d = MOCK_PRICES[pair];
            return (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                  selectedPair === pair
                    ? 'bg-[var(--accent-glow)] border-[var(--border-active)]'
                    : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-active)]'
                }`}
              >
                <span className={`text-xs font-bold ${selectedPair === pair ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
                  {pair.replace('USD', '')}
                </span>
                <span className={`text-[10px] font-mono font-medium ${d.positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                  {d.change}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ─── Desktop Layout (≥1024px) ─── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Col 1: Chart — takes most space */}
        <div className="flex-1 border-r border-[var(--border)] min-w-0">
          <PriceChart pair={selectedPair} />
        </div>

        {/* Col 2: Orderbook */}
        <div className="w-80 shrink-0 border-r border-[var(--border)] overflow-hidden">
          <OrderBook />
        </div>

        {/* Col 3: Trade + Portfolio + Agent stacked */}
        <div className="w-96 shrink-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto border-b border-[var(--border)]">
            <TradePanel />
          </div>
          <div className="h-64 shrink-0 overflow-y-auto">
            <PortfolioPanel />
          </div>
        </div>
      </div>

      {/* ─── Tablet Layout (640px–1023px) ─── */}
      <div className="hidden sm:flex lg:hidden flex-1 overflow-hidden">
        {/* Left: Chart + Orderbook */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[var(--border)]">
          <div className="flex-1 min-h-0">
            <PriceChart pair={selectedPair} />
          </div>
          <div className="h-64 shrink-0 border-t border-[var(--border)]">
            <OrderBook />
          </div>
        </div>

        {/* Right: Trade + Portfolio/Agent tabs */}
        <div className="w-80 shrink-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <TradePanel />
          </div>
          <div className="h-64 shrink-0 overflow-y-auto border-t border-[var(--border)]">
            <PortfolioPanel />
          </div>
        </div>
      </div>

      {/* ─── Mobile Layout (< 640px) ─── */}
      <main className="flex-1 overflow-hidden sm:hidden">
        <div className="h-full flex flex-col">
          {/* Chart — takes half height */}
          <div className="h-1/2 min-h-[200px] border-b border-[var(--border)]">
            <PriceChart pair={selectedPair} />
          </div>
          {/* Orderbook — second half */}
          <div className="flex-1 overflow-hidden">
            <OrderBook />
          </div>
        </div>
      </main>

      {/* ─── Mobile Bottom Sheets (triggered by bottom bar) ─── */}
      <BottomSheet
        label="Portfolio"
        icon={<Wallet className="w-5 h-5" />}
        active={activeBottomSheet === 'portfolio'}
        onToggle={() => setActiveBottomSheet(activeBottomSheet === 'portfolio' ? 'none' : 'portfolio')}
      >
        <PortfolioPanel />
      </BottomSheet>

      <BottomSheet
        label="Agent"
        icon={<Bot className="w-5 h-5" />}
        active={activeBottomSheet === 'agent'}
        onToggle={() => setActiveBottomSheet(activeBottomSheet === 'agent' ? 'none' : 'agent')}
      >
        <AgentStatus />
      </BottomSheet>

      <BottomSheet
        label="Chat"
        icon={<MessageSquare className="w-5 h-5" />}
        active={activeBottomSheet === 'chat'}
        onToggle={() => setActiveBottomSheet(activeBottomSheet === 'chat' ? 'none' : 'chat')}
      >
        <ChatPanel />
      </BottomSheet>

      {/* ─── Mobile Bottom Navigation Bar ─── */}
      <MobileBottomBar
        activePanel={activeBottomSheet}
        onToggle={setActiveBottomSheet}
      />
    </div>
  );
}
