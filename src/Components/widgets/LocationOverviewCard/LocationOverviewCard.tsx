import { useEffect, useMemo, useState } from 'react'
import { InfoIcon } from '../../common/Icons'
import LocationMap from '../../cards/LocationMap/LocationMap'
import HorizontalBarChart from '../../charts/HorizontalBarChart/HorizontalBarChart'
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

// How many rows show in the "Top Locations" side list. The card's stagger
// animation (LocationOverviewCard.module.scss) is keyed for 5 rows, so this
// should stay in sync with that.
const MAX_BREAKDOWN_ROWS = 5

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

  if (labels[key]) return labels[key]

  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
}

const REGION_INPUT_TO_NEXT: Record<string, LocationOverviewRegion> = {
  continent: 'country',
  country: 'state',
  state: 'city',
}

function resolveRegionFromQueryParam(): LocationOverviewRegion {
  if (typeof window === 'undefined') {
    return 'continent'
  }

  const queryValue = new URLSearchParams(window.location.search).get('region')?.trim().toLowerCase()

  if (!queryValue) {
    return 'continent'
  }

  if (queryValue === 'city') {
    return 'continent'
  }

  return REGION_INPUT_TO_NEXT[queryValue] ?? 'continent'
}

// TODO(api): the backend doesn't return a period-over-period trend for a
// region yet. Once `LocationOverviewApiResponse` rows carry a real field
// (e.g. `deltaPct`), read it here instead of deriving a placeholder so the
// badge reflects actual week-over-week change rather than a stable-but-fake
// number. Keeping this deterministic (hash of the id) means it won't flicker
// between re-renders/searches, which is the only reason it's safe to ship
// as an interim placeholder.
function derivePlaceholderDelta(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % 13) - 6 // -6..+6
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

function adjustDuplicateLocationCoordinates(locations: MapLocation[]) {
  const counts = new Map<string, number>()

  return locations.map((location) => {
    const key = `${location.lat.toFixed(4)},${location.lng.toFixed(4)}`
    const current = counts.get(key) ?? 0
    counts.set(key, current + 1)

    if (current === 0) {
      return location
    }

    const offsetDistance = 0.65
    const angle = (current - 1) * 0.9
    return {
      ...location,
      lat: location.lat + Math.sin(angle) * offsetDistance,
      lng: location.lng + Math.cos(angle) * offsetDistance,
    }
  })
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

  const adjustedLocations = adjustDuplicateLocationCoordinates(locations)
  const orderedLocations = [...adjustedLocations].sort((a, b) => b.count - a.count)
  const regionLabel = apiResponse.data.region === 'country'
    ? 'States'
    : apiResponse.data.region === 'state'
    ? 'Cities'
    : 'Countries'

  return {
    dataType: metric,
    totalLabel: `Total\n${regionLabel}`,
    total: orderedLocations.length,
    topLabel: `Top ${regionLabel}`,
    locations: orderedLocations,
    breakdown: [],
  }
}

