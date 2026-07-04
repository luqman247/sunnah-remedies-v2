/**
 * Phase 8 — Cart Abandonment Recovery Workflow
 *
 * cart.abandoned → wait → reminder email → wait → educational email
 * → wait → final recovery email → stop
 *
 * Educational content emphasises the value of the remedy, sourcing,
 * and provenance — never manufactured urgency or persuasion tactics.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";

export const cartAbandonmentWorkflow = inngest.createFunction(
  {
    id: "cart-abandonment",
    name: "Cart Abandonment Recovery",
    retries: 2,
    cancelOn: [{ event: "order.paid", match: "data.cartId" }],
    triggers: [{ event: "cart.abandoned" }],
  },
  async ({ event, step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.CART_ABANDONMENT)
    );
    if (!enabled) return { status: "skipped" };

    const { cartId, email, personId, items, totalValue, currency } = event.data;
    if (!email) return { status: "skipped", reason: "no_email" };

    const isSuppressed = await step.run("check-suppression", async () => {
      const suppressed = await db
        .select()
        .from(schema.emailSuppressions)
        .where(eq(schema.emailSuppressions.email, email))
        .limit(1);
      return suppressed.length > 0;
    });

    if (isSuppressed) return { status: "skipped", reason: "email_suppressed" };

    await step.sleep("wait-1h", "1h");

    await step.run("send-reminder", async () => {
      logger.info("Sending cart reminder email", { cartId, email });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      await sendTransactionalEmail({
        to: email,
        subject: "Your items are waiting — Sunnah Remedies",
        template: "cart-reminder",
        data: { items, totalValue, currency },
      });
    });

    await step.sleep("wait-24h", "24h");

    await step.run("send-educational-content", async () => {
      logger.info("Sending educational cart email", { cartId, email });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      await sendTransactionalEmail({
        to: email,
        subject: "The tradition behind your selection — Sunnah Remedies",
        template: "cart-educational",
        data: { items, totalValue, currency },
      });
    });

    await step.sleep("wait-72h", "72h");

    await step.run("send-final-recovery", async () => {
      logger.info("Sending final cart recovery email", { cartId, email });
      const { sendTransactionalEmail } = await import("../../email/service/resend");
      await sendTransactionalEmail({
        to: email,
        subject: "Can we help? — Sunnah Remedies",
        template: "cart-final-recovery",
        data: { items, totalValue, currency },
      });
    });

    return { status: "completed", cartId };
  }
);
