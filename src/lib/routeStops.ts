import { supabase } from './supabase';
import type { LoadStatus, Route, RouteStop } from '../types';

type StopRow = {
  id: string;
  type: RouteStop['type'];
  label: string;
  address: string;
  city: string;
  contact_name: string | null;
  contact_phone: string | null;
  eta: string | null;
  distance_from_prev_km: number;
  status: RouteStop['status'];
  lat: number;
  lng: number;
  notes: string | null;
};

function formatDurationBetween(startIso: string, endIso: string): string {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (ms <= 0) return '—';
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
}

// A load always has at least a pickup + drop stop (auto-seeded by a DB
// trigger when the load is created) — dispatch can add real waypoints,
// distances and ETAs on top, and the driver can add their own ad-hoc stop.
export async function fetchRoute(loadId: string): Promise<Route | null> {
  const { data } = await supabase
    .from('load_stops')
    .select('id, type, label, address, city, contact_name, contact_phone, eta, distance_from_prev_km, status, lat, lng, notes')
    .eq('load_id', loadId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  const rows = (data ?? []) as StopRow[];
  if (rows.length === 0) return null;

  const stops: RouteStop[] = rows.map(row => ({
    id: row.id,
    type: row.type,
    label: row.label,
    address: row.address,
    city: row.city,
    contactName: row.contact_name ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    eta: row.eta ?? '',
    distanceFromPrevKm: row.distance_from_prev_km,
    status: row.status,
    lat: row.lat,
    lng: row.lng,
    notes: row.notes ?? undefined,
  }));

  const totalDistanceKm = stops.reduce((sum, s) => sum + s.distanceFromPrevKm, 0);
  const remainingDistanceKm = stops.filter(s => s.status !== 'completed').reduce((sum, s) => sum + s.distanceFromPrevKm, 0);
  const firstEta = stops.find(s => s.eta)?.eta;
  const lastEta = [...stops].reverse().find(s => s.eta)?.eta;
  const estimatedDuration = firstEta && lastEta ? formatDurationBetween(firstEta, lastEta) : '—';

  return { load_id: loadId, totalDistanceKm, remainingDistanceKm, estimatedDuration, stops };
}

// Keeps a load's stops in sync with its own status — without this, the
// pickup stop stays 'upcoming' forever and "Navigate to..." on RouteMap
// keeps pointing at pickup even after the driver has already picked up and
// moved on.
export async function syncStopsForLoadStatus(loadId: string, status: LoadStatus) {
  if (status === 'delivered') {
    await supabase.from('load_stops').update({ status: 'completed' }).eq('load_id', loadId);
    return;
  }

  if (status === 'picked_up' || status === 'in_transit') {
    await supabase.from('load_stops').update({ status: 'completed' }).eq('load_id', loadId).eq('type', 'pickup');

    const { data } = await supabase
      .from('load_stops')
      .select('id, status')
      .eq('load_id', loadId)
      .neq('status', 'completed')
      .order('sort_order', { ascending: true })
      .limit(1);

    const next = data?.[0];
    if (next && next.status !== 'current') {
      await supabase.from('load_stops').update({ status: 'current' }).eq('id', next.id);
    }
  }
}

// Driver-added ad-hoc stop — always lands as an 'upcoming' waypoint; RLS
// only allows type 'waypoint' from a driver, on their own assigned load.
// lat/lng come from the Places suggestion the driver picked (0,0 if they
// typed free text instead) — real coordinates are what let it show up on
// the map and route line at all.
export async function addRouteStop(
  loadId: string,
  stop: Omit<RouteStop, 'id' | 'status' | 'distanceFromPrevKm'>,
) {
  await supabase.from('load_stops').insert({
    load_id: loadId,
    type: 'waypoint',
    label: stop.label,
    address: stop.address,
    city: stop.city || '',
    eta: stop.eta || null,
    notes: stop.notes ?? null,
    lat: stop.lat,
    lng: stop.lng,
    sort_order: 500,
  });
}
