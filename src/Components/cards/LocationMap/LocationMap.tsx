import { useEffect, useRef } from 'react'
import { useGoogleMapsScript } from '../../../Hooks/useGoogleMapsScript'
import { GOOGLE_MAPS_API_KEY, LOCATION_MAP_STYLE } from '../../../Constants/mapStyle'
import type { MapLocation } from '../../../types/location'
import styles from './LocationMap.module.scss'

interface LocationMapProps {
  locations: MapLocation[]
}

const MIN_MARKER_RADIUS = 6
const MAX_MARKER_RADIUS = 22

function getMarkerRadius(count: number, maxCount: number): number {
  if (maxCount <= 0) return MIN_MARKER_RADIUS
  const ratio = count / maxCount
  return MIN_MARKER_RADIUS + ratio * (MAX_MARKER_RADIUS - MIN_MARKER_RADIUS)
}

export default function LocationMap({ locations }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const { isLoaded, error } = useGoogleMapsScript(GOOGLE_MAPS_API_KEY)

  // Create the map once the script is ready.
  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) return

    mapRef.current = new google.maps.Map(containerRef.current, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      minZoom: 1,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      keyboardShortcuts: false,
      styles: LOCATION_MAP_STYLE,
      backgroundColor: '#ffffff',
    })
  }, [isLoaded])

  // Draw markers and fit bounds whenever the location set changes.
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (locations.length === 0) return

    const maxCount = Math.max(...locations.map((location) => location.count))
    const bounds = new google.maps.LatLngBounds()

    locations.forEach((location) => {
      const position = { lat: location.lat, lng: location.lng }
      const radius = getMarkerRadius(location.count, maxCount)

      const marker = new google.maps.Marker({
        map: mapRef.current!,
        position,
        title: `${location.country}: ${location.count}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: radius,
          fillColor: '#2fb9cc',
          fillOpacity: 0.35,
          strokeColor: '#2fb9cc',
          strokeWeight: 1.5,
        },
      })

      markersRef.current.push(marker)
      bounds.extend(position)
    })

    mapRef.current.fitBounds(bounds, 32)
  }, [isLoaded, locations])

  if (error) {
    return (
      <div className={styles.fallback}>
        <span>Map unavailable — {error}</span>
      </div>
    )
  }

  return (
    <div className={styles.map} ref={containerRef}>
      {!isLoaded && <div className={styles.loading}>Loading map…</div>}
    </div>
  )
}
