/**
 * Shopify webhook analytics — order truth.
 *
 * Processes Shopify order webhooks to emit server-side purchase and
 * refund events. The source of truth for revenue — GA4 client events
 * are reconciled, never additive.
 */

import { trackServerPurchase, trackServerRefund } from "../server-events";
import { buildProductItem } from "../../lib/ecommerce";
import type { EcommerceItem } from "../../lib/types";

interface ShopifyLineItem {
  product_id?: number;
  title?: string;
  variant_title?: string;
  price?: string;
  quantity?: number;
  sku?: string;
}

interface ShopifyOrder {
  id: number;
  name?: string;
  total_price?: string;
  subtotal_price?: string;
  total_tax?: string;
  total_shipping_price_set?: {
    shop_money?: { amount?: string };
  };
  currency?: string;
  line_items?: ShopifyLineItem[];
  discount_codes?: Array<{ code?: string }>;
  client_details?: { browser_ip?: string };
  note_attributes?: Array<{ name?: string; value?: string }>;
}

/**
 * Process a Shopify orders/create webhook for analytics.
 */
export async function processOrderCreated(
  payload: Record<string, unknown>
): Promise<void> {
  const order = payload as unknown as ShopifyOrder;

  const items: EcommerceItem[] = (order.line_items || []).map((li, i) =>
    buildProductItem({
      id: String(li.product_id || li.sku || ""),
      name: li.title || "Unknown",
      variant: li.variant_title,
      price: li.price ? parseFloat(li.price) : undefined,
      quantity: li.quantity,
      index: i,
    })
  );

  const value = order.total_price ? parseFloat(order.total_price) : 0;
  const tax = order.total_tax ? parseFloat(order.total_tax) : undefined;
  const shipping = order.total_shipping_price_set?.shop_money?.amount
    ? parseFloat(order.total_shipping_price_set.shop_money.amount)
    : undefined;
  const coupon = order.discount_codes?.[0]?.code;

  const clientId = extractClientId(order) || generatePseudonymousId(order);

  await trackServerPurchase(
    String(order.id),
    items,
    value,
    order.currency || "GBP",
    clientId,
    tax,
    shipping,
    coupon
  );
}

/**
 * Process a Shopify orders/cancelled webhook for analytics (refund).
 */
export async function processOrderCancelled(
  payload: Record<string, unknown>
): Promise<void> {
  const order = payload as unknown as ShopifyOrder;

  const items: EcommerceItem[] = (order.line_items || []).map((li, i) =>
    buildProductItem({
      id: String(li.product_id || li.sku || ""),
      name: li.title || "Unknown",
      variant: li.variant_title,
      price: li.price ? parseFloat(li.price) : undefined,
      quantity: li.quantity,
      index: i,
    })
  );

  const value = order.total_price ? parseFloat(order.total_price) : 0;
  const clientId = extractClientId(order) || generatePseudonymousId(order);

  await trackServerRefund(
    String(order.id),
    items,
    value,
    order.currency || "GBP",
    clientId
  );
}

function extractClientId(order: ShopifyOrder): string | null {
  const attr = order.note_attributes?.find((a) => a.name === "_ga_client_id");
  return attr?.value || null;
}

function generatePseudonymousId(order: ShopifyOrder): string {
  const seed = `${order.id}-${order.client_details?.browser_ip || "server"}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return `server.${Math.abs(hash).toString(36)}`;
}
