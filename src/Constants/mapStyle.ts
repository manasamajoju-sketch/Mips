/**
 * Custom Google Maps style, tuned to this project's teal/white palette
 * (reference project ships separate light/dark variants — this project
 * has a single light theme, so only one style is needed).
 */
export const LOCATION_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { elementType: 'geometry.fill', stylers: [{ color: '#e4e7ec' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
]

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
