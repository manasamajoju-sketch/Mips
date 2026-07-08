import { InfoIcon, ArrowRightIcon } from '../../common/Icons'
import Pill from '../../common/pills/pill'
import SparklineChart from '../../charts/SparklineChart/SparklineChart'
import { topEventsMock, topEventsSparklineSeries } from '../../../Constants/topEventsMock'
import type { TopEvent } from '../../../types/topEvents'

import './TopEventsCard.module.scss'

interface TopEventsCardProps {
  events?: TopEvent[]
  onEventClick?: (event: TopEvent) => void
}

export default function TopEventsCard({ events = topEventsMock, onEventClick }: TopEventsCardProps) {
  return (
    <section className="top-events-card">
      <header className="top-events-card__header">
        <h2 className="top-events-card__title">
          Top Events
          <button type="button" className="top-events-card__info-btn" aria-label="More information">
            <InfoIcon />
          </button>
        </h2>
      </header>

      <div className="top-events-card__content">
        {events.map((event, index) => (
          <div className="top-events-card__section" key={event.key}>
            <div className="top-events-card__metric">
              <span className="top-events-card__metric-value">
                {event.metricValue}
                <span className="top-events-card__metric-suffix">{event.metricSuffix}</span>
              </span>
              <span className="top-events-card__metric-label">
                {event.metricLabel.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </div>

            <div className="top-events-card__meta">
              <div className="top-events-card__meta-group">
                <span className="top-events-card__meta-value">{event.date}</span>
                <span className="top-events-card__meta-value">{event.time}</span>
              </div>

              <div className="top-events-card__meta-group top-events-card__meta-group--end">
                <span className="top-events-card__meta-label">Severity</span>
                <span
                  className={`top-events-card__severity top-events-card__severity--${event.severity.toLowerCase()}`}
                >
                  {event.severity}
                </span>
              </div>
            </div>

            <SparklineChart data={event.data} series={topEventsSparklineSeries} showKey={index === 1} />

            <div className="top-events-card__bottom-row">
              <div className="top-events-card__tags">
                {event.tags.map((tag) => (
                  <Pill key={tag.text} text={tag.text} color={tag.color} textColor={tag.textColor} />
                ))}
              </div>

              <button
                type="button"
                className="top-events-card__arrow-btn"
                onClick={() => onEventClick?.(event)}
                aria-label={`View ${event.metricLabel.replace('\n', ' ')} event details`}
              >
                <ArrowRightIcon />
              </button>
            </div>

            {index < events.length - 1 && <div className="top-events-card__divider" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  )
}