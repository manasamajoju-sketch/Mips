import { useState } from 'react';
import ImpactDistributionBar from '../../charts/ImpactDistributionBar/ImpactDistributionBar';
import DeviceAgeTrendChart from '../../charts/DeviceAgeTrendChart/DeviceAgeTrendChart';
import {
  IMPACT_BUCKET_COLORS,
  IMPACT_BUCKET_LABELS,
  defaultUserEventAnalytics,
  productOptions,
  userEventAnalyticsByProduct,
} from '../../../Constants/userEventAnalyticsData';
import type { SeverityFilter, UserEventAnalyticsData } from '../../../types/userEventAnalytics';
import styles from './UsersAnalyticsCard.module.scss';

interface UserEventAnalyticsCardProps {
  data?: UserEventAnalyticsData;
  products?: string[];
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <line x1="12" y1="10.75" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  const points = direction === 'left' ? '14,5 8,12 14,19' : '10,5 16,12 10,19';
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <polyline points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function UserEventAnalyticsCard({
  data,
  products = productOptions,
}: UserEventAnalyticsCardProps) {
  const [productIndex, setProductIndex] = useState(
    Math.max(products.indexOf(defaultUserEventAnalytics.productName), 0),
  );
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('high');

  const currentProduct = products[productIndex];
  const analytics =
    data ?? userEventAnalyticsByProduct[currentProduct] ?? defaultUserEventAnalytics;

  const goToProduct = (offset: number) => {
    setProductIndex((index) => (index + offset + products.length) % products.length);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>User Event Analytics</span>
          <InfoIcon />
        </div>
        <div className={styles.productSelector}>
          <button type="button" onClick={() => goToProduct(-1)} aria-label="Previous product">
            <ChevronIcon direction="left" />
          </button>
          <span>{analytics.productName}</span>
          <button type="button" onClick={() => goToProduct(1)} aria-label="Next product">
            <ChevronIcon direction="right" />
          </button>
        </div>
        <div className={styles.headerSpacer} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        <div className={styles.column}>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{analytics.lifetimeStats.medianEvents}</span>
              <span className={styles.statLabel}>
                Median
                <br />
                Product Lifetime
                <br />
                Events
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{analytics.lifetimeStats.maximumEvents}</span>
              <span className={styles.statLabel}>
                Maximum
                <br />
                Product Lifetime
                <br />
                Events
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.legend}>
            {IMPACT_BUCKET_LABELS.map(({ key, label }) => (
              <span className={styles.legendItem} key={key}>
                <span className={styles.legendDot} style={{ background: IMPACT_BUCKET_COLORS[key] }} />
                {label}
              </span>
            ))}
          </div>

          <ImpactDistributionBar segments={analytics.impactDistribution} />
        </div>

        <div className={styles.verticalDivider} />

        <div className={styles.column}>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{analytics.deviceAgeStats.medianAgeLabel}</span>
              <span className={styles.statLabel}>
                Median
                <br />
                Device Age
                <br />
                at Impact
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{analytics.deviceAgeStats.maximumAgeLabel}</span>
              <span className={styles.statLabel}>
                Maximum
                <br />
                Device Age
                <br />
                at Impact
              </span>
            </div>
          </div>

          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleButton} ${severityFilter === 'high' ? styles.toggleActive : ''}`}
              onClick={() => setSeverityFilter('high')}
            >
              High Severity Impacts
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${severityFilter === 'all' ? styles.toggleActive : ''}`}
              onClick={() => setSeverityFilter('all')}
            >
              All Impacts
            </button>
          </div>

          <DeviceAgeTrendChart points={analytics.trendPoints} />
        </div>
      </div>
    </div>
  );
}
