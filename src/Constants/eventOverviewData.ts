import type {
  EventCategoryKey,
  EventCategoryLabel,
  EventOverviewSummary,
  EventTimelineDay,
  SeverityCategoryKey,
  SeverityCategoryLabel,
  SeverityTimelineWeek,
} from '../types/event';

export const EVENT_CATEGORY_COLORS: Record<EventCategoryKey, string> = {
  sos: '#F5E642',
  active: '#7DDBEA',
  passive: '#14A6BE',
  others: '#17364A',
};

export const EVENT_CATEGORY_LABELS: EventCategoryLabel[] = [
  { key: 'sos', label: 'SOS' },
  { key: 'active', label: 'Active' },
  { key: 'passive', label: 'Passive' },
  { key: 'others', label: 'Others' },
];

// Live event timeline data is mapped from the API response.
export const eventTimelineData: EventTimelineDay[] = [];

// Empty summary used until live data arrives.
export const eventOverviewFallbackSummary: EventOverviewSummary = {
  totalEvents: 0,
  totalEventsDeltaPct: 0,
  highSeverityEvents: 0,
  highSeverityDeltaPct: 0,
  highlightNote: 'No event data available',
  severityHighlightNote: 'No high severity data available',
  progress: 0,
};

export const eventOverviewSummary = eventOverviewFallbackSummary;

export const SEVERITY_CATEGORY_COLORS: Record<SeverityCategoryKey, string> = {
  high: '#7DDBEA',
  medium: '#14A6BE',
  low: '#17364A',
};

export const SEVERITY_CATEGORY_LABELS: SeverityCategoryLabel[] = [
  { key: 'high', label: 'High Severity (HIC)' },
  { key: 'medium', label: 'Medium Severity (HIC)' },
  { key: 'low', label: 'Low Severity (HIC)' },
];

// Each entry represents one week (last ~90 days) for the "High severity" view.
export const severityTimelineData: SeverityTimelineWeek[] = [];