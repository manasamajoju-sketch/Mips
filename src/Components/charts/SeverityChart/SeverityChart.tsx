import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { SeverityPoint } from '../../../types/eventAnalytics'
import styles from './SeverityChart.module.scss'

// SVG viewBox dimensions — fixed coordinate system, scales to container
const VIEW_W      = 640
const VIEW_H      = 260
const PAD_LEFT    = 48   // room for y-axis labels
const PAD_RIGHT   = 8
const PAD_TOP     = 32
const PAD_BOTTOM  = 28

// Font size in SVG user units (not px) — scales automatically with viewBox
const AXIS_FS = 16

interface SeverityChartProps {
  data: SeverityPoint[]
  thresholdPosition: number
  lowSeverityLabel?: string
  highSeverityLabel?: string
  highlightLabel?: string
  yAxisTicks?: number[]
  yAxisUnit?: string
}

export default function SeverityChart({
  data,
  highlightLabel,
  yAxisTicks = [0, 25, 50],
  yAxisUnit = 'Events',
}: SeverityChartProps) {
  const svgRef    = useRef<SVGSVGElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const plotW = VIEW_W - PAD_LEFT - PAD_RIGHT
  const plotH = VIEW_H - PAD_TOP  - PAD_BOTTOM

  const dataMax = useMemo(() => Math.max(...data.map((d) => d.events), 0), [data])
  const baseMax = yAxisTicks[yAxisTicks.length - 1] || 1
  const yMax    = Math.max(baseMax, dataMax, 1)
  const roundedYMax = Math.max(Math.ceil(yMax / 25) * 25, 1)

  const resolvedTicks = yAxisTicks[yAxisTicks.length - 1] < roundedYMax
    ? [0, Math.round(roundedYMax / 2), roundedYMax]
    : yAxisTicks

  const points = useMemo(() => {
    if (data.length === 0) return []
    const stepX = plotW / Math.max(data.length - 1, 1)
    return data.map((d, i) => ({
      x: PAD_LEFT + stepX * i,
      y: PAD_TOP + plotH * (1 - Math.min(d.events, roundedYMax) / roundedYMax),
      ...d,
    }))
  }, [data, plotW, plotH, roundedYMax])

  const linePath = useMemo(() => {
    if (points.length === 0) return ''
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const midX = (prev.x + curr.x) / 2
      d += ` L ${midX.toFixed(1)} ${prev.y.toFixed(1)}`
        + ` L ${midX.toFixed(1)} ${curr.y.toFixed(1)}`
        + ` L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
    }
    return d
  }, [points])

  const areaPath = useMemo(() => {
    if (points.length === 0) return ''
    const baseline = PAD_TOP + plotH
    return `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baseline} L ${points[0].x.toFixed(1)} ${baseline} Z`
  }, [points, linePath, plotH])

  const defaultIndex  = points.findIndex((p) => p.label === highlightLabel)
  const activeIndex   = hoverIndex ?? (defaultIndex >= 0 ? defaultIndex : null)
  const activePoint   = activeIndex !== null ? points[activeIndex] : null

  function handlePointerMove(e: ReactPointerEvent<SVGElement>) {
    const svg = svgRef.current
    if (!svg || points.length === 0) return
    const rect   = svg.getBoundingClientRect()
    if (rect.width === 0) return
    const scaleX = VIEW_W / rect.width
    const localX = (e.clientX - rect.left) * scaleX
    let nearestIdx = 0, nearestDist = Infinity
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - localX)
      if (dist < nearestDist) { nearestDist = dist; nearestIdx = i }
    })
    setHoverIndex(nearestIdx)
  }

  return (
    <div className={styles['severity-chart']}>
      <svg
        ref={svgRef}
        className={styles['severity-chart__svg']}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Y-axis grid + labels ── */}
        {resolvedTicks.map((tick) => {
          const y = PAD_TOP + plotH * (1 - tick / roundedYMax)
          return (
            <g key={tick}>
              <line
                x1={PAD_LEFT} y1={y}
                x2={VIEW_W - PAD_RIGHT} y2={y}
                className={styles['severity-chart__gridline']}
              />
              {/* value above the line */}
              <text
                x={PAD_LEFT - 4} y={y - 3}
                textAnchor="end"
                dominantBaseline="auto"
                fontSize={AXIS_FS}
                fill="#ffffff"
                className={styles['severity-chart__axis-label']}
              >
                {tick}
              </text>
              {/* unit below the value */}
              <text
                x={PAD_LEFT - 4} y={y + AXIS_FS}
                textAnchor="end"
                dominantBaseline="auto"
                fontSize={AXIS_FS * 0.75}
                fill="rgba(255,255,255,0.55)"
                className={styles['severity-chart__axis-label']}
              >
                {yAxisUnit}
              </text>
            </g>
          )
        })}

        {/* ── Vertical tick guides ── */}
        {points.map((p) => (
          <line
            key={`vg-${p.label}`}
            x1={p.x} y1={PAD_TOP - 6}
            x2={p.x} y2={PAD_TOP + plotH}
            className={`${styles['severity-chart__gridline']} ${styles['severity-chart__gridline--vertical']}`}
          />
        ))}

        {/* ── Area + line ── */}
        <path d={areaPath} className={styles['severity-chart__area']} />
        <path d={linePath} pathLength={1} className={styles['severity-chart__line']} />

        {/* ── Active dot ── */}
        {activePoint && (
          <circle
            cx={activePoint.x} cy={activePoint.y} r={4.5}
            className={styles['severity-chart__active-dot']}
          />
        )}

        {/* ── X-axis labels ── */}
        {points.map((p) => (
          <text
            key={`xl-${p.label}`}
            x={p.x} y={VIEW_H - 4}
            textAnchor="middle"
            dominantBaseline="auto"
            fontSize={AXIS_FS}
            fill="#ffffff"
            className={styles['severity-chart__axis-label']}
          >
            {p.label}
          </text>
        ))}

        {/* ── Transparent hover overlay ── */}
        <rect
          x={0} y={0} width={VIEW_W} height={VIEW_H}
          fill="transparent"
          pointerEvents="all"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        />
      </svg>

      {activePoint && (
        <div
          className={styles['severity-chart__tooltip']}
          style={{
            left: `${(activePoint.x / VIEW_W) * 100}%`,
            top:  `${(activePoint.y / VIEW_H) * 100}%`,
          }}
        >
          <span className={styles['severity-chart__tooltip-bubble']}>{activePoint.events}</span>
        </div>
      )}
    </div>
  )
}