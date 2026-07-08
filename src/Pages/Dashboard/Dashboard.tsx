import EventAnalyticsCard from '../../Components/widgets/EventAnalyticsCard/EventAnalyticsCard'
import { eventAnalyticsMock } from '../../Constants/eventAnalyticsMock'
import EventOverviewCard from '../../Components/cards/EventOverview/EventOverviewCard';

import './Dashboard.module.scss'
import LocationOverviewCard from '../../Components/widgets/LocationOverviewCard/LocationOverviewCard';
import TopEventsCard from '../../Components/widgets/TopEventsCard/TopEventsCard';
import EventTimelineCard from '../../Components/cards/EventTimeline/EventTimelineCard';
import UserDemographicsCard from '../../Components/cards/UserDemographics/UserDemographicsCard';
import EventTimeHeatmapCard from '../../Components/cards/EventTimeHeatmap/EventTimeHeatmapCard';



export default function Dashboard() {
  return (
    <main className="dashboard-page">
      <EventAnalyticsCard
        data={eventAnalyticsMock}
        eventTypes={['Cycling', 'Running', 'Driving']}
        onEventTypeChange={(type) => console.log('Event type changed:', type)}
        onExpand={() => console.log('Expand event analytics')}
      />
    <EventOverviewCard onExpand={() => console.log('Navigate to event details')} />
        <LocationOverviewCard onExpand={() => console.log('Navigate to location details')} />
           <TopEventsCard onEventClick={(event) => console.log('Navigate to event:', event.key)} />
                  <EventTimelineCard />
                  <UserDemographicsCard onExpand={() => console.log('Navigate to user demographics details')} />
                  <EventTimeHeatmapCard />

    </main>
  )
}
