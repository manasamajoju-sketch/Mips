import type { EventRow, EventTypeKey, EventTypeLabel } from '../types/eventsTable';

// same category palette used across the other event cards
export const EVENT_TYPE_COLORS: Record<EventTypeKey, string> = {
  sos: '#F5E642',
  active: '#7DDBEA',
  passive: '#14A6BE',
  others: '#17364A',
};

export const EVENT_TYPE_TEXT_COLORS: Record<EventTypeKey, string> = {
  sos: '#5C5100',
  active: '#0B2530',
  passive: '#FFFFFF',
  others: '#FFFFFF',
};

export const EVENT_TYPE_LABELS: EventTypeLabel[] = [
  { key: 'sos', label: 'SOS' },
  { key: 'active', label: 'Active' },
  { key: 'passive', label: 'Passive' },
  { key: 'others', label: 'Others' },
];

export const allEventsRows: EventRow[] = [
  { id: 'evt-1', eventId: '123456789101112', quinId: '123456789101112', eventType: 'sos', maxGForce: 120, maxRotVelocity: 180 },
  { id: 'evt-2', eventId: '123456789101112', quinId: '123456789101112', eventType: 'active', maxGForce: 120, maxRotVelocity: 180 },
  { id: 'evt-3', eventId: '123456789101112', quinId: '123456789101112', eventType: 'passive', maxGForce: 120, maxRotVelocity: 180 },
  { id: 'evt-4', eventId: '123456789101112', quinId: '123456789101112', eventType: 'others', maxGForce: 120, maxRotVelocity: 180 },
  { id: 'evt-5', eventId: '987654321098765', quinId: '987654321098765', eventType: 'sos', maxGForce: 150, maxRotVelocity: 200 },
  { id: 'evt-6', eventId: '564738291056473', quinId: '564738291056473', eventType: 'active', maxGForce: 130, maxRotVelocity: 190 },
  { id: 'evt-7', eventId: '102938475610293', quinId: '102938475610293', eventType: 'passive', maxGForce: 140, maxRotVelocity: 185 },
  { id: 'evt-8', eventId: '675849302167584', quinId: '675849302167584', eventType: 'others', maxGForce: 110, maxRotVelocity: 175 },
  { id: 'evt-9', eventId: '918273645091827', quinId: '918273645091827', eventType: 'sos', maxGForce: 160, maxRotVelocity: 210 },
  { id: 'evt-10', eventId: '374829105637482', quinId: '374829105637482', eventType: 'active', maxGForce: 125, maxRotVelocity: 195 },
];
