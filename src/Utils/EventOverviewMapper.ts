import type { TimelineCategory, TimelinePoint } from '../Components/charts/EventTimelineChart/EventTimelineChart';

/**
 * Shape returned by the events-timeline API, e.g.:
 * {
 *   "success": true,
 *   "data": [
 *     { "bucket": "2026-07-09T07:15:00.919Z", "total": 4, "byType": { "major_impact": 3, "sos": 1 } }
 *   ],
 *   "meta": { "cached": true, "stale": true, "generatedAt": "...", "range": { "from": "...", "to": "..." } }
 * }
 */
export interface EventBucketApiItem {
  bucket: string;
  total: number;
  byType: Record<string, number>;
}

export interface EventBucketApiResponse {
  success: boolean;
  data: EventBucketApiItem[];
  meta?: {
    cached?: boolean;
    stale?: boolean;
    generatedAt?: string;
    range?: { from?: string; to?: string };
  };
}

export interface CategoryMeta extends TimelineCategory {
  label: string;
}

// Known event-type keys, in the order they should stack top-to-bottom in the bar
// (first entry renders at the top of the bar, matching the reference design).
const KNOWN_TYPE_META: Record<string, { label: string; color: string; order: number }> = {
  sos: { label: 'SOS', color: '#F5E642', order: 0 },
  major_impact: { label: 'Major Impact', color: '#7DDBEA', order: 1 },
  active: { label: 'Active', color: '#7DDBEA', order: 1 },
  minor_impact: { label: 'Minor Impact', color: '#14A6BE', order: 2 },
  passive: { label: 'Passive', color: '#14A6BE', order: 2 },
  others: { label: 'Others', color: '#17364A', order: 3 },
};

const FALLBACK_COLORS = ['#7DDBEA', '#14A6BE', '#17364A', '#5B8DEF', '#B892FF'];

/** Turns a snake_case/camelCase API key into a readable label, e.g. "major_impact" -> "Major Impact". */
function humanizeKey(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Derives the set of categories (key/label/color) actually present across all buckets,
 * so the legend and bar segments always reflect whatever event types the API returns -
 * instead of a hardcoded, possibly-stale list of categories.
 */
export function getCategoriesFromBuckets(buckets: EventBucketApiItem[]): CategoryMeta[] {
  const seenKeys = new Set<string>();
  buckets.forEach((bucket) => {
    Object.keys(bucket.byType || {}).forEach((key) => seenKeys.add(key));
  });

  let fallbackIndex = 0;
  const categories: CategoryMeta[] = Array.from(seenKeys).map((key) => {
    const known = KNOWN_TYPE_META[key];
    if (known) {
      return { key, label: known.label, color: known.color };
    }
    const color = FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length];
    fallbackIndex += 1;
    return { key, label: humanizeKey(key), color };
  });

  categories.sort((a, b) => {
    const orderA = KNOWN_TYPE_META[a.key]?.order ?? 99;
    const orderB = KNOWN_TYPE_META[b.key]?.order ?? 99;
    return orderA - orderB;
  });

  return categories;
}

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Maps raw API buckets into the flat TimelinePoint shape EventTimelineChart expects.
 * `categories` should come from getCategoriesFromBuckets so every point has a value
 * (defaulting to 0) for every category, even ones absent from that particular bucket.
 */
export function mapBucketsToTimelinePoints(
  buckets: EventBucketApiItem[],
  categories: CategoryMeta[],
): TimelinePoint[] {
  return buckets.map((bucket, index) => {
    const d = new Date(bucket.bucket);
    const date = String(d.getUTCDate()).padStart(2, '0');
    const month = MONTH_ABBR[d.getUTCMonth()];

    const prevMonth = index > 0 ? MONTH_ABBR[new Date(buckets[index - 1].bucket).getUTCMonth()] : null;
    const showMonth = index === 0 || month !== prevMonth;

    const point: TimelinePoint = {
      date,
      month: showMonth ? month : '',
    };

    categories.forEach((cat) => {
      point[cat.key] = bucket.byType?.[cat.key] ?? 0;
    });

    return point;
  });
}

/** Convenience wrapper: pass the raw API response, get back everything the chart + legend need. */
export function mapEventBucketApiResponse(response: EventBucketApiResponse): {
  categories: CategoryMeta[];
  points: TimelinePoint[];
} {
  const buckets = response?.data ?? [];
  const categories = getCategoriesFromBuckets(buckets);
  const points = mapBucketsToTimelinePoints(buckets, categories);
  return { categories, points };
}