import type { UserOverviewCategory, UserOverviewStack } from '../types/userOverview'
import { EVENT_CATEGORY_COLORS } from './eventOverviewData'

export const userOverviewData: UserOverviewCategory[] = [
  { category: 'PPE', mipsUsers: 42, total: 54, usersWithEvents: 24 },
  { category: 'Cycling', mipsUsers: 58, total: 68, usersWithEvents: 32 },
  { category: 'Moto', mipsUsers: 39, total: 61, usersWithEvents: 26 },
  { category: 'Other', mipsUsers: 18, total: 48, usersWithEvents: 5 },
]

export const userOverviewStacks: UserOverviewStack[] = [
  { key: 'mipsUsers', label: 'MIPS users', color: EVENT_CATEGORY_COLORS.sos, textColor: '#101828' },
  { key: 'total', label: 'Total', color: EVENT_CATEGORY_COLORS.active, textColor: '#101828' },
  {
    key: 'usersWithEvents',
    label: 'Users with\n1+ events',
    color: EVENT_CATEGORY_COLORS.passive,
    textColor: '#101828',
  },
]

export const userOverviewTotal = userOverviewData.reduce((sum, item) => sum + item.total, 0)