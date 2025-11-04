export interface AntipodeListing {
  memberId: string;
  displayName: string;
  intro: string;
  distanceKm: number;
  availability: 'available' | 'temporarily_unavailable' | 'invisible';
  visibilityScope: 'public' | 'connections_only';
  lastActiveAt: string;
}

export interface AntipodeLocation {
  latitude: number;
  longitude: number;
  label: string;
}

export interface AntipodeSearchResponse {
  antipode: AntipodeLocation;
  listings: AntipodeListing[];
  emptyState?: string;
  snapshotId: string;
}

export type ManualSearchPayload = {
  location: {
    manual: {
      query: string;
    };
  };
  includeUnavailable?: boolean;
  clientMetadata?: Record<string, string>;
};

export type DeviceSearchPayload = {
  location: {
    device: {
      latitude: number;
      longitude: number;
      accuracyMeters: number;
    };
  };
  includeUnavailable?: boolean;
  clientMetadata?: Record<string, string>;
};

export type AntipodeSearchPayload = ManualSearchPayload | DeviceSearchPayload;
