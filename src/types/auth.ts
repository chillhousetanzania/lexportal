import type { UserProfile, Credentials } from './user';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  sessionToken: string | null;
  sessionExpiry: Date | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AppContextValue {
  authState: AuthState;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  checkSession: () => boolean;

  // Data stores
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  cases: import('./case').CaseRecord[];
  setCases: React.Dispatch<React.SetStateAction<import('./case').CaseRecord[]>>;
  financialRecords: import('./financial').FinancialRecord[];
  setFinancialRecords: React.Dispatch<React.SetStateAction<import('./financial').FinancialRecord[]>>;
  sharedResources: import('./shared').SharedResource[];
  setSharedResources: React.Dispatch<React.SetStateAction<import('./shared').SharedResource[]>>;

  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
}
