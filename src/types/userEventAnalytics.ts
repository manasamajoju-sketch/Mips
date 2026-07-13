export type ImpactBucketKey = 'zero' | 'oneToThree' | 'twoToFour' | 'fivePlus';

export interface ImpactBucketLabel {
  key: ImpactBucketKey;
  label: string;
}

export interface ImpactDistributionSegment {
  key: ImpactBucketKey;
  percent: number;
  userCount: number;
}

export interface ProductLifetimeStats {
  medianEvents: number;
  maximumEvents: number;
}

export interface DeviceAgeStats {
  medianAgeLabel: string;
  maximumAgeLabel: string;
}

export type SeverityFilter = 'high' | 'all';

export interface DeviceAgeTrendPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

export interface UserEventAnalyticsData {
  productName: string;
  lifetimeStats: ProductLifetimeStats;
  deviceAgeStats: DeviceAgeStats;
  impactDistribution: ImpactDistributionSegment[];
  trendPoints: DeviceAgeTrendPoint[];
}
