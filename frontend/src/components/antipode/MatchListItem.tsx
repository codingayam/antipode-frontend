import { FormEvent, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { AntipodeListing } from '../../types/antipode';
import { useStartConversationMutation } from '../../services/api/conversations';

export interface MatchListItemProps {
  listing: AntipodeListing;
  originSnapshotId?: string;
}

export function MatchListItem({ listing, originSnapshotId }: MatchListItemProps) {
  const [isComposing, setIsComposing] = useState(false);
  const [message, setMessage] = useState(
    `Hi ${listing.displayName}! Greetings from my side of the globe.`,
  );

  const { mutateAsync: startConversation, isPending } = useStartConversationMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!originSnapshotId) {
      // eslint-disable-next-line no-alert
      alert('Please run a location search before starting a conversation.');
      return;
    }

    await startConversation({
      recipientId: listing.memberId,
      message: message.trim(),
      originSnapshotId,
    });
    setIsComposing(false);
  }

  return (
    <article
      style={{
        border: '1px solid #d1d5db',
        borderRadius: '1rem',
        padding: '1rem',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>{listing.displayName}</h3>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
            {listing.availability === 'available' ? 'Available now' : 'Currently away'}
          </p>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          {listing.distanceKm.toFixed(1)} km from antipode
        </span>
      </header>

      <p style={{ margin: 0, color: '#374151' }}>{listing.intro}</p>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Active {formatDistanceToNow(new Date(listing.lastActiveAt), { addSuffix: true })}
        </span>
        <button
          type="button"
          onClick={() => setIsComposing((open) => !open)}
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          {isComposing ? 'Cancel' : 'Say hi'}
        </button>
      </footer>

      {isComposing ? (
        <form
          onSubmit={handleSubmit}
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            style={{
              border: '1px solid #cbd5f5',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              fontFamily: 'inherit',
            }}
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !originSnapshotId || !message.trim()}
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            {isPending ? 'Starting…' : 'Start conversation'}
          </button>
        </form>
      ) : null}
    </article>
  );
}
