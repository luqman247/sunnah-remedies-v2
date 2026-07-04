/**
 * Phase 8 — Certificate Earned Workflow
 *
 * certificate.earned → generate certificate → email → portal → CRM
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const certificateEarnedWorkflow = inngest.createFunction(
  {
    id: "certificate-earned",
    name: "Certificate Issuance",
    retries: 3,
    triggers: [{ event: "certificate.earned" }],
  },
  async ({ event, step }) => {
    const { certificateId, studentId, personId, courseId, issuedAt } = event.data;

    const certificateNumber = await step.run("generate-certificate", async () => {
      const certNum = `SR-CERT-${Date.now()}`;
      await db.insert(schema.certificates).values({
        personId,
        courseId,
        courseName: courseId,
        certificateNumber: certNum,
        issuedAt: new Date(issuedAt),
      });
      return certNum;
    });

    await step.run("send-certificate-email", async () => {
      logger.info("Sending certificate email", { personId, certificateNumber });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Certificate of Completion — Sunnah Remedies Academy",
          template: "certificate",
          data: { certificateNumber, courseId },
        });
      }
    });

    await step.run("update-enrolment", async () => {
      const enrolment = await db
        .select()
        .from(schema.enrolments)
        .where(eq(schema.enrolments.entityId, courseId))
        .limit(1);
      if (enrolment[0]) {
        await db
          .update(schema.enrolments)
          .set({ completedAt: new Date(), certificateId })
          .where(eq(schema.enrolments.id, enrolment[0].id));
      }
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "certificate_earned",
        entityType: "course",
        entityId: courseId,
        summary: `Certificate earned: ${certificateNumber}`,
      });
    });

    return { status: "completed", personId, certificateNumber };
  }
);
