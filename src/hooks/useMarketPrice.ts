'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface TickerData {
  symbol: string;        // 'BTCUSDT'
  price: string;         // '68372.45'
  priceNum: number;       // 68372.45
  change: string;         // '+5.24%'
  changeNum: number;      // 5.24
  positive: boolean;
  high: string;
  low: string;
  volume: string;
  lastUpdate: number;
}

interface BinanceTickerMessage {
  e: string;        // Event type
  s: string;        // Symbol
  c: string;        // Last price
  P: string;        // Price change percent
  h: string;        // High price
  l: string;        // Low price
  v: string;        // Total traded base asset volume
}

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/stream?streams=';
const SYMBOLS = ['btcusdt', 'ethusdt', 'solusdt', 'xrpusdt', 'adausdt', 'dogeusdt', 'avaxusdt', 'dotusdt'];
const SYMBOL_LABELS: Record<string, string> = {
  BTCUSDT: 'BTC/USD',
  ETHUSDT: 'ETH/USD',
  SOLUSDT: 'SOL/USD',
  XRPUSDT: 'XRP/USD',
  ADAUSDT: 'ADA/USD',
  DOGEUSDT: 'DOGE/USD',
  AVAXUSDT: 'AVAX/USD',
  DOTUSDT: 'DOT/USD',
};

function formatVolume(v: string): string {
  const n = parseFloat(v);
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(2);
}

function parseTicker(msg: BinanceTickerMessage): TickerData {
  const changeNum = parseFloat(msg.P);
  return {
    symbol: SYMBOL_LABELS[msg.s] || msg.s,
    price: parseFloat(msg.c).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    priceNum: parseFloat(msg.c),
    change: (changeNum >= 0 ? '+' : '') + changeNum.toFixed(2) + '%',
    changeNum,
    positive: changeNum >= 0,
    high: parseFloat(msg.h).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    low: parseFloat(msg.l).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    volume: formatVolume(msg.v),
    lastUpdate: Date.now(),
  };
}

export function useMarketPrice() {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const streams = SYMBOLS.map((s) => `${s}@ticker`).join('/');
    const ws = new WebSocket(BINANCE_WS_URL + streams);

    ws.onopen = () => {
      setConnected(true);
      setLastError(null);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const wrapper = JSON.parse(event.data);
        const msg: BinanceTickerMessage = wrapper.data;
        if (msg && msg.e === '24hrTicker') {
          setTickers((prev) => ({
            ...prev,
            [msg.s]: parseTicker(msg),
          }));
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onerror = () => {
      setLastError('WebSocket error');
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      // Exponential backoff reconnect
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current++;
      reconnectTimeout.current = setTimeout(connect, delay);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const getTicker = useCallback(
    (label: string): TickerData | null => {
      // Find by label like 'BTC/USD'
      const entry = Object.entries(SYMBOL_LABELS).find(([, l]) => l === label);
      if (entry) return tickers[entry[0]] || null;
      // Try direct symbol
      return tickers[label] || null;
    },
    [tickers]
  );

  const getAllTickers = useCallback((): TickerData[] => {
    return Object.values(tickers);
  }, [tickers]);

  return { tickers, connected, lastError, getTicker, getAllTickers };
}
