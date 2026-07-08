import type { TopEvent, TopEventSparklinePoint } from '../types/topEvents'
import type { SparklineSeries } from '../Components/charts/SparklineChart/SparklineChart'
import { EVENT_CATEGORY_COLORS } from './eventOverviewData'

const gForcePoints = [
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

const rotationalPoints = [
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

export const topEventsMock: TopEvent[] = [
  {
    key: 'top-g-force',
    metricValue: 170,
    metricSuffix: 'gF',
    metricLabel: 'Maximum\nG-Force',
    date: '07/02/26',
    time: '8:34am',
    severity: 'Low',
    tags: [
      { text: 'SOS Event', color: EVENT_CATEGORY_COLORS.sos },
      { text: 'PPE', color: EVENT_CATEGORY_COLORS.sos },
    ],
    data: gForcePoints,
  },
  {
    key: 'top-rotational',
    metricValue: 240,
    metricSuffix: 'rad/s',
    metricLabel: 'Max Rotational\nVelocity',
    date: '07/02/26',
    time: '8:34am',
    severity: 'High',
    tags: [
      { text: 'Active Event', color: EVENT_CATEGORY_COLORS.active },
      { text: 'Moto', color: EVENT_CATEGORY_COLORS.passive, textColor: '#ffffff' },
    ],
    data: rotationalPoints,
  },
]

export const topEventsSparklineSeries: SparklineSeries<TopEventSparklinePoint>[] = [
  { key: 'xAxis', label: 'X Axis', color: '#6fdcea' },
  { key: 'yAxis', label: 'Y Axis', color: EVENT_CATEGORY_COLORS.passive },
  { key: 'zAxis', label: 'Z Axis', color: EVENT_CATEGORY_COLORS.others },
]