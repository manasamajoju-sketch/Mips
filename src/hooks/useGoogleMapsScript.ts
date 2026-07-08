import { useEffect, useState } from 'react'

let scriptLoadingPromise: Promise<void> | null = null

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (window.google?.maps) {
    return Promise.resolve()
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptLoadingPromise = null
      reject(new Error('Failed to load Google Maps script'))
    }
    document.head.appendChild(script)
  })

  return scriptLoadingPromise
}

interface UseGoogleMapsScriptResult {
  isLoaded: boolean
  error: string | null
}

/**
 * Loads the Google Maps JS API once and shares the result across every
 * component that calls this hook (e.g. multiple map cards on one page).
 * Returns `error` when no API key is configured, or the script fails to load.
 */
export function useGoogleMapsScript(apiKey: string | undefined): UseGoogleMapsScriptResult {
  const [isLoaded, setIsLoaded] = useState(Boolean(window.google?.maps))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) {
      setError('Missing VITE_GOOGLE_MAPS_API_KEY')
      return
    }

    let cancelled = false

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!cancelled) setIsLoaded(true)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load Google Maps')
      })

    return () => {
      cancelled = true
    }
  }, [apiKey])

  return { isLoaded, error }
}
