import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeolocation, reverseGeocode } from '../useGeolocation';

describe('reverseGeocode', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('builds a readable address from Nominatim response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        address: { road: 'Main St', city: 'Atlanta', state: 'Georgia' },
      }),
    }));

    const result = await reverseGeocode(33.749, -84.388);
    expect(result).toBe('Main St, Atlanta, Georgia');
  });

  it('falls back to coordinates when address parts are missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: {} }),
    }));

    const result = await reverseGeocode(33.749, -84.388);
    expect(result).toMatch(/33\.7490, -84\.3880/);
  });

  it('throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(reverseGeocode(0, 0)).rejects.toThrow('Geocoding failed');
  });
});

describe('useGeolocation', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns location on successful capture', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) =>
          success({ coords: { latitude: 33.749, longitude: -84.388 } } as GeolocationPosition),
      },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: { road: 'Peachtree St', city: 'Atlanta', state: 'Georgia' } }),
    }));

    const { result } = renderHook(() => useGeolocation());
    await act(async () => { await result.current.capture(); });

    expect(result.current.location).toEqual({
      latitude: 33.749,
      longitude: -84.388,
      address: 'Peachtree St, Atlanta, Georgia',
      speed: null,
    });
    expect(result.current.error).toBeNull();
  });

  it('sets error when geolocation is denied', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (_: unknown, error: PositionErrorCallback) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error({ code: 1, message: 'denied' } as any),
      },
    });

    const { result } = renderHook(() => useGeolocation());
    await act(async () => { await result.current.capture(); });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toMatch(/denied/i);
  });
});
