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
}

export default function ProductOverviewCard({ categories = productOverviewCategories }: ProductOverviewCardProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const grandMips = categories.reduce((sum, c) => sum + c.mipsProducts, 0)
  const grandTotal = categories.reduce((sum, c) => sum + c.mipsProducts + c.other, 0)
  const mipsPercentage = grandTotal > 0 ? Math.round((grandMips / grandTotal) * 100) : 0

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

      <div className={styles.total}>
        <span className={styles.totalValue}>{mipsPercentage}%</span>
        <span className={styles.totalLabel}>
          <span>MIPS</span>
          <span>Products</span>
        </span>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: productOverviewSegmentColors.mipsProducts }} />
          MIPS Products
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: productOverviewSegmentColors.other }} />
          Non-MIPS Products
        </span>
      </div>

      <div className={styles.barList}>
        {categories.map((category, categoryIndex) => {
          const isActive = hoveredKey === category.key
          const isPositive = category.delta >= 0

          return (
            <div
              className={`${styles.barRow} ${isActive ? styles.barRowActive : ''}`}
              key={category.key}
              onMouseEnter={() => setHoveredKey(category.key)}
              onMouseLeave={() => setHoveredKey((prev) => (prev === category.key ? null : prev))}
            >
              <span className={styles.barLabelRow}>
                <span className={styles.barLabel}>{category.title}</span>
                <span className={`${styles.delta} ${isPositive ? styles.deltaUp : styles.deltaDown}`}>
                  {isPositive ? '+' : ''}
                  {category.delta}%
                </span>
              </span>
              <HorizontalBarChart
                active={isActive}
                animationDelay={200 + categoryIndex * 160}
                segments={[
                  {
                    key: `${category.key}-mips`,
                    label: 'MIPS Products',
                    value: category.mipsProducts,
                    color: productOverviewSegmentColors.mipsProducts,
                    textColor: '#101828',
                  },
                  {
                    key: `${category.key}-other`,
                    label: 'Non-MIPS Products',
                    value: category.other,
                    color: productOverviewSegmentColors.other,
                    textColor: '#101828',
                  },
                ]}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}