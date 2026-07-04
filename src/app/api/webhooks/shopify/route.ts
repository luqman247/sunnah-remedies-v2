/**
 * Shopify webhook receiver — handles product/order/inventory events.
 *
 * Verifies HMAC, prevents duplicates, dispatches to handlers.
 * Revalidates relevant Next.js pages on product/inventory changes.
 *
 * @see Phase 4 Part 2, Spec 05
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCommerceEnv } from "@/lib/commerce/config/env";
import {
  verifyShopifyWebhook,
  isAlreadyProcessed,
  markProcessed,
} from "@/lib/commerce/webhooks";
import {
  processOrderCreated as emitOrderAnalytics,
  processOrderCancelled as emitCancelAnalytics,
} from "../../../../../analytics/server/webhooks/shopify";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const hmac = request.headers.get("X-Shopify-Hmac-Sha256") ?? "";
  const topic = request.headers.get("X-Shopify-Topic") ?? "";
  const webhookId = request.headers.get("X-Shopify-Webhook-Id") ?? "";

  const env = getCommerceEnv();
  if (!verifyShopifyWebhook(rawBody, hmac, env.shopify.webhookSecret)) {
    console.warn("[Webhook/Shopify] Invalid HMAC signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (webhookId && isAlreadyProcessed(webhookId)) {
    return NextResponse.json({ status: "already_processed" });
  }

  try {
    const payload = JSON.parse(rawBody);
    await handleShopifyTopic(topic, payload);

    if (webhookId) markProcessed(webhookId);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Webhook/Shopify] Processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function handleShopifyTopic(topic: string, payload: Record<string, unknown>) {
  switch (topic) {
    case "products/create":
    case "products/update":
    case "products/delete": {
      const handle = payload.handle as string | undefined;
      if (handle) {
        revalidatePath("/[locale]/the-apothecary", "page");
        revalidatePath(`/[locale]/the-apothecary/${handle}`, "page");
      }
      break;
    }

    case "inventory_levels/update": {
      revalidatePath("/[locale]/the-apothecary", "page");
      break;
    }

    case "orders/create": {
      await handleOrderCreated(payload);
      break;
    }

    case "orders/fulfilled": {
      await handleOrderFulfilled(payload);
      break;
    }

    case "orders/cancelled": {
      await handleOrderCancelled(payload);
      break;
    }

    case "collections/update":
    case "collections/create":
    case "collections/delete": {
      revalidatePath("/[locale]/the-apothecary", "page");
      break;
    }

    default:
      console.info(`[Webhook/Shopify] Unhandled topic: ${topic}`);
  }
}

async function handleOrderCreated(payload: Record<string, unknown>) {
  console.info(`[Webhook/Shopify] Order created: ${payload.id}`);
  await emitOrderAnalytics(payload);
}

async function handleOrderFulfilled(payload: Record<string, unknown>) {
  console.info(`[Webhook/Shopify] Order fulfilled: ${payload.id}`);
  const { emitEvent } = await import("@/operations/events/emit");
  await emitEvent("order.shipped", {
    orderId: (payload.id as number)?.toString() ?? "",
    shopifyOrderId: (payload.id as number)?.toString() ?? "",
    personId: "",
    trackingNumber: (payload.fulfillments as Array<{ tracking_number?: string }>)?.[0]?.tracking_number,
    carrier: (payload.fulfillments as Array<{ tracking_company?: string }>)?.[0]?.tracking_company,
  });
}

async function handleOrderCancelled(payload: Record<string, unknown>) {
  console.info(`[Webhook/Shopify] Order cancelled: ${payload.id}`);
  await emitCancelAnalytics(payload);
}
