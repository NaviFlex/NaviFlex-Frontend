import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Message } from 'ai';

export const runtime = 'edge';

 


export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  try {
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages  // ← el array ya incluye el mensaje 'system' desde el frontend
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error('Error en chat endpoint:', err);
    return new Response('Error en servidor', { status: 500 });
  }
}


