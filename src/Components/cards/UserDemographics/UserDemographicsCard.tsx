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
  isLoading?: boolean;
}

export default function UserDemographicsCard({
  categories = userDemographicsCategories,
  summary = userDemographicsSummary,
  onExpand,
  isLoading = false,
}: UserDemographicsCardProps) {
  const placeholderCategories: DemographicCategory[] = [
    {
      id: 'cycling',
      label: 'Cycling',
      min: 20,
      max: 60,
      segments: [
        { key: 'female', start: 0, end: 0.3, percentLabel: '30%' },
        { key: 'male', start: 0.3, end: 0.65, percentLabel: '35%' },
        { key: 'others', start: 0.65, end: 1, percentLabel: '35%' },
      ],
      emphasizeLabel: false,
    },
    {
      id: 'moto',
      label: 'Moto',
      min: 25,
      max: 70,
      segments: [
        { key: 'female', start: 0, end: 0.4, percentLabel: '40%' },
        { key: 'male', start: 0.4, end: 0.75, percentLabel: '35%' },
        { key: 'others', start: 0.75, end: 1, percentLabel: '25%' },
      ],
      emphasizeLabel: false,
    },
  ];

  const displayedCategories = isLoading ? placeholderCategories : categories;
  const displayedSummary = isLoading ? { medianAgeValue: '--', medianAgeLabel: 'Loading age' } : summary;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>User Demographics</span>
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
        <span className={styles.summaryValue}>{displayedSummary.medianAgeValue}</span>
        <span className={styles.summaryLabel}>{displayedSummary.medianAgeLabel}</span>
      </div>

      <div className={styles.legend}>
        {GENDER_LABELS.map(({ key, label }) => (
          <span className={styles.legendItem} key={key}>
            <span className={styles.legendDot} style={{ background: GENDER_COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>

      <UserDemographicsChart categories={displayedCategories} />
    </div>
  );
}
