/**
 * Stripe institutional payment types.
 *
 * @see Phase 4 Part 2, Spec 04
 */

export type InstitutionalPaymentPurpose =
  | "donation"
  | "membership"
  | "subscription"
  | "instalment"
  | "invoice"
  | "course_access"
  | "consultation_fee"
  | "journey_deposit"
  | "journey_balance";

export interface CreateIntentOptions {
  amount: number;
  currency?: string;
  purpose: InstitutionalPaymentPurpose;
  description: string;
  customerEmail?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  idempotencyKey: string;
}

export interface IntentResult {
  clientSecret: string;
  intentId: string;
  status: string;
}

export interface EntitlementGrant {
  userId: string;
  type: "membership" | "course" | "download" | "certificate";
  resourceId: string;
  grantedAt: string;
  expiresAt?: string;
  sourcePaymentId: string;
}

export interface RefundRequest {
  paymentIntentId: string;
  amount?: number;
  reason?: "requested_by_customer" | "duplicate" | "fraudulent";
  idempotencyKey: string;
}
