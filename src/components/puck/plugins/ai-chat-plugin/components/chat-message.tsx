'use client';

import { UIMessage } from 'ai';
import { BotIcon, Loader2Icon, UserIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type ChatMessageProps = {
  message: UIMessage;
  isStreaming?: boolean;
};

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2.5', isUser && 'justify-end')}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <BotIcon className="h-4 w-4 text-gray-600" />
        </div>
      )}

      <div className="flex max-w-[85%] flex-col gap-1">
        {message.parts.map((part, index) => {
          switch (part.type) {
            case 'text':
              if (!part.text) return null;
              return (
                <div
                  key={index}
                  className={cn(
                    'rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                    isUser
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  {part.text}
                </div>
              );

            case 'file':
              if (part.mediaType?.startsWith('image/')) {
                return (
                  <div key={index} className="overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={part.url}
                      alt={part.filename || 'Attached image'}
                      className="max-h-48 rounded-xl object-cover"
                    />
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500"
                >
                  {part.filename || 'File attached'}
                </div>
              );

            default:
              // Handle tool call parts (tool-*)
              if (
                part.type.startsWith('tool-') ||
                part.type === 'dynamic-tool'
              ) {
                const toolPart = part as any;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-xl bg-gray-50 px-3.5 py-2 text-sm text-gray-600"
                  >
                    {toolPart.state === 'output-available' ? (
                      <span className="text-green-600">&#10003;</span>
                    ) : toolPart.state === 'output-error' ? (
                      <span className="text-red-500">&#10007;</span>
                    ) : (
                      <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                    )}
                    <span>{getToolLabel(toolPart)}</span>
                  </div>
                );
              }
              return null;
          }
        })}

        {isStreaming && message.parts.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3.5 py-2 text-sm text-gray-500">
            <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900">
          <UserIcon className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}

function getToolLabel(part: any): string {
  const toolName = part.toolName || part.type?.replace('tool-', '') || '';

  switch (toolName) {
    case 'set_page_content':
      return part.state === 'output-available'
        ? 'Page content updated'
        : 'Updating page content...';
    case 'modify_component':
      return part.state === 'output-available'
        ? 'Component modified'
        : 'Modifying component...';
    case 'add_component':
      return part.state === 'output-available'
        ? 'Component added'
        : 'Adding component...';
    case 'remove_component':
      return part.state === 'output-available'
        ? 'Component removed'
        : 'Removing component...';
    case 'search_media':
      return part.state === 'output-available'
        ? 'Media search complete'
        : 'Searching media library...';
    case 'fetch_url':
      return part.state === 'output-available'
        ? 'URL analyzed'
        : 'Analyzing URL...';
    default:
      return part.state === 'output-available' ? 'Done' : 'Working...';
  }
}
