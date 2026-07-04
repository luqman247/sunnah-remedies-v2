/**
 * Payment Intent API — creates Stripe Payment Intents for institutional flows.
 *
 * For non-catalog payments: donations, memberships, course access, etc.
 * Card data never touches our servers — Stripe.js handles tokenisation.
 *
 * @see Phase 4 Part 2, Spec 04 §4.3
 */

import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/commerce/stripe";
import { isCommerceConfigured } from "@/lib/commerce/config/env";
import type { InstitutionalPaymentPurpose } from "@/lib/commerce/stripe/types";
import { randomUUID } from "crypto";

const VALID_PURPOSES: InstitutionalPaymentPurpose[] = [
  "donation",
  "membership",
  "subscription",
  "instalment",
  "invoice",
  "course_access",
  "consultation_fee",
  "journey_deposit",
  "journey_balance",
];

export async function POST(request: NextRequest) {
  if (!isCommerceConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { amount, purpose, description, email, metadata } = body as {
      amount: number;
      purpose: string;
      description: string;
      email?: string;
      metadata?: Record<string, string>;
    };

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Amount must be at least £1.00 (100 pence)" }, { status: 400 });
    }

    if (!purpose || !VALID_PURPOSES.includes(purpose as InstitutionalPaymentPurpose)) {
      return NextResponse.json({ error: "Invalid payment purpose" }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ error: "Description required" }, { status: 400 });
    }

    const result = await createPaymentIntent({
      amount,
      purpose: purpose as InstitutionalPaymentPurpose,
      description,
      customerEmail: email,
      metadata,
      idempotencyKey: randomUUID(),
    });

    return NextResponse.json({
      clientSecret: result.clientSecret,
      intentId: result.intentId,
    });
  } catch (error) {
    console.error("[Payments API] Error:", error);
    const message = error instanceof Error ? error.message : "Payment creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
