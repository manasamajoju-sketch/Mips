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

// ── API response types ──────────────────────────────────────────

export interface EventTimeHeatmapCell {
  day: string;
  blockStart: number;
  blockEnd: number;
  count: number;
  level: string;
}

export interface MostCommonBlock {
  blockStart: number;
  blockEnd: number;
  label: string;
  totalCount: number;
}

export interface TopDay {
  day: string;
  totalCount: number;
}

interface EventTimeHeatmapRange {
  from: string;
  to: string;
}

interface EventTimeHeatmapData {
  window: string;
  range: EventTimeHeatmapRange;
  totalEvents: number;
  excludedEvents: number;
  cells: EventTimeHeatmapCell[];
  mostCommonBlock: MostCommonBlock;
  topDay: TopDay;
}

interface EventTimeHeatmapMeta {
  cached: boolean;
  generatedAt: string;
  timezone: string;
}

export interface EventTimeHeatmapApiResponse {
  success: boolean;
  data: EventTimeHeatmapData;
  meta: EventTimeHeatmapMeta;
}

// ── Mapper ──────────────────────────────────────────────────────

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const TIME_BLOCKS = [
  { label: '12 AM', start: 0, end: 4 },
  { label: '04 AM', start: 4, end: 8 },
  { label: '08 AM', start: 8, end: 12 },
  { label: '12 PM', start: 12, end: 16 },
  { label: '04 PM', start: 16, end: 20 },
  { label: '08 PM', start: 20, end: 24 },
];

function getDensityCategory(level: string): EventDensityCategory {
  switch (level) {
    case 'gt10': return 'high';
    case '5to10': return 'mediumHigh';
    case '2to5': return 'medium';
    default: return 'low';
  }
}

export function mapEventTimeHeatmapResponse(
  response: EventTimeHeatmapApiResponse
): { rows: HeatmapRow[]; summary: EventTimeHeatmapSummary } {
  const cells = response.data.cells;

  // Build a lookup: day -> blockStart -> count & level
  const cellMap: Record<string, Record<number, { count: number; level: string }>> = {};
  for (const cell of cells) {
    if (!cellMap[cell.day]) cellMap[cell.day] = {};
    cellMap[cell.day][cell.blockStart] = { count: cell.count, level: cell.level };
  }

  // Build rows - one per time block
  const rows: HeatmapRow[] = TIME_BLOCKS.map((block) => {
    const rowCells: (HeatmapCell | null)[] = DAYS_OF_WEEK.map((day) => {
      const found = cellMap[day]?.[block.start];
      if (!found) return null;
      return {
        value: found.count,
        category: getDensityCategory(found.level),
      };
    });
    return { time: block.label, cells: rowCells };
  });

  // Build summary
  const mostCommonBlock = response.data.mostCommonBlock;
  const blockStartHour = mostCommonBlock.blockStart;
  const period = blockStartHour < 12 ? 'AM' : 'PM';
  const displayHour = blockStartHour === 0 ? 12
    : blockStartHour > 12 ? blockStartHour - 12
    : blockStartHour;
  const endHour = mostCommonBlock.blockEnd;
  const endPeriod = endHour < 12 ? 'AM' : 'PM';
  const displayEndHour = endHour === 0 ? 12
    : endHour > 12 ? endHour - 12
    : endHour;

  const rangeStr = `${displayHour} ${period} - ${displayEndHour} ${endPeriod}`;

  const topDay = response.data.topDay;
  const summary: EventTimeHeatmapSummary = {
    mostCommonRange: rangeStr,
    rangeLabelLine1: 'Most Common',
    rangeLabelLine2: 'Event Time',
    highlightNote: `${topDay.day} had the highest events recorded this month.`,
  };

  return { rows, summary };
}