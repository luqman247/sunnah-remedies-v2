/**
 * Phase 8 — Course Launch Workflow
 *
 * course.launched → publish → homepage → announcement emails
 * → calendar → waiting list → certificate template → student portal
 * → SEO → analytics
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const courseLaunchWorkflow = inngest.createFunction(
  {
    id: "course-launch",
    name: "Course Launch Propagation",
    retries: 3,
    triggers: [{ event: "course.launched" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.COURSE_LAUNCH)
    );
    if (!enabled) return { status: "skipped" };

    const { courseId, slug, title, capacity, startDate, sanityDocumentId } = event.data;

    await step.run("publish-course", async () => {
      logger.info("Publishing course", { courseId, slug });
    });

    await step.run("update-homepage-featured", async () => {
      logger.info("Updating homepage featured courses", { courseId });
    });

    await step.run("send-announcement-emails", async () => {
      logger.info("Sending course announcement emails", { courseId, title });
    });

    await step.run("create-calendar-entries", async () => {
      logger.info("Creating calendar entries/sessions", { courseId, startDate });
    });

    await step.run("notify-waiting-list", async () => {
      logger.info("Notifying waiting list", { courseId });
      const waitlisted = await db
        .select()
        .from(schema.waitlists)
        .where(eq(schema.waitlists.entityId, courseId));

      for (const entry of waitlisted) {
        await inngest.send({
          name: "waitlist.spot_available",
          data: {
            waitlistId: entry.id,
            entityType: "course",
            entityId: courseId,
            personId: entry.personId,
          },
        });
      }
    });

    await step.run("provision-certificate-template", async () => {
      logger.info("Provisioning certificate template", { courseId });
    });

    await step.run("provision-student-portal", async () => {
      logger.info("Provisioning student portal access rules", { courseId });
    });

    await step.run("generate-seo-artefacts", async () => {
      logger.info("Generating SEO artefacts", { courseId, slug });
    });

    await step.run("record-analytics", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName: "course-launch",
        eventName: "course.launched",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: { courseId, title, capacity },
      });
    });

    return { status: "completed", courseId, title };
  }
);
