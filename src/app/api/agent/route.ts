import { NextResponse } from 'next/server';

const AGENT_ENABLED = process.env.AGENT_ENABLED === 'true';
const MAX_TRADE_USD = parseInt(process.env.AGENT_MAX_TRADE_USD || '50');

export async function POST(request: Request) {
  if (!AGENT_ENABLED) {
    return NextResponse.json({ error: 'Agent is disabled' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, params } = body;

    return NextResponse.json({ 
      success: true, 
      message: 'Agent task received',
      action,
      params 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    enabled: AGENT_ENABLED,
    maxTradeUsd: MAX_TRADE_USD,
  });
}
