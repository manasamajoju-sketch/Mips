import type { ImpactBreakdown, SeverityPoint } from '../types/eventAnalytics'

export interface UsersAnalyticsData {
  eventType: string
  medianProductLifetimeEvents: number
  maximumProductLifetimeEvents: number
  medianDeviceAgeAtImpact: string
  maximumDeviceAgeAtImpact: string
  severityThreshold: string
  highlightedPoint: {
    label: string
    events: number
  }
  severityData: SeverityPoint[]
  impactBreakdown: ImpactBreakdown[]
  activeZone: ImpactBreakdown['zone']
  activeZonePercent: number
}

export const usersAnalyticsMock: UsersAnalyticsData = {
  eventType: 'Cycling',
  medianProductLifetimeEvents: 2,
  maximumProductLifetimeEvents: 5,
  medianDeviceAgeAtImpact: '3m',
  maximumDeviceAgeAtImpact: '11m',
  severityThreshold: '50 Events',
  highlightedPoint: { label: '45', events: 45 },
  severityData: [
    { label: '0', events: 0 },
    { label: '2m', events: 20 },
    { label: '4m', events: 14 },
    { label: '6m', events: 32 },
    { label: '8m', events: 45 },
    { label: '10m', events: 20 },
    { label: '12m', events: 30 },
    { label: '14m+', events: 15 },
  ],
  impactBreakdown: [
    { zone: 'front', label: '0 Impact', impacts: 40 },
    { zone: 'right', label: '1-3 Impacts', impacts: 25 },
    { zone: 'left', label: '2-4 Impacts', impacts: 5 },
    { zone: 'top', label: '5+ Impacts', impacts: 20 },
    { zone: 'back', label: 'Other', impacts: 10 },
  ],
  activeZone: 'right',
  activeZonePercent: 10,
}
