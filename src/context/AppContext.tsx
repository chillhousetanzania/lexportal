import { createContext, useState, useContext, useCallback, type ReactNode } from 'react';
import type { UserProfile, CaseRecord, FinancialRecord, SharedResource, AuthState, AppContextValue, Credentials } from '../types';
import { seedUsers, seedCases, seedFinancialRecords, seedSharedResources } from '../data/seedData';
import { createSession, useSessionManagement, isSessionValid } from '../hooks/useSessionManagement';
import { useNotifications } from '../hooks/useNotifications';

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(seedUsers);
  const [cases, setCases] = useState<CaseRecord[]>(seedCases);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(seedFinancialRecords);
  const [sharedResources, setSharedResources] = useState<SharedResource[]>(seedSharedResources);
  const [currentPage, setCurrentPage] = useState('login');

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    sessionToken: null,
    sessionExpiry: null,
  });

  const { notifications, addNotification, removeNotification } = useNotifications();

  const login = useCallback(async (credentials: Credentials) => {
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status !== 'active') {
      throw new Error('Your account is inactive. Please contact an administrator.');
    }

    const { token, expiry } = createSession();

    setAuthState({
      isAuthenticated: true,
      user,
      sessionToken: token,
      sessionExpiry: expiry,
    });

    setCurrentPage('dashboard');
    addNotification('success', `Welcome back, ${user.name}`);
  }, [users, addNotification]);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      sessionToken: null,
      sessionExpiry: null,
    });
    setCurrentPage('login');
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;
      return { ...prev, user: { ...prev.user, ...updates } };
    });
  }, []);

  const checkSession = useCallback((): boolean => {
    return isSessionValid(authState);
  }, [authState]);

  useSessionManagement(authState, logout);

  const value: AppContextValue = {
    authState,
    login,
    logout,
    updateUser,
    checkSession,
    users,
    setUsers,
    cases,
    setCases,
    financialRecords,
    setFinancialRecords,
    sharedResources,
    setSharedResources,
    currentPage,
    setCurrentPage,
    notifications,
    addNotification,
    removeNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export { AppContext };
