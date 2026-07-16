export interface GForceTrendPoint {
  label: string;
  value: number | null;
  isActive?: boolean;
  activeLabel?: string;
}

export type ImpactZoneKey = 'front' | 'right' | 'back' | 'left';

export interface ImpactZoneSegment {
  key: ImpactZoneKey;
  label: string;
  // proportion used to size the donut slice
  value: number;
  // text shown on the slice (can differ from the raw proportion, matching the design)
  displayLabel: string;
  highlight?: boolean;
}

export interface ImpactZoneStat {
  key: string;
  label: string;
  count: string;
}

export interface EventAnalyticsSummary {
  minGForce: string;
  maxGForce: string;
  centerLabel: string;
  centerValue: string;
}
