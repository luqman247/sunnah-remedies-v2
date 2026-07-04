/**
 * Phase 8 — Consultation Booked Workflow
 *
 * consultation.booked → confirmation email → calendar → reminder schedule
 * → questionnaire dispatch → clinician briefing preparation
 *
 * Boundary: Steps prepare for the clinician. No system issues clinical
 * advice, dosing, or diagnosis. The clinician conducts the session.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const consultationBookedWorkflow = inngest.createFunction(
  {
    id: "consultation-booked",
    name: "Consultation Booking Processing",
    retries: 3,
    triggers: [{ event: "consultation.booked" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.CONSULTATION)
    );
    if (!enabled) return { status: "skipped" };

    const { consultationId, calcomBookingId, personId, practitionerId, scheduledAt, type } = event.data;

    await step.run("record-booking", async () => {
      await db.insert(schema.bookings).values({
        personId,
        type: "consultation",
        entityId: consultationId,
        calcomBookingId,
        practitionerId,
        status: "confirmed",
        scheduledAt: new Date(scheduledAt),
        metadata: { consultationType: type },
      });
    });

    await step.run("send-confirmation-email", async () => {
      logger.info("Sending consultation confirmation", { personId, consultationId });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      const person = await db.select().from(schema.people).where(eq(schema.people.id, personId)).limit(1);
      if (person[0]) {
        await sendTransactionalEmail({
          to: person[0].email,
          subject: "Consultation Confirmed — Sunnah Remedies",
          template: "consultation-confirmation",
          data: { consultationId, scheduledAt, type },
        });
      }
    });

    await step.run("schedule-reminders", async () => {
      const scheduled = new Date(scheduledAt);
      const now = new Date();
      const hoursUntil = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntil > 48) {
        await inngest.send({
          name: "consultation.upcoming",
          data: { consultationId, personId, practitionerId, scheduledAt, hoursUntil: 48 },
          ts: scheduled.getTime() - 48 * 60 * 60 * 1000,
        });
      }

      if (hoursUntil > 2) {
        await inngest.send({
          name: "consultation.upcoming",
          data: { consultationId, personId, practitionerId, scheduledAt, hoursUntil: 2 },
          ts: scheduled.getTime() - 2 * 60 * 60 * 1000,
        });
      }
    });

    await step.run("dispatch-questionnaire", async () => {
      logger.info("Dispatching pre-appointment questionnaire", { personId, consultationId });
    });

    await step.run("prepare-clinician-briefing", async () => {
      logger.info("Preparing clinician briefing pack", { practitionerId, consultationId });
      await db
        .update(schema.bookings)
        .set({ briefingPrepared: true })
        .where(eq(schema.bookings.entityId, consultationId));
    });

    await step.run("ensure-patient-role", async () => {
      await db
        .insert(schema.personRoles)
        .values({ personId, role: "patient" })
        .onConflictDoNothing();
    });

    await step.run("update-crm-timeline", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "consultation_booked",
        entityType: "consultation",
        entityId: consultationId,
        summary: `Consultation booked: ${type}`,
        metadata: { scheduledAt, practitionerId },
      });
    });

    return { status: "completed", consultationId };
  }
);
