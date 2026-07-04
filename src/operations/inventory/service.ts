/**
 * Phase 8 — Inventory Service
 *
 * Stock monitoring, batch/expiry tracking, supplier management,
 * purchase orders, reorder workflows.
 *
 * Location-scoped from day one for future multi-warehouse support.
 * Expired/quarantined batches are NEVER auto-dispensed.
 */

import { db, schema } from "../db";
import { eq, and, lte, gte, desc, ne, count, sum } from "drizzle-orm";
import { emitEvent } from "../events/emit";
import { logger } from "../logging";

/* ── Stock Queries ──────────────────────────────────────────────── */

export async function getStockLevel(productId: string, locationId = "primary") {
  const activeBatches = await db
    .select()
    .from(schema.inventoryBatches)
    .where(
      and(
        eq(schema.inventoryBatches.productId, productId),
        eq(schema.inventoryBatches.locationId, locationId),
        eq(schema.inventoryBatches.status, "active")
      )
    );

  const totalStock = activeBatches.reduce((sum, b) => sum + b.quantity, 0);

  return {
    productId,
    locationId,
    totalStock,
    batchCount: activeBatches.length,
    batches: activeBatches,
  };
}

export async function getLowStockProducts(locationId = "primary") {
  const rules = await db
    .select()
    .from(schema.reorderRules)
    .where(
      and(
        eq(schema.reorderRules.locationId, locationId),
        eq(schema.reorderRules.isActive, true)
      )
    );

  const lowStock: Array<{
    productId: string;
    currentStock: number;
    reorderPoint: number;
    parLevel: number;
  }> = [];

  for (const rule of rules) {
    const stock = await getStockLevel(rule.productId, locationId);
    if (stock.totalStock <= rule.reorderPoint) {
      lowStock.push({
        productId: rule.productId,
        currentStock: stock.totalStock,
        reorderPoint: rule.reorderPoint,
        parLevel: rule.parLevel,
      });
    }
  }

  return lowStock;
}

/* ── Batch Operations ───────────────────────────────────────────── */

export async function recordIncomingDelivery(delivery: {
  productId: string;
  shopifyVariantId?: string;
  sku?: string;
  batchNumber: string;
  supplierId?: string;
  quantity: number;
  expiryDate?: Date;
  locationId?: string;
}) {
  const result = await db
    .insert(schema.inventoryBatches)
    .values({
      productId: delivery.productId,
      shopifyVariantId: delivery.shopifyVariantId,
      sku: delivery.sku,
      batchNumber: delivery.batchNumber,
      supplierId: delivery.supplierId,
      quantity: delivery.quantity,
      originalQuantity: delivery.quantity,
      expiryDate: delivery.expiryDate,
      locationId: delivery.locationId ?? "primary",
      status: "active",
    })
    .returning({ id: schema.inventoryBatches.id });

  logger.info("Incoming delivery recorded", {
    batchId: result[0].id,
    productId: delivery.productId,
    quantity: delivery.quantity,
  });

  return result[0].id;
}

export async function getExpiringBatches(daysAhead: number, locationId = "primary") {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return db
    .select()
    .from(schema.inventoryBatches)
    .where(
      and(
        eq(schema.inventoryBatches.locationId, locationId),
        eq(schema.inventoryBatches.status, "active"),
        lte(schema.inventoryBatches.expiryDate, futureDate)
      )
    )
    .orderBy(schema.inventoryBatches.expiryDate);
}

export async function checkAndEmitExpiryAlerts(daysAhead = 90): Promise<number> {
  const expiring = await getExpiringBatches(daysAhead);
  let emitted = 0;

  for (const batch of expiring) {
    if (!batch.expiryDate) continue;
    const daysUntil = Math.floor(
      (new Date(batch.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    await emitEvent("inventory.batch_expiring", {
      batchId: batch.id,
      productId: batch.productId,
      batchNumber: batch.batchNumber,
      expiryDate: new Date(batch.expiryDate).toISOString(),
      quantity: batch.quantity,
      locationId: batch.locationId ?? "primary",
      daysUntilExpiry: daysUntil,
    });
    emitted++;
  }

  return emitted;
}

export async function checkAndEmitLowStockAlerts(locationId = "primary"): Promise<number> {
  const lowStockProducts = await getLowStockProducts(locationId);
  let emitted = 0;

  for (const product of lowStockProducts) {
    await emitEvent("inventory.low", {
      productId: product.productId,
      shopifyVariantId: "",
      sku: product.productId,
      currentStock: product.currentStock,
      reorderPoint: product.reorderPoint,
      locationId,
    });
    emitted++;
  }

  return emitted;
}

/* ── Purchase Order Operations ──────────────────────────────────── */

export async function getPendingPurchaseOrders() {
  return db
    .select()
    .from(schema.purchaseOrders)
    .where(eq(schema.purchaseOrders.status, "pending"))
    .orderBy(desc(schema.purchaseOrders.createdAt));
}

export async function approvePurchaseOrder(
  orderId: string,
  staffUserId: string
): Promise<void> {
  await db
    .update(schema.purchaseOrders)
    .set({
      status: "approved",
      approvedBy: staffUserId,
      approvedAt: new Date(),
    })
    .where(eq(schema.purchaseOrders.id, orderId));

  logger.info("Purchase order approved", { orderId, staffUserId });
}
