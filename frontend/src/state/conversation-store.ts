import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import type {
  Conversation,
  ConversationSummary,
  Message,
  ThreadStatus,
} from '../types/conversation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

interface ConversationStoreState {
  summaries: ConversationSummary[];
  messagesByThread: Record<string, Message[]>;
  participantsByThread: Record<string, Conversation['participants']>;
  activeThreadId?: string;
  unreadThreadIds: string[];
  socket?: Socket;
  setSummaries: (summaries: ConversationSummary[]) => void;
  upsertConversation: (conversation: Conversation) => void;
  updateThreadStatus: (threadId: string, status: ThreadStatus) => void;
  appendMessage: (threadId: string, message: Message) => void;
  setActiveThread: (threadId?: string) => void;
  ensureSocket: () => Socket | undefined;
}

export const useConversationStore = create<ConversationStoreState>((set, get) => ({
  summaries: [],
  messagesByThread: {},
  participantsByThread: {},
  unreadThreadIds: [],
  socket: undefined,

  setSummaries: (summaries) =>
    set(() => ({
      summaries,
    })),

  upsertConversation: (conversation) =>
    set((state) => {
      const messagesByThread = {
        ...state.messagesByThread,
        [conversation.id]: conversation.messages,
      };
      const participantsByThread = {
        ...state.participantsByThread,
        [conversation.id]: conversation.participants,
      };

      const existingIndex = state.summaries.findIndex((summary) => summary.id === conversation.id);
      const participantProfile = conversation.participants[1] ?? conversation.participants[0];
      const lastMessage = conversation.messages.at(-1);
      const summaryUpdate: ConversationSummary = {
        id: conversation.id,
        participant: participantProfile,
        lastMessagePreview: lastMessage?.body ?? '',
        status: conversation.status,
        lastMessageAt: conversation.lastMessageAt,
      };

      let summaries: ConversationSummary[];
      if (existingIndex >= 0) {
        summaries = [...state.summaries];
        summaries[existingIndex] = {
          ...summaries[existingIndex],
          ...summaryUpdate,
        };
      } else {
        summaries = [summaryUpdate, ...state.summaries];
      }

      return {
        messagesByThread,
        participantsByThread,
        summaries,
      };
    }),

  updateThreadStatus: (threadId, status) =>
    set((state) => ({
      summaries: state.summaries.map((summary) =>
        summary.id === threadId ? { ...summary, status } : summary,
      ),
    })),

  appendMessage: (threadId, message) =>
    set((state) => {
      const messages = state.messagesByThread[threadId] ?? [];
      const updatedMessages = [...messages, message];

      const summaries = state.summaries.map((summary) =>
        summary.id === threadId
          ? {
              ...summary,
              lastMessagePreview: message.body,
              lastMessageAt: message.sentAt,
            }
          : summary,
      );

      const isActive = state.activeThreadId === threadId;
      const unreadThreadIds = isActive
        ? state.unreadThreadIds.filter((id) => id !== threadId)
        : Array.from(new Set([...state.unreadThreadIds, threadId]));

      return {
        messagesByThread: {
          ...state.messagesByThread,
          [threadId]: updatedMessages,
        },
        summaries,
        unreadThreadIds,
      };
    }),

  setActiveThread: (threadId) =>
    set((state) => {
      const socket = get().ensureSocket();
      if (state.activeThreadId && state.activeThreadId !== threadId) {
        socket?.emit('thread:leave', { threadId: state.activeThreadId });
      }
      if (threadId) {
        socket?.emit('thread:join', { threadId });
      }

      return {
        activeThreadId: threadId,
        unreadThreadIds: state.unreadThreadIds.filter((id) => id !== threadId),
      };
    }),

  ensureSocket: () => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const existingSocket = get().socket;
    if (existingSocket) {
      return existingSocket;
    }

    const socket = io(`${API_BASE_URL}/messaging`, {
      transports: ['websocket'],
    });

    socket.on('message:new', (payload: { threadId: string; message: Message }) => {
      get().appendMessage(payload.threadId, payload.message);
    });

    set({ socket });
    return socket;
  },
}));
