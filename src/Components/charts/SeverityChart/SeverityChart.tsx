import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { SeverityPoint } from '../../../types/eventAnalytics'
import styles from './SeverityChart.module.scss'

const AXIS_LABEL_STYLE = {
  fill: '#ffffff',
  color: '#ffffff',
  fontSize: 18,
  fontWeight: 500,
}

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
  
  highlightLabel,
  yAxisTicks = [0, 25, 50],
  yAxisUnit = 'Events',
}: SeverityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  // Index of the point the user's cursor is currently nearest to. null = not hovering the chart.
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const plotW = VIEW_W - PAD_LEFT - PAD_RIGHT
  const plotH = VIEW_H - PAD_TOP - PAD_BOTTOM
  const dataMax = useMemo(() => Math.max(...data.map((d) => d.events), 0), [data])
  const baseMax = yAxisTicks[yAxisTicks.length - 1] || 1
  const yMax = Math.max(baseMax, dataMax, 1)
  const roundedYMax = Math.max(Math.ceil(yMax / 25) * 25, 1)
  const resolvedYAxisTicks = yAxisTicks[yAxisTicks.length - 1] < roundedYMax
    ? [0, Math.round(roundedYMax / 2), roundedYMax]
    : yAxisTicks

  const points = useMemo(() => {
    const stepX = plotW / (data.length - 1)
    return data.map((d, i) => {
      const x = PAD_LEFT + stepX * i
      const y = PAD_TOP + plotH * (1 - Math.min(d.events, roundedYMax) / roundedYMax)
      return { x, y, ...d }
    })
  }, [data, plotW, plotH, roundedYMax])

  const linePath = useMemo(() => {
    if (points.length === 0) return ''
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const midX = (prev.x + curr.x) / 2
      // Step at the midpoint between two data points, rather than a
      // straight diagonal, so each value reads as a flat "bar" centered
      // on its x-axis label (matches the new blocky design).
      d += ` L ${midX.toFixed(1)} ${prev.y.toFixed(1)} L ${midX.toFixed(1)} ${curr.y.toFixed(1)} L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
    }
    return d
  }, [points])

  const areaPath = useMemo(() => {
    if (points.length === 0) return ''
    const baseline = PAD_TOP + plotH
    const first = points[0]
    const last = points[points.length - 1]
    return `${linePath} L ${last.x.toFixed(1)} ${baseline} L ${first.x.toFixed(1)} ${baseline} Z`
  }, [points, linePath, plotH])

  // thresholdPosition was previously used to render a divider and labels.
  // Divider/labels are currently commented out; avoid computing thresholdX until needed.

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
        {/* <text x={PAD_LEFT} y={22} className={styles['severity-chart__zone-label']}>
          {lowSeverityLabel}
        </text>
        <text x={thresholdX + 10} y={22} className={styles['severity-chart__zone-label']}>
          {highSeverityLabel}
        </text> */}

        {/* Dashed threshold divider */}
        {/* <line
          x1={thresholdX}
          y1={PAD_TOP - 8}
          x2={thresholdX}
          y2={PAD_TOP + plotH}
          className={styles['severity-chart__divider']}
        /> */}

        {/* Y axis gridlines + labels */}
        {resolvedYAxisTicks.map((tick) => {
          const y = PAD_TOP + plotH * (1 - tick / roundedYMax)
          return (
            <g key={tick}>
              <line
                x1={PAD_LEFT}
                y1={y}
                x2={VIEW_W - PAD_RIGHT}
                y2={y}
                className={styles['severity-chart__gridline']}
              />
              <text x={0} y={y - 10} fill="#ffffff" style={AXIS_LABEL_STYLE} className={styles['severity-chart__axis-label']}>
                {tick}
              </text>
              <text x={0} y={y + 5} fill="#ffffff" style={AXIS_LABEL_STYLE} className={styles['severity-chart__axis-label']}>
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
        <path d={linePath} pathLength={1} className={styles['severity-chart__line']} />

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
          <text key={p.label} x={p.x} y={VIEW_H - 6} textAnchor="middle" fill="#ffffff" style={AXIS_LABEL_STYLE} className={styles['severity-chart__axis-label']}>
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
