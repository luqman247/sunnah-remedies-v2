/**
 * Phase 9 — Permission Check API
 *
 * POST — check whether the current member has a specific capability
 */

import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/auth/member-session";
import { memberHasCapability } from "@/lib/auth/member-session";
import type { CapabilityKey } from "@/lib/permissions/capabilities";
import { ALL_CAPABILITIES } from "@/lib/permissions/capabilities";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";

export async function POST(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_MEMBERSHIP))) {
    return NextResponse.json(
      { error: "Community membership is not enabled" },
      { status: 503 }
    );
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let body: { capability: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!ALL_CAPABILITIES.includes(body.capability as CapabilityKey)) {
    return NextResponse.json(
      { error: "Unknown capability key" },
      { status: 400 }
    );
  }

  const allowed = await memberHasCapability(
    session.accountId,
    body.capability as CapabilityKey
  );

  return NextResponse.json({
    capability: body.capability,
    allowed,
  });
}
