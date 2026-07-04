/**
 * Phase 9 — Member Registration API
 *
 * POST — create a new institutional member account
 */

import { NextResponse } from "next/server";
import { createAccount } from "@/modules/identity/service";
import { emitCommunityEvent } from "@/modules/membership/analytics";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";
import { checkRateLimit } from "@/lib/commerce/security/rate-limit";

interface RegisterBody {
  email: string;
  displayName: string;
  password: string;
  locale?: string;
  region?: string;
}

export async function POST(request: Request) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_MEMBERSHIP))) {
    return NextResponse.json(
      { error: "Community membership is not enabled" },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limited = checkRateLimit(ip, "default");
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts" },
      { status: 429 }
    );
  }

  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, displayName, password, locale, region } = body;

  if (!email || !displayName || !password) {
    return NextResponse.json(
      { error: "Email, display name, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 12) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters" },
      { status: 400 }
    );
  }

  try {
    const accountId = await createAccount({
      email,
      displayName,
      password,
      locale,
      region,
    });

    await emitCommunityEvent("membership_registered", {
      accountId,
      tierKey: "free_registered",
    });

    return NextResponse.json(
      {
        accountId,
        message:
          "Account created. Please verify your email to activate full access.",
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
