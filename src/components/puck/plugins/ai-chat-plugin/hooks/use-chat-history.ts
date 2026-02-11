import { UIMessage } from 'ai';

const STORAGE_PREFIX = 'puck-ai-chat';
const CHATS_INDEX_KEY = `${STORAGE_PREFIX}-index`;
const MAX_MESSAGES_PER_CHAT = 100;

export type ChatSession = {
  id: string;
  nodeId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

function getChatsIndex(nodeId: string): ChatSession[] {
  try {
    const stored = localStorage.getItem(CHATS_INDEX_KEY);
    if (!stored) return [];
    const all: ChatSession[] = JSON.parse(stored);
    return all.filter((c) => c.nodeId === nodeId);
  } catch {
    return [];
  }
}

function saveChatsIndex(nodeId: string, sessions: ChatSession[]) {
  try {
    const stored = localStorage.getItem(CHATS_INDEX_KEY);
    const all: ChatSession[] = stored ? JSON.parse(stored) : [];
    const otherNodes = all.filter((c) => c.nodeId !== nodeId);
    localStorage.setItem(
      CHATS_INDEX_KEY,
      JSON.stringify([...otherNodes, ...sessions])
    );
  } catch (error) {
    console.error('Failed to save chats index:', error);
  }
}

function getChatStorageKey(chatId: string) {
  return `${STORAGE_PREFIX}-${chatId}`;
}

export function generateChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChatHistory(nodeId: string) {
  const getChatSessions = (): ChatSession[] => {
    return getChatsIndex(nodeId).sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const loadMessages = (chatId: string): UIMessage[] => {
    try {
      const stored = localStorage.getItem(getChatStorageKey(chatId));
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  };

  const saveMessages = (
    chatId: string,
    messages: UIMessage[],
    title?: string
  ) => {
    try {
      const trimmed = messages.slice(-MAX_MESSAGES_PER_CHAT);
      localStorage.setItem(getChatStorageKey(chatId), JSON.stringify(trimmed));

      const sessions = getChatsIndex(nodeId);
      const existing = sessions.find((s) => s.id === chatId);
      if (existing) {
        existing.updatedAt = Date.now();
        if (title) existing.title = title;
      } else {
        sessions.push({
          id: chatId,
          nodeId,
          title: title || 'New chat',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      saveChatsIndex(nodeId, sessions);
    } catch (error) {
      console.error('Failed to save chat messages:', error);
    }
  };

  const deleteChat = (chatId: string) => {
    try {
      localStorage.removeItem(getChatStorageKey(chatId));
      const sessions = getChatsIndex(nodeId).filter((s) => s.id !== chatId);
      saveChatsIndex(nodeId, sessions);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  return {
    getChatSessions,
    loadMessages,
    saveMessages,
    deleteChat,
  };
}
