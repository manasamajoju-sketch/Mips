import type { EventCategoryKey } from './event'

export type LocationDataType = 'events' | 'users'

// What the backend should send: raw counts per category, per location.
export interface LocationApiRecord {
  id: string
  country: string
  lat: number
  lng: number
  counts: Record<EventCategoryKey, number>
}

// Render-ready shape, built from LocationApiRecord via toMapLocation().
export interface MapLocationBreakdownSlice {
  key: EventCategoryKey
  label: string
  value: number
  color: string
}

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