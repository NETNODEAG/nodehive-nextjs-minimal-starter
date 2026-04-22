'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ComponentData, Config, createUsePuck, Data } from '@puckeditor/core';
import {
  DefaultChatTransport,
  FileUIPart,
  lastAssistantMessageIsCompleteWithToolCalls,
  TextUIPart,
  UIMessage,
} from 'ai';
import {
  ArrowUpIcon,
  BotIcon,
  FileIcon,
  HistoryIcon,
  ImageIcon,
  PaperclipIcon,
  PlusIcon,
  SquareIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn, getLocaleFromPathname } from '@/lib/utils';
import { FileAttachmentButton } from './components/attachment-button';
import { ChatHistoryList } from './components/chat-history-list';
import { ChatMessage } from './components/chat-message';
import {
  ChatSession,
  generateChatId,
  useChatHistory,
} from './hooks/use-chat-history';
import {
  findComponentLocation,
  getZoneLength,
} from './utils/find-component-location';

function collectToolCallIds(messages: UIMessage[]): string[] {
  const ids: string[] = [];
  for (const message of messages) {
    if (message.role !== 'assistant') continue;
    for (const part of message.parts) {
      if (!part.type.startsWith('tool-') && part.type !== 'dynamic-tool')
        continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = (part as any).toolCallId;
      if (id) ids.push(id);
    }
  }
  return ids;
}

const usePuck = createUsePuck();

type AiChatPanelProps = {
  config: Config;
  nodeId: string;
};

const QUICK_ACTIONS = [
  { label: 'About page', prompt: 'Create an about page' },
  { label: 'Pricing page', prompt: 'Create a pricing page' },
];

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is TextUIPart => p.type === 'text')
    .map((p) => p.text)
    .join(' ');
}

