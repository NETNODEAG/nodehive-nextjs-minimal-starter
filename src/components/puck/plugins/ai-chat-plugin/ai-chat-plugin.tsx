'use client';

import { Config, Plugin } from '@puckeditor/core';
import { BotIcon } from 'lucide-react';

import { AiChatPanel } from './ai-chat-panel';

type CreateAiChatPluginOptions = {
  config: Config;
  nodeId: string;
};

export function createAiChatPlugin({
  config,
  nodeId,
}: CreateAiChatPluginOptions): Plugin {
  return {
    name: 'ai-chat',
    label: 'AI Assistant',
    icon: <BotIcon className="size-6" />,
    render: () => <AiChatPanel config={config} nodeId={nodeId} />,
  };
}
