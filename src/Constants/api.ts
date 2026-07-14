export const ApiEndpoint = {
 
  Events: {
    Overview: "/mips/overview/events",
    Timeseries: "/mips/events/timeseries",
    Latest: "/mips/events/latest",
    ImpactDirection: "/mips/overview/impact-direction",
    IrmsDistribution: "/mips/events/irms-distribution",
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
