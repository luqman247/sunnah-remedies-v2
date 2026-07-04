/**
 * Phase 8 — Course Session Reminder Workflow
 *
 * course.session_upcoming → reminder emails to all enrolled students
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq, inArray } from "drizzle-orm";

export const courseSessionReminderWorkflow = inngest.createFunction(
  {
    id: "course-session-reminder",
    name: "Course Session Reminder",
    retries: 3,
    triggers: [{ event: "course.session_upcoming" }],
  },
  async ({ event, step }) => {
    const { courseId, sessionId, scheduledAt, studentIds } = event.data;

    await step.run("send-reminders", async () => {
      logger.info("Sending session reminders", { courseId, sessionId, studentCount: studentIds.length });
      const { sendTransactionalEmail } = await import("../../email/service/resend");

      const people = await db
        .select()
        .from(schema.people)
        .where(inArray(schema.people.id, studentIds));

      for (const person of people) {
        await sendTransactionalEmail({
          to: person.email,
          subject: "Session Reminder — Sunnah Remedies Academy",
          template: "course-reminder",
          data: { courseId, sessionId, scheduledAt },
        });
      }
    });

    return { status: "completed", courseId, studentCount: studentIds.length };
  }
);
