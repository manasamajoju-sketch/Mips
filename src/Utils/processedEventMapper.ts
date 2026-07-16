import type { ProcessedEventData } from '../types/processedEventsApi'
import type { TopEventSparklinePoint } from '../types/topEvents'

export function mapProcessedEventDataToSparkline(
  processed: ProcessedEventData,
): TopEventSparklinePoint[] {
  return processed.data.map((point) => ({
    x: String(point.tx),
    xAxis: point.iX,
    yAxis: point.iY,
    zAxis: point.iZ,
  }))
}

export function mapProcessedEventResponseToSparkline(processed: ProcessedEventData): TopEventSparklinePoint[] {
  return mapProcessedEventDataToSparkline(processed)
}
