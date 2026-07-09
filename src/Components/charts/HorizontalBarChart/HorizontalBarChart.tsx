import type { CSSProperties } from 'react'
import styles from './HorizontalBarChart.module.scss'

export interface HorizontalBarSegment {
  key: string
  label: string
  value: number
  color: string
  /** Text color used for the inline value label drawn on top of this segment when active */
  textColor?: string
}

interface HorizontalBarChartProps {
  segments: HorizontalBarSegment[]
  animate?: boolean
  /** When true, the bar grows taller and reveals each segment's value inline */
  active?: boolean
  valueFormatter?: (value: number) => string
}

const defaultFormatter = (value: number) => value.toLocaleString()

export default function HorizontalBarChart({
  segments,
  animate = true,
  active = false,
  valueFormatter = defaultFormatter,
}: HorizontalBarChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const lastIndex = segments.length - 1

  let cumulativePct = 0

  return (
    <div
      className={`${styles['horizontal-bar-chart']} ${animate ? styles['horizontal-bar-chart--animate'] : ''} ${
        active ? styles['horizontal-bar-chart--active'] : ''
      }`}
    >
      {segments.map((segment, index) => {
        const widthPct = total > 0 ? (segment.value / total) * 100 : 0
        const startPct = cumulativePct
        cumulativePct += widthPct
        const isFirst = index === 0
        const isLast = index === lastIndex
        const showInlineValue = active && isFirst && widthPct > 18
        const showBoundaryBadge = active && isLast && !isFirst

        return (
          <div
            key={segment.key}
            className={styles['horizontal-bar-chart__segment']}
            style={
              {
                '--segment-width': `${widthPct}%`,
                '--segment-color': segment.color,
              } as CSSProperties
            }
            // title={`${segment.label}: ${segment.value}`}
          >
            {showInlineValue && (
              <span
                className={styles['horizontal-bar-chart__value']}
                style={{ color: segment.textColor ?? 'inherit' }}
              >
                {valueFormatter(segment.value)}
              </span>
            )}
            {showBoundaryBadge && (
              <span
                className={styles['horizontal-bar-chart__badge']}
                style={{ left: `${startPct}%`, background: segment.color, color: segment.textColor ?? 'inherit' }}
              >
                {valueFormatter(segment.value)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}