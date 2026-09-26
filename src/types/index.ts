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
  customer_name: string;
  customer_contact?: string;
  pickup_location: string;
  drop_location: string;
  weight_kg: number;
  rate: number;
  status: LoadStatus;
  created_at: string;
  delivered_at?: string | null;
  // Device-local file URI from the camera capture at delivery — swapped for
  // a Supabase Storage URL once photos are actually uploaded.
  pod_photo_uri?: string | null;
};

export type Driver = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  license_number: string;
  status: 'active' | 'inactive';
  truck_number?: string;
};

export type ExpenseCategory = 'Fuel' | 'Tolls' | 'Maintenance' | 'Insurance' | 'Other';
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export type Expense = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  truck_number?: string | null;
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
  file_name: string;
  uploaded_at: string;
};

export type SettlementStatus = 'unpaid' | 'paid';

export type Settlement = {
  id: string;
  load_id: string;
  amount: number;
  status: SettlementStatus;
  created_at: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Duty status isn't in the schema yet — it's a driver-side concept for now,
// tracked locally until an HOS/duty_logs table exists on the backend.
export type DutyStatus = 'off_duty' | 'sleeper' | 'driving' | 'on_duty';

export type DutyLogEntry = {
  id: string;
  status: DutyStatus;
  changed_at: string;
};

// Route/trip data isn't in the schema yet either — it's derived client-side
// from a load's pickup/drop (plus any waypoints) until a real routing API
// is wired up. Keyed by load_id in mock/routes.ts.
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
