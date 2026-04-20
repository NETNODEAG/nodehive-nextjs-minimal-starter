'use client';

import { useState } from 'react';
import { Config } from '@puckeditor/core';
import { UIMessage } from 'ai';
import { BotIcon, ChevronDownIcon, Loader2Icon, UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

type ChatMessageProps = {
  message: UIMessage;
  isStreaming?: boolean;
  config?: Config;
};

function getComponentLabel(type: string | undefined, config?: Config): string {
  if (!type) return '';
  return config?.components?.[type]?.label || type;
}

type MessagePart = UIMessage['parts'][number];
type ToolPartGroup = { kind: 'tools'; parts: MessagePart[] };
type SinglePartGroup = { kind: 'single'; part: MessagePart };
type PartGroup = ToolPartGroup | SinglePartGroup;

function isToolPart(part: MessagePart): boolean {
  return part.type.startsWith('tool-') || part.type === 'dynamic-tool';
}

function isVisibleSinglePart(part: MessagePart): boolean {
  if (part.type === 'text') return Boolean(part.text);
  if (part.type === 'file') return true;
  return false;
}

function groupParts(parts: readonly MessagePart[]): PartGroup[] {
  const groups: PartGroup[] = [];
  let currentTools: MessagePart[] = [];

  const flush = () => {
    if (currentTools.length > 0) {
      groups.push({ kind: 'tools', parts: currentTools });
      currentTools = [];
    }
  };

  for (const part of parts) {
    if (isToolPart(part)) {
      currentTools.push(part);
    } else if (isVisibleSinglePart(part)) {
      flush();
      groups.push({ kind: 'single', part });
    }
    // Invisible control parts (step-start, reasoning, etc.) are ignored:
    // they neither render nor break a tool-call group.
  }
  flush();
  return groups;
}

export function ChatMessage({
  message,
  isStreaming,
  config,
}: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2.5', isUser && 'justify-end')}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <BotIcon className="h-4 w-4 text-gray-600" />
        </div>
      )}

      <div className="flex max-w-[85%] flex-col gap-1">
        {groupParts(message.parts).map((group, gIdx) => {
          if (group.kind === 'tools') {
            return (
              <ToolCallGroup key={gIdx} parts={group.parts} config={config} />
            );
          }
          const { part } = group;
          const key = `${gIdx}`;

          if (part.type === 'text') {
            if (!part.text) return null;
            return (
              <div
                key={key}
                className={cn(
                  'rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                  isUser
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                {isUser ? (
                  part.text
                ) : (
                  <div className="prose prose-sm prose-gray prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-headings:mt-3 prose-headings:mb-2 prose-pre:my-2 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:text-xs max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {part.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            );
          }

          if (part.type === 'file') {
            if (part.mediaType?.startsWith('image/')) {
              return (
                <div key={key} className="overflow-hidden rounded-xl">
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
                key={key}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500"
              >
                {part.filename || 'File attached'}
              </div>
            );
          }
          return null;
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

function ToolCallRow({ part, config }: { part: MessagePart; config?: Config }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toolPart = part as any;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {toolPart.state === 'output-available' ? (
        <span className="text-green-600">&#10003;</span>
      ) : toolPart.state === 'output-error' ? (
        <span className="text-red-500">&#10007;</span>
      ) : (
        <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
      )}
      <span>{getToolLabel(toolPart, config)}</span>
    </div>
  );
}

function isCompletedToolPart(part: MessagePart): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = (part as any).state;
  return state === 'output-available' || state === 'output-error';
}

function ToolCallGroup({
  parts,
  config,
}: {
  parts: MessagePart[];
  config?: Config;
}) {
  const [expanded, setExpanded] = useState(false);
  if (parts.length === 0) return null;

  const completed = parts.filter(isCompletedToolPart);
  const active = parts.find((p) => !isCompletedToolPart(p));

  // Exactly one completed tool and no active → render inline without header.
  if (!active && completed.length === 1) {
    return (
      <div className="rounded-xl bg-gray-50 px-3.5 py-2">
        <ToolCallRow part={completed[0]} config={config} />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gray-50 px-3.5 py-2">
      {completed.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full cursor-pointer items-center gap-1.5 text-left text-sm text-gray-600 hover:text-gray-900"
          title={expanded ? 'Hide tool calls' : 'Show tool calls'}
        >
          <ChevronDownIcon
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              expanded ? 'rotate-180' : '-rotate-90'
            )}
          />
          <span>
            Tools called <span className="text-gray-400">·</span>{' '}
            {completed.length}
          </span>
        </button>
      )}
      {expanded && completed.length > 0 && (
        <div className="mt-1.5 space-y-1 border-t border-gray-200 pt-1.5">
          {completed.map((part, i) => (
            <ToolCallRow key={i} part={part} config={config} />
          ))}
        </div>
      )}
      {active && (
        <div
          className={cn(
            completed.length > 0 && 'mt-1.5 border-t border-gray-200 pt-1.5'
          )}
        >
          <ToolCallRow part={active} config={config} />
        </div>
      )}
    </div>
  );
}

function typeFromComponentId(id: string | undefined): string | undefined {
  if (!id) return undefined;
  const dash = id.indexOf('-');
  return dash > 0 ? id.slice(0, dash) : id;
}

function getToolLabel(part: any, config?: Config): string {
  const toolName = part.toolName || part.type?.replace('tool-', '') || '';
  const done = part.state === 'output-available';
  const input = part.input || {};

  switch (toolName) {
    case 'get_component_spec': {
      const label = getComponentLabel(input.name, config);
      return label
        ? done
          ? `Read ${label} spec`
          : `Reading ${label} spec...`
        : done
          ? 'Read component spec'
          : 'Reading component spec...';
    }
    case 'add_component': {
      const label = getComponentLabel(input.type, config);
      return label
        ? done
          ? `${label} added`
          : `Adding ${label}...`
        : done
          ? 'Component added'
          : 'Adding component...';
    }
    case 'modify_component': {
      const label = getComponentLabel(
        typeFromComponentId(input.componentId),
        config
      );
      return label
        ? done
          ? `${label} modified`
          : `Modifying ${label}...`
        : done
          ? 'Component modified'
          : 'Modifying component...';
    }
    case 'remove_component': {
      const label = getComponentLabel(
        typeFromComponentId(input.componentId),
        config
      );
      return label
        ? done
          ? `${label} removed`
          : `Removing ${label}...`
        : done
          ? 'Component removed'
          : 'Removing component...';
    }
    case 'set_page_metadata':
      return done ? 'Page metadata updated' : 'Updating page metadata...';
    case 'search_media':
      return done ? 'Media search complete' : 'Searching media library...';
    case 'fetch_url':
      return done ? 'URL analyzed' : 'Analyzing URL...';
    default:
      return done ? 'Done' : 'Working...';
  }
}
