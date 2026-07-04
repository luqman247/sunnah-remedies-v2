/**
 * Phase 8 — Order Shipped Workflow
 *
 * order.shipped → shipping email → CRM timeline
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const orderShippedWorkflow = inngest.createFunction(
  {
    id: "order-shipped",
    name: "Order Shipped Notification",
    retries: 3,
    triggers: [{ event: "order.shipped" }],
  },
  async ({ event, step }) => {
    const { orderId, shopifyOrderId, personId, trackingNumber, carrier } = event.data;

    await step.run("send-shipping-email", async () => {
      logger.info("Sending shipping notification", { orderId, personId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Your Order Has Shipped — Sunnah Remedies",
          template: "order-shipped",
          data: { orderId, trackingNumber, carrier },
        });
      }
    });

    await step.run("update-order-status", async () => {
      await db
        .update(schema.orders)
        .set({
          status: "shipped",
          trackingNumber,
          carrier,
          updatedAt: new Date(),
        })
        .where(eq(schema.orders.shopifyOrderId, shopifyOrderId));
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "order_shipped",
        entityType: "order",
        entityId: orderId,
        summary: `Order shipped via ${carrier || "carrier"}`,
        metadata: { trackingNumber, carrier },
      });
    });

    return { status: "completed", orderId };
  }
);
