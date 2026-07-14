import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endPoints";


export const dashboardService = {

  getEventOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.events.overview}?window=${encodeURIComponent(window)}`),

  getEventTimeseries: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.events.timeseries}?window=${encodeURIComponent(window)}`),

  getImpactDirection: (window: string = '30d', vertical = 'Cycling') =>
    apiClient(
      `${ENDPOINTS.events.impactDirection}?window=${encodeURIComponent(window)}&vertical=${encodeURIComponent(vertical)}`
    ),

  getIrmsDistribution: (window: string = '30d', vertical: string = 'Cycling') =>
    apiClient(
      `${ENDPOINTS.events.irmsDistribution}?window=${encodeURIComponent(window)}&vertical=${encodeURIComponent(vertical)}`
    ),

  getLocationOverview: (
    metric: 'events' | 'users',
    region: 'continent' | 'country' | 'state' | 'city' = 'continent',
    window: string = '30d',
    filters: Record<string, string> = {}
  ) => {
    const cleanedFilters = Object.entries(filters).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value
      }
      return acc
    }, {})

    const query = new URLSearchParams({
      metric,
      region,
      window,
      ...cleanedFilters,
    })

    return apiClient(`${ENDPOINTS.locations.overview}?${query.toString()}`)
  },

  getLatestEvents: () =>
    apiClient(ENDPOINTS.events.latest),

  getUserOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.users.overview}?window=${encodeURIComponent(window)}`),

  getProductOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.products.overview}?window=${encodeURIComponent(window)}`),

  getDemographicsOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.demographics.overview}?window=${encodeURIComponent(window)}`),
};
