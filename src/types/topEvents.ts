export interface TopEventSparklinePoint {
  x: string
  xAxis: number
  yAxis: number
  zAxis: number
}

export interface TopEventTag {
  text: string
  color: string
  textColor?: string
}

export interface TopEvent {
  key: string
  metricValue: number
  metricSuffix: string
  metricLabel: string
  date: string
  time: string
  severity: 'Low' | 'Medium' | 'High'
  tags: TopEventTag[]
  data: TopEventSparklinePoint[]
}