import { InfoIcon, ArrowRightIcon } from '../../common/Icons'
import GroupedBarChart from '../../charts/GroupedBarChart/GroupedBarChart'
import { userOverviewData, userOverviewStacks, userOverviewTotal } from '../../../Constants/userOverviewMock'
import type { UserOverviewCategory } from '../../../types/userOverview'
import styles from './UserOverviewCard.module.scss'

interface UserOverviewCardProps {
  onExpand?: () => void
  data?: UserOverviewCategory[]
  total?: number
}

export default function UserOverviewCard({ onExpand, data = userOverviewData, total = userOverviewTotal }: UserOverviewCardProps) {
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

      <div className={styles.total}>
        <span className={styles.totalValue}>{total}</span>
        <span className={styles.totalLabel}>Total Users</span>
      </div>

      <GroupedBarChart data={data} series={userOverviewStacks} />
    </section>
  )
}