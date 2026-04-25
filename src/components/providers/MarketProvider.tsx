'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useMarketPrice, TickerData } from '@/hooks/useMarketPrice';

interface MarketContextValue {
  tickers: Record<string, TickerData>;
  connected: boolean;
  lastError: string | null;
  getTicker: (label: string) => TickerData | null;
  getAllTickers: () => TickerData[];
}

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ children }: { children: ReactNode }) {
  const market = useMarketPrice();

  return (
    <MarketContext.Provider value={market}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error('useMarket must be used within MarketProvider');
  return ctx;
}
