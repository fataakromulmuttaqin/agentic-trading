'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AgentStatus() {
  const { data } = useSWR('/api/agent', fetcher, { refreshInterval: 10000 });
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs([
      'Agent initialized',
      'Checking market conditions...',
      'Portfolio within risk parameters',
    ]);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Agent Status</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            data?.enabled ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          {data?.enabled ? 'ON' : 'OFF'}
        </span>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-400">
          Max Trade: ${data?.maxTradeUsd || 50}
        </p>
      </div>
      <div className="bg-gray-900 rounded p-3 h-64 overflow-y-auto">
        {logs.map((log, i) => (
          <p key={i} className="text-sm text-gray-300 font-mono">
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}
