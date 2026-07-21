import ImpactForceChart from '../../charts/ImpactForceChart/ImpactForceChart';
import {
  IMPACT_AXIS_LABELS,
} from '../../../Constants/impactForceAnalysisData';
import type { ImpactForcePoint, ImpactForceSummary } from '../../../types/impactForceAnalysis';
import styles from './ImpactForceAnalysisCard.module.scss';

interface ImpactForceAnalysisCardProps {
  data?: ImpactForcePoint[];
  summary?: ImpactForceSummary;
}

function InfoIcon() {
  return (
    <svg className={styles.infoIcon} viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <line x1="12" y1="10.75" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
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

export default function ImpactForceAnalysisCard({
  data = [],
  summary = {
    maxGForce: '--',
    maxGForceLabelLine1: 'Max',
    maxGForceLabelLine2: 'G-Force',
    percentileNote: '',
  },
}: ImpactForceAnalysisCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>Impact Force Analysis</span>
        <InfoIcon />
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryValue}>{summary.maxGForce}</span>
        <span className={styles.summaryLabel}>
          {summary.maxGForceLabelLine1}
          <br />
          {summary.maxGForceLabelLine2}
        </span>
      </div>

      <div className={styles.meta}>
        <div className={styles.note}>
          <AlertIcon />
          <span>{summary.percentileNote}</span>
        </div>
        <div className={styles.legend}>
          {IMPACT_AXIS_LABELS.map(({ key, label, color }) => (
            <span className={styles.legendItem} key={key}>
              <span className={styles.legendDot} style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <ImpactForceChart data={data} />
    </div>
  );
}
