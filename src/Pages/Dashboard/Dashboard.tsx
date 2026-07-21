import { useEffect, useState } from 'react'
import { type TimelineRange } from '../../Components/common/TimelineButton/TimelineButton'
import EventAnalyticsCard from '../../Components/widgets/EventAnalyticsCard/EventAnalyticsCard'
import EventOverviewCard from '../../Components/cards/EventOverview/EventOverviewCard';
import LocationOverviewCard from '../../Components/widgets/LocationOverviewCard/LocationOverviewCard';
import TopEventsCard from '../../Components/widgets/TopEventsCard/TopEventsCard';
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
import { mapLatestEventsToTimelineEntries, type EventTimelineApiEvent, type EventTimelineEntry, type EventTimelineApiResponse } from '../../types/eventTimeline';
import { eventOverviewFallbackSummary } from '../../Constants/eventOverviewData';
import {
  mapEventOverviewResponse,
  mapEventTimeseriesResponse,
  mapSeverityTimeseriesResponse,
  type EventOverviewApiResponse,
  type EventOverviewSummary,
  type EventTimeseriesApiResponse,
  type SeverityTimeseriesApiResponse,
  type EventTimelineDay,
  type SeverityTimelineWeek,
} from '../../types/event';
import {
  mapImpactDirectionResponse,
  type ImpactDirectionApiResponse,
  type EventAnalyticsData,
} from '../../types/eventAnalytics';
import type { TopEvent } from '../../types/topEvents';
import type { UserOverviewApiResponse, UserOverviewCategory } from '../../types/userOverview';
import type { ProductOverviewApiResponse, ProductOverviewCategory } from '../../types/productOverview';
import type {
  UserDemographicsApiResponse,
  DemographicCategory,
  DemographicSegment,
} from '../../types/userDemographics';

export type DashboardWidget = 'eventTimeline' | 'userOverview' | 'productOverview' | 'userDemographics' | 'eventSeverity'

interface Props {
  range: TimelineRange
  hideWidgets?: DashboardWidget[]
  hideLocationOverviewDetails?: boolean
}

const emptyEventAnalytics: EventAnalyticsData = {
  eventType: 'Cycling',
  minGForce: 0,
  maxGForce: 0,
  frontImpacts: 0,
  severityThreshold: '',
  highlightedPoint: { label: '', events: 0 },
  severityData: [],
  impactBreakdown: [],
  activeZone: 'front',
  activeZonePercent: 0,
}

