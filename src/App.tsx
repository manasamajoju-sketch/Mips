import { useState } from 'react'
import { type TimelineRange } from './Components/common/TimelineButton/TimelineButton'

import Header from './Components/Header/Header'
import Sidebar from './Components/Sidebar/Sidebar'
import Dashboard from './Pages/Dashboard/Dashboard'
import styles from './App.module.scss'

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [range, setRange] = useState<TimelineRange>('30d')

  return (
    <div className={styles.appShell}>
      <Header
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        range={range}
        onRangeChange={setRange}
      />

      <div className={styles.body}>
        <Sidebar collapsed={collapsed} />

        <main className={styles.content}>
          <Dashboard range={range} />
        </main>
      </div>
    </div>
  )
}

export default App