/**
 * Phase 8 — Journey Completed Workflow
 *
 * journey.completed → follow-up → reflection → community → feedback
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const journeyCompletedWorkflow = inngest.createFunction(
  {
    id: "journey-completed",
    name: "Post-Journey Follow-up",
    retries: 3,
    triggers: [{ event: "journey.completed" }],
  },
  async ({ event, step }) => {
    const { journeyId, personId, enrolmentId } = event.data;

    await step.run("update-enrolment", async () => {
      const enrolment = await db
        .select()
        .from(schema.enrolments)
        .where(eq(schema.enrolments.entityId, journeyId))
        .limit(1);
      if (enrolment[0]) {
        await db
          .update(schema.enrolments)
          .set({ completedAt: new Date() })
          .where(eq(schema.enrolments.id, enrolment[0].id));
      }
    });

    await step.sleep("wait-for-return", "48h");

    await step.run("send-follow-up", async () => {
      logger.info("Sending journey follow-up", { personId, journeyId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Reflections on Your Journey — Sunnah Remedies",
          template: "journey-followup",
          data: { journeyId },
        });
      }
    });

    await step.run("invite-to-community", async () => {
      logger.info("Inviting to journey community", { personId, journeyId });
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "journey_completed",
        entityType: "journey",
        entityId: journeyId,
        summary: "Completed Sacred Journey",
      });
    });

    return { status: "completed", personId, journeyId };
  }
);
