export type EventCategoryKey = 'sos' | 'active' | 'passive' | 'others';

export interface EventCategoryLabel {
  key: EventCategoryKey;
  label: string;
}

export interface EventTimelineDay {
  date: string;
  month: string;
  sos: number;
  active: number;
  passive: number;
  others: number;
  highlight?: boolean;
}

export type SeverityCategoryKey = 'high' | 'medium' | 'low';

export interface SeverityCategoryLabel {
  key: SeverityCategoryKey;
  label: string;
}

export interface SeverityTimelineWeek {
  date: string;
  month: string;
  high: number;
  medium: number;
  low: number;
  highlight?: boolean;
}

export type EventOverviewView = 'events' | 'severity';

export interface EventOverviewRange {
  from: string;
  to: string;
}

export interface EventOverviewSeriesPoint {
  bucket: string;
  total: number;
  highSeverity: number;
}

export interface EventOverviewApiResponse {
  success: boolean;
  data: {
    window: string;
    totalEvents: string | number;
    highSeverityEvents: string | number;
    range: EventOverviewRange;
    previousRange: EventOverviewRange;
    series: EventOverviewSeriesPoint[];
  };
  meta: {
    cached: boolean;
    stale?: boolean;
    generatedAt: string;
  };
}

export interface EventOverviewSummary {
  totalEvents: number;
  totalEventsDeltaPct: number;
  highSeverityEvents: number;
  highSeverityDeltaPct: number;
  highlightNote: string;
  severityHighlightNote: string;
  progress: number;
}

export function mapEventOverviewResponse(response: EventOverviewApiResponse): EventOverviewSummary {
  const totalEvents = Number(response.data.totalEvents) || 0;
  const highSeverityEvents = Number(response.data.highSeverityEvents) || 0;

  const previousTotal = 0;
  const previousHighSeverity = 0;
  const totalEventsDeltaPct = previousTotal > 0 ? ((totalEvents - previousTotal) / previousTotal) * 100 : 0;
  const highSeverityDeltaPct = previousHighSeverity > 0 ? ((highSeverityEvents - previousHighSeverity) / previousHighSeverity) * 100 : 0;

  return {
    totalEvents,
    totalEventsDeltaPct,
    highSeverityEvents,
    highSeverityDeltaPct,
    highlightNote: `Tracking ${totalEvents} events across ${response.data.window}`,
    severityHighlightNote: `High severity activity reached ${highSeverityEvents} in ${response.data.window}`,
    progress: Math.min(100, Math.round((highSeverityEvents / Math.max(totalEvents, 1)) * 100)),
  };
}