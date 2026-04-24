'use client';

import { useState } from 'react';

export default function TradePanel() {
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [pair, setPair] = useState('BTCUSD');
  const [volume, setVolume] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/kraken/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, pair, volume, price }),
      });
      const data = await res.json();
      console.log('Trade result:', data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Trade</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAction('buy')}
            className={`flex-1 py-2 rounded ${
              action === 'buy' ? 'bg-green-600' : 'bg-gray-700'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setAction('sell')}
            className={`flex-1 py-2 rounded ${
              action === 'sell' ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            Sell
          </button>
        </div>
        <input
          type="text"
          placeholder="Pair (e.g., BTCUSD)"
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          className="w-full bg-gray-700 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Volume"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="w-full bg-gray-700 rounded px-3 py-2"
          step="0.0001"
        />
        <input
          type="number"
          placeholder="Price (optional for market)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-gray-700 rounded px-3 py-2"
          step="0.01"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `${action.toUpperCase()} ${pair}`}
        </button>
      </form>
    </div>
  );
}
