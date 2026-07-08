import type { EventTimelineEntry } from '../types/eventTimeline';

export const eventTimelineEntries: EventTimelineEntry[] = [
  {
    id: 'evt-1',
    country: 'Netherlands',
    timeAgo: '37 mins ago',
    eventLabel: 'Crash Event',
    status: 'active',
    statusLabel: 'Active',
    urgent: true,
  },
  {
    id: 'evt-2',
    country: 'United Kingdom',
    timeAgo: '1 hour ago',
    eventLabel: 'Passive Event',
    status: 'marked_safe',
    statusLabel: 'Marked Safe',
  },
  {
    id: 'evt-3',
    country: 'United States',
    timeAgo: '7 hours ago',
    eventLabel: 'SOS Event',
    status: 'marked_safe',
    statusLabel: 'Marked Safe',
  },
  {
    id: 'evt-4',
    country: 'Italy',
    timeAgo: '1 day ago',
    eventLabel: 'Active Event',
    status: 'marked_safe',
    statusLabel: 'Marked Safe',
  },
  {
    id: 'evt-5',
    country: 'Germany',
    timeAgo: '7 days ago',
    eventLabel: 'Crash Alert',
    status: 'marked_safe',
    statusLabel: 'Marked Safe',
  },
];
