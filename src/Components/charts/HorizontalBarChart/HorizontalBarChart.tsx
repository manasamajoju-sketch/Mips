import type { CSSProperties } from 'react'
import styles from './HorizontalBarChart.module.scss'

export interface HorizontalBarSegment {
  key: string
  label: string
  value: number
  color: string
}

interface HorizontalBarChartProps {
  segments: HorizontalBarSegment[]
  animate?: boolean
}

export default function HorizontalBarChart({ segments, animate = true }: HorizontalBarChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)

  return (
    <div className={`${styles['horizontal-bar-chart']} ${animate ? styles['horizontal-bar-chart--animate'] : ''}`}>
      {segments.map((segment) => {
        const widthPct = total > 0 ? (segment.value / total) * 100 : 0

        return (
          <div
            key={segment.key}
            className={styles['horizontal-bar-chart__segment']}
            style={{ '--segment-width': `${widthPct}%`, '--segment-color': segment.color } as CSSProperties}
            title={`${segment.label}: ${segment.value}`}
          />
        )
      })}
    </div>
  )
}
