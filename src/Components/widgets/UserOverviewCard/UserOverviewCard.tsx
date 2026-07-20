import { InfoIcon, ArrowRightIcon } from '../../common/Icons'
import GroupedBarChart from '../../charts/GroupedBarChart/GroupedBarChart'
import { userOverviewData, userOverviewStacks, userOverviewTotal } from '../../../Constants/userOverviewMock'
import type { UserOverviewCategory } from '../../../types/userOverview'
import styles from './UserOverviewCard.module.scss'

interface UserOverviewCardProps {
  onExpand?: () => void
  data?: UserOverviewCategory[]
  total?: number
  isLoading?: boolean
}

export default function UserOverviewCard({ onExpand, data = userOverviewData, total = userOverviewTotal, isLoading = false }: UserOverviewCardProps) {
  const placeholderData: UserOverviewCategory[] = [
    { category: 'Cycling', mipsUsers: 16, total: 24, usersWithEvents: 8 },
    { category: 'Moto', mipsUsers: 14, total: 21, usersWithEvents: 6 },
    { category: 'PPE', mipsUsers: 12, total: 18, usersWithEvents: 5 },
     { category: 'others', mipsUsers: 12, total: 18, usersWithEvents: 5 },
  ]
  const chartData = isLoading ? placeholderData : data
  const displayTotal = isLoading ? '--' : total

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          User Overview
          <button type="button" className={styles.infoBtn} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>

        <button type="button" className={styles.expandBtn} onClick={onExpand} aria-label="View all users">
          <ArrowRightIcon />
        </button>
      </header>

      <div className={styles.summaryRow}>
        <div className={styles.total}>
          <span className={styles.totalValue}>{displayTotal}</span>
          <span className={styles.totalLabel}>Users</span>
        </div>
      </div>

      <GroupedBarChart
        data={chartData}
        series={userOverviewStacks}
        showGridLines={false}
        showBottomAxisLine={false}
        formatYTick={(value) => String(Math.round(value)).padStart(2, '0')}
      />
    </section>
  )
}