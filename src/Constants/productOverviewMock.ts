import type { ProductOverviewCategory } from '../types/productOverview'
import { EVENT_CATEGORY_COLORS } from './eventOverviewData'

export const productOverviewCategories: ProductOverviewCategory[] = [
  { key: 'ppe', title: 'PPE', mipsProducts: 1234, other: 34, total: 1268, delta: 5 },
  { key: 'cycling', title: 'Cycling', mipsProducts: 36, other: 22, total: 58, delta: -5 },
  { key: 'moto', title: 'Moto', mipsProducts: 31, other: 19, total: 50, delta: -5 },
  { key: 'other', title: 'Other', mipsProducts: 18, other: 12, total: 30, delta: -5 },
]

export const productOverviewSegmentColors = {
  mipsProducts: EVENT_CATEGORY_COLORS.sos,
  other: EVENT_CATEGORY_COLORS.active,
  unknown: EVENT_CATEGORY_COLORS.passive,
  others: EVENT_CATEGORY_COLORS.others,
}

export const productOverviewTotal = productOverviewCategories.reduce((sum, item) => sum + item.total, 0)