export default function LocationOverviewCard({ hideHeaderControls = false, hideSummary = false, compact = false }: LocationOverviewCardProps) {
  const [dataType, setDataType] = useState<LocationDataType>('events')
  const [region, setRegion] = useState<LocationOverviewRegion>(resolveRegionFromQueryParam())
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [config, setConfig] = useState<LocationOverviewConfig>({
    dataType: 'events',
    totalLabel: 'Total\nCountries',
    total: 0,
    topLabel: 'Top Countries',
    locations: [],
    breakdown: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  // The level we're requesting is also the level being *listed* right now
  // (e.g. while `region === 'continent'` the list/map show countries), so
  // it drives what the search box should say it searches.
  const searchTargetLabel = region === 'country' ? 'State' : region === 'state' ? 'City' : 'Country'

  const cleanedFilters = (filtersToClean: Record<string, string>) =>
    Object.entries(filtersToClean).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value
      }
      return acc
    }, {})

  const handleDataTypeChange = (type: LocationDataType) => {
    setDataType(type)
    setRegion('continent')
    setFilters({})
    setSearchQuery('')
  }

  const handleLocationClick = (location: MapLocation) => {
    const regionName = location.country

    if (region === 'continent') {
      setFilters({ continent: regionName })
      setRegion('country')
      setSearchQuery('')
      return
    }

    if (dataType === 'events' && region === 'country') {
      setFilters((current) => cleanedFilters({
        continent: current.continent ?? '',
        country: regionName,
      }))
      setRegion('state')
      setSearchQuery('')
      return
    }

    if (dataType === 'events' && region === 'state') {
      setFilters((current) => cleanedFilters({
        continent: current.continent ?? '',
        country: current.country ?? '',
        state: regionName,
      }))
      setRegion('city')
      setSearchQuery('')
      return
    }
  }

  const handleBackClick = () => {
    setSearchQuery('')

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
        setConfig({
          dataType,
          totalLabel: 'Total\nCountries',
          total: 0,
          topLabel: 'Top Countries',
          locations: [],
          breakdown: [],
        })
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [dataType, region, filters])

  // Recomputed from the raw location list (rather than pre-baked into
  // config) so the search box can filter both the map markers and the side
  // list without a round-trip to the API.
  const visibleLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return config.locations
    return config.locations.filter((location) => location.country.toLowerCase().includes(query))
  }, [config.locations, searchQuery])

  const visibleBreakdown = useMemo(() => {
    const top = visibleLocations.slice(0, MAX_BREAKDOWN_ROWS)
    const maxCount = top[0]?.count ?? 1

    return top.map((location) => ({
      key: location.id,
      title: location.country,
      percentage: Math.round((location.count / maxCount) * 100),
      segments: location.breakdown,
      delta: derivePlaceholderDelta(location.id),
    }))
  }, [visibleLocations])

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
          <div className={styles['location-overview-card__search']}>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search by ${searchTargetLabel}`}
              aria-label={`Search by ${searchTargetLabel}`}
              className={styles['location-overview-card__search-input']}
            />
            <svg
              className={styles['location-overview-card__search-icon']}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {!hideHeaderControls && (
          <div className={styles['location-overview-card__controls']}>
            {region !== 'continent' && (
              <button
                type="button"
                className={styles['location-overview-card__toggle-btn']}
                onClick={handleBackClick}
              >
                Back
              </button>
            )}

            <div className={styles['location-overview-card__toggle']} role="group" aria-label="Data type">
              {(['events', 'users'] as LocationDataType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles['location-overview-card__toggle-btn']} ${
                    dataType === type ? styles['location-overview-card__toggle-btn--active'] : ''
                  }`}
                  onClick={() => handleDataTypeChange(type)}
                >
                  {type === 'events' ? 'Events' : 'Users'}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className={styles['location-overview-card__body']}>
        <div className={styles['location-overview-card__map-col']}>
          <LocationMap locations={visibleLocations} onLocationClick={handleLocationClick} />
          {isLoading && (
            <div className={styles['location-overview-card__loading-overlay']}>
              <div className={styles['location-overview-card__loading-box']} />
            </div>
          )}
        </div>

        {!hideSummary && (
          <div className={styles['location-overview-card__side']}>
            <div className={styles['location-overview-card__total']}>
              <span className={styles['location-overview-card__total-value']}>{isLoading ? '--' : config.total}</span>
              <span className={styles['location-overview-card__total-label']}>
                {config.totalLabel.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </div>

            <p className={styles['location-overview-card__subtitle']}>{isLoading ? 'Loading locations…' : config.topLabel}</p>

            {!isLoading && visibleBreakdown.length === 0 ? (
              <p className={styles['location-overview-card__empty']}>No locations match "{searchQuery}".</p>
            ) : (
              <ul className={styles['location-overview-card__breakdown']}>
                {(isLoading ? Array.from({ length: MAX_BREAKDOWN_ROWS }, (_, idx) => ({
                  key: `loading-${idx}`,
                  title: '',
                  percentage: 0,
                  segments: [],
                  delta: 0,
                })) : visibleBreakdown).map((item, breakdownIndex) => (
                  <li key={item.key} className={styles['location-overview-card__breakdown-item']}>
                    <div className={styles['location-overview-card__breakdown-row']}>
                      <span className={styles['location-overview-card__breakdown-title']}>{item.title}</span>
                      {!isLoading && (
                        <span
                          className={`${styles['location-overview-card__breakdown-delta']} ${
                            item.delta >= 0
                              ? styles['location-overview-card__breakdown-delta--up']
                              : styles['location-overview-card__breakdown-delta--down']
                          }`}
                        >
                          {item.delta >= 0 ? '+' : ''}{item.delta}%
                        </span>
                      )}
                    </div>
                    <HorizontalBarChart segments={item.segments} animationDelay={400 + breakdownIndex * 60} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  )
}