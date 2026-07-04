/**
 * Inventory service — real-time stock status and back-in-stock notifications.
 *
 * Stock is ALWAYS live from Shopify. Never cached.
 * Provides derived status (in_stock, low_stock, out_of_stock, backorder).
 *
 * @see Phase 4 Part 2, Spec 01 §1.5, Spec 02 §2.4
 */

import { getVariantInventory } from "../shopify/products";
import { deriveInventoryStatus, LOW_STOCK_THRESHOLD } from "../shopify/types";
import type { InventoryStatus } from "../shopify/types";

export interface InventoryView {
  variantId: string;
  status: InventoryStatus;
  quantity: number | null;
  lowStockThreshold: number;
  message: string;
}

export async function getInventoryView(variantId: string): Promise<InventoryView | null> {
  const data = await getVariantInventory(variantId);
  if (!data) return null;

  const status = deriveInventoryStatus(data.availableForSale, data.quantity);

  return {
    variantId,
    status,
    quantity: data.quantity,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    message: getInventoryMessage(status, data.quantity),
  };
}

function getInventoryMessage(status: InventoryStatus, quantity: number | null): string {
  switch (status) {
    case "in_stock":
      return "Available";
    case "low_stock":
      return quantity !== null ? `Only ${quantity} remaining` : "Limited availability";
    case "out_of_stock":
      return "Currently unavailable";
    case "backorder":
      return "Available on backorder";
  }
}

export interface BackInStockRequest {
  email: string;
  variantId: string;
  productHandle: string;
}

const backInStockRegistry = new Map<string, Set<string>>();

export function registerBackInStock(request: BackInStockRequest): void {
  const key = request.variantId;
  if (!backInStockRegistry.has(key)) {
    backInStockRegistry.set(key, new Set());
  }
  backInStockRegistry.get(key)!.add(request.email);
}

export function getBackInStockSubscribers(variantId: string): string[] {
  return Array.from(backInStockRegistry.get(variantId) ?? []);
}
