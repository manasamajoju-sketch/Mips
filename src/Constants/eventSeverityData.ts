import type { EventSeveritySummary, SeverityKey, SeverityMetric } from '../types/eventSeverity';

export const SEVERITY_COLORS: Record<SeverityKey, string> = {
  high: '#7DDBEA',
  medium: '#14A6BE',
  low: '#17364A',
};

// text color used inside each segment; the light "high" segment needs dark text,
// the two darker segments need white text
export const SEVERITY_TEXT_COLORS: Record<SeverityKey, string> = {
  high: '#0B2530',
  medium: '#FFFFFF',
  low: '#FFFFFF',
};

export const SEVERITY_LABELS: { key: SeverityKey; label: string }[] = [
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

export const SEVERITY_AXIS_TICKS = ['0%', '25%', '50%', '75%', '100%'];

export const eventSeverityMetrics: SeverityMetric[] = [
  {
    id: 'hic',
    label: 'Head Injury Criteria (HIC)',
    segments: [
      { key: 'high', value: 40 },
      { key: 'medium', value: 25 },
      { key: 'low', value: 30 },
    ],
  },
  {
    id: 'bric',
    label: 'Brain Injury Criteria (BrIC)',
    segments: [
      { key: 'high', value: 40 },
      { key: 'medium', value: 25 },
      { key: 'low', value: 30 },
    ],
  },
];

export const eventSeveritySummary: EventSeveritySummary = {
  count: 22,
  labelLine1: 'High Severity',
  labelLine2: 'Events',
};
