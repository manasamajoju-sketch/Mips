import { useState } from 'react';
import { type TimelineRange } from '../../common/TimelineButton/TimelineButton';
import styles from './EventTimelineChart.module.scss';

const MAX_TOTAL = 50;

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

function buildLoadingPoints(categories: TimelineCategory[], count = 14): TimelinePoint[] {
  return Array.from({ length: count }, (_, index) => {
    const point: TimelinePoint = {
      date: String(index + 1),
      month: '',
      highlight: false,
    };

    categories.forEach((category) => {
      point[category.key] = 8 + ((index + categories.indexOf(category)) % 3) * 6;
    });

    return point;
  });
}

interface EventTimelineChartProps {
  data: TimelinePoint[];
  categories: TimelineCategory[];
  maxTotal?: number;
  range?: TimelineRange;
  isLoading?: boolean;
}

interface DayColumnProps {
  point: TimelinePoint;
  categories: TimelineCategory[];
  maxTotal: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function DayColumn({ point, categories, maxTotal, isActive, onHover, onLeave }: DayColumnProps) {
  const categoryValues = categories.map((cat) => ({
    ...cat,
    value: Number(point[cat.key]) || 0,
  }));
  const total = categoryValues.reduce((sum, cat) => sum + cat.value, 0);

  if (total === 0) {
    return <div className={styles.col} />;
  }

  // Height is a fixed percentage of the .plot box and NEVER changes on
  // hover/active. Only the pill's width and the label visibility change.
  // Because height is constant, the pill can never grow into the x-axis,
  // regardless of hover state or container size.
  const pillHeightPct = Math.min((total / maxTotal) * 100, 100);

  return (
    <div
      className={styles.col}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      tabIndex={0}
      aria-label={`${point.date} ${point.month}, ${total} events`}
    >
      <div
        className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
        style={{ height: `${pillHeightPct}%` }}
      >
        {categoryValues.map((cat) => (
          <div
            key={cat.key}
            className={styles.segment}
            style={{
              background: cat.color,
              flex: `${Math.max(cat.value, 0.1)} 0 0`,
            }}
          >
            {isActive && <span className={styles.segmentLabel}>{cat.value}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventTimelineChart({ data, categories, maxTotal = MAX_TOTAL, range = '30d', isLoading = false }: EventTimelineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMonthlyRange = range === '12m';
  const isNinetyDayRange = range === '90d';

  const renderData = isLoading ? buildLoadingPoints(categories) : data;

  const resolvedMaxTotal = Math.max(
    maxTotal,
    ...renderData.map((point) => categories.reduce((sum, cat) => sum + (Number(point[cat.key]) || 0), 0)),
    1,
  );

  const yAxisMax = Math.max(1, Math.ceil(resolvedMaxTotal / 25) * 25);
  const yAxisTicks = [yAxisMax, Math.round(yAxisMax / 2), 0];

  return (
    <div className={styles.chart}>
      <div className={styles.body}>
        <div className={styles.yAxis}>
          {yAxisTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className={styles.plot}>
          {renderData.map((point, index) => (
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
                <span className={styles.tickMonthLabel}>{point.month || point.date}</span>
              ) : isNinetyDayRange ? (
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