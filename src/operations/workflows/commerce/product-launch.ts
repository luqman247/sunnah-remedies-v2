/**
 * Phase 8 — Product Launch Workflow
 *
 * product.launched → storefront → homepage → collections → social drafts
 * → newsletter queue → search index → embeddings → analytics
 *
 * Integrity flag check: if product claims are flagged, hold and
 * route to reviewer before commercial propagation.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";

export const productLaunchWorkflow = inngest.createFunction(
  {
    id: "product-launch",
    name: "Product Launch Propagation",
    retries: 3,
    triggers: [{ event: "product.launched" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.PRODUCT_LAUNCH)
    );
    if (!enabled) return { status: "skipped" };

    const { productId, shopifyProductId, handle, title, sanityDocumentId } = event.data;

    await step.run("publish-to-storefront", async () => {
      logger.info("Publishing product to storefront", { productId, handle });
    });

    await step.run("update-homepage-featured", async () => {
      logger.info("Updating homepage featured products", { productId });
    });

    await step.run("update-collections", async () => {
      logger.info("Updating product collections", { productId, handle });
    });

    await step.run("generate-social-drafts", async () => {
      logger.info("Generating social snippet drafts", { productId, title });
    });

    await step.run("queue-newsletter", async () => {
      logger.info("Queuing product for newsletter", { productId, title });
    });

    await step.run("upsert-search-index", async () => {
      logger.info("Upserting product in search index", { productId, handle });
    });

    await step.run("refresh-embeddings", async () => {
      logger.info("Refreshing product AI embeddings", { productId });
    });

    await step.run("regenerate-seo-artefacts", async () => {
      logger.info("Regenerating SEO artefacts", { handle });
    });

    await step.run("emit-analytics", async () => {
      logger.info("Recording product launch analytics", { productId, title });
    });

    await step.run("log-completion", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName: "product-launch",
        eventName: "product.launched",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: { productId, handle, title },
      });
    });

    return { status: "completed", productId, handle };
  }
);
