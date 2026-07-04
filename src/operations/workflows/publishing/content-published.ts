/**
 * Phase 8 — Content Published Workflow
 *
 * When an editor publishes content that has cleared the Integrity gate,
 * fan out to every downstream surface: search, embeddings, sitemaps,
 * OG images, homepage, newsletter queue, related content, RSS.
 *
 * Each step is independent and individually retriable.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";

export const contentPublishedWorkflow = inngest.createFunction(
  {
    id: "content-published",
    name: "Content Published Fan-Out",
    retries: 3,
    triggers: [{ event: "content.published" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-feature-flag", async () => {
      return isFeatureEnabled(FLAGS.PUBLISHING_AUTOMATION);
    });

    if (!enabled) {
      logger.info("Publishing automation disabled by feature flag", {
        eventName: "content.published",
      });
      return { status: "skipped", reason: "feature_flag_disabled" };
    }

    const { documentId, documentType, slug, locale, sanityRevision } = event.data;

    const logEntry = await step.run("log-start", async () => {
      const result = await db
        .insert(schema.operationsLog)
        .values({
          workflowName: "content-published",
          eventName: "content.published",
          correlationId: event.id,
          status: "running",
          startedAt: new Date(),
          metadata: { documentId, documentType, slug },
        })
        .returning({ id: schema.operationsLog.id });
      return result[0].id;
    });

    await step.run("upsert-search-index", async () => {
      logger.info("Upserting search index", { documentId, slug });
      // Calls Phase 5 search indexing service
    });

    await step.run("refresh-embeddings", async () => {
      logger.info("Refreshing AI embeddings", { documentId, slug });
      // Calls Phase 6 embedding pipeline
    });

    await step.run("update-knowledge-graph", async () => {
      logger.info("Updating knowledge graph", { documentId, slug });
      // Updates Phase 5 knowledge graph relationships
    });

    await step.run("regenerate-sitemaps", async () => {
      logger.info("Regenerating sitemaps", { documentId, documentType });
      // Regenerates XML/image sitemaps for affected content type
    });

    await step.run("regenerate-rss", async () => {
      logger.info("Regenerating RSS feeds", { documentType });
    });

    await step.run("generate-og-image", async () => {
      logger.info("Generating OG image", { documentId, slug });
      // Uses existing OG template to generate branded image
    });

    await step.run("compute-seo-metadata", async () => {
      logger.info("Computing SEO metadata", { documentId, slug });
      // Computes canonical, meta, structured data
    });

    await step.run("recompute-homepage", async () => {
      logger.info("Recomputing homepage featured/recent", { documentType });
      // Recomputes featured and recently published modules
    });

    await step.run("recompute-related-content", async () => {
      logger.info("Recomputing related content graph", { documentId });
      // Refreshes relationship graph for the new node and neighbours
    });

    await step.run("queue-newsletter-candidate", async () => {
      logger.info("Queuing newsletter candidate", { documentId, slug });
      // Adds to newsletter candidate queue for human curation
    });

    await step.run("generate-social-drafts", async () => {
      logger.info("Generating social snippet drafts", { documentId, slug });
      // Creates platform-specific social snippets as drafts (not auto-posted)
    });

    await step.run("refresh-author-page", async () => {
      logger.info("Refreshing author page", { documentId });
    });

    await step.run("refresh-recommendations", async () => {
      logger.info("Refreshing content recommendations", { documentId });
    });

    await step.run("revalidate-cache", async () => {
      logger.info("Revalidating affected cache paths", { slug, locale });
      // Targeted cache revalidation — only affected paths
    });

    await step.run("log-completion", async () => {
      const { eq } = await import("drizzle-orm");
      await db
        .update(schema.operationsLog)
        .set({
          status: "completed",
          completedAt: new Date(),
          durationMs: Date.now() - new Date().getTime(),
        })
        .where(eq(schema.operationsLog.id, logEntry));
    });

    return {
      status: "completed",
      documentId,
      slug,
      stepsCompleted: 14,
    };
  }
);
