import styles from './UsersPage.module.scss'

export default function UsersPage() {
  return (
    <section className={styles.page}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>People</p>
        <h2 className={styles.title}>Users</h2>
        <p className={styles.description}>A dedicated users overview page for managing and reviewing user data.</p>
      </div>
    </section>
  )
}
