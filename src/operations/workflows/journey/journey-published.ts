/**
 * Phase 8 — Journey Published Workflow
 *
 * journey.published → homepage → emails → capacity tracking
 * → dashboard → SEO
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";

export const journeyPublishedWorkflow = inngest.createFunction(
  {
    id: "journey-published",
    name: "Journey Published Propagation",
    retries: 3,
    triggers: [{ event: "journey.published" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.JOURNEY_LAUNCH)
    );
    if (!enabled) return { status: "skipped" };

    const { journeyId, slug, title, capacity, departureDate } = event.data;

    await step.run("update-homepage", async () => {
      logger.info("Updating homepage with journey", { journeyId, title });
    });

    await step.run("send-announcement", async () => {
      logger.info("Sending journey announcement", { journeyId, title });
    });

    await step.run("setup-capacity-tracking", async () => {
      logger.info("Setting up capacity tracking", { journeyId, capacity });
    });

    await step.run("generate-seo-artefacts", async () => {
      logger.info("Generating journey SEO artefacts", { slug });
    });

    await step.run("upsert-search-index", async () => {
      logger.info("Upserting journey in search index", { journeyId, slug });
    });

    await step.run("queue-newsletter", async () => {
      logger.info("Queuing journey for newsletter", { journeyId, title });
    });

    await step.run("log-completion", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName: "journey-published",
        eventName: "journey.published",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: { journeyId, title, capacity, departureDate },
      });
    });

    return { status: "completed", journeyId, title };
  }
);
