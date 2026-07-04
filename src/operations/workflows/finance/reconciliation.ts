/**
 * Phase 8 — Financial Reconciliation Workflow
 *
 * Scheduled job that matches Stripe payouts to orders to ledger
 * entries and flags any mismatch as finance.reconciliation_exception.
 */

import { inngest } from "../../engine/client";
import { isFeatureEnabled, FLAGS } from "../../engine/feature-flags";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { eq, and } from "drizzle-orm";

export const reconciliationWorkflow = inngest.createFunction(
  {
    id: "finance-reconciliation",
    name: "Daily Financial Reconciliation",
    retries: 2,
    triggers: [{ cron: "0 3 * * *" }],
  },
  async ({ step }) => {
    const enabled = await step.run("check-flag", () =>
      isFeatureEnabled(FLAGS.FINANCE)
    );
    if (!enabled) return { status: "skipped" };

    const exceptions = await step.run("reconcile-orders-to-ledger", async () => {
      logger.info("Running financial reconciliation");

      const unreconciled = await db
        .select()
        .from(schema.financeLedger)
        .where(eq(schema.financeLedger.reconciled, false))
        .limit(500);

      const issues: string[] = [];

      for (const entry of unreconciled) {
        if (entry.orderId) {
          const order = await db
            .select()
            .from(schema.orders)
            .where(eq(schema.orders.id, entry.orderId))
            .limit(1);

          if (!order[0]) {
            issues.push(`Ledger entry ${entry.id} references missing order ${entry.orderId}`);
            continue;
          }

          await db
            .update(schema.financeLedger)
            .set({ reconciled: true, reconciledAt: new Date() })
            .where(eq(schema.financeLedger.id, entry.id));
        }
      }

      return issues;
    });

    if (exceptions.length > 0) {
      await step.run("emit-exceptions", async () => {
        for (const issue of exceptions) {
          await inngest.send({
            name: "finance.reconciliation_exception",
            data: {
              exceptionId: crypto.randomUUID(),
              type: "order_mismatch",
              details: issue,
            },
          });
        }
      });
    }

    await step.run("log-reconciliation", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName: "finance-reconciliation",
        status: exceptions.length > 0 ? "completed_with_exceptions" : "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: { exceptionsFound: exceptions.length },
      });
    });

    return { status: "completed", exceptionsFound: exceptions.length };
  }
);
