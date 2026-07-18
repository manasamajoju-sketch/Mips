import EventSeverityHistogramChart from '../../charts/EventSeverityBarChart/EventSeverityHistogramChart';
import {
  SEVERITY_BUCKET_COLORS,
  SEVERITY_BUCKET_LABELS,
  eventSeverityHistogramBars,
  eventSeverityHistogramSummary,
} from '../../../Constants/eventSeverityHistogramData';
import type {
  EventSeverityHistogramSummary,
  SeverityHistogramBar,
} from '../../../types/eventSeverityHistogram';
import styles from './EventSeverityHistogramCard.module.scss';

interface EventSeverityHistogramCardProps {
  bars?: SeverityHistogramBar[];
  summary?: EventSeverityHistogramSummary;
  isLoading?: boolean;
}

function InfoIcon() {
  return (
    <svg
      className={styles.infoIcon}
      viewBox="0 0 24 24"
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

export default function EventSeverityHistogramCard({
  bars = eventSeverityHistogramBars,
  summary = eventSeverityHistogramSummary,
  isLoading = false,
}: EventSeverityHistogramCardProps) {
  const placeholderBars: SeverityHistogramBar[] = [
    { id: 'low',    bucket: 'low',    value: 18 },
    { id: 'medium', bucket: 'medium', value: 12 },
    { id: 'high',   bucket: 'high',   value: 9  },
  ];

  const displayBars    = isLoading ? placeholderBars : bars;
  const displaySummary = isLoading
    ? { count: 0, labelLine1: 'Loading', labelLine2: '...' }
    : summary;

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Event Severity
          <button type="button" className={styles.infoBtn} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>
      </header>

      <div className={styles.total}>
        <span className={styles.totalValue}>{displaySummary.count}</span>
        <span className={styles.totalLabel}>
          {displaySummary.labelLine1}
          <br />
          {displaySummary.labelLine2}
        </span>
      </div>

      <div className={styles.legend}>
        {SEVERITY_BUCKET_LABELS.map(({ key, label, rangeLabel }) => (
          <span className={styles.legendItem} key={key}>
            <span className={styles.legendDot} style={{ background: SEVERITY_BUCKET_COLORS[key] }} />
            <span className={styles.legendText}>
              {label}
              <br />
              <span className={styles.legendRange}>{rangeLabel}</span>
            </span>
          </span>
        ))}
      </div>

      {/* chartWrap fills all remaining height — canvas inside is 100%×100% */}
      <div className={styles.chartWrap}>
        <EventSeverityHistogramChart bars={displayBars} />
      </div>
    </div>
  );
}