export interface ProcessedEventDataPoint {
  iX: number
  iY: number
  iZ: number
  tx: number
}

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
