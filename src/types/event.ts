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

export interface EventTimeseriesApiPoint {
  bucket: string;
  total: number;
  byType?: Record<string, number>;
}

export interface EventTimeseriesApiResponse {
  success: boolean;
  data: EventTimeseriesApiPoint[];
  meta: {
    cached: boolean;
    stale?: boolean;
    generatedAt: string;
    range?: {
      from: string;
      to: string;
    };
  };
}

export interface SeverityTimeseriesPoint {
  bucket: string;
  high: number;
  medium: number;
  low: number;
}

export interface SeverityTimeseriesApiResponse {
  success: boolean;
  data: SeverityTimeseriesPoint[];
  meta: {
    cached: boolean;
    stale?: boolean;
    generatedAt: string;
    range?: {
      from: string;
      to: string;
    };
  };
}

export interface EventOverviewMetric {
  current?: number | string;
  previous?: number | string;
  pctChange?: number | string;
}

export interface EventOverviewApiResponse {
  success: boolean;
  data: {
    window: string;
    totalEvents: string | number | EventOverviewMetric;
    highSeverityEvents: string | number | EventOverviewMetric;
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

function parseMetricValue(metric: string | number | EventOverviewMetric | undefined) {
  if (typeof metric === 'number' || typeof metric === 'string') {
    return {
      current: Number(metric) || 0,
      pctChange: 0,
    };
  }

  if (metric && typeof metric === 'object') {
    return {
      current: Number(metric.current ?? 0) || 0,
      pctChange: Number(metric.pctChange ?? 0) || 0,
    };
  }

  return {
    current: 0,
    pctChange: 0,
  };
}

export function mapEventOverviewResponse(response: EventOverviewApiResponse): EventOverviewSummary {
  const totalEventsMetric = parseMetricValue(response.data.totalEvents);
  const highSeverityMetric = parseMetricValue(response.data.highSeverityEvents);

  const totalEvents = totalEventsMetric.current;
  const totalEventsDeltaPct = totalEventsMetric.pctChange;
  const highSeverityEvents = highSeverityMetric.current;
  const highSeverityDeltaPct = highSeverityMetric.pctChange;

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

export function mapEventTimeseriesResponse(
  response: EventTimeseriesApiResponse,
  window: '30d' | '90d' | '12m' = '30d',
) {
  return response.data.map((point) => {
    const start = new Date(point.bucket);

    if (window === '90d') {
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const startLabel = `${start.getDate()} ${start.toLocaleString('en-US', { month: 'short' })}`;
      const endLabel = `${end.getDate()} ${end.toLocaleString('en-US', { month: 'short' })}`;
      const byType = point.byType ?? {};

      const sos = Number(byType.sos ?? 0);
      const active = Number(byType.major_impact ?? 0);
      const passive = Number(byType.helmet_drop ?? 0);
      const others = Number(
        (byType.minor_impact ?? 0) +
          (byType.help_request ?? 0) +
          (byType.offline_event ?? 0) +
          (byType.no_return ?? 0),
      );

      return {
        date: startLabel,
        month: endLabel,
        sos,
        active,
        passive,
        others,
        highlight: point.total > 0,
      };
    }

    const day = start.getDate().toString();
    const month = start.toLocaleString('en-US', { month: 'short' });

    const byType = point.byType ?? {};

    const sos = Number(byType.sos ?? 0);
    const active = Number(byType.major_impact ?? 0);
    const passive = Number(byType.helmet_drop ?? 0);
    const others = Number(
      (byType.minor_impact ?? 0) +
        (byType.help_request ?? 0) +
        (byType.offline_event ?? 0) +
        (byType.no_return ?? 0),
    );

    return {
      date: day,
      month,
      sos,
      active,
      passive,
      others,
      highlight: point.total > 0,
    };
  });
}

export function mapSeverityTimeseriesResponse(response: SeverityTimeseriesApiResponse, window: '30d' | '90d' | '12m' = '30d') {
  return response.data.map((point) => {
    const start = new Date(point.bucket)
    // For weekly buckets (90d) we prefer showing start and end of week in the tick
    if (window === '90d') {
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      const startLabel = `${start.getDate()} ${start.toLocaleString('en-US', { month: 'short' })}`
      const endLabel = `${end.getDate()} ${end.toLocaleString('en-US', { month: 'short' })}`
      return {
        date: startLabel,
        month: endLabel,
        high: Number(point.high ?? 0),
        medium: Number(point.medium ?? 0),
        low: Number(point.low ?? 0),
        highlight: false,
      }
    }

    // Daily or monthly buckets — use day and month as chart expects
    const day = start.getDate().toString()
    const month = start.toLocaleString('en-US', { month: 'short' })

    return {
      date: day,
      month,
      high: Number(point.high ?? 0),
      medium: Number(point.medium ?? 0),
      low: Number(point.low ?? 0),
      highlight: false,
    }
  })
}