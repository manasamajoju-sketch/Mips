export interface SeverityPoint {
  /** Label shown on the x-axis, e.g. "0G", "50G" */
  label: string
  /** Number of events recorded at this G-force bucket */
  events: number
}

export type ImpactZone = 'front' | 'right' | 'back' | 'left' | 'top' | 'other'

export interface ImpactBreakdown {
  zone: ImpactZone
  label: string
  impacts: number
}

export type ImpactDirection = 'top' | 'left' | 'right' | 'front' | 'back' | 'other'

export interface ImpactDirectionBucket {
  impactDirection: ImpactDirection
  count: number
}

export interface ImpactDirectionApiResponse {
  success: boolean
  data: {
    window: string
    vertical: string
    range: {
      from: string
      to: string
    }
    totalEvents: number
    buckets: ImpactDirectionBucket[]
  }
  meta: {
    cached: boolean
    stale?: boolean
    generatedAt: string
  }
}

const impactDirectionLabelMap: Record<ImpactDirection, string> = {
  front: 'Front',
  left: 'Left',
  top: 'Top',
  right: 'Right',
  back: 'Back',
  other: 'Other',
}

export function mapImpactDirectionResponse(response: ImpactDirectionApiResponse): ImpactBreakdown[] {
  return response.data.buckets.map((bucket) => ({
    zone: bucket.impactDirection,
    label: impactDirectionLabelMap[bucket.impactDirection] ?? bucket.impactDirection,
    impacts: bucket.count,
  }))
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
