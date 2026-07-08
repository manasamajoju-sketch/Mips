import { useState } from 'react'
import type { EventAnalyticsData } from '../../../types/eventAnalytics'
import { InfoIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '../../common/Icons'
import SeverityChart from '../../../Components/charts/SeverityChart/SeverityChart'
import styles from './EventAnalyticsCard.module.scss'
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
  const totalImpacts = data.impactBreakdown.reduce((sum, b) => sum + b.impacts, 0) || 1
  const impactSections = data.impactBreakdown.map((b) => ({
    key: b.zone,
    label: b.label,
    value: (b.impacts / totalImpacts) * 100,
  }))

  return (
    <section className={styles['event-analytics-card']}>
      <header className={styles['event-analytics-card__header']}>
        <h2 className={styles['event-analytics-card__title']}>
          Event Analytics
          <button type="button" className={styles['event-analytics-card__info-btn']} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>

        <div className={styles['event-analytics-card__type-switcher']}>
          <button
            type="button"
            className={styles['event-analytics-card__chevron-btn']}
            onClick={() => cycleEventType(-1)}
            aria-label="Previous event type"
          >
            <ChevronLeftIcon />
          </button>
          <span className={styles['event-analytics-card__type-label']}>{eventTypes[typeIndex]}</span>
          <button
            type="button"
            className={styles['event-analytics-card__chevron-btn']}
            onClick={() => cycleEventType(1)}
            aria-label="Next event type"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <button
          type="button"
          className={styles['event-analytics-card__expand-btn']}
          onClick={onExpand}
          aria-label="View details"
        >
          <ArrowRightIcon />
        </button>
      </header>

      <div className={styles['event-analytics-card__summary']}>
        <div className={styles['event-analytics-card__metric']}>
          <span className={styles['event-analytics-card__metric-value']}>{data.minGForce}G</span>
          <span className={styles['event-analytics-card__metric-label']}>
            Minimum
            <br />
            G-Force
          </span>
        </div>

        <div className={styles['event-analytics-card__metric']}>
          <span className={styles['event-analytics-card__metric-value']}>{data.maxGForce}G</span>
          <span className={styles['event-analytics-card__metric-label']}>
            Maximum
            <br />
            G-Force
          </span>
        </div>

        <div className={`${styles['event-analytics-card__metric']} ${styles['event-analytics-card__metric--front']}`}>
          <span className={styles['event-analytics-card__metric-value--sm']}>
            {data.frontImpacts}
          </span>
          <span className={styles['event-analytics-card__metric-label']}>
            Front
            <br />
            Impacts
          </span>
        </div>
      </div>

      <hr className={styles['event-analytics-card__divider']} />

      <div className={styles['event-analytics-card__body']}>
        <div className={styles['event-analytics-card__chart-col']}>
          <SeverityChart
            data={data.severityData}
            thresholdPosition={1.5}
            highlightLabel={data.highlightedPoint.label}
          />
        </div>

        <div className={styles['event-analytics-card__wheel-col']}>
          <ImpactPoint sections={impactSections} alwaysShowPercent />
        </div>

        <ul className={styles['event-analytics-card__stat-list']}>
          {otherImpacts.map((item) => (
            <li key={item.zone} className={styles['event-analytics-card__stat-item']}>
              <span className={styles['event-analytics-card__stat-value']}>{item.impacts}</span>
              <span className={styles['event-analytics-card__stat-label']}>
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