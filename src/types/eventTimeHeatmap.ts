export type EventDensityCategory = 'high' | 'mediumHigh' | 'medium' | 'low';

export interface HeatmapCell {
  value: number;
  category: EventDensityCategory;
}

// One row = one time slot; cells are ordered to match DAYS_OF_WEEK.
// null means no events recorded for that day/time slot (renders as an empty cell).
export interface HeatmapRow {
  time: string;
  cells: (HeatmapCell | null)[];
}

export interface EventTimeHeatmapSummary {
  mostCommonRange: string;
  rangeLabelLine1: string;
  rangeLabelLine2: string;
  highlightNote: string;
}

export interface CellPosition {
  row: number;
  day: number;
}
