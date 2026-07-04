/**
 * Stripe webhook receiver — handles payment events.
 *
 * Verifies Stripe signature, prevents duplicates, dispatches to handlers.
 * Processes payment completions, failures, and refunds.
 *
 * @see Phase 4 Part 2, Spec 04 §4.7
 */

import { NextRequest, NextResponse } from "next/server";
import { getCommerceEnv } from "@/lib/commerce/config/env";
import {
  verifyStripeWebhook,
  isAlreadyProcessed,
  markProcessed,
} from "@/lib/commerce/webhooks";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("Stripe-Signature") ?? "";

  const env = getCommerceEnv();
  if (!verifyStripeWebhook(rawBody, signature, env.stripe.webhookSecret)) {
    console.warn("[Webhook/Stripe] Invalid signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      id: string;
      type: string;
      data: { object: Record<string, unknown> };
    };

    if (isAlreadyProcessed(event.id)) {
      return NextResponse.json({ status: "already_processed" });
    }

    await handleStripeEvent(event.type, event.data.object);
    markProcessed(event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook/Stripe] Processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function handleStripeEvent(
  type: string,
  data: Record<string, unknown>
) {
  switch (type) {
    case "payment_intent.succeeded": {
      const purpose = (data.metadata as Record<string, string>)?.purpose;
      console.info(`[Webhook/Stripe] Payment succeeded: ${data.id} (${purpose})`);
      break;
    }

    case "payment_intent.payment_failed": {
      console.warn(`[Webhook/Stripe] Payment failed: ${data.id}`);
      break;
    }

    case "charge.refunded": {
      console.info(`[Webhook/Stripe] Refund processed: ${data.id}`);
      break;
    }

    case "charge.dispute.created": {
      console.warn(`[Webhook/Stripe] Dispute created: ${data.id}`);
      break;
    }

    default:
      console.info(`[Webhook/Stripe] Unhandled event: ${type}`);
  }
}
