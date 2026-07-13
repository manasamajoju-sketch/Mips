export interface ProductOverviewCategory {
  key: string
  title: string
  mipsProducts: number
  other: number
  total: number
  /** Period-over-period change, e.g. 5 for "+5%", -5 for "-5%" */
  delta: number
}

export interface ProductOverviewBucket {
  mips: number
  nonMips: number
  total: number
}

export interface ProductOverviewOverviewData {
  window: string
  range: {
    from: string
    to: string
  }
  buckets: Record<'Cycling' | 'Moto' | 'PPE', ProductOverviewBucket>
}

export interface ProductOverviewApiResponse {
  success: boolean
  data: ProductOverviewOverviewData
  meta: Record<string, unknown>
}