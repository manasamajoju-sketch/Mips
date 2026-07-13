export interface VerticalStyle {
  background: string;
  color: string;
}

export interface UserListRow {
  id: string;
  quinId: string;
  numberOfEvents: number;
  numberOfProducts: number;
  verticals: string[];
}
