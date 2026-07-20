import { useState } from 'react';
import { type TimelineRange } from '../../common/TimelineButton/TimelineButton';
import styles from './EventTimelineChart.module.scss';

const MAX_TOTAL = 50;
// Hover growth is intentionally compressed and NOT proportional to the
// raw value — a segment of 2 and a segment of 182 both just need enough
// room to show their number legibly, nothing more. sqrt() compresses big
// values so they don't dominate, and everything is clamped to a tight
// pixel band.
const MIN_ACTIVE_SEGMENT_PX = 24;
const MAX_ACTIVE_SEGMENT_PX = 40;
const ACTIVE_SEGMENT_GAP_PX = 3;
// Hard ceiling on how tall the whole hovered bar can get, no matter how
// many segments or how large the values are.
const MAX_ACTIVE_PILL_PX = 220;

export interface TimelineCategory {
  key: string;
  color: string;
  label?: string;
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

// Picks readable text color for a given background. Falls back to the
// default dark text token if the color isn't a parseable hex value (e.g.
// a CSS variable reference), so this never throws on unexpected input.
function getContrastTextClass(color: string): string {
  const hex = color.trim().replace('#', '');
  const isHex3 = /^[0-9a-f]{3}$/i.test(hex);
  const isHex6 = /^[0-9a-f]{6}$/i.test(hex);
  if (!isHex3 && !isHex6) return styles.segmentLabelDark;

  const full = isHex3
    ? hex.split('').map((c) => c + c).join('')
    : hex;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? styles.segmentLabelDark : styles.segmentLabelLight;
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
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function DayColumn({ point, categories, isActive, onHover, onLeave }: DayColumnProps) {
  const categoryValues = categories.map((cat) => ({
    ...cat,
    value: Number(point[cat.key]) || 0,
  }));
  const total = categoryValues.reduce((sum, cat) => sum + cat.value, 0);

  if (total === 0) {
    return <div className={styles.col} />;
  }

  // Baseline (non-hovered) height — proportional to the data, capped so it
  // never crosses into the x-axis.
  const pillHeightPct = Math.min((total / 10) * 100, 100);

  const visibleCategories = categoryValues.filter((cat) => cat.value > 0);

  const activeSegments = visibleCategories.map((cat) => ({
    ...cat,
    heightPx: Math.min(
      Math.max(MIN_ACTIVE_SEGMENT_PX, Math.sqrt(cat.value) * 6),
      MAX_ACTIVE_SEGMENT_PX,
    ),
  }));

  const rawActivePillHeightPx =
    activeSegments.reduce((sum, cat) => sum + cat.heightPx, 0) +
    ACTIVE_SEGMENT_GAP_PX * Math.max(activeSegments.length - 1, 0);

  const scaleFactor = rawActivePillHeightPx > MAX_ACTIVE_PILL_PX
    ? MAX_ACTIVE_PILL_PX / rawActivePillHeightPx
    : 1;

  const finalActiveSegments = activeSegments.map((cat) => ({
    ...cat,
    heightPx: Math.max(cat.heightPx * scaleFactor, 16),
  }));

  const activePillHeightPx = Math.min(rawActivePillHeightPx, MAX_ACTIVE_PILL_PX);

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
        style={
          isActive
            ? { height: `${activePillHeightPx}px` }
            : { height: `${pillHeightPct}%` }
        }
      >
        {isActive
          ? finalActiveSegments.map((cat) => (
              <div
                key={cat.key}
                className={styles.segmentActive}
                style={{ background: cat.color, height: `${cat.heightPx}px` }}
              >
                <span className={`${styles.segmentLabel} ${getContrastTextClass(cat.color)}`}>
                  {cat.value}
                </span>
              </div>
            ))
          : categoryValues.map((cat) => (
              <div
                key={cat.key}
                className={styles.segment}
                style={{
                  background: cat.color,
                  flex: `${Math.max(cat.value, 0.1)} 0 0`,
                }}
              />
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