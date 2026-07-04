/**
 * Phase 8 — Email Bounce/Complaint Workflow
 *
 * email.bounced / email.complained → suppression list → CRM flag
 * → deliverability alert
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";
import { createAlert } from "../../alerts/service";

export const emailBounceWorkflow = inngest.createFunction(
  {
    id: "email-bounce",
    name: "Email Bounce Handler",
    retries: 2,
    triggers: [{ event: "email.bounced" }, { event: "email.complained" }],
  },
  async ({ event, step }) => {
    const email = event.data.email as string;
    const reason = "reason" in event.data ? (event.data.reason as string) : "complaint";

    await step.run("add-to-suppression-list", async () => {
      await db
        .insert(schema.emailSuppressions)
        .values({
          email,
          reason,
          source: event.name,
        })
        .onConflictDoNothing();
    });

    await step.run("flag-person-in-crm", async () => {
      const person = await db
        .select()
        .from(schema.people)
        .where(eq(schema.people.email, email))
        .limit(1);

      if (person[0]) {
        await db
          .update(schema.people)
          .set({
            emailSuppressed: true,
            suppressionReason: reason,
            updatedAt: new Date(),
          })
          .where(eq(schema.people.id, person[0].id));
      }
    });

    await step.run("alert-deliverability", async () => {
      await createAlert({
        type: "email_deliverability",
        severity: "warning",
        title: `Email ${event.name === "email.bounced" ? "bounce" : "complaint"}`,
        message: `${email}: ${reason}`,
        deduplicationKey: `email-issue:${email}`,
      });
    });

    logger.info("Email suppression processed", { email, reason, event: event.name });
    return { status: "completed", email };
  }
);
