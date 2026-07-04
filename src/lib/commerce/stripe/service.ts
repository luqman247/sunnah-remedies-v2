/**
 * Stripe institutional payment service.
 *
 * Creates Payment Intents for non-catalog institutional flows.
 * Card data never touches our servers — Stripe.js handles tokenisation.
 *
 * @see Phase 4 Part 2, Spec 04 §4.3–4.4
 */

import { getStripeClient } from "./client";
import type {
  CreateIntentOptions,
  IntentResult,
  RefundRequest,
} from "./types";

export async function createPaymentIntent(
  options: CreateIntentOptions
): Promise<IntentResult> {
  const stripe = getStripeClient();

  const intent = await stripe.paymentIntents.create(
    {
      amount: options.amount,
      currency: options.currency ?? "gbp",
      description: options.description,
      metadata: {
        purpose: options.purpose,
        institution: "sunnah-remedies",
        ...options.metadata,
      },
      receipt_email: options.customerEmail,
      customer: options.customerId,
      payment_method_types: ["card"],
      automatic_payment_methods: undefined,
    },
    {
      idempotencyKey: options.idempotencyKey,
    }
  );

  return {
    clientSecret: intent.client_secret!,
    intentId: intent.id,
    status: intent.status,
  };
}

export async function createRefund(options: RefundRequest): Promise<{
  refundId: string;
  status: string;
}> {
  const stripe = getStripeClient();

  const refund = await stripe.refunds.create(
    {
      payment_intent: options.paymentIntentId,
      amount: options.amount,
      reason: options.reason,
    },
    {
      idempotencyKey: options.idempotencyKey,
    }
  );

  return {
    refundId: refund.id,
    status: refund.status ?? "unknown",
  };
}

export async function retrievePaymentIntent(intentId: string) {
  const stripe = getStripeClient();
  return stripe.paymentIntents.retrieve(intentId);
}
