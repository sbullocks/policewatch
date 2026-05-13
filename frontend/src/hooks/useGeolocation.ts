import { useState, useCallback } from 'react';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
  speed: number | null; // m/s from GPS — null if unavailable
}

export interface UseGeolocationReturn {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
  capture: () => Promise<GeoLocation | null>;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  const a = data.address ?? {};
  const parts = [
    a.road,
    a.suburb ?? a.neighbourhood,
    a.city ?? a.town ?? a.village,
    a.state,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async (): Promise<GeoLocation | null> => {
    setLoading(true);
    setError(null);

    try {
      const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      const address = await reverseGeocode(coords.latitude, coords.longitude);
      const loc: GeoLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        address,
        speed: coords.speed ?? null,
      };
      setLocation(loc);
      return loc;
    } catch (err) {
      const isGeoError = typeof err === 'object' && err !== null && 'code' in err;
      const msg = isGeoError
        ? 'Location access denied. You can submit without location.'
        : 'Could not determine location.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, capture };
}
