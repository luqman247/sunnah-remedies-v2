/**
 * Typed environment schema for commerce.
 *
 * Validates all required environment variables at boot.
 * The app refuses to start with missing/invalid config in production.
 *
 * @see Phase 4 Part 2, Spec 07 §7.4
 */

interface CommerceEnv {
  shopify: {
    storeDomain: string;
    storefrontAccessToken: string;
    adminAccessToken: string;
    webhookSecret: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
}

let _validated: CommerceEnv | null = null;

export function getCommerceEnv(): CommerceEnv {
  if (_validated) return _validated;

  const env: CommerceEnv = {
    shopify: {
      storeDomain: requireEnv("SHOPIFY_STORE_DOMAIN"),
      storefrontAccessToken: requireEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN"),
      adminAccessToken: requireEnv("SHOPIFY_ADMIN_ACCESS_TOKEN"),
      webhookSecret: requireEnv("SHOPIFY_WEBHOOK_SECRET"),
    },
    stripe: {
      secretKey: requireEnv("STRIPE_SECRET_KEY"),
      publishableKey: requireEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
      webhookSecret: requireEnv("STRIPE_WEBHOOK_SECRET"),
    },
  };

  _validated = env;
  return env;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `[Commerce] Missing required environment variable: ${key}. Cannot start in production without it.`
      );
    }
    console.warn(`[Commerce] Missing env var: ${key} — commerce features will be unavailable.`);
    return "";
  }
  return value;
}

export function isCommerceConfigured(): boolean {
  return !!(
    process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}
