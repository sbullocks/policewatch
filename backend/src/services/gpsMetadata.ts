import { exiftool } from 'exiftool-vendored';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export interface VideoGPS {
  latitude: number;
  longitude: number;
  speedMs?: number;   // converted from km/h (EXIF spec) to m/s
  recordedAt?: Date;
}

export async function extractVideoGPS(buffer: Buffer): Promise<VideoGPS | null> {
  const tmpPath = join(tmpdir(), `pw-gps-${Date.now()}.mp4`);
  try {
    await writeFile(tmpPath, buffer);
    const tags = await exiftool.read(tmpPath);

    const lat = tags.GPSLatitude;
    const lng = tags.GPSLongitude;
    if (lat == null || lng == null) return null;

    // EXIF GPSSpeed is km/h per spec — convert to m/s
    const speedMs = tags.GPSSpeed != null ? (tags.GPSSpeed as unknown as number) / 3.6 : undefined;

    // ExifDateTime.toString() produces a parseable ISO-like string
    const gpsDateStr = tags.GPSDateTime?.toString();
    const recordedAt = gpsDateStr ? new Date(gpsDateStr) : undefined;

    return { latitude: lat as unknown as number, longitude: lng as unknown as number, speedMs, recordedAt };
  } catch {
    return null;
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}
