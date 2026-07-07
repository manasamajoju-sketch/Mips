export interface SeverityPoint {
  /** Label shown on the x-axis, e.g. "0G", "50G" */
  label: string
  /** Number of events recorded at this G-force bucket */
  events: number
}

export type ImpactZone = 'front' | 'right' | 'back' | 'left' | 'top'

export interface ImpactBreakdown {
  zone: ImpactZone
  label: string
  impacts: number
}

export interface EventAnalyticsData {
  eventType: string
  minGForce: number
  maxGForce: number
  frontImpacts: number
  severityThreshold: string
  highlightedPoint: {
    label: string
    events: number
  }
  severityData: SeverityPoint[]
  impactBreakdown: ImpactBreakdown[]
  activeZone: ImpactZone
  activeZonePercent: number
}
