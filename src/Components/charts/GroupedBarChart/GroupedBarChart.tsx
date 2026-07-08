import { useMemo } from 'react'
import styles from './GroupedBarChart.module.scss'

export interface GroupedBarSeries<T> {
  key: keyof T
  label: string
  color: string
}

interface GroupedBarChartProps<T extends { category: string }> {
  data: T[]
  series: GroupedBarSeries<T>[]
  showKey?: boolean
}

const VIEW_W = 640
const VIEW_H = 220
const PAD_LEFT = 8
const PAD_RIGHT = 8
const PAD_TOP = 8
const PAD_BOTTOM = 28
const GROUP_GAP = 24
const BAR_GAP = 4

export default function GroupedBarChart<T extends { category: string }>({
  data,
  series,
  showKey = true,
}: GroupedBarChartProps<T>) {
  const plotW = VIEW_W - PAD_LEFT - PAD_RIGHT
  const plotH = VIEW_H - PAD_TOP - PAD_BOTTOM

  const yMax = useMemo(
    () => Math.max(1, ...data.flatMap((item) => series.map((s) => Number(item[s.key]) || 0))),
    [data, series],
  )

  const groups = useMemo(() => {
    const groupWidth = (plotW - GROUP_GAP * (data.length - 1)) / data.length
    const barWidth = (groupWidth - BAR_GAP * (series.length - 1)) / series.length

    return data.map((item, groupIndex) => {
      const groupX = PAD_LEFT + groupIndex * (groupWidth + GROUP_GAP)

      const bars = series.map((s, barIndex) => {
        const value = Number(item[s.key]) || 0
        const barHeight = plotH * (value / yMax)
        const x = groupX + barIndex * (barWidth + BAR_GAP)
        const y = PAD_TOP + (plotH - barHeight)

        return { key: String(s.key), color: s.color, x, y, width: barWidth, height: barHeight, value, label: s.label }
      })

      return { category: item.category, x: groupX, width: groupWidth, bars }
    })
  }, [data, series, plotW, plotH, yMax])

  return (
    <div className={styles.chart}>
      {showKey && (
        <div className={styles.key}>
          {series.map((s) => (
            <span key={String(s.key)} className={styles.keyItem}>
              <span className={styles.keyDot} style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Grouped bar chart"
      >
        {groups.map((group) => (
          <g key={group.category}>
            {group.bars.map((bar) => (
              <rect
                key={bar.key}
                className={styles.bar}
                x={bar.x}
                y={bar.y}
                width={Math.max(bar.width, 0)}
                height={Math.max(bar.height, 0)}
                rx={3}
                fill={bar.color}
              >
                <title>
                  {bar.label}: {bar.value}
                </title>
              </rect>
            ))}

            <text className={styles.categoryLabel} x={group.x + group.width / 2} y={VIEW_H - 10} textAnchor="middle">
              {group.category}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}