import { useEffect, useState } from 'react';
import EventTimeHeatmapChart from '../../charts/EventTimeHeatmapChart/EventTimeHeatmapChart';
import {
  DENSITY_COLORS,
  DENSITY_LABELS,
} from '../../../Constants/eventTimeHeatmapData';
import {
  DAYS_OF_WEEK,
  TIME_BLOCKS,
  mapEventTimeHeatmapResponse,
  type EventTimeHeatmapApiResponse,
  type EventTimeHeatmapSummary,
  type HeatmapRow,
} from '../../../types/eventTimeHeatmap';
import { dashboardService } from '../../../Services/dashboardService';
import styles from './EventTimeHeatmapCard.module.scss';

interface EventTimeHeatmapCardProps {
  range?: string;
  title?: string;
}

const emptyHeatmapRows: HeatmapRow[] = TIME_BLOCKS.map((block) => ({
  time: block.label,
  cells: DAYS_OF_WEEK.map(() => null),
}));

const emptyHeatmapSummary: EventTimeHeatmapSummary = {
  mostCommonRange: '--',
  rangeLabelLine1: 'Most Common',
  rangeLabelLine2: 'Event Time',
  highlightNote1: 'No heatmap data available',
  highlightNote2: '',
};

function InfoIcon() {
  return (
    <svg
      className={styles.infoIcon}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.2" />
      <line x1="12" y1="10.75" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      className={styles.alertIcon}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M12 4.5 21 19.5H3L12 4.5Z" strokeLinejoin="round" />
      <line x1="12" y1="10.5" x2="12" y2="14.5" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function EventTimeHeatmapCard({
  range = '30d',
  title = 'Event Time Over day & Week',
}: EventTimeHeatmapCardProps) {
  const [rows, setRows] = useState<HeatmapRow[]>(emptyHeatmapRows);
  const [summary, setSummary] = useState<EventTimeHeatmapSummary>(emptyHeatmapSummary);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    dashboardService.getEventTimeHeatmap(range)
      .then((response: unknown) => {
        if (!isMounted) return;
        const typedResponse = response as EventTimeHeatmapApiResponse;
        const mapped = mapEventTimeHeatmapResponse(typedResponse);
        setRows(mapped.rows);
        setSummary(mapped.summary);
      })
      .catch(() => {
        if (!isMounted) return;
        setRows(emptyHeatmapRows);
        setSummary(emptyHeatmapSummary);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [range]);

  const displayedSummary = isLoading
    ? {
        mostCommonRange: '--',
        rangeLabelLine1: 'Loading',
        rangeLabelLine2: 'event heatmap...',
        highlightNote1: 'Fetching heatmap data…',
        highlightNote2: '',
      }
    : summary;

  const displayedRows = isLoading ? emptyHeatmapRows : rows;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>{title}</span>
        <InfoIcon />
      </div>

      <div className={styles.topRow}>
        <div className={styles.summary}>
          <span className={styles.summaryValue}>{displayedSummary.mostCommonRange}</span>
          <span className={styles.summaryLabel}>
            {displayedSummary.rangeLabelLine1}
            <br />
            {displayedSummary.rangeLabelLine2}
          </span>
        </div>
        <div className={styles.note}>
          <span>
             <AlertIcon />
            {displayedSummary.highlightNote1}
            {displayedSummary.highlightNote2 ? (
              <>
                <br />
                {displayedSummary.highlightNote2}
              </>
            ) : null}
          </span>
        </div>
      </div>

      <div className={styles.legend}>
        {DENSITY_LABELS.map(({ key, label }) => (
          <span className={styles.legendItem} key={key}>
            <span className={styles.legendDot} style={{ background: DENSITY_COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>

      <EventTimeHeatmapChart rows={displayedRows} />
    </div>
  );
}
