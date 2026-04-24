# Trading Dashboard

AI-powered trading dashboard with Kraken exchange integration and Hermes Agent.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Charts**: lightweight-charts, recharts
- **State**: Zustand, SWR
- **LLM**: OpenAI-compatible API (Ollama/Hermes)
- **Exchange**: Kraken via kraken-cli

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

## Features
- Real-time price charts
- Order book visualization
- Portfolio tracking
- Trade execution
- AI agent (configurable)
- Chat with Hermes LLM

## Deployment

See [Trading Dashboard Blueprint](../Trading-Dashboard-Blueprint.md) for full deployment guide.
