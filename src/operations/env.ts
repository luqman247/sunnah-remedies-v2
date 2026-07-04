/**
 * Phase 8 — Environment Variables Documentation
 *
 * All environment variables required for Phase 8 operations.
 * Add these to your .env.local and Vercel project settings.
 */

export const PHASE_8_ENV_VARS = {
  // ── Database (Neon Postgres) ──
  DATABASE_URL: "Neon Postgres connection string",

  // ── Inngest (Workflow Orchestration) ──
  INNGEST_EVENT_KEY: "Inngest event key for sending events",
  INNGEST_SIGNING_KEY: "Inngest signing key for webhook verification",

  // ── Upstash Redis ──
  UPSTASH_REDIS_REST_URL: "Upstash Redis REST endpoint",
  UPSTASH_REDIS_REST_TOKEN: "Upstash Redis REST token",

  // ── Resend (Transactional Email) ──
  RESEND_API_KEY: "Resend API key",
  RESEND_FROM_EMAIL: "Verified sending email (e.g. mail@sunnahremedies.com)",

  // ── Loops (Lifecycle Email) ──
  LOOPS_API_KEY: "Loops API key (can be deferred to sub-phase 8.5)",

  // ── Cal.com (Booking) ──
  CALCOM_API_KEY: "Cal.com API key",
  CALCOM_API_URL: "Cal.com API URL (default: https://api.cal.com/v2)",

  // ── HubSpot (Marketing CRM) ──
  HUBSPOT_API_KEY: "HubSpot private app access token (non-clinical contacts only)",

  // ── Slack (Notifications) ──
  SLACK_WEBHOOK_URL: "Slack incoming webhook URL for operational alerts",

  // ── Sentry (Error Monitoring) ──
  SENTRY_DSN: "Sentry DSN for error reporting",
  SENTRY_AUTH_TOKEN: "Sentry auth token for source maps",

  // ── Sanity (Publish Webhook) ──
  SANITY_WEBHOOK_SECRET: "Secret for verifying Sanity publish webhooks",

  // ── Cron Jobs ──
  CRON_SECRET: "Bearer token for authenticating cron job requests",
} as const;

export function validatePhase8Env(): { valid: boolean; missing: string[] } {
  const required = [
    "DATABASE_URL",
    "INNGEST_EVENT_KEY",
    "INNGEST_SIGNING_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "RESEND_API_KEY",
    "CRON_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  return {
    valid: missing.length === 0,
    missing,
  };
}
