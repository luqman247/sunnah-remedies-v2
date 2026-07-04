/**
 * Webhook verification utilities — HMAC-SHA256 for Shopify, Stripe signature.
 *
 * All webhook endpoints must verify the request signature before processing.
 * This is a critical security boundary.
 *
 * @see Phase 4 Part 2, Spec 05 §5.2, Spec 04 §4.7
 */

import { createHmac, timingSafeEqual } from "crypto";

export function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string,
  secret: string
): boolean {
  if (!hmacHeader || !secret) return false;

  const computed = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    return timingSafeEqual(
      Buffer.from(computed, "base64"),
      Buffer.from(hmacHeader, "base64")
    );
  } catch {
    return false;
  }
}

export function verifyStripeWebhook(
  rawBody: string,
  signatureHeader: string,
  secret: string,
  tolerance = 300
): boolean {
  if (!signatureHeader || !secret) return false;

  const parts = signatureHeader.split(",");
  let timestamp = "";
  let signature = "";

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signature = value;
  }

  if (!timestamp || !signature) return false;

  const ts = parseInt(timestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > tolerance) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
}
