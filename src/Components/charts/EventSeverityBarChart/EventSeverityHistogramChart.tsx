import {
  HISTOGRAM_MAX_VALUE,
  HISTOGRAM_X_AXIS_TICKS,
  SEVERITY_BUCKET_COLORS,
} from '../../../Constants/eventSeverityHistogramData'
import type { SeverityHistogramBar } from '../../../types/eventSeverityHistogram'
import styles from './EventSeverityHistogramChart.module.scss'

interface EventSeverityHistogramChartProps {
  bars: SeverityHistogramBar[]
}

const Y_TICKS = [HISTOGRAM_MAX_VALUE, HISTOGRAM_MAX_VALUE / 2, 0]

export default function EventSeverityHistogramChart({ bars }: EventSeverityHistogramChartProps) {
  const yMax = Math.max(
    HISTOGRAM_MAX_VALUE,
    ...bars.map((bar) => bar.value),
    1,
  )

  return (
    <div className={styles.chart} role="img" aria-label="Event severity histogram">
      <div className={styles.plotGrid}>
        <div className={styles.yAxis}>
          {Y_TICKS.map((tick) => (
            <span
              key={tick}
              className={styles.yTick}
              style={{ bottom: `${(tick / yMax) * 100}%` }}
            >
              {String(Math.round(tick)).padStart(2, '0')}
            </span>
          ))}
        </div>

        <div className={styles.plotColumn}>
          <div className={styles.plotArea}>
            <div className={styles.bars}>
              {bars.map((bar) => {
                const heightPct =
                  bar.value > 0 ? Math.max((bar.value / yMax) * 100, 2) : 0
                return (
                  <div key={bar.id} className={styles.barSlot}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: SEVERITY_BUCKET_COLORS[bar.bucket],
                      }}
                      title={`${bar.bucket}: ${bar.value}`}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.xAxis}>
            {HISTOGRAM_X_AXIS_TICKS.map((label) => (
              <span key={label} className={styles.xTick}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
