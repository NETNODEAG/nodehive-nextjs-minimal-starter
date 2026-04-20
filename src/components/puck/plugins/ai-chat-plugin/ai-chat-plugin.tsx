'use client';

import { Config, Plugin } from '@puckeditor/core';
import { BotIcon } from 'lucide-react';

import { AiChatPanel } from './ai-chat-panel';

type CreateAiChatPluginOptions = {
  config: Config;
  nodeId: string;
  /**
   * Optional business context (brand, tone, locale, audience). Injected into
   * the system prompt as a "BUSINESS CONTEXT" block on every request.
   */
  context?: string;
};

export function createAiChatPlugin({
  config,
  nodeId,
  context,
}: CreateAiChatPluginOptions): Plugin {
  return {
    name: 'ai-chat',
    label: 'AI',
    icon: <BotIcon className="size-6" />,
    render: () => (
      <AiChatPanel config={config} nodeId={nodeId} context={context} />
    ),
  };
}
