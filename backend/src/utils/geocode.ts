interface NominatimResponse {
  address?: { road?: string; city?: string; town?: string; state?: string };
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'PoliceWatch/1.0 (civic incident reporting)' } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResponse;
    const parts = [
      data.address?.road,
      data.address?.city ?? data.address?.town,
      data.address?.state,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  } catch {
    return null;
  }
}
