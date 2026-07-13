export type ImpactEventType = 'active' | 'passive' | 'offline';

export interface ImpactEventTypeLabel {
  key: ImpactEventType;
  label: string;
}

export interface LifetimeImpactRow {
  id: string;
  peakGForce: number;
  peakRotVelocity: number;
  eventDate: string;
  eventType: ImpactEventType;
}

export interface HighestLifetimeImpactsSummary {
  quinId: string;
  lifetimeImpacts: string;
  peakGForce: string;
  sinceFirstImpact: string;
  averageDaysNote: string;
}
