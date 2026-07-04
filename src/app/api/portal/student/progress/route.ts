/**
 * Phase 9 — Lesson Progress API
 */

import { NextResponse } from "next/server";
import { getMemberSession, memberHasCapability } from "@/lib/auth/member-session";
import { updateLessonProgress, getLessonProgress } from "@/modules/student/progress";
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
  const enrolmentId = searchParams.get("enrolmentId");
  if (!enrolmentId) {
    return NextResponse.json({ error: "enrolmentId required" }, { status: 400 });
  }

  const progress = await getLessonProgress(enrolmentId);
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!(await memberHasCapability(session.accountId, "campus.access"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  let body: {
    enrolmentId: string;
    lessonRef: string;
    lessonSlug: string;
    secondsWatched?: number;
    lastPosition?: number;
    completed?: boolean;
    totalLessons?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.enrolmentId || !body.lessonRef || !body.lessonSlug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await updateLessonProgress(body);
  return NextResponse.json({ success: true });
}
