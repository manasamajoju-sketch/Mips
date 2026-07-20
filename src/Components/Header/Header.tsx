import TimelineButton, { type TimelineRange } from '../common/TimelineButton/TimelineButton'
import { MenuIcon } from '../common/Icons'
import QuinLogo from '../../assets/Quin Logo.svg'
import MipsLogo from '../../assets/Mips Logo.png'
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
        <img src={QuinLogo} alt="Quin logo" className={styles.brandLogo} />
      </div>

      <div className={styles.spacer} />

      <TimelineButton value={range} onChange={onRangeChange} />

      <img src={MipsLogo} alt="Mips logo" className={styles.mipsLogo} />
    </header>
  )
}