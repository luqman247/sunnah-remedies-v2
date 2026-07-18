/**
 * Local-only gate for the consultation mock confirmation path.
 *
 * Unavailable by default. Enabled only when BOTH:
 *   - NODE_ENV is not "production"
 *   - ENABLE_MOCK_BOOKING_FLOW === "true"
 *
 * Never creates a real appointment, payment, or customer email.
 * Never linked from public metadata, sitemaps, or indexing surfaces.
 */
export function isMockBookingFlowEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (env.NODE_ENV === "production") return false;
  return env.ENABLE_MOCK_BOOKING_FLOW === "true";
}
