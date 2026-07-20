import { useMemo, useState } from 'react'
import styles from './GroupedBarChart.module.scss'

export interface GroupedBarSeries<T> {
  key: keyof T
  label: string
  color: string
  textColor?: string
}

interface GroupedBarChartProps<T extends { category: string }> {
  data: T[]
  series: GroupedBarSeries<T>[]
  showKey?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  defaultActiveCategory?: string
  showAxisLines?: boolean
  showBottomAxisLine?: boolean
  showGridLines?: boolean
  formatYTick?: (value: number) => string
}

const VIEW_W = 640
const VIEW_H = 260
// Increased from 52/46 to leave dedicated room for the y-axis title
// (rotated, sits left of the tick numbers) and x-axis title (sits below
// the category labels) so they no longer overlap the tick/category text.
const PAD_LEFT = 66
const PAD_RIGHT = 14
const PAD_TOP = 12
const PAD_BOTTOM = 56
const GROUP_GAP = 18
const BAR_GAP = 4
const NARROW_RATIO = 0.45

// Vertical gap reserved between the category-name row and the x-axis
// title row underneath it.
const CATEGORY_LABEL_OFFSET = 18
const X_AXIS_TITLE_OFFSET = 38

function niceMax(value: number) {
  if (value <= 0) return 1
  const step = value <= 20 ? 5 : value <= 100 ? 25 : Math.pow(10, Math.floor(Math.log10(value)))
  return Math.ceil(value / step) * step
}

export default function GroupedBarChart<T extends { category: string }>({
  data,
  series,
  showKey = true,
  xAxisLabel,
  yAxisLabel,
  defaultActiveCategory,
  showAxisLines = false,
  showBottomAxisLine = true,
  showGridLines = true,
  formatYTick = (value) => String(Math.round(value)),
}: GroupedBarChartProps<T>) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(defaultActiveCategory ?? null)

  const plotW = VIEW_W - PAD_LEFT - PAD_RIGHT
  const plotH = VIEW_H - PAD_TOP - PAD_BOTTOM

  const yMax = useMemo(
    () => niceMax(Math.max(1, ...data.flatMap((item) => series.map((s) => Number(item[s.key]) || 0)))),
    [data, series],
  )

  const yTicks = [yMax, yMax / 2, 0]

  const groups = useMemo(() => {
    const groupWidth = (plotW - GROUP_GAP * (data.length - 1)) / data.length
    const fullBarWidth = (groupWidth - BAR_GAP * (series.length - 1)) / series.length
    const narrowBarWidth = fullBarWidth * NARROW_RATIO

    return data.map((item, groupIndex) => {
      const groupX = PAD_LEFT + groupIndex * (groupWidth + GROUP_GAP)
      const isHovered = hoveredGroup === item.category
      const barWidth = isHovered ? fullBarWidth : narrowBarWidth

      const bars = series.map((s, barIndex) => {
        const value = Number(item[s.key]) || 0
        const barHeight = plotH * (value / yMax)
        const slotX = groupX + barIndex * (fullBarWidth + BAR_GAP)
        const x = slotX + (fullBarWidth - barWidth) / 2
        const y = PAD_TOP + (plotH - barHeight)

        return {
          key: String(s.key),
          color: s.color,
          textColor: s.textColor ?? '#f8f8fa',
          x,
          y,
          width: barWidth,
          height: barHeight,
          value,
          label: s.label,
        }
      })

      return { category: item.category, x: groupX, width: groupWidth, bars, isHovered, groupIndex }
    })
  }, [data, series, plotW, plotH, yMax, hoveredGroup])

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
        {showAxisLines && (
          <>
            <line
              className={styles.axisLine}
              x1={PAD_LEFT}
              x2={PAD_LEFT}
              y1={PAD_TOP}
              y2={PAD_TOP + plotH}
            />
            <line
              className={styles.axisLine}
              x1={PAD_LEFT}
              x2={VIEW_W - PAD_RIGHT}
              y1={PAD_TOP + plotH}
              y2={PAD_TOP + plotH}
            />
          </>
        )}

        {!showAxisLines && showBottomAxisLine && (
          <line
            className={styles.axisLine}
            x1={PAD_LEFT}
            x2={VIEW_W - PAD_RIGHT}
            y1={PAD_TOP + plotH}
            y2={PAD_TOP + plotH}
          />
        )}

        {/* Y-axis title — positioned in the reserved left margin, clear of
            the tick numbers which sit at PAD_LEFT - 8. */}
        {yAxisLabel && (
          <text
            className={styles.axisTitle}
            x={-(PAD_TOP + plotH / 2)}
            y={12}
            textAnchor="middle"
            transform="rotate(-90)"
          >
            {yAxisLabel}
          </text>
        )}

        {/* X-axis title — positioned below the category-name row, using
            the dedicated bottom padding rather than a fixed VIEW_H offset,
            so it scales correctly with PAD_BOTTOM. */}
        {xAxisLabel && (
          <text
            className={styles.axisTitle}
            x={PAD_LEFT + plotW / 2}
            y={PAD_TOP + plotH + X_AXIS_TITLE_OFFSET}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
        )}

        {yTicks.map((tick) => {
          const y = PAD_TOP + plotH * (1 - tick / yMax)
          return (
            <g key={tick}>
              {showGridLines && <line className={styles.gridLine} x1={PAD_LEFT} x2={VIEW_W - PAD_RIGHT} y1={y} y2={y} />}
              <text className={styles.yTick} x={PAD_LEFT - 8} y={y} textAnchor="end" dominantBaseline="middle">
                {formatYTick(tick)}
              </text>
            </g>
          )
        })}

        {groups.map((group) => (
          <g key={group.category}>
            {group.bars.map((bar, barIndex) => (
              <g key={bar.key}>
                <rect
                  className={styles.bar}
                  x={bar.x}
                  y={bar.y}
                  width={Math.max(bar.width, 0)}
                  height={Math.max(bar.height, 0)}
                  rx={3}
                  fill={bar.color}
                  style={{ animationDelay: `${100 + (group.groupIndex * group.bars.length + barIndex) * 90}ms` }}
                >
                  <title>
                    {bar.label}: {bar.value}
                  </title>
                </rect>
                {group.isHovered && bar.height > 16 && (
                  <text
                    className={styles.valueLabel}
                    x={bar.x + bar.width / 2}
                    y={bar.y + 14}
                    textAnchor="middle"
                    fill={bar.textColor}
                  >
                    {bar.value}
                  </text>
                )}
              </g>
            ))}

            <rect
              className={styles.categoryHit}
              x={group.x - GROUP_GAP / 2}
              y={VIEW_H - PAD_BOTTOM}
              width={group.width + GROUP_GAP}
              height={PAD_BOTTOM}
              fill="transparent"
              onMouseEnter={() => setHoveredGroup(group.category)}
              onMouseLeave={() => setHoveredGroup((prev) => (prev === group.category ? defaultActiveCategory ?? null : prev))}
            />
            <text
              className={`${styles.categoryLabel} ${group.isHovered ? styles.categoryLabelActive : ''}`}
              x={group.x + group.width / 2}
              y={PAD_TOP + plotH + CATEGORY_LABEL_OFFSET}
              textAnchor="middle"
              pointerEvents="none"
            >
              {group.category}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}