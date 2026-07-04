/**
 * Phase 9 — Practitioner CPD API
 *
 * GET — list CPD records
 * POST — log a CPD activity (self-logged, pending verification for external)
 */

import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/auth/member-session";
import { memberHasCapability } from "@/lib/auth/member-session";
import { getCpdRecords, logCpdActivity, type CpdCategory } from "@/modules/practitioner/cpd";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";
import { checkRateLimit } from "@/lib/commerce/security/rate-limit";

const VALID_CATEGORIES: CpdCategory[] = [
  "clinical_practice",
  "research",
  "teaching",
  "institutional_event",
  "journal_club",
  "external_activity",
  "mentorship",
];

export async function GET() {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!(await memberHasCapability(session.accountId, "cpd.view"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  const records = await getCpdRecords(session.accountId);
  return NextResponse.json({ records });
}

export async function POST(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!(await memberHasCapability(session.accountId, "cpd.log"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = checkRateLimit(ip, "default");
  if (!limited.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: {
    activity: string;
    categoryKey: string;
    credits: number;
    activityDate: string;
    evidenceRef?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.activity || !body.categoryKey || !body.credits || !body.activityDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!VALID_CATEGORIES.includes(body.categoryKey as CpdCategory)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  if (body.credits < 1 || body.credits > 50) {
    return NextResponse.json({ error: "Credits must be between 1 and 50" }, { status: 400 });
  }

  const id = await logCpdActivity({
    accountId: session.accountId,
    activity: body.activity,
    categoryKey: body.categoryKey as CpdCategory,
    credits: body.credits,
    activityDate: new Date(body.activityDate),
    evidenceRef: body.evidenceRef,
    sourceType: "self_log",
  });

  return NextResponse.json({ id }, { status: 201 });
}
