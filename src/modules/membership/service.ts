/**
 * Phase 9 — Membership Service
 *
 * Tier grants, entitlement resolution, and Stripe sync hooks.
 */

import { communityDb, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { writeCommunityAuditLog } from "@/lib/audit/community";
import {
  resolvePermissions,
  capabilitiesToArray,
  type ResolvedPermissions,
} from "@/lib/permissions/resolver";
import { getActiveRoles } from "@/modules/identity/service";
import { getActiveSuspension } from "@/modules/identity/lifecycle";
import type { MembershipTier } from "@/modules/membership/tiers";
import { DEFAULT_TIER } from "@/modules/membership/tiers";
import type { CapabilityKey } from "@/lib/permissions/capabilities";

export type MembershipStatus =
  | "active"
  | "paused"
  | "cancelled"
  | "expired"
  | "grace_period";

export interface GrantMembershipInput {
  accountId: string;
  tierKey: MembershipTier;
  source?: "signup" | "stripe" | "grant" | "enrolment" | "migration";
  stripeSubscriptionId?: string;
  renewsAt?: Date;
  grantedBy?: string;
  reason?: string;
}

export async function getMembership(accountId: string) {
  const rows = await communityDb
    .select()
    .from(schema.memberships)
    .where(eq(schema.memberships.accountId, accountId))
    .limit(1);

  return rows[0] ?? null;
}

export async function grantMembership(
  input: GrantMembershipInput
): Promise<void> {
  const existing = await getMembership(input.accountId);

  if (existing) {
    await communityDb
      .update(schema.memberships)
      .set({
        tierKey: input.tierKey,
        status: "active",
        source: input.source ?? "grant",
        stripeSubscriptionId: input.stripeSubscriptionId,
        renewsAt: input.renewsAt,
        grantedBy: input.grantedBy,
        updatedAt: new Date(),
      })
      .where(eq(schema.memberships.accountId, input.accountId));

    await recordMembershipHistory({
      accountId: input.accountId,
      tierKey: input.tierKey,
      status: "active",
      previousTierKey: existing.tierKey as MembershipTier,
      previousStatus: existing.status as MembershipStatus,
      reason: input.reason ?? "tier_changed",
    });
  } else {
    await communityDb.insert(schema.memberships).values({
      accountId: input.accountId,
      tierKey: input.tierKey,
      status: "active",
      source: input.source ?? "grant",
      stripeSubscriptionId: input.stripeSubscriptionId,
      renewsAt: input.renewsAt,
      grantedBy: input.grantedBy,
    });

    await recordMembershipHistory({
      accountId: input.accountId,
      tierKey: input.tierKey,
      status: "active",
      reason: input.reason ?? "initial_grant",
    });
  }

  await writeCommunityAuditLog({
    actorAccountId: input.grantedBy ?? input.accountId,
    action: "membership.granted",
    target: "membership",
    targetId: input.accountId,
    after: {
      tierKey: input.tierKey,
      source: input.source,
    },
  });
}

export async function updateMembershipStatus(
  accountId: string,
  status: MembershipStatus,
  reason?: string
): Promise<void> {
  const existing = await getMembership(accountId);
  if (!existing) throw new Error("Membership not found");

  await communityDb
    .update(schema.memberships)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.memberships.accountId, accountId));

  await recordMembershipHistory({
    accountId,
    tierKey: existing.tierKey as MembershipTier,
    status,
    previousTierKey: existing.tierKey as MembershipTier,
    previousStatus: existing.status as MembershipStatus,
    reason,
  });

  await writeCommunityAuditLog({
    action: "membership.status_changed",
    target: "membership",
    targetId: accountId,
    after: { status, reason },
  });
}

async function recordMembershipHistory(entry: {
  accountId: string;
  tierKey: MembershipTier;
  status: MembershipStatus;
  previousTierKey?: MembershipTier;
  previousStatus?: MembershipStatus;
  reason?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await communityDb.insert(schema.membershipHistory).values({
    accountId: entry.accountId,
    tierKey: entry.tierKey,
    status: entry.status,
    previousTierKey: entry.previousTierKey,
    previousStatus: entry.previousStatus,
    reason: entry.reason,
    metadata: entry.metadata ?? {},
  });
}

export async function getAdminGrants(
  accountId: string
): Promise<CapabilityKey[]> {
  const now = new Date();
  const rows = await communityDb
    .select()
    .from(schema.adminGrants)
    .where(
      and(
        eq(schema.adminGrants.accountId, accountId),
        eq(schema.adminGrants.isActive, true)
      )
    );

  return rows
    .filter((g) => !g.expiresAt || g.expiresAt > now)
    .map((g) => g.permissionKey as CapabilityKey);
}

export async function resolveAccountPermissions(
  accountId: string
): Promise<ResolvedPermissions> {
  const [roles, membership, adminGrants, suspension, account] =
    await Promise.all([
      getActiveRoles(accountId),
      getMembership(accountId),
      getAdminGrants(accountId),
      getActiveSuspension(accountId),
      communityDb
        .select()
        .from(schema.accounts)
        .where(eq(schema.accounts.id, accountId))
        .limit(1),
    ]);

  const tierKey = (membership?.tierKey as MembershipTier) ?? DEFAULT_TIER;

  const suspendedCapabilities: CapabilityKey[] = suspension
    ? (["forum.post", "forum.reply", "mentorship.offer"] as CapabilityKey[])
    : [];

  return resolvePermissions({
    roles,
    tierKey,
    adminGrants,
    conductAcknowledged: !!account[0]?.conductAcknowledgedAt,
    suspendedCapabilities,
  });
}

export async function getAccountCapabilities(
  accountId: string
): Promise<CapabilityKey[]> {
  const resolved = await resolveAccountPermissions(accountId);
  return capabilitiesToArray(resolved);
}

export async function syncMembershipFromStripe(input: {
  accountId: string;
  stripeSubscriptionId: string;
  tierKey: MembershipTier;
  status: MembershipStatus;
  renewsAt?: Date;
}): Promise<void> {
  await grantMembership({
    accountId: input.accountId,
    tierKey: input.tierKey,
    source: "stripe",
    stripeSubscriptionId: input.stripeSubscriptionId,
    renewsAt: input.renewsAt,
    reason: "stripe_webhook",
  });

  if (input.status !== "active") {
    await updateMembershipStatus(
      input.accountId,
      input.status,
      "stripe_webhook"
    );
  }
}
