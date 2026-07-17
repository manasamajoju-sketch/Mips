import { useState } from 'react'
import { type TimelineRange } from './Components/common/TimelineButton/TimelineButton'

import Header from './Components/Header/Header'
import Sidebar, { type SidebarItem } from './Components/Sidebar/Sidebar'
import Dashboard from './Pages/Dashboard/Dashboard'
import EventsPage from './Pages/Events/EventsPage'
import EventPage from './Pages/Event/EventPage'
import UsersPage from './Pages/Users/UsersPage'
import UserPage from './Pages/User/UserPage'
import styles from './App.module.scss'

function App() {
  const [range, setRange] = useState<TimelineRange>('30d')
  const [activePage, setActivePage] = useState<SidebarItem>('home')

  const renderContent = () => {
    switch (activePage) {
      case 'events':
        return <EventsPage range={range} />
      case 'event':
        return <EventPage />
      case 'users':
        return <UsersPage />
      case 'user':
        return <UserPage />
      case 'components':
        return <div>Components view coming soon.</div>
      case 'home':
      default:
        return <Dashboard range={range} />
    }
  }

  return (
    <div className={styles.appShell}>
      <Header
        range={range}
        onRangeChange={setRange}
      />

      <div className={styles.body}>
        <Sidebar activeItem={activePage} onNavigate={setActivePage} />

        <main className={styles.content}>{renderContent()}</main>
      </div>
    </div>
  )
}

export default App