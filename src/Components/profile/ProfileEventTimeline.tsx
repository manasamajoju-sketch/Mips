import type { ProfileTimelineStep } from '../../types/userProfileTimeline';
import styles from './ProfileEventTimeline.module.scss';

interface ProfileEventTimelineProps {
  steps: ProfileTimelineStep[];
}

export default function ProfileEventTimeline({ steps }: ProfileEventTimelineProps) {
  return (
    <div className={styles.timeline}>
      <div className={styles.line} />
      {steps.map((step) => (
        <div className={styles.step} key={step.id}>
          <span className={styles.label}>
            {step.labelLine1}
            <br />
            {step.labelLine2}
          </span>
          <span className={`${styles.dot} ${step.outline ? styles.dotOutline : ''}`} />
          <span className={styles.datetime}>
            {step.date}
            <br />
            {step.time}
          </span>
        </div>
      ))}
    </div>
  );
}
