import { useState } from 'react';
import type { CellPosition, HeatmapRow } from '../../../types/eventTimeHeatmap';
import {
  DAYS_OF_WEEK,
  DENSITY_COLORS,
  DENSITY_TEXT_COLORS,
  TIME_AXIS_TICKS,
  defaultHoveredCell,
  defaultSelectedDayIndex,
} from '../../../Constants/eventTimeHeatmapData';
import styles from './EventTimeHeatmapChart.module.scss';

interface EventTimeHeatmapChartProps {
  rows: HeatmapRow[];
  selectedDayIndex?: number;
}

export default function EventTimeHeatmapChart({
  rows,
  selectedDayIndex = defaultSelectedDayIndex,
}: EventTimeHeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<CellPosition | null>(defaultHoveredCell);

  return (
    <div className={styles.heatmap}>
      <div className={styles.body}>
        <div className={styles.yAxis}>
          {TIME_AXIS_TICKS.map((tick, index) => (
            <span key={`${tick}-${index}`}>{tick}</span>
          ))}
        </div>

        <div className={styles.gridWrap}>
          <div className={styles.grid}>
            {rows.map((row, rowIndex) => (
              <div className={styles.row} key={row.time + rowIndex}>
                {row.cells.map((cell, dayIndex) => {
                  const isSelectedColumn = dayIndex === selectedDayIndex;
                  const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.day === dayIndex;
                  const showPill = Boolean(cell) && (isSelectedColumn || isHovered);

                  return (
                    <div
                      key={dayIndex}
                      className={styles.cell}
                      onMouseEnter={() => cell && setHoveredCell({ row: rowIndex, day: dayIndex })}
                      onMouseLeave={() => setHoveredCell(defaultHoveredCell)}
                    >
                      {cell && showPill && (
                        <div
                          className={styles.pill}
                          style={{
                            background: DENSITY_COLORS[cell.category],
                            color: DENSITY_TEXT_COLORS[cell.category],
                          }}
                        >
                          {cell.value}
                          {isHovered && !isSelectedColumn && (
                            <i className={`ti ti-pointer-filled ${styles.cursor}`} aria-hidden="true" />
                          )}
                        </div>
                      )}
                      {cell && !showPill && (
                        <div className={styles.dot} style={{ background: DENSITY_COLORS[cell.category] }} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.dayLabels}>
            {DAYS_OF_WEEK.map((day, index) => (
              <div className={styles.dayLabel} key={day}>
                {day}
                {index === selectedDayIndex && (
                  <i className={`ti ti-pointer-filled ${styles.axisCursor}`} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
