/**
 * Phase 9 — Saved Resources API
 */

import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/auth/member-session";
import {
  getSavedResources,
  saveResource,
  removeSavedResource,
  searchSavedResources,
} from "@/modules/practitioner/resources";
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
  const q = searchParams.get("q");

  const resources = q
    ? await searchSavedResources(session.accountId, q)
    : await getSavedResources(session.accountId);

  return NextResponse.json({ resources });
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
    targetType: string;
    targetId: string;
    title: string;
    href?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.targetType || !body.targetId || !body.title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = await saveResource({
    accountId: session.accountId,
    ...body,
  });

  return NextResponse.json({ id }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType");
  const targetId = searchParams.get("targetId");

  if (!targetType || !targetId) {
    return NextResponse.json({ error: "Missing targetType or targetId" }, { status: 400 });
  }

  await removeSavedResource(session.accountId, targetType, targetId);
  return NextResponse.json({ success: true });
}
