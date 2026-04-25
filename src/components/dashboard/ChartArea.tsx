'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, CandlestickData, HistogramData } from 'lightweight-charts';
import { Maximize2, Volume2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarket } from '@/components/providers/MarketProvider';

const INTERVALS = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'] as const;
type Interval = (typeof INTERVALS)[number];

// ─── Binance API helpers ──────────────────────────────────────────────────────

async function fetchHistoricalBars(
  symbol: string,
  interval: string,
  limit = 300
): Promise<CandlestickData<Time>[]> {
  const url = `/api/binance/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid data');

  return data.map((k: { time: number; open: number; high: number; low: number; close: number }) => ({
    time: k.time as Time,
    open: k.open,
    high: k.high,
    low: k.low,
    close: k.close,
  }));
}

async function fetchVolumeData(
  symbol: string,
  interval: string,
  limit = 300
): Promise<HistogramData<Time>[]> {
  const url = `/api/binance/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid data');

  return data.map((k: { time: number; open: number; close: number; volume: number }) => {
    return {
      time: k.time as Time,
      value: k.volume,
      color: k.close >= k.open ? 'rgba(57,255,20,0.3)' : 'rgba(255,59,107,0.3)',
    };
  });
}

// ─── WebSocket for real-time kline updates ───────────────────────────────────
// Binance WebSocket: wss://stream.binance.com:9443/stream?streams=<symbol>@kline_<interval>

interface KlineMessage {
  e: string;    // Event type
  s: string;    // Symbol
  k: {
    t: number;  // Kline start time
    o: string;  // Open
    h: string;  // High
    l: string;  // Low
    c: string;  // Close
    v: string;  // Base asset volume
    x: boolean; // Is candle closed?
  };
}

interface WsMessage {
  stream: string;
  data: KlineMessage;
}

