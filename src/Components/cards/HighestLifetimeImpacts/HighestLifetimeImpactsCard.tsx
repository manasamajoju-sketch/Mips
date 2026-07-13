import type {
  HighestLifetimeImpactsSummary,
  ImpactEventType,
  LifetimeImpactRow,
} from '../../../types/highestLifetimeImpacts';
import {
  IMPACT_EVENT_COLORS,
  IMPACT_EVENT_LABELS,
  IMPACT_EVENT_TEXT_COLORS,
  highestLifetimeImpactRows,
  highestLifetimeImpactsSummary,
} from '../../../Constants/highestLifetimeImpactsData';
import styles from './HighestLifetimeImpactsCard.module.scss';

interface HighestLifetimeImpactsCardProps {
  rows?: LifetimeImpactRow[];
  summary?: HighestLifetimeImpactsSummary;
  onViewDevice?: () => void;
}

function InfoIcon() {
  return (
    <svg className={styles.infoIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <line x1="12" y1="10.75" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <line x1="4" y1="12" x2="19" y2="12" strokeLinecap="round" />
      <polyline points="13,6 19,12 13,18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className={styles.alertIcon} viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 4.5 21 19.5H3L12 4.5Z" strokeLinejoin="round" />
      <line x1="12" y1="10.5" x2="12" y2="14.5" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function HighestLifetimeImpactsCard({
  rows = highestLifetimeImpactRows,
  summary = highestLifetimeImpactsSummary,
  onViewDevice,
}: HighestLifetimeImpactsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Highest Lifetime Impacts</span>
          <InfoIcon />
        </div>
        <div className={styles.quinRow}>
          <span className={styles.quinPill}>{summary.quinId}</span>
          <button type="button" className={styles.viewButton} onClick={onViewDevice} aria-label="View device details">
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{summary.lifetimeImpacts}</span>
          <span className={styles.statLabel}>
            Lifetime
            <br />
            Impacts
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{summary.peakGForce}</span>
          <span className={styles.statLabel}>
            Peak
            <br />
            G Force
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{summary.sinceFirstImpact}</span>
          <span className={styles.statLabel}>
            Since
            <br />
            First Impact
          </span>
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.note}>
          <AlertIcon />
          <span>{summary.averageDaysNote}</span>
        </div>
        <div className={styles.legend}>
          {IMPACT_EVENT_LABELS.map((item: { key: ImpactEventType; label: string }) => (
            <span className={styles.legendItem} key={item.key}>
              <span className={styles.legendDot} style={{ background: IMPACT_EVENT_COLORS[item.key] }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.headRow}>
          <div>
            Peak
            <br />
            G-Force
          </div>
          <div>
            Peak Rot.
            <br />
            Velocity
          </div>
          <div>
            Event
            <br />
            Date
          </div>
          <div>
            Event
            <br />
            type
          </div>
        </div>

        {rows.map((row) => (
          <div className={styles.row} key={row.id}>
            <div>
              {row.peakGForce}
              <span className={styles.unit}> gF</span>
            </div>
            <div>
              {row.peakRotVelocity}
              <span className={styles.unit}> Rad/s</span>
            </div>
            <div>{row.eventDate}</div>
            <div>
              <span
                className={styles.badge}
                style={{
                  background: IMPACT_EVENT_COLORS[row.eventType],
                  color: IMPACT_EVENT_TEXT_COLORS[row.eventType],
                }}
              >
                {IMPACT_EVENT_LABELS.find((item: { key: string; label: string }) => item.key === row.eventType)?.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
