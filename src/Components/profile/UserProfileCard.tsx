import type { UserProfileData } from '../../types/userProfile';
import { userProfileMock } from '../../Constants/userProfileData';
import styles from './UserProfileCard.module.scss';

interface UserProfileCardProps {
  profile?: UserProfileData;
  onBack?: () => void;
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" strokeLinecap="round" />
      <polyline points="11,6 5,12 11,18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className={styles.infoIcon} viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <line x1="12" y1="10.75" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GenderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,7 12,12 16,14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AvatarPlaceholder() {
  return (
    <div className={styles.avatar}>
      <svg viewBox="0 0 24 24" width="60%" height="60%" fill="rgba(255,255,255,0.75)" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    </div>
  );
}

export default function UserProfileCard({ profile = userProfileMock, onBack }: UserProfileCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <button type="button" className={styles.backButton} onClick={onBack} aria-label="Go back">
            <BackIcon />
          </button>
          <span>User Profile</span>
          <InfoIcon />
        </div>
        <span className={styles.logo}>quin</span>
      </div>

      <div className={styles.identity}>
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className={styles.avatarImage} />
        ) : (
          <AvatarPlaceholder />
        )}
        <span className={styles.quinId}>{profile.quinId}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.metaRow}>
        <span className={styles.metaItem}>
          <GenderIcon />
          {profile.gender} | {profile.age} Y
        </span>
        <span className={styles.metaItem}>
          <LocationIcon />
          {profile.location}
        </span>
        <span className={styles.metaItem}>
          <ClockIcon />
          {profile.memberSinceLabel}
        </span>
      </div>

      <div className={styles.tags}>
        {profile.tags.map((tag) => (
          <span
            key={tag.text}
            className={styles.tag}
            style={{ background: tag.color, color: tag.textColor }}
          >
            {tag.text}
          </span>
        ))}
      </div>

      <div className={styles.stats}>
        {profile.stats.map((stat) => (
          <div className={styles.stat} key={`${stat.labelLine1}-${stat.labelLine2}`}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>
              {stat.labelLine1}
              <br />
              {stat.labelLine2}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
