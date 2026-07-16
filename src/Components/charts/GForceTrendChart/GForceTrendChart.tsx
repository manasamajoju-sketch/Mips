import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DotProps } from 'recharts';
import type { GForceTrendPoint } from '../../../types/individualUserEventAnalytics';
import { G_FORCE_Y_AXIS_TICKS } from '../../../Constants/eventAnalyticsData';
import styles from './GForceTrendChart.module.scss';

interface GForceTrendChartProps {
  data: GForceTrendPoint[];
}

// Recharts calls this per data point; we only draw a dot for points that
// actually carry a value, and render the "Active Event" bubble on the
// point flagged isActive - this is a standard Recharts customization
// pattern, not a hand-rolled chart.
function renderDot(props: DotProps & { payload?: GForceTrendPoint }) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null || !payload || payload.value == null) {
    return <g />;
  }

  if (payload.isActive) {
    return (
      <g>
        <circle cx={cx} cy={cy - 46} r={30} className={styles.activeBubble} />
        <text x={cx} y={cy - 56} textAnchor="middle" className={styles.activeBubbleTitle}>
          Active
        </text>
        <text x={cx} y={cy - 44} textAnchor="middle" className={styles.activeBubbleTitle}>
          Event
        </text>
        <text x={cx} y={cy - 30} textAnchor="middle" className={styles.activeBubbleValue}>
          {payload.activeLabel}
        </text>
        <line x1={cx} y1={cy - 16} x2={cx} y2={cy - 6} className={styles.activeStem} />
        <Dot cx={cx} cy={cy} r={6} className={styles.dot} />
      </g>
    );
  }

  return <Dot cx={cx} cy={cy} r={5} className={styles.dot} />;
}

export default function GForceTrendChart({ data }: GForceTrendChartProps) {
  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data} margin={{ top: 50, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid vertical horizontal={false} stroke="rgba(255,255,255,0.25)" />
          <XAxis
            dataKey="label"
            axisLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: 12 }}
          />
          <YAxis
            domain={[0, 300]}
            ticks={G_FORCE_Y_AXIS_TICKS}
            tickFormatter={(value) => `${value}G`}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ display: 'none' }}
            cursor={{ stroke: 'rgba(255,255,255,0.4)', strokeDasharray: '3 3' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
            dot={renderDot as any}
            activeDot={false}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
