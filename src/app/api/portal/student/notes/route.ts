/**
 * Phase 9 — Course Notes API
 */

import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/auth/member-session";
import { getCourseNotes, saveCourseNote } from "@/modules/student/notes";
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
  const courseRef = searchParams.get("courseRef") ?? undefined;

  const notes = await getCourseNotes(session.accountId, courseRef);
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let body: {
    courseRef: string;
    lessonRef?: string;
    body: string;
    noteId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.courseRef || !body.body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const id = await saveCourseNote({
    accountId: session.accountId,
    ...body,
  });

  return NextResponse.json({ id }, { status: 201 });
}
