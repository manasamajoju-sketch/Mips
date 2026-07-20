import type { CSSProperties } from 'react'
import styles from './HorizontalBarChart.module.scss'

export interface HorizontalBarSegment {
  key: string
  label: string
  value: number
  color: string
  textColor?: string
}

interface HorizontalBarChartProps {
  segments: HorizontalBarSegment[]
  animate?: boolean
  active?: boolean
  valueFormatter?: (value: number) => string
  animationDelay?: number
}

const fmt = (v: number) => v.toLocaleString()

export default function HorizontalBarChart({
  segments,
  animate = true,
  active = false,
  valueFormatter = fmt,
  animationDelay = 0,
}: HorizontalBarChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)

  // Only segments with actual width participate in edge-rounding.
  // A zero-value segment (e.g. mipsProducts = 0) must not "claim" the
  // first/last slot and leave the visible segment square-edged.
  const visibleIndices = segments
    .map((seg, idx) => ({ idx, hasWidth: total > 0 && seg.value > 0 }))
    .filter(v => v.hasWidth)
    .map(v => v.idx)

  const firstVisibleIdx = visibleIndices[0]
  const lastVisibleIdx  = visibleIndices[visibleIndices.length - 1]

  return (
    <div
      className={[
        styles.bar,
        animate ? styles.barAnimate : '',
        active  ? styles.barActive  : '',
      ].filter(Boolean).join(' ')}
    >
      {segments.map((seg, idx) => {
        const widthPct = total > 0 ? (seg.value / total) * 100 : 0

        const isFirst = idx === firstVisibleIdx
        const isLast  = idx === lastVisibleIdx

        const showInline = active && widthPct >= 12
        const showBadge  = active && widthPct > 0 && widthPct <= 12

        // Skip rendering truly zero-width segments entirely — an empty
        // div with width:0 can still register in flex layout/edge cases.
        if (widthPct <= 0) return null

        return (
          <div
            key={seg.key}
            className={[
              styles.segment,
              isFirst ? styles.segmentFirst : '',
              isLast  ? styles.segmentLast  : '',
            ].filter(Boolean).join(' ')}
            style={{
              '--seg-w':     `${widthPct}%`,
              '--seg-color': seg.color,
              animationDelay: `${animationDelay + idx * 80}ms`,
            } as CSSProperties}
          >
            {showInline && (
              <span
                className={styles.inlineValue}
                style={{ color: seg.textColor ?? '#101828' }}
              >
                {valueFormatter(seg.value)}
              </span>
            )}

            {showBadge && (
              <span
                className={styles.badge}
                style={{
                  background: seg.color,
                  color:      seg.textColor ?? '#101828',
                }}
              >
                {valueFormatter(seg.value)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}