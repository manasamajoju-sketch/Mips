import type { LocationOverviewConfig } from '../types/location'

const SEGMENT_COLORS = ['#2fb9cc', '#3FA79A', '#8FD1C4']

const eventLocations = [
  { id: 'us', country: 'United States', lat: 39.8283, lng: -98.5795, count: 42 },
  { id: 'gb', country: 'United Kingdom', lat: 54.0, lng: -2.0, count: 27 },
  { id: 'au', country: 'Australia', lat: -25.2744, lng: 133.7751, count: 19 },
  { id: 'de', country: 'Germany', lat: 51.1657, lng: 10.4515, count: 14 },
  { id: 'jp', country: 'Japan', lat: 36.2048, lng: 138.2529, count: 11 },
  { id: 'br', country: 'Brazil', lat: -14.235, lng: -51.9253, count: 8 },
]

const userLocations = [
  { id: 'us', country: 'United States', lat: 39.8283, lng: -98.5795, count: 58 },
  { id: 'ca', country: 'Canada', lat: 56.1304, lng: -106.3468, count: 21 },
  { id: 'gb', country: 'United Kingdom', lat: 54.0, lng: -2.0, count: 17 },
  { id: 'fr', country: 'France', lat: 46.2276, lng: 2.2137, count: 13 },
  { id: 'in', country: 'India', lat: 20.5937, lng: 78.9629, count: 9 },
]

export const locationOverviewByType: Record<'events' | 'users', LocationOverviewConfig> = {
  events: {
    dataType: 'events',
    totalLabel: 'Total\nCountries',
    total: eventLocations.length,
    topLabel: 'Top Locations',
    locations: eventLocations,
    breakdown: eventLocations.slice(0, 3).map((location, index) => ({
      key: location.id,
      title: location.country,
      percentage: Math.round((location.count / eventLocations[0].count) * 100),
      segments: [
        {
          key: `${location.id}-events`,
          label: location.country,
          value: location.count,
          color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
        },
      ],
    })),
  },
  users: {
    dataType: 'users',
    totalLabel: 'Total\nCountries',
    total: userLocations.length,
    topLabel: 'Top Locations',
    locations: userLocations,
    breakdown: userLocations.slice(0, 3).map((location, index) => ({
      key: location.id,
      title: location.country,
      percentage: Math.round((location.count / userLocations[0].count) * 100),
      segments: [
        {
          key: `${location.id}-users`,
          label: location.country,
          value: location.count,
          color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
        },
      ],
    })),
  },
}
