import EventTimelineChart from '../charts/EventTimelineChart/EventTimelineChart';
import {
  EVENT_CATEGORY_COLORS,
  EVENT_CATEGORY_LABELS,
  eventOverviewSummary,
  eventTimelineData,
} from '../../Constants/eventOverviewData';
import type { EventOverviewSummary, EventTimelineDay } from '../../types/event';
import styles from './EventOverviewCard.module.scss';

interface EventOverviewCardProps {
  data?: EventTimelineDay[];
  summary?: EventOverviewSummary;
  onExpand?: () => void;
}

export default function EventOverviewCard({
  data = eventTimelineData,
  summary = eventOverviewSummary,
  onExpand,
}: EventOverviewCardProps) {
  const isEventsDown = summary.totalEventsDeltaPct < 0;
  const isSeverityUp = summary.highSeverityDeltaPct > 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Event overview</span>
          <i className="ti ti-info-circle" aria-hidden="true" />
        </div>
        <button
          type="button"
          className={styles.expand}
          onClick={onExpand}
          aria-label="View event overview details"
        >
          <i className="ti ti-arrow-right" aria-hidden="true" />
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statRow}>
            <span className={styles.statValue}>{summary.totalEvents.toLocaleString()}</span>
            <span className={`${styles.delta} ${isEventsDown ? styles.deltaDown : styles.deltaUp}`}>
              {summary.totalEventsDeltaPct > 0 ? '+' : ''}
              {summary.totalEventsDeltaPct}% <span className={styles.deltaLabel}>L30D</span>
            </span>
          </div>
          <div className={styles.statLabel}>Events</div>
        </div>

        <div className={`${styles.stat} ${styles.statRight}`}>
          <div className={`${styles.statRow} ${styles.statRowRight}`}>
            <span className={`${styles.delta} ${isSeverityUp ? styles.deltaUp : styles.deltaDown}`}>
              {summary.highSeverityDeltaPct > 0 ? '+' : ''}
              {summary.highSeverityDeltaPct}% <span className={styles.deltaLabel}>L30D</span>
            </span>
            <span className={styles.statValue}>{summary.highSeverityEvents}</span>
          </div>
          <div className={styles.statLabel}>High severity events, HIC</div>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${(summary.progress || 0) * 100}%` }} />
      </div>

      <div className={styles.meta}>
        <div className={styles.note}>
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          <span>{summary.highlightNote}</span>
        </div>
        <div className={styles.legend}>
          {EVENT_CATEGORY_LABELS.map(({ key, label }) => (
            <span className={styles.legendItem} key={key}>
              <span className={styles.legendDot} style={{ background: EVENT_CATEGORY_COLORS[key] }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <EventTimelineChart data={data} />
    </div>
  );
}
