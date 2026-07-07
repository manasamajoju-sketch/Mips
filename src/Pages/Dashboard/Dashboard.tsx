import EventAnalyticsCard from '../../Components/widgets/EventAnalyticsCard/EventAnalyticsCard'
import { eventAnalyticsMock } from '../../Constants/eventAnalyticsMock'
import EventOverviewCard from '../../Components/cards/EventOverview/EventOverviewCard';

import './Dashboard.scss'

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
    </main>
  )
}
