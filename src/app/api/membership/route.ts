/**
 * Phase 9 — Membership API
 *
 * GET — current member's membership state and permissions
 */

import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/auth/member-session";
import { getAccountById } from "@/modules/identity/service";
import { resolveAccountPermissions } from "@/modules/membership/service";
import { capabilitiesToArray } from "@/lib/permissions/resolver";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";

export async function GET() {
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

  const [account, permissions] = await Promise.all([
    getAccountById(session.accountId),
    resolveAccountPermissions(session.accountId),
  ]);

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({
    account: {
      id: account.account.id,
      email: account.account.email,
      displayName: account.account.displayName,
      status: account.account.accountStatus,
      emailVerified: !!account.account.emailVerifiedAt,
      conductAcknowledged: !!account.account.conductAcknowledgedAt,
      locale: account.account.locale,
      region: account.account.region,
    },
    roles: account.roles.map((r) => ({
      role: r.role,
      grantedAt: r.grantedAt,
      expiresAt: r.expiresAt,
    })),
    membership: account.membership
      ? {
          tierKey: account.membership.tierKey,
          status: account.membership.status,
          source: account.membership.source,
          startedAt: account.membership.startedAt,
          renewsAt: account.membership.renewsAt,
        }
      : null,
    permissions: capabilitiesToArray(permissions),
    isSuspended: permissions.isSuspended,
  });
}
