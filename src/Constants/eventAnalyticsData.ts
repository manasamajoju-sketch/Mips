import type {
  EventAnalyticsSummary,
  GForceTrendPoint,
  ImpactZoneSegment,
  ImpactZoneStat,
} from '../types/individualUserEventAnalytics';

export const gForceTrendPoints: GForceTrendPoint[] = [
  { label: '02 Jan', value: 14 },
  { label: '', value: null },
  { label: '12 Jan', value: 110, isActive: true, activeLabel: '110G' },
  { label: '', value: null },
  { label: '02 Mar', value: 124 },
];

export const G_FORCE_Y_AXIS_TICKS = [0, 100, 200, 300];

// slice sizes drive the donut proportions; displayLabel is the text shown on
// the slice, matching the design (which doesn't map 1:1 to the raw proportion)
export const impactZoneSegments: ImpactZoneSegment[] = [
  { key: 'front', label: 'Front', value: 15, displayLabel: 'Front' },
  { key: 'right', label: 'Right', value: 45, displayLabel: '60%', highlight: true },
  { key: 'back', label: 'Back', value: 10, displayLabel: 'Back' },
  { key: 'left', label: 'Left', value: 30, displayLabel: 'Left' },
];

export const impactZoneStats: ImpactZoneStat[] = [
  { key: 'right', label: 'Right\nImpacts', count: '04' },
  { key: 'top', label: 'Top\nImpacts', count: '03' },
  { key: 'left', label: 'Left\nImpacts', count: '02' },
  { key: 'front', label: 'Front\nImpacts', count: '01' },
  { key: 'back', label: 'Back\nImpacts', count: '01' },
];

export const eventAnalyticsSummary: EventAnalyticsSummary = {
  minGForce: '14G',
  maxGForce: '124G',
  centerLabel: 'Top',
  centerValue: '',
};
