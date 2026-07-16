import { EVENT_CATEGORY_COLORS } from '../Constants/eventOverviewData'
import type { TopEvent } from '../types/topEvents'
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

function isImpactTopEvent(event: TopEventsApiEvent) {
  return event.eventType === 'major_impact' || event.eventType === 'impact' || event.eventType === 'offline_event'
}

function getMetricValue(event: TopEventsApiEvent) {
  return isImpactTopEvent(event) ? event.grmsMax : event.irmsMax
}

export function selectTopEventForType(events: TopEventsApiEvent[], type: 'impact' | 'gyro'): TopEventsApiEvent | null {
  const filteredEvents = events.filter((event) =>
    type === 'impact'
      ? isImpactTopEvent(event)
      : event.eventType === 'gyro'
  )

  if (filteredEvents.length > 0) {
    return filteredEvents.reduce<TopEventsApiEvent | null>((max, current) => {
      if (!max) return current
      return getMetricValue(current) > getMetricValue(max) ? current : max
    }, null)
  }

  return events[0] ?? null
}

export function mapTopEventsApiEventToTopEvent(event: TopEventsApiEvent): TopEvent {
  const isImpact = isImpactTopEvent(event)

  return {
    key: event.eventId,
    metricValue: getMetricValue(event),
    metricSuffix: isImpact ? 'gF' : 'rad/s',
    metricLabel: isImpact ? 'Maximum\nG-Force' : 'Max Rotational\nVelocity',
    date: formatDate(event.createdAt),
    time: formatTime(event.createdAt),
    severity: 'Low',
    tags: [
      {
        text: isImpact ? 'Impact' : 'Gyro',
        color: isImpact ? EVENT_CATEGORY_COLORS.active : EVENT_CATEGORY_COLORS.passive,
      },
      {
        text: event.vertical,
        color: EVENT_CATEGORY_COLORS.sos,
      },
    ],
    type: isImpact ? 'impact' : 'gyro',
    data: [],
  }
}
