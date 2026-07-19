import { EVENT_CATEGORY_COLORS } from '../Constants/eventOverviewData'
import type { TopEvent, TopEventTag } from '../types/topEvents'
import type { TopEventsApiEvent } from '../types/topEventsApi'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).toLowerCase()
}

// event.eventType is NOT a reliable impact/gyro signal — the `type`
// parameter, known from the call site (which typed request produced this
// event), is the correct source of truth.
function getRawMetricValue(event: TopEventsApiEvent, type: 'impact' | 'gyro'): number {
  return (type === 'impact' ? event.grmsMax : event.irmsMax) ?? 0
}

// Rounds the metric to at most 1 decimal place so the big number never
// overflows the card — e.g. 417.0834847185873 -> 417.1, 0 -> 0.
function roundMetricValue(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.round(value * 10) / 10
}

export function selectTopEventForType(
  events: TopEventsApiEvent[],
  type: 'impact' | 'gyro',
): TopEventsApiEvent | null {
  if (events.length === 0) return null

  return events.reduce<TopEventsApiEvent | null>((max, current) => {
    if (!max) return current
    return getRawMetricValue(current, type) > getRawMetricValue(max, type) ? current : max
  }, null)
}

// Fixed per-type tag sets, matching the reference design:
// Impact (left card)  → SOS, Construction
// Gyro   (right card) → Active, Moto
function getTagsForType(type: 'impact' | 'gyro'): TopEventTag[] {
  if (type === 'impact') {
    return [
      { text: 'SOS', color: EVENT_CATEGORY_COLORS.sos },
      { text: 'Construction', color: EVENT_CATEGORY_COLORS.construction },
    ]
  }

  return [
    { text: 'Active', color: EVENT_CATEGORY_COLORS.active },
    { text: 'Moto', color: EVENT_CATEGORY_COLORS.moto },
  ]
}

export function mapTopEventsApiEventToTopEvent(
  event: TopEventsApiEvent,
  type: 'impact' | 'gyro',
): TopEvent {
  const isImpact = type === 'impact'

  return {
    key: event.eventId,
    metricValue: roundMetricValue(getRawMetricValue(event, type)),
    metricSuffix: isImpact ? 'gF' : 'rad/s',
    metricLabel: isImpact ? 'Maximum\nG-Force' : 'Max Rotational\nVelocity',
    date: formatDate(event.createdAt),
    time: formatTime(event.createdAt),
    severity: 'Low',
    tags: getTagsForType(type),
    type,
    hicValue: isImpact ? event.grmsMax : undefined,
    bricValue: isImpact ? event.bric : undefined,
    data: [],
  }
}