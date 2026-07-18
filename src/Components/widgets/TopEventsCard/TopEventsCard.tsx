import { InfoIcon, ArrowRightIcon } from '../../common/Icons'
import Pill from '../../common/pills/pill'
import SparklineChart from '../../charts/SparklineChart/SparklineChart'
import {
  topEventsMock,
  topEventsSparklineSeries,
  topEventsSparklineSeriesGyro,
  topEventsSparklineSeriesImpact,
} from '../../../Constants/topEventsMock'
import type { TopEvent } from '../../../types/topEvents'
import styles from './TopEventsCard.module.scss'

interface TopEventsCardProps {
  title?: string
  events?: TopEvent[]
  onEventClick?: (event: TopEvent) => void
  isLoading?: boolean
}

export default function TopEventsCard({
  title = 'Top Events',
  events = topEventsMock,
  onEventClick,
  isLoading = false,
}: TopEventsCardProps) {
  const skeletonItems = Array.from({ length: 2 }, (_, i) => `loading-${i}`)

  return (
    <section className={styles['top-events-card']}>
      <header className={styles['top-events-card__header']}>
        <h2 className={styles['top-events-card__title']}>
          {title}
          <button type="button" className={styles['top-events-card__info-btn']} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>
      </header>

      <div className={styles['top-events-card__content']}>
        {isLoading
          ? skeletonItems.map((key) => (
              <div className={styles['top-events-card__section']} key={key}>
                <div className={styles['top-events-card__skeleton-row']}>
                  <div className={styles['top-events-card__skeleton-line']} style={{ width: '42%' }} />
                  <div className={styles['top-events-card__skeleton-line']} style={{ width: '22%' }} />
                </div>
                <div className={styles['top-events-card__skeleton-row']}>
                  <div className={styles['top-events-card__skeleton-line']} style={{ width: '38%' }} />
                  <div className={styles['top-events-card__skeleton-line']} style={{ width: '18%' }} />
                </div>
                <div className={styles['top-events-card__skeleton-sparkline']} />
                <div className={styles['top-events-card__skeleton-row']}>
                  <div className={styles['top-events-card__skeleton-pill']} />
                  <div className={styles['top-events-card__skeleton-pill']} />
                </div>
              </div>
            ))
          : events.map((event, index) => (
              <div
                className={styles['top-events-card__section']}
                key={event.key}
                onClick={() => onEventClick?.(event)}
              >
                {/* ── Metric ── */}
                <div className={styles['top-events-card__metric']}>
                  <span className={styles['top-events-card__metric-value']}>
                    {event.metricValue}
                    <span className={styles['top-events-card__metric-suffix']}>{event.metricSuffix}</span>
                  </span>
                  <span className={styles['top-events-card__metric-label']}>
                    {event.metricLabel.split('\n').map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                </div>

                {/* ── Meta ── */}
                <div className={styles['top-events-card__meta']}>
                  <div className={styles['top-events-card__meta-group']}>
                    <span className={styles['top-events-card__meta-value']}>{event.date}</span>
                    <span className={styles['top-events-card__meta-value']}>{event.time}</span>
                  </div>
                  <div className={`${styles['top-events-card__meta-group']} ${styles['top-events-card__meta-group--end']}`}>
                    <span className={styles['top-events-card__meta-label']}>Severity</span>
                    <span className={`${styles['top-events-card__severity']} ${styles[`top-events-card__severity--${event.severity.toLowerCase()}`]}`}>
                      {event.severity}
                    </span>
                  </div>
                </div>

                {/* ── Sparkline — fills remaining height ── */}
                <div className={styles['top-events-card__sparkline-wrap']}>
                  <SparklineChart
                    data={event.data}
                    series={
                      event.type === 'gyro'
                        ? topEventsSparklineSeriesGyro
                        : event.type === 'impact'
                          ? topEventsSparklineSeriesImpact
                          : topEventsSparklineSeries
                    }
                  />
                </div>

                {/* ── Bottom row ── */}
                <div className={styles['top-events-card__bottom-row']}>
                  <div className={styles['top-events-card__tags']}>
                    {event.tags.map((tag) => (
                      <Pill key={tag.text} text={tag.text} color={tag.color} textColor={tag.textColor} />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles['top-events-card__section-arrow-btn']}
                    aria-label={`View ${event.metricLabel.replace(/\n/g, ' ')} details`}
                  >
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}