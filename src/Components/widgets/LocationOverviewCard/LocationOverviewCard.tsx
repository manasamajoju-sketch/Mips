import { useEffect, useMemo, useState } from 'react'
import { InfoIcon } from '../../common/Icons'
import LocationMap from '../../cards/LocationMap/LocationMap'
import { dashboardService } from '../../../Services/dashboardService'
import type {
  LocationDataType,
  LocationOverviewApiResponse,
  LocationOverviewConfig,
  LocationOverviewEventsRow,
  LocationOverviewRegion,
  LocationOverviewUsersRow,
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

// Teal-only palette — no yellow / charcoal. Unknown API keys cycle through
// the same family so map rings and legend stay on-brand.
const TEAL_PALETTE = ['#7DDBEA', '#43CBDB', '#14A6BE', '#2FB9CC', '#0B8A9A'] as const

function getCategoryColor(key: string) {
  const categoryColors: Record<string, string> = {
    sos: '#F5E642',
    active: '#7DDBEA',
    passive: '#14A6BE',
    others: '#17364A',
    mipsUsers: '#7DDBEA',
    nonMipsUsers: '#14A6BE',
  }

  if (categoryColors[key]) return categoryColors[key]

  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  return TEAL_PALETTE[Math.abs(hash) % TEAL_PALETTE.length]
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
// (e.g. `deltaPct`), read it here so the badge reflects actual change.

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

  const breakdown = Object.entries(counts ?? {})
    .map(([key, value]) => ({
      key,
      label: getDisplayLabel(key),
      value: Number(value) || 0,
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

function isEventsRow(row: unknown): row is LocationOverviewEventsRow {
  if (!row || typeof row !== 'object') return false
  const candidate = row as Record<string, unknown>
  return (
    typeof candidate.byType === 'object' &&
    candidate.byType !== null &&
    !Array.isArray(candidate.byType)
  )
}

function isUsersRow(row: unknown): row is LocationOverviewUsersRow {
  if (!row || typeof row !== 'object') return false
  const candidate = row as Record<string, unknown>
  return (
    'mipsUsers' in candidate ||
    'nonMipsUsers' in candidate ||
    'mips_users' in candidate ||
    'non_mips_users' in candidate ||
    'totalUsers' in candidate
  )
}

function extractUserCounts(row: LocationOverviewUsersRow | Record<string, unknown>): Record<string, number> {
  const candidate = row as Record<string, unknown>
  const mipsUsers = Number(candidate.mipsUsers ?? candidate.mips_users ?? 0) || 0
  const nonMipsUsers = Number(candidate.nonMipsUsers ?? candidate.non_mips_users ?? 0) || 0

  if (mipsUsers > 0 || nonMipsUsers > 0) {
    return { mipsUsers, nonMipsUsers }
  }

  // Some payloads put user splits under byType instead of flat fields.
  if (typeof candidate.byType === 'object' && candidate.byType !== null) {
    return Object.entries(candidate.byType as Record<string, number>).reduce<Record<string, number>>(
      (acc, [key, value]) => {
        acc[key] = Number(value) || 0
        return acc
      },
      {},
    )
  }

  const totalUsers = Number(candidate.totalUsers ?? candidate.total_users ?? 0) || 0
  return totalUsers > 0 ? { mipsUsers: totalUsers } : {}
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

function emptyOverviewConfig(dataType: LocationDataType = 'events'): LocationOverviewConfig {
  return {
    dataType,
    totalLabel: 'Total\nCountries',
    total: 0,
    topLabel: 'Top Countries',
    locations: [],
    breakdown: [],
  }
}

function buildOverviewConfigFromApi(
  apiResponse: LocationOverviewApiResponse
): LocationOverviewConfig {
  const data = apiResponse?.data
  const rows = data?.rows
  if (!data || !Array.isArray(rows)) {
    return emptyOverviewConfig(data?.metric ?? 'events')
  }

  const metric = data.metric
  const filters = data.filters ?? {}
  const fallbackRegions = [filters.state, filters.country, filters.continent].filter(Boolean) as string[]

  const locations: MapLocation[] = rows
    .map((row) => {
      if (!row || typeof row !== 'object' || !('region' in row) || !row.region) {
        return null
      }

      // Prefer metric + field shape over a naive `'byType' in row` check —
      // users payloads sometimes include a null/empty `byType`, which used
      // to send Object.entries(null) and crash the toggle.
      if (metric === 'users' || isUsersRow(row)) {
        return countsToMapLocation(
          row.region,
          row.region,
          extractUserCounts(row as LocationOverviewUsersRow),
          fallbackRegions,
        )
      }

      if (isEventsRow(row)) {
        return countsToMapLocation(row.region, row.region, row.byType, fallbackRegions)
      }

      return null
    })
    .filter((location): location is MapLocation => location !== null)

  const adjustedLocations = adjustDuplicateLocationCoordinates(locations)
  const orderedLocations = [...adjustedLocations].sort((a, b) => b.count - a.count)
  const regionLabel = data.region === 'country'
    ? 'States'
    : data.region === 'state'
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
  // Drives the bar-track grow + value-label reveal directly, rather than
  // relying on a CSS `:hover` rule that cross-references the value
  // label's class name by string — that pattern depends on the CSS
  // Modules loader merging identical local class names across the file,
  // which isn't guaranteed by every build config.
  const [hoveredBarKey, setHoveredBarKey] = useState<string | null>(null)

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
    setIsLoading(true)
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
    setIsLoading(true)

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
        setConfig(emptyOverviewConfig(dataType))
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

    // Scale each bar against the total across *all* visible locations
    // (not just the top N), so the width reflects each location's actual
    // share of total users/events rather than its share relative to
    // whichever location happens to be #1 in the list.
    const grandTotal = visibleLocations.reduce((sum, location) => sum + location.count, 0) || 1

    return top.map((location) => ({
      key: location.id,
      title: location.country,
      count: location.count,
      percentage: Math.max(8, Math.round((location.count / grandTotal) * 100)),
      delta: 0,
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
                  count: 0,
                  percentage: 40,
                  delta: 0,
                })) : visibleBreakdown).map((item) => (
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
                    <div
                      className={`${styles['location-overview-card__bar-track']}${
                        !isLoading && hoveredBarKey === item.key
                          ? ` ${styles['location-overview-card__bar-track--active']}`
                          : ''
                      }`}
                      tabIndex={isLoading ? undefined : 0}
                      aria-label={isLoading ? undefined : `${item.title}: ${item.count.toLocaleString()}`}
                      onMouseEnter={() => !isLoading && setHoveredBarKey(item.key)}
                      onMouseLeave={() => setHoveredBarKey((current) => (current === item.key ? null : current))}
                      onFocus={() => !isLoading && setHoveredBarKey(item.key)}
                      onBlur={() => setHoveredBarKey((current) => (current === item.key ? null : current))}
                    >
                      <div
                        className={styles['location-overview-card__bar-fill']}
                        style={{ width: isLoading ? '40%' : `${item.percentage}%` }}
                      >
                        {!isLoading && item.count > 0 && (
                          <span
                            className={styles['location-overview-card__bar-value']}
                            style={{ opacity: hoveredBarKey === item.key ? 1 : 0 }}
                          >
                            {item.count.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
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