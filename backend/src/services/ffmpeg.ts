import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import os from 'os';
import path from 'path';

if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

const FRAME_COUNT = 5;
const MAX_DURATION = 60;

// Extract frames at evenly-spaced timestamps using seek — no ffprobe required.
export async function extractFrames(videoBuffer: Buffer): Promise<Buffer[]> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'policewatch-'));
  const ext = detectExtension(videoBuffer);
  const videoPath = path.join(tmpDir, `input.${ext}`);
  fs.writeFileSync(videoPath, videoBuffer);

  const timestamps = Array.from(
    { length: FRAME_COUNT },
    (_, i) => ((i + 1) * MAX_DURATION) / (FRAME_COUNT + 1)
  );

  const frames: Buffer[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    const framePath = path.join(tmpDir, `frame-${i}.jpg`);
    await new Promise<void>((resolve) => {
      ffmpeg(videoPath)
        .inputOption(`-ss ${timestamps[i]}`)
        .outputOptions(['-frames:v 1', '-q:v 2'])
        .output(framePath)
        .on('end', () => resolve())
        .on('error', () => resolve()) // skip missing timestamps gracefully
        .run();
    });
    if (fs.existsSync(framePath)) frames.push(fs.readFileSync(framePath));
  }

  // Fallback: grab the very first frame if nothing extracted
  if (frames.length === 0) {
    const fallbackPath = path.join(tmpDir, 'frame-0.jpg');
    await new Promise<void>((resolve) => {
      ffmpeg(videoPath)
        .inputOption('-ss 0')
        .outputOptions(['-frames:v 1', '-q:v 2'])
        .output(fallbackPath)
        .on('end', () => resolve())
        .on('error', () => resolve())
        .run();
    });
    if (fs.existsSync(fallbackPath)) frames.push(fs.readFileSync(fallbackPath));
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
  return frames;
}

function detectExtension(buffer: Buffer): string {
  // Check magic bytes for common video formats
  if (buffer[0] === 0x1a && buffer[1] === 0x45) return 'webm'; // EBML/WebM
  if (buffer[4] === 0x66 && buffer[5] === 0x74) return 'mp4';  // ftyp box
  return 'webm'; // default
}
