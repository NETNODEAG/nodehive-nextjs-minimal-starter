'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Config, createUsePuck, Data } from '@puckeditor/core';
import { DefaultChatTransport, FileUIPart, TextUIPart, UIMessage } from 'ai';
import {
  ArrowUpIcon,
  BotIcon,
  HistoryIcon,
  ImageIcon,
  LinkIcon,
  SquareIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { getLocaleFromPathname } from '@/lib/utils';
import {
  ImageAttachmentButton,
  LinkAttachmentButton,
} from './components/attachment-button';
import { ChatHistoryList } from './components/chat-history-list';
import { ChatMessage } from './components/chat-message';
import {
  ChatSession,
  generateChatId,
  useChatHistory,
} from './hooks/use-chat-history';

const usePuck = createUsePuck();

type AiChatPanelProps = {
  config: Config;
  nodeId: string;
};

const QUICK_ACTIONS = [
  { label: 'Landing page', prompt: 'Create a landing page' },
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
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const { getChatSessions, loadMessages, saveMessages, deleteChat } =
    useChatHistory(nodeId);

  // Load initial sessions once
  useEffect(() => {
    const existingSessions = getChatSessions();
    setSessions(existingSessions);
    if (existingSessions.length > 0) {
      setActiveChatId(existingSessions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { messages, sendMessage, setMessages, status, stop } = useChat({
    id: activeChatId || undefined,
    transport: new DefaultChatTransport({
      api: `/${locale}/api/puck/ai-chat`,
      body: {
        puckConfig: JSON.stringify(config),
        puckData: JSON.stringify(appState?.data),
      },
    }),
    messages: activeChatId ? loadMessages(activeChatId) : [],
    onFinish: ({ messages: finishedMessages }) => {
      // Apply the last tool result that contains puckData
      const lastAssistant = [...finishedMessages]
        .reverse()
        .find((m) => m.role === 'assistant');
      if (!lastAssistant) return;

      let finalPuckData: Data | null = null;

      for (const part of lastAssistant.parts) {
        if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
          const toolPart = part as {
            state?: string;
            output?: { puckData?: Data };
          };
          if (
            toolPart.state === 'output-available' &&
            toolPart.output?.puckData
          ) {
            finalPuckData = toolPart.output.puckData;
          }
        }
      }

      if (finalPuckData) {
        dispatch({ type: 'setData', data: finalPuckData });
      }
    },
    onError: (error) => {
      console.error('AI chat error:', error);
      toast.error('AI request failed. Please try again.');
    },
  });

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
    if (!messageText) return;

    if (!activeChatId) {
      const newId = generateChatId();
      setActiveChatId(newId);
    }

    sendMessage({ text: messageText });
    setInput('');
  };

  const handleAttachLink = (url: string) => {
    if (!activeChatId) {
      setActiveChatId(generateChatId());
    }
    sendMessage({
      text: `Please analyze this webpage and suggest content: ${url}`,
    });
  };

  const handleAttachImage = (file: File) => {
    if (!activeChatId) {
      setActiveChatId(generateChatId());
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const files: FileUIPart[] = [
        {
          type: 'file',
          filename: file.name,
          mediaType: file.type as `${string}/${string}`,
          url: base64,
        },
      ];
      sendMessage({
        text: 'Analyze this image and suggest how to use it on the page.',
        files,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNewChat = () => {
    const newId = generateChatId();
    setActiveChatId(newId);
    setMessages([]);
    setShowHistory(false);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    const loaded = loadMessages(chatId);
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
        <button
          onClick={() => {
            refreshSessions();
            setShowHistory(true);
          }}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          title="Chat history"
        >
          <HistoryIcon className="h-4 w-4" />
        </button>
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
                isStreaming={
                  isStreaming &&
                  message.id === messages[messages.length - 1]?.id
                }
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-3">
        <div className="rounded-xl border border-gray-200 bg-white">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you want to build?"
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
              <LinkAttachmentButton
                onAttach={handleAttachLink}
                icon={<LinkIcon className="h-4 w-4" />}
              />
              <ImageAttachmentButton
                onAttach={handleAttachImage}
                icon={<ImageIcon className="h-4 w-4" />}
              />
            </div>
            {isStreaming ? (
              <button
                onClick={stop}
                className="rounded-full bg-gray-900 p-2 text-white transition-colors hover:bg-gray-700"
                title="Stop generating"
              >
                <SquareIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="rounded-full bg-gray-900 p-2 text-white transition-colors hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400"
                title="Send message"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick actions */}
        {messages.length === 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {action.label}
                <ArrowUpIcon className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
