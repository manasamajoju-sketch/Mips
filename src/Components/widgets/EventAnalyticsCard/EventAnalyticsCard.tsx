import { useEffect, useState } from 'react'
import type {
  EventAnalyticsData,
  GForceExtremesApiResponse,
  ImpactBreakdown,
  SeverityPoint,
  IrmsDistributionApiResponse,
} from '../../../types/eventAnalytics'
import { mapIrmsDistributionResponse } from '../../../types/eventAnalytics'
import { InfoIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '../../common/Icons'
import type { TimelineRange } from '../../common/TimelineButton/TimelineButton'
import type { ImpactPointSectionKey } from '../../cards/ImpactPoint/ImpactPoint'
import { dashboardService } from '../../../Services/dashboardService'
import SeverityChart from '../../../Components/charts/SeverityChart/SeverityChart'
import styles from './EventAnalyticsCard.module.scss'
import ImpactPoint from '../../cards/ImpactPoint/ImpactPoint'

interface EventAnalyticsCardProps {
  data: EventAnalyticsData
  eventTypes?: string[]
  window?: TimelineRange
  onEventTypeChange?: (eventType: string) => void
  onExpand?: () => void
}

interface GForceSummary {
  minGForce: number | null
  maxGForce: number | null
}

function formatGForce(value: number | null) {
  if (value === null || !Number.isFinite(value)) return '-'
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export default function EventAnalyticsCard({
  data,
  eventTypes = ['Cycling'],
  window = '30d',
  onEventTypeChange,
  onExpand,
}: EventAnalyticsCardProps) {
  const [selectedEventType, setSelectedEventType] = useState(data.eventType)
  const [severityData, setSeverityData] = useState<SeverityPoint[]>([])
  const [gForceSummary, setGForceSummary] = useState<GForceSummary | null>(null)
  const selectedTypeIndex = Math.max(eventTypes.indexOf(selectedEventType), 0)
  const activeEventType = eventTypes[selectedTypeIndex] ?? selectedEventType
  const displayedGForceSummary = gForceSummary ?? {
    minGForce: data.minGForce,
    maxGForce: data.maxGForce,
  }

  const cycleEventType = (direction: -1 | 1) => {
    if (eventTypes.length === 0) return
    const nextIndex = (selectedTypeIndex + direction + eventTypes.length) % eventTypes.length
    const nextEventType = eventTypes[nextIndex]
    if (!nextEventType) return
    setSelectedEventType(nextEventType)
    onEventTypeChange?.(nextEventType)
  }

  useEffect(() => {
    let isMounted = true

    dashboardService
      .getIrmsDistribution(window, activeEventType)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as IrmsDistributionApiResponse
        const mappedData = mapIrmsDistributionResponse(typedResponse)
        setSeverityData(mappedData)
      })
      .catch(() => {
        if (!isMounted) return
        setSeverityData([])
      })

    return () => {
      isMounted = false
    }
  }, [window, activeEventType])

  useEffect(() => {
    let isMounted = true

    dashboardService
      .getGForceExtremes(window, activeEventType)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as GForceExtremesApiResponse
        setGForceSummary({
          minGForce: typedResponse.data.min?.irmsMax ?? null,
          maxGForce: typedResponse.data.max?.irmsMax ?? null,
        })
      })
      .catch(() => {
        if (!isMounted) return
        setGForceSummary({
          minGForce: data.minGForce,
          maxGForce: data.maxGForce,
        })
      })

    return () => {
      isMounted = false
    }
  }, [activeEventType, data.maxGForce, data.minGForce, window])

  const otherImpacts = data.impactBreakdown.filter((b) => b.zone !== 'front')
  const totalImpacts = data.impactBreakdown.reduce((sum, b) => sum + b.impacts, 0) || 1
  const impactSections = data.impactBreakdown
    .filter((b): b is ImpactBreakdown & { zone: Exclude<ImpactPointSectionKey, 'other'> } =>
      b.zone !== 'other'
    )
    .map((b) => ({
      key: b.zone as ImpactPointSectionKey,
      label: b.label,
      value: (b.impacts / totalImpacts) * 100,
    }))

  const frontImpact = data.impactBreakdown.find((b) => b.zone === 'front') ?? {
    zone: 'front' as const,
    label: 'Front',
    impacts: 0,
  }

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
          <span className={styles['event-analytics-card__type-label']}>{activeEventType}</span>
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
          <span className={styles['event-analytics-card__metric-value']}>{formatGForce(displayedGForceSummary.minGForce)}</span>
          <span className={styles['event-analytics-card__metric-label']}>
            <span>Minimum</span>
            <span>G-Force</span>
          </span>
        </div>

        <div className={styles['event-analytics-card__metric']}>
          <span className={styles['event-analytics-card__metric-value']}>{formatGForce(displayedGForceSummary.maxGForce)}</span>
          <span className={styles['event-analytics-card__metric-label']}>
            <span>Maximum</span>
            <span>G-Force</span>
          </span>
        </div>

        <div className={`${styles['event-analytics-card__metric']} ${styles['event-analytics-card__metric--front']}`}>
          <span className={styles['event-analytics-card__metric-value']}>
            {frontImpact.impacts}
          </span>
          <span className={styles['event-analytics-card__metric-label']}>
            <span>Front</span>
            <span>Impacts</span>
          </span>
        </div>
      </div>

      <hr className={styles['event-analytics-card__divider']} />

      <div className={styles['event-analytics-card__body']}>
        <div className={styles['event-analytics-card__chart-col']}>
          <SeverityChart
            data={severityData}
            thresholdPosition={1.5}
            highlightLabel={data.highlightedPoint.label}
          />
        </div>

        <div className={styles['event-analytics-card__wheel-col']}>
          <ImpactPoint
            sections={impactSections}
            variant="onColor"
            fillColor="rgba(255, 255, 255, 0.5)"
            hoverFillColor="#ffffff"
            showPercentOnHover
          />
        </div>

        <ul className={styles['event-analytics-card__stat-list']}>
          {otherImpacts.map((item) => (
            <li key={item.zone} className={styles['event-analytics-card__stat-item']}>
              <span className={styles['event-analytics-card__stat-value']}>{item.impacts}</span>
              <span className={styles['event-analytics-card__stat-label']}>
                <span>{item.label}</span>
                <span>Impacts</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
