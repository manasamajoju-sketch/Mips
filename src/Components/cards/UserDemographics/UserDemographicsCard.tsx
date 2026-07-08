import UserDemographicsChart from '../../charts/UserDemographicsChart/UserDemographicsChart';
import {
  GENDER_COLORS,
  GENDER_LABELS,
  userDemographicsCategories,
  userDemographicsSummary,
} from '../../../Constants/userDemographicsData';
import type { DemographicCategory, UserDemographicsSummary } from '../../../types/userDemographics';
import styles from './UserDemographicsCard.module.scss';

interface UserDemographicsCardProps {
  categories?: DemographicCategory[];
  summary?: UserDemographicsSummary;
  onExpand?: () => void;
}

export default function UserDemographicsCard({
  categories = userDemographicsCategories,
  summary = userDemographicsSummary,
  onExpand,
}: UserDemographicsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>User demographics</span>
          <i className="ti ti-info-circle" aria-hidden="true" />
        </div>
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
        <span className={styles.summaryValue}>{summary.medianAgeValue}</span>
        <span className={styles.summaryLabel}>{summary.medianAgeLabel}</span>
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
  );
}
