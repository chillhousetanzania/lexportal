import React from 'react';
import { useApp } from '../../context/AppContext';

interface AuthenticationGuardProps {
  children: React.ReactNode;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }) => {
  const { authState, checkSession, logout } = useApp();

  if (!authState.isAuthenticated) {
    return null;
  }

  if (!checkSession()) {
    logout();
    return null;
  }

  return <>{children}</>;
};
