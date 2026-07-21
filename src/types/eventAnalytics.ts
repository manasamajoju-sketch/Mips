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

export interface IrmsDistributionBucket {
  bucket: number
  count: number
  pct: number
}

export interface IrmsDistributionApiResponse {
  success: boolean
  data: {
    vertical: string
    totalEvents: number
    buckets: IrmsDistributionBucket[]
  }
  meta: {
    cached: boolean
    stale?: boolean
    generatedAt: string
    range: {
      from: string
      to: string
    }
  }
}

export interface GForceExtremeEvent {
  eventId: string
  irmsMax: number
}

export interface GForceExtremesApiResponse {
  success: boolean
  data: {
    vertical: string
    max: GForceExtremeEvent | null
    min: GForceExtremeEvent | null
  }
  meta: {
    cached: boolean
    stale?: boolean
    generatedAt: string
    range: {
      from: string
      to: string
    }
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

export function mapIrmsDistributionResponse(response: IrmsDistributionApiResponse): SeverityPoint[] {
  const buckets = response?.data?.buckets
  if (!Array.isArray(buckets) || buckets.length === 0) return []

  return [...buckets]
    .filter((bucket) => bucket != null && Number.isFinite(bucket.bucket) && Number.isFinite(bucket.count))
    .sort((a, b) => a.bucket - b.bucket)
    .map((bucket) => ({
      // API `bucket` is the G-force bin upper bound (50, 100, 150, …).
      label: `${bucket.bucket}G`,
      events: bucket.count,
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
