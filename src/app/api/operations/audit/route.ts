/**
 * Phase 8 — Audit Log API
 *
 * Read-only access to the audit trail.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuditTrail, getActivityHistory } from "@/operations/permissions/audit";

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource");
  const resourceId = request.nextUrl.searchParams.get("resourceId");
  const staffUserId = request.nextUrl.searchParams.get("staffUserId");
  const sinceStr = request.nextUrl.searchParams.get("since");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "50");

  if (resource && resourceId) {
    const history = await getActivityHistory(resource, resourceId, limit);
    return NextResponse.json({ history });
  }

  const trail = await getAuditTrail({
    resource: resource ?? undefined,
    resourceId: resourceId ?? undefined,
    staffUserId: staffUserId ?? undefined,
    since: sinceStr ? new Date(sinceStr) : undefined,
    limit,
  });

  return NextResponse.json({ trail });
}
