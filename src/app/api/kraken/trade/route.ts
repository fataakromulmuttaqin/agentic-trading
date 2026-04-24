import { NextResponse } from 'next/server';
import { execa } from 'execa';

const KRAKEN_CLI_PATH = process.env.KRAKEN_CLI_PATH || `${process.env.HOME}/ruangkerja/dashboard-trading/kraken-cli/target/release/kraken`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, pair, volume, type, price } = body;

    const args = ['order', action, pair, volume.toString()];
    if (type) args.push('--type', type);
    if (price) args.push('--price', price.toString());
    args.push('-o', 'json');

    const { stdout } = await execa(KRAKEN_CLI_PATH, args, {
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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { txid } = body;

    const { stdout } = await execa(KRAKEN_CLI_PATH, ['order', 'cancel', txid, '-o', 'json'], {
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
