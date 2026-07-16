export interface TopEventsApiEvent {
  eventId: string
  eventType: 'major_impact' | 'impact' | 'gyro' | 'offline_event'
  vertical: string
  irmsMax: number
  grmsMax: number
  hic: number
  bric: number
  createdAt: string
}

export interface TopEventsApiResponse {
  success: boolean
  data: TopEventsApiEvent[]
  meta: {
    cached: boolean
    stale: boolean
    generatedAt: string
  }
}
