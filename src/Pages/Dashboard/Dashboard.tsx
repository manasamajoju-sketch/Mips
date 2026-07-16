import { useEffect, useState } from 'react'
import { type TimelineRange } from '../../Components/common/TimelineButton/TimelineButton'
import EventAnalyticsCard from '../../Components/widgets/EventAnalyticsCard/EventAnalyticsCard'
import { eventAnalyticsMock } from '../../Constants/eventAnalyticsMock'
import EventOverviewCard from '../../Components/cards/EventOverview/EventOverviewCard';
import LocationOverviewCard from '../../Components/widgets/LocationOverviewCard/LocationOverviewCard';
import TopEventsCard from '../../Components/widgets/TopEventsCard/TopEventsCard';
import { topEventsMock } from '../../Constants/topEventsMock';
import { mapTopEventsApiEventToTopEvent, selectTopEventForType } from '../../Utils/topEventsMapper';
import { mapProcessedEventResponseToSparkline } from '../../Utils/processedEventMapper';

import styles from './Dashboard.module.scss'
import EventTimelineCard from '../../Components/cards/EventTimeline/EventTimelineCard';
import UserOverviewCard from '../../Components/widgets/UserOverviewCard/UserOverviewCard';
import ProductOverviewCard from '../../Components/widgets/ProductOverview/ProductOverviewCard';
import UserDemographicsCard from '../../Components/cards/UserDemographics/UserDemographicsCard';
// import EventSeverityCard from '../../Components/cards/EventSeverity/EventSeverityCard';
import EventSeverityHistogramCard from '../../Components/cards/EventSeverity/EventSeverityHistogramCard';
import EventTimeHeatmapCard from '../../Components/cards/EventTimeHeatmap/EventTimeHeatmapCard';
import { dashboardService } from '../../Services/dashboardService';
import { mapLatestEventsToTimelineEntries, type EventTimelineApiResponse, type EventTimelineEntry } from '../../types/eventTimeline';
import { eventOverviewFallbackSummary, eventTimelineData, severityTimelineData } from '../../Constants/eventOverviewData';
import {
  mapEventOverviewResponse,
  mapEventTimeseriesResponse,
  mapSeverityTimeseriesResponse,
  type EventOverviewApiResponse,
  type EventOverviewSummary,
  type EventTimeseriesApiResponse,
  type SeverityTimeseriesApiResponse,
} from '../../types/event';
import {
  mapImpactDirectionResponse,
  type ImpactDirectionApiResponse,
  type EventAnalyticsData,
} from '../../types/eventAnalytics';
import type { TopEvent } from '../../types/topEvents';
import type { UserOverviewApiResponse } from '../../types/userOverview';
import type { ProductOverviewApiResponse, ProductOverviewCategory } from '../../types/productOverview';
import type {
  UserDemographicsApiResponse,
  UserDemographicsSummary,
  DemographicCategory,
  DemographicSegment,
} from '../../types/userDemographics';
import { productOverviewCategories } from '../../Constants/productOverviewMock';
import {
  userOverviewData,
  userOverviewTotal,
} from '../../Constants/userOverviewMock';
import {
  userDemographicsCategories,
  userDemographicsSummary,
} from '../../Constants/userDemographicsData';

export type DashboardWidget = 'eventTimeline' | 'userOverview' | 'productOverview' | 'userDemographics' | 'eventSeverity'

interface Props {
  range: TimelineRange
  hideWidgets?: DashboardWidget[]
  hideLocationOverviewDetails?: boolean
}

