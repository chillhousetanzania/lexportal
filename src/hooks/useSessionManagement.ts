import { useEffect, useCallback, useRef } from 'react';
import type { AuthState } from '../types';

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export const createSession = (): { token: string; expiry: Date } => {
  const token = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  const expiry = new Date(Date.now() + SESSION_DURATION_MS);
  return { token, expiry };
};

export const isSessionValid = (authState: AuthState): boolean => {
  if (!authState.isAuthenticated || !authState.sessionToken || !authState.sessionExpiry) {
    return false;
  }
  return new Date(authState.sessionExpiry).getTime() > Date.now();
};

export const useSessionManagement = (
  authState: AuthState,
  logout: () => void,
) => {
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const checkSession = useCallback((): boolean => {
    return isSessionValid(authState);
  }, [authState]);

  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      if (!isSessionValid(authState)) {
        logoutRef.current();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [authState]);

  return { checkSession };
};
