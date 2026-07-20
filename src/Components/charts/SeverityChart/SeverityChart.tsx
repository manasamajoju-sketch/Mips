import { useMemo } from 'react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { SeverityPoint } from '../../../types/eventAnalytics'
import styles from './SeverityChart.module.scss'

interface SeverityChartProps {
  data: SeverityPoint[]
  thresholdPosition: number
  lowSeverityLabel?: string
  highSeverityLabel?: string
  highlightLabel?: string
  yAxisTicks?: number[]
  yAxisUnit?: string
}

// Recharts' own TooltipProps generic doesn't reliably expose `payload` across
// versions, so we declare the minimal shape we actually read from it.
interface SeverityTooltipProps {
  active?: boolean
  payload?: Array<{ value?: number }>
}

// Custom Y-axis tick: renders the numeric value and the unit label
// ("Events") stacked underneath it, matching the original design.
function renderYAxisTick(unit: string) {
  return function YTick({ x, y, payload }: { x: number; y: number; payload: { value: number } }) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-4} y={-3} textAnchor="end" className={styles.axisValue}>
          {payload.value}
        </text>
        <text x={-4} y={14} textAnchor="end" className={styles.axisUnit}>
          {unit}
        </text>
      </g>
    )
  }
}

// Custom tooltip: a plain white pill with the event count, no card chrome.
function renderTooltip({ active, payload }: SeverityTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return <span className={styles.tooltipBubble}>{payload[0].value}</span>
}

export default function SeverityChart({
  data,
  highlightLabel,
  yAxisTicks = [0, 25, 50],
  yAxisUnit = 'Events',
}: SeverityChartProps) {
  const roundedYMax = useMemo(() => {
    const dataMax = Math.max(...data.map((d) => d.events), 0)
    const baseMax = yAxisTicks[yAxisTicks.length - 1] || 1
    return Math.max(Math.ceil(Math.max(baseMax, dataMax, 1) / 25) * 25, 1)
  }, [data, yAxisTicks])

  const resolvedTicks = useMemo(
    () =>
      yAxisTicks[yAxisTicks.length - 1] < roundedYMax
        ? [0, Math.round(roundedYMax / 2), roundedYMax]
        : yAxisTicks,
    [yAxisTicks, roundedYMax],
  )

  void highlightLabel // reserved for a future "default active point" behavior; hover currently drives the tooltip

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 24, right: 8, bottom: 4, left: 4 }}
        >
          <CartesianGrid vertical horizontal={false} stroke="rgba(255,255,255,0.15)" />

          <XAxis
            dataKey="label"
            axisLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.9)', fontSize: 12 }}
            interval="preserveStartEnd"
          />

          <YAxis
            domain={[0, roundedYMax]}
            ticks={resolvedTicks}
            axisLine={false}
            tickLine={false}
            width={44}
            tick={renderYAxisTick(yAxisUnit) as any}
          />

          <Tooltip
            content={renderTooltip as any}
            wrapperStyle={{ outline: 'none' }}
            cursor={{ stroke: 'rgba(255,255,255,0.6)', strokeDasharray: '3 3' }}
            isAnimationActive={false}
          />

          <Area
            type="step"
            dataKey="events"
            stroke="#ffffff"
            strokeWidth={2.5}
            fill="rgba(255,255,255,0.22)"
            isAnimationActive={false}
            activeDot={{ r: 4.5, fill: '#ffffff', stroke: 'rgba(255,255,255,0.3)', strokeWidth: 4 }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}