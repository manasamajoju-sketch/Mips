import UserProfileCard from '../../Components/profile/UserProfileCard';
import styles from './UserDetails.module.scss';

export default function UserDetails() {
  return (
    <div className={styles.page}>
      <UserProfileCard onBack={() => console.log('Navigate back')} />
    </div>
  );
}
