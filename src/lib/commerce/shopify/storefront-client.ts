/**
 * Shopify Storefront API client — cost-aware, retried, circuit-broken.
 *
 * All reader-facing reads (products, collections, availability) and cart
 * operations go through this client. Secrets never reach the client bundle.
 *
 * @see Phase 4 Part 2, Spec 02 §2.1, 2.5
 */

import { getCommerceEnv } from "../config/env";
import { SHOPIFY_API_VERSION, RATE_LIMITS } from "../config";

interface StorefrontResponse<T> {
  data: T;
  errors?: Array<{ message: string; locations?: unknown[] }>;
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

let _circuitOpen = false;
let _circuitOpenedAt = 0;
const CIRCUIT_RESET_MS = 30_000;

export async function storefrontQuery<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (_circuitOpen) {
    if (Date.now() - _circuitOpenedAt > CIRCUIT_RESET_MS) {
      _circuitOpen = false;
    } else {
      throw new StorefrontError("Circuit breaker open — Shopify temporarily unavailable", 503);
    }
  }

  const env = getCommerceEnv();
  if (!env.shopify.storeDomain || !env.shopify.storefrontAccessToken) {
    throw new StorefrontError("Shopify not configured", 500);
  }

  const endpoint = `https://${env.shopify.storeDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RATE_LIMITS.maxRetries; attempt++) {
    if (attempt > 0) {
      const backoff = RATE_LIMITS.baseBackoffMs * Math.pow(2, attempt - 1);
      const jitter = Math.random() * backoff * 0.3;
      await sleep(backoff + jitter);
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": env.shopify.storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (response.status === 429 || response.status >= 500) {
        lastError = new StorefrontError(
          `Shopify returned ${response.status}`,
          response.status
        );
        if (response.status >= 500 && attempt === RATE_LIMITS.maxRetries) {
          _circuitOpen = true;
          _circuitOpenedAt = Date.now();
        }
        continue;
      }

      if (!response.ok) {
        throw new StorefrontError(
          `Shopify Storefront API error: ${response.status}`,
          response.status
        );
      }

      const json = (await response.json()) as StorefrontResponse<T>;

      if (json.errors?.length) {
        const message = json.errors.map((e) => e.message).join("; ");
        throw new StorefrontError(`GraphQL errors: ${message}`, 400);
      }

      return json.data;
    } catch (error) {
      if (error instanceof StorefrontError) {
        lastError = error;
        if (error.status < 500 && error.status !== 429) throw error;
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  throw lastError || new StorefrontError("Storefront request failed", 500);
}

export class StorefrontError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "StorefrontError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
