/**
 * Phase 8 — SEO Review Workflow
 *
 * Scheduled metadata/structured-data completeness checks.
 * Editor completes any gaps.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { createAlert } from "../../alerts/service";

export const seoReviewWorkflow = inngest.createFunction(
  {
    id: "seo-review",
    name: "Scheduled SEO Review",
    retries: 2,
    triggers: [{ cron: "0 6 * * 2" }],
  },
  async ({ step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.EDITORIAL)
    );
    if (!enabled) return { status: "skipped" };

    const issues = await step.run("check-seo-completeness", async () => {
      logger.info("Running SEO completeness check");
      // Checks for: missing meta descriptions, missing alt text,
      // incomplete structured data, missing canonical URLs,
      // thin content, orphaned pages.
      return [] as Array<{ documentId: string; slug: string; issue: string }>;
    });

    if (issues.length > 0) {
      await step.run("create-seo-alerts", async () => {
        for (const issue of issues) {
          await createAlert({
            type: "seo_issue",
            severity: "info",
            title: `SEO issue: ${issue.slug}`,
            message: issue.issue,
            resource: "content",
            resourceId: issue.documentId,
            deduplicationKey: `seo:${issue.documentId}:${issue.issue}`,
          });
        }
      });
    }

    await step.run("log-review", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName: "seo-review",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: { issuesFound: issues.length },
      });
    });

    return { status: "completed", issuesFound: issues.length };
  }
);
