import { useState } from 'react';
import type { EventCategoryKey, EventTimelineDay } from '../../../types/event';
import { EVENT_CATEGORY_COLORS } from '../../../Constants/eventOverviewData';
import styles from './EventTimelineChart.module.scss';

const CATEGORY_KEYS: EventCategoryKey[] = ['sos', 'active', 'passive', 'others'];
const MAX_TOTAL = 50;
const MAX_PILL_HEIGHT = 180;

interface EventTimelineChartProps {
  data: EventTimelineDay[];
  initialHighlightIndex?: number;
}

interface DayColumnProps {
  day: EventTimelineDay;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function DayColumn({ day, isActive, onHover, onLeave }: DayColumnProps) {
  const total = CATEGORY_KEYS.reduce((sum, key) => sum + (day[key] || 0), 0);

  if (total === 0) {
    return <div className={styles.col} />;
  }

  const pillHeight = Math.min((total / MAX_TOTAL) * MAX_PILL_HEIGHT, MAX_PILL_HEIGHT);

  return (
    <div className={styles.col} onMouseEnter={onHover} onMouseLeave={onLeave}>
      {isActive && (
        <div className={styles.tooltip}>
          {CATEGORY_KEYS.map((key) => (
            <span key={key} className={styles.badge} style={{ background: EVENT_CATEGORY_COLORS[key] }}>
              {day[key]}
            </span>
          ))}
        </div>
      )}
      <div
        className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
        style={{ height: `${pillHeight}px` }}
      >
        {CATEGORY_KEYS.map((key) => (
          <div
            key={key}
            className={styles.segment}
            style={{ background: EVENT_CATEGORY_COLORS[key], flex: `${Math.max(day[key], 0.3)} 0 0` }}
          />
        ))}
      </div>
      {isActive && <i className={`ti ti-pointer-filled ${styles.cursor}`} aria-hidden="true" />}
    </div>
  );
}

export default function EventTimelineChart({ data, initialHighlightIndex }: EventTimelineChartProps) {
  const defaultIndex = initialHighlightIndex ?? data.findIndex((d) => d.highlight);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(defaultIndex >= 0 ? defaultIndex : null);

  return (
    <div className={styles.chart}>
      <div className={styles.body}>
        <div className={styles.yAxis}>
          <span>50</span>
          <span>25</span>
          <span>00</span>
        </div>
        <div className={styles.plot}>
          {data.map((day, index) => (
            <DayColumn
              key={`${day.month}-${day.date}-${index}`}
              day={day}
              isActive={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(defaultIndex >= 0 ? defaultIndex : null)}
            />
          ))}
        </div>
      </div>
      <div className={styles.xAxis}>
        <div className={styles.yAxisSpacer} />
        <div className={styles.plot}>
          {data.map((day, index) => (
            <div className={styles.tick} key={`tick-${index}`}>
              {day.date}
              {day.month && <div className={styles.tickMonth}>{day.month}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
