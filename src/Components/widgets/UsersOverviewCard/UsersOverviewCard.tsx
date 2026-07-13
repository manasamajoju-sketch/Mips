import GroupedBarChart from '../../charts/GroupedBarChart/GroupedBarChart'
import type { TimelineRange } from '../../common/TimelineButton/TimelineButton'
import styles from './UsersOverviewCard.module.scss'

interface UsersOverviewCardProps {
  totalUsers?: number
  productUsers?: number
  totalUsersDeltaPct?: number
  productUsersDeltaPct?: number
  note?: string
  range?: TimelineRange
}

interface UsersOverviewPoint {
  category: string
  mipsUsers: number
  nonMipsUsers: number
}

const defaultData: UsersOverviewPoint[] = [
  { category: '22', mipsUsers: 24, nonMipsUsers: 10 },
  { category: '23', mipsUsers: 28, nonMipsUsers: 12 },
  { category: '24', mipsUsers: 26, nonMipsUsers: 11 },
  { category: '25', mipsUsers: 32, nonMipsUsers: 12 },
  { category: '26', mipsUsers: 30, nonMipsUsers: 13 },
  { category: '27', mipsUsers: 34, nonMipsUsers: 12 },
  { category: '28', mipsUsers: 36, nonMipsUsers: 13 },
  { category: '29', mipsUsers: 34, nonMipsUsers: 12 },
  { category: '30', mipsUsers: 38, nonMipsUsers: 14 },
  { category: '01', mipsUsers: 24, nonMipsUsers: 10 },
  { category: '02', mipsUsers: 30, nonMipsUsers: 14 },
  { category: '03', mipsUsers: 32, nonMipsUsers: 15 },
  { category: '04', mipsUsers: 28, nonMipsUsers: 14 },
  { category: '05', mipsUsers: 30, nonMipsUsers: 12 },
  { category: '06', mipsUsers: 26, nonMipsUsers: 13 },
  { category: '07', mipsUsers: 36, nonMipsUsers: 12 },
  { category: '08', mipsUsers: 32, nonMipsUsers: 14 },
  { category: '09', mipsUsers: 28, nonMipsUsers: 13 },
  { category: '10', mipsUsers: 34, nonMipsUsers: 14 },
  { category: '11', mipsUsers: 46, nonMipsUsers: 24 },
  { category: '12', mipsUsers: 34, nonMipsUsers: 14 },
  { category: '13', mipsUsers: 36, nonMipsUsers: 16 },
  { category: '14', mipsUsers: 38, nonMipsUsers: 17 },
  { category: '15', mipsUsers: 44, nonMipsUsers: 20 },
  { category: '16', mipsUsers: 56, nonMipsUsers: 24 },
  { category: '17', mipsUsers: 32, nonMipsUsers: 15 },
  { category: '18', mipsUsers: 36, nonMipsUsers: 16 },
  { category: '19', mipsUsers: 34, nonMipsUsers: 15 },
  { category: '20', mipsUsers: 38, nonMipsUsers: 16 },
  { category: '21', mipsUsers: 36, nonMipsUsers: 15 },
  { category: '22', mipsUsers: 34, nonMipsUsers: 15 },
]

const series = [
  { key: 'mipsUsers' as const, label: 'Mips Users', color: '#F8E71C', textColor: '#101828' },
  { key: 'nonMipsUsers' as const, label: 'Non-Mips Users', color: '#2AC9E1', textColor: '#101828' },
]

export default function UsersOverviewCard({
  totalUsers = 4872,
  productUsers = 1232,
  totalUsersDeltaPct = -5,
  productUsersDeltaPct = 5,
  note = 'June 11 had the highest new user registrations this month',
  range = '30d',
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
        <GroupedBarChart data={defaultData} series={series} showKey={false} />
      </div>
    </div>
  )
}
