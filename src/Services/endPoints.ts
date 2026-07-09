import { ApiEndpoint } from "../Constants/api";

export const ENDPOINTS = {

  events: {
    overview: ApiEndpoint.Events.Overview,
    timeseries: ApiEndpoint.Events.Timeseries,
    latest: ApiEndpoint.Events.Latest,
  },
} as const;