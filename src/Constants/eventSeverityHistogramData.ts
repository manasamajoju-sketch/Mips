import type {
  EventSeverityHistogramSummary,
  SeverityBucketKey,
  SeverityBucketLabel,
  SeverityHistogramBar,
} from '../types/eventSeverityHistogram';

export const SEVERITY_BUCKET_COLORS: Record<SeverityBucketKey, string> = {
  low: '#17364A',
  medium: '#14A6BE',
  high: '#7DDBEA',
};

export const SEVERITY_BUCKET_LABELS: SeverityBucketLabel[] = [
  { key: 'low', label: 'Low', rangeLabel: '(< 0.3)' },
  { key: 'medium', label: 'Medium', rangeLabel: '(0.3 - 0.5)' },
  { key: 'high', label: 'High', rangeLabel: '(0.5 <)' },
];

export const HISTOGRAM_Y_AXIS_TICKS = ['06', '03', '00'];
export const HISTOGRAM_MAX_VALUE = 6;
export const HISTOGRAM_X_AXIS_TICKS = ['0.0', '0.3', '0.5', '2.0'];

export const eventSeverityHistogramBars: SeverityHistogramBar[] = [
  { id: 'bar-1', value: 5, bucket: 'low' },
  { id: 'bar-2', value: 4, bucket: 'low' },
  { id: 'bar-3', value: 4, bucket: 'low' },
  { id: 'bar-4', value: 1, bucket: 'low' },
  { id: 'bar-5', value: 2, bucket: 'medium' },
  { id: 'bar-6', value: 3, bucket: 'medium' },
  { id: 'bar-7', value: 2, bucket: 'medium' },
  { id: 'bar-8', value: 1, bucket: 'high' },
  { id: 'bar-9', value: 0.6, bucket: 'high' },
  { id: 'bar-10', value: 2, bucket: 'high' },
  { id: 'bar-11', value: 1, bucket: 'high' },
];

export const eventSeverityHistogramSummary: EventSeverityHistogramSummary = {
  count: 22,
  labelLine1: 'High Severity Events',
  labelLine2: '(BrIC 0.5 <)',
};
