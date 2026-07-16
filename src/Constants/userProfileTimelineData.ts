import type { UserProfileTimelineData } from '../types/userProfileTimeline';

export const userProfileTimelineMock: UserProfileTimelineData = {
  quinId: 'QUIN3423423544234',
  gender: 'Female',
  age: 22,
  location: 'London, UK',
  memberSinceLabel: 'User since 8 mo',
  tags: [
    { text: 'Construction', color: '#F5E642', textColor: '#5C5100' },
    { text: 'Moto', color: '#17364A', textColor: '#FFFFFF' },
  ],
  responders: [
    { id: 'resp-1', color: '#8B5CF6' },
    { id: 'resp-2', color: '#22A06B', initial: 'M' },
  ],
  timeline: [
    { id: 'step-1', labelLine1: 'Impact', labelLine2: 'Detected', date: '22/06/26', time: '6:57PM', outline: true },
    { id: 'step-2', labelLine1: 'SOS Beacon', labelLine2: 'Live', date: '22/06/26', time: '6:57PM' },
    { id: 'step-3', labelLine1: 'Emergency', labelLine2: 'SMS Sent', date: '22/06/26', time: '6:57PM' },
    { id: 'step-4', labelLine1: 'User Closed', labelLine2: 'Event', date: '22/06/26', time: '6:57PM' },
  ],
};
