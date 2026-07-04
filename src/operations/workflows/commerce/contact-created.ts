/**
 * Phase 8 — Contact Created Workflow
 *
 * contact.created → welcome email → CRM provisioning → HubSpot sync
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";

export const contactCreatedWorkflow = inngest.createFunction(
  {
    id: "contact-created",
    name: "New Contact Welcome",
    retries: 3,
    triggers: [{ event: "contact.created" }],
  },
  async ({ event, step }) => {
    const { personId, email, source, roles } = event.data;

    await step.run("send-welcome-email", async () => {
      logger.info("Sending welcome email", { personId, email });
      // Lifecycle email via Loops (or Resend fallback)
    });

    await step.run("provision-roles", async () => {
      for (const role of roles) {
        await db.insert(schema.personRoles).values({
          personId,
          role: role as "customer" | "student" | "patient" | "lead" | "practitioner" | "faculty" | "researcher" | "partner" | "affiliate" | "volunteer" | "supplier",
        });
      }
    });

    const hubspotEnabled = await step.run("check-hubspot-flag", () =>
      isFeatureEnabled(FLAGS.CRM_SYNC)
    );

    if (hubspotEnabled && !roles.includes("patient")) {
      await step.run("sync-to-hubspot", async () => {
        logger.info("Syncing non-clinical contact to HubSpot", { personId, email });
        const { syncContactToHubSpot } = await import("../../crm/sync/hubspot");
        await syncContactToHubSpot(personId);
      });
    }

    await step.run("record-interaction", async () => {
      await db.insert(schema.interactions).values({
        personId,
        type: "contact_created",
        summary: `New contact from ${source}`,
        metadata: { source, roles },
      });
    });

    return { status: "completed", personId };
  }
);
