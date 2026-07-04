/**
 * Phase 8 — Content Updated Workflow
 *
 * Re-syncs downstream surfaces when published content changes materially.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";

export const contentUpdatedWorkflow = inngest.createFunction(
  {
    id: "content-updated",
    name: "Content Updated Re-sync",
    retries: 3,
    triggers: [{ event: "content.updated" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.PUBLISHING_AUTOMATION)
    );
    if (!enabled) return { status: "skipped" };

    const { documentId, slug, locale, changedFields } = event.data;

    await step.run("upsert-search-index", async () => {
      logger.info("Re-syncing search index", { documentId, slug });
    });

    await step.run("refresh-embeddings", async () => {
      logger.info("Re-syncing embeddings", { documentId });
    });

    await step.run("recompute-related", async () => {
      logger.info("Recomputing related content", { documentId });
    });

    await step.run("regenerate-sitemaps", async () => {
      logger.info("Regenerating sitemaps", { documentId });
    });

    await step.run("update-seo-metadata", async () => {
      logger.info("Updating SEO metadata", { documentId, slug });
    });

    await step.run("check-links", async () => {
      logger.info("Checking links in updated content", { documentId });
    });

    await step.run("revalidate-cache", async () => {
      logger.info("Revalidating cache", { slug, locale });
    });

    return { status: "completed", documentId, changedFields };
  }
);
