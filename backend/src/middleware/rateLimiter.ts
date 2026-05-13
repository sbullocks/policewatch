import rateLimit from 'express-rate-limit';

export const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many submissions. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});
