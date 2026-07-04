/**
 * Phase 8 — Consultation Completed Workflow
 *
 * consultation.completed → follow-up sequence → feedback request
 * → knowledge recommendations (educational only, never clinical)
 *
 * Boundary: Knowledge recommendations are general educational content.
 * They never constitute personalised clinical advice.
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const consultationCompletedWorkflow = inngest.createFunction(
  {
    id: "consultation-completed",
    name: "Post-Consultation Follow-up",
    retries: 3,
    triggers: [{ event: "consultation.completed" }],
  },
  async ({ event, step }) => {
    const { consultationId, personId, practitionerId } = event.data;

    await step.run("update-booking-status", async () => {
      await db
        .update(schema.bookings)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(schema.bookings.entityId, consultationId));
    });

    await step.sleep("wait-for-follow-up", "2h");

    await step.run("send-follow-up", async () => {
      logger.info("Sending post-consultation follow-up", { personId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "After Your Consultation — Sunnah Remedies",
          template: "consultation-followup",
          data: { consultationId },
        });
      }
    });

    await step.sleep("wait-for-feedback", "24h");

    await step.run("request-feedback", async () => {
      logger.info("Requesting consultation feedback", { personId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Your Experience — Sunnah Remedies",
          template: "consultation-feedback",
          data: { consultationId },
        });
      }

      await db
        .update(schema.bookings)
        .set({ feedbackRequested: true })
        .where(eq(schema.bookings.entityId, consultationId));
    });

    await step.run("send-knowledge-recommendations", async () => {
      logger.info("Sending educational recommendations", { personId });
      // General educational content, never personalised clinical advice
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "consultation_completed",
        entityType: "consultation",
        entityId: consultationId,
        summary: "Consultation completed",
        metadata: { practitionerId },
      });
    });

    return { status: "completed", consultationId };
  }
);
