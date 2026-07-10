import type { SeverityHistogramBar } from '../../../types/eventSeverityHistogram';
import {
  HISTOGRAM_MAX_VALUE,
  HISTOGRAM_Y_AXIS_TICKS,
  SEVERITY_BUCKET_COLORS,
} from '../../../Constants/eventSeverityHistogramData';
import styles from './EventSeverityHistogramChart.module.scss';

const CHART_HEIGHT = 120;

interface EventSeverityHistogramChartProps {
  bars: SeverityHistogramBar[];
}

export default function EventSeverityHistogramChart({ bars }: EventSeverityHistogramChartProps) {
  const pixelsPerUnit = CHART_HEIGHT / HISTOGRAM_MAX_VALUE;

  return (
    <div className={styles.chart}>
      <div className={styles.yAxis} style={{ height: `${CHART_HEIGHT}px` }}>
        {HISTOGRAM_Y_AXIS_TICKS.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      <div className={styles.plotWrap}>
        <div className={styles.plot} style={{ height: `${CHART_HEIGHT}px` }}>
          {bars.map((bar) => (
            <div className={styles.col} key={bar.id}>
              <div
                className={styles.bar}
                style={{
                  height: `${bar.value * pixelsPerUnit}px`,
                  background: SEVERITY_BUCKET_COLORS[bar.bucket],
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.axis}>
          {bars.map((bar) => (
            <div className={styles.tick} key={`tick-${bar.id}`}>
              {bar.xAxisLabel || ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}