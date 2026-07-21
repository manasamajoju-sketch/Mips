export type GenderKey = 'female' | 'male' | 'others';

export interface DemographicSegment {
  key: GenderKey;
  // start/end are fractions (0-1) along the category's own min-max whisker range
  start: number;
  end: number;
  // shown inside the segment when the category is highlighted/hovered
  percentLabel?: string;
}

export interface DemographicCategory {
  id: string;
  label: string;
  min: number;
  max: number;
  segments: DemographicSegment[];
  // bolder, dark axis label (e.g. the more prominent categories in the design)
  emphasizeLabel?: boolean;
}

export interface UserDemographicsSummary {
  medianAgeValue: string
  medianAgeLabel: string
}

/** Classic median: sort ascending, take middle (avg of two middles if even). */
export function computeMedian(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2
  }
  return sorted[mid]!
}

/**
 * Near-median age from demographic categories:
 * collect each category's midpoint age, sort ascending, take the middle value.
 */
export function computeNearMedianAgeSummary(
  categories: DemographicCategory[],
): UserDemographicsSummary {
  const ages = categories
    .map((category) => (category.min + category.max) / 2)
    .filter((age) => Number.isFinite(age))

  const median = computeMedian(ages)
  if (median == null) {
    return {
      medianAgeValue: '--',
      medianAgeLabel: 'Near Median Age',
    }
  }

  return {
    medianAgeValue: `${Math.round(median)}y`,
    medianAgeLabel: 'Near Median Age',
  }
}

export interface GenderBucket {
  count: number;
  pct: number;
}

export interface UserDemographicsBucket {
  totalUsers: number;
  male: GenderBucket;
  female: GenderBucket;
  others: GenderBucket;
}

export interface UserDemographicsOverviewData {
  window: string;
  range: {
    from: string;
    to: string;
  };
  buckets: Record<'Cycling' | 'Moto' | 'PPE', UserDemographicsBucket>;
}

export interface UserDemographicsApiResponse {
  success: boolean;
  data: UserDemographicsOverviewData;
  meta: Record<string, unknown>;
}
