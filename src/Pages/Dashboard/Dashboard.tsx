import { useEffect, useState } from 'react'
import EventAnalyticsCard from '../../Components/widgets/EventAnalyticsCard/EventAnalyticsCard'
import { eventAnalyticsMock } from '../../Constants/eventAnalyticsMock'
import EventOverviewCard from '../../Components/cards/EventOverview/EventOverviewCard';
import LocationOverviewCard from '../../Components/widgets/LocationOverviewCard/LocationOverviewCard';
import TopEventsCard from '../../Components/widgets/TopEventsCard/TopEventsCard';

import styles from './Dashboard.module.scss'
import EventTimelineCard from '../../Components/cards/EventTimeline/EventTimelineCard';
import UserOverviewCard from '../../Components/widgets/UserOverviewCard/UserOverviewCard';
import ProductOverviewCard from '../../Components/widgets/ProductOverview/ProductOverviewCard';
import UserDemographicsCard from '../../Components/cards/UserDemographics/UserDemographicsCard';
import EventSeverityCard from '../../Components/cards/EventSeverity/EventSeverityCard';
import EventTimeHeatmapCard from '../../Components/cards/EventTimeHeatmap/EventTimeHeatmapCard';
import { dashboardService } from '../../Services/dashboardService';
import { eventTimelineFallbackEntries } from '../../Constants/eventTimelineData';
import { mapLatestEventsToTimelineEntries, type EventTimelineApiResponse, type EventTimelineEntry } from '../../types/eventTimeline';
import { eventOverviewFallbackSummary } from '../../Constants/eventOverviewData';
import { mapEventOverviewResponse, type EventOverviewApiResponse, type EventOverviewSummary } from '../../types/event';

export default function Dashboard() {
  const [timelineEntries, setTimelineEntries] = useState<EventTimelineEntry[]>(eventTimelineFallbackEntries)
  const [overviewSummary, setOverviewSummary] = useState<EventOverviewSummary>(eventOverviewFallbackSummary)

  useEffect(() => {
    let isMounted = true

    dashboardService.getEventOverview()
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as EventOverviewApiResponse
        setOverviewSummary(mapEventOverviewResponse(typedResponse))
      })
      .catch(() => {
        if (!isMounted) return
        setOverviewSummary(eventOverviewFallbackSummary)
      })

    dashboardService.getLatestEvents()
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as EventTimelineApiResponse
        setTimelineEntries(mapLatestEventsToTimelineEntries(typedResponse.data))
      })
      .catch(() => {
        if (!isMounted) return
        setTimelineEntries(eventTimelineFallbackEntries)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className={styles.dashboardPage}>
      <div className={styles.eventOverview}>
        <EventOverviewCard summary={overviewSummary} onExpand={() => console.log('Navigate to event details')} />
      </div>

      <div className={styles.eventAnalytics}>
        <EventAnalyticsCard
          data={eventAnalyticsMock}
          eventTypes={['Cycling', 'Running', 'Driving']}
          onEventTypeChange={(type) => console.log('Event type changed:', type)}
          onExpand={() => console.log('Expand event analytics')}
        />
      </div>

      <div className={styles.locationOverview}>
        <LocationOverviewCard onExpand={() => console.log('Navigate to location details')} />
      </div>

      <div className={styles.topEvents}>
        <TopEventsCard onEventClick={(event) => console.log('Navigate to event:', event.key)} />
      </div>
      <div className={styles.eventTimeline}><EventTimelineCard entries={timelineEntries} /></div>
      <div className={styles.userOverview}><UserOverviewCard onExpand={() => console.log('Navigate to user details')} /></div>
      <div className={styles.productOverview}><ProductOverviewCard /></div>
      <div className={styles.userDemographics}><UserDemographicsCard /></div>
      <div className={styles.eventSeverity}><EventSeverityCard /></div>
      <div className={styles.eventTime}><EventTimeHeatmapCard /></div>
    </main>
  )
}