export function ChartArea() {
  const { tickers } = useMarket();
  const [interval, setInterval] = useState<Interval>('15m');
  const [symbol] = useState('BTCUSDT');
  const [loading, setLoading] = useState(true);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<{ value: number; pct: number } | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttemptsRef = useRef(0);

  // ─── Chart Initialization ───────────────────────────────────────────────────

  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    if (width === 0 || height === 0) return null;

    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-muted').trim() || '#6B7280';

    const chart = createChart(container, {
      width,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: 'rgba(0,240,255,0.25)', width: 1, style: 2, labelBackgroundColor: '#18181F' },
        horzLine: { color: 'rgba(0,240,255,0.25)', width: 1, style: 2, labelBackgroundColor: '#18181F' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        scaleMargins: { top: 0.05, bottom: 0.2 },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    });

    chartRef.current = chart;

    const candlestick = chart.addCandlestickSeries({
      upColor: '#39FF14',
      downColor: '#FF3B6B',
      borderUpColor: '#39FF14',
      borderDownColor: '#FF3B6B',
      wickUpColor: 'rgba(57,255,20,0.5)',
      wickDownColor: 'rgba(255,59,107,0.5)',
    });
    candlestickRef.current = candlestick;

    const volume = chart.addHistogramSeries({
      color: 'rgba(0,240,255,0.15)',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    volumeRef.current = volume;
    chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });

    return chart;
  }, []);

  // ─── Load Historical Data ───────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    if (!chartRef.current || !candlestickRef.current || !volumeRef.current) return;

    setLoading(true);
    try {
      const [bars, volumes] = await Promise.all([
        fetchHistoricalBars(symbol, interval),
        fetchVolumeData(symbol, interval),
      ]);

      if (bars.length > 0) {
        candlestickRef.current.setData(bars);
        volumeRef.current.setData(volumes);
        chartRef.current.timeScale().fitContent();

        const lastBar = bars[bars.length - 1];
        const firstBar = bars[0];
        setLastPrice(lastBar.close);
        setPriceChange({
          value: lastBar.close - firstBar.open,
          pct: ((lastBar.close - firstBar.open) / firstBar.open) * 100,
        });
      }
    } catch (err) {
      console.error('Failed to load chart data:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  // ─── Initial Setup ──────────────────────────────────────────────────────────

  useEffect(() => {
    const chart = initChart();
    if (!chart) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });
    resizeObserver.observe(chartContainerRef.current!);

    loadData();

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candlestickRef.current = null;
      volumeRef.current = null;
    };
  }, [initChart, loadData]);

  // Reload when symbol or interval changes
  useEffect(() => {
    if (chartRef.current) {
      loadData();
    }
  }, [symbol, interval, loadData]);

  // ─── Real-time WebSocket ────────────────────────────────────────────────────
  // subscribeBars pattern from TradingView UDF:
  // https://www.tradingview.com/charting-library-docs/latest/tutorials/implement_datafeed_tutorial/Streaming-Implementation/

  const connectKlineStream = useCallback(() => {
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${symbol.toLowerCase()}@kline_${interval}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data);
        const { k } = msg.data;

        if (!k.x) {
          // Candle NOT closed yet → update live candle
          // This is real-time streaming via subscribeBars pattern
          const liveBar: CandlestickData<Time> = {
            time: (k.t / 1000) as Time,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };
          candlestickRef.current?.update(liveBar);
        } else {
          // Candle just closed → add as new bar
          const closedBar: CandlestickData<Time> = {
            time: (k.t / 1000) as Time,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };
          candlestickRef.current?.update(closedBar);
        }

        // Update price display from kline
        const currentPrice = parseFloat(k.c);
        if (!isNaN(currentPrice)) {
          setLastPrice(currentPrice);
        }
      } catch {
        // Ignore parse errors
      }
    };

    ws.onerror = () => {};

    ws.onclose = () => {
      // Exponential backoff reconnect — matching TradingView streaming pattern
      const attempts = reconnectAttemptsRef.current;
      if (attempts < 5) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectKlineStream();
        }, delay);
      }
    };
  }, [symbol, interval]);

  useEffect(() => {
    connectKlineStream();
    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connectKlineStream]);

  // ─── Update chart when symbol changes via MarketProvider ───────────────────

  useEffect(() => {
    const ticker = tickers[symbol];
    if (ticker) {
      setLastPrice(ticker.priceNum);
      if (priceChange === null) {
        setPriceChange({ value: 0, pct: ticker.changeNum });
      }
    }
  }, [tickers, symbol, priceChange]);

  // ─── Sync with selected pair from TopNav ──────────────────────────────────
  // (This connects the chart to the same symbol selected in the header)

  // Note: In a full implementation, you'd lift symbol state to page.tsx
  // and pass it down via context. For now, chart defaults to BTCUSDT.

  // ─── Theme Observer ─────────────────────────────────────────────────────────

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!chartRef.current) return;
      const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-muted').trim() || '#6B7280';
      chartRef.current.applyOptions({ layout: { textColor } });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // ─── Format helpers ─────────────────────────────────────────────────────────

  const formatPrice = (p: number | null) => {
    if (p === null) return '—';
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (v: number) => {
    return (v >= 0 ? '+' : '') + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const positive = priceChange ? priceChange.pct >= 0 : true;

  return (
    <div className="h-full flex flex-col relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-surface)]/50 shrink-0">
        <div className="flex items-center gap-1">
          {INTERVALS.map((int) => (
            <button
              key={int}
              onClick={() => setInterval(int)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                interval === int
                  ? 'bg-[var(--accent)] text-[var(--bg-void)] font-bold shadow-[0_0_12px_var(--accent-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              )}
            >
              {int}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors">
            <TrendingUp className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price Label */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none">
        <div className="text-3xl font-black font-mono text-[var(--text-primary)] tracking-tight leading-none">
          {formatPrice(lastPrice)}
        </div>
        {priceChange && (
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('text-sm font-bold', positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              {formatChange(priceChange.value)}
            </span>
            <span className={cn('text-sm font-bold', positive ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
              ({positive ? '+' : ''}{priceChange.pct.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>

      {/* LIVE + Loading Badge */}
      <div className="absolute top-14 right-4 z-10 pointer-events-none flex items-center gap-1.5">
        {loading && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-glass)] border border-[var(--accent)]/30 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-[10px] font-black text-[var(--accent)] tracking-widest uppercase">Loading</span>
          </div>
        )}
        {!loading && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-glass)] border border-[var(--accent-rose)]/30 backdrop-blur-md">
            <div className="live-dot" />
            <span className="text-[10px] font-black text-[var(--accent-rose)] tracking-widest uppercase">Live</span>
          </div>
        )}
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-96 h-96 rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            top: '10%',
            left: '30%',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Chart container */}
      <div ref={chartContainerRef} className="flex-1 min-h-0 relative z-[1] overflow-hidden" />

      {/* Branding */}
      <div className="absolute bottom-2 right-4 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="text-[9px] font-medium text-[var(--text-muted)] opacity-50">Binance + lightweight-charts</span>
      </div>
    </div>
  );
}
