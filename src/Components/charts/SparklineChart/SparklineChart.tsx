import { useMemo, useRef, useState, type MouseEvent } from 'react'
import styles from './SparklineChart.module.scss'

export interface SparklineSeries<T> {
  key: keyof T
  label: string
  color: string
}

interface SparklineChartProps<T extends { x: string }> {
  data: T[]
  series: SparklineSeries<T>[]
  showKey?: boolean
  /** Shown in the tooltip header, e.g. "06/24/26 9:49PM". */
  dateTimeLabel?: string
  /** Unit suffix for axis values, e.g. "gF" or "rad/s". */
  valueUnit?: string
}

type ChartPoint = {
  x: string
  xAxis: number
  yAxis: number
  zAxis: number
}

type AxisKey = 'xAxis' | 'yAxis' | 'zAxis'

type TooltipState = {
  index: number
  cursorX: number
  clientX: number
  clientY: number
}

const VIEW_W = 360
const VIEW_H = 120
const PAD_X = 8
const PAD_Y = 14

function toAbsNumber(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? Math.abs(n) : 0
}

function formatAxisValue(value: number): string {
  if (!Number.isFinite(value)) return '0'
  const abs = Math.abs(value)
  if (abs === 0) return '0'
  if (abs >= 100) return value.toFixed(1)
  if (abs >= 10) return value.toFixed(2)
  if (abs >= 1) return value.toFixed(2)
  if (abs >= 0.01) return value.toFixed(4)
  return value.toExponential(2)
}

function findPeakIndex(values: number[]): number {
  let peakIndex = 0
  let peakValue = -Infinity
  values.forEach((value, index) => {
    if (value > peakValue) {
      peakValue = value
      peakIndex = index
    }
  })
  return peakIndex
}

/** Catmull-Rom → cubic Bezier smooth path through points. */
function buildSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

export default function SparklineChart<T extends { x: string }>({
  data,
  series,
  showKey = false,
  dateTimeLabel,
  valueUnit = '',
}: SparklineChartProps<T>) {
  const plotRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const chartData = useMemo<ChartPoint[]>(
    () =>
      data.map((point) => {
        const row = point as unknown as Record<string, unknown>
        return {
          x: String(point.x),
          xAxis: toAbsNumber(row.xAxis),
          yAxis: toAbsNumber(row.yAxis),
          zAxis: toAbsNumber(row.zAxis),
        }
      }),
    [data],
  )

  const yMax = useMemo(() => {
    const values = chartData.flatMap((point) => [point.xAxis, point.yAxis, point.zAxis])
    const peak = Math.max(0, ...values)
    return peak > 0 ? peak : 1
  }, [chartData])

  const plot = useMemo(() => {
    if (chartData.length < 2) return []

    const plotW = VIEW_W - PAD_X * 2
    const plotH = VIEW_H - PAD_Y * 2
    const stepX = plotW / (chartData.length - 1)

    return series.map((s) => {
      const key = s.key as AxisKey
      const values = chartData.map((point) => point[key])
      const peakIndex = findPeakIndex(values)

      const points = values.map((value, index) => {
        const x = PAD_X + stepX * index
        const normalized = Math.min(value, yMax) / yMax
        const y = PAD_Y + plotH * (1 - normalized)
        return { x, y, value }
      })

      return {
        key,
        color: s.color,
        label: s.label,
        path: buildSmoothPath(points),
        peak: points[peakIndex],
        points,
      }
    })
  }, [chartData, series, yMax])

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!plotRef.current || chartData.length < 2) return

    const rect = plotRef.current.getBoundingClientRect()
    if (rect.width <= 0) return

    const relativeX = event.clientX - rect.left
    const viewX = (relativeX / rect.width) * VIEW_W
    const plotW = VIEW_W - PAD_X * 2
    const stepX = plotW / (chartData.length - 1)
    const rawIndex = Math.round((viewX - PAD_X) / stepX)
    const index = Math.max(0, Math.min(chartData.length - 1, rawIndex))
    const cursorX = PAD_X + stepX * index

    setTooltip({
      index,
      cursorX,
      clientX: event.clientX - rect.left,
      clientY: event.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => setTooltip(null)

  if (chartData.length < 2) {
    return <div className={styles['sparkline-chart']} />
  }

  const activePoint = tooltip ? chartData[tooltip.index] : null
  const tooltipLeft = tooltip
    ? Math.min(Math.max(tooltip.clientX + 12, 8), (plotRef.current?.clientWidth ?? 200) - 148)
    : 0
  const tooltipTop = tooltip ? Math.max(tooltip.clientY - 72, 4) : 0

  return (
    <div className={styles['sparkline-chart']}>
      {showKey && (
        <div className={styles['sparkline-chart__key']}>
          {series.map((s) => (
            <span key={String(s.key)} className={styles['sparkline-chart__key-item']}>
              <span
                className={styles['sparkline-chart__key-dot']}
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <div
        className={styles['sparkline-chart__plot']}
        ref={plotRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          className={styles['sparkline-chart__svg']}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {plot.map((line) => (
            <g key={line.key}>
              <path
                d={line.path}
                stroke={line.color}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                fill="none"
              />
              <circle
                cx={line.peak.x}
                cy={line.peak.y}
                r={5}
                fill={line.color}
                stroke="#ffffff"
                strokeWidth={1.75}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}

          {tooltip && (
            <g>
              <line
                x1={tooltip.cursorX}
                x2={tooltip.cursorX}
                y1={PAD_Y - 4}
                y2={VIEW_H - PAD_Y + 4}
                stroke="#98a2b3"
                strokeWidth={1}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
              {plot.map((line) => {
                const point = line.points[tooltip.index]
                if (!point) return null
                return (
                  <circle
                    key={`hover-${line.key}`}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={line.color}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}
            </g>
          )}
        </svg>

        {tooltip && activePoint && (
          <div
            className={styles['sparkline-chart__tooltip']}
            style={{ left: tooltipLeft, top: tooltipTop }}
          >
            {dateTimeLabel && (
              <div className={styles['sparkline-chart__tooltip-title']}>{dateTimeLabel}</div>
            )}
            <div className={styles['sparkline-chart__tooltip-duration']}>
              Duration: {activePoint.x}s
            </div>
            {series.map((s) => {
              const key = s.key as AxisKey
              const value = activePoint[key]
              return (
                <div key={String(s.key)} className={styles['sparkline-chart__tooltip-row']}>
                  <span
                    className={styles['sparkline-chart__tooltip-dot']}
                    style={{ backgroundColor: s.color }}
                  />
                  <span className={styles['sparkline-chart__tooltip-label']}>{s.label}</span>
                  <span className={styles['sparkline-chart__tooltip-value']}>
                    {formatAxisValue(value)}
                    {valueUnit ? ` ${valueUnit}` : ''}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
