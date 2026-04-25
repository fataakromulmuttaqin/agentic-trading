'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { Maximize2, Volume2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const INTERVALS = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'] as const;
type Interval = (typeof INTERVALS)[number];

function generateCandleData(basePrice: number, count: number, trend: number): CandlestickData<Time>[] {
  const data: CandlestickData<Time>[] = [];
  let price = basePrice * (1 - trend * 0.05);
  const now = Math.floor(Date.now() / 1000);

  for (let i = count; i >= 0; i--) {
    const time = (now - i * 60) as Time;
    const volatility = basePrice * 0.004;
    const open = price;
    const trendFactor = (Math.random() * 0.6 + 0.1) * trend;
    const change = (Math.random() - 0.45 + trendFactor) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.4;
    const low = Math.min(open, close) - Math.random() * volatility * 0.4;
    data.push({ time, open, high, low, close });
    price = close;
  }
  return data;
}

export function ChartArea() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [interval, setInterval] = useState<Interval>('15m');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let rafId: number;
    let cleanupFn: (() => void) | null = null;
    let mounted = true;

    const initChart = () => {
      if (!chartContainerRef.current || !mounted) return;

      const container = chartContainerRef.current;
      const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-muted').trim() || '#6B7280';
      const gridColor = 'rgba(255,255,255,0.03)';

      const width = container.clientWidth;
      const height = container.clientHeight || 400;

      if (width === 0 || height === 0) {
        rafId = requestAnimationFrame(initChart);
        return;
      }

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
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
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

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#39FF14',
        downColor: '#FF3B6B',
        borderUpColor: '#39FF14',
        borderDownColor: '#FF3B6B',
        wickUpColor: 'rgba(57,255,20,0.5)',
        wickDownColor: 'rgba(255,59,107,0.5)',
      });
      seriesRef.current = candlestickSeries;

      const volumeSeries = chart.addHistogramSeries({
        color: 'rgba(0,240,255,0.15)',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });
      volumeSeriesRef.current = volumeSeries;
      chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });

      const basePrice = 68372;
      const trend = 1;
      const data = generateCandleData(basePrice, 120, trend);
      candlestickSeries.setData(data);

      const volumeData = data.map((c) => ({
        time: c.time,
        value: Math.random() * 500 + 100,
        color: c.close >= c.open ? 'rgba(57,255,20,0.3)' : 'rgba(255,59,107,0.3)',
      }));
      volumeSeries.setData(volumeData);
      chart.timeScale().fitContent();

      const resizeObserver = new ResizeObserver(() => {
        if (chart && container) {
          chart.applyOptions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      });
      resizeObserver.observe(container);

      cleanupFn = () => {
        mounted = false;
        resizeObserver.disconnect();
        chart.remove();
        chartRef.current = null;
        seriesRef.current = null;
        volumeSeriesRef.current = null;
      };
    };

    rafId = requestAnimationFrame(initChart);

    return () => {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  // Handle theme changes
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
          68,372.45
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-[var(--positive)]">+$3,422.15</span>
          <span className="text-sm font-bold text-[var(--positive)]">+5.27%</span>
        </div>
      </div>

      {/* LIVE Badge */}
      <div className="absolute top-14 right-4 z-10 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-glass)] border border-[var(--accent-rose)]/30 backdrop-blur-md">
        <div className="live-dot" />
        <span className="text-[10px] font-black text-[var(--accent-rose)] tracking-widest uppercase">Live</span>
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

      {/* Chart container — MUST have a defined height */}
      <div ref={chartContainerRef} className="flex-1 min-h-0 relative z-[1] overflow-hidden" />
    </div>
  );
}
