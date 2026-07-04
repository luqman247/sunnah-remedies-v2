/**
 * Phase 8 — Consultation Reminder Workflow
 *
 * consultation.upcoming → reminder email (timezone-aware)
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const consultationReminderWorkflow = inngest.createFunction(
  {
    id: "consultation-reminder",
    name: "Consultation Reminder",
    retries: 3,
    triggers: [{ event: "consultation.upcoming" }],
  },
  async ({ event, step }) => {
    const { consultationId, personId, scheduledAt, hoursUntil } = event.data;

    await step.run("send-reminder", async () => {
      logger.info("Sending consultation reminder", { personId, hoursUntil });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: `Consultation Reminder — ${hoursUntil <= 2 ? "Starting Soon" : "Tomorrow"}`,
          template: "consultation-reminder",
          data: { consultationId, scheduledAt, hoursUntil },
        });
      }
    });

    return { status: "completed", consultationId, hoursUntil };
  }
);
