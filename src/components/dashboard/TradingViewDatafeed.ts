/**
 * TradingView UDF (Universal Data Feed) compatible datafeed
 * Connects lightweight-charts to Binance for real-time OHLCV data
 * 
 * Implements the TradingView Datafeed API pattern:
 * - getBars() → fetch historical OHLCV via Binance REST API
 * - subscribeBars() → subscribe to real-time kline updates via Binance WebSocket
 * - unsubscribeBars() → unsubscribe when symbol/resolution changes
 * 
 * Docs: https://www.tradingview.com/charting-library-docs/latest/tutorials/implement_datafeed_tutorial/
 */

import { IChartApi, ISeriesApi, CandlestickData, HistogramData, Time } from 'lightweight-charts';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Bar {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Subscriber {
  symbolInfo: SymbolInfo;
  resolution: string;
  onRealtimeCallback: (bar: Bar) => void;
  UID: string;
}

interface SymbolInfo {
  name: string;           // Display name e.g. "BTC/USDT"
  full_name: string;     // Full symbol e.g. "BTCUSDT"
  ticker: string;         // Binance symbol e.g. "BTCUSDT"
  description: string;
  type: string;
  exchange: string;
  listed_exchange: string;
  timezone: string;
  minmov: number;
  pricescale: number;
  session: string;
  has_intraday: boolean;
  has_daily: boolean;
  has_weekly_and_monthly: boolean;
  supported_resolutions: string[];
}

// ─── Resolution Mapping ────────────────────────────────────────────────────────
// lightweight-charts uses TradingView-style resolution strings
const RESOLUTION_MAP: Record<string, string> = {
  '1': '1m', '5': '5m', '15': '15m', '30': '30m',
  '60': '1h', '240': '4h', '1D': '1d', '1W': '1w',
  '1m': '1m', '5m': '5m', '15m': '15m', '30m': '30m',
  '1H': '1h', '4H': '4h', '1D': '1d', '1W': '1w',
};

const BINANCE_INTERVAL_MAP: Record<string, string> = {
  '1': '1m', '5': '5m', '15': '15m', '30': '30m',
  '60': '1h', '240': '4h', '1D': '1d', '1W': '1w',
  '1m': '1m', '5m': '5m', '15m': '15m', '30m': '30m',
  '1h': '1h', '4h': '4h', '1d': '1d', '1w': '1w',
};

const SUPPORTED_RESOLUTIONS = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W'];

// ─── Symbol Definitions ───────────────────────────────────────────────────────

const SYMBOLS: Record<string, SymbolInfo> = {
  BTCUSDT: {
    name: 'BTC/USDT',
    full_name: 'BTCUSDT',
    ticker: 'BTCUSDT',
    description: 'Bitcoin / Tether',
    type: 'crypto',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    minmov: 1,
    pricescale: 2, // 2 decimal places → multiply by 100
    session: '24x7',
    has_intraday: true,
    has_daily: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
  },
  ETHUSDT: {
    name: 'ETH/USDT',
    full_name: 'ETHUSDT',
    ticker: 'ETHUSDT',
    description: 'Ethereum / Tether',
    type: 'crypto',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    minmov: 1,
    pricescale: 2,
    session: '24x7',
    has_intraday: true,
    has_daily: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
  },
  SOLUSDT: {
    name: 'SOL/USDT',
    full_name: 'SOLUSDT',
    ticker: 'SOLUSDT',
    description: 'Solana / Tether',
    type: 'crypto',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    minmov: 1,
    pricescale: 4, // 4 decimal places
    session: '24x7',
    has_intraday: true,
    has_daily: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
  },
};

// ─── TradingView UDF Datafeed Class ─────────────────────────────────────────

export class BinanceDatafeed {
  private subscribers: Map<string, Subscriber> = new Map();
  private ws: WebSocket | null = null;
  private wsConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribedSymbols: Set<string> = new Set();

  // Reference to chart API for updating bars
  private chartApi: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<'Candlestick'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;

  constructor() {
    this.connectWebSocket();
  }

  // ─── WebSocket Management ────────────────────────────────────────────────────

  private connectWebSocket(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    // Binance combined stream for all kline subscriptions
    // Format: streams: "btcusdt@kline_1m/ethusdt@kline_1m/..."
    const streams = Array.from(this.subscribedSymbols)
      .map((s) => `${s.toLowerCase()}@kline_1m`)
      .join('/');

    if (streams.length === 0) return;

    this.ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    this.ws.onopen = () => {
      this.wsConnected = true;
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleKlineMessage(message);
      } catch {
        // Ignore parse errors
      }
    };

    this.ws.onerror = () => {
      this.wsConnected = false;
    };

    this.ws.onclose = () => {
      this.wsConnected = false;
      this.attemptReconnect();
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    setTimeout(() => this.connectWebSocket(), delay);
  }

  private disconnectWebSocket(): void {
    this.reconnectAttempts = this.maxReconnectAttempts; // prevent auto-reconnect
    this.ws?.close();
    this.ws = null;
    this.wsConnected = false;
  }

  // ─── Kline Message Handler ─────────────────────────────────────────────────
  // Binance kline message format:
  // { e: "kline", s: "BTCUSDT", k: { t: 1704067200000, o: "68372.50", h: "68400.00", l: "68350.00", c: "68380.00", v: "125.5", x: false } }
  // x = true means this is the candle close (final)

  private handleKlineMessage(message: {
    stream?: string;
    data?: {
      e: string;
      s: string;
      k: {
        t: number;   // Kline start time
        o: string;    // Open
        h: string;    // High
        l: string;    // Low
        c: string;    // Close
        v: string;    // Volume
        x: boolean;   // Is candle closed
      };
    };
  }): void {
    if (message.data?.e !== 'kline') return;

    const k = message.data.k;
    const ticker = message.data.s;
    const bar: Bar = {
      time: (k.t / 1000) as Time,
      open: parseFloat(k.o),
      high: parseFloat(k.h),
      low: parseFloat(k.l),
      close: parseFloat(k.c),
      volume: parseFloat(k.v),
    };

    // Find subscribers for this symbol
    this.subscribers.forEach((subscriber) => {
      if (subscriber.symbolInfo.ticker === ticker) {
        subscriber.onRealtimeCallback(bar);
      }
    });
  }

  // ─── TradingView UDF API ────────────────────────────────────────────────────
  // These methods are called by lightweight-charts when user changes symbol/resolution

  /**
   * Called by lightweight-charts to get configuration info
   */
  getConfiguration(): { supports_search?: boolean; supports_group_request?: boolean; supported_resolutions?: string[] } {
    return {
      supports_search: true,
      supports_group_request: false,
      supported_resolutions: SUPPORTED_RESOLUTIONS,
    };
  }

  /**
   * Get symbol info by ticker
   */
  getSymbolInfo(ticker: string): SymbolInfo | null {
    const upper = ticker.toUpperCase().replace('/', '');
    return SYMBOLS[upper] || SYMBOLS[`${upper}USDT`] || null;
  }

  /**
   * Resolve a symbol name to full symbol info
   */
  resolveSymbol(
    symbolName: string,
    onResolved: (symbolInfo: SymbolInfo) => void,
    onError: (err: string) => void
  ): void {
    const info = this.getSymbolInfo(symbolName);
    if (info) {
      onResolved(info);
    } else {
      // Try adding USDT suffix
      const withSuffix = `${symbolName.toUpperCase().replace('/', '')}USDT`;
      if (SYMBOLS[withSuffix]) {
        onResolved(SYMBOLS[withSuffix]);
      } else {
        onError('Symbol not found');
      }
    }
  }

  /**
   * Get historical OHLCV bars from Binance REST API
   * Called by lightweight-charts when chart loads or user changes timeframe
   */
  async getBars(
    symbolInfo: SymbolInfo,
    resolution: string,
    rangeStart: number,
    rangeEnd: number,
    onResult: (bars: Bar[], meta?: { noData?: boolean }) => void,
    onError: (err: string) => void
  ): Promise<void> {
    try {
      const binanceInterval = BINANCE_INTERVAL_MAP[resolution] || '1h';
      const limit = 500;

      const url = `https://api.binance.com/api/v3/klines?symbol=${symbolInfo.ticker}&interval=${binanceInterval}&limit=${limit}&startTime=${rangeStart * 1000}&endTime=${rangeEnd * 1000}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        onResult([], { noData: true });
        return;
      }

      // Binance kline format: [openTime, open, high, low, close, volume, closeTime, ...]
      const bars: Bar[] = data.map((k: (string | number)[]) => ({
        time: (Number(k[0]) / 1000) as Time,
        open: parseFloat(k[1] as string),
        high: parseFloat(k[2] as string),
        low: parseFloat(k[3] as string),
        close: parseFloat(k[4] as string),
        volume: parseFloat(k[5] as string),
      }));

      onResult(bars);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to fetch bars');
    }
  }

  /**
   * Subscribe to real-time kline updates
   * Called by lightweight-charts when user selects a symbol
   * Pattern from: https://www.tradingview.com/charting-library-docs/latest/tutorials/implement_datafeed_tutorial/Streaming-Implementation/
   */
  subscribeBars(
    symbolInfo: SymbolInfo,
    resolution: string,
    onRealtimeCallback: (bar: Bar) => void,
    subscriberUID: string
  ): void {
    // Store subscriber
    this.subscribers.set(subscriberUID, {
      symbolInfo,
      resolution,
      onRealtimeCallback,
      UID: subscriberUID,
    });

    // Add to WebSocket subscription
    const ticker = symbolInfo.ticker;
    if (!this.subscribedSymbols.has(ticker)) {
      this.subscribedSymbols.add(ticker);
      // Reconnect WS with new subscription
      if (this.ws) {
        this.disconnectWebSocket();
        this.connectWebSocket();
      }
    }
  }

  /**
   * Unsubscribe from real-time updates
   * Called by lightweight-charts when user switches symbol or timeframe
   */
  unsubscribeBars(subscriberUID: string): void {
    const subscriber = this.subscribers.get(subscriberUID);
    if (!subscriber) return;

    // Remove from subscribers
    this.subscribers.delete(subscriberUID);

    // Check if any subscribers still need this symbol
    const ticker = subscriber.symbolInfo.ticker;
    const stillNeeded = Array.from(this.subscribers.values()).some(
      (s) => s.symbolInfo.ticker === ticker
    );

    if (!stillNeeded) {
      this.subscribedSymbols.delete(ticker);
      // Reconnect WS without this symbol
      if (this.ws) {
        this.disconnectWebSocket();
        this.connectWebSocket();
      }
    }
  }

  /**
   * Get current server time
   */
  getServerTime(onResult: (serverTime: number) => void): void {
    onResult(Math.floor(Date.now() / 1000));
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.disconnectWebSocket();
    this.subscribers.clear();
    this.subscribedSymbols.clear();
  }
}
