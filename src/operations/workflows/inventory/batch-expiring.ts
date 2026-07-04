/**
 * Phase 8 — Batch Expiring Workflow
 *
 * inventory.batch_expiring → dispensary alert → quarantine workflow
 *
 * Expired stock is never auto-dispensed. Automation enforces quarantine
 * and blocks dispensing. Recalls are human-initiated.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";
import { createAlert } from "../../alerts/service";

export const batchExpiringWorkflow = inngest.createFunction(
  {
    id: "batch-expiring",
    name: "Batch Expiry Handler",
    retries: 3,
    triggers: [{ event: "inventory.batch_expiring" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.INVENTORY)
    );
    if (!enabled) return { status: "skipped" };

    const { batchId, productId, batchNumber, expiryDate, quantity, daysUntilExpiry } = event.data;

    if (daysUntilExpiry <= 0) {
      await step.run("quarantine-expired-batch", async () => {
        await db
          .update(schema.inventoryBatches)
          .set({
            status: "expired",
            quarantinedAt: new Date(),
            quarantineReason: "Batch expired",
          })
          .where(eq(schema.inventoryBatches.id, batchId));

        logger.warn("Batch quarantined — expired", { batchId, batchNumber, expiryDate });
      });
    } else if (daysUntilExpiry <= 30) {
      await step.run("quarantine-near-expiry", async () => {
        await db
          .update(schema.inventoryBatches)
          .set({
            status: "quarantined",
            quarantinedAt: new Date(),
            quarantineReason: `Approaching expiry: ${daysUntilExpiry} days remaining`,
          })
          .where(eq(schema.inventoryBatches.id, batchId));
      });
    }

    await step.run("create-alert", async () => {
      const severity = daysUntilExpiry <= 0 ? "critical" : daysUntilExpiry <= 7 ? "critical" : "warning";
      await createAlert({
        type: "batch_expiry",
        severity,
        title: `Batch ${batchNumber} ${daysUntilExpiry <= 0 ? "expired" : "expiring"}`,
        message: `Product ${productId}, ${quantity} units, expires ${expiryDate}. ${daysUntilExpiry} days remaining.`,
        resource: "batch",
        resourceId: batchId,
        deduplicationKey: `batch-expiry:${batchId}`,
      });
    });

    return { status: "completed", batchId, batchNumber, daysUntilExpiry };
  }
);
