import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || 'http://localhost:11434/v1',
  apiKey: process.env.LLM_API_KEY || 'ollama',
});

interface ChatMessage {
  role: string;
  content: string;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'hermes3',
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
  });
  return completion.choices[0]?.message?.content || '';
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const stream = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'hermes3',
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) onChunk(content);
  }
}
