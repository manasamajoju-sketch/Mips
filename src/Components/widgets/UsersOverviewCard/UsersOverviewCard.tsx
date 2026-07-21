import GroupedBarChart from '../../charts/GroupedBarChart/GroupedBarChart'
import type { TimelineRange } from '../../common/TimelineButton/TimelineButton'
import styles from './UsersOverviewCard.module.scss'

interface UsersOverviewPoint {
  category: string
  mipsUsers: number
  nonMipsUsers: number
}

interface UsersOverviewCardProps {
  totalUsers?: number
  productUsers?: number
  totalUsersDeltaPct?: number
  productUsersDeltaPct?: number
  note?: string
  range?: TimelineRange
  data?: UsersOverviewPoint[]
}

const series = [
  { key: 'mipsUsers' as const, label: 'Mips Users', color: '#F8E71C', textColor: '#101828' },
  { key: 'nonMipsUsers' as const, label: 'Non-Mips Users', color: '#2AC9E1', textColor: '#101828' },
]

export default function UsersOverviewCard({
  totalUsers = 0,
  productUsers = 0,
  totalUsersDeltaPct = 0,
  productUsersDeltaPct = 0,
  note = '',
  range = '30d',
  data = [],
}: UsersOverviewCardProps) {
  const deltaLabel = `L${range.toUpperCase()}`
  const isUsersNegative = totalUsersDeltaPct < 0
  const isProductPositive = productUsersDeltaPct > 0

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Users Overview</span>
          <i className="ti ti-info-circle" aria-hidden="true" />
        </div>
        <button type="button" className={styles.expand} aria-label="View users overview details">
          <i className="ti ti-arrow-right" aria-hidden="true" />
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBlock}>
          <div className={styles.statRow}>
            <span className={styles.statValue}>{totalUsers.toLocaleString()}</span>
            <div className={styles.statMeta}>
              <span className={`${styles.delta} ${isUsersNegative ? styles.deltaDown : styles.deltaUp}`}>
                {totalUsersDeltaPct > 0 ? '+' : ''}
                {totalUsersDeltaPct}% <span className={styles.deltaLabel}>{deltaLabel}</span>
              </span>
              <span className={styles.statLabel}>Users</span>
            </div>
          </div>
          <span className={styles.statUnderline} />
        </div>

        <div className={`${styles.statBlock} ${styles.statRight}`}>
          <div className={`${styles.statRow} ${styles.statRowRight}`}>
            <span className={styles.statValue}>{productUsers.toLocaleString()}</span>
            <div className={styles.statMeta}>
              <span className={`${styles.delta} ${isProductPositive ? styles.deltaUp : styles.deltaDown}`}>
                {productUsersDeltaPct > 0 ? '+' : ''}
                {productUsersDeltaPct}% <span className={styles.deltaLabel}>{deltaLabel}</span>
              </span>
              <span className={styles.statLabel}>MIPS Product Users</span>
            </div>
          </div>
          <span className={styles.statUnderline} />
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.note}>
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          <span>{note}</span>
        </div>
        <div className={styles.legend}>
          {series.map((item) => (
            <span className={styles.legendItem} key={item.key}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <GroupedBarChart data={data} series={series} showKey={false} />
      </div>
    </div>
  )
}
