import styles from './UserPage.module.scss'

export default function UserPage() {
  return (
    <section className={styles.page}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>Profile</p>
        <h2 className={styles.title}>User</h2>
        <p className={styles.description}>A standalone user detail page for showing individual profile information.</p>
      </div>
    </section>
  )
}
