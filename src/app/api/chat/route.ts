import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || 'http://localhost:11434/v1',
  apiKey: process.env.LLM_API_KEY || 'ollama',
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const stream = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'hermes3',
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream2 = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk.choices[0]?.delta?.content || ''));
        }
        controller.close();
      },
    });

    return new Response(stream2, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
