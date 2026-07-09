import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endPoints";


export const dashboardService = {

  getEventOverview: () =>
    apiClient(ENDPOINTS.events.overview),

  getEventTimeseries: () =>
    apiClient(ENDPOINTS.events.timeseries),

  getLatestEvents: () =>
    apiClient(ENDPOINTS.events.latest),
};