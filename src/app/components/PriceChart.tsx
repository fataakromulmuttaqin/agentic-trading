'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';

export default function PriceChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1f2937' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
    });

    return () => {
      chartRef.current?.remove();
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Price Chart</h2>
      <div ref={chartContainerRef} className="h-80" />
    </div>
  );
}
