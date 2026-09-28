import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { DutyLogEntry, DutyStatus } from '../types';
import { BREAK_STATUSES, MIN_DRIVING_MINUTES_BEFORE_BREAK, MIN_KM_BEFORE_BREAK, MOCK_AVG_SPEED_KMPH } from '../constant/DutyStatus';

// Thrown by setStatus when the driver tries to take a break before the
// minimum drive time/distance since the trip started has been covered.
export class DutyStatusRestrictedError extends Error {
  remainingMinutes: number;
  remainingKm: number;
  constructor(remainingMinutes: number, remainingKm: number) {
    super('Break not allowed yet — minimum drive time/distance not met');
    this.remainingMinutes = remainingMinutes;
    this.remainingKm = remainingKm;
  }
}

type DutyStatusContextValue = {
  status: DutyStatus;
  log: DutyLogEntry[];
  setStatus: (status: DutyStatus) => Promise<void>;
};

const DutyStatusContext = createContext<DutyStatusContextValue | null>(null);

// Walks the log (newest first) to find when the current uninterrupted
// driving/on_duty streak began — the trip "clock" the break rule reads.
// Returns null once a break (off_duty/sleeper) is the most recent entry.
function deriveDrivingStartedAt(entries: DutyLogEntry[]): string | null {
  if (entries.length === 0 || BREAK_STATUSES.includes(entries[0].status)) return null;
  let start = entries[0];
  for (const entry of entries) {
    if (BREAK_STATUSES.includes(entry.status)) break;
    start = entry;
  }
  return start.changed_at;
}

export function DutyStatusProvider({ children }: { children: React.ReactNode }) {
  const { driver } = useAuth();
  const [log, setLog] = useState<DutyLogEntry[]>([]);
  const [drivingStartedAt, setDrivingStartedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!driver) {
      setLog([]);
      setDrivingStartedAt(null);
      return;
    }
    let mounted = true;

    supabase
      .from('duty_logs')
      .select('id, status, changed_at')
      .eq('driver_id', driver.id)
      .order('changed_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!mounted) return;
        const entries = data ?? [];
        setLog(entries);
        setDrivingStartedAt(deriveDrivingStartedAt(entries));
      });

    return () => {
      mounted = false;
    };
  }, [driver]);

  const status: DutyStatus = log[0]?.status ?? 'off_duty';

  const value = useMemo<DutyStatusContextValue>(
    () => ({
      status,
      log,
      setStatus: async (next: DutyStatus) => {
        if (!driver || next === status) return;

        if (BREAK_STATUSES.includes(next) && drivingStartedAt) {
          const elapsedMinutes = (Date.now() - new Date(drivingStartedAt).getTime()) / 60000;
          const elapsedKm = (elapsedMinutes / 60) * MOCK_AVG_SPEED_KMPH;
          if (elapsedMinutes < MIN_DRIVING_MINUTES_BEFORE_BREAK || elapsedKm < MIN_KM_BEFORE_BREAK) {
            throw new DutyStatusRestrictedError(
              Math.max(1, Math.ceil(MIN_DRIVING_MINUTES_BEFORE_BREAK - elapsedMinutes)),
              Math.max(1, Math.ceil(MIN_KM_BEFORE_BREAK - elapsedKm)),
            );
          }
        }

        const changedAt = new Date().toISOString();
        const optimisticId = `local-${Date.now()}`;
        const prevDrivingStartedAt = drivingStartedAt;
        setLog(prev => [{ id: optimisticId, status: next, changed_at: changedAt }, ...prev]);
        if (next === 'driving' && !drivingStartedAt) setDrivingStartedAt(changedAt);
        if (BREAK_STATUSES.includes(next)) setDrivingStartedAt(null);

        const { error } = await supabase.from('duty_logs').insert({ driver_id: driver.id, status: next });
        if (error) {
          // Roll back the optimistic entry so the UI doesn't claim a status
          // change was saved when it wasn't (e.g. duty_logs migration not
          // run yet), and surface the real error to the caller.
          console.error('Failed to save duty status change', error);
          setLog(prev => prev.filter(entry => entry.id !== optimisticId));
          setDrivingStartedAt(prevDrivingStartedAt);
          throw error;
        }
      },
    }),
    [status, log, driver, drivingStartedAt],
  );

  return <DutyStatusContext.Provider value={value}>{children}</DutyStatusContext.Provider>;
}

export function useDutyStatus() {
  const ctx = useContext(DutyStatusContext);
  if (!ctx) throw new Error('useDutyStatus must be used within DutyStatusProvider');
  return ctx;
}
