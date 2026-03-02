// Rate limit middleware — global and per-route limiters.

import { rateLimit } from "express-rate-limit";

const MINUTE_MS = 60 * 1000;
const sharedOptions = {
  windowMs: MINUTE_MS,
  standardHeaders: true,
  legacyHeaders: false,
} as const;

// Applies to all routes. 60 requests per minute per IP.
export const globalLimiter = rateLimit({
  ...sharedOptions,
  limit: 60,
  message: { error: "Too many requests. Try again later." },
});

// Stricter limit for POST /referral/register (flood / file bloat / enumeration).
export const referralRegisterLimiter = rateLimit({
  ...sharedOptions,
  limit: 5,
  message: { error: "Too many referral attempts. Try again later." },
});
