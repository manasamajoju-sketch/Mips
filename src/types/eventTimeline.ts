export type EventTimelineStatus = 'active' | 'marked_safe';

export interface EventTimelineEntry {
  id: string;
  country: string;
  timeAgo: string;
  eventLabel: string;
  status: EventTimelineStatus;
  statusLabel: string;
  urgent?: boolean;
}
