export type LocationDataType = 'events' | 'users'

export interface MapLocation {
  id: string
  country: string
  lat: number
  lng: number
  count: number
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
