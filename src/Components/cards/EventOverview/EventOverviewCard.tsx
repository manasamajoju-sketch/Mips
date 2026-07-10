import { useState } from 'react';
import { type TimelineRange } from '../../common/TimelineButton/TimelineButton';
import EventTimelineChart, { type TimelinePoint } from '../../charts/EventTimelineChart/EventTimelineChart';
import {
  EVENT_CATEGORY_COLORS,
  EVENT_CATEGORY_LABELS,
  SEVERITY_CATEGORY_COLORS,
  SEVERITY_CATEGORY_LABELS,
  eventTimelineData,
  severityTimelineData,
} from '../../../Constants/eventOverviewData';
import type { EventOverviewSummary, EventOverviewView } from '../../../types/event';
import styles from './EventOverviewCard.module.scss';

interface EventOverviewCardProps {
  summary?: EventOverviewSummary;
  chartData?: Array<{ date: string; month: string; sos: number; active: number; passive: number; others: number; highlight?: boolean }>;
  onExpand?: () => void;
  range?: TimelineRange;
}

export default function EventOverviewCard({
  summary,
  chartData,
  onExpand,
  range,
}: EventOverviewCardProps) {
  const [view, setView] = useState<EventOverviewView>('events');

  const resolvedSummary: EventOverviewSummary = summary ?? {
    totalEvents: 0,
    totalEventsDeltaPct: 0,
    highSeverityEvents: 0,
    highSeverityDeltaPct: 0,
    highlightNote: 'No event data available',
    severityHighlightNote: 'No high severity data available',
    progress: 0,
  };

  const isEventsDown = resolvedSummary.totalEventsDeltaPct < 0;
  const isSeverityUp = resolvedSummary.highSeverityDeltaPct > 0;
  const isEventsView = view === 'events';
  const resolvedRange = range ?? '30d';
  const deltaLabel = `L${resolvedRange.toUpperCase()}`;

  const legendItems = isEventsView
    ? EVENT_CATEGORY_LABELS.map(({ key, label }) => ({ key, label, color: EVENT_CATEGORY_COLORS[key] }))
    : SEVERITY_CATEGORY_LABELS.map(({ key, label }) => ({ key, label, color: SEVERITY_CATEGORY_COLORS[key] }));

  const chartCategories = isEventsView
    ? EVENT_CATEGORY_LABELS.map(({ key }) => ({ key, color: EVENT_CATEGORY_COLORS[key] }))
    : SEVERITY_CATEGORY_LABELS.map(({ key }) => ({ key, color: SEVERITY_CATEGORY_COLORS[key] }));

  const resolvedChartData = isEventsView
    ? (chartData ?? eventTimelineData)
    : severityTimelineData;
  const noteText = isEventsView ? resolvedSummary.highlightNote : resolvedSummary.severityHighlightNote;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Event overview</span>
          <i className="ti ti-info-circle" aria-hidden="true" />
        </div>
        <button
          type="button"
          className={styles.expand}
          onClick={onExpand}
          aria-label="View event overview details"
        >
          <i className="ti ti-arrow-right" aria-hidden="true" />
        </button>
      </div>

   <div className={styles.stats}>
  <button
    type="button"
    className={`${styles.statBlock} ${isEventsView ? styles.statBlockActive : ''}`}
    onClick={() => setView('events')}
    aria-pressed={isEventsView}
  >
  <div className={styles.statRow}>
  <span className={styles.statValue}>{resolvedSummary.totalEvents.toLocaleString()}</span>
  <div className={styles.statMeta}>
    <span className={`${styles.delta} ${isEventsDown ? styles.deltaDown : styles.deltaUp}`}>
      {resolvedSummary.totalEventsDeltaPct > 0 ? '+' : ''}
      {resolvedSummary.totalEventsDeltaPct}% <span className={styles.deltaLabel}>{deltaLabel}</span>
    </span>
    <span className={styles.statLabel}>Events</span>
  </div>
</div>
<span className={styles.statUnderline} />
  </button>

  <button
    type="button"
    className={`${styles.statBlock} ${styles.statRight} ${!isEventsView ? styles.statBlockActive : ''}`}
    onClick={() => setView('severity')}
    aria-pressed={!isEventsView}
  >
  <div className={`${styles.statRow} ${styles.statRowRight}`}>
  <span className={styles.statValue}>{resolvedSummary.highSeverityEvents}</span>
  <div className={styles.statMeta}>
    <span className={`${styles.delta} ${isSeverityUp ? styles.deltaUp : styles.deltaDown}`}>
      {resolvedSummary.highSeverityDeltaPct > 0 ? '+' : ''}
      {resolvedSummary.highSeverityDeltaPct}% <span className={styles.deltaLabel}>{deltaLabel}</span>
    </span>
    <span className={styles.statLabel}>High severity events, HIC</span>
  </div>
</div>
<span className={styles.statUnderline} />
  </button>
</div>

      <div className={styles.meta}>
        <div className={styles.note}>
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          <span>{noteText}</span>
        </div>
        <div className={styles.legend}>
          {legendItems.map(({ key, label, color }) => (
            <span className={styles.legendItem} key={key}>
              <span className={styles.legendDot} style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <EventTimelineChart
        data={resolvedChartData as unknown as TimelinePoint[]}
        categories={chartCategories}
        range={resolvedRange}
      />
    </div>
  );
}