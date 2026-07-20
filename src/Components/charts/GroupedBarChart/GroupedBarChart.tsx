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
  showCategoryLabels?: boolean
  showYTicks?: boolean
  formatYTick?: (value: number) => string
}

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
  showCategoryLabels = true,
  showYTicks = true,
  formatYTick = (value) => String(Math.round(value)),
}: GroupedBarChartProps<T>) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(defaultActiveCategory ?? null)

  const yMax = useMemo(
    () => niceMax(Math.max(1, ...data.flatMap((item) => series.map((s) => Number(item[s.key]) || 0)))),
    [data, series],
  )

  const yTicks = [yMax, yMax / 2, 0]

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

      <div className={styles.body}>
        {yAxisLabel && <span className={styles.yAxisTitle}>{yAxisLabel}</span>}

        <div
          className={styles.plotGrid}
          style={{ gridTemplateColumns: showYTicks ? 'auto 1fr' : '1fr' }}
        >
          {showYTicks && (
            <div className={styles.yAxis}>
              {yTicks.map((tick) => (
                <span
                  key={tick}
                  className={styles.yTickLabel}
                  style={{ bottom: `${(tick / yMax) * 100}%` }}
                >
                  {formatYTick(tick)}
                </span>
              ))}
            </div>
          )}

          <div
            className={`${styles.plotArea} ${showAxisLines ? styles.plotAreaWithLeftAxis : ''}`}
            style={{ borderBottom: showBottomAxisLine || showAxisLines ? undefined : 'none' }}
          >
            {showGridLines &&
              yTicks.map((tick) => (
                <div key={tick} className={styles.gridLine} style={{ bottom: `${(tick / yMax) * 100}%` }} />
              ))}

            <div className={styles.groups}>
              {data.map((item) => {
                const isHovered = hoveredGroup === item.category
                return (
                  <div
                    key={item.category}
                    className={styles.group}
                    onMouseEnter={() => setHoveredGroup(item.category)}
                    onMouseLeave={() =>
                      setHoveredGroup((prev) => (prev === item.category ? defaultActiveCategory ?? null : prev))
                    }
                  >
                    <div className={`${styles.bars} ${isHovered ? styles.barsActive : ''}`}>
                      {series.map((s) => {
                        const value = Number(item[s.key]) || 0
                        const baseHeightPct = value > 0 ? Math.max((value / yMax) * 100, 2) : 0
                        const heightPct = isHovered ? Math.min(baseHeightPct * 1.15, 100) : baseHeightPct
                        return (
                          <div key={String(s.key)} className={styles.barWrap}>
                            {isHovered && value > 0 && (
                              <span
                                className={styles.valueBadge}
                                style={{
                                  bottom: `${heightPct / 2}%`,
                                  color: s.textColor ?? '#f8f8fa',
                                }}
                              >
                                {value}
                              </span>
                            )}
                            <div
                              className={styles.bar}
                              style={{ height: `${heightPct}%`, backgroundColor: s.color }}
                              title={`${s.label}: ${value}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {showYTicks && <span aria-hidden className={styles.gridSpacer} />}

          {showCategoryLabels && (
            <div className={styles.labelsRow}>
              {data.map((item) => (
                <span
                  key={item.category}
                  className={`${styles.categoryLabel} ${
                    hoveredGroup === item.category ? styles.categoryLabelActive : ''
                  }`}
                >
                  {item.category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {xAxisLabel && <div className={styles.xAxisTitle}>{xAxisLabel}</div>}
    </div>
  )
}