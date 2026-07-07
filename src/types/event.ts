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

export interface EventOverviewSummary {
  totalEvents: number;
  totalEventsDeltaPct: number;
  highSeverityEvents: number;
  highSeverityDeltaPct: number;
  highlightNote: string;
  progress: number;
}
