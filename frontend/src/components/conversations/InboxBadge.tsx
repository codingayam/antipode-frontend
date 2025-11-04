import { useConversationStore } from '../../state/conversation-store';

export function InboxBadge() {
  const unreadCount = useConversationStore((state) => state.unreadThreadIds.length);
  const summaries = useConversationStore((state) => state.summaries);

  const label = unreadCount > 0 ? `${unreadCount} unread` : `${summaries.length} conversations`;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#0ea5e9',
        color: '#fff',
        borderRadius: '999px',
        padding: '0.35rem 0.75rem',
        fontWeight: 600,
        fontSize: '0.85rem',
      }}
    >
      <span role="img" aria-label="inbox">
        💬
      </span>
      {label}
    </div>
  );
}
