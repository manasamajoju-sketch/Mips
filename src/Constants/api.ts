export const ApiEndpoint = {
 
  Events: {
    Overview: "/mips/overview/events",
    Timeseries: "/mips/events/timeseries",
    Latest: "/mips/events/latest",
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
