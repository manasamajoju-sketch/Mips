import type {
  ProcessedEventData,
  ProcessedEventDataPoint,
} from '../types/processedEventsApi'
import type { TopEventSparklinePoint } from '../types/topEvents'

function pickNumber(source: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    if (!(key in source)) continue
    const value = Number(source[key])
    if (Number.isFinite(value)) return value
  }
  return 0
}

/**
 * Read one axis from a processed sample.
 * Prefer the requested `type` keys first so mixed/partial payloads
 * (e.g. impact rows that also include zeroed gX/gY/gZ) don't collapse to flat lines.
 */
function readAxis(
  point: ProcessedEventDataPoint,
  type: 'impact' | 'gyro',
  axis: 'x' | 'y' | 'z',
): number {
  const row = point as unknown as Record<string, unknown>

  if (type === 'gyro') {
    if (axis === 'x') return pickNumber(row, ['gX', 'gx', 'X', 'x'])
    if (axis === 'y') return pickNumber(row, ['gY', 'gy', 'Y', 'y'])
    return pickNumber(row, ['gZ', 'gz', 'Z', 'z'])
  }

  if (axis === 'x') return pickNumber(row, ['iX', 'ix', 'X', 'x'])
  if (axis === 'y') return pickNumber(row, ['iY', 'iy', 'Y', 'y'])
  return pickNumber(row, ['iZ', 'iz', 'Z', 'z'])
}

function normalizeSamples(raw: unknown): ProcessedEventDataPoint[] {
  if (Array.isArray(raw)) return raw as ProcessedEventDataPoint[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if (Array.isArray(obj.samples)) return obj.samples as ProcessedEventDataPoint[]
    if (Array.isArray(obj.points)) return obj.points as ProcessedEventDataPoint[]
    if (Array.isArray(obj.data)) return obj.data as ProcessedEventDataPoint[]
  }
  return []
}

export function mapProcessedEventDataToSparkline(
  processed: ProcessedEventData,
  typeOverride?: 'impact' | 'gyro',
): TopEventSparklinePoint[] {
  const samples = normalizeSamples(processed?.data)
  if (samples.length === 0) return []

  const type =
    typeOverride ??
    (processed.type === 'gyro' ? 'gyro' : 'impact')

  return samples.map((point) => {
    const row = point as unknown as Record<string, unknown>
    return {
      x: String(pickNumber(row, ['tx', 't', 'time', 'timestamp'])),
      xAxis: readAxis(point, type, 'x'),
      yAxis: readAxis(point, type, 'y'),
      zAxis: readAxis(point, type, 'z'),
    }
  })
}

export function mapProcessedEventResponseToSparkline(
  processed: ProcessedEventData | ProcessedEventDataPoint[] | null | undefined,
  typeOverride?: 'impact' | 'gyro',
): TopEventSparklinePoint[] {
  if (!processed) return []

  if (Array.isArray(processed)) {
    return mapProcessedEventDataToSparkline(
      {
        eventId: '',
        type: typeOverride ?? 'impact',
        data: processed,
        createdAt: '',
      },
      typeOverride,
    )
  }

  return mapProcessedEventDataToSparkline(processed, typeOverride)
}
