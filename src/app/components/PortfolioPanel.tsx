'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BalanceData {
  [asset: string]: { total?: string } | string;
}

export default function PortfolioPanel() {
  const { data, error } = useSWR<BalanceData>('/api/kraken/balance', fetcher, {
    refreshInterval: 30000,
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
      {error && <p className="text-red-400">Failed to load balance</p>}
      {!data && !error && <p className="text-gray-400">Loading...</p>}
      {data && !data.error && (
        <div className="space-y-2">
          {Object.entries(data).map(([asset, balance]) => (
            <div key={asset} className="flex justify-between">
              <span className="font-medium">{asset}</span>
              <span className="text-gray-400">
                {typeof balance === 'object' && balance !== null ? balance.total : balance}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
