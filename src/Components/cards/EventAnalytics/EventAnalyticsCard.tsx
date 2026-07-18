import GForceTrendChart from '../../charts/GForceTrendChart/GForceTrendChart';
import ImpactZoneChart from '../../charts/ImpactZoneChart/ImpactZoneChart';
import {
  eventAnalyticsSummary,
  gForceTrendPoints,
  impactZoneSegments,
  impactZoneStats,
} from '../../../Constants/eventAnalyticsData';
import type {
  EventAnalyticsSummary,
  GForceTrendPoint,
  ImpactZoneSegment,
  ImpactZoneStat,
} from '../../../types/individualUserEventAnalytics';
import styles from './EventAnalyticsCard.module.scss';

interface EventAnalyticsCardProps {
  summary?: EventAnalyticsSummary;
  trendPoints?: GForceTrendPoint[];
  zoneSegments?: ImpactZoneSegment[];
  zoneStats?: ImpactZoneStat[];
}

export default function EventAnalyticsCard({
  summary = eventAnalyticsSummary,
  trendPoints = gForceTrendPoints,
  zoneSegments = impactZoneSegments,
  zoneStats = impactZoneStats,
}: EventAnalyticsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>Event Analytics</span>
        <span className={styles.infoIcon} aria-hidden="true">
          i
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.column}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{summary.minGForce}</span>
              <span className={styles.statLabel}>
                Minimum
                <br />
                G-Force
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{summary.maxGForce}</span>
              <span className={styles.statLabel}>
                Maximum
                <br />
                G-Force
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          <GForceTrendChart data={trendPoints} />
        </div>

        <div className={styles.verticalDivider} />

        <div className={styles.zoneColumn}>
          <ImpactZoneChart segments={zoneSegments} centerLabel={summary.centerLabel} />

          <div className={styles.statList}>
            {zoneStats.map((stat) => {
              const [line1, line2] = stat.label.split('\n');
              return (
                <div className={styles.listStat} key={stat.key}>
                  <span className={styles.listStatValue}>{stat.count}</span>
                  <span className={styles.listStatLabel}>
                    {line1}{line2}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
