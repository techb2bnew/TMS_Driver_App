import { GOOGLE_MAPS_API_KEY } from '@env';

export type LatLng = { latitude: number; longitude: number };

// Google's encoded polyline algorithm — decodes the Directions API's
// overview_polyline into plain lat/lng points, no extra native dependency.
/* eslint-disable no-bitwise -- this bit-packing is the documented algorithm, not a style choice */
function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}
/* eslint-enable no-bitwise */

export type RoadRoute = {
  path: LatLng[];
  // One entry per consecutive stop pair (pickup→wp1, wp1→wp2, ..., →drop),
  // in the same order as the stops passed in — lets the caller compute
  // "remaining" distance/time by summing only the legs still ahead.
  legDistancesKm: number[];
  legDurationMinutes: number[];
};

// Real road-following path + per-leg distance/duration between an ordered
// list of stops (pickup → waypoints → drop), via the Directions API — falls
// back to null (caller draws a straight line / shows no distance) on any
// failure. Requires "Directions API" enabled on the same Google Cloud
// project as GOOGLE_MAPS_API_KEY.
export async function fetchRoadRoute(stops: LatLng[]): Promise<RoadRoute | null> {
  if (!GOOGLE_MAPS_API_KEY || stops.length < 2) return null;

  try {
    const origin = stops[0];
    const destination = stops[stops.length - 1];
    const waypoints = stops.slice(1, -1);

    const params = new URLSearchParams({
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
      key: GOOGLE_MAPS_API_KEY,
    });
    if (waypoints.length > 0) {
      params.set('waypoints', waypoints.map(w => `${w.latitude},${w.longitude}`).join('|'));
    }

    const res = await fetch(`https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`);
    const json = await res.json();
    const route = json?.routes?.[0];
    const polyline = route?.overview_polyline?.points;
    if (!polyline) return null;

    const legs: Array<{ distance?: { value: number }; duration?: { value: number } }> = route.legs ?? [];

    return {
      path: decodePolyline(polyline),
      legDistancesKm: legs.map(leg => (leg.distance?.value ?? 0) / 1000),
      legDurationMinutes: legs.map(leg => (leg.duration?.value ?? 0) / 60),
    };
  } catch {
    return null;
  }
}
