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

// Each entry represents one day on the timeline.
// month is only set on the first day of a new month, for the axis label.
// A day with all-zero values renders as an empty slot (no bar).
export const eventTimelineData: EventTimelineDay[] = [
  { date: '22', month: 'Apr', sos: 14, active: 8, passive: 9, others: 6 },
  { date: '23', month: '', sos: 16, active: 9, passive: 10, others: 7 },
  { date: '24', month: '', sos: 18, active: 9, passive: 9, others: 6 },
  { date: '25', month: '', sos: 15, active: 8, passive: 8, others: 6 },
  { date: '26', month: '', sos: 17, active: 9, passive: 9, others: 7 },
  { date: '27', month: '', sos: 19, active: 10, passive: 10, others: 7 },
  { date: '28', month: '', sos: 18, active: 9, passive: 10, others: 7 },
  { date: '29', month: '', sos: 17, active: 9, passive: 9, others: 6 },
  { date: '30', month: '', sos: 19, active: 10, passive: 11, others: 7 },
  { date: '01', month: 'Jun', sos: 16, active: 9, passive: 9, others: 6 },
  { date: '02', month: '', sos: 24, active: 10, passive: 15, others: 14, highlight: true },
  { date: '03', month: '', sos: 0, active: 0, passive: 0, others: 0 },
  { date: '04', month: '', sos: 0, active: 0, passive: 0, others: 0 },
  { date: '05', month: '', sos: 0, active: 0, passive: 0, others: 0 },
  { date: '06', month: '', sos: 0, active: 0, passive: 0, others: 0 },
  { date: '07', month: '', sos: 17, active: 9, passive: 9, others: 6 },
  { date: '08', month: '', sos: 8, active: 0, passive: 0, others: 5 },
  { date: '09', month: '', sos: 18, active: 9, passive: 9, others: 6 },
  { date: '10', month: '', sos: 17, active: 9, passive: 8, others: 6 },
  { date: '11', month: '', sos: 19, active: 9, passive: 9, others: 7 },
  { date: '12', month: '', sos: 18, active: 9, passive: 9, others: 6 },
  { date: '13', month: '', sos: 17, active: 9, passive: 9, others: 6 },
  { date: '14', month: '', sos: 18, active: 9, passive: 10, others: 7 },
  { date: '15', month: '', sos: 22, active: 10, passive: 10, others: 7 },
  { date: '16', month: '', sos: 18, active: 9, passive: 9, others: 6 },
  { date: '17', month: '', sos: 0, active: 0, passive: 0, others: 0 },
  { date: '18', month: '', sos: 0, active: 0, passive: 0, others: 0 },
  { date: '19', month: '', sos: 17, active: 9, passive: 9, others: 6 },
  { date: '20', month: '', sos: 16, active: 9, passive: 9, others: 6 },
  { date: '21', month: '', sos: 17, active: 9, passive: 8, others: 6 },
  { date: '22', month: 'Jun', sos: 16, active: 9, passive: 9, others: 6 },
];

// Fallback/mock summary used only when the live overview API is unavailable.
export const eventOverviewFallbackSummary: EventOverviewSummary = {
  totalEvents: 4872,
  totalEventsDeltaPct: -5,
  highSeverityEvents: 87,
  highSeverityDeltaPct: 5,
  highlightNote: 'June 11 had the highest events recorded this month.',
  severityHighlightNote: 'Jun 2 - Jun 8 had the highest high severity events recorded in last 90 days.',
  progress: 0.32,
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
export const severityTimelineData: SeverityTimelineWeek[] = [
  { date: '24 Mar', month: '30 Mar', high: 5, medium: 8, low: 7 },
  { date: '31 Mar', month: '06 Apr', high: 6, medium: 9, low: 8 },
  { date: '07 Apr', month: '13 Apr', high: 4, medium: 7, low: 6 },
  { date: '14 Apr', month: '20 Apr', high: 5, medium: 8, low: 7 },
  { date: '21 Apr', month: '27 Apr', high: 6, medium: 9, low: 8 },
  { date: '28 Apr', month: '04 May', high: 5, medium: 9, low: 9 },
  { date: '05 May', month: '11 May', high: 7, medium: 10, low: 9 },
  { date: '12 May', month: '18 May', high: 6, medium: 9, low: 8 },
  { date: '19 May', month: '25 May', high: 8, medium: 11, low: 10 },
  { date: '26 May', month: '01 Jun', high: 6, medium: 9, low: 8 },
  { date: '02 Jun', month: '08 Jun', high: 10, medium: 15, low: 10, highlight: true },
  { date: '09 Jun', month: '15 Jun', high: 7, medium: 10, low: 9 },
  { date: '16 Jun', month: '22 Jun', high: 6, medium: 9, low: 8 },
];