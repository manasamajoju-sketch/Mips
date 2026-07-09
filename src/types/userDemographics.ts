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
  medianAgeValue: string;
  medianAgeLabel: string;
}