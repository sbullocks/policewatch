import multer from 'multer';
import { Request } from 'express';

const MAX_SIZE_BYTES = 150 * 1024 * 1024; // 150MB — generous cap; 60s video ~10-50MB depending on quality

const ALLOWED_MIME_TYPES = ['video/webm', 'video/mp4', 'video/quicktime'];

export const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req: Request, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});