export default function Dashboard({ range, hideWidgets = [], hideLocationOverviewDetails = false }: Props) {
  const hiddenWidgets = new Set(hideWidgets)
  const [timelineEntries, setTimelineEntries] = useState<EventTimelineEntry[]>([])
  const [timelineLoading, setTimelineLoading] = useState(true)
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [topEventsLoading, setTopEventsLoading] = useState(true)
  const [userOverviewLoading, setUserOverviewLoading] = useState(true)
  const [productOverviewLoading, setProductOverviewLoading] = useState(true)
  const [demographicsLoading, setDemographicsLoading] = useState(true)
  const [overviewSummary, setOverviewSummary] = useState<EventOverviewSummary>(eventOverviewFallbackSummary)
  const [overviewChartData, setOverviewChartData] = useState<EventTimelineDay[]>([])
  const [severityChartDataState, setSeverityChartDataState] = useState<SeverityTimelineWeek[]>([])
  const [eventAnalyticsData, setEventAnalyticsData] = useState<EventAnalyticsData>(emptyEventAnalytics)
  const [selectedAnalyticsVertical, setSelectedAnalyticsVertical] = useState<string>(emptyEventAnalytics.eventType)
  const [topEvents, setTopEvents] = useState<TopEvent[]>([])
  const [productOverviewCategoriesState, setProductOverviewCategoriesState] = useState<ProductOverviewCategory[]>([])
  const [userOverviewDataState, setUserOverviewDataState] = useState<UserOverviewCategory[]>([])
  const [userOverviewTotalState, setUserOverviewTotalState] = useState(0)
  const [userDemographicsCategoriesState, setUserDemographicsCategoriesState] = useState<DemographicCategory[]>([])

  useEffect(() => {
    console.log('[Dashboard] mount/effect', { range })
    let isMounted = true

    let pendingOverviewRequests = 3
    const resolveOverviewLoading = () => {
      pendingOverviewRequests -= 1
      if (pendingOverviewRequests === 0 && isMounted) {
        setOverviewLoading(false)
      }
    }

    setOverviewLoading(true)
    setUserOverviewLoading(true)
    setProductOverviewLoading(true)
    setDemographicsLoading(true)

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
      .finally(resolveOverviewLoading)

    dashboardService.getEventTimeseries(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as EventTimeseriesApiResponse
        setOverviewChartData(mapEventTimeseriesResponse(typedResponse, range))
      })
      .catch(() => {
        if (!isMounted) return
        setOverviewChartData([])
      })
      .finally(resolveOverviewLoading)

    dashboardService.getSeverityTimeseries(range)
      .then((response: unknown) => {
        if (!isMounted) return
        const typedResponse = response as SeverityTimeseriesApiResponse
        setSeverityChartDataState(mapSeverityTimeseriesResponse(typedResponse, range))
      })
      .catch(() => {
        if (!isMounted) return
        setSeverityChartDataState([])
      })
      .finally(resolveOverviewLoading)

    const extractLatestEventsData = (response: unknown): EventTimelineApiEvent[] | undefined => {
      if (Array.isArray(response)) {
        return response
      }

      if (!response || typeof response !== 'object') {
        return undefined
      }

      const dataField = (response as { data?: unknown }).data
      if (Array.isArray(dataField)) {
        return dataField
      }

      if (dataField && typeof dataField === 'object') {
        const nestedData = (dataField as { data?: unknown }).data
        if (Array.isArray(nestedData)) {
          return nestedData
        }
      }

      return undefined
    }

    console.log('[Dashboard] calling getLatestEvents')
    setTimelineLoading(true)
    dashboardService.getLatestEvents()
      .then((response: EventTimelineApiResponse | unknown) => {
        if (!isMounted) return
        console.log('[Dashboard] latest events response', response)

        const data = extractLatestEventsData(response)
        if (data && data.length > 0) {
          const entries = mapLatestEventsToTimelineEntries(data)
          console.log('[Dashboard] latest events mapped', entries.length, data)
          setTimelineEntries(entries)
        } else if (data) {
          console.warn('[Dashboard] latest events response contained no entries', response)
          setTimelineEntries([])
        } else {
          console.warn('[Dashboard] latest events response invalid:', response)
          setTimelineEntries([])
        }
      })
      .catch((error) => {
        if (!isMounted) return
        console.error('[Dashboard] getLatestEvents failed', error)
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
        setUserOverviewDataState([])
        setUserOverviewTotalState(0)
      })
      .finally(() => {
        if (!isMounted) return
        setUserOverviewLoading(false)
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
        setProductOverviewCategoriesState([])
      })
      .finally(() => {
        if (!isMounted) return
        setProductOverviewLoading(false)
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
        setUserDemographicsCategoriesState([])
      })
      .finally(() => {
        if (!isMounted) return
        setDemographicsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [range])

  useEffect(() => {
    let isMounted = true
    setTopEventsLoading(true)

    Promise.allSettled([
      dashboardService.getTopEvents(range, 'impact'),
      dashboardService.getTopEvents(range, 'gyro'),
    ])
      .then(async (results) => {
        if (!isMounted) return

        const loadEvent = async (result: PromiseSettledResult<unknown>, type: 'impact' | 'gyro') => {
          if (result.status !== 'fulfilled') {
            console.warn('[Dashboard] getTopEvents failed for', type, result.reason)
            return null
          }

          const topEventsResponse = result.value as import('../../types/topEventsApi').TopEventsApiResponse
          const topEvent = selectTopEventForType(topEventsResponse.data, type)
          if (!topEvent) {
            console.warn('[Dashboard] No top event found for', type, topEventsResponse.data)
            return null
          }

          try {
            const processedResponse = await dashboardService.getProcessedEvents(topEvent.eventId, type)
            const payload = processedResponse.data
            const sparklineData = mapProcessedEventResponseToSparkline(payload, type)
            if (sparklineData.length < 2) {
              console.warn('[Dashboard] Sparkline data has fewer than 2 points', type, sparklineData)
            }

            const createdAt =
              (!Array.isArray(payload) && payload?.createdAt) || topEvent.createdAt
            const mappedTopEvent = mapTopEventsApiEventToTopEvent(topEvent, type, {
              createdAt,
            })
            const derivedMetricValue =
              Math.round(
                Math.max(
                  0,
                  ...sparklineData.flatMap((point) =>
                    [point.xAxis, point.yAxis, point.zAxis].map((value) => Math.abs(value)),
                  ),
                ) * 10,
              ) / 10

            const metricValue = mappedTopEvent.metricValue || derivedMetricValue
            return {
              ...mappedTopEvent,
              data: sparklineData,
              metricValue,
            }
          } catch (error) {
            console.error('[Dashboard] Processed events request failed for', type, topEvent.eventId, error)
            return mapTopEventsApiEventToTopEvent(topEvent, type)
          }
        }

        const mappedEvents = await Promise.all([
          loadEvent(results[0], 'impact'),
          loadEvent(results[1], 'gyro'),
        ])

        const validEvents = mappedEvents.filter((event): event is TopEvent => event !== null)
        const orderedEvents = validEvents.slice().sort((a, b) => {
          const order = { impact: 0, gyro: 1 }
          return (order[a.type ?? 'gyro'] ?? 2) - (order[b.type ?? 'gyro'] ?? 2)
        })

        setTopEvents(orderedEvents)
      })
      .catch(() => {
        if (!isMounted) return
        setTopEvents([])
      })
      .finally(() => {
        if (!isMounted) return
        setTopEventsLoading(false)
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
            frontImpacts: 0,
            impactBreakdown: [],
          }))
        })
    } else {
      setEventAnalyticsData((previous) => ({
        ...previous,
        eventType: selectedAnalyticsVertical,
        frontImpacts: 0,
        impactBreakdown: [],
      }))
    }

    return () => {
      isMounted = false
    }
  }, [range, selectedAnalyticsVertical])

