import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { SeverityPoint } from '../../../types/eventAnalytics'
import { CursorIcon } from '../../common/Icons'
import styles from './SeverityChart.module.scss'

interface SeverityChartProps {
  data: SeverityPoint[]
  /** Fractional index (between two data points) where the severity divider sits */
  thresholdPosition: number
  lowSeverityLabel?: string
  highSeverityLabel?: string
  /** Label of the point to highlight by default, before the user hovers the chart */
  highlightLabel?: string
  yAxisTicks?: number[]
  yAxisUnit?: string
}

const VIEW_W = 640
const VIEW_H = 260
const PAD_LEFT = 56
const PAD_RIGHT = 8
const PAD_TOP = 46
const PAD_BOTTOM = 30

export default function SeverityChart({
  data,
  thresholdPosition,
  lowSeverityLabel = 'Low Severity',
  highSeverityLabel = 'High Severity',
  highlightLabel,
  yAxisTicks = [0, 25, 50],
  yAxisUnit = 'Events',
}: SeverityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  // Index of the point the user's cursor is currently nearest to. null = not hovering the chart.
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const plotW = VIEW_W - PAD_LEFT - PAD_RIGHT
  const plotH = VIEW_H - PAD_TOP - PAD_BOTTOM
  const yMax = yAxisTicks[yAxisTicks.length - 1] || 1

  const points = useMemo(() => {
    const stepX = plotW / (data.length - 1)
    return data.map((d, i) => {
      const x = PAD_LEFT + stepX * i
      const y = PAD_TOP + plotH * (1 - Math.min(d.events, yMax) / yMax)
      return { x, y, ...d }
    })
  }, [data, plotW, plotH, yMax])

  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '),
    [points],
  )

  const areaPath = useMemo(() => {
    if (points.length === 0) return ''
    const baseline = PAD_TOP + plotH
    const first = points[0]
    const last = points[points.length - 1]
    return `${linePath} L ${last.x.toFixed(1)} ${baseline} L ${first.x.toFixed(1)} ${baseline} Z`
  }, [points, linePath, plotH])

  const thresholdX = useMemo(() => {
    const stepX = plotW / (data.length - 1)
    return PAD_LEFT + stepX * thresholdPosition
  }, [plotW, data.length, thresholdPosition])

  // Before any real hover, fall back to the configured default (e.g. the highest point).
  const defaultIndex = points.findIndex((p) => p.label === highlightLabel)
  const activeIndex = hoverIndex ?? (defaultIndex >= 0 ? defaultIndex : null)
  const activePoint = activeIndex !== null ? points[activeIndex] : null

  /** Finds whichever data point's x-position is closest to the cursor, and highlights it. */
  function handlePointerMove(event: ReactPointerEvent<SVGElement>) {
    const svg = svgRef.current
    if (!svg || points.length === 0) return

    const rect = svg.getBoundingClientRect()
    if (rect.width === 0) return

    const scaleX = VIEW_W / rect.width
    const localX = (event.clientX - rect.left) * scaleX

    let nearestIndex = 0
    let nearestDistance = Infinity
    points.forEach((p, i) => {
      const distance = Math.abs(p.x - localX)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    })

    setHoverIndex(nearestIndex)
  }

  function handlePointerLeave() {
    setHoverIndex(null)
  }

  return (
    <div className={styles['severity-chart']}>
      <svg
        ref={svgRef}
        className={styles['severity-chart__svg']}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Severity zone labels */}
        <text x={PAD_LEFT} y={22} className={styles['severity-chart__zone-label']}>
          {lowSeverityLabel}
        </text>
        <text x={thresholdX + 10} y={22} className={styles['severity-chart__zone-label']}>
          {highSeverityLabel}
        </text>

        {/* Dashed threshold divider */}
        <line
          x1={thresholdX}
          y1={PAD_TOP - 8}
          x2={thresholdX}
          y2={PAD_TOP + plotH}
          className={styles['severity-chart__divider']}
        />

        {/* Y axis gridlines + labels */}
        {yAxisTicks.map((tick) => {
          const y = PAD_TOP + plotH * (1 - tick / yMax)
          return (
            <g key={tick}>
              <line
                x1={PAD_LEFT}
                y1={y}
                x2={VIEW_W - PAD_RIGHT}
                y2={y}
                className={styles['severity-chart__gridline']}
              />
              <text x={0} y={y - 10} className={styles['severity-chart__axis-label']}>
                {tick}
              </text>
              <text x={0} y={y + 5} className={styles['severity-chart__axis-label']}>
                {yAxisUnit}
              </text>
            </g>
          )
        })}

        {/* Vertical tick guides per data point */}
        {points.map((p) => (
          <line
            key={p.label}
            x1={p.x}
            y1={PAD_TOP - 8}
            x2={p.x}
            y2={PAD_TOP + plotH}
            className={`${styles['severity-chart__gridline']} ${styles['severity-chart__gridline--vertical']}`}
          />
        ))}

        {/* Area + line */}
        <path d={areaPath} className={styles['severity-chart__area']} />
        <path d={linePath} className={styles['severity-chart__line']} />

        {/* Dot marking whichever point is currently active (hovered, or the default) */}
        {activePoint && (
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r={4.5}
            className={styles['severity-chart__active-dot']}
          />
        )}

        {/* X axis labels */}
        {points.map((p) => (
          <text key={p.label} x={p.x} y={VIEW_H - 6} textAnchor="middle" className={styles['severity-chart__axis-label']}>
            {p.label}
          </text>
        ))}

        {/* Full-size transparent overlay so pointer events fire across the whole chart,
            not just where the line/area happens to be painted. Kept last so it's on top. */}
        <rect
          x={0}
          y={0}
          width={VIEW_W}
          height={VIEW_H}
          fill="transparent"
          pointerEvents="all"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />
      </svg>

      {activePoint && (
        <div
          className={styles['severity-chart__tooltip']}
          style={{
            left: `${(activePoint.x / VIEW_W) * 100}%`,
            top: `${(activePoint.y / VIEW_H) * 100}%`,
          }}
        >
          <span className={styles['severity-chart__tooltip-bubble']}>{activePoint.events}</span>
        </div>
      )}
    </div>
  )
}