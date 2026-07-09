import { useState } from 'react';
import type { CellPosition, HeatmapRow } from '../../../types/eventTimeHeatmap';
import {
  DAYS_OF_WEEK,
  DENSITY_COLORS,
  DENSITY_TEXT_COLORS,
  TIME_AXIS_TICKS,
} from '../../../Constants/eventTimeHeatmapData';
import styles from './EventTimeHeatmapChart.module.scss';

interface EventTimeHeatmapChartProps {
  rows: HeatmapRow[];
}

export default function EventTimeHeatmapChart({ rows }: EventTimeHeatmapChartProps) {
  // No cell or column is revealed until the user hovers something.
  const [hoveredCell, setHoveredCell] = useState<CellPosition | null>(null);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

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
                  const isColumnHovered = hoveredDayIndex === dayIndex;
                  const isCellHovered = hoveredCell?.row === rowIndex && hoveredCell?.day === dayIndex;
                  const showPill = Boolean(cell) && (isColumnHovered || isCellHovered);

                  return (
                    <div
                      key={dayIndex}
                      className={styles.cell}
                      onMouseEnter={() => cell && setHoveredCell({ row: rowIndex, day: dayIndex })}
                      onMouseLeave={() => setHoveredCell(null)}
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
                          {isCellHovered && !isColumnHovered && (
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
              <div
                key={day}
                className={`${styles.dayLabel} ${hoveredDayIndex === index ? styles.dayLabelActive : ''}`}
                onMouseEnter={() => setHoveredDayIndex(index)}
                onMouseLeave={() => setHoveredDayIndex(null)}
              >
                {day}
                {hoveredDayIndex === index && (
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