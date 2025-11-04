export interface EmptyStateProps {
  message?: string;
}

const DEFAULT_MESSAGE =
  'We could not find anyone on the other side just yet. Try another location or invite a friend to join.';

export function EmptyState({ message = DEFAULT_MESSAGE }: EmptyStateProps) {
  return (
    <div
      style={{
        border: '1px dashed #9ca3af',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        color: '#4b5563',
        background: '#f9fafb',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#111827' }}>No opposite-side matches yet</h3>
      <p style={{ margin: 0, lineHeight: 1.5 }}>{message}</p>
    </div>
  );
}
