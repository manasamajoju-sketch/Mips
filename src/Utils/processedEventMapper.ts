import type {
  ProcessedEventData,
  ProcessedEventDataPoint,
  ProcessedGyroDataPoint,
  ProcessedImpactDataPoint,
} from '../types/processedEventsApi'
import type { TopEventSparklinePoint } from '../types/topEvents'

function isGyroPoint(point: ProcessedEventDataPoint): point is ProcessedGyroDataPoint {
  return 'gX' in point || 'gY' in point || 'gZ' in point
}

function isImpactPoint(point: ProcessedEventDataPoint): point is ProcessedImpactDataPoint {
  return 'iX' in point || 'iY' in point || 'iZ' in point
}

function readAxis(
  point: ProcessedEventDataPoint,
  type: 'impact' | 'gyro',
  axis: 'x' | 'y' | 'z',
): number {
  if (type === 'gyro' || isGyroPoint(point)) {
    const gyroPoint = point as ProcessedGyroDataPoint
    const raw =
      axis === 'x' ? gyroPoint.gX : axis === 'y' ? gyroPoint.gY : gyroPoint.gZ
    return Number(raw) || 0
  }

  if (type === 'impact' || isImpactPoint(point)) {
    const impactPoint = point as ProcessedImpactDataPoint
    const raw =
      axis === 'x' ? impactPoint.iX : axis === 'y' ? impactPoint.iY : impactPoint.iZ
    return Number(raw) || 0
  }

  return 0
}

export function mapProcessedEventDataToSparkline(
  processed: ProcessedEventData,
  typeOverride?: 'impact' | 'gyro',
): TopEventSparklinePoint[] {
  if (!processed?.data || !Array.isArray(processed.data)) {
    return []
  }

  const type =
    typeOverride ??
    (processed.type === 'gyro' ? 'gyro' : 'impact')

  return processed.data.map((point) => ({
    x: String(point.tx ?? 0),
    xAxis: readAxis(point, type, 'x'),
    yAxis: readAxis(point, type, 'y'),
    zAxis: readAxis(point, type, 'z'),
  }))
}

export function mapProcessedEventResponseToSparkline(
  processed: ProcessedEventData,
  typeOverride?: 'impact' | 'gyro',
): TopEventSparklinePoint[] {
  return mapProcessedEventDataToSparkline(processed, typeOverride)
}
