/**
 * Phase 9 — Account Lifecycle
 *
 * State transitions for account status.
 */

import { communityDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import { writeCommunityAuditLog } from "@/lib/audit/community";

export type AccountStatus =
  | "pending_verification"
  | "active"
  | "suspended"
  | "deactivated"
  | "archived";

const VALID_TRANSITIONS: Record<AccountStatus, AccountStatus[]> = {
  pending_verification: ["active", "archived"],
  active: ["suspended", "deactivated", "archived"],
  suspended: ["active", "deactivated", "archived"],
  deactivated: ["active", "archived"],
  archived: [],
};

export async function transitionAccountStatus(
  accountId: string,
  newStatus: AccountStatus,
  options?: {
    actorAccountId?: string;
    reason?: string;
    suspendUntil?: Date;
  }
): Promise<void> {
  const accounts = await communityDb
    .select()
    .from(schema.accounts)
    .where(eq(schema.accounts.id, accountId))
    .limit(1);

  const account = accounts[0];
  if (!account) throw new Error("Account not found");

  const currentStatus = account.accountStatus as AccountStatus;
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid transition: ${currentStatus} → ${newStatus}`
    );
  }

  await communityDb
    .update(schema.accounts)
    .set({
      accountStatus: newStatus,
      updatedAt: new Date(),
      archivedAt: newStatus === "archived" ? new Date() : account.archivedAt,
    })
    .where(eq(schema.accounts.id, accountId));

  if (newStatus === "suspended" && options?.suspendUntil) {
    await communityDb.insert(schema.suspensions).values({
      accountId,
      reason: options.reason ?? "Account suspended",
      suspendedBy: options.actorAccountId,
      expiresAt: options.suspendUntil,
      isActive: true,
    });
  }

  if (newStatus === "active" && currentStatus === "suspended") {
    await communityDb
      .update(schema.suspensions)
      .set({ isActive: false, liftedAt: new Date() })
      .where(eq(schema.suspensions.accountId, accountId));
  }

  await writeCommunityAuditLog({
    actorAccountId: options?.actorAccountId,
    action: "account.status_changed",
    target: "account",
    targetId: accountId,
    before: { status: currentStatus },
    after: { status: newStatus, reason: options?.reason },
  });
}

export async function getActiveSuspension(accountId: string) {
  const rows = await communityDb
    .select()
    .from(schema.suspensions)
    .where(eq(schema.suspensions.accountId, accountId));

  const now = new Date();
  return (
    rows.find(
      (s) =>
        s.isActive &&
        (!s.expiresAt || s.expiresAt > now)
    ) ?? null
  );
}
