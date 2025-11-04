import type { AntipodeListing } from '../../types/antipode';
import { MatchListItem } from './MatchListItem';

export interface MatchListProps {
  listings: AntipodeListing[];
  originSnapshotId?: string;
}

export function MatchList({ listings, originSnapshotId }: MatchListProps) {
  if (!listings.length) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {listings.map((listing) => (
        <MatchListItem
          key={listing.memberId}
          listing={listing}
          originSnapshotId={originSnapshotId}
        />
      ))}
    </div>
  );
}
