import type { DutyLogEntry, DutyStatus } from '../types';
import { DUTY_STATUS_ORDER } from '../constant/DutyStatus';

export type DutyDaySummary = {
  date: string; // YYYY-MM-DD
  hours: Record<DutyStatus, number>;
};

function emptyHours(): Record<DutyStatus, number> {
  return DUTY_STATUS_ORDER.reduce((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {} as Record<DutyStatus, number>);
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Turns raw duty_logs rows (one per status change) into per-day hour
// totals for the history bar chart. Each row's status holds until the next
// row (or "now" for the most recent one); a segment that crosses midnight
// is split so each day's total only counts the hours actually inside it.
export function buildDutyHistory(entries: DutyLogEntry[], days = 7): DutyDaySummary[] {
  const sorted = [...entries].sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);

  const totals = new Map<string, Record<DutyStatus, number>>();

  for (let i = 0; i < sorted.length; i++) {
    const segStart = new Date(sorted[i].changed_at);
    const segEnd = i + 1 < sorted.length ? new Date(sorted[i + 1].changed_at) : now;
    if (segEnd <= cutoff) continue;

    const status = sorted[i].status;
    let cursor = segStart < cutoff ? new Date(cutoff) : segStart;

    while (cursor < segEnd) {
      const dayEnd = new Date(cursor);
      dayEnd.setHours(24, 0, 0, 0);
      const sliceEnd = dayEnd < segEnd ? dayEnd : segEnd;
      const hours = (sliceEnd.getTime() - cursor.getTime()) / 3600000;

      const key = dayKey(cursor);
      const existing = totals.get(key) ?? emptyHours();
      existing[status] += hours;
      totals.set(key, existing);

      cursor = sliceEnd;
    }
  }

  const result: DutyDaySummary[] = [];
  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const key = dayKey(date);
    const hours = totals.get(key) ?? emptyHours();
    (Object.keys(hours) as DutyStatus[]).forEach(s => {
      hours[s] = Math.round(hours[s] * 10) / 10;
    });
    result.push({ date: key, hours });
  }
  return result;
}
