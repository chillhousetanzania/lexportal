export type UserRole = 'admin' | 'accountant' | 'litigator' | 'advisory';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  canShareDocuments: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface Credentials {
  email: string;
  password: string;
}
