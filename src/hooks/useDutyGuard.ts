import { useState } from 'react';
import { useDutyStatus } from '../context/DutyStatusContext';
import { BREAK_STATUSES } from '../constant/DutyStatus';

// Gates any load-related submission (status update, expense, ad-hoc stop)
// behind the driver being 'driving' or 'on_duty' — off_duty/sleeper means
// they shouldn't be actioning loads at all.
export function useDutyGuard() {
  const { status } = useDutyStatus();
  const [blocked, setBlocked] = useState(false);

  function requireActiveDuty(): boolean {
    if (BREAK_STATUSES.includes(status)) {
      setBlocked(true);
      return false;
    }
    return true;
  }

  return { requireActiveDuty, blocked, dismissBlocked: () => setBlocked(false) };
}
