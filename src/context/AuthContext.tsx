import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockDriver } from '../mock/driver';
import { MOCK_DRIVER_CREDENTIALS } from '../constant/auth';
import type { Driver } from '../types';

export class InvalidCredentialsError extends Error {}

type AuthContextValue = {
  isAuthenticated: boolean;
  driver: Driver | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Mock phase: no Supabase auth wired up yet, so this just simulates the
// round trip against MOCK_DRIVER_CREDENTIALS. Swap the body of `login` for a
// real supabase.auth call and this context needs no other changes — every
// screen already reads through it.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [driver, setDriver] = useState<Driver | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: driver !== null,
      driver,
      login: async (email: string, password: string) => {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 700));
        const matches =
          email.trim().toLowerCase() === MOCK_DRIVER_CREDENTIALS.email.toLowerCase() &&
          password === MOCK_DRIVER_CREDENTIALS.password;
        if (!matches) throw new InvalidCredentialsError('Invalid email or password');
        setDriver(mockDriver);
      },
      logout: () => setDriver(null),
      // Submits the deletion request only — doesn't clear the session.
      // The caller shows a success state, then calls `logout` once the user
      // dismisses it (see ProfileScreen), so the app doesn't yank the
      // screen out from under them mid-confirmation.
      deleteAccount: async () => {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 900));
      },
    }),
    [driver],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
