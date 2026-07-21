import type { TopEvent, TopEventSparklinePoint } from '../types/topEvents'
import type { SparklineSeries } from '../Components/charts/SparklineChart/SparklineChart'
import { EVENT_CATEGORY_COLORS } from './eventOverviewData'

export const gForceWaveformTemplate: TopEventSparklinePoint[] = [
  [0, 1, 1, 1],
  [10, 4, 3, 2],
  [20, 20, 6, 4],
  [30, 16, 5, 3],
  [40, 38, 10, 5],
  [50, 45, 16, 8],
  [60, 33, 10, 6],
  [70, 28, 8, 4],
  [80, 16, 4, 2],
  [90, 10, 3, 2],
  [100, 10, 3, 2],
].map(([x, xAxis, yAxis, zAxis]) => ({ x: `${x}`, xAxis, yAxis, zAxis }))

export const rotationalWaveformTemplate: TopEventSparklinePoint[] = [
  [0, 1, 1, 1],
  [10, 5, 3, 2],
  [20, 19, 6, 3],
  [30, 17, 5, 3],
  [40, 40, 11, 5],
  [50, 46, 17, 8],
  [60, 34, 11, 6],
  [70, 29, 8, 5],
  [80, 17, 4, 3],
  [90, 9, 3, 2],
  [100, 9, 3, 2],
].map(([x, xAxis, yAxis, zAxis]) => ({ x: `${x}`, xAxis, yAxis, zAxis }))

const gForcePoints = gForceWaveformTemplate
const rotationalPoints = rotationalWaveformTemplate

/** True when the series has enough variation to draw a readable curve. */
export function hasUsableSparklineWaveform(data: TopEventSparklinePoint[]): boolean {
  if (!data || data.length < 3) return false

  const keys: Array<keyof TopEventSparklinePoint> = ['xAxis', 'yAxis', 'zAxis']
  return keys.some((key) => {
    const values = data.map((point) => Math.abs(Number(point[key]) || 0))
    const min = Math.min(...values)
    const max = Math.max(...values)
    // Flat / near-constant API stubs (e.g. every sample 0.0001) fail this check.
    return max - min > Math.max(max * 0.02, 1e-6)
  })
}

/**
 * Scales a reference waveform so its peak matches `metricPeak`, preserving the
 * X/Y/Z shape from the design reference.
 */
export function scaleWaveformTemplate(
  template: TopEventSparklinePoint[],
  metricPeak: number,
): TopEventSparklinePoint[] {
  const peak = Math.max(
    1,
    ...template.flatMap((point) => [point.xAxis, point.yAxis, point.zAxis]),
  )
  const target = metricPeak > 0 ? metricPeak : peak

  return template.map((point) => ({
    x: point.x,
    xAxis: (point.xAxis / peak) * target,
    yAxis: (point.yAxis / peak) * target,
    zAxis: (point.zAxis / peak) * target,
  }))
}

export function resolveTopEventSparklineData(
  data: TopEventSparklinePoint[],
  type: 'impact' | 'gyro' | undefined,
  metricValue: number,
): TopEventSparklinePoint[] {
  if (hasUsableSparklineWaveform(data)) return data

  const template = type === 'gyro' ? rotationalWaveformTemplate : gForceWaveformTemplate
  return scaleWaveformTemplate(template, metricValue > 0 ? metricValue : 170)
}

export const topEventsMock: TopEvent[] = [
  {
    key: 'top-g-force-1',
    metricValue: 170,
    metricSuffix: 'gF',
    metricLabel: 'Maximum\nG-Force',
    date: '07/02/26',
    time: '8:34am',
    severity: 'Low',
    type: 'impact',
    tags: [
      { text: 'SOS', color: EVENT_CATEGORY_COLORS.sos },
      { text: 'Construction', color: EVENT_CATEGORY_COLORS.active },
    ],
    data: gForcePoints,
  },
  {
    key: 'top-rotational-1',
    metricValue: 240,
    metricSuffix: 'rad/s',
    metricLabel: 'Max Rotational\nVelocity',
    date: '07/02/26',
    time: '8:34am',
    severity: 'Low',
    type: 'gyro',
    tags: [
      { text: 'Active', color: EVENT_CATEGORY_COLORS.active },
      { text: 'Moto', color: EVENT_CATEGORY_COLORS.passive, textColor: '#ffffff' },
    ],
    data: rotationalPoints,
  },
]

export const rotationalEventsMock: TopEvent[] = [
  {
    key: 'rotational-high',
    metricValue: 240,
    metricSuffix: 'rad/s',
    metricLabel: 'Max Rotational\nVelocity',
    date: '07/02/26',
    time: '8:34am',
    severity: 'High',
    type: 'gyro',
    tags: [
      { text: 'SOS Event', color: EVENT_CATEGORY_COLORS.sos },
      { text: 'Construction', color: EVENT_CATEGORY_COLORS.active },
    ],
    data: rotationalPoints,
  },
  {
    key: 'rotational-active',
    metricValue: 240,
    metricSuffix: 'rad/s',
    metricLabel: 'Max Rotational\nVelocity',
    date: '07/02/26',
    time: '8:34am',
    severity: 'Low',
    type: 'gyro',
    tags: [
      { text: 'Active', color: EVENT_CATEGORY_COLORS.active },
      { text: 'Moto', color: EVENT_CATEGORY_COLORS.passive, textColor: '#ffffff' },
    ],
    data: rotationalPoints,
  },
]

export const topEventsSparklineSeriesImpact: SparklineSeries<TopEventSparklinePoint>[] = [
  { key: 'xAxis', label: 'X Axis', color: '#7DDBEA' },
  { key: 'yAxis', label: 'Y Axis', color: '#14A6BE' },
  { key: 'zAxis', label: 'Z Axis', color: '#17364A' },
]

export const topEventsSparklineSeriesGyro: SparklineSeries<TopEventSparklinePoint>[] = [
  { key: 'xAxis', label: 'X Axis', color: '#7DDBEA' },
  { key: 'yAxis', label: 'Y Axis', color: '#14A6BE' },
  { key: 'zAxis', label: 'Z Axis', color: '#17364A' },
]

export const topEventsSparklineSeries: SparklineSeries<TopEventSparklinePoint>[] = topEventsSparklineSeriesImpact