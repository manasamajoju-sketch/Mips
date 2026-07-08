import type { DemographicCategory } from '../../types/userDemographics';
import {
  DEMOGRAPHICS_SCALE_MAX,
  DEMOGRAPHICS_SCALE_MIN,
  GENDER_COLORS,
} from '../../constants/userDemographicsData';
import styles from './UserDemographicsChart.module.scss';

const CHART_HEIGHT = 300;

interface UserDemographicsChartProps {
  categories: DemographicCategory[];
}

interface CategoryColumnProps {
  category: DemographicCategory;
  pixelsPerUnit: number;
}

function CategoryColumn({ category, pixelsPerUnit }: CategoryColumnProps) {
  const bottomPx = (category.min - DEMOGRAPHICS_SCALE_MIN) * pixelsPerUnit;
  const topPx = (category.max - DEMOGRAPHICS_SCALE_MIN) * pixelsPerUnit;
  const whiskerHeight = topPx - bottomPx;

  return (
    <div className={styles.col}>
      <div className={styles.whisker} style={{ bottom: `${bottomPx}px`, height: `${whiskerHeight}px` }} />
      <div className={styles.diamond} style={{ bottom: `${bottomPx - 4}px` }} />
      <div className={styles.diamond} style={{ bottom: `${topPx - 4}px` }} />

      {category.segments.map((segment, index) => {
        const segBottom = bottomPx + segment.start * whiskerHeight;
        const segHeight = (segment.end - segment.start) * whiskerHeight;

        return (
          <div
            key={`${category.id}-${segment.key}-${index}`}
            className={styles.segment}
            style={{
              bottom: `${segBottom}px`,
              height: `${segHeight}px`,
              background: GENDER_COLORS[segment.key],
            }}
          >
            {segment.percentLabel && <span className={styles.percentLabel}>{segment.percentLabel}</span>}
          </div>
        );
      })}

      {category.highlight && (
        <i
          className={`ti ti-pointer-filled ${styles.cursor}`}
          style={{ bottom: `${bottomPx - 14}px` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default function UserDemographicsChart({ categories }: UserDemographicsChartProps) {
  const pixelsPerUnit = CHART_HEIGHT / (DEMOGRAPHICS_SCALE_MAX - DEMOGRAPHICS_SCALE_MIN);

  return (
    <div className={styles.chart}>
      <div className={styles.body} style={{ height: `${CHART_HEIGHT}px` }}>
        <div className={styles.yAxis}>
          <span>{DEMOGRAPHICS_SCALE_MAX}</span>
          <span>30</span>
          <span>{DEMOGRAPHICS_SCALE_MIN}</span>
        </div>
        <div className={styles.plot}>
          {categories.map((category) => (
            <CategoryColumn key={category.id} category={category} pixelsPerUnit={pixelsPerUnit} />
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
