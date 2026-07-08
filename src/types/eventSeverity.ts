export type SeverityKey = 'high' | 'medium' | 'low';

export interface SeverityBarSegment {
  key: SeverityKey;
  value: number; // percentage shown as the label, e.g. 40 for "40%"
}

export interface SeverityMetric {
  id: string;
  label: string;
  segments: SeverityBarSegment[];
}

export interface EventSeveritySummary {
  count: number;
  labelLine1: string;
  labelLine2: string;
}
