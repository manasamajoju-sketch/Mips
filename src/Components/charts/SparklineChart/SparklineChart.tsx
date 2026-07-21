import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
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
  clientX: number
  clientY: number
}

type LinePoint = { x: number; y: number; value: number }

type PlotLine = {
  key: AxisKey
  color: string
  label: string
  points: LinePoint[]
  peak: LinePoint
}

// Match the previous SVG viewBox padding ratios (VIEW 360×120, PAD 8×14).
const VIEW_W = 360
const VIEW_H = 120
const PAD_X_RATIO = 8 / VIEW_W
const PAD_Y_RATIO = 14 / VIEW_H

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

/** Catmull-Rom → cubic Bezier smooth path through points (canvas path). */
function strokeSmoothPath(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
) {
  if (points.length < 2) return

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y)
    ctx.stroke()
    return
  }

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
  }

  ctx.stroke()
}

function buildPlotLines(
  chartData: ChartPoint[],
  series: SparklineSeries<ChartPoint>[],
  width: number,
  height: number,
): PlotLine[] {
  if (chartData.length < 2 || width <= 0 || height <= 0) return []

  const padX = width * PAD_X_RATIO
  const padY = height * PAD_Y_RATIO
  const plotW = width - padX * 2
  const plotH = height - padY * 2
  const stepX = plotW / (chartData.length - 1)

  // Same domain as the previous SVG sparkline: 0 → peak.
  const allValues = chartData.flatMap((point) => [point.xAxis, point.yAxis, point.zAxis])
  const yMax = Math.max(1, ...allValues)

  return series.map((s) => {
    const key = s.key as AxisKey
    const values = chartData.map((point) => point[key])
    const peakIndex = findPeakIndex(values)

    const points = values.map((value, index) => {
      const x = padX + stepX * index
      const normalized = Math.min(value, yMax) / yMax
      const y = padY + plotH * (1 - normalized)
      return { x, y, value }
    })

    return {
      key,
      color: s.color,
      label: s.label,
      points,
      peak: points[peakIndex]!,
    }
  })
}

function indexFromMouseX(
  relativeX: number,
  width: number,
  pointCount: number,
): number {
  if (pointCount < 2 || width <= 0) return 0

  // Same mapping the SVG chart used: normalize to viewBox, then snap to sample.
  const viewX = (relativeX / width) * VIEW_W
  const plotW = VIEW_W - (VIEW_W * PAD_X_RATIO) * 2
  const padX = VIEW_W * PAD_X_RATIO
  const stepX = plotW / (pointCount - 1)
  const rawIndex = Math.round((viewX - padX) / stepX)
  return Math.max(0, Math.min(pointCount - 1, rawIndex))
}

export default function SparklineChart<T extends { x: string }>({
  data,
  series,
  showKey = false,
  dateTimeLabel,
  valueUnit = '',
}: SparklineChartProps<T>) {
  const plotRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  // Keep abs values for both plot + tooltip — matches the previous SVG behavior.
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

  const plotSeries = useMemo(
    () =>
      series.map((s) => ({
        key: s.key as AxisKey,
        label: s.label,
        color: s.color,
      })),
    [series],
  )

  useEffect(() => {
    const el = plotRef.current
    if (!el) return

    const updateSize = () => {
      setSize({
        width: el.clientWidth,
        height: el.clientHeight,
      })
    }

    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const lines = useMemo(
    () =>
      buildPlotLines(
        chartData,
        plotSeries as SparklineSeries<ChartPoint>[],
        size.width,
        size.height,
      ),
    [chartData, plotSeries, size.height, size.width],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.width <= 0 || size.height <= 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size.width * dpr
    canvas.height = size.height * dpr
    canvas.style.width = `${size.width}px`
    canvas.style.height = `${size.height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size.width, size.height)

    if (lines.length === 0) return

    const padY = size.height * PAD_Y_RATIO

    lines.forEach((line) => {
      ctx.strokeStyle = line.color
      ctx.lineWidth = 2.4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      strokeSmoothPath(ctx, line.points)

      ctx.beginPath()
      ctx.arc(line.peak.x, line.peak.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = line.color
      ctx.fill()
      ctx.lineWidth = 1.75
      ctx.strokeStyle = '#ffffff'
      ctx.stroke()
    })

    if (tooltip) {
      const point = lines[0]?.points[tooltip.index]
      if (point) {
        ctx.beginPath()
        ctx.setLineDash([3, 3])
        ctx.strokeStyle = '#98a2b3'
        ctx.lineWidth = 1
        ctx.moveTo(point.x, padY - 4)
        ctx.lineTo(point.x, size.height - padY + 4)
        ctx.stroke()
        ctx.setLineDash([])

        lines.forEach((line) => {
          const hoverPoint = line.points[tooltip.index]
          if (!hoverPoint) return
          ctx.beginPath()
          ctx.arc(hoverPoint.x, hoverPoint.y, 4, 0, Math.PI * 2)
          ctx.fillStyle = line.color
          ctx.fill()
          ctx.lineWidth = 1.5
          ctx.strokeStyle = '#ffffff'
          ctx.stroke()
        })
      }
    }
  }, [lines, size.height, size.width, tooltip])

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!plotRef.current || chartData.length < 2 || size.width <= 0) return

    const rect = plotRef.current.getBoundingClientRect()
    if (rect.width <= 0) return

    const relativeX = event.clientX - rect.left
    const index = indexFromMouseX(relativeX, rect.width, chartData.length)

    setTooltip({
      index,
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
    ? Math.min(Math.max(tooltip.clientX + 12, 8), Math.max(size.width - 148, 8))
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
        <canvas
          ref={canvasRef}
          className={styles['sparkline-chart__canvas']}
          aria-label="Event waveform chart"
        />

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
              // Same sample the previous SVG tooltip read for this hover X.
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
