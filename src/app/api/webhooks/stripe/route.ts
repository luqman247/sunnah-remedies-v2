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
import {
  processPaymentSucceeded as emitPaymentAnalytics,
  processChargeRefunded as emitRefundAnalytics,
} from "../../../../../analytics/server/webhooks/stripe";

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
  const { emitEvent } = await import("@/operations/events/emit");

  switch (type) {
    case "payment_intent.succeeded": {
      const purpose = (data.metadata as Record<string, string>)?.purpose;
      console.info(`[Webhook/Stripe] Payment succeeded: ${data.id} (${purpose})`);
      await emitPaymentAnalytics(data);

      await emitEvent("order.paid", {
        orderId: (data.id as string) ?? "",
        shopifyOrderId: (data.metadata as Record<string, string>)?.shopifyOrderId ?? "",
        stripePaymentIntentId: (data.id as string) ?? "",
        personId: (data.metadata as Record<string, string>)?.personId ?? "",
        totalAmount: ((data.amount as number) ?? 0) / 100,
        currency: (data.currency as string)?.toUpperCase() ?? "GBP",
        lineItems: [],
      });
      break;
    }

    case "payment_intent.payment_failed": {
      console.warn(`[Webhook/Stripe] Payment failed: ${data.id}`);
      const { createAlert } = await import("@/operations/alerts/service");
      await createAlert({
        type: "payment_failure",
        severity: "critical",
        title: "Payment failed",
        message: `Payment intent ${data.id} failed`,
        resource: "payment",
        resourceId: data.id as string,
        deduplicationKey: `payment-fail:${data.id}`,
      });
      break;
    }

    case "charge.refunded": {
      console.info(`[Webhook/Stripe] Refund processed: ${data.id}`);
      await emitRefundAnalytics(data);

      await emitEvent("order.refunded", {
        orderId: (data.payment_intent as string) ?? "",
        shopifyOrderId: "",
        personId: "",
        refundAmount: ((data.amount_refunded as number) ?? 0) / 100,
        currency: (data.currency as string)?.toUpperCase() ?? "GBP",
        reason: "Stripe refund",
      });
      break;
    }

    case "charge.dispute.created": {
      console.warn(`[Webhook/Stripe] Dispute created: ${data.id}`);
      const { createAlert } = await import("@/operations/alerts/service");
      await createAlert({
        type: "dispute_created",
        severity: "critical",
        title: "Payment dispute created",
        message: `Dispute on charge ${data.id}`,
        resource: "payment",
        resourceId: data.id as string,
        deduplicationKey: `dispute:${data.id}`,
      });
      break;
    }

    default:
      console.info(`[Webhook/Stripe] Unhandled event: ${type}`);
  }
}
