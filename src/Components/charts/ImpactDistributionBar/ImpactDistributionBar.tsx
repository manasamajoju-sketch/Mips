import type { ImpactDistributionSegment } from '../../../types/userEventAnalytics';
import {
  IMPACT_BUCKET_COLORS,
  IMPACT_BUCKET_TEXT_COLORS,
  IMPACT_DISTRIBUTION_AXIS_TICKS,
} from '../../../Constants/userEventAnalyticsData';
import styles from './ImpactDistributionBar.module.scss';

interface ImpactDistributionBarProps {
  segments: ImpactDistributionSegment[];
}

export default function ImpactDistributionBar({ segments }: ImpactDistributionBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.percent, 0);

  return (
    <div>
      <div className={styles.bar}>
        {segments.map((segment) => {
          const widthPct = total > 0 ? (segment.percent / total) * 100 : 0;

          return (
            <div
              key={segment.key}
              className={styles.segment}
              style={{
                width: `${widthPct}%`,
                background: IMPACT_BUCKET_COLORS[segment.key],
                color: IMPACT_BUCKET_TEXT_COLORS[segment.key],
              }}
            >
              <span className={styles.percent}>{segment.percent}%</span>
              <span className={styles.users}>({segment.userCount} Users)</span>
            </div>
          );
        })}
      </div>
      <div className={styles.axis}>
        {IMPACT_DISTRIBUTION_AXIS_TICKS.map((tick: string) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
}
