export type SeverityBucketKey = 'low' | 'medium' | 'high';

export interface SeverityHistogramBar {
  id: string;
  value: number; // bar height (event count)
  bucket: SeverityBucketKey;
  // only set on the bar that should show an x-axis tick beneath it
  xAxisLabel?: string;
}

export interface SeverityBucketLabel {
  key: SeverityBucketKey;
  label: string;
  rangeLabel: string;
}

export interface EventSeverityHistogramSummary {
  count: number;
  labelLine1: string;
  labelLine2: string;
}