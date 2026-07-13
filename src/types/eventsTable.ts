export type EventTypeKey = 'sos' | 'active' | 'passive' | 'others';

export interface EventTypeLabel {
  key: EventTypeKey;
  label: string;
}

export interface EventRow {
  id: string;
  eventId: string;
  quinId: string;
  eventType: EventTypeKey;
  maxGForce: number;
  maxRotVelocity: number;
}
