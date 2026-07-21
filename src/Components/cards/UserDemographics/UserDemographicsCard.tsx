import UserDemographicsChart from '../../charts/UserDemographicsChart/UserDemographicsChart'
import {
  GENDER_COLORS,
  GENDER_LABELS,
} from '../../../Constants/userDemographicsData'
import {
  computeNearMedianAgeSummary,
  type DemographicCategory,
} from '../../../types/userDemographics'
import styles from './UserDemographicsCard.module.scss'
import { InfoIcon } from '../../common/Icons'

interface UserDemographicsCardProps {
  categories?: DemographicCategory[]
  onExpand?: () => void
  isLoading?: boolean
}

export default function UserDemographicsCard({
  categories = [],
  onExpand,
  isLoading = false,
}: UserDemographicsCardProps) {
  const displayedSummary = isLoading
    ? { medianAgeValue: '--', medianAgeLabel: 'Near Median Age' }
    : computeNearMedianAgeSummary(categories)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          User Demographics
              <button type="button" className={styles.infoBtn} aria-label="More information">
            <InfoIcon />
          </button>
          
        </h2>
        {onExpand && (
          <button
            type="button"
            className={styles.expand}
            onClick={onExpand}
            aria-label="View user demographics details"
          >
            <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryValue}>{displayedSummary.medianAgeValue}</span>
        <span className={styles.summaryLabel}>
          <span>Median Age</span>
        </span>
      </div>

      <div className={styles.legend}>
        {GENDER_LABELS.map(({ key, label }) => (
          <span className={styles.legendItem} key={key}>
            <span className={styles.legendDot} style={{ background: GENDER_COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>

      <UserDemographicsChart categories={categories} />
    </div>
  )
}
