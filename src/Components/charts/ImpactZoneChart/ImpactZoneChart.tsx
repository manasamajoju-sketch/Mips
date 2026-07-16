import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { ImpactZoneSegment } from '../../../types/individualUserEventAnalytics';
import styles from './ImpactZoneChart.module.scss';

interface ImpactZoneChartProps {
  segments: ImpactZoneSegment[];
  centerLabel: string;
}

// fixed screen positions for the 4 outer labels - the segments are always in
// Front/Right/Back/Left order, so their compass position is constant and
// doesn't need to be computed from the pie's generated angles
const LABEL_POSITIONS: Record<string, React.CSSProperties> = {
  front: { top: 0, left: '50%', transform: 'translate(-50%, -4px)' },
  right: { top: '50%', right: -8, transform: 'translateY(-50%)' },
  back: { bottom: 0, left: '50%', transform: 'translate(-50%, 4px)' },
  left: { top: '50%', left: -8, transform: 'translateY(-50%)' },
};

export default function ImpactZoneChart({ segments, centerLabel }: ImpactZoneChartProps) {
  return (
    <div className={styles.wrap}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={segments}
            dataKey="value"
            nameKey="key"
            innerRadius="58%"
            outerRadius="92%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={4}
            cornerRadius={12}
            stroke="none"
            isAnimationActive={false}
          >
            {segments.map((segment) => (
              <Cell
                key={segment.key}
                className={segment.highlight ? styles.cellHighlight : styles.cell}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.center}>
        <span className={styles.centerLabel}>{centerLabel}</span>
      </div>

      {segments.map((segment) => (
        <span key={segment.key} className={styles.zoneLabel} style={LABEL_POSITIONS[segment.key]}>
          {segment.highlight && <span className={styles.zoneValue}>{segment.displayLabel}</span>}
          {segment.label}
        </span>
      ))}
    </div>
  );
}
