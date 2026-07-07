import { useState } from 'react'
import type { EventAnalyticsData } from '../../../types/eventAnalytics'
import { InfoIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '../../common/Icons'
import SeverityChart from '../../../Components/charts/SeverityChart/SeverityChart'

import './EventAnalyticsCard.scss'
import ImpactPoint from '../../cards/ImpactPoint/ImpactPoint'

interface EventAnalyticsCardProps {
  data: EventAnalyticsData
  eventTypes?: string[]
  onEventTypeChange?: (eventType: string) => void
  onExpand?: () => void
}

export default function EventAnalyticsCard({
  data,
  eventTypes = ['Cycling'],
  onEventTypeChange,
  onExpand,
}: EventAnalyticsCardProps) {
  const [typeIndex, setTypeIndex] = useState(() => Math.max(eventTypes.indexOf(data.eventType), 0))

  const cycleEventType = (direction: -1 | 1) => {
    const nextIndex = (typeIndex + direction + eventTypes.length) % eventTypes.length
    setTypeIndex(nextIndex)
    onEventTypeChange?.(eventTypes[nextIndex])
  }

  const otherImpacts = data.impactBreakdown.filter((b) => b.zone !== 'front')

  return (
    <section className="event-analytics-card">
      <header className="event-analytics-card__header">
        <h2 className="event-analytics-card__title">
          Event Analytics
          <button type="button" className="event-analytics-card__info-btn" aria-label="More information">
            <InfoIcon />
          </button>
        </h2>

        <div className="event-analytics-card__type-switcher">
          <button
            type="button"
            className="event-analytics-card__chevron-btn"
            onClick={() => cycleEventType(-1)}
            aria-label="Previous event type"
          >
            <ChevronLeftIcon />
          </button>
          <span className="event-analytics-card__type-label">{eventTypes[typeIndex]}</span>
          <button
            type="button"
            className="event-analytics-card__chevron-btn"
            onClick={() => cycleEventType(1)}
            aria-label="Next event type"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <button
          type="button"
          className="event-analytics-card__expand-btn"
          onClick={onExpand}
          aria-label="View details"
        >
          <ArrowRightIcon />
        </button>
      </header>

      <div className="event-analytics-card__summary">
        <div className="event-analytics-card__metric">
          <span className="event-analytics-card__metric-value">{data.minGForce}G</span>
          <span className="event-analytics-card__metric-label">
            Minimum
            <br />
            G-Force
          </span>
        </div>

        <div className="event-analytics-card__metric">
          <span className="event-analytics-card__metric-value">{data.maxGForce}G</span>
          <span className="event-analytics-card__metric-label">
            Maximum
            <br />
            G-Force
          </span>
        </div>

        <div className="event-analytics-card__metric event-analytics-card__metric--front">
          <span className="event-analytics-card__metric-value event-analytics-card__metric-value--sm">
            {data.frontImpacts}
          </span>
          <span className="event-analytics-card__metric-label">
            Front
            <br />
            Impacts
          </span>
        </div>
      </div>

      <hr className="event-analytics-card__divider" />

      <div className="event-analytics-card__body">
        <div className="event-analytics-card__chart-col">
          <SeverityChart
            data={data.severityData}
            thresholdPosition={1.5}
            highlightLabel={data.highlightedPoint.label}
          />
        </div>

        <div className="event-analytics-card__wheel-col">
        <ImpactPoint sections={[]} />
        </div>

        <ul className="event-analytics-card__stat-list">
          {otherImpacts.map((item) => (
            <li key={item.zone} className="event-analytics-card__stat-item">
              <span className="event-analytics-card__stat-value">{item.impacts}</span>
              <span className="event-analytics-card__stat-label">
                {item.label}
                <br />
                Impacts
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
