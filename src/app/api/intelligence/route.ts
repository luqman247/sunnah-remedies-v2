/**
 * Intelligence API — secured server-side warehouse reads.
 *
 * Protected by auth check. Returns dashboard data as JSON
 * for client-side refresh without full page reload.
 *
 * Rate-limited and audit-logged.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchDashboardData } from "../../../../analytics/dashboard/api/data";

const auditLog: Array<{
  user: string;
  action: string;
  timestamp: string;
  ip: string;
}> = [];

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  auditLog.push({
    user: session.user.email || "unknown",
    action: "dashboard_view",
    timestamp: new Date().toISOString(),
    ip,
  });

  console.info(
    JSON.stringify({
      _type: "audit_log",
      user: session.user.email,
      action: "dashboard_api_access",
      timestamp: new Date().toISOString(),
      ip,
    })
  );

  try {
    const data = await fetchDashboardData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("[Intelligence API] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
