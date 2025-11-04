import { FormEvent, useState } from 'react';
import { useSendMessageMutation } from '../../services/api/conversations';

export interface MessageComposerProps {
  threadId: string;
  disabled?: boolean;
}

export function MessageComposer({ threadId, disabled }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const { mutateAsync: sendMessage, isPending } = useSendMessageMutation(threadId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    await sendMessage({ body: trimmed });
    setMessage('');
  }

  const isDisabled = disabled || isPending;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '0.75rem',
      }}
    >
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Say something to your antipode friend..."
        rows={2}
        style={{
          flex: 1,
          borderRadius: '0.75rem',
          border: '1px solid #cbd5f5',
          padding: '0.75rem',
          resize: 'none',
          fontFamily: 'inherit',
        }}
        disabled={isDisabled}
      />
      <button
        type="submit"
        disabled={isDisabled || !message.trim()}
        style={{
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          padding: '0.75rem 1.25rem',
          fontWeight: 600,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
