/**
 * Webhook idempotency — prevents duplicate processing.
 *
 * In-memory store for development. In production, back with Redis or KV.
 * The key is the webhook's unique identifier (X-Shopify-Webhook-Id or Stripe event ID).
 *
 * @see Phase 4 Part 2, Spec 05 §5.3
 */

const processed = new Map<string, number>();
const MAX_ENTRIES = 10_000;
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function isAlreadyProcessed(idempotencyKey: string): boolean {
  cleanup();
  return processed.has(idempotencyKey);
}

export function markProcessed(idempotencyKey: string): void {
  processed.set(idempotencyKey, Date.now());
}

function cleanup() {
  if (processed.size < MAX_ENTRIES) return;
  const now = Date.now();
  for (const [key, timestamp] of processed) {
    if (now - timestamp > TTL_MS) {
      processed.delete(key);
    }
  }
}
