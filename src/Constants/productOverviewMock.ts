import type { ProductOverviewCategory } from '../types/productOverview'
import { EVENT_CATEGORY_COLORS } from './eventOverviewData'

export const productOverviewCategories: ProductOverviewCategory[] = [
  { key: 'ppe', title: 'PPE', mipsProducts: 42, other: 18, total: 60 },
  { key: 'cycling', title: 'Cycling', mipsProducts: 36, other: 22, total: 58 },
  { key: 'moto', title: 'Moto', mipsProducts: 31, other: 16, total: 47 },
  { key: 'other', title: 'Other', mipsProducts: 18, other: 12, total: 30 },
]

export const productOverviewSegmentColors = {
  mipsProducts: EVENT_CATEGORY_COLORS.sos,
  other: EVENT_CATEGORY_COLORS.active,
}

export const productOverviewTotal = productOverviewCategories.reduce((sum, item) => sum + item.total, 0)