/**
 * Phase 9 — Environment Variables
 *
 * Required configuration for community & membership systems.
 * Values are environment-managed and never committed.
 */

export const PHASE_9_ENV_VARS = {
  // Inherited from Phase 8
  DATABASE_URL: "Neon Postgres connection string (EU region recommended)",
  NEXTAUTH_SECRET: "JWT signing secret for member and staff sessions",
  NEXTAUTH_URL: "Canonical site URL",

  // Phase 9 — Member Auth
  MEMBER_AUTH_ENABLED: "Enable member authentication (true/false)",

  // Phase 9 — Stripe Membership (Milestone 2+)
  STRIPE_MEMBERSHIP_WEBHOOK_SECRET: "Stripe webhook secret for membership subscriptions",

  // Phase 9 — Analytics
  ANALYTICS_SERVER_ENDPOINT: "Phase 7 analytics server endpoint for community events",
  ANALYTICS_SERVER_KEY: "Bearer token for analytics event ingestion",
} as const;

export function validatePhase9Env(): { valid: boolean; missing: string[] } {
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"];

  const missing = required.filter((key) => !process.env[key]);

  return {
    valid: missing.length === 0,
    missing,
  };
}
