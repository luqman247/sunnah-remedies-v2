/**
 * Phase 8 — Invoice Issued Workflow
 *
 * invoice.issued → email invoice → record in ledger
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const invoiceIssuedWorkflow = inngest.createFunction(
  {
    id: "invoice-issued",
    name: "Invoice Email Dispatch",
    retries: 3,
    triggers: [{ event: "invoice.issued" }],
  },
  async ({ event, step }) => {
    const { invoiceId, orderId, personId, totalAmount, vatAmount, currency } = event.data;

    await step.run("send-invoice-email", async () => {
      logger.info("Sending invoice email", { invoiceId, personId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: `Invoice ${invoiceId} — Sunnah Remedies`,
          template: "invoice",
          data: { invoiceId, totalAmount, vatAmount, currency },
        });
      }
    });

    await step.run("log-communication", async () => {
      await db.insert(schema.communications).values({
        personId,
        channel: "email",
        type: "invoice",
        subject: `Invoice ${invoiceId}`,
        templateId: "invoice",
      });
    });

    return { status: "completed", invoiceId };
  }
);
