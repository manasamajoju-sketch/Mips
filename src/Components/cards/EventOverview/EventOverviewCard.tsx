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
import { InfoIcon } from '../../common/Icons';

interface EventOverviewCardProps {
  summary?: EventOverviewSummary;
  chartData?: Array<{ date: string; month: string; sos: number; active: number; passive: number; others: number; highlight?: boolean }>;
  severityChartData?: Array<{ date: string; month: string; high: number; medium: number; low: number; highlight?: boolean }>;
  onExpand?: () => void;
  range?: TimelineRange;
  isLoading?: boolean;
}

export default function EventOverviewCard({
  summary,
  chartData,
  severityChartData,
  onExpand,
  range,
  isLoading = false,
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

  const renderStatValue = (value: number) => (isLoading ? '--' : value.toLocaleString());
  const renderDelta = (value: number) => (isLoading ? '--' : `${value > 0 ? '+' : ''}${value}%`);

  const isEventsDown = resolvedSummary.totalEventsDeltaPct < 0;
  const isSeverityUp = resolvedSummary.highSeverityDeltaPct > 0;
  const isEventsView = view === 'events';
  const resolvedRange = range ?? '30d';
  const deltaLabel = `L${resolvedRange}`;
  const rangeLabel = resolvedRange === '90d' ? '90 days' : resolvedRange === '30d' ? '30 days' : '12 months';
  const visibleEventCategoryLabels = EVENT_CATEGORY_LABELS.filter(({ key }) => key !== 'others');
  // const visibleEventCategoryLabels = EVENT_CATEGORY_LABELS;

  const legendItems = isEventsView
    ? visibleEventCategoryLabels.map(({ key, label }) => ({ key, label, color: EVENT_CATEGORY_COLORS[key] }))
    : SEVERITY_CATEGORY_LABELS.map(({ key, label }) => ({ key, label, color: SEVERITY_CATEGORY_COLORS[key] }));

  const chartCategories = isEventsView
    ? visibleEventCategoryLabels.map(({ key }) => ({ key, color: EVENT_CATEGORY_COLORS[key] }))
    : SEVERITY_CATEGORY_LABELS.map(({ key }) => ({ key, color: SEVERITY_CATEGORY_COLORS[key] }));

  const resolvedChartData = isEventsView
    ? (chartData ?? eventTimelineData)
    : (severityChartData ?? severityTimelineData);
  const noteText = isLoading
    ? 'Loading event overview data...'
    : isEventsView
      ? resolvedSummary.highlightNote
      : resolvedSummary.severityHighlightNote;

  return (
    <div className={styles.card}>
     <header className={styles.header}>
        <h2 className={styles.title}>
          Event Overview
          <button type="button" className={styles.infoBtn} aria-label="More information">
            <InfoIcon />
          </button>
        </h2>
      </header>

      <div className={styles.stats}>
        <button
          type="button"
          className={`${styles.statBlock} ${isEventsView ? styles.statBlockActive : ''}`}
          onClick={() => setView('events')}
          aria-pressed={isEventsView}
          disabled={isLoading}
        >
          <div className={styles.statRow}>
            <span className={styles.statValue}>{renderStatValue(resolvedSummary.totalEvents)}</span>
            <div className={styles.statMeta}>
              <span className={`${styles.delta} ${isEventsDown ? styles.deltaDown : styles.deltaUp}`}>
                {renderDelta(resolvedSummary.totalEventsDeltaPct)} <span className={styles.deltaLabel}>{deltaLabel}</span>
              </span>
              <span className={styles.statLabel}>
                Events
                {resolvedRange === '90d' && <span className={styles.statRangeLabel}>{rangeLabel}</span>}
              </span>
            </div>
          </div>
          <span className={styles.statUnderline} />
        </button>

        <button
          type="button"
          className={`${styles.statBlock} ${styles.statRight} ${!isEventsView ? styles.statBlockActive : ''}`}
          onClick={() => setView('severity')}
          aria-pressed={!isEventsView}
          disabled={isLoading}
        >
          <div className={`${styles.statRow} ${styles.statRowRight}`}>
            <span className={styles.statValue}>{renderStatValue(resolvedSummary.highSeverityEvents)}</span>
            <div className={styles.statMeta}>
              <span className={`${styles.delta} ${isSeverityUp ? styles.deltaUp : styles.deltaDown}`}>
                {renderDelta(resolvedSummary.highSeverityDeltaPct)} <span className={styles.deltaLabel}>{deltaLabel}</span>
              </span>
              <span className={styles.statLabel}>
                High severity events, HIC
                {resolvedRange === '90d' && <span className={styles.statRangeLabel}>{rangeLabel}</span>}
              </span>
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
        isLoading={isLoading}
      />
    </div>
  );
}
