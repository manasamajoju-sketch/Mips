import { useState } from 'react';
import type { DeviceAgeTrendPoint } from '../../../types/userEventAnalytics';
import { TREND_MAX_VALUE, TREND_Y_AXIS_TICKS } from '../../../Constants/userEventAnalyticsData';
import styles from './DeviceAgeTrendChart.module.scss';

const CHART_WIDTH = 380;
const CHART_HEIGHT = 140;

interface DeviceAgeTrendChartProps {
  points: DeviceAgeTrendPoint[];
}

export default function DeviceAgeTrendChart({ points }: DeviceAgeTrendChartProps) {
  const defaultIndex = points.findIndex((point) => point.highlight);
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex >= 0 ? defaultIndex : null);

  const stepX = CHART_WIDTH / points.length;

  const stepCoords: [number, number][] = [];
  points.forEach((point, index) => {
    const x0 = index * stepX;
    const x1 = (index + 1) * stepX;
    const y = CHART_HEIGHT - (point.value / TREND_MAX_VALUE) * CHART_HEIGHT;
    stepCoords.push([x0, y]);
    stepCoords.push([x1, y]);
  });

  const linePath = `M${stepCoords.map(([x, y]) => `${x},${y}`).join(' L')}`;
  const areaPath = `${linePath} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`;

  const gridLines = [12.5, 25, 37.5];

  const activePoint = activeIndex !== null ? points[activeIndex] : null;
  const activeX = activeIndex !== null ? (activeIndex + 0.5) * stepX : 0;
  const activeY =
    activePoint !== null ? CHART_HEIGHT - (activePoint.value / TREND_MAX_VALUE) * CHART_HEIGHT : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.yAxis} style={{ height: `${CHART_HEIGHT}px` }}>
        {TREND_Y_AXIS_TICKS.map((tick: string) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      <div className={styles.plotCol}>
        <div className={styles.svgWrap}>
          <svg
            className={styles.svg}
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="deviceAgeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {gridLines.map((gy) => {
              const lineY = CHART_HEIGHT - (gy / TREND_MAX_VALUE) * CHART_HEIGHT;
              return (
                <line
                  key={gy}
                  x1={0}
                  x2={CHART_WIDTH}
                  y1={lineY}
                  y2={lineY}
                  stroke="rgba(255,255,255,0.2)"
                  strokeDasharray="3,3"
                />
              );
            })}

            <path d={areaPath} fill="url(#deviceAgeAreaGrad)" />
            <path d={linePath} fill="none" stroke="#ffffff" strokeWidth={2} />

            {points.map((point, index) => {
              const x0 = index * stepX;
              return (
                <rect
                  key={point.label}
                  x={x0}
                  y={0}
                  width={stepX}
                  height={CHART_HEIGHT}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(defaultIndex >= 0 ? defaultIndex : null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>

          {activePoint && (
            <div
              className={styles.tooltip}
              style={{ left: `${(activeX / CHART_WIDTH) * 100}%`, top: `${activeY - 28}px` }}
            >
              {activePoint.value}
            </div>
          )}
        </div>

        <div className={styles.xAxis}>
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
