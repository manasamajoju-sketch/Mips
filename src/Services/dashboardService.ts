import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endPoints";


export const dashboardService = {

  getEventOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.events.overview}?window=${encodeURIComponent(window)}`),

  getEventTimeseries: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.events.timeseries}?window=${encodeURIComponent(window)}`),

  getLatestEvents: () =>
    apiClient(ENDPOINTS.events.latest),

  getUserOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.users.overview}?window=${encodeURIComponent(window)}`),

  getProductOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.products.overview}?window=${encodeURIComponent(window)}`),

  getDemographicsOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.demographics.overview}?window=${encodeURIComponent(window)}`),
};
