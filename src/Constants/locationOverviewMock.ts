import type { LocationApiRecord, LocationOverviewConfig } from '../types/location'
import { toMapLocation } from '../Utils/TopMapLoaction'

// Mock stand-in for what GET /api/locations?type=events (etc.) would return.
const eventLocationRecords: LocationApiRecord[] = [
  { id: 'us', country: 'United States', lat: 39.8283, lng: -98.5795, counts: { sos: 9, active: 14, passive: 12, others: 7 } },
  { id: 'gb', country: 'United Kingdom', lat: 54.0, lng: -2.0, counts: { sos: 5, active: 9, passive: 8, others: 5 } },
  { id: 'au', country: 'Australia', lat: -25.2744, lng: 133.7751, counts: { sos: 3, active: 7, passive: 6, others: 3 } },
  { id: 'de', country: 'Germany', lat: 51.1657, lng: 10.4515, counts: { sos: 2, active: 5, passive: 4, others: 3 } },
  { id: 'jp', country: 'Japan', lat: 36.2048, lng: 138.2529, counts: { sos: 1, active: 4, passive: 4, others: 2 } },
  { id: 'br', country: 'Brazil', lat: -14.235, lng: -51.9253, counts: { sos: 1, active: 3, passive: 3, others: 1 } },
]

const userLocationRecords: LocationApiRecord[] = [
  { id: 'us', country: 'United States', lat: 39.8283, lng: -98.5795, counts: { sos: 11, active: 20, passive: 16, others: 11 } },
  { id: 'ca', country: 'Canada', lat: 56.1304, lng: -106.3468, counts: { sos: 4, active: 8, passive: 6, others: 3 } },
  { id: 'gb', country: 'United Kingdom', lat: 54.0, lng: -2.0, counts: { sos: 3, active: 6, passive: 5, others: 3 } },
  { id: 'fr', country: 'France', lat: 46.2276, lng: 2.2137, counts: { sos: 2, active: 5, passive: 4, others: 2 } },
  { id: 'in', country: 'India', lat: 20.5937, lng: 78.9629, counts: { sos: 1, active: 3, passive: 3, others: 2 } },
]

const eventLocations = eventLocationRecords.map(toMapLocation)
const userLocations = userLocationRecords.map(toMapLocation)

export const locationOverviewByType: Record<'events' | 'users', LocationOverviewConfig> = {
  events: {
    dataType: 'events',
    totalLabel: 'Total\nCountries',
    total: eventLocations.length,
    topLabel: 'Top Locations',
    locations: eventLocations,
    breakdown: eventLocations.slice(0, 3).map((location) => ({
      key: location.id,
      title: location.country,
      percentage: Math.round((location.count / eventLocations[0].count) * 100),
      segments: location.breakdown,
    })),
  },
  users: {
    dataType: 'users',
    totalLabel: 'Total\nCountries',
    total: userLocations.length,
    topLabel: 'Top Locations',
    locations: userLocations,
    breakdown: userLocations.slice(0, 3).map((location) => ({
      key: location.id,
      title: location.country,
      percentage: Math.round((location.count / userLocations[0].count) * 100),
      segments: location.breakdown,
    })),
  },
}