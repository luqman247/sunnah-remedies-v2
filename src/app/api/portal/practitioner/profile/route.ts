/**
 * Phase 9 — Practitioner Profile API
 */

import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/auth/member-session";
import { memberHasCapability } from "@/lib/auth/member-session";
import {
  getPractitionerProfile,
  upsertPractitionerProfile,
} from "@/modules/practitioner/profile";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";

export async function GET() {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!(await memberHasCapability(session.accountId, "practitioner.portal"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  const profile = await getPractitionerProfile(session.accountId);
  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    return NextResponse.json({ error: "Portals not enabled" }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!(await memberHasCapability(session.accountId, "profile.manage"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  let body: {
    scopeOfPractice?: string;
    registrationBody?: string;
    registrationNumber?: string;
    specialisations?: string[];
    servicesOffered?: string[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await upsertPractitionerProfile({
    accountId: session.accountId,
    ...body,
  });

  const profile = await getPractitionerProfile(session.accountId);
  return NextResponse.json({ profile });
}
