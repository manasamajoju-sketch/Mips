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
}

export default function TopEventsCard({ title = 'Top Events', events = topEventsMock, onEventClick }: TopEventsCardProps) {
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
        {events.map((event, index) => (
          <div
            className={styles['top-events-card__section']}
            key={event.key}
            onClick={() => onEventClick?.(event)}
          >
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

            <div className={styles['top-events-card__meta']}>
              <div className={styles['top-events-card__meta-group']}>
                <span className={styles['top-events-card__meta-value']}>{event.date}</span>
                <span className={styles['top-events-card__meta-value']}>{event.time}</span>
              </div>

              <div className={`${styles['top-events-card__meta-group']} ${styles['top-events-card__meta-group--end']}`}>
                <span className={styles['top-events-card__meta-label']}>Severity</span>
                <span
                  className={`${styles['top-events-card__severity']} ${styles[`top-events-card__severity--${event.severity.toLowerCase()}`]}`}
                >
                  {event.severity}
                </span>
              </div>
            </div>

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

            {index < events.length - 1 && <div className={styles['top-events-card__divider']} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  )
}