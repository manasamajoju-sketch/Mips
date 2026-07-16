import type { ImpactAxisLabel, ImpactForcePoint, ImpactForceSummary } from '../types/impactForceAnalysis';

export const IMPACT_AXIS_COLORS: Record<'x' | 'y' | 'z', string> = {
  x: '#7DDBEA',
  y: '#14A6BE',
  z: '#17364A',
};

export const IMPACT_AXIS_LABELS: ImpactAxisLabel[] = [
  { key: 'x', label: 'X Axis', color: IMPACT_AXIS_COLORS.x },
  { key: 'y', label: 'Y Axis', color: IMPACT_AXIS_COLORS.y },
  { key: 'z', label: 'Z Axis', color: IMPACT_AXIS_COLORS.z },
];

export const IMPACT_FORCE_Y_TICKS = [-100, 0, 100, 200, 300];

export const impactForcePoints: ImpactForcePoint[] = [
  { time: 0, x: -90, y: -95, z: -100 },
  { time: 10, x: -60, y: -65, z: -70 },
  { time: 20, x: -65, y: -68, z: -75 },
  { time: 30, x: -70, y: -75, z: -80 },
  { time: 40, x: 80, y: 60, z: 160 },
  { time: 50, x: 110, y: 20, z: 60 },
  { time: 55, x: 170, y: 124, z: 124 },
  { time: 60, x: -20, y: -40, z: -90 },
  { time: 70, x: -70, y: 50, z: -30 },
  { time: 80, x: 80, y: 124, z: -20 },
  { time: 90, x: 170, y: -90, z: 50 },
  { time: 100, x: -80, y: 60, z: -40 },
  { time: 110, x: -70, y: 124, z: 80 },
  { time: 120, x: 60, y: 60, z: 40 },
  { time: 130, x: 90, y: 20, z: 10 },
  { time: 140, x: -60, y: -30, z: -20 },
  { time: 150, x: -90, y: -50, z: -10 },
  { time: 160, x: -100, y: -70, z: -20 },
];

export const impactForceSummary: ImpactForceSummary = {
  maxGForce: '170 gF',
  maxGForceLabelLine1: 'Maximum',
  maxGForceLabelLine2: 'G-Force',
  percentileNote: 'This impact was harder than 94% of recorded events in this vertical',
};
