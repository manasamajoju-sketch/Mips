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
  { key: 'xAxis', label: 'X Impact', color: '#6fdcea' },
  { key: 'yAxis', label: 'Y Impact', color: EVENT_CATEGORY_COLORS.passive },
  { key: 'zAxis', label: 'Z Impact', color: EVENT_CATEGORY_COLORS.others },
]

export const topEventsSparklineSeriesGyro: SparklineSeries<TopEventSparklinePoint>[] = [
  { key: 'xAxis', label: 'X Rotation', color: '#6fdcea' },
  { key: 'yAxis', label: 'Y Rotation', color: EVENT_CATEGORY_COLORS.passive },
  { key: 'zAxis', label: 'Z Rotation', color: EVENT_CATEGORY_COLORS.others },
]

export const topEventsSparklineSeries: SparklineSeries<TopEventSparklinePoint>[] = topEventsSparklineSeriesImpact