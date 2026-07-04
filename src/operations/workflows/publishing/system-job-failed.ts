/**
 * Phase 8 — System Job Failed Workflow
 *
 * When any workflow exhausts retries, record failure and alert the owner.
 */

import { inngest } from "../../engine/client";
import { logger } from "../../logging";
import { db, schema } from "../../db";
import { createAlert } from "../../alerts/service";

export const systemJobFailedWorkflow = inngest.createFunction(
  {
    id: "system-job-failed",
    name: "System Job Failed Alert",
    retries: 1,
    triggers: [{ event: "system.job_failed" }],
  },
  async ({ event, step }) => {
    const { jobId, workflowName, error, attempts } = event.data;

    await step.run("record-failure", async () => {
      await db.insert(schema.operationsLog).values({
        workflowName,
        eventName: "system.job_failed",
        correlationId: jobId,
        status: "failed",
        error,
        attempts,
        completedAt: new Date(),
      });
    });

    await step.run("create-alert", async () => {
      await createAlert({
        type: "job_failure",
        severity: "critical",
        title: `Workflow failed: ${workflowName}`,
        message: `Job ${jobId} failed after ${attempts} attempts: ${error}`,
        resource: "workflow",
        resourceId: jobId,
        deduplicationKey: `job-failure:${workflowName}:${jobId}`,
      });
    });

    logger.error(`Workflow failed permanently: ${workflowName}`, {
      workflowName,
      jobId,
      error,
      attempts,
    });

    return { status: "alerted", workflowName, jobId };
  }
);
