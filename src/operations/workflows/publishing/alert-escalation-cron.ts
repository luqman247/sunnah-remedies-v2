/**
 * Phase 8 — Alert Escalation Cron (Inngest)
 *
 * Runs every 15 minutes via Inngest scheduling (not Vercel Cron).
 */

import { inngest } from "../../engine/client";
import { escalateUnacknowledgedAlerts } from "../../alerts/service";
import { logger } from "../../logging";

export const alertEscalationCron = inngest.createFunction(
  {
    id: "cron-alert-escalation",
    name: "Alert Escalation",
    retries: 1,
    triggers: [{ cron: "*/15 * * * *" }],
  },
  async () => {
    const escalated = await escalateUnacknowledgedAlerts();

    if (escalated > 0) {
      logger.warn(`Escalated ${escalated} unacknowledged critical alerts`);
    }

    return { status: "ok", escalated };
  }
);
