export type LocationDataType = 'events' | 'users'
export type LocationOverviewMetric = 'events' | 'users'
export type LocationOverviewRegion = 'continent' | 'country' | 'state' | 'city'

// What the backend should send: raw counts per category, per location.
export interface LocationApiRecord {
  id: string
  country: string
  lat: number
  lng: number
  counts: Record<string, number>
}

export interface LocationOverviewEventsRow {
  region: string
  total: number
  byType: Record<string, number>
}

export interface LocationOverviewUsersRow {
  region: string
  mipsUsers: number
  nonMipsUsers: number
  totalUsers: number
  mipsPercentage: number
}

export interface LocationOverviewApiResponse<T = LocationOverviewEventsRow | LocationOverviewUsersRow> {
  success: boolean
  data: {
    window: string
    metric: LocationOverviewMetric
    region: LocationOverviewRegion
    range: {
      from: string
      to: string
    }
    filters?: {
      continent?: string
      country?: string
      state?: string
    }
    rows: T[]
  }
  meta: {
    cached: boolean
    stale?: boolean
    generatedAt: string
  }
}

export interface MapLocationBreakdownSlice {
  key: string
  label: string
  value: number
  color: string
}

// Render-ready shape, built from LocationApiRecord via toMapLocation().

export interface MapLocation {
  id: string
  country: string
  lat: number
  lng: number
  count: number
  breakdown: MapLocationBreakdownSlice[]
}

export interface LocationBreakdownItem {
  key: string
  title: string
  percentage: number
  segments: Array<{
    key: string
    label: string
    value: number
    color: string
  }>
}

export interface LocationOverviewConfig {
  dataType: LocationDataType
  totalLabel: string
  total: number
  topLabel: string
  locations: MapLocation[]
  breakdown: LocationBreakdownItem[]
}