import type {
  ImpactBucketKey,
  ImpactBucketLabel,
  UserEventAnalyticsData,
} from '../types/userEventAnalytics';

export const IMPACT_BUCKET_COLORS: Record<ImpactBucketKey, string> = {
  zero: '#FFFFFF',
  oneToThree: '#BEEAF2',
  twoToFour: '#4FC3D9',
  fivePlus: '#0FA6BE',
};

export const IMPACT_BUCKET_TEXT_COLORS: Record<ImpactBucketKey, string> = {
  zero: '#0FA6BE',
  oneToThree: '#0B6C7A',
  twoToFour: '#FFFFFF',
  fivePlus: '#FFFFFF',
};

export const IMPACT_BUCKET_LABELS: ImpactBucketLabel[] = [
  { key: 'zero', label: '0 Impact' },
  { key: 'oneToThree', label: '1-3 Impacts' },
  { key: 'twoToFour', label: '2-4 Impacts' },
  { key: 'fivePlus', label: '5+ Impacts' },
];

export const IMPACT_DISTRIBUTION_AXIS_TICKS = ['0%', '25%', '50%', '75%', '100%'];

export const TREND_MAX_VALUE = 50;
export const TREND_Y_AXIS_TICKS = ['50 Events', '25 Events', '00 Events'];

// products available in the "< Cycling >" selector
export const productOptions = ['PPE', 'Cycling', 'Moto', 'Others'];

export const userEventAnalyticsByProduct: Record<string, UserEventAnalyticsData> = {
  Cycling: {
    productName: 'Cycling',
    lifetimeStats: { medianEvents: 2, maximumEvents: 5 },
    deviceAgeStats: { medianAgeLabel: '3m', maximumAgeLabel: '11m' },
    impactDistribution: [
      { key: 'zero', percent: 40, userCount: 40 },
      { key: 'oneToThree', percent: 25, userCount: 25 },
      { key: 'twoToFour', percent: 5, userCount: 5 },
      { key: 'fivePlus', percent: 20, userCount: 20 },
    ],
    trendPoints: [
      { label: '2m', value: 25 },
      { label: '4m', value: 45 },
      { label: '6m', value: 30 },
      { label: '8m', value: 12 },
      { label: '10m', value: 45, highlight: true },
      { label: '12m', value: 20 },
      { label: '14m+', value: 15 },
    ],
  },
};

export const defaultUserEventAnalytics = userEventAnalyticsByProduct.Cycling;
