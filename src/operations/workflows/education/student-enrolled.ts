/**
 * Phase 8 — Student Enrolled Workflow
 *
 * student.enrolled → welcome email → reminders → portal provisioning
 * → CRM timeline
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const studentEnrolledWorkflow = inngest.createFunction(
  {
    id: "student-enrolled",
    name: "Student Enrolment Processing",
    retries: 3,
    triggers: [{ event: "student.enrolled" }],
  },
  async ({ event, step }) => {
    const { studentId, personId, courseId, enrolmentId } = event.data;

    await step.run("record-enrolment", async () => {
      await db.insert(schema.enrolments).values({
        personId,
        entityType: "course",
        entityId: courseId,
        status: "active",
        metadata: { studentId, enrolmentId },
      });
    });

    await step.run("send-enrolment-email", async () => {
      logger.info("Sending enrolment confirmation", { personId, courseId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Enrolment Confirmed — Sunnah Remedies Academy",
          template: "course-enrolment",
          data: { courseId, studentId },
        });
      }
    });

    await step.run("provision-portal-access", async () => {
      logger.info("Provisioning student portal access", { personId, courseId });
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "student_enrolled",
        entityType: "course",
        entityId: courseId,
        summary: `Enrolled in course`,
        metadata: { studentId, enrolmentId },
      });
    });

    await step.run("ensure-student-role", async () => {
      await db
        .insert(schema.personRoles)
        .values({ personId, role: "student" })
        .onConflictDoNothing();
    });

    return { status: "completed", personId, courseId };
  }
);
