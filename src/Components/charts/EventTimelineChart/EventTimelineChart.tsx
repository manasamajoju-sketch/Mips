import { useState } from 'react';
import { type TimelineRange } from '../../common/TimelineButton/TimelineButton';
import styles from './EventTimelineChart.module.scss';

const MAX_TOTAL = 50;
const MAX_PILL_HEIGHT = 120;

export interface TimelineCategory {
  key: string;
  color: string;
}

export interface TimelinePoint {
  date: string;
  month: string;
  highlight?: boolean;
  [categoryKey: string]: string | number | boolean | undefined;
}

interface EventTimelineChartProps {
  data: TimelinePoint[];
  categories: TimelineCategory[];
  maxTotal?: number;
  range?: TimelineRange;
}

interface DayColumnProps {
  point: TimelinePoint;
  categories: TimelineCategory[];
  maxTotal: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const MIN_LABEL_HEIGHT = 14;

function DayColumn({ point, categories, maxTotal, isActive, onHover, onLeave }: DayColumnProps) {
  const total = categories.reduce((sum, cat) => sum + (Number(point[cat.key]) || 0), 0);

  if (total === 0) {
    return <div className={styles.col} />;
  }

  const pillHeight = Math.min((total / maxTotal) * MAX_PILL_HEIGHT, MAX_PILL_HEIGHT);

  return (
    <div className={styles.col} onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div
        className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
        style={{ height: `${pillHeight}px` }}
      >
        {categories.map((cat) => {
          const value = Number(point[cat.key]) || 0;
          const segmentHeight = (value / total) * pillHeight;
          const showLabel = isActive && segmentHeight >= MIN_LABEL_HEIGHT;

          return (
            <div
              key={cat.key}
              className={styles.segment}
              style={{ background: cat.color, flex: `${Math.max(value, 0.3)} 0 0` }}
            >
              {showLabel && <span className={styles.segmentLabel}>{value}</span>}
            </div>
          );
        })}
      </div>
      {isActive && <i className={`ti ti-pointer-filled ${styles.cursor}`} aria-hidden="true" />}
    </div>
  );
}

export default function EventTimelineChart({ data, categories, maxTotal = MAX_TOTAL, range = '30d' }: EventTimelineChartProps) {
  // No default/initial highlight - hoveredIndex is only ever set by a real mouse hover.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMonthlyRange = range === '12m';
  const isNinetyDayRange = range === '90d';

  // Compute a sensible max based on actual data so different ranges (daily/weekly/monthly)
  // scale appropriately and labels fit.
  const resolvedMaxTotal = Math.max(
    maxTotal,
    ...data.map((point) => categories.reduce((sum, cat) => sum + (Number(point[cat.key]) || 0), 0)),
    1,
  );

  // Round y-axis to a friendly step (multiple of 25)
  const yAxisMax = Math.max(1, Math.ceil(resolvedMaxTotal / 25) * 25);
  const yAxisTicks = [yAxisMax, Math.round(yAxisMax / 2), 0].reverse();

  return (
    <div className={styles.chart}>
      <div className={styles.body}>
        <div className={styles.yAxis}>
          {yAxisTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className={styles.plot}>
          {data.map((point, index) => (
            <DayColumn
              key={`${point.month}-${point.date}-${index}`}
              point={point}
              categories={categories}
              maxTotal={resolvedMaxTotal}
              isActive={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>
      <div className={styles.xAxis}>
        <div className={styles.yAxisSpacer} />
        <div className={styles.plot}>
          {data.map((point, index) => (
            <div className={styles.tick} key={`tick-${index}`}>
              {isMonthlyRange ? (
                // For 12m view show a single bold month label
                <span className={styles.tickMonthLabel}>{point.month || point.date}</span>
              ) : isNinetyDayRange ? (
                // For 90d view (weekly buckets) show the week start and end on separate lines
                <>
                  <span className={styles.tickWeekLabel}>{point.date}</span>
                  {point.month && <span className={styles.tickWeekLabel}>{point.month}</span>}
                </>
              ) : (
                <>
                  <span className={styles.tickDateLabel}>{point.date}</span>
                  {point.month && <span className={styles.tickMonth}>{point.month}</span>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}