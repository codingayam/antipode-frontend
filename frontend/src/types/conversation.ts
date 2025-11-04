export type ThreadStatus = 'active' | 'snoozed' | 'closed';

export interface MemberProfile {
  id: string;
  displayName: string;
  intro: string;
  visibilityScope: 'public' | 'connections_only';
  availability: 'available' | 'temporarily_unavailable' | 'invisible';
  homeLocation: {
    latitude: number;
    longitude: number;
    label: string;
  };
  timeZone: string;
  lastActiveAt: string;
}

export interface ConversationSummary {
  id: string;
  participant: MemberProfile;
  lastMessagePreview: string;
  status: ThreadStatus;
  lastMessageAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
  readAt?: string | null;
  deliveryStatus: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participants: MemberProfile[];
  status: ThreadStatus;
  messages: Message[];
  lastMessageAt: string;
}
