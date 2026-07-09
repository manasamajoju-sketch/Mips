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