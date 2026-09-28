import { GOOGLE_MAPS_API_KEY } from '@env';

// Uses the same Geocoding API that's already enabled (and working) for
// pickup/drop routes — no separate Places API needed. Resolves whatever
// address text the driver typed for an ad-hoc stop into real coordinates.
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!GOOGLE_MAPS_API_KEY || !address.trim()) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    const location = json?.results?.[0]?.geometry?.location;
    if (!location) return null;
    return { lat: location.lat, lng: location.lng };
  } catch {
    return null;
  }
}
