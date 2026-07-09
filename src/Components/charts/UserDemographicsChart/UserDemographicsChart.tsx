import { useState } from 'react';
import type { DemographicCategory } from '../../../types/userDemographics';
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

function CategoryColumn({ category, isHovered, onHoverStart, onHoverEnd }: CategoryColumnProps) {
  const range = DEMOGRAPHICS_SCALE_MAX - DEMOGRAPHICS_SCALE_MIN;
  const bottomPct = ((category.min - DEMOGRAPHICS_SCALE_MIN) / range) * 100;
  const topPct = ((category.max - DEMOGRAPHICS_SCALE_MIN) / range) * 100;
  const whiskerHeightPct = topPct - bottomPct;

  return (
    <div className={styles.col} onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
      <div className={styles.whisker} style={{ bottom: `${bottomPct}%`, height: `${whiskerHeightPct}%` }} />
      <div className={styles.diamond} style={{ bottom: `calc(${bottomPct}% - 4px)` }} />
      <div className={styles.diamond} style={{ bottom: `calc(${topPct}% - 4px)` }} />

      {category.segments.map((segment, index) => {
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