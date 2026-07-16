export const ApiEndpoint = {
 
  Events: {
    Overview: "/mips/overview/events",
    Timeseries: "/mips/events/timeseries",
    Latest: "/mips/events/latest",
    ImpactDirection: "/mips/overview/impact-direction",
    SeverityTimeseries: "/mips/events/severity-timeseries",
    IrmsDistribution: "/mips/events/irms-distribution",
    GForceExtremes: "/mips/events/g-force-extremes",
    EventTimeHeatmap: "/mips/overview/event-time-heatmap",
    TopEvents: "/mips/overview/top-events",
    ProcessedEvents: "/mips/events/processed-data",
  },

  Locations: {
    Overview: "/mips/overview/locations",
  },

  Users: {
    Overview: "/mips/overview/users",
  },

  Products: {
    Overview: "/mips/overview/products",
  },

  Demographics: {
    Overview: "/mips/overview/demographics",
  },
} as const;