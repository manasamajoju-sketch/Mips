import EventTimeHeatmapChart from '../../charts/EventTimeHeatmapChart/EventTimeHeatmapChart';
import {
  DENSITY_COLORS,
  DENSITY_LABELS,
  eventTimeHeatmapSummary,
  heatmapRows,
} from '../../../Constants/eventTimeHeatmapData';
import type { EventTimeHeatmapSummary, HeatmapRow } from '../../../types/eventTimeHeatmap';
import styles from './EventTimeHeatmapCard.module.scss';

interface EventTimeHeatmapCardProps {
  rows?: HeatmapRow[];
  summary?: EventTimeHeatmapSummary;
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

function AlertIcon() {
  return (
    <svg
      className={styles.alertIcon}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M12 4.5 21 19.5H3L12 4.5Z" strokeLinejoin="round" />
      <line x1="12" y1="10.5" x2="12" y2="14.5" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function EventTimeHeatmapCard({
  rows = heatmapRows,
  summary = eventTimeHeatmapSummary,
}: EventTimeHeatmapCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>Event time over day &amp; week</span>
        <InfoIcon />
      </div>

      <div className={styles.topRow}>
        <div className={styles.summary}>
          <span className={styles.summaryValue}>{summary.mostCommonRange}</span>
          <span className={styles.summaryLabel}>
            {summary.rangeLabelLine1}
            <br />
            {summary.rangeLabelLine2}
          </span>
        </div>
        <div className={styles.note}>
          <AlertIcon />
          <span>{summary.highlightNote}</span>
        </div>
      </div>

      <div className={styles.legend}>
        {DENSITY_LABELS.map(({ key, label }) => (
          <span className={styles.legendItem} key={key}>
            <span className={styles.legendDot} style={{ background: DENSITY_COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>

      <EventTimeHeatmapChart rows={rows} />
    </div>
  );
}
