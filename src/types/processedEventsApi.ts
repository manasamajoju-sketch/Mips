export interface ProcessedImpactDataPoint {
  iX: number
  iY: number
  iZ: number
  tx: number
}

export interface ProcessedGyroDataPoint {
  gX: number
  gY: number
  gZ: number
  tx: number
}

export type ProcessedEventDataPoint = ProcessedImpactDataPoint | ProcessedGyroDataPoint

export interface ProcessedEventData {
  eventId: string
  type: 'impact' | 'gyro'
  data: ProcessedEventDataPoint[]
  createdAt: string
}

export interface ProcessedEventsApiResponse {
  success: boolean
  data: ProcessedEventData
}
