import type { UserProfileTag } from './userProfile';

export interface ProfileTimelineStep {
  id: string;
  labelLine1: string;
  labelLine2: string;
  date: string;
  time: string;
  // outline (hollow) dot vs filled dot - the first/current step is typically hollow
  outline?: boolean;
}

export interface AssignedResponder {
  id: string;
  initial?: string;
  color: string;
  avatarUrl?: string;
}

export interface UserProfileTimelineData {
  quinId: string;
  avatarUrl?: string;
  gender: string;
  age: number;
  location: string;
  memberSinceLabel: string;
  tags: UserProfileTag[];
  responders: AssignedResponder[];
  timeline: ProfileTimelineStep[];
}
