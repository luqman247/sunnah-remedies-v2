/**
 * Phase 8 — Review Due Workflow
 *
 * content.review_due → editorial notification → dashboard flag
 *
 * Editor reviews and re-approves. Automation watches and schedules;
 * scholars and editors decide.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { createAlert } from "../../alerts/service";

export const reviewDueWorkflow = inngest.createFunction(
  {
    id: "review-due",
    name: "Content Review Due",
    retries: 3,
    triggers: [{ event: "content.review_due" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.EDITORIAL)
    );
    if (!enabled) return { status: "skipped" };

    const { documentId, documentType, slug, reviewDate, assignedEditorId } = event.data;

    await step.run("create-editorial-alert", async () => {
      await createAlert({
        type: "editorial_review_due",
        severity: "info",
        title: `Review due: ${slug}`,
        message: `${documentType} "${slug}" is due for review (scheduled: ${reviewDate})`,
        resource: "content",
        resourceId: documentId,
        ownerId: assignedEditorId,
        deduplicationKey: `review-due:${documentId}`,
      });
    });

    await step.run("notify-editor", async () => {
      logger.info("Notifying editor of review due", { documentId, slug, assignedEditorId });
    });

    return { status: "completed", documentId, slug };
  }
);
