import { useEffect, useRef, useState } from 'react';
import {
  CartesianGrid, Dot, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { DotProps } from 'recharts';
import type { GForceTrendPoint } from '../../../types/individualUserEventAnalytics';
import { G_FORCE_Y_AXIS_TICKS } from '../../../Constants/eventAnalyticsData';
import styles from './GForceTrendChart.module.scss';

interface GForceTrendChartProps {
  data: GForceTrendPoint[];
}

const COMPACT_HEIGHT_THRESHOLD = 140;

/** One-way flag, not a continuous measurement — flips true/false once past
 * a threshold with hysteresis, so it can't oscillate the way a raw pixel
 * value could. Nothing here feeds back into what's being measured. */
function useCompactChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setCompact(entry.contentRect.height < COMPACT_HEIGHT_THRESHOLD);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, compact] as const;
}

function makeRenderDot(compact: boolean) {
  return function renderDot(props: DotProps & { payload?: GForceTrendPoint }) {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload || payload.value == null) {
      return <g />;
    }

    if (payload.isActive) {
      const r = compact ? 18 : 26;
      const offset = compact ? 28 : 40;
      return (
        <g>
          <circle cx={cx} cy={cy - offset} r={r} className={styles.activeBubble} />
          {!compact && (
            <text x={cx} y={cy - offset - 9} textAnchor="middle" className={styles.activeBubbleTitle}>
              Active Event
            </text>
          )}
          <text x={cx} y={cy - offset + (compact ? 4 : 2)} textAnchor="middle" className={styles.activeBubbleValue}>
            {payload.activeLabel}
          </text>
          <line x1={cx} y1={cy - offset + r} x2={cx} y2={cy - 6} className={styles.activeStem} />
          <Dot cx={cx} cy={cy} r={compact ? 4 : 6} className={styles.dot} />
        </g>
      );
    }

    return <Dot cx={cx} cy={cy} r={compact ? 4 : 5} className={styles.dot} />;
  };
}

export default function GForceTrendChart({ data }: GForceTrendChartProps) {
  const [chartRef, compact] = useCompactChart();
  const topMargin = compact ? 26 : 44;

  return (
    <div className={styles.chart} ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: topMargin, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical horizontal={false} stroke="rgba(255,255,255,0.25)" />
          <XAxis
            dataKey="label"
            axisLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: compact ? 9 : 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 300]}
            ticks={G_FORCE_Y_AXIS_TICKS}
            tickFormatter={(value) => `${value}G`}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: compact ? 9 : 11 }}
            width={compact ? 26 : 34}
          />
          <Tooltip contentStyle={{ display: 'none' }} cursor={{ stroke: 'rgba(255,255,255,0.4)', strokeDasharray: '3 3' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
            dot={makeRenderDot(compact) as any}
            activeDot={false}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}