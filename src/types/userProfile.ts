export interface UserProfileTag {
  text: string;
  color: string;
  textColor: string;
}

export interface UserProfileStat {
  value: string;
  labelLine1: string;
  labelLine2: string;
}

export interface UserProfileData {
  quinId: string;
  avatarUrl?: string;
  gender: string;
  age: number;
  location: string;
  memberSinceLabel: string;
  tags: UserProfileTag[];
  stats: UserProfileStat[];
}
