'use client';

import { useState, useEffect } from 'react';

interface OrderBookEntry {
  price: string;
  volume: string;
}

export default function OrderBook() {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    // Placeholder - integrate with Kraken WebSocket
    setBids([
      { price: '67200.00', volume: '1.5' },
      { price: '67100.00', volume: '2.3' },
      { price: '67000.00', volume: '0.8' },
    ]);
    setAsks([
      { price: '67250.00', volume: '1.2' },
      { price: '67300.00', volume: '2.0' },
      { price: '67400.00', volume: '0.5' },
    ]);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Order Book</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-green-400 text-sm mb-2">Bids</h3>
          <div className="space-y-1">
            {bids.map((bid, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-green-400">{bid.price}</span>
                <span className="text-gray-400">{bid.volume}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-red-400 text-sm mb-2">Asks</h3>
          <div className="space-y-1">
            {asks.map((ask, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-red-400">{ask.price}</span>
                <span className="text-gray-400">{ask.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
