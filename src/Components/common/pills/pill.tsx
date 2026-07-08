import styles from './pill.module.scss'

interface PillProps {
  text: string
  color: string
  textColor?: string
}

export default function Pill({ text, color, textColor }: PillProps) {
  return (
    <span className={styles.pill} style={{ backgroundColor: color, color: textColor }}>
      {text}
    </span>
  )
}