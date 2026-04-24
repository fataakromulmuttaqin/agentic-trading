import { NextResponse } from 'next/server';
import { execa } from 'execa';

const KRAKEN_CLI_PATH = process.env.KRAKEN_CLI_PATH || `${process.env.HOME}/ruangkerja/dashboard-trading/kraken-cli/target/release/kraken`;

export async function GET() {
  try {
    const { stdout } = await execa(KRAKEN_CLI_PATH, ['open-orders', '-o', 'json'], {
      env: {
        KRAKEN_API_KEY: process.env.KRAKEN_API_KEY || '',
        KRAKEN_API_SECRET: process.env.KRAKEN_API_SECRET || '',
      },
      stderr: 'ignore',
    });

    const data = JSON.parse(stdout);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
