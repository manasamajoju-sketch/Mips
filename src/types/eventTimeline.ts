export type EventTimelineStatus = 'active' | 'marked_safe';

export interface EventTimelineLocation {
  lat: number;
  lng: number;
}

export interface EventTimelineApiEvent {
  type: string;
  impactLocation: EventTimelineLocation;
  isActive: boolean;
  date: string;
}

export interface EventTimelineApiResponse {
  success: boolean;
  data: EventTimelineApiEvent[];
  meta: {
    cached: boolean;
    generatedAt: string;
  };
}

export interface EventTimelineEntry {
  id: string;
  country: string;
  timeAgo: string;
  eventLabel: string;
  status: EventTimelineStatus;
  statusLabel: string;
  urgent?: boolean;
  coordinates?: EventTimelineLocation;
}

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();

  if (diffMs <= 0) return 'Just now';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function mapLatestEventsToTimelineEntries(events: EventTimelineApiEvent[]): EventTimelineEntry[] {
  return events.map((event, index) => {
    const date = new Date(event.date);
    const coordinates = event.impactLocation;
    const country = `${coordinates.lat.toFixed(2)}, ${coordinates.lng.toFixed(2)}`;
    const eventLabel = event.type === 'major_impact' ? 'Major impact detected' : event.type.replace(/_/g, ' ');
    const status: EventTimelineStatus = event.isActive ? 'active' : 'marked_safe';
    const statusLabel = event.isActive ? 'Active' : 'Marked safe';

    return {
      id: `${event.type}-${index}-${event.date}`,
      country,
      timeAgo: formatTimeAgo(date),
      eventLabel,
      status,
      statusLabel,
      urgent: event.isActive,
      coordinates,
    };
  });
}
