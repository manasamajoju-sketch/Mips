import UsersAnalyticsCard from '../../Components/widgets/UsersAnalyticsCard/UsersAnalyticsCard'
import UsersOverviewCard from '../../Components/widgets/UsersOverviewCard/UsersOverviewCard'
import LocationOverviewCard from '../../Components/widgets/LocationOverviewCard/LocationOverviewCard'
import TopEventsCard from '../../Components/widgets/TopEventsCard/TopEventsCard'
import { rotationalEventsMock } from '../../Constants/topEventsMock'
import EventTimeHeatmapCard from '../../Components/cards/EventTimeHeatmap/EventTimeHeatmapCard'
import HighestLifetimeImpactsCard from '../../Components/cards/HighestLifetimeImpacts/HighestLifetimeImpactsCard'
import UserDemographicsCard from '../../Components/cards/UserDemographics/UserDemographicsCard'
// import AllEventsTable from '../../Components/tables/AllEventsTable'
import styles from './UsersPage.module.scss'
import UserListTable from '../../Components/tables/UserListTable'

export default function UsersPage() {
  return (
    <section className={styles.page}>
      <div className={styles.heroCard}>
        <UsersOverviewCard />
      </div>

      <div className={styles.analyticsCard}>
        <UsersAnalyticsCard />
      </div>

      <div className={styles.locationCard}>
        <LocationOverviewCard
          hideHeaderControls
          hideSummary
          compact
        />
      </div>

      <div className={styles.highestLifetimeCard}>
        <HighestLifetimeImpactsCard />
      </div>

      <div className={styles.demographicsCard}>
        <UserDemographicsCard />
      </div>

      <div className={styles.highestImpactCard}>
        <TopEventsCard  
        
        />
      </div>


      <div className={styles.userList}>
        <UserListTable />
      </div>
    </section>
  )
}
