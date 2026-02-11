'use client';

import {
  ArrowLeftIcon,
  MessageSquareIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { ChatSession } from '../hooks/use-chat-history';

type ChatHistoryListProps = {
  sessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onBack: () => void;
};

export function ChatHistoryList({
  sessions,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onBack,
}: ChatHistoryListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-gray-200 p-3">
        <button
          onClick={onBack}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <h3 className="flex-1 text-sm font-medium text-gray-900">
          Chat History
        </h3>
      </div>

      <div className="border-b border-gray-200 p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <PlusIcon className="h-4 w-4" />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-gray-500">
            No previous chats
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  session.id === activeChatId
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <button
                  onClick={() => onSelectChat(session.id)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <MessageSquareIcon className="h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{session.title}</div>
                    <div className="text-xs text-gray-400">
                      {formatRelativeTime(session.updatedAt)}
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(session.id);
                  }}
                  className="shrink-0 rounded p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-red-500"
                  title="Delete chat"
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
