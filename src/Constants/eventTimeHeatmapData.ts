import type {
  CellPosition,
  EventDensityCategory,
  EventTimeHeatmapSummary,
  HeatmapRow,
} from '../types/eventTimeHeatmap';

export const DENSITY_COLORS: Record<EventDensityCategory, string> = {
  high: '#F5E642',
  mediumHigh: '#7DDBEA',
  medium: '#14A6BE',
  low: '#17364A',
};

export const DENSITY_TEXT_COLORS: Record<EventDensityCategory, string> = {
  high: '#7A6A00',
  mediumHigh: '#0B2530',
  medium: '#FFFFFF',
  low: '#FFFFFF',
};

export const DENSITY_LABELS: { key: EventDensityCategory; label: string }[] = [
  { key: 'high', label: '>10 Events' },
  { key: 'mediumHigh', label: '5-10 Events' },
  { key: 'medium', label: '2-5 Events' },
  { key: 'low', label: '<2 Events' },
];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 7 axis labels mark the boundaries of the 6 rows below
export const TIME_AXIS_TICKS = ['12 AM', '04 AM', '08 AM', '12 PM', '04 PM', '08 PM', '12 AM'];

export const heatmapRows: HeatmapRow[] = [
  {
    time: '12 AM',
    cells: [
      { value: 1, category: 'low' },
      { value: 1, category: 'low' },
      { value: 1, category: 'low' },
      null,
      { value: 4, category: 'low' },
      { value: 1, category: 'low' },
      null,
    ],
  },
  {
    time: '04 AM',
    cells: [
      { value: 6, category: 'medium' },
      { value: 6, category: 'medium' },
      { value: 1, category: 'low' },
      { value: 1, category: 'low' },
      { value: 12, category: 'medium' },
      { value: 6, category: 'medium' },
      { value: 6, category: 'medium' },
    ],
  },
  {
    time: '08 AM',
    cells: [
      { value: 8, category: 'mediumHigh' },
      { value: 25, category: 'mediumHigh' },
      { value: 14, category: 'high' },
      { value: 8, category: 'mediumHigh' },
      { value: 35, category: 'high' },
      { value: 8, category: 'mediumHigh' },
      { value: 8, category: 'mediumHigh' },
    ],
  },
  {
    time: '12 PM',
    cells: [
      { value: 1, category: 'low' },
      { value: 1, category: 'low' },
      { value: 8, category: 'mediumHigh' },
      { value: 14, category: 'high' },
      { value: 29, category: 'mediumHigh' },
      { value: 14, category: 'high' },
      { value: 1, category: 'low' },
    ],
  },
  {
    time: '04 PM',
    cells: [
      { value: 14, category: 'high' },
      { value: 8, category: 'mediumHigh' },
      { value: 8, category: 'mediumHigh' },
      { value: 8, category: 'mediumHigh' },
      { value: 12, category: 'medium' },
      { value: 6, category: 'medium' },
      { value: 6, category: 'medium' },
    ],
  },
  {
    time: '08 PM',
    cells: [
      { value: 6, category: 'medium' },
      { value: 6, category: 'medium' },
      { value: 1, category: 'low' },
      { value: 1, category: 'low' },
      { value: 4, category: 'low' },
      null,
      null,
    ],
  },
];

// The day column that's called out in the highlight note - all its cells show
// their numeric value in a pill instead of a plain dot
export const defaultSelectedDayIndex = 4; // Fri

// A single cell that's shown pre-hovered (pill + cursor), matching the reference design
export const defaultHoveredCell: CellPosition = { row: 2, day: 1 }; // 08 AM / Tue

export const eventTimeHeatmapSummary: EventTimeHeatmapSummary = {
  mostCommonRange: '4-8pm',
  rangeLabelLine1: 'Most Common',
  rangeLabelLine2: 'Event Time',
  highlightNote: 'Friday had the highest events recorded this month.',
};
