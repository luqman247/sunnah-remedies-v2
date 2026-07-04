/**
 * Phase 8 — Alerts API
 *
 * GET: List active alerts
 * POST: Acknowledge an alert
 */

import { NextRequest, NextResponse } from "next/server";
import { getActiveAlerts, acknowledgeAlert, resolveAlert } from "@/operations/alerts/service";
import { writeAuditLog } from "@/operations/permissions/audit";

export async function GET(request: NextRequest) {
  const severity = request.nextUrl.searchParams.get("severity") as
    | "info" | "warning" | "critical" | null;

  const alerts = await getActiveAlerts({
    severity: severity ?? undefined,
    limit: 50,
  });

  return NextResponse.json({ alerts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { alertId, action, staffUserId } = body;

  if (!alertId || !action || !staffUserId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (action === "acknowledge") {
    await acknowledgeAlert(alertId, staffUserId);
    await writeAuditLog({
      staffUserId,
      action: "alert_acknowledged",
      resource: "alert",
      resourceId: alertId,
    });
  } else if (action === "resolve") {
    await resolveAlert(alertId);
    await writeAuditLog({
      staffUserId,
      action: "alert_resolved",
      resource: "alert",
      resourceId: alertId,
    });
  }

  return NextResponse.json({ status: "ok" });
}
