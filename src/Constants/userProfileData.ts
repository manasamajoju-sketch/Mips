import type { UserProfileData } from '../types/userProfile';

export const userProfileMock: UserProfileData = {
  quinId: 'QUIN3423423544234',
  gender: 'Female',
  age: 22,
  location: 'London, UK',
  memberSinceLabel: 'User since 8 mo',
  tags: [
    { text: 'Construction', color: '#F5E642', textColor: '#5C5100' },
    { text: 'Moto', color: '#17364A', textColor: '#FFFFFF' },
  ],
  stats: [
    { value: '02', labelLine1: 'Products', labelLine2: 'Registered' },
    { value: '30 days', labelLine1: 'Time Since', labelLine2: 'Last Use' },
    { value: '12 days', labelLine1: 'Time Since', labelLine2: 'Last Impact' },
  ],
};
