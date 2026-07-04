/**
 * Shopify Admin API client — server-only.
 *
 * Used for: order lookups, fulfilment, inventory detail, customer admin,
 * reconciliation, and webhook registration. Never runs client-side.
 *
 * @see Phase 4 Part 2, Spec 02 §2.1
 */

import { getCommerceEnv } from "../config/env";
import { SHOPIFY_API_VERSION, RATE_LIMITS } from "../config";

interface AdminResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function adminQuery<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const env = getCommerceEnv();
  if (!env.shopify.storeDomain || !env.shopify.adminAccessToken) {
    throw new AdminError("Shopify Admin not configured", 500);
  }

  const endpoint = `https://${env.shopify.storeDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

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
          "X-Shopify-Access-Token": env.shopify.adminAccessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (response.status === 429 || response.status >= 500) {
        lastError = new AdminError(`Admin API returned ${response.status}`, response.status);
        continue;
      }

      if (!response.ok) {
        throw new AdminError(`Admin API error: ${response.status}`, response.status);
      }

      const json = (await response.json()) as AdminResponse<T>;

      if (json.errors?.length) {
        const message = json.errors.map((e) => e.message).join("; ");
        throw new AdminError(`Admin GraphQL errors: ${message}`, 400);
      }

      return json.data;
    } catch (error) {
      if (error instanceof AdminError) {
        lastError = error;
        if (error.status < 500 && error.status !== 429) throw error;
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  throw lastError || new AdminError("Admin request failed", 500);
}

export class AdminError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "AdminError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
