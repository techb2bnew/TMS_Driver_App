// Mirrors supabase/schema.sql so mock data and the real backend line up
// exactly once Supabase is connected — no reshaping needed later.

export type LoadStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type Load = {
  id: string;
  // Human-readable "LD-1042" label — `id` (a uuid) is the real key used for
  // lookups/updates, `load_number` is what's shown on screen.
  load_number: string;
  customer_name: string;
  customer_contact?: string | null;
  pickup_location: string;
  drop_location: string;
  weight_kg: number;
  rate: number;
  status: LoadStatus;
  created_at: string;
  delivered_at?: string | null;
};

export type Driver = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  license_number: string;
  status: 'active' | 'inactive';
};

export type ExpenseCategory = 'Fuel' | 'Tolls' | 'Maintenance' | 'Insurance' | 'Other';
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export type Expense = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  load_id?: string | null;
  notes?: string;
  status: ExpenseStatus;
  created_at: string;
};

export type LoadDocumentType = 'rate_confirmation' | 'bol' | 'other';

export type LoadDocument = {
  id: string;
  load_id: string;
  type: LoadDocumentType;
  file_url: string;
  uploaded_at: string;
};

// Proof of delivery — driver's own upload, separate from load_documents
// (dispatcher-attached rate confirmation / BOL).
export type PodDocument = {
  id: string;
  load_id: string;
  file_url: string;
  uploaded_at: string;
};

export type SettlementStatus = 'unpaid' | 'paid';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type DutyStatus = 'off_duty' | 'sleeper' | 'driving' | 'on_duty';

export type DutyLogEntry = {
  id: string;
  status: DutyStatus;
  changed_at: string;
};

// Backed by `load_stops` — pickup/drop are auto-seeded from a load's own
// pickup_location/drop_location, dispatch can add real waypoints/distances/
// ETAs, and the driver can add their own ad-hoc waypoint mid-trip.
export type RouteStopType = 'pickup' | 'waypoint' | 'drop';
export type RouteStopStatus = 'completed' | 'current' | 'upcoming';

export type RouteStop = {
  id: string;
  type: RouteStopType;
  label: string;
  address: string;
  city: string;
  contactName?: string;
  contactPhone?: string;
  // Empty until dispatch (or, for a driver-added waypoint, the driver) sets
  // one — screens should treat '' the same as "no ETA yet".
  eta: string;
  distanceFromPrevKm: number;
  status: RouteStopStatus;
  lat: number;
  lng: number;
  notes?: string;
};

export type Route = {
  load_id: string;
  totalDistanceKm: number;
  remainingDistanceKm: number;
  estimatedDuration: string;
  stops: RouteStop[];
};
