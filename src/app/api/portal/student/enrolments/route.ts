/**
 * Phase 9 — Student Enrolments API
 */

import { NextResponse } from "next/server";
import { getMemberSession, memberHasCapability } from "@/lib/auth/member-session";
import { enrolStudent, getEnrolments } from "@/modules/student/enrolments";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";

export async function GET() {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const enrolments = await getEnrolments(session.accountId);
  return NextResponse.json({ enrolments });
}

export async function POST(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!(await memberHasCapability(session.accountId, "course.enrol"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  let body: { courseRef: string; courseSlug: string; courseName: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.courseRef || !body.courseSlug || !body.courseName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const id = await enrolStudent({
    accountId: session.accountId,
    ...body,
  });

  return NextResponse.json({ id }, { status: 201 });
}
