import styles from './EventPage.module.scss'

export default function EventPage() {
  return (
    <section className={styles.page}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>Insights</p>
        <h2 className={styles.title}>Event</h2>
        <p className={styles.description}>A standalone event detail page for reviewing a single event in full.</p>
      </div>
    </section>
  )
}
