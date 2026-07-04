/**
 * Phase 8 — Inventory Low Workflow
 *
 * inventory.low → draft purchase order → supplier notification
 * → dashboard alert
 *
 * Human approves the PO before it is sent — procurement is a
 * spend decision (Part 12).
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";
import { createAlert } from "../../alerts/service";

export const inventoryLowWorkflow = inngest.createFunction(
  {
    id: "inventory-low",
    name: "Low Stock Reorder",
    retries: 3,
    triggers: [{ event: "inventory.low" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.INVENTORY)
    );
    if (!enabled) return { status: "skipped" };

    const { productId, sku, currentStock, reorderPoint, locationId } = event.data;

    const reorderRule = await step.run("get-reorder-rules", async () => {
      const rules = await db
        .select()
        .from(schema.reorderRules)
        .where(eq(schema.reorderRules.productId, productId))
        .limit(1);
      return rules[0] ?? null;
    });

    if (reorderRule) {
      await step.run("draft-purchase-order", async () => {
        const orderNumber = `PO-${Date.now()}`;
        const reorderQty = (reorderRule.parLevel ?? 0) - currentStock;

        await db.insert(schema.purchaseOrders).values({
          orderNumber,
          supplierId: reorderRule.preferredSupplierId ?? "00000000-0000-0000-0000-000000000000",
          status: "pending",
          items: [{
            productId,
            sku: sku ?? productId,
            quantity: Math.max(reorderQty, 1),
            unitCost: 0,
          }],
          notes: `Auto-generated: stock at ${currentStock}, reorder point ${reorderPoint}`,
        });

        await db.insert(schema.approvals).values({
          type: "purchase_order_approval",
          resource: "purchase_order",
          resourceId: orderNumber,
          status: "pending",
          note: `Restock ${productId}: current ${currentStock}, par ${reorderRule.parLevel}`,
        });

        logger.info("Draft PO created, awaiting approval", {
          orderNumber,
          productId,
          currentStock,
        });
      });
    }

    await step.run("create-alert", async () => {
      await createAlert({
        type: "inventory_low",
        severity: "warning",
        title: `Low stock: ${sku || productId}`,
        message: `Current stock: ${currentStock}, reorder point: ${reorderPoint} at ${locationId}`,
        resource: "product",
        resourceId: productId,
        deduplicationKey: `inventory-low:${productId}:${locationId}`,
      });
    });

    return { status: "completed", productId, currentStock };
  }
);
