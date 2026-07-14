import { useEffect, useState } from 'react'
import { InfoIcon } from '../../common/Icons'
import LocationMap from '../../cards/LocationMap/LocationMap'
import HorizontalBarChart from '../../charts/HorizontalBarChart/HorizontalBarChart'
import { locationOverviewByType } from '../../../Constants/locationOverviewMock'
import { dashboardService } from '../../../Services/dashboardService'
import type {
  LocationDataType,
  LocationOverviewApiResponse,
  LocationOverviewConfig,
  LocationOverviewRegion,
  MapLocation,
} from '../../../types/location'
import styles from './LocationOverviewCard.module.scss'

interface LocationOverviewCardProps {
  onExpand?: () => void
  hideHeaderControls?: boolean
  hideSummary?: boolean
  compact?: boolean
}

const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'united states': { lat: 39.8283, lng: -98.5795 },
  'united kingdom': { lat: 54.0, lng: -2.0 },
  australia: { lat: -25.2744, lng: 133.7751 },
  germany: { lat: 51.1657, lng: 10.4515 },
  japan: { lat: 36.2048, lng: 138.2529 },
  brazil: { lat: -14.235, lng: -51.9253 },
  canada: { lat: 56.1304, lng: -106.3468 },
  france: { lat: 46.2276, lng: 2.2137 },
  india: { lat: 20.5937, lng: 78.9629 },
  'north america': { lat: 54.0, lng: -100.0 },
  europe: { lat: 54.0, lng: 15.0 },
  asia: { lat: 34.0, lng: 100.0 },
  'south america': { lat: -15.0, lng: -60.0 },
  africa: { lat: 0.0, lng: 20.0 },
  oceania: { lat: -22.0, lng: 135.0 },
  antarctica: { lat: -82.0, lng: 0.0 },
}

function getRegionCoordinates(region: string) {
  return REGION_COORDINATES[region.trim().toLowerCase()]
}

function getCategoryColor(key: string) {
  const categoryColors: Record<string, string> = {
    sos: '#F5E642',
    active: '#7DDBEA',
    passive: '#14A6BE',
    others: '#17364A',
    mipsUsers: '#7DDBEA',
    nonMipsUsers: '#17364A',
  }

  return categoryColors[key] ?? '#0B2530'
}

function getDisplayLabel(key: string) {
  const labels: Record<string, string> = {
    sos: 'SOS',
    active: 'Active',
    passive: 'Passive',
    others: 'Others',
    mipsUsers: 'MIPS Users',
    nonMipsUsers: 'Non-MIPS Users',
  }

  return labels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
}

function countsToMapLocation(
  id: string,
  region: string,
  counts: Record<string, number>,
  fallbackRegions: string[] = []
): MapLocation | null {
  let coordinates = getRegionCoordinates(region)

  for (const fallback of [region, ...fallbackRegions]) {
    if (coordinates) break
    coordinates = getRegionCoordinates(fallback)
  }

  if (!coordinates) return null

  const breakdown = Object.entries(counts)
    .map(([key, value]) => ({
      key,
      label: getDisplayLabel(key),
      value,
      color: getCategoryColor(key),
    }))
    .filter((slice) => slice.value > 0)

  if (breakdown.length === 0) return null

  return {
    id,
    country: region,
    lat: coordinates.lat,
    lng: coordinates.lng,
    count: breakdown.reduce((sum, slice) => sum + slice.value, 0),
    breakdown,
  }
}

function buildOverviewConfigFromApi(
  apiResponse: LocationOverviewApiResponse
): LocationOverviewConfig {
  const metric = apiResponse.data.metric
  const rows = apiResponse.data.rows
  const filters = apiResponse.data.filters ?? {}
  const fallbackRegions = [filters.state, filters.country, filters.continent].filter(Boolean) as string[]

  const locations: MapLocation[] = rows
    .map((row) => {
      if ('byType' in row) {
        return countsToMapLocation(row.region, row.region, row.byType, fallbackRegions)
      }

      return countsToMapLocation(
        row.region,
        row.region,
        {
          mipsUsers: row.mipsUsers,
          nonMipsUsers: row.nonMipsUsers,
        },
        fallbackRegions
      )
    })
    .filter((location): location is MapLocation => location !== null)

  const orderedLocations = [...locations].sort((a, b) => b.count - a.count)
  const topLocationCount = orderedLocations[0]?.count ?? 1

  return {
    dataType: metric,
    totalLabel: 'Total\nCountries',
    total: orderedLocations.length,
    topLabel: 'Top Locations',
    locations: orderedLocations,
    breakdown: orderedLocations.slice(0, 3).map((location) => ({
      key: location.id,
      title: location.country,
      percentage: Math.round((location.count / topLocationCount) * 100),
      segments: location.breakdown,
    })),
  }
}

