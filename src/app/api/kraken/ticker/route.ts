import { NextResponse } from 'next/server';
import { execa } from 'execa';

const KRAKEN_CLI_PATH = process.env.KRAKEN_CLI_PATH || `${process.env.HOME}/ruangkerja/dashboard-trading/kraken-cli/target/release/kraken`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair') || 'BTCUSD';

    const { stdout } = await execa(KRAKEN_CLI_PATH, ['ticker', pair, '-o', 'json'], {
      stderr: 'ignore',
    });

    const data = JSON.parse(stdout);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
