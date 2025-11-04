import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { useConversationQuery } from '../../services/api/conversations';
import { useConversationStore } from '../../state/conversation-store';
import type { Message } from '../../types/conversation';
import { MessageComposer } from './MessageComposer';

export interface ConversationThreadProps {
  threadId?: string;
}

function MessageBubble({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '0.75rem 1rem',
        borderRadius: '1rem',
        backgroundColor: isOwnMessage ? '#2563eb' : '#e2e8f0',
        color: isOwnMessage ? '#fff' : '#0f172a',
        maxWidth: '70%',
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
      }}
    >
      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.body}</p>
      <span style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', opacity: 0.7 }}>
        {formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })}
      </span>
    </div>
  );
}

export function ConversationThread({ threadId }: ConversationThreadProps) {
  const messages = useConversationStore((state) =>
    threadId ? state.messagesByThread[threadId] ?? [] : [],
  );
  const participants = useConversationStore((state) =>
    threadId ? state.participantsByThread[threadId] ?? [] : [],
  );
  const activeThreadId = useConversationStore((state) => state.activeThreadId);

  useConversationQuery(threadId);

  const [primaryParticipant, secondaryParticipant] = participants;
  const selfId = primaryParticipant?.id;

  const counterpart = useMemo(() => {
    if (!participants.length) {
      return undefined;
    }
    return secondaryParticipant ?? primaryParticipant;
  }, [participants, primaryParticipant, secondaryParticipant]);

  if (!threadId) {
    return (
      <div
        style={{
          padding: '2rem',
          color: '#475569',
          textAlign: 'center',
        }}
      >
        Select a member from your matches to start chatting.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <header
        style={{
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '1rem',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ margin: 0 }}>
          {counterpart?.displayName ?? participants[0]?.displayName ?? 'Conversation'}
        </h3>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
          {counterpart?.intro ?? 'Opposite-side explorer'}
        </p>
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          overflowY: 'auto',
          paddingRight: '0.5rem',
        }}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === selfId}
          />
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <MessageComposer threadId={threadId} disabled={activeThreadId !== threadId} />
      </div>
    </div>
  );
}
