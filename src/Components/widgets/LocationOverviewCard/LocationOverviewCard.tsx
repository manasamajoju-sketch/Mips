import { useState } from 'react'
import { InfoIcon, ArrowRightIcon } from '../../common/Icons'
import LocationMap from '../../cards/LocationMap/LocationMap'
import HorizontalBarChart from '../../charts/HorizontalBarChart/HorizontalBarChart'
import { locationOverviewByType } from '../../../Constants/locationOverviewMock'
import type { LocationDataType } from '../../../types/location'
import styles from './LocationOverviewCard.module.scss'

interface LocationOverviewCardProps {
  onExpand?: () => void
}

export default function LocationOverviewCard({ onExpand }: LocationOverviewCardProps) {
  const [dataType, setDataType] = useState<LocationDataType>('events')
  const config = locationOverviewByType[dataType]

  return (
    <section className={styles['location-overview-card']}>
      <header className={styles['location-overview-card__header']}>
        <h2 className={styles['location-overview-card__title']}>
          Location Overview
          <button type="button" className={styles['location-overview-card__info-btn']} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>

        <div className={styles['location-overview-card__toggle']} role="group" aria-label="Data type">
          {(['events', 'users'] as LocationDataType[]).map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles['location-overview-card__toggle-btn']} ${
                dataType === type ? styles['location-overview-card__toggle-btn--active'] : ''
              }`}
              onClick={() => setDataType(type)}
            >
              {type === 'events' ? 'Events' : 'Users'}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles['location-overview-card__expand-btn']}
          onClick={onExpand}
          aria-label="View location details"
        >
          <ArrowRightIcon />
        </button>
      </header>

      <div className={styles['location-overview-card__body']}>
        <div className={styles['location-overview-card__map-col']}>
          <LocationMap locations={config.locations} />
        </div>

        <div className={styles['location-overview-card__side']}>
          <div className={styles['location-overview-card__total']}>
            <span className={styles['location-overview-card__total-value']}>{config.total}</span>
            <span className={styles['location-overview-card__total-label']}>
              {config.totalLabel.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </div>

          <p className={styles['location-overview-card__subtitle']}>{config.topLabel}</p>

          <ul className={styles['location-overview-card__breakdown']}>
            {config.breakdown.map((item) => (
              <li key={item.key} className={styles['location-overview-card__breakdown-item']}>
                <div className={styles['location-overview-card__breakdown-row']}>
                  <span className={styles['location-overview-card__breakdown-title']}>{item.title}</span>
                  <span className={styles['location-overview-card__breakdown-pct']}>{item.percentage}%</span>
                </div>
                <HorizontalBarChart segments={item.segments} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
