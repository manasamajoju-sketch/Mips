export interface UserOverviewCategory {
  category: string
  mipsUsers: number
  total: number
  usersWithEvents: number
}

export interface UserOverviewStack {
  key: keyof Omit<UserOverviewCategory, 'category'>
  label: string
  color: string
  /** Text color used for the inline value label revealed on hover */
  textColor?: string
}

export interface UserOverviewBucket {
  totalUsers: number
  mipsUsers: number
  multiEventUsers: number
}

export interface UserOverviewOverviewData {
  window: string
  range: {
    from: string
    to: string
  }
  buckets: Record<'Cycling' | 'Moto' | 'PPE', UserOverviewBucket>
}

export interface UserOverviewApiResponse {
  success: boolean
  data: UserOverviewOverviewData
  meta: Record<string, unknown>
}