return (
    <div className={styles.dashboardScrollWrapper}>
      <main className={styles.dashboardPage}>
        <div className={styles.eventOverview}>
          <EventOverviewCard
            isLoading={overviewLoading}
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
          <TopEventsCard
            events={topEvents}
            isLoading={topEventsLoading}
            onEventClick={(event) => console.log('Navigate to event:', event.key)}
          />
        </div>
        {!hiddenWidgets.has('eventTimeline') && (
          <div className={styles.eventTimeline}>
            <EventTimelineCard entries={timelineEntries} isLoading={timelineLoading} />
          </div>
        )}
        {!hiddenWidgets.has('userOverview') && (
          <div className={styles.userOverview}>
            <UserOverviewCard
              data={userOverviewDataState}
              total={userOverviewTotalState}
              isLoading={userOverviewLoading}
              onExpand={() => console.log('Navigate to user details')}
            />
          </div>
        )}
        {!hiddenWidgets.has('productOverview') && (
          <div className={styles.productOverview}>
            <ProductOverviewCard categories={productOverviewCategoriesState} isLoading={productOverviewLoading} />
          </div>
        )}
        {!hiddenWidgets.has('userDemographics') && (
          <div className={styles.userDemographics}>
            <UserDemographicsCard
              categories={userDemographicsCategoriesState}
              isLoading={demographicsLoading}
            />
          </div>
        )}
        {!hiddenWidgets.has('eventSeverity') && (
          <div className={styles.eventSeverity}><EventSeverityHistogramCard isLoading={overviewLoading} /></div>
        )}
        <div className={styles.eventTime}>
          <EventTimeHeatmapCard range={range} />
        </div>
      </main>
    </div>
  )
}
