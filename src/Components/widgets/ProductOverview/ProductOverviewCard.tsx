import { useState } from 'react'
import { InfoIcon } from '../../common/Icons'
import HorizontalBarChart from '../../charts/HorizontalBarChart/HorizontalBarChart'
import {
  productOverviewCategories,
  productOverviewSegmentColors,
} from '../../../Constants/productOverviewMock'
import type { ProductOverviewCategory } from '../../../types/productOverview'
import styles from './ProductOverviewCard.module.scss'

interface ProductOverviewCardProps {
  categories?: ProductOverviewCategory[]
  isLoading?: boolean
}

export default function ProductOverviewCard({
  categories = productOverviewCategories,
  isLoading = false,
}: ProductOverviewCardProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const placeholderCategories: ProductOverviewCategory[] = [
    { key: 'ppe',     title: 'PPE',     mipsProducts: 1234, other: 34,  total: 1268, delta: 5  },
    { key: 'cycling', title: 'Cycling', mipsProducts: 180,  other: 80,  total: 260,  delta: -5 },
    { key: 'moto',    title: 'Moto',    mipsProducts: 180,  other: 80,  total: 260,  delta: 5 },
    { key: 'others',  title: 'Others',  mipsProducts: 80,   other: 120, total: 200,  delta: -5 },
  ]

  const normalizeCategory = (cat: ProductOverviewCategory) => {
    const segmentSum = cat.mipsProducts + cat.other
    const total = cat.total > 0 ? cat.total : segmentSum

    if (total < segmentSum) {
      return {
        ...cat,
        other: Math.max(0, total - cat.mipsProducts),
        total,
      }
    }

    return { ...cat, total }
  }

  const renderedCategories = isLoading ? placeholderCategories : categories
  const normalizedCategories = renderedCategories.map(normalizeCategory)
  const grandMips  = normalizedCategories.reduce((s, c) => s + c.mipsProducts, 0)
  const grandTotal = normalizedCategories.reduce((s, c) => s + c.total, 0)
  const mipsPct    = isLoading ? '--' : grandTotal > 0 ? Math.round((grandMips / grandTotal) * 100) : 0

  // Legend items matching reference image — 4 items
  const legendItems = [
    { label: 'MIPS',     color: productOverviewSegmentColors.mipsProducts },
    { label: 'Non-MIPS', color: productOverviewSegmentColors.other },
    { label: 'Unknown',  color: productOverviewSegmentColors.unknown },
    { label: 'Others',   color: productOverviewSegmentColors.others },
  ]

  const getRestValue = (cat: ProductOverviewCategory) =>
    Math.max(0, cat.total - cat.mipsProducts - cat.other)

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Product Overview
          <button type="button" className={styles.infoBtn} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>
      </header>

      {/* Big % + label */}
      <div className={styles.total}>
        <span className={styles.totalValue}>{mipsPct}%</span>
        <span className={styles.totalLabel}>
          <span>MIPS</span>
          <span>Products</span>
        </span>
      </div>

      {/* 4-item legend */}
      <div className={styles.legend}>
        {legendItems.map(({ label, color }) => (
          <span key={label} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Bar list */}
      <div className={styles.barList}>
        {normalizedCategories.map((cat, idx) => {
          const isActive   = hoveredKey === cat.key
          const isPositive = cat.delta >= 0

          return (
            <div
              key={cat.key}
              className={`${styles.barRow} ${isActive ? styles.barRowActive : ''}`}
              onMouseEnter={() => setHoveredKey(cat.key)}
              onMouseLeave={() => setHoveredKey(p => p === cat.key ? null : p)}
            >
              <span className={styles.barLabelRow}>
                <span className={styles.barLabel}>{cat.title}</span>
                <span className={`${styles.delta} ${isPositive ? styles.deltaUp : styles.deltaDown}`}>
                  {isPositive ? '+' : ''}{cat.delta}%
                </span>
              </span>

              <HorizontalBarChart
                active={isActive}
                animationDelay={180 + idx * 140}
                segments={[
                  {
                    key:       `${cat.key}-mips`,
                    label:     'MIPS Products',
                    value:     cat.mipsProducts,
                    color:     productOverviewSegmentColors.mipsProducts,
                    textColor: '#101828',
                  },
                  {
                    key:       `${cat.key}-other`,
                    label:     'Non-MIPS Products',
                    value:     cat.other,
                    color:     productOverviewSegmentColors.other,
                    textColor: '#101828',
                  },
                  ...(
                    getRestValue(cat) > 0 ? [
                      {
                        key:       `${cat.key}-rest`,
                        label:     'Unknown Products',
                        value:     getRestValue(cat),
                        color:     productOverviewSegmentColors.unknown,
                        textColor: '#101828',
                      },
                    ] : []
                  ),
                ]}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}