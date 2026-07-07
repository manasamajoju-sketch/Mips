import type { EventAnalyticsData } from '../types/eventAnalytics'

export const eventAnalyticsMock: EventAnalyticsData = {
  eventType: 'Cycling',
  minGForce: 15,
  maxGForce: 243,
  frontImpacts: 55,
  severityThreshold: '100G',
  highlightedPoint: { label: '200G', events: 45 },
  severityData: [
    { label: '0G', events: 0 },
    { label: '50G', events: 20 },
    { label: '100G', events: 14 },
    { label: '150G', events: 32 },
    { label: '200G', events: 45 },
    { label: '250G', events: 20 },
    { label: '300G', events: 30 },
    { label: '350G+', events: 8 },
  ],
  impactBreakdown: [
    { zone: 'front', label: 'Front', impacts: 55 },
    { zone: 'right', label: 'Right', impacts: 23 },
    { zone: 'left', label: 'Left', impacts: 23 },
    { zone: 'top', label: 'Top', impacts: 15 },
    { zone: 'back', label: 'Back', impacts: 15 },
  ],
  activeZone: 'right',
  activeZonePercent: 10,
}
