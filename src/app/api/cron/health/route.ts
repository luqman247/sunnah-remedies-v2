/**
 * Phase 8 — System Health Check Cron
 *
 * Runs every 5 minutes to verify service health.
 * Emits alerts on degradation.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSystemHealth } from "@/operations/monitoring";
import { createAlert } from "@/operations/alerts/service";
import { logger } from "@/operations/logging";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    return NextResponse.json({ status: "ok", services: health });
  } catch (error) {
    logger.error("Health check cron failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