export default function Dashboard({ range, hideWidgets = [], hideLocationOverviewDetails = false }: Props) {
  console.log('[Dashboard] render', range)
  const hiddenWidgets = new Set(hideWidgets)
  const [timelineEntries, setTimelineEntries] = useState<EventTimelineEntry[]>([])
  const [timelineLoading, setTimelineLoading] = useState(true)
  const [overviewSummary, setOverviewSummary] = useState<EventOverviewSummary>(eventOverviewFallbackSummary)
  const [overviewChartData, setOverviewChartData] = useState(eventTimelineData)
  const [severityChartDataState, setSeverityChartDataState] = useState(severityTimelineData)
  const [eventAnalyticsData, setEventAnalyticsData] = useState<EventAnalyticsData>(eventAnalyticsMock)
  const [selectedAnalyticsVertical, setSelectedAnalyticsVertical] = useState<string>(eventAnalyticsMock.eventType)
  const [topEvents, setTopEvents] = useState<TopEvent[]>(topEventsMock)
  const [productOverviewCategoriesState, setProductOverviewCategoriesState] = useState<ProductOverviewCategory[]>(productOverviewCategories)
  const [userOverviewDataState, setUserOverviewDataState] = useState(userOverviewData)
  const [userOverviewTotalState, setUserOverviewTotalState] = useState(userOverviewTotal)
  const [userDemographicsCategoriesState, setUserDemographicsCategoriesState] = useState<DemographicCategory[]>(userDemographicsCategories)
  const [userDemographicsSummaryState] = useState<UserDemographicsSummary>(userDemographicsSummary)

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

    dashboardService.getSeverityTimeseries(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as SeverityTimeseriesApiResponse
        setSeverityChartDataState(mapSeverityTimeseriesResponse(typedResponse, range))
      })
      .catch(() => {
        if (!isMounted) return
        setSeverityChartDataState(severityTimelineData)
      })

    setTimelineLoading(true)
    dashboardService.getLatestEvents()
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as EventTimelineApiResponse
        setTimelineEntries(mapLatestEventsToTimelineEntries(typedResponse.data))
      })
      .catch(() => {
        if (!isMounted) return
        setTimelineEntries([])
      })
      .finally(() => {
        if (!isMounted) return
        setTimelineLoading(false)
      })

    dashboardService.getUserOverview(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as UserOverviewApiResponse
        const buckets = typedResponse.data.buckets
        const mappedData = (['Cycling', 'Moto', 'PPE'] as const).map((category) => ({
          category,
          mipsUsers: buckets[category]?.mipsUsers ?? 0,
          total: buckets[category]?.totalUsers ?? 0,
          usersWithEvents: buckets[category]?.multiEventUsers ?? 0,
        }))
        setUserOverviewDataState(mappedData)
        setUserOverviewTotalState(mappedData.reduce((sum, item) => sum + item.total, 0))
      })
      .catch(() => {
        if (!isMounted) return
        setUserOverviewDataState(userOverviewData)
        setUserOverviewTotalState(userOverviewTotal)
      })

    dashboardService.getProductOverview(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as ProductOverviewApiResponse
        const buckets = typedResponse.data.buckets
        const mappedCategories: ProductOverviewCategory[] = (['Cycling', 'Moto', 'PPE'] as const).map((category) => ({
          key: category.toLowerCase(),
          title: category,
          mipsProducts: buckets[category]?.mips ?? 0,
          other: buckets[category]?.nonMips ?? 0,
          total: buckets[category]?.total ?? 0,
          delta: 0,
        }))
        setProductOverviewCategoriesState(mappedCategories)
      })
      .catch(() => {
        if (!isMounted) return
        setProductOverviewCategoriesState(productOverviewCategories)
      })

    dashboardService.getDemographicsOverview(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as UserDemographicsApiResponse
        const buckets = typedResponse.data.buckets
        const mappedCategories: DemographicCategory[] = (['Cycling', 'Moto', 'PPE'] as const).map((category) => {
          const bucket = buckets[category]
          let start = 0
          const segments: DemographicSegment[] = [
            { key: 'female', pct: bucket.female.pct },
            { key: 'male', pct: bucket.male.pct },
            { key: 'others', pct: bucket.others.pct },
          ]
            .filter((item) => item.pct > 0)
            .map((item) => {
              const seg: DemographicSegment = {
                key: item.key as 'female' | 'male' | 'others',
                start,
                end: start + item.pct / 100,
                percentLabel: `${Math.round(item.pct)}%`,
              }
              start += item.pct / 100
              return seg
            })

          return {
            id: category.toLowerCase(),
            label: category,
            min: 15,
            max: 75,
            segments,
            emphasizeLabel: category !== 'Cycling',
          }
        })
        setUserDemographicsCategoriesState(mappedCategories)
      })
      .catch(() => {
        if (!isMounted) return
        setUserDemographicsCategoriesState(userDemographicsCategories)
      })

    return () => {
      isMounted = false
    }
  }, [range])

  useEffect(() => {
    let isMounted = true

    console.log('[Dashboard] top events effect start', range)
    Promise.allSettled([
      dashboardService.getTopEvents(range, 'impact'),
      dashboardService.getTopEvents(range, 'gyro'),
    ])
      .then(async (results) => {
        console.log('[Dashboard] top events settled', results)
        if (!isMounted) return

        await new Promise((resolve) => setTimeout(resolve, 3000))
        console.log('[Dashboard] processed events delay completed')
        if (!isMounted) return

        const loadEvent = async (result: PromiseSettledResult<unknown>, type: 'impact' | 'gyro') => {
          console.log('[Dashboard] loadEvent start', type)
          if (result.status !== 'fulfilled') {
            console.warn('[Dashboard] getTopEvents failed for', type, result.reason)
            return null
          }

          const topEventsResponse = result.value as import('../../types/topEventsApi').TopEventsApiResponse
          console.log('[Dashboard] topEventsResponse', type, topEventsResponse)
          const topEvent = selectTopEventForType(topEventsResponse.data, type)
          if (!topEvent) {
            console.warn('[Dashboard] No top event found for', type, topEventsResponse.data)
            return null
          }

          try {
            console.log('[Dashboard] Fetching processed events for', type, topEvent.eventId)
            const processedResponse = await dashboardService.getProcessedEvents(topEvent.eventId, type)
            const sparklineData = mapProcessedEventResponseToSparkline(processedResponse.data)
            return { ...mapTopEventsApiEventToTopEvent(topEvent), data: sparklineData }
          } catch (error) {
            console.error('[Dashboard] Processed events request failed for', type, topEvent.eventId, error)
            return mapTopEventsApiEventToTopEvent(topEvent)
          }
        }

        const mappedEvents = await Promise.all([
          loadEvent(results[0], 'impact'),
          loadEvent(results[1], 'gyro'),
        ])

        const validEvents = mappedEvents.filter((event): event is TopEvent => event !== null)
        if (validEvents.length > 0) {
          setTopEvents(validEvents)
        }
      })
      .catch(() => {
        if (!isMounted) return
        setTopEvents(topEventsMock)
      })

    return () => {
      isMounted = false
    }
  }, [range])

  useEffect(() => {
    let isMounted = true
    const supportedVerticals = ['Cycling', 'Moto', 'PPE']

    if (supportedVerticals.includes(selectedAnalyticsVertical)) {
      dashboardService.getImpactDirection(range, selectedAnalyticsVertical)
        .then((response: unknown) => {
          if (!isMounted) return
          const typedResponse = response as ImpactDirectionApiResponse
          const impactBreakdown = mapImpactDirectionResponse(typedResponse)
          const frontImpacts = impactBreakdown.find((item) => item.zone === 'front')?.impacts ?? 0

          setEventAnalyticsData((previous) => ({
            ...previous,
            eventType: selectedAnalyticsVertical,
            frontImpacts,
            impactBreakdown,
          }))
        })
        .catch(() => {
          if (!isMounted) return
          setEventAnalyticsData((previous) => ({
            ...previous,
            eventType: selectedAnalyticsVertical,
          }))
        })
    } else {
      setEventAnalyticsData((previous) => ({
        ...previous,
        eventType: selectedAnalyticsVertical,
      }))
    }

    return () => {
      isMounted = false
    }
  }, [range, selectedAnalyticsVertical])

  return (
    <main className={styles.dashboardPage}>
      <div className={styles.eventOverview}>
        <EventOverviewCard
          summary={overviewSummary}
          chartData={overviewChartData}
          severityChartData={severityChartDataState}
          range={range}
          onExpand={() => console.log('Navigate to event details')}
        />
      </div>

      <div className={styles.eventAnalytics}>
        <EventAnalyticsCard
          data={eventAnalyticsData}
          eventTypes={['Cycling', 'Moto', 'PPE']}
          window={range}
          onEventTypeChange={(type) => setSelectedAnalyticsVertical(type)}
          onExpand={() => console.log('Expand event analytics')}
        />
      </div>

      <div className={styles.locationOverview}>
        <LocationOverviewCard
          onExpand={() => console.log('Navigate to location details')}
          hideHeaderControls={hideLocationOverviewDetails}
          hideSummary={hideLocationOverviewDetails}
          compact={hideLocationOverviewDetails}
        />
      </div>

      <div className={styles.topEvents}>
        <TopEventsCard events={topEvents} onEventClick={(event) => console.log('Navigate to event:', event.key)} />
      </div>
      {!hiddenWidgets.has('eventTimeline') && (
        <div className={styles.eventTimeline}>
          <EventTimelineCard entries={timelineEntries} isLoading={timelineLoading} />
        </div>
      )}
      {!hiddenWidgets.has('userOverview') && (
        <div className={styles.userOverview}><UserOverviewCard data={userOverviewDataState} total={userOverviewTotalState} onExpand={() => console.log('Navigate to user details')} /></div>
      )}
      {!hiddenWidgets.has('productOverview') && (
        <div className={styles.productOverview}><ProductOverviewCard categories={productOverviewCategoriesState} /></div>
      )}
      {!hiddenWidgets.has('userDemographics') && (
        <div className={styles.userDemographics}>
          <UserDemographicsCard
            categories={userDemographicsCategoriesState}
            summary={userDemographicsSummaryState}
          />
        </div>
      )}
      {!hiddenWidgets.has('eventSeverity') && (
        <div className={styles.eventSeverity}><EventSeverityHistogramCard /></div>
      )}
      {/* <div className={styles.eventSeverity}><EventSeverityCard /></div> */}
      <div className={styles.eventTime}><EventTimeHeatmapCard range={range} /></div>

    </main>
  )
}
