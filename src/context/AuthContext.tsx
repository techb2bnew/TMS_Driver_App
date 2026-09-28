import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Driver } from '../types';

export class InvalidCredentialsError extends Error {}

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  driver: Driver | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ProfileRow = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  role: string;
  drivers: { license_number: string | null; status: Driver['status'] } | null;
};

// Only a 'driver'-role profile with a matching drivers row counts as a
// valid driver-app session — an admin/dispatcher account exists in the same
// `profiles` table but has no business signing in here.
async function loadDriverProfile(userId: string): Promise<Driver | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, email, role, drivers(license_number, status)')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  const row = data as unknown as ProfileRow;
  if (row.role !== 'driver') return null;

  return {
    id: row.id,
    full_name: row.full_name,
    phone: row.phone ?? '',
    email: row.email ?? undefined,
    license_number: row.drivers?.license_number ?? '',
    status: row.drivers?.status ?? 'inactive',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id;
      const profile = userId ? await loadDriverProfile(userId) : null;
      if (mounted) {
        setDriver(profile);
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (mounted) setDriver(null);
        return;
      }
      loadDriverProfile(session.user.id).then(profile => {
        if (mounted) setDriver(profile);
      });
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: driver !== null,
      isLoading,
      driver,
      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error || !data.user) throw new InvalidCredentialsError(error?.message ?? 'Invalid email or password');

        const profile = await loadDriverProfile(data.user.id);
        if (!profile) {
          await supabase.auth.signOut();
          throw new InvalidCredentialsError('This account is not a driver account');
        }
        setDriver(profile);
      },
      logout: () => {
        supabase.auth.signOut();
        setDriver(null);
      },
      // No self-serve delete endpoint yet — this only simulates submitting
      // the request; ProfileScreen shows a success state, then logs out.
      deleteAccount: async () => {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 900));
      },
    }),
    [driver, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
