export type UserRole = 'admin' | 'operacional' | 'cliente';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleData {
  role: UserRole;
  updatedAt: string;
  updatedBy?: string;
}
