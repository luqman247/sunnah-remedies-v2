/**
 * AI Gateway — Rate Limiting (§4, §9).
 *
 * Per-role rate limits with abuse detection.
 * Sliding window counter per IP / user ID.
 */

import { AI_CONFIG } from "../config";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const limitStore = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  isAuthenticated: boolean = false
): RateLimitResult {
  const windowMs = AI_CONFIG.rateLimit.windowMs;
  const maxRequests = isAuthenticated
    ? AI_CONFIG.rateLimit.maxRequestsAuth
    : AI_CONFIG.rateLimit.maxRequests;
  const now = Date.now();

  const entry = limitStore.get(identifier);

  if (!entry || now - entry.windowStart > windowMs) {
    limitStore.set(identifier, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.windowStart + windowMs,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.windowStart + windowMs,
  };
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  const windowMs = AI_CONFIG.rateLimit.windowMs;
  for (const [key, entry] of limitStore) {
    if (now - entry.windowStart > windowMs * 2) {
      limitStore.delete(key);
    }
  }
}, 60_000);
