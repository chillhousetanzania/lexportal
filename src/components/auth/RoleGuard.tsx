import React from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback }) => {
  const { authState } = useApp();

  if (!authState.user || !allowedRoles.includes(authState.user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
