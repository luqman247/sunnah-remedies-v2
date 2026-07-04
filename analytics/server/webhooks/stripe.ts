/**
 * Stripe webhook analytics — payment truth.
 *
 * Processes Stripe payment events to emit server-side revenue events.
 * Handles payment success, failure, refunds, and disputes.
 */

import { trackServerPurchase, trackServerRefund } from "../server-events";
import type { EcommerceItem } from "../../lib/types";

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  status: string;
}

interface StripeCharge {
  id: string;
  amount: number;
  amount_refunded?: number;
  currency: string;
  metadata?: Record<string, string>;
  payment_intent?: string;
}

/**
 * Process a Stripe payment_intent.succeeded event for analytics.
 */
export async function processPaymentSucceeded(
  data: Record<string, unknown>
): Promise<void> {
  const pi = data as unknown as StripePaymentIntent;

  const purpose = pi.metadata?.purpose || "product";
  const orderId = pi.metadata?.order_id || pi.id;
  const clientId = pi.metadata?.ga_client_id || `stripe.${pi.id}`;

  const item: EcommerceItem = {
    item_id: pi.metadata?.item_id || orderId,
    item_name: pi.metadata?.item_name || purpose,
    item_brand: "Sunnah Remedies",
    item_category: mapPurposeToCategory(purpose),
    price: pi.amount / 100,
    quantity: 1,
    currency: pi.currency.toUpperCase(),
  };

  await trackServerPurchase(
    orderId,
    [item],
    pi.amount / 100,
    pi.currency.toUpperCase(),
    clientId
  );
}

/**
 * Process a Stripe charge.refunded event for analytics.
 */
export async function processChargeRefunded(
  data: Record<string, unknown>
): Promise<void> {
  const charge = data as unknown as StripeCharge;

  const refundAmount = (charge.amount_refunded || charge.amount) / 100;
  const clientId = charge.metadata?.ga_client_id || `stripe.${charge.id}`;
  const orderId = charge.metadata?.order_id || charge.payment_intent || charge.id;

  const item: EcommerceItem = {
    item_id: charge.metadata?.item_id || orderId,
    item_name: charge.metadata?.item_name || "Refund",
    item_brand: "Sunnah Remedies",
    price: refundAmount,
    quantity: 1,
    currency: charge.currency.toUpperCase(),
  };

  await trackServerRefund(
    orderId,
    [item],
    refundAmount,
    charge.currency.toUpperCase(),
    clientId
  );
}

function mapPurposeToCategory(purpose: string): string {
  switch (purpose) {
    case "course":
    case "academy":
      return "Academy";
    case "journey":
      return "Sacred Journeys";
    case "consultation":
      return "Clinical";
    default:
      return "Apothecary";
  }
}
