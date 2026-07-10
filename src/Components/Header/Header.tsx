import Pill from '../common/pills/pill'
import TimelineButton, { type TimelineRange } from '../common/TimelineButton/TimelineButton'
import { MenuIcon } from '../common/Icons'
import styles from './Header.module.scss'

interface Props {
  collapsed: boolean
  onToggle: () => void
  range: TimelineRange
  onRangeChange: (range: TimelineRange) => void
}

export default function Header({ collapsed, onToggle, range, onRangeChange }: Props) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <MenuIcon className={styles.menuIcon} />
      </button>

      <div className={styles.brand}>
        <span className={styles.brandMark}>quin</span>
      </div>

      <div className={styles.spacer} />

      <TimelineButton value={range} onChange={onRangeChange} />

      <Pill text="Mips" color="#eef23f" textColor="#1c1c1c" />
    </header>
  )
}