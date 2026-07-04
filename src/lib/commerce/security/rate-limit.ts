/**
 * Commerce rate limiting — prevents abuse of cart/payment/webhook endpoints.
 *
 * Token-bucket algorithm. In production, back with Redis.
 * In development, uses in-memory store.
 *
 * @see Phase 4 Part 2, Spec 07 §7.2
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  maxTokens: number;
  refillRate: number;
  windowMs: number;
}

const CONFIGS: Record<string, RateLimitConfig> = {
  cart: { maxTokens: 30, refillRate: 5, windowMs: 60_000 },
  payment: { maxTokens: 5, refillRate: 1, windowMs: 60_000 },
  webhook: { maxTokens: 100, refillRate: 50, windowMs: 60_000 },
  default: { maxTokens: 20, refillRate: 4, windowMs: 60_000 },
};

export function checkRateLimit(
  identifier: string,
  bucket: string = "default"
): { allowed: boolean; remaining: number; resetMs: number } {
  const config = CONFIGS[bucket] ?? CONFIGS.default;
  const key = `${bucket}:${identifier}`;
  const now = Date.now();

  let entry = store.get(key);

  if (!entry) {
    entry = { tokens: config.maxTokens - 1, lastRefill: now };
    store.set(key, entry);
    return { allowed: true, remaining: entry.tokens, resetMs: config.windowMs };
  }

  const elapsed = now - entry.lastRefill;
  const tokensToAdd = Math.floor(elapsed / config.windowMs) * config.refillRate;

  if (tokensToAdd > 0) {
    entry.tokens = Math.min(config.maxTokens, entry.tokens + tokensToAdd);
    entry.lastRefill = now;
  }

  if (entry.tokens <= 0) {
    const resetMs = config.windowMs - elapsed;
    return { allowed: false, remaining: 0, resetMs };
  }

  entry.tokens--;
  return { allowed: true, remaining: entry.tokens, resetMs: config.windowMs };
}

export function getRateLimitHeaders(
  result: { remaining: number; resetMs: number },
  bucket: string
): Record<string, string> {
  const config = CONFIGS[bucket] ?? CONFIGS.default;
  return {
    "X-RateLimit-Limit": String(config.maxTokens),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
  };
}
