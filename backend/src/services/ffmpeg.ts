import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import os from 'os';
import path from 'path';

if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

const FRAME_COUNT = 5;

export async function extractFrames(videoBuffer: Buffer): Promise<Buffer[]> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'policewatch-'));
  const videoPath = path.join(tmpDir, 'input.webm');
  fs.writeFileSync(videoPath, videoBuffer);

  const frames: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => resolve())
      .on('error', (err: Error) => reject(err))
      .screenshots({
        count: FRAME_COUNT,
        folder: tmpDir,
        filename: 'frame-%i.jpg',
        size: '1280x720',
      });
  });

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const framePath = path.join(tmpDir, `frame-${i}.jpg`);
    if (fs.existsSync(framePath)) {
      frames.push(fs.readFileSync(framePath));
    }
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
  return frames;
}
