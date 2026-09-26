import type { DutyStatus } from '../types';

export type DutyDaySummary = {
  date: string;
  hours: Record<DutyStatus, number>;
};

export const mockDutyHistory: DutyDaySummary[] = [
  { date: '2026-09-20', hours: { off_duty: 9, sleeper: 8, driving: 6, on_duty: 1 } },
  { date: '2026-09-19', hours: { off_duty: 10, sleeper: 8, driving: 5, on_duty: 1 } },
  { date: '2026-09-18', hours: { off_duty: 8, sleeper: 9, driving: 6.5, on_duty: 0.5 } },
  { date: '2026-09-17', hours: { off_duty: 11, sleeper: 8, driving: 4, on_duty: 1 } },
  { date: '2026-09-16', hours: { off_duty: 9, sleeper: 8, driving: 6, on_duty: 1 } },
];
