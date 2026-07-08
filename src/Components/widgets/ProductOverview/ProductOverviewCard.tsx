import { InfoIcon } from '../../common/Icons'
import HorizontalBarChart from '../../charts/HorizontalBarChart/HorizontalBarChart'
import {
  productOverviewCategories,
  productOverviewSegmentColors,
  productOverviewTotal,
} from '../../../Constants/productOverviewMock'
import styles from './ProductOverviewCard.module.scss'

export default function ProductOverviewCard() {
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
        <span className={styles.totalValue}>{productOverviewTotal}</span>
        <span className={styles.totalLabel}>
          <span>Total</span>
          <span>Products</span>
        </span>
      </div>

      <div className={styles.barList}>
        {productOverviewCategories.map((category) => (
          <div className={styles.barRow} key={category.key}>
            <span className={styles.barLabel}>{category.title}</span>
            <HorizontalBarChart
              segments={[
                { key: `${category.key}-mips`, label: 'MIPS Products', value: category.mipsProducts, color: productOverviewSegmentColors.mipsProducts },
                { key: `${category.key}-other`, label: 'Other', value: category.other, color: productOverviewSegmentColors.other },
              ]}
            />
          </div>
        ))}
      </div>
    </section>
  )
}