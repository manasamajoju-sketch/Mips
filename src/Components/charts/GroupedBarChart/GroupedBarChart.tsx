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

  const clearHover = () => {
    setHoveredGroup(defaultActiveCategory ?? null)
  }

  return (
    <div className={styles.chart}>
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

          <div className={styles.plotColumn} onMouseLeave={clearHover}>
            <div
              className={`${styles.plotArea} ${showAxisLines ? styles.plotAreaWithLeftAxis : ''}`}
              style={{
                borderBottom:
                  showBottomAxisLine || showAxisLines ? undefined : 'none',
              }}
            >
              {showGridLines &&
                yTicks.map((tick) => (
                  <div
                    key={tick}
                    className={styles.gridLine}
                    style={{ bottom: `${(tick / yMax) * 100}%` }}
                  />
                ))}

              <div className={styles.groups}>
                {data.map((item) => {
                  const isHovered = hoveredGroup === item.category
                  return (
                    <div
                      key={item.category}
                      className={`${styles.group} ${isHovered ? styles.groupActive : ''}`}
                      onMouseEnter={() => setHoveredGroup(item.category)}
                    >
                      <div className={`${styles.bars} ${isHovered ? styles.barsActive : ''}`}>
                        {series.map((s) => {
                          const value = Number(item[s.key]) || 0
                          const heightPct = value > 0 ? Math.max((value / yMax) * 100, 6) : 0
                          return (
                            <div key={String(s.key)} className={styles.barWrap}>
                              <div
                                className={styles.bar}
                                style={{ height: `${heightPct}%`, backgroundColor: s.color }}
                                title={`${s.label}: ${value}`}
                              >
                                {isHovered && value > 0 && (
                                  <span
                                    className={styles.barValue}
                                    style={{ color: s.textColor ?? '#101828' }}
                                  >
                                    {value}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {showCategoryLabels && (
              <div className={styles.labelsRow}>
                {data.map((item) => {
                  const isHovered = hoveredGroup === item.category
                  return (
                    <span
                      key={item.category}
                      className={`${styles.categoryLabel} ${
                        isHovered ? styles.categoryLabelActive : ''
                      }`}
                      onMouseEnter={() => setHoveredGroup(item.category)}
                    >
                      {item.category}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {xAxisLabel && <div className={styles.xAxisTitle}>{xAxisLabel}</div>}
    </div>
  )
}
