import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endPoints";


export const dashboardService = {

  getEventOverview: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.events.overview}?window=${encodeURIComponent(window)}`),

  getEventTimeseries: (window: string = '30d') =>
    apiClient(`${ENDPOINTS.events.timeseries}?window=${encodeURIComponent(window)}`),

  getLatestEvents: () =>
    apiClient(ENDPOINTS.events.latest),
};