/**
 * Phase 8 — Alert Escalation Cron Job
 *
 * Runs every 15 minutes to escalate unacknowledged critical alerts.
 */

import { NextRequest, NextResponse } from "next/server";
import { escalateUnacknowledgedAlerts } from "@/operations/alerts/service";
import { logger } from "@/operations/logging";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const escalated = await escalateUnacknowledgedAlerts();

    if (escalated > 0) {
      logger.warn(`Escalated ${escalated} unacknowledged critical alerts`);
    }

    return NextResponse.json({ status: "ok", escalated });
  } catch (error) {
    logger.error("Alert escalation cron failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
