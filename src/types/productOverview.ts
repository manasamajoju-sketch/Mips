export interface ProductOverviewCategory {
  key: string
  title: string
  mipsProducts: number
  other: number
  total: number
  /** Period-over-period change, e.g. 5 for "+5%", -5 for "-5%" */
  delta: number
}