export default function LocationOverviewCard({ hideHeaderControls = false, hideSummary = false, compact = false }: LocationOverviewCardProps) {
  const [dataType, setDataType] = useState<LocationDataType>('events')
  const [region, setRegion] = useState<LocationOverviewRegion>('continent')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [config, setConfig] = useState<LocationOverviewConfig>(locationOverviewByType[dataType])

  const cleanedFilters = (filtersToClean: Record<string, string>) =>
    Object.entries(filtersToClean).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value
      }
      return acc
    }, {})

  const handleLocationClick = (location: MapLocation) => {
    const regionName = location.country

    if (region === 'continent') {
      setFilters({ continent: regionName })
      setRegion('country')
      return
    }

    if (dataType === 'events' && region === 'country') {
      setFilters((current) => cleanedFilters({
        continent: current.continent ?? '',
        country: regionName,
      }))
      setRegion('state')
      return
    }

    if (dataType === 'events' && region === 'state') {
      setFilters((current) => cleanedFilters({
        continent: current.continent ?? '',
        country: current.country ?? '',
        state: regionName,
      }))
      setRegion('city')
      return
    }
  }

  const handleBackClick = () => {
    if (region === 'country') {
      setFilters({})
      setRegion('continent')
      return
    }

    if (region === 'state') {
      setRegion('country')
      setFilters((current) => cleanedFilters({ continent: current.continent ?? '' }))
      return
    }

    if (region === 'city') {
      setRegion('state')
      setFilters((current) => cleanedFilters({
        continent: current.continent ?? '',
        country: current.country ?? '',
      }))
      return
    }
  }

  useEffect(() => {
    let isMounted = true
    setConfig(locationOverviewByType[dataType])

    dashboardService
      .getLocationOverview(dataType, region, '30d', filters)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as LocationOverviewApiResponse
        const mappedConfig = buildOverviewConfigFromApi(typedResponse)
        setConfig(mappedConfig)
      })
      .catch(() => {
        if (!isMounted) return
        setConfig(locationOverviewByType[dataType])
      })

    return () => {
      isMounted = false
    }
  }, [dataType, region, filters])

  return (
    <section className={`${styles['location-overview-card']} ${compact ? styles['location-overview-card--compact'] : ''}`}>
      <header className={styles['location-overview-card__header']}>
        <h2 className={styles['location-overview-card__title']}>
          Location Overview
          <button type="button" className={styles['location-overview-card__info-btn']} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>

        {!hideHeaderControls && (
          <div className={styles['location-overview-card__toggle']} role="group" aria-label="Data type">
            {(['events', 'users'] as LocationDataType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles['location-overview-card__toggle-btn']} ${
                  dataType === type ? styles['location-overview-card__toggle-btn--active'] : ''
                }`}
                onClick={() => {
                  setDataType(type)
                  setRegion('continent')
                  setFilters({})
                }}
              >
                {type === 'events' ? 'Events' : 'Users'}
              </button>
            ))}
          </div>
        )}

        {region !== 'continent' && !hideHeaderControls && (
          <button
            type="button"
            className={styles['location-overview-card__toggle-btn']}
            onClick={handleBackClick}
          >
            Back
          </button>
        )}
{/* 
        <button
          type="button"
          className={styles['location-overview-card__expand-btn']}
          onClick={onExpand}
          aria-label="View location details"
        >
          <ArrowRightIcon />
        </button> */}
      </header>

      <div className={styles['location-overview-card__body']}>
        <div className={styles['location-overview-card__map-col']}>
          <LocationMap locations={config.locations} onLocationClick={handleLocationClick} />
        </div>

        {!hideSummary && (
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
        )}
      </div>
    </section>
  )
}
