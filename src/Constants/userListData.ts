import type { UserListRow, VerticalStyle } from '../types/userList';

// falls back to VERTICAL_FALLBACK_STYLE for any vertical name not listed here
export const VERTICAL_COLORS: Record<string, VerticalStyle> = {
  Moto: { background: '#14A6BE', color: '#FFFFFF' },
  Construction: { background: '#F5E642', color: '#3D3600' },
  Cycling: { background: '#7DDBEA', color: '#0B2530' },
  PPE: { background: '#17364A', color: '#FFFFFF' },
};

export const VERTICAL_FALLBACK_STYLE: VerticalStyle = { background: '#D8DEE5', color: '#3D4650' };

export const userListRows: UserListRow[] = Array.from({ length: 10 }, (_, index) => ({
  id: `user-${index + 1}`,
  quinId: '123456789101112',
  numberOfEvents: index === 0 ? 12 : 11,
  numberOfProducts: index === 0 ? 2 : 1,
  verticals: ['Moto', 'Construction'],
}));
