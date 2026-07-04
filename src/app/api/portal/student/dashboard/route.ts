/**
 * Phase 9 — Student Dashboard API
 */

import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/auth/member-session";
import { getStudentDashboard } from "@/modules/student/dashboard";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";

export async function GET(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "en";

  const dashboard = await getStudentDashboard(session.accountId, locale);
  return NextResponse.json({ dashboard });
}
