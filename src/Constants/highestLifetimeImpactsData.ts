import type {
  HighestLifetimeImpactsSummary,
  ImpactEventType,
  ImpactEventTypeLabel,
  LifetimeImpactRow,
} from '../types/highestLifetimeImpacts';

export const IMPACT_EVENT_COLORS: Record<ImpactEventType, string> = {
  active: '#7DDBEA',
  passive: '#14A6BE',
  offline: '#17364A',
};

export const IMPACT_EVENT_TEXT_COLORS: Record<ImpactEventType, string> = {
  active: '#0B2530',
  passive: '#FFFFFF',
  offline: '#FFFFFF',
};

export const IMPACT_EVENT_LABELS: ImpactEventTypeLabel[] = [
  { key: 'active', label: 'Active' },
  { key: 'passive', label: 'Passive' },
  { key: 'offline', label: 'Offline' },
];

export const highestLifetimeImpactRows: LifetimeImpactRow[] = [
  { id: 'imp-1', peakGForce: 200, peakRotVelocity: 180, eventDate: '23/12/2025', eventType: 'active' },
  { id: 'imp-2', peakGForce: 150, peakRotVelocity: 180, eventDate: '23/12/2025', eventType: 'passive' },
  { id: 'imp-3', peakGForce: 120, peakRotVelocity: 180, eventDate: '23/12/2025', eventType: 'offline' },
];

export const highestLifetimeImpactsSummary: HighestLifetimeImpactsSummary = {
  quinId: 'QUIN30234512334234235',
  lifetimeImpacts: '04',
  peakGForce: '200G',
  sinceFirstImpact: '35d',
  averageDaysNote: 'Average 82 days between events.',
};
