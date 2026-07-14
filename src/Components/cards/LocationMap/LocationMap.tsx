import { useEffect, useRef } from 'react'
import { useGoogleMapsScript } from '../../../hooks/useGoogleMapsScript'
import { GOOGLE_MAPS_API_KEY, LOCATION_MAP_STYLE } from '../../../Constants/mapStyle'
import { EVENT_CATEGORY_COLORS } from '../../../Constants/eventOverviewData'
import type { MapLocation } from '../../../types/location'
import styles from './LocationMap.module.scss'

interface LocationMapProps {
  locations: MapLocation[]
  onLocationClick?: (location: MapLocation) => void
}

const DEFAULT_ZOOM = 0
const DEFAULT_CENTER = { lat: 20, lng: 0 }

// Keeps the map from panning/zooming out far enough to show the world
// wrapped multiple times side by side.
const WORLD_BOUNDS: google.maps.LatLngBoundsLiteral = { north: 95, south: -95, west: -180, east: 180 }

// Builds the same conic-gradient ring the reference project uses for its
// DOM-based donut markers (CSS conic-gradient, not an SVG/canvas chart).
function getBreakdownConicGradient(breakdown: MapLocation['breakdown']): string {
  const total = breakdown.reduce((sum, slice) => sum + slice.value, 0)
  if (total <= 0) return ''

  let currentAngle = 0
  const stops = breakdown.map((slice) => {
    const startAngle = currentAngle
    const endAngle = currentAngle + (slice.value / total) * 360
    currentAngle = endAngle
    return `${slice.color} ${startAngle}deg ${endAngle}deg`
  })

  return `conic-gradient(${stops.join(', ')})`
}

function createMarkerElement(location: MapLocation): HTMLButtonElement {
  const element = document.createElement('button')
  element.type = 'button'
  element.className = styles.marker
  element.style.position = 'absolute'
  element.style.left = '0'
  element.style.top = '0'

  const dot = document.createElement('span')
  dot.className = styles.dot

  const ring = document.createElement('span')
  ring.className = styles.ring
  ring.style.background = getBreakdownConicGradient(location.breakdown)
  dot.appendChild(ring)

  const text = document.createElement('span')
  text.className = styles.count
  text.textContent = String(location.count)
  dot.appendChild(text)

  element.appendChild(dot)
  return element
}

export default function LocationMap({ locations, onLocationClick }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const overlaysRef = useRef<google.maps.OverlayView[]>([])
  const { isLoaded, error } = useGoogleMapsScript(GOOGLE_MAPS_API_KEY)

  // Create the map once the script is ready.
  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) return

    mapRef.current = new google.maps.Map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 2,
      maxZoom: 4,
      restriction: {
        latLngBounds: WORLD_BOUNDS,
        strictBounds: true,
      },
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      keyboardShortcuts: false,
      styles: LOCATION_MAP_STYLE,
      backgroundColor: '#ffffff',
    })
  }, [isLoaded])

  // Draw donut markers as custom OverlayView DOM elements, positioned via
  // the map projection. Does not reset zoom/center on every update, so it
  // doesn't fight a user's manual pan/zoom.
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return
    const map = mapRef.current

    overlaysRef.current.forEach((overlay) => overlay.setMap(null))
    overlaysRef.current = []

    if (locations.length === 0) return

    const bounds = new google.maps.LatLngBounds()

    locations.forEach((location) => {
      const position = { lat: location.lat, lng: location.lng }
      const element = createMarkerElement(location)

      element.style.cursor = onLocationClick ? 'pointer' : 'default'
      element.addEventListener('click', () => {
        if (onLocationClick) {
          onLocationClick(location)
        }
        map.panTo(position)
        map.setZoom(5)
      })

      const overlay = new google.maps.OverlayView()

      overlay.onAdd = () => {
        overlay.getPanes()?.overlayMouseTarget.appendChild(element)
      }

      overlay.draw = () => {
        const projection = overlay.getProjection()
        const point = projection?.fromLatLngToDivPixel(new google.maps.LatLng(position.lat, position.lng))
        if (!point) return
        element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`
      }

      overlay.onRemove = () => {
        element.remove()
      }

      overlay.setMap(map)
      overlaysRef.current.push(overlay)
      bounds.extend(position)
    })

    // Re-frame to the new marker set (e.g. after the Events/Users toggle
    // swaps locations) — fitBounds respects minZoom/maxZoom, so it can't
    // collapse to the broken near-zero zoom that caused the repeat-world bug.
    map.fitBounds(bounds, 48)
  }, [isLoaded, locations])

  if (error) {
    return (
      <div className={styles.fallback}>
        <span>Map unavailable — {error}</span>
      </div>
    )
  }

  return (
    <div className={styles.map}>
      <div className={styles.canvas} ref={containerRef} />
      {!isLoaded && <div className={styles.loading}>Loading map…</div>}

      <div className={styles.legend}>
        {Array.from(
          locations.reduce((legendMap, location) => {
            location.breakdown.forEach((slice) => {
              if (!legendMap.has(slice.key)) {
                legendMap.set(slice.key, {
                  key: slice.key,
                  label: slice.label,
                  color: slice.color,
                })
              }
            })
            return legendMap
          }, new Map<string, { key: string; label: string; color: string }>())
          .values()
        ).map((category) => (
          <span key={category.key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: category.color }} />
            {category.label}
          </span>
        ))}
      </div>
    </div>
  )
}