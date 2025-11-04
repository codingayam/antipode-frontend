import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  Conversation,
  ConversationSummary,
  Message,
  ThreadStatus,
} from '../../types/conversation';
import { useConversationStore } from '../../state/conversation-store';

export interface ConversationListResponse {
  items: ConversationSummary[];
}

export interface StartConversationPayload {
  recipientId: string;
  message: string;
  originSnapshotId: string;
}

export interface UpdateConversationStatusPayload {
  status: ThreadStatus;
}

export interface SendMessagePayload {
  body: string;
}

export async function fetchConversationSummaries(
  status?: ThreadStatus,
): Promise<ConversationListResponse> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiClient.get(`/conversations${query}`);
}

export async function fetchConversation(threadId: string): Promise<Conversation> {
  return apiClient.get(`/conversations/${threadId}`);
}

export async function startConversation(
  payload: StartConversationPayload,
): Promise<Conversation> {
  return apiClient.post('/conversations', payload);
}

export async function updateConversationStatus(
  threadId: string,
  payload: UpdateConversationStatusPayload,
): Promise<Conversation> {
  return apiClient.patch(`/conversations/${threadId}`, payload);
}

export async function sendMessage(
  threadId: string,
  payload: SendMessagePayload,
): Promise<Message> {
  return apiClient.post(`/conversations/${threadId}/messages`, payload);
}

const CONVERSATIONS_QUERY_KEY = ['conversations'];

export function useConversationSummariesQuery(status?: ThreadStatus) {
  const setSummaries = useConversationStore((state) => state.setSummaries);
  const ensureSocket = useConversationStore((state) => state.ensureSocket);

  const queryResult = useQuery({
    queryKey: [...CONVERSATIONS_QUERY_KEY, status ?? 'all'],
    queryFn: () => fetchConversationSummaries(status),
    staleTime: 1000 * 15,
  });

  useEffect(() => {
    if (!queryResult.data) {
      return;
    }

    setSummaries(queryResult.data.items);
    ensureSocket();
  }, [queryResult.data, setSummaries, ensureSocket]);

  return queryResult;
}

export function useConversationQuery(threadId?: string) {
  const upsertConversation = useConversationStore((state) => state.upsertConversation);
  const ensureSocket = useConversationStore((state) => state.ensureSocket);

  const queryResult = useQuery({
    queryKey: ['conversation', threadId],
    queryFn: () => fetchConversation(threadId as string),
    enabled: Boolean(threadId),
  });

  useEffect(() => {
    if (!queryResult.data) {
      return;
    }
    upsertConversation(queryResult.data);
    ensureSocket();
  }, [queryResult.data, upsertConversation, ensureSocket]);

  return queryResult;
}

export function useStartConversationMutation() {
  const queryClient = useQueryClient();
  const upsertConversation = useConversationStore((state) => state.upsertConversation);
  const setActiveThread = useConversationStore((state) => state.setActiveThread);
  const ensureSocket = useConversationStore((state) => state.ensureSocket);

  return useMutation({
    mutationFn: (payload: StartConversationPayload) => startConversation(payload),
    onSuccess: (conversation) => {
      upsertConversation(conversation);
      ensureSocket();
      setActiveThread(conversation.id);
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });
}

export function useSendMessageMutation(threadId: string) {
  const appendMessage = useConversationStore((state) => state.appendMessage);

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(threadId, payload),
    onSuccess: (message) => {
      appendMessage(threadId, message);
    },
  });
}

export function useUpdateConversationStatusMutation(threadId: string) {
  const queryClient = useQueryClient();
  const updateThreadStatus = useConversationStore((state) => state.updateThreadStatus);

  return useMutation({
    mutationFn: (payload: UpdateConversationStatusPayload) =>
      updateConversationStatus(threadId, payload),
    onSuccess: (conversation) => {
      updateThreadStatus(threadId, conversation.status);
      queryClient.invalidateQueries({ queryKey: ['conversation', threadId] });
    },
  });
}
