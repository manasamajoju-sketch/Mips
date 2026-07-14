import { useEffect, useState } from 'react'
import { type TimelineRange } from '../../Components/common/TimelineButton/TimelineButton'
import EventAnalyticsCard from '../../Components/widgets/EventAnalyticsCard/EventAnalyticsCard'
import { eventAnalyticsMock } from '../../Constants/eventAnalyticsMock'
import EventOverviewCard from '../../Components/cards/EventOverview/EventOverviewCard'
import LocationOverviewCard from '../../Components/widgets/LocationOverviewCard/LocationOverviewCard'
import TopEventsCard from '../../Components/widgets/TopEventsCard/TopEventsCard'
import { topEventsMock, rotationalEventsMock } from '../../Constants/topEventsMock'
import EventTimeHeatmapCard from '../../Components/cards/EventTimeHeatmap/EventTimeHeatmapCard'
import AllEventsTable from '../../Components/tables/AllEventsTable'
import { dashboardService } from '../../Services/dashboardService'
import { eventOverviewFallbackSummary, eventTimelineData } from '../../Constants/eventOverviewData'
import { mapEventOverviewResponse, mapEventTimeseriesResponse, type EventOverviewApiResponse, type EventOverviewSummary, type EventTimeseriesApiResponse } from '../../types/event'
import styles from './EventsPage.module.scss'

interface Props {
  range: TimelineRange
}

export default function EventsPage({ range }: Props) {
  const [overviewSummary, setOverviewSummary] = useState<EventOverviewSummary>(eventOverviewFallbackSummary)
  const [overviewChartData, setOverviewChartData] = useState(eventTimelineData)

  useEffect(() => {
    let isMounted = true

    dashboardService.getEventOverview(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as EventOverviewApiResponse
        setOverviewSummary(mapEventOverviewResponse(typedResponse))
      })
      .catch(() => {
        if (!isMounted) return
        setOverviewSummary(eventOverviewFallbackSummary)
      })

    dashboardService.getEventTimeseries(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as EventTimeseriesApiResponse
        setOverviewChartData(mapEventTimeseriesResponse(typedResponse, range))
      })
      .catch(() => {
        if (!isMounted) return
        setOverviewChartData(eventTimelineData)
      })

    return () => {
      isMounted = false
    }
  }, [range])

  return (
    <section className={styles.eventsPage}>
      <div className={styles.eventOverview}>
        <EventOverviewCard
          summary={overviewSummary}
          chartData={overviewChartData}
          range={range}
          onExpand={() => console.log('Navigate to event details')}
        />
      </div>

      <div className={styles.eventAnalytics}>
        <EventAnalyticsCard
          data={eventAnalyticsMock}
          eventTypes={['Cycling', 'Running', 'Driving']}
          window={range}
          onEventTypeChange={(type) => console.log('Event type changed:', type)}
          onExpand={() => console.log('Expand event analytics')}
        />
      </div>

      <div className={styles.locationOverview}>
        <LocationOverviewCard
          hideHeaderControls
          hideSummary
          compact
        />
      </div>

      <div className={styles.topGForceEvents}>
        <TopEventsCard
          title="Top G-Force Events"
          events={topEventsMock.filter((event) => event.key.startsWith('top-g-force'))}
          onEventClick={(event) => console.log('Navigate to event:', event.key)}
        />
      </div>

      <div className={styles.totalRotationalEvents}>
        <TopEventsCard
          title="Total Rotational Velocity Events"
          events={rotationalEventsMock}
          onEventClick={(event) => console.log('Navigate to event:', event.key)}
        />
      </div>

      <div className={styles.impactDuration}>
        <EventTimeHeatmapCard title="Impact Duration" />
      </div>

      <div className={styles.allEvents}>
        <AllEventsTable />
      </div>
    </section>
  )
}
