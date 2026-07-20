import { useMemo, useState } from 'react';
import type { DemographicCategory, DemographicSegment } from '../../../types/userDemographics';
import {
  DEMOGRAPHICS_SCALE_MAX,
  DEMOGRAPHICS_SCALE_MIN,
  GENDER_COLORS,
} from '../../../Constants/userDemographicsData';
import styles from './UserDemographicsChart.module.scss';

interface UserDemographicsChartProps {
  categories: DemographicCategory[];
}

interface CategoryColumnProps {
  category: DemographicCategory;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

// Reads the numeric weight for a segment from its percentLabel ("30%" -> 30).
// Falls back to whatever start/end the data already carries if percentLabel
// is missing or unparsable, so nothing breaks for older/partial data.
function segmentWeight(segment: DemographicSegment): number {
  if (segment.percentLabel) {
    const parsed = parseFloat(segment.percentLabel);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return Math.max((segment.end - segment.start) * 100, 0);
}

// Rescales every segment in a category so their weights always sum to
// exactly 100%, and lays them out back-to-back (no gaps, no overlaps).
// This is the actual fix: the visual stack no longer depends on the raw
// start/end values being internally consistent — it's derived and
// guaranteed to fill 0 -> 1 every time.
function normalizeSegments(segments: DemographicSegment[]): Array<DemographicSegment & { start: number; end: number }> {
  const weights = segments.map(segmentWeight);
  const total = weights.reduce((sum, w) => sum + w, 0);

  if (total <= 0) {
    // No usable weights at all — nothing to distribute, render nothing.
    return segments.map((s) => ({ ...s, start: 0, end: 0 }));
  }

  let cursor = 0;
  return segments.map((segment, i) => {
    const start = cursor;
    const end = cursor + weights[i] / total;
    cursor = end;
    return { ...segment, start, end };
  });
}

function CategoryColumn({ category, isHovered, onHoverStart, onHoverEnd }: CategoryColumnProps) {
  const range = DEMOGRAPHICS_SCALE_MAX - DEMOGRAPHICS_SCALE_MIN;
  const bottomPct = ((category.min - DEMOGRAPHICS_SCALE_MIN) / range) * 100;
  const topPct = ((category.max - DEMOGRAPHICS_SCALE_MIN) / range) * 100;
  const whiskerHeightPct = topPct - bottomPct;

  const normalizedSegments = useMemo(() => normalizeSegments(category.segments), [category.segments]);

  return (
    <div className={styles.col} onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
      <div className={styles.whisker} style={{ bottom: `${bottomPct}%`, height: `${whiskerHeightPct}%` }} />
      <div className={styles.diamond} style={{ bottom: `calc(${bottomPct}% - 4px)` }} />
      <div className={styles.diamond} style={{ bottom: `calc(${topPct}% - 4px)` }} />

      {normalizedSegments.map((segment, index) => {
        if (segment.end <= segment.start) return null;

        const segBottomPct = bottomPct + segment.start * whiskerHeightPct;
        const segHeightPct = (segment.end - segment.start) * whiskerHeightPct;

        return (
          <div
            key={`${category.id}-${segment.key}-${index}`}
            className={`${styles.segment} ${isHovered ? styles.segmentActive : ''}`}
            style={{
              bottom: `${segBottomPct}%`,
              height: `${segHeightPct}%`,
              background: GENDER_COLORS[segment.key],
            }}
          >
            {isHovered && segment.percentLabel && (
              <span className={styles.percentLabel}>{segment.percentLabel}</span>
            )}
          </div>
        );
      })}

      {isHovered && (
        <i
          className={`ti ti-pointer-filled ${styles.cursor}`}
          style={{ bottom: `calc(${bottomPct}% - 14px)` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default function UserDemographicsChart({ categories }: UserDemographicsChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={styles.chart}>
      <div className={styles.body}>
        <div className={styles.yAxis}>
          <span>{DEMOGRAPHICS_SCALE_MAX}</span>
          <span>30</span>
          <span>{DEMOGRAPHICS_SCALE_MIN}</span>
        </div>
        <div className={styles.plot}>
          {categories.map((category) => (
            <CategoryColumn
              key={category.id}
              category={category}
              isHovered={hoveredId === category.id}
              onHoverStart={() => setHoveredId(category.id)}
              onHoverEnd={() => setHoveredId((prev) => (prev === category.id ? null : prev))}
            />
          ))}
        </div>
      </div>
      <div className={styles.xAxis}>
        <div className={styles.yAxisSpacer} />
        <div className={styles.plot}>
          {categories.map((category) => (
            <div
              key={`label-${category.id}`}
              className={`${styles.tick} ${category.emphasizeLabel ? styles.tickEmphasis : ''}`}
            >
              {category.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}