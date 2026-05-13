#!/usr/bin/env node
// Generates icon-192.png and icon-512.png in public/ with no external deps.
// Colors: #e63946 (primary red) on #1a1a2e (dark bg), with a simple shield shape.
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([t, data]);
  return Buffer.concat([u32(data.length), t, data, u32(crc32(crcInput))]);
}

function createIconPNG(size) {
  const [bgR, bgG, bgB] = [26, 26, 46];   // #1a1a2e
  const [fgR, fgG, fgB] = [230, 57, 70];   // #e63946

  // Build RGBA rows; draw a filled circle centered in the icon
  const rows = [];
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    row[0] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const inCircle = Math.sqrt(dx * dx + dy * dy) <= r;
      row[1 + x * 3] = inCircle ? fgR : bgR;
      row[1 + x * 3 + 1] = inCircle ? fgG : bgG;
      row[1 + x * 3 + 2] = inCircle ? fgB : bgB;
    }
    rows.push(row);
  }

  const raw = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw, { level: 6 });

  const ihdrData = Buffer.concat([
    u32(size), u32(size),
    Buffer.from([8, 2, 0, 0, 0]), // 8-bit RGB, no interlace
  ]);

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk('IHDR', ihdrData),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createIconPNG(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createIconPNG(512));

console.log('Generated: public/icon-192.png, public/icon-512.png');
