import EventSeverityBar from '../../charts/EventSeverityBarChart/EventSeverityBar';
import {
  SEVERITY_AXIS_TICKS,
  SEVERITY_COLORS,
  SEVERITY_LABELS,
} from '../../../Constants/eventSeverityData';
import type { EventSeveritySummary, SeverityMetric } from '../../../types/eventSeverity';
import styles from './EventSeverityCard.module.scss';

interface EventSeverityCardProps {
  metrics?: SeverityMetric[];
  summary?: EventSeveritySummary;
}

function InfoIcon() {
  return (
    <svg
      className={styles.infoIcon}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.2" />
      <line x1="12" y1="10.75" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function EventSeverityCard({
  metrics = [],
  summary = {
    count: 0,
    labelLine1: 'High Severity Events',
    labelLine2: '',
  },
}: EventSeverityCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>Event Severity</span>
        <InfoIcon />
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryValue}>{summary.count}</span>
        <span className={styles.summaryLabel}>
          {summary.labelLine1}
          <br />
          {summary.labelLine2}
        </span>
      </div>

      <div className={styles.legend}>
        {SEVERITY_LABELS.map(({ key, label }) => (
          <span className={styles.legendItem} key={key}>
            <span className={styles.legendDot} style={{ backgroundColor: SEVERITY_COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>

      {metrics.map((metric) => (
        <EventSeverityBar key={metric.id} metric={metric} />
      ))}

      <div className={styles.axis}>
        {SEVERITY_AXIS_TICKS.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
}
