import type { EventTimelineEntry } from '../../../types/eventTimeline';
import { InfoIcon } from '../../common/Icons';
import styles from './EventTimelineCard.module.scss';

interface EventTimelineCardProps {
  entries?: EventTimelineEntry[];
  isLoading?: boolean;
}

interface TimelineRowProps {
  entry: EventTimelineEntry;
  isLast: boolean;
}

function TimelineRow({ entry, isLast }: TimelineRowProps) {
  const isUrgent = Boolean(entry.urgent);

  return (
    <div className={`${styles.row} ${isLast ? styles.rowLast : ''}`}>
      {isUrgent && <div className={styles.highlight} />}

      <div className={`${styles.country} ${isUrgent ? styles.countryUrgent : ''}`}>
        <div className={styles.countryName}>{entry.country}</div>
        <div className={styles.time}>{entry.timeAgo}</div>
      </div>

      <div className={styles.markerCol}>
        <div className={`${styles.dot} ${isUrgent ? styles.dotUrgent : ''}`} />
      </div>

      <div className={styles.detail}>
        <div className={styles.eventLabel}>{entry.eventLabel}</div>
        <div className={`${styles.statusLabel} ${isUrgent ? styles.statusUrgent : styles.statusSafe}`}>
          {entry.statusLabel}
        </div>
      </div>
    </div>
  );
}

export default function EventTimelineCard({ entries = [], isLoading = false }: EventTimelineCardProps) {
  return (
    <div className={styles.card}>
       <header className={styles.header}>
        <h2 className={styles.title}>
          Event Timeline
          <button type="button" className={styles.infoBtn} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>
      </header>

      <div className={styles.timeline}>
        <div className={styles.line} />
        {isLoading ? (
          <div className={styles.emptyState}>Loading latest events…</div>
        ) : entries.length === 0 ? (
          <div className={styles.emptyState}>No recent events available</div>
        ) : (
          entries.map((entry, index) => (
            <TimelineRow key={entry.id} entry={entry} isLast={index === entries.length - 1} />
          ))
        )}
      </div>
    </div>
  );
}