export function AiChatPanel({ config, nodeId }: AiChatPanelProps) {
  const appState = usePuck((s) => s.appState);
  const dispatch = usePuck((s) => s.dispatch);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const locale = getLocaleFromPathname(window.location.pathname);

  const [showHistory, setShowHistory] = useState(false);
  // Generate a chat id up front so the useChat instance has a stable id from
  // the first render. Without this, the first sendMessage would race with a
  // setActiveChatId and drop the user's message.
  const [activeChatId, setActiveChatId] = useState<string>(() =>
    generateChatId()
  );
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [pendingFiles, setPendingFiles] = useState<
    { file: File; base64: string }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);
  const appliedToolCallIds = useRef<Set<string>>(new Set());

  const { getChatSessions, loadMessages, saveMessages, deleteChat } =
    useChatHistory(nodeId);

  // Load initial sessions once, switch to the latest if one exists.
  useEffect(() => {
    const existingSessions = getChatSessions();
    setSessions(existingSessions);
    if (existingSessions.length > 0) {
      const latestId = existingSessions[0].id;
      // Seed the applied-set with all existing tool call ids so restored
      // history doesn't re-dispatch the patches (would duplicate content).
      appliedToolCallIds.current = new Set(
        collectToolCallIds(loadMessages(latestId))
      );
      setActiveChatId(latestId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { messages, sendMessage, setMessages, status, stop, addToolOutput } =
    useChat({
      id: activeChatId,
      transport: new DefaultChatTransport({
        api: `/${locale}/api/puck/ai-chat`,
        body: {
          puckConfig: JSON.stringify(config),
          puckData: JSON.stringify(appState?.data),
        },
      }),
      messages: loadMessages(activeChatId),
      // Auto-resubmit when an interactive tool (e.g. ask_user_questions) gets
      // its output from the UI — otherwise the chat sits idle after submit.
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      onError: (error) => {
        console.error('AI chat error:', error);
        toast.error('AI request failed. Please try again.');
      },
    });

  // Apply patch-style tool outputs to the Puck editor as they stream in,
  // using fine-grained actions (insert+replace / replace / remove) so the
  // editor re-renders only the touched zone — no full-tree flash.
  // Processes one tool call per effect run; after dispatch, appState.data
  // updates and this effect re-runs with fresh state to pick up the next.
  useEffect(() => {
    for (const message of messages) {
      if (message.role !== 'assistant') continue;
      for (const part of message.parts) {
        if (!part.type.startsWith('tool-') && part.type !== 'dynamic-tool')
          continue;
        const toolPart = part as {
          toolCallId?: string;
          state?: string;
          output?: {
            action?: 'add' | 'modify' | 'remove' | 'setRoot';
            id?: string;
            component?: ComponentData;
            newProps?: Record<string, unknown>;
            fields?: Record<string, unknown>;
            destinationZone?: string;
            destinationIndex?: number;
          };
        };
        if (
          toolPart.state !== 'output-available' ||
          !toolPart.output?.action ||
          !toolPart.toolCallId ||
          appliedToolCallIds.current.has(toolPart.toolCallId)
        ) {
          continue;
        }

        const output = toolPart.output;
        const currentData = appState?.data as Data | undefined;
        if (!currentData) return;

        try {
          if (
            output.action === 'add' &&
            output.component &&
            output.destinationZone
          ) {
            const zone = output.destinationZone;
            const index =
              output.destinationIndex !== undefined &&
              output.destinationIndex >= 0
                ? output.destinationIndex
                : getZoneLength(currentData, config, zone);
            dispatch({
              type: 'insert',
              componentType: output.component.type,
              destinationZone: zone,
              destinationIndex: index,
              id: output.component.props.id as string,
            });
            dispatch({
              type: 'replace',
              destinationZone: zone,
              destinationIndex: index,
              data: output.component,
            });
          } else if (
            output.action === 'modify' &&
            output.id &&
            output.newProps
          ) {
            const location = findComponentLocation(
              currentData,
              config,
              output.id
            );
            if (!location) {
              console.warn(
                `modify_component: id ${output.id} not found in current tree`
              );
            } else {
              dispatch({
                type: 'replace',
                destinationZone: location.zone,
                destinationIndex: location.index,
                data: {
                  ...location.component,
                  props: {
                    ...location.component.props,
                    ...output.newProps,
                    id: output.id,
                  },
                },
              });
            }
          } else if (output.action === 'remove' && output.id) {
            const location = findComponentLocation(
              currentData,
              config,
              output.id
            );
            if (!location) {
              console.warn(
                `remove_component: id ${output.id} not found in current tree`
              );
            } else {
              dispatch({
                type: 'remove',
                zone: location.zone,
                index: location.index,
              });
            }
          } else if (output.action === 'setRoot' && output.fields) {
            dispatch({
              type: 'replaceRoot',
              root: {
                ...(currentData.root || { props: {} }),
                props: {
                  ...(currentData.root?.props || {}),
                  ...output.fields,
                },
              },
            });
          }
        } catch (err) {
          console.error('Failed to apply AI patch:', err, output);
        }

        appliedToolCallIds.current.add(toolPart.toolCallId);
        // Process one per run — effect re-runs after appState.data updates.
        return;
      }
    }
  }, [messages, appState, config, dispatch]);

  // Save messages to localStorage when streaming finishes
  useEffect(() => {
    if (!activeChatId || messages.length === 0) return;
    if (status === 'streaming' || status === 'submitted') return;

    const firstUserMsg = messages.find((m) => m.role === 'user');
    const title = firstUserMsg
      ? getMessageText(firstUserMsg).slice(0, 60) || 'New chat'
      : 'New chat';

    saveMessages(activeChatId, messages, title);
  }, [messages, activeChatId, saveMessages, status]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const refreshSessions = () => {
    setSessions(getChatSessions());
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText && pendingFiles.length === 0) return;

    const files: FileUIPart[] = pendingFiles.map(({ file, base64 }) => ({
      type: 'file',
      filename: file.name,
      mediaType: file.type as `${string}/${string}`,
      url: base64,
    }));

    sendMessage({
      text:
        messageText ||
        'Analyze this file and suggest how to use it on the page.',
      ...(files.length > 0 ? { files } : {}),
    });
    setInput('');
    setPendingFiles([]);
  };

  const handleAttachFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPendingFiles((prev) => [...prev, { file, base64 }]);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
      e.preventDefault();
      files.forEach(handleAttachFile);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer?.types.includes('Files')) return;
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer?.types.includes('Files')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer?.types.includes('Files')) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer?.types.includes('Files')) return;
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleAttachFile);
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewChat = () => {
    const newId = generateChatId();
    appliedToolCallIds.current.clear();
    setActiveChatId(newId);
    setMessages([]);
    setShowHistory(false);
  };

  const handleSelectChat = (chatId: string) => {
    const loaded = loadMessages(chatId);
    // Seed applied-set with existing tool call ids so we don't re-dispatch
    // them against the live editor state (would duplicate components).
    appliedToolCallIds.current = new Set(collectToolCallIds(loaded));
    setActiveChatId(chatId);
    setMessages(loaded);
    setShowHistory(false);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    refreshSessions();
    if (chatId === activeChatId) {
      handleNewChat();
    }
  };

  const isStreaming = status === 'streaming' || status === 'submitted';

  if (showHistory) {
    return (
      <ChatHistoryList
        sessions={sessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <h3 className="text-sm font-medium text-gray-900">AI page builder</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewChat}
            className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="New chat"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              refreshSessions();
              setShowHistory(true);
            }}
            className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Chat history"
          >
            <HistoryIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <BotIcon className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-700">
              What do you want to build?
            </p>
            <p className="mt-1 text-xs text-gray-400">
              I can create and modify your page content.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                config={config}
                isStreaming={
                  isStreaming &&
                  message.id === messages[messages.length - 1]?.id
                }
                onAnswerQuestions={(toolCallId, answers) => {
                  addToolOutput({
                    tool: 'ask_user_questions',
                    toolCallId,
                    output: { answers },
                  });
                }}
              />
            ))}
            {status === 'submitted' && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <BotIcon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-3.5 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500" />
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-3">
        {/* Quick actions */}
        {messages.length === 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.prompt)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >
                {action.label}
                <ArrowUpIcon className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
        <div
          className={cn(
            'rounded-xl border bg-white transition-colors',
            isDragging
              ? 'border-gray-900 ring-2 ring-gray-900/10'
              : 'border-gray-200'
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {pendingFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-b border-gray-100 p-2">
              {pendingFiles.map((pending, index) => {
                const isImage = pending.file.type.startsWith('image/');
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 py-1 pr-1 pl-2 text-xs text-gray-700"
                  >
                    {isImage ? (
                      <ImageIcon className="h-3.5 w-3.5 text-gray-500" />
                    ) : (
                      <FileIcon className="h-3.5 w-3.5 text-gray-500" />
                    )}
                    <span className="max-w-[140px] truncate">
                      {pending.file.name}
                    </span>
                    <button
                      onClick={() => removePendingFile(index)}
                      className="cursor-pointer rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                      title="Remove attachment"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={handlePaste}
            placeholder={
              isDragging ? 'Drop to attach' : 'What do you want to build?'
            }
            className="w-full resize-none rounded-xl border-0 px-3.5 pt-3 pb-1 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex gap-1">
              <FileAttachmentButton
                onAttach={handleAttachFile}
                icon={<PaperclipIcon className="h-4 w-4" />}
              />
            </div>
            {isStreaming ? (
              <button
                onClick={stop}
                className="cursor-pointer rounded-full bg-gray-900 p-2 text-white transition-colors hover:bg-gray-700"
                title="Stop generating"
              >
                <SquareIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() && pendingFiles.length === 0}
                className="cursor-pointer rounded-full bg-gray-900 p-2 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                title="Send message"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
