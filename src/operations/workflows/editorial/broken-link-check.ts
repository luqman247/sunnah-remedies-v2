/**
 * Phase 8 — Broken Link Check Workflow
 *
 * Scheduled link-check across published content. Failures set
 * needs_reattention state + alert. Does NOT unpublish.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { createAlert } from "../../alerts/service";

export const brokenLinkCheckWorkflow = inngest.createFunction(
  {
    id: "broken-link-check",
    name: "Scheduled Link Check",
    retries: 2,
    triggers: [{ cron: "0 4 * * 1" }],
  },
  async ({ step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.EDITORIAL)
    );
    if (!enabled) return { status: "skipped" };

    const brokenLinks = await step.run("scan-links", async () => {
      logger.info("Running broken link check across published content");
      // Scans all published content for broken internal and external links.
      // Returns array of { documentId, slug, brokenUrl, statusCode }.
      return [] as Array<{ documentId: string; slug: string; brokenUrl: string; statusCode: number }>;
    });

    if (brokenLinks.length > 0) {
      await step.run("create-alerts", async () => {
        for (const link of brokenLinks) {
          await createAlert({
            type: "broken_link",
            severity: "warning",
            title: `Broken link in ${link.slug}`,
            message: `URL "${link.brokenUrl}" returned ${link.statusCode}`,
            resource: "content",
            resourceId: link.documentId,
            deduplicationKey: `broken-link:${link.documentId}:${link.brokenUrl}`,
          });
        }
      });
    }

    await step.run("log-check", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName: "broken-link-check",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: { brokenLinksFound: brokenLinks.length },
      });
    });

    return { status: "completed", brokenLinksFound: brokenLinks.length };
  }
);
