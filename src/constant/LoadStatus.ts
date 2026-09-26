import {
  blueColor,
  dangerColor,
  dutyDrivingColor,
  okColor,
  purpleColor,
  warnColor,
} from './Color';
import type { LoadStatus } from '../types';

export const LOAD_STATUS_META: Record<LoadStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: warnColor },
  assigned: { label: 'Assigned', color: blueColor },
  picked_up: { label: 'Picked Up', color: purpleColor },
  in_transit: { label: 'In Transit', color: dutyDrivingColor },
  delivered: { label: 'Delivered', color: okColor },
  cancelled: { label: 'Cancelled', color: dangerColor },
};

// What a driver can move a load to next, and the action label for that step.
// `pending` isn't listed — a load only becomes actionable once dispatch assigns it.
export const NEXT_LOAD_STATUS: Partial<Record<LoadStatus, { status: LoadStatus; actionLabel: string }>> = {
  assigned: { status: 'picked_up', actionLabel: 'Confirm Pickup' },
  picked_up: { status: 'in_transit', actionLabel: 'Start Trip' },
  in_transit: { status: 'delivered', actionLabel: 'Confirm Delivery' },
};
