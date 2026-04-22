import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

import { buildSystemPrompt } from '@/components/puck/plugins/ai-chat-plugin/utils/build-system-prompt';
import { createAiChatTools } from './tools';

interface RouteParams {
  params: Promise<{
    lang: string;
  }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { lang } = await params;

  const body = await request.json();
  const {
    messages,
    puckConfig,
    puckData,
  }: {
    messages: UIMessage[];
    puckConfig: string;
    puckData: string;
  } = body;

  let parsedConfig;
  let parsedPuckData;
  try {
    parsedConfig = JSON.parse(puckConfig);
    parsedPuckData = JSON.parse(puckData);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON data provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const systemPrompt = buildSystemPrompt(parsedConfig, parsedPuckData, lang);

  const openai = createOpenAI({
    apiKey: process.env.AI_API_KEY,
  });

  const result = streamText({
    model: openai('gpt-5.4'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: createAiChatTools({
      puckConfig: parsedConfig,
      lang,
    }),
    stopWhen: (event) => event.steps.length >= 20,
  });

  return result.toUIMessageStreamResponse();
}
