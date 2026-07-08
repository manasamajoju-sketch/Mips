import type { SeverityMetric } from '../../../types/eventSeverity';
import { SEVERITY_COLORS, SEVERITY_TEXT_COLORS } from '../../../Constants/eventSeverityData';
import styles from './EventSeverityBar.module.scss';

interface EventSeverityBarProps {
  metric: SeverityMetric;
}

export default function EventSeverityBar({ metric }: EventSeverityBarProps) {
  const total = metric.segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div className={styles.block}>
      <div className={styles.label}>{metric.label}</div>
      <div className={styles.bar}>
        {metric.segments.map((segment) => {
          const widthPct = total > 0 ? (segment.value / total) * 100 : 0;

          return (
            <div
              key={segment.key}
              className={styles.segment}
              style={{
                width: `${widthPct}%`,
                backgroundColor: SEVERITY_COLORS[segment.key],
              }}
            >
              <span className={styles.segmentLabel} style={{ color: SEVERITY_TEXT_COLORS[segment.key] }}>
                {segment.value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
