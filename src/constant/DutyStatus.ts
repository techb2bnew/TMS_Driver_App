import {
  dutyDrivingColor,
  dutyOffColor,
  dutyOnDutyColor,
  dutySleeperColor,
} from './Color';
import type { DutyStatus } from '../types';

export const DUTY_STATUS_META: Record<DutyStatus, { label: string; color: string }> = {
  off_duty: { label: 'Off Duty', color: dutyOffColor },
  sleeper: { label: 'Sleeper', color: dutySleeperColor },
  driving: { label: 'Driving', color: dutyDrivingColor },
  on_duty: { label: 'On Duty', color: dutyOnDutyColor },
};

export const DUTY_STATUS_ORDER: DutyStatus[] = ['off_duty', 'sleeper', 'driving', 'on_duty'];

// 'off_duty' and 'sleeper' are the two statuses that count as "taking a
// break" — switching into either of these is what the minimum-drive-time /
// minimum-distance rule below gates.
export const BREAK_STATUSES: DutyStatus[] = ['off_duty', 'sleeper'];

// Placeholder HOS-style rule — confirm the real thresholds with the business
// before this goes live; easy to retune since they're named constants.
export const MIN_DRIVING_MINUTES_BEFORE_BREAK = 240; // 4h
export const MIN_KM_BEFORE_BREAK = 150;

// No live GPS/odometer feed yet in the mock phase, so km driven since the
// trip started is simulated from elapsed time at this average speed. Swap
// for the real distance (from driver_locations) once that's wired up.
export const MOCK_AVG_SPEED_KMPH = 45;
