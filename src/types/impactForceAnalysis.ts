export interface ImpactForcePoint {
  time: number; // seconds
  x: number;
  y: number;
  z: number;
}

export interface ImpactForceSummary {
  maxGForce: string;
  maxGForceLabelLine1: string;
  maxGForceLabelLine2: string;
  percentileNote: string;
}

export type ImpactAxisKey = 'x' | 'y' | 'z';

export interface ImpactAxisLabel {
  key: ImpactAxisKey;
  label: string;
  color: string;
}
