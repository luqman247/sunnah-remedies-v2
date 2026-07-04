/**
 * Phase 8 — Order Paid Workflow
 *
 * order.paid → confirmation email → invoice → inventory decrement
 * → finance ledger → CRM timeline → analytics
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const orderPaidWorkflow = inngest.createFunction(
  {
    id: "order-paid",
    name: "Order Paid Processing",
    retries: 3,
    triggers: [{ event: "order.paid" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.ORDER_PROCESSING)
    );
    if (!enabled) return { status: "skipped" };

    const { orderId, shopifyOrderId, stripePaymentIntentId, personId, totalAmount, currency, lineItems } = event.data;

    const order = await step.run("record-order", async () => {
      const result = await db
        .insert(schema.orders)
        .values({
          personId,
          shopifyOrderId,
          stripePaymentIntentId,
          status: "paid",
          totalAmount: totalAmount.toString(),
          currency,
          lineItems,
        })
        .returning({ id: schema.orders.id });
      return result[0];
    });

    await step.run("send-confirmation-email", async () => {
      logger.info("Sending order confirmation email", { orderId, personId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Order Confirmation — Sunnah Remedies",
          template: "order-confirmation",
          data: { orderId, totalAmount, currency, lineItems },
        });
      }
    });

    await step.run("generate-invoice", async () => {
      const invoiceNumber = `SR-${Date.now()}`;
      const vatRate = 0.20;
      const subtotal = totalAmount / (1 + vatRate);
      const vatAmount = totalAmount - subtotal;

      await db.insert(schema.invoices).values({
        invoiceNumber,
        orderId: order.id,
        personId,
        subtotal: subtotal.toFixed(2),
        vatRate: vatRate.toFixed(4),
        vatAmount: vatAmount.toFixed(2),
        total: totalAmount.toFixed(2),
        currency,
        lineItems: lineItems.map((li: { productId: string; quantity: number; amount: number }) => ({
          description: li.productId,
          quantity: li.quantity,
          unitPrice: li.amount / li.quantity,
          total: li.amount,
        })),
        paidAt: new Date(),
      });

      await inngest.send({
        name: "invoice.issued",
        data: {
          invoiceId: invoiceNumber,
          orderId,
          personId,
          totalAmount,
          vatAmount,
          currency,
        },
      });
    });

    await step.run("record-finance-ledger", async () => {
      const vatRate = 0.20;
      const subtotal = totalAmount / (1 + vatRate);
      const vatAmount = totalAmount - subtotal;

      await db.insert(schema.financeLedger).values({
        type: "payment",
        orderId: order.id,
        stripePaymentId: stripePaymentIntentId,
        revenueStream: "product",
        amount: totalAmount.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        currency,
        description: `Order ${shopifyOrderId}`,
      });
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "order_paid",
        entityType: "order",
        entityId: orderId,
        summary: `Order paid: ${currency} ${totalAmount}`,
        metadata: { shopifyOrderId, lineItems },
      });
    });

    await step.run("log-completion", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName: "order-paid",
        eventName: "order.paid",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: { orderId, totalAmount },
      });
    });

    return { status: "completed", orderId };
  }
);
