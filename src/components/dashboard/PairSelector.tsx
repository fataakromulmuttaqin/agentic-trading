'use client';

import { useState, useEffect } from 'react';

interface CoinInfo {
  fsym: string;
  tsym: string;
  name: string;
  icon: string;
  rank: number;
}

interface PriceData {
  price: number;
  change24h: number;
  changePct24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

const DEFAULT_COINS: CoinInfo[] = [
  { fsym: 'BTC',  tsym: 'USDT', name: 'Bitcoin',   icon: '₿',  rank: 1  },
  { fsym: 'ETH',  tsym: 'USDT', name: 'Ethereum',  icon: 'Ξ',  rank: 2  },
  { fsym: 'SOL',  tsym: 'USDT', name: 'Solana',    icon: '◎',  rank: 3  },
  { fsym: 'BNB',  tsym: 'USDT', name: 'BNB',       icon: '◈',  rank: 4  },
  { fsym: 'XRP',  tsym: 'USDT', name: 'Ripple',    icon: '✕',  rank: 5  },
  { fsym: 'ADA',  tsym: 'USDT', name: 'Cardano',   icon: '₳',  rank: 6  },
  { fsym: 'DOGE', tsym: 'USDT', name: 'Dogecoin',  icon: 'Ð',  rank: 7  },
  { fsym: 'DOT',  tsym: 'USDT', name: 'Polkadot',  icon: '●',  rank: 8  },
  { fsym: 'AVAX', tsym: 'USDT', name: 'Avalanche',icon: '▲',  rank: 9  },
  { fsym: 'MATIC',tsym: 'USDT', name: 'Polygon',   icon: '⬡', rank: 10 },
  { fsym: 'LINK', tsym: 'USDT', name: 'Chainlink', icon: '⬡', rank: 11 },
  { fsym: 'UNI',  tsym: 'USDT', name: 'Uniswap',   icon: '🦄', rank: 12 },
  { fsym: 'LTC',  tsym: 'USDT', name: 'Litecoin',  icon: 'Ł',  rank: 13 },
  { fsym: 'ATOM', tsym: 'USDT', name: 'Cosmos',    icon: '⚛',  rank: 14 },
  { fsym: 'NEAR', tsym: 'USDT', name: 'NEAR',      icon: '◈',  rank: 17 },
  { fsym: 'ARB',  tsym: 'USDT', name: 'Arbitrum',  icon: '▲',  rank: 19 },
];

interface PairSelectorProps {
  activeSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function PairSelector({ activeSymbol, onSymbolChange }: PairSelectorProps) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/market?type=prices');
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.error('Price fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30_000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const activeCoin = DEFAULT_COINS.find(c => c.fsym + 'USDT' === activeSymbol);
  const activePrice = prices[activeSymbol];

  const formatPrice = (p: number) => {
    if (p >= 1000) return p.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (p >= 1) return p.toFixed(4);
    return p.toFixed(6);
  };

  return (
    <div className="relative">
      {/* Selected pair button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
      >
        <span className="text-base">{activeCoin?.icon || '🔶'}</span>
        <span className="font-mono text-sm font-semibold text-cyan-400">
          {activeCoin?.fsym || activeSymbol.replace('USDT','')}/USDT
        </span>
        {!loading && activePrice && (
          <>
            <span className="font-mono text-sm text-white">${formatPrice(activePrice.price)}</span>
            <span className={`text-xs font-mono ${activePrice.changePct24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {activePrice.changePct24h >= 0 ? '+' : ''}{activePrice.changePct24h.toFixed(2)}%
            </span>
          </>
        )}
        <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-[#0D0D12] border border-white/10 rounded-xl shadow-2xl z-50">
          <div className="sticky top-0 px-3 py-2 bg-[#0D0D12]/95 border-b border-white/5">
            <span className="text-xs text-gray-500 font-mono">
              Select Trading Pair {lastUpdate && `• Updated ${lastUpdate.toLocaleTimeString()}`}
            </span>
          </div>
          {DEFAULT_COINS.map(coin => {
            const sym = coin.fsym + 'USDT';
            const price = prices[sym];
            const isActive = sym === activeSymbol;

            return (
              <button
                key={sym}
                onClick={() => { onSymbolChange(sym); setShowDropdown(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors ${
                  isActive ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm w-5">{coin.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{coin.fsym}/USDT</div>
                    <div className="text-xs text-gray-500">{coin.name}</div>
                  </div>
                </div>
                {price && (
                  <div className="text-right">
                    <div className="text-sm font-mono text-white">${formatPrice(price.price)}</div>
                    <div className={`text-xs font-mono ${price.changePct24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {price.changePct24h >= 0 ? '+' : ''}{price.changePct24h.toFixed(2)}%
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
