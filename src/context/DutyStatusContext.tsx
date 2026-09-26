import React, { createContext, useContext, useMemo, useState } from 'react';
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
  setStatus: (status: DutyStatus) => void;
};

const DutyStatusContext = createContext<DutyStatusContextValue | null>(null);

export function DutyStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatusState] = useState<DutyStatus>('off_duty');
  const [log, setLog] = useState<DutyLogEntry[]>([
    { id: 'log-1', status: 'off_duty', changed_at: new Date().toISOString() },
  ]);
  // Set when the driver starts driving, cleared once they successfully take
  // a break — the trip "clock" the minimum drive time/distance rule reads.
  const [drivingStartedAt, setDrivingStartedAt] = useState<string | null>(null);

  const value = useMemo<DutyStatusContextValue>(
    () => ({
      status,
      log,
      setStatus: (next: DutyStatus) => {
        if (next === status) return;

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

        setStatusState(next);
        setLog(prev => [{ id: `log-${prev.length + 1}`, status: next, changed_at: new Date().toISOString() }, ...prev]);

        if (next === 'driving' && !drivingStartedAt) setDrivingStartedAt(new Date().toISOString());
        if (BREAK_STATUSES.includes(next)) setDrivingStartedAt(null);
      },
    }),
    [status, log, drivingStartedAt],
  );

  return <DutyStatusContext.Provider value={value}>{children}</DutyStatusContext.Provider>;
}

export function useDutyStatus() {
  const ctx = useContext(DutyStatusContext);
  if (!ctx) throw new Error('useDutyStatus must be used within DutyStatusProvider');
  return ctx;
}
