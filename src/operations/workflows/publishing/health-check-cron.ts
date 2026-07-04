/**
 * Phase 8 — Health Check Cron (Inngest)
 *
 * Runs every 5 minutes via Inngest scheduling (not Vercel Cron).
 */

import { inngest } from "../../engine/client";
import { getSystemHealth } from "../../monitoring";
import { createAlert } from "../../alerts/service";

export const healthCheckCron = inngest.createFunction(
  {
    id: "cron-health-check",
    name: "System Health Check",
    retries: 1,
    triggers: [{ cron: "*/5 * * * *" }],
  },
  async () => {
    const health = await getSystemHealth();

    for (const service of health) {
      if (service.status !== "healthy") {
        await createAlert({
          type: "service_degradation",
          severity: service.status === "down" ? "critical" : "warning",
          title: `Service ${service.status}: ${service.service}`,
          message: service.details ?? `${service.service} is ${service.status}`,
          resource: "service",
          resourceId: service.service,
          deduplicationKey: `health:${service.service}`,
        });
      }
    }

    return { status: "ok", services: health };
  }
);
