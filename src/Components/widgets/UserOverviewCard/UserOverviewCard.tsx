import { InfoIcon, ArrowRightIcon } from '../../common/Icons'
import GroupedBarChart from '../../charts/GroupedBarChart/GroupedBarChart'
import { userOverviewStacks } from '../../../Constants/userOverviewMock'
import type { UserOverviewCategory } from '../../../types/userOverview'
import styles from './UserOverviewCard.module.scss'

interface UserOverviewCardProps {
  onExpand?: () => void
  data?: UserOverviewCategory[]
  total?: number
  isLoading?: boolean
}

export default function UserOverviewCard({
  onExpand,
  data = [],
  total = 0,
  isLoading = false,
}: UserOverviewCardProps) {
  const chartData = data
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

      <div className={styles.legend}>
        {userOverviewStacks.map((stack) => (
          <span className={styles.legendItem} key={stack.key}>
            <span className={styles.legendDot} style={{ background: stack.color }} />
            <span className={styles.legendText}>
              {stack.label.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </span>
        ))}
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
