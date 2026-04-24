import { execa } from 'execa';

const KRAKEN_CLI_PATH = process.env.KRAKEN_CLI_PATH || 
  `${process.env.HOME}/ruangkerja/dashboard-trading/kraken-cli/target/release/kraken`;

const env = {
  KRAKEN_API_KEY: process.env.KRAKEN_API_KEY || '',
  KRAKEN_API_SECRET: process.env.KRAKEN_API_SECRET || '',
};

export async function getBalance() {
  const { stdout } = await execa(KRAKEN_CLI_PATH, ['balance', '-o', 'json'], {
    env,
    stderr: 'ignore',
  });
  return JSON.parse(stdout);
}

export async function getTicker(pair: string) {
  const { stdout } = await execa(KRAKEN_CLI_PATH, ['ticker', pair, '-o', 'json'], {
    stderr: 'ignore',
  });
  return JSON.parse(stdout);
}

export async function getOpenOrders() {
  const { stdout } = await execa(KRAKEN_CLI_PATH, ['open-orders', '-o', 'json'], {
    env,
    stderr: 'ignore',
  });
  return JSON.parse(stdout);
}

export async function placeOrder(action: string, pair: string, volume: number, price?: number) {
  const args = ['order', action, pair, volume.toString(), '-o', 'json'];
  if (price) args.push('--price', price.toString());

  const { stdout } = await execa(KRAKEN_CLI_PATH, args, {
    env,
    stderr: 'ignore',
  });
  return JSON.parse(stdout);
}

export async function cancelOrder(txid: string) {
  const { stdout } = await execa(KRAKEN_CLI_PATH, ['order', 'cancel', txid, '-o', 'json'], {
    env,
    stderr: 'ignore',
  });
  return JSON.parse(stdout);
}
