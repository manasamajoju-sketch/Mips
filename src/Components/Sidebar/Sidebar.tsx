import { EventsIcon, HomeIcon, UsersIcon } from '../common/Icons'
import styles from './Sidebar.module.scss'

export type SidebarItem = 'home' | 'events' | 'event' | 'users' | 'user' | 'components'

interface Props {
  collapsed: boolean
  activeItem: SidebarItem
  onNavigate: (item: SidebarItem) => void
}

const navItems: Array<{ key: SidebarItem; label: string; icon: typeof HomeIcon }> = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'events', label: 'Events', icon: EventsIcon },
  { key: 'event', label: 'Event', icon: EventsIcon },
  { key: 'users', label: 'Users', icon: UsersIcon },
  { key: 'user', label: 'User', icon: UsersIcon },
  // { key: 'components', label: 'Components', icon: ComponentsIcon },
]

export default function Sidebar({ activeItem, onNavigate }: Props) {
  return (
    <aside className={`${styles.sidebar} ${styles.collapsed}`}>
      <nav className={styles.tabs}>
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`${styles.tab} ${activeItem === key ? styles.tabActive : ''}`}
            title={label}
            onClick={() => onNavigate(key)}
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