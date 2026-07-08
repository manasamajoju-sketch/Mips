import type {
  DemographicCategory,
  GenderKey,
  UserDemographicsSummary,
} from '../types/userDemographics';

export const GENDER_COLORS: Record<GenderKey, string> = {
  female: '#F5E642',
  male: '#7DDBEA',
  others: '#14A6BE',
};

export const GENDER_LABELS: { key: GenderKey; label: string }[] = [
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
  { key: 'others', label: 'Others' },
];

// Axis scale for the whole chart (used to position each category's whisker)
export const DEMOGRAPHICS_SCALE_MIN = 15;
export const DEMOGRAPHICS_SCALE_MAX = 75;

export const userDemographicsCategories: DemographicCategory[] = [
  {
    id: 'ppe',
    label: 'PPE',
    emphasizeLabel: true,
    min: 15,
    max: 75,
    segments: [
      { key: 'male', start: 0.35, end: 0.82 },
      { key: 'female', start: 0.82, end: 0.93 },
    ],
  },
  {
    id: 'cycling',
    label: 'Cycling',
    emphasizeLabel: false,
    min: 15,
    max: 65,
    segments: [
      { key: 'others', start: 0.28, end: 0.4 },
      { key: 'male', start: 0.4, end: 0.55 },
      { key: 'female', start: 0.55, end: 0.75 },
    ],
  },
  {
    id: 'moto',
    label: 'Moto',
    emphasizeLabel: true,
    highlight: true,
    min: 15,
    max: 68,
    segments: [
      { key: 'male', start: 0.15, end: 0.62, percentLabel: '70%' },
      { key: 'female', start: 0.62, end: 0.85, percentLabel: '30%' },
    ],
  },
  {
    id: 'others',
    label: 'Others',
    emphasizeLabel: false,
    min: 15,
    max: 75,
    segments: [
      { key: 'others', start: 0.35, end: 0.42 },
      { key: 'male', start: 0.42, end: 0.55 },
      { key: 'female', start: 0.55, end: 0.92 },
    ],
  },
];

export const userDemographicsSummary: UserDemographicsSummary = {
  medianAgeValue: '23y',
  medianAgeLabel: 'Median Age',
};
