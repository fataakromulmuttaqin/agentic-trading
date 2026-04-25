'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';

interface PriceChartProps {
  pair: string;
}

const INTERVALS = ['1m', '5m', '15m', '1H', '4H', '1D'] as const;
type Interval = typeof INTERVALS[number];

function generateCandleData(basePrice: number, count: number): CandlestickData<Time>[] {
  const data: CandlestickData<Time>[] = [];
  let price = basePrice;
  const now = Math.floor(Date.now() / 1000);

  for (let i = count; i >= 0; i--) {
    const time = (now - i * 60) as Time;
    const volatility = basePrice * 0.003;
    const open = price;
    const change = (Math.random() - 0.48) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    data.push({ time, open, high, low, close });
    price = close;
  }
  return data;
}

const PAIR_BASE_PRICES: Record<string, number> = {
  BTCUSD: 67245, ETHUSD: 3521, SOLUSD: 182, XRPUSD: 0.58, ADAUSD: 0.45, DOGEUSD: 0.15,
};

export default function PriceChart({ pair }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [interval, setInterval] = useState<Interval>('15m');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#0c1220' },
        textColor: '#64748b',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#334155', width: 1, style: 2, labelBackgroundColor: '#1e293b' },
        horzLine: { color: '#334155', width: 1, style: 2, labelBackgroundColor: '#1e293b' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.07)',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.07)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
      },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#f43f5e',
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    });

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;
    const basePrice = PAIR_BASE_PRICES[pair] || 67000;
    const data = generateCandleData(basePrice, 80);
    seriesRef.current.setData(data);
    chartRef.current?.timeScale().fitContent();
  }, [pair]);

  useEffect(() => {
    if (!seriesRef.current) return;
    const basePrice = PAIR_BASE_PRICES[pair] || 67000;
    seriesRef.current.setData(generateCandleData(basePrice, 80));
  }, [interval, pair]);

  return (
    <div className="h-full flex flex-col">
      {/* Interval Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
        {INTERVALS.map((int) => (
          <button
            key={int}
            onClick={() => setInterval(int)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              interval === int
                ? 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-active)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-[var(--bg-card)]'
            }`}
          >
            {int}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="flex-1 min-h-0" />
    </div>
  );
}
