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
}