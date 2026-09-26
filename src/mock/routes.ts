import type { Route, RouteStop } from '../types';

// Keyed by load_id. Distances/ETAs are mocked but shaped exactly like what
// a routing API (Google Directions / Mapbox) would return, so swapping the
// source later is a data-layer change only.
export const mockRoutes: Record<string, Route> = {
  'LD-1042': {
    load_id: 'LD-1042',
    totalDistanceKm: 281,
    remainingDistanceKm: 96,
    estimatedDuration: '2h 10m',
    stops: [
      {
        id: 'LD-1042-pickup',
        type: 'pickup',
        label: 'Pickup',
        address: 'Bansal Traders, Narela Industrial Area',
        city: 'Delhi',
        contactName: 'Rohit Bansal',
        contactPhone: '+91 98111 22334',
        eta: '2026-09-21T06:30:00Z',
        distanceFromPrevKm: 0,
        status: 'completed',
        lat: 28.7041,
        lng: 77.1025,
      },
      {
        id: 'LD-1042-waypoint',
        type: 'waypoint',
        label: 'Rest Stop',
        address: 'NH48 Dhaba, Neemrana',
        city: 'Neemrana',
        eta: '2026-09-21T09:15:00Z',
        distanceFromPrevKm: 122,
        status: 'current',
        lat: 27.9877,
        lng: 76.3852,
        notes: 'Fuel + break point on NH48',
      },
      {
        id: 'LD-1042-drop',
        type: 'drop',
        label: 'Drop-off',
        address: 'Jaipur Wholesale Market, Chandpole',
        city: 'Jaipur',
        contactName: 'Anil Sharma',
        contactPhone: '+91 98290 44112',
        eta: '2026-09-21T11:30:00Z',
        distanceFromPrevKm: 159,
        status: 'upcoming',
        lat: 26.9124,
        lng: 75.7873,
      },
    ],
  },
  'LD-1039': {
    load_id: 'LD-1039',
    totalDistanceKm: 245,
    remainingDistanceKm: 245,
    estimatedDuration: '4h 30m',
    stops: [
      {
        id: 'LD-1039-pickup',
        type: 'pickup',
        label: 'Pickup',
        address: 'Sharma Textiles, Udyog Vihar Phase 4',
        city: 'Gurugram',
        contactName: 'Vikas Sharma',
        contactPhone: '+91 98222 33445',
        eta: '2026-09-21T08:00:00Z',
        distanceFromPrevKm: 0,
        status: 'current',
        lat: 28.4595,
        lng: 77.0266,
      },
      {
        id: 'LD-1039-drop',
        type: 'drop',
        label: 'Drop-off',
        address: 'Sector 26 Industrial Area',
        city: 'Chandigarh',
        contactName: 'Preet Singh',
        contactPhone: '+91 98765 11223',
        eta: '2026-09-21T12:30:00Z',
        distanceFromPrevKm: 245,
        status: 'upcoming',
        lat: 30.7333,
        lng: 76.7794,
      },
    ],
  },
  'LD-1041': {
    load_id: 'LD-1041',
    totalDistanceKm: 148,
    remainingDistanceKm: 0,
    estimatedDuration: '2h 45m',
    stops: [
      {
        id: 'LD-1041-pickup',
        type: 'pickup',
        label: 'Pickup',
        address: 'Om Sai Logistics Hub, Hadapsar',
        city: 'Pune',
        contactName: 'Sameer Joshi',
        contactPhone: '+91 98333 44556',
        eta: '2026-09-19T15:00:00Z',
        distanceFromPrevKm: 0,
        status: 'completed',
        lat: 18.5089,
        lng: 73.9260,
      },
      {
        id: 'LD-1041-drop',
        type: 'drop',
        label: 'Drop-off',
        address: 'Andheri MIDC Warehouse',
        city: 'Mumbai',
        contactName: 'Kavita Rao',
        contactPhone: '+91 98111 99887',
        eta: '2026-09-19T18:30:00Z',
        distanceFromPrevKm: 148,
        status: 'completed',
        lat: 19.1197,
        lng: 72.8468,
      },
    ],
  },
};

// A driver can insert an ad-hoc stop (fuel/rest/breakdown) into their own
// active route mid-trip — dispatch didn't plan it, so it always lands as an
// 'upcoming' waypoint, inserted right before the drop-off. Mutates the stops
// array in place (not reassigned) so every screen reading the same
// mockRoutes[loadId] reference picks it up, same pattern as addMockExpense.
export function addMockRouteStop(loadId: string, stop: RouteStop) {
  const route = mockRoutes[loadId];
  if (!route) return;
  const dropIndex = route.stops.findIndex(s => s.type === 'drop');
  const insertAt = dropIndex === -1 ? route.stops.length : dropIndex;
  route.stops.splice(insertAt, 0, stop);
}
