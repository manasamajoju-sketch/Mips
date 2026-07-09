import { EVENT_CATEGORY_COLORS, EVENT_CATEGORY_LABELS } from '../Constants/eventOverviewData'
import type { EventCategoryKey } from '../types/event'
import type { LocationApiRecord, MapLocation, MapLocationBreakdownSlice } from '../types/location'

function labelFor(key: EventCategoryKey): string {
  return EVENT_CATEGORY_LABELS.find((category) => category.key === key)?.label ?? key
}

/**
 * Converts a raw API location record (id/country/lat/lng + counts per
 * category) into the render-ready MapLocation shape LocationMap expects.
 * Zero-count categories are dropped so the donut ring doesn't draw an
 * empty slice.
 */
export function toMapLocation(record: LocationApiRecord): MapLocation {
  const breakdown: MapLocationBreakdownSlice[] = (Object.keys(record.counts) as EventCategoryKey[])
    .map((key) => ({
      key,
      label: labelFor(key),
      value: record.counts[key],
      color: EVENT_CATEGORY_COLORS[key],
    }))
    .filter((slice) => slice.value > 0)

  return {
    id: record.id,
    country: record.country,
    lat: record.lat,
    lng: record.lng,
    count: breakdown.reduce((sum, slice) => sum + slice.value, 0),
    breakdown,
  }
}