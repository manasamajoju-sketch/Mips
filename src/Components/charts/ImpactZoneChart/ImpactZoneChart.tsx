import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { ImpactZoneSegment } from '../../../types/individualUserEventAnalytics';
import styles from './ImpactZoneChart.module.scss';

const CENTER_KEY = 'center';

interface ImpactZoneChartProps {
  segments: ImpactZoneSegment[];
  centerLabel: string;
  centerValue?: string;
  hoveredKey?: string | null;
  onHoverChange?: (key: string | null) => void;
}

const LABEL_POSITIONS: Record<string, React.CSSProperties> = {
  front: { top: 0, left: '50%', transform: 'translate(-50%, -4px)' },
  right: { top: '50%', right: -8, transform: 'translateY(-50%)' },
  back: { bottom: 0, left: '50%', transform: 'translate(-50%, 4px)' },
  left: { top: '50%', left: -8, transform: 'translateY(-50%)' },
};

export default function ImpactZoneChart({
  segments,
  centerLabel,
  centerValue,
  hoveredKey: hoveredKeyProp,
  onHoverChange,
}: ImpactZoneChartProps) {
  // TEMP DEBUG: log what data we actually received
  console.log('[ImpactZoneChart] segments:', segments);
  console.log('[ImpactZoneChart] styles object:', styles);

  const [internalHoveredKey, setInternalHoveredKey] = useState<string | null>(null);
  const isControlled = hoveredKeyProp !== undefined;
  const hoveredKey = isControlled ? hoveredKeyProp : internalHoveredKey;

  const setHoveredKey = (key: string | null) => {
    console.log('[ImpactZoneChart] setHoveredKey ->', key); // TEMP DEBUG
    if (onHoverChange) onHoverChange(key);
    if (!isControlled) setInternalHoveredKey(key);
  };

  const handleEnter = (key: string) => () => setHoveredKey(key);
  const handleLeave = (key: string) => () => {
    if (hoveredKey === key) setHoveredKey(null);
  };

  const isCenterHovered = hoveredKey === CENTER_KEY;

  return (
    <div className={styles.wrap}>
      <ResponsiveContainer width="100%" height="100%">
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
                className={hoveredKey === segment.key ? styles.cellHighlight : styles.cell}
                onMouseEnter={handleEnter(segment.key)}
                onMouseLeave={handleLeave(segment.key)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div
        className={isCenterHovered ? styles.centerHighlight : styles.center}
        onMouseEnter={handleEnter(CENTER_KEY)}
        onMouseLeave={handleLeave(CENTER_KEY)}
      >
        {isCenterHovered && centerValue && (
          <span className={styles.zoneValue}>{centerValue}</span>
        )}
        <span className={styles.centerLabel}>{centerLabel}</span>
      </div>

      {segments.map((segment) => {
        const isHovered = hoveredKey === segment.key;
        if (hoveredKey) {
          console.log(`[ImpactZoneChart] segment "${segment.key}" isHovered=${isHovered} displayLabel="${segment.displayLabel}"`); // TEMP DEBUG
        }
        return (
          <span
            key={segment.key}
            className={styles.zoneLabel}
            style={{ ...LABEL_POSITIONS[segment.key], outline: '1px solid red' }} // TEMP DEBUG outline
            onMouseEnter={handleEnter(segment.key)}
            onMouseLeave={handleLeave(segment.key)}
          >
            {isHovered && <span className={styles.zoneValue}>{segment.displayLabel}</span>}
            {segment.label}
          </span>
        );
      })}
    </div>
  );
}