import { InfoIcon, ArrowRightIcon } from '../../common/Icons'
import Pill from '../../common/pills/pill'
import SparklineChart from '../../charts/SparklineChart/SparklineChart'
import { topEventsMock, topEventsSparklineSeries } from '../../../Constants/topEventsMock'
import type { TopEvent } from '../../../types/topEvents'

import styles from './TopEventsCard.module.scss'

interface TopEventsCardProps {
  events?: TopEvent[]
  onEventClick?: (event: TopEvent) => void
}

export default function TopEventsCard({ events = topEventsMock, onEventClick }: TopEventsCardProps) {
  return (
    <section className={styles['top-events-card']}>
      <header className={styles['top-events-card__header']}>
        <h2 className={styles['top-events-card__title']}>
          Top Events
          <button type="button" className={styles['top-events-card__info-btn']} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>
        <button type="button" className={styles['top-events-card__arrow-btn']} aria-label="View all events">
          <ArrowRightIcon />
        </button>
      </header>

      <div className={styles['top-events-card__content']}>
        {events.map((event, index) => (
          <div className={styles['top-events-card__section']} key={event.key}>
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

            <SparklineChart data={event.data} series={topEventsSparklineSeries} showKey={index === 1} />

            <div className={styles['top-events-card__bottom-row']}>
              <div className={styles['top-events-card__tags']}>
                {event.tags.map((tag) => (
                  <Pill key={tag.text} text={tag.text} color={tag.color} textColor={tag.textColor} />
                ))}
              </div>
            </div>

            {index < events.length - 1 && <div className={styles['top-events-card__divider']} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  )
}