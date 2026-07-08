import { useMemo } from 'react'
import type { SeverityPoint } from '../../../types/eventAnalytics'
import { CursorIcon } from '../../common/Icons'
import styles from './SeverityChart.module.scss'

interface SeverityChartProps {
  data: SeverityPoint[]
  /** Fractional index (between two data points) where the severity divider sits */
  thresholdPosition: number
  lowSeverityLabel?: string
  highSeverityLabel?: string
  /** Label of the point to call out with a tooltip + cursor */
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

  const highlight = points.find((p) => p.label === highlightLabel)

  return (
    <div className={styles['severity-chart']}>
      <svg
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

        {/* X axis labels */}
        {points.map((p) => (
          <text key={p.label} x={p.x} y={VIEW_H - 6} textAnchor="middle" className={styles['severity-chart__axis-label']}>
            {p.label}
          </text>
        ))}
      </svg>

      {highlight && (
        <div
          className={styles['severity-chart__tooltip']}
          style={{
            left: `${(highlight.x / VIEW_W) * 100}%`,
            top: `${(highlight.y / VIEW_H) * 100}%`,
          }}
        >
          <span className={styles['severity-chart__tooltip-bubble']}>{highlight.events}</span>
          <CursorIcon className={styles['severity-chart__tooltip-cursor']} />
        </div>
      )}
    </div>
  )
}
