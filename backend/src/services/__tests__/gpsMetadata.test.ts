import { extractVideoGPS } from '../gpsMetadata';

jest.mock('exiftool-vendored', () => ({
  exiftool: {
    read: jest.fn(),
  },
}));

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
}));

import { exiftool } from 'exiftool-vendored';

const mockRead = exiftool.read as jest.Mock;

describe('extractVideoGPS', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns GPS data when all fields are present', async () => {
    mockRead.mockResolvedValue({
      GPSLatitude: 33.749,
      GPSLongitude: -84.388,
      GPSSpeed: 72,          // km/h
      GPSDateTime: { toString: () => '2026-05-13T14:00:00Z' },
    });

    const result = await extractVideoGPS(Buffer.from('fake-video'));

    expect(result).not.toBeNull();
    expect(result!.latitude).toBe(33.749);
    expect(result!.longitude).toBe(-84.388);
    expect(result!.speedMs).toBeCloseTo(20, 0); // 72 km/h ≈ 20 m/s
    expect(result!.recordedAt).toBeInstanceOf(Date);
  });

  it('returns null when GPS coordinates are missing', async () => {
    mockRead.mockResolvedValue({ GPSSpeed: 50 });
    const result = await extractVideoGPS(Buffer.from('fake-video'));
    expect(result).toBeNull();
  });

  it('returns GPS without speed when GPSSpeed is absent', async () => {
    mockRead.mockResolvedValue({ GPSLatitude: 33.749, GPSLongitude: -84.388 });
    const result = await extractVideoGPS(Buffer.from('fake-video'));
    expect(result).not.toBeNull();
    expect(result!.speedMs).toBeUndefined();
  });

  it('returns null when exiftool throws', async () => {
    mockRead.mockRejectedValue(new Error('exiftool error'));
    const result = await extractVideoGPS(Buffer.from('fake-video'));
    expect(result).toBeNull();
  });
});
