/**
 * Stripe server client — institutional payment infrastructure.
 *
 * For non-catalog flows only: donations, memberships, subscriptions,
 * instalments, invoices, course access. Card data never touches our servers.
 *
 * @see Phase 4 Part 2, Spec 04
 */

import Stripe from "stripe";
import { getCommerceEnv } from "../config/env";

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (_stripe) return _stripe;

  const env = getCommerceEnv();
  if (!env.stripe.secretKey) {
    throw new Error("[Commerce] Stripe secret key not configured.");
  }

  _stripe = new Stripe(env.stripe.secretKey, {
    apiVersion: "2026-06-24.dahlia",
    typescript: true,
    appInfo: {
      name: "Sunnah Remedies Institution",
      version: "1.0.0",
    },
  });

  return _stripe;
}
