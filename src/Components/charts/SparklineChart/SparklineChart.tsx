import { useMemo } from 'react'
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
}

const VIEW_W = 320
const VIEW_H = 110
const PAD = 4

export default function SparklineChart<T extends { x: string }>({
  data,
  series,
}: SparklineChartProps<T>) {
  const yMax = useMemo(
    () => Math.max(1, ...data.flatMap((point) => series.map((s) => Number(point[s.key]) || 0))),
    [data, series],
  )

  const plotW = VIEW_W - PAD * 2
  const plotH = VIEW_H - PAD * 2

  const linePaths = useMemo(() => {
    if (data.length < 2) return []

    const stepX = plotW / (data.length - 1)

    return series.map((s) => {
      const path = data
        .map((point, i) => {
          const x = PAD + stepX * i
          const y = PAD + plotH * (1 - Math.min(Number(point[s.key]) || 0, yMax) / yMax)
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
        })
        .join(' ')

      return { ...s, path }
    })
  }, [data, series, plotW, plotH, yMax])

  return (
    <div className={styles['sparkline-chart']}>
      {/* {showKey && (
        <div className={styles['sparkline-chart__key']}>
          {series.map((s) => (
            <span key={String(s.key)} className={styles['sparkline-chart__key-item']}>
              <span className={styles['sparkline-chart__key-dot']} style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )} */}

      <svg
        className={styles['sparkline-chart__svg']}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {linePaths.map((line) => (
          <path
            key={String(line.key)}
            d={line.path}
            stroke={line.color}
            fill="none"
            pathLength="1"
            className={styles['sparkline-chart__line']}
          />
        ))}
      </svg>
    </div>
  )
}