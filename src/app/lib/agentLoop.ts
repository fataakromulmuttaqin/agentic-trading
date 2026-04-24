import { getBalance, getTicker, placeOrder } from './krakenClient';
import { chat } from './llmClient';

const MAX_TRADE_USD = parseInt(process.env.AGENT_MAX_TRADE_USD || '50');
const CHECK_INTERVAL = parseInt(process.env.AGENT_CHECK_INTERVAL_SECONDS || '60') * 1000;

interface AgentState {
  running: boolean;
  logs: string[];
}

const agentState: AgentState = { running: false, logs: [] };

export function startAgent(): void {
  agentState.running = true;
  agentState.logs.push('Agent started');

  const loop = async (): Promise<void> => {
    if (!agentState.running) return;

    try {
      const balance = await getBalance();
      const ticker = await getTicker('BTCUSD');
      agentState.logs.push('Checked market data');

      const decision = await chat([
        {
          role: 'system',
          content: `You are a trading agent. Current portfolio: ${JSON.stringify(balance)}. 
                   BTC ticker: ${JSON.stringify(ticker)}. Max trade: $${MAX_TRADE_USD}. 
                   Should we buy, sell, or hold? Respond with only: BUY, SELL, or HOLD.`,
        },
      ]);

      if (decision.includes('BUY') && ticker?.BTCUSD?.b) {
        const price = parseFloat(ticker.BTCUSD.b[0]);
        const volume = MAX_TRADE_USD / price;
        await placeOrder('buy', 'BTCUSD', volume);
        agentState.logs.push(`Bought ${volume} BTC at $${price}`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      agentState.logs.push(`Error: ${errorMsg}`);
    }

    if (agentState.running) {
      setTimeout(loop, CHECK_INTERVAL);
    }
  };

  loop();
}

export function stopAgent(): void {
  agentState.running = false;
  agentState.logs.push('Agent stopped');
}

export function getState(): AgentState {
  return { ...agentState };
}
