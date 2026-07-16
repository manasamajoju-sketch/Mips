import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ImpactForcePoint } from '../../../types/impactForceAnalysis';
import { IMPACT_AXIS_COLORS, IMPACT_FORCE_Y_TICKS } from '../../../Constants/impactForceAnalysisData';
import styles from './ImpactForceChart.module.scss';

interface ImpactForceChartProps {
  data: ImpactForcePoint[];
}

interface ImpactTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: ImpactForcePoint }>;
  label?: string | number;
}

// Recharts renders this automatically when the pointer is over the chart -
// it's the library's built-in Tooltip customization API, not a manually
// positioned element.
function ImpactTooltip({ active, payload, label }: ImpactTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as ImpactForcePoint | undefined;
  if (!point) return null;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>Duration: {label}s</div>
      {(['x', 'y', 'z'] as const).map((axis) => (
        <div className={styles.tooltipRow} key={axis}>
          <span className={styles.tooltipDot} style={{ background: IMPACT_AXIS_COLORS[axis] }} />
          <span className={styles.tooltipAxis}>{axis}</span>
          <span className={styles.tooltipValue}>{point[axis]} gF</span>
        </div>
      ))}
    </div>
  );
}

export default function ImpactForceChart({ data }: ImpactForceChartProps) {
  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#eef1f4" />
          <XAxis
            dataKey="time"
            tickFormatter={(value) => `${value}s`}
            axisLine={{ stroke: '#e3e7ec' }}
            tickLine={false}
            tick={{ fill: '#9aa3ad', fontSize: 12 }}
          />
          <YAxis
            ticks={IMPACT_FORCE_Y_TICKS}
            tickFormatter={(value) => `${value}\ngF`}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9aa3ad', fontSize: 12 }}
          />
          <Tooltip
            content={<ImpactTooltip />}
            cursor={{ stroke: '#c7cdd4', strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="x"
            stroke={IMPACT_AXIS_COLORS.x}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke={IMPACT_AXIS_COLORS.y}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="z"
            stroke={IMPACT_AXIS_COLORS.z}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
