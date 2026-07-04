/**
 * Phase 8 — Order Refunded Workflow
 *
 * order.refunded → refund email → finance ledger → inventory
 * → CRM timeline
 *
 * Refunds above threshold require named human approval (Part 12).
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

const REFUND_APPROVAL_THRESHOLD = 100;

export const orderRefundedWorkflow = inngest.createFunction(
  {
    id: "order-refunded",
    name: "Order Refund Processing",
    retries: 3,
    triggers: [{ event: "order.refunded" }],
  },
  async ({ event, step }) => {
    const { orderId, shopifyOrderId, personId, refundAmount, currency, reason, approvedBy } = event.data;

    if (refundAmount > REFUND_APPROVAL_THRESHOLD && !approvedBy) {
      await step.run("request-approval", async () => {
        await db.insert(schema.approvals).values({
          type: "refund_approval",
          resource: "order",
          resourceId: orderId,
          status: "pending",
          note: `Refund of ${currency} ${refundAmount} requires approval. Reason: ${reason}`,
        });

        logger.warn("Refund above threshold requires approval", {
          orderId,
          refundAmount,
          threshold: REFUND_APPROVAL_THRESHOLD,
        });
      });

      return { status: "awaiting_approval", orderId, refundAmount };
    }

    await step.run("send-refund-email", async () => {
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Refund Processed — Sunnah Remedies",
          template: "order-refunded",
          data: { orderId, refundAmount, currency, reason },
        });
      }
    });

    await step.run("record-finance-ledger", async () => {
      await db.insert(schema.financeLedger).values({
        type: "refund",
        stripePaymentId: orderId,
        revenueStream: "product",
        amount: (-refundAmount).toFixed(2),
        currency,
        description: `Refund for order ${shopifyOrderId}: ${reason}`,
      });
    });

    await step.run("update-order-status", async () => {
      await db
        .update(schema.orders)
        .set({
          status: "refunded",
          refundAmount: refundAmount.toFixed(2),
          refundReason: reason,
          updatedAt: new Date(),
        })
        .where(eq(schema.orders.shopifyOrderId, shopifyOrderId));
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "order_refunded",
        entityType: "order",
        entityId: orderId,
        summary: `Refund processed: ${currency} ${refundAmount}`,
        metadata: { reason, approvedBy },
      });
    });

    return { status: "completed", orderId, refundAmount };
  }
);
