import { ApiEndpoint } from "../Constants/api";

export const ENDPOINTS = {

  events: {
    overview: ApiEndpoint.Events.Overview,
    timeseries: ApiEndpoint.Events.Timeseries,
    latest: ApiEndpoint.Events.Latest,
    impactDirection: ApiEndpoint.Events.ImpactDirection,
    irmsDistribution: ApiEndpoint.Events.IrmsDistribution,
    severityTimeseries: ApiEndpoint.Events.SeverityTimeseries,
  },

  locations: {
    overview: ApiEndpoint.Locations.Overview,
  },

  users: {
    overview: ApiEndpoint.Users.Overview,
  },

  products: {
    overview: ApiEndpoint.Products.Overview,
  },

  demographics: {
    overview: ApiEndpoint.Demographics.Overview,
  },
} as const;
