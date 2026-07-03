/**
 * Stripe Integration — Architecture Preparation
 *
 * This module prepares the architecture for future Stripe payment integration.
 * When activated, Stripe will handle:
 * - Card payments
 * - Apple Pay
 * - Google Pay
 * - Invoicing
 * - Refund processing
 * - Payment intents for courses and journeys
 *
 * DO NOT implement Stripe during Phase 2.
 * This file exists solely to define the integration interface.
 */

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "requires_confirmation" | "succeeded" | "canceled";
  clientSecret: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  paymentStatus: "paid" | "unpaid" | "no_payment_required";
  amountTotal: number;
  currency: string;
}

export type PaymentPurpose =
  | "product_purchase"
  | "programme_fee"
  | "programme_deposit"
  | "journey_deposit"
  | "journey_balance"
  | "consultation_fee";

export interface CreatePaymentOptions {
  amount: number;
  currency?: string;
  purpose: PaymentPurpose;
  description: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

/**
 * Future: Create a Stripe payment intent.
 */
export async function createPaymentIntent(
  _options: CreatePaymentOptions
): Promise<PaymentIntent | null> {
  return null;
}

/**
 * Future: Create a Stripe Checkout session.
 */
export async function createCheckoutSession(
  _options: CreatePaymentOptions & {
    successUrl: string;
    cancelUrl: string;
  }
): Promise<CheckoutSession | null> {
  return null;
}

/**
 * Future: Process a refund.
 */
export async function createRefund(
  _paymentIntentId: string,
  _amount?: number
): Promise<{ id: string; status: string } | null> {
  return null;
}

/**
 * Future: Verify a Stripe webhook signature.
 */
export function verifyWebhookSignature(
  _payload: string | Buffer,
  _signature: string
): boolean {
  return false;
}
