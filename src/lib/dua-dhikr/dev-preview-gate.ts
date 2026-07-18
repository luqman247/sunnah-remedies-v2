/**
 * Local-only gate for the Duʿa & Dhikr UI stress-test preview route.
 *
 * Unavailable by default in every environment. Enabled only when BOTH:
 *   - NODE_ENV is not "production"
 *   - ENABLE_DHIKR_DEV_PREVIEW === "true"
 *
 * Never used for real religious content. Never linked from public navigation.
 */
export function isDhikrDevPreviewEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (env.NODE_ENV === "production") return false;
  return env.ENABLE_DHIKR_DEV_PREVIEW === "true";
}
