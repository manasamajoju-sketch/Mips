import { ComponentsIcon, EventsIcon, HomeIcon, UsersIcon } from '../common/Icons'
import styles from './Sidebar.module.scss'

interface Props {
  collapsed: boolean
}

const navItems = [
  { label: 'Home', icon: HomeIcon, active: true },
  { label: 'Users', icon: UsersIcon, active: false },
  { label: 'Events', icon: EventsIcon, active: false },
  { label: 'Components', icon: ComponentsIcon, active: false },
]

export default function Sidebar({ collapsed }: Props) {
  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <nav className={styles.tabs}>
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`${styles.tab} ${active ? styles.tabActive : ''}`}
            title={collapsed ? label : undefined}
          >
            <span className={styles.iconWrap}>
              <Icon className={styles.icon} />
            </span>
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}