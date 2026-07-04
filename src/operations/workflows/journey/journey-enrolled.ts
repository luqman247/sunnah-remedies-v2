/**
 * Phase 8 — Journey Enrolled Workflow
 *
 * journey.enrolled → confirmation → preparation schedule → documents
 * → travel info → reminders
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const journeyEnrolledWorkflow = inngest.createFunction(
  {
    id: "journey-enrolled",
    name: "Journey Enrolment Processing",
    retries: 3,
    triggers: [{ event: "journey.enrolled" }],
  },
  async ({ event, step }) => {
    const { journeyId, personId, enrolmentId } = event.data;

    await step.run("record-enrolment", async () => {
      await db.insert(schema.enrolments).values({
        personId,
        entityType: "journey",
        entityId: journeyId,
        status: "active",
        metadata: { enrolmentId },
      });
    });

    await step.run("send-confirmation", async () => {
      logger.info("Sending journey confirmation", { personId, journeyId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Journey Confirmed — Sunnah Remedies",
          template: "journey-confirmation",
          data: { journeyId, enrolmentId },
        });
      }
    });

    await step.run("send-preparation-guide", async () => {
      logger.info("Sending preparation guide", { personId, journeyId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Journey Preparation — Sunnah Remedies",
          template: "journey-preparation",
          data: { journeyId },
        });
      }
    });

    await step.run("dispatch-documents", async () => {
      logger.info("Dispatching journey documents", { personId, journeyId });
    });

    await step.run("send-travel-info", async () => {
      logger.info("Sending travel information", { personId, journeyId });
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "journey_enrolled",
        entityType: "journey",
        entityId: journeyId,
        summary: "Enrolled in Sacred Journey",
        metadata: { enrolmentId },
      });
    });

    return { status: "completed", personId, journeyId };
  }
);
