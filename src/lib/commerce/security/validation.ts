/**
 * Commerce security utilities — input sanitisation and request validation.
 *
 * @see Phase 4 Part 2, Spec 07 §7.1
 */

export function sanitizeInput(input: string, maxLength = 500): string {
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, "")
    .trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function isValidGid(gid: string, resource: string): boolean {
  const pattern = new RegExp(`^gid://shopify/${resource}/\\d+$`);
  return pattern.test(gid);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
