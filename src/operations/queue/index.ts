/**
 * Phase 8 — Queue & Rate Limiting (Upstash Redis + QStash)
 *
 * Rate-limited, debounced work for bulk operations.
 * Token-bucket rate limiting for external API calls.
 *
 * Lazy-initialised so build succeeds without Redis env vars at compile time.
 */

import { Redis } from "@upstash/redis";

let redisInstance: Redis | null = null;

function getRedis(): Redis {
  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured");
    }
    redisInstance = new Redis({ url, token });
  }
  return redisInstance;
}

export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const instance = getRedis();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

/* ── Rate Limiter ───────────────────────────────────────────────── */

interface RateLimitConfig {
  key: string;
  limit: number;
  windowSeconds: number;
}

export async function checkRateLimit(config: RateLimitConfig): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `ratelimit:${config.key}:${Math.floor(now / config.windowSeconds)}`;

  const current = await redis.incr(windowKey);

  if (current === 1) {
    await redis.expire(windowKey, config.windowSeconds);
  }

  return {
    allowed: current <= config.limit,
    remaining: Math.max(0, config.limit - current),
    resetAt: (Math.floor(now / config.windowSeconds) + 1) * config.windowSeconds,
  };
}

/* ── API Rate Limit Presets ─────────────────────────────────────── */

export const rateLimits = {
  shopify: { key: "shopify-api", limit: 2, windowSeconds: 1 },
  stripe: { key: "stripe-api", limit: 25, windowSeconds: 1 },
  calcom: { key: "calcom-api", limit: 10, windowSeconds: 1 },
  resend: { key: "resend-api", limit: 10, windowSeconds: 1 },
  sanity: { key: "sanity-api", limit: 10, windowSeconds: 1 },
  hubspot: { key: "hubspot-api", limit: 10, windowSeconds: 1 },
} as const;

/* ── Deduplication ──────────────────────────────────────────────── */

export async function isDuplicate(key: string, ttlSeconds = 86400): Promise<boolean> {
  const result = await redis.set(`dedup:${key}`, "1", { nx: true, ex: ttlSeconds });
  return result === null;
}

/* ── Debounce ───────────────────────────────────────────────────── */

export async function debounce(key: string, delaySeconds: number): Promise<boolean> {
  const debounceKey = `debounce:${key}`;
  const result = await redis.set(debounceKey, Date.now().toString(), {
    nx: true,
    ex: delaySeconds,
  });
  return result !== null;
}

/* ── Simple KV Cache ────────────────────────────────────────────── */

export async function cacheGet<T>(key: string): Promise<T | null> {
  return redis.get<T>(`cache:${key}`);
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
  await redis.set(`cache:${key}`, value, { ex: ttlSeconds });
}

export async function cacheInvalidate(key: string): Promise<void> {
  await redis.del(`cache:${key}`);
}
