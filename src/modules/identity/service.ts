/**
 * Phase 9 — Identity Service
 *
 * Account creation, role assignment, and profile management.
 * Links to Phase 8 `people` table as the canonical CRM root.
 */

import { communityDb, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { createPerson } from "@/operations/crm/service";
import { hashPassword } from "@/modules/identity/password";
import { writeCommunityAuditLog } from "@/lib/audit/community";
import type { MemberRole } from "@/modules/identity/roles";

export interface CreateAccountInput {
  email: string;
  displayName: string;
  password?: string;
  locale?: string;
  region?: string;
  source?: string;
}

export interface AccountWithRelations {
  account: typeof schema.accounts.$inferSelect;
  profile: typeof schema.profiles.$inferSelect | null;
  roles: (typeof schema.roleAssignments.$inferSelect)[];
  membership: typeof schema.memberships.$inferSelect | null;
}

export async function createAccount(
  input: CreateAccountInput
): Promise<string> {
  const email = input.email.toLowerCase().trim();

  const existing = await communityDb
    .select()
    .from(schema.accounts)
    .where(eq(schema.accounts.email, email))
    .limit(1);

  if (existing[0]) {
    throw new Error("An account with this email already exists");
  }

  const personId = await createPerson({
    displayName: input.displayName,
    email,
    locale: input.locale,
    source: input.source ?? "community_signup",
    roles: ["customer"],
  });

  const accountResult = await communityDb
    .insert(schema.accounts)
    .values({
      personId,
      email,
      displayName: input.displayName,
      passwordHash: input.password ? hashPassword(input.password) : null,
      locale: input.locale ?? "en",
      region: input.region,
      accountStatus: "pending_verification",
    })
    .returning({ id: schema.accounts.id });

  const accountId = accountResult[0].id;

  await communityDb.insert(schema.profiles).values({ accountId });

  await assignRole(accountId, "registered_user", undefined, {
    skipAudit: true,
  });

  await communityDb.insert(schema.memberships).values({
    accountId,
    tierKey: "free_registered",
    status: "active",
    source: "signup",
  });

  await writeCommunityAuditLog({
    actorAccountId: accountId,
    action: "account.created",
    target: "account",
    targetId: accountId,
    after: { email, displayName: input.displayName },
  });

  return accountId;
}

export async function getAccountById(
  accountId: string
): Promise<AccountWithRelations | null> {
  const accounts = await communityDb
    .select()
    .from(schema.accounts)
    .where(eq(schema.accounts.id, accountId))
    .limit(1);

  if (!accounts[0]) return null;

  const [profileRows, roleRows, membershipRows] = await Promise.all([
    communityDb
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.accountId, accountId))
      .limit(1),
    communityDb
      .select()
      .from(schema.roleAssignments)
      .where(
        and(
          eq(schema.roleAssignments.accountId, accountId),
          eq(schema.roleAssignments.isActive, true)
        )
      ),
    communityDb
      .select()
      .from(schema.memberships)
      .where(eq(schema.memberships.accountId, accountId))
      .limit(1),
  ]);

  return {
    account: accounts[0],
    profile: profileRows[0] ?? null,
    roles: roleRows,
    membership: membershipRows[0] ?? null,
  };
}

export async function getAccountByEmail(
  email: string
): Promise<AccountWithRelations | null> {
  const accounts = await communityDb
    .select()
    .from(schema.accounts)
    .where(eq(schema.accounts.email, email.toLowerCase().trim()))
    .limit(1);

  if (!accounts[0]) return null;
  return getAccountById(accounts[0].id);
}

export async function verifyAccountEmail(accountId: string): Promise<void> {
  await communityDb
    .update(schema.accounts)
    .set({
      emailVerifiedAt: new Date(),
      accountStatus: "active",
      updatedAt: new Date(),
    })
    .where(eq(schema.accounts.id, accountId));

  await writeCommunityAuditLog({
    actorAccountId: accountId,
    action: "account.email_verified",
    target: "account",
    targetId: accountId,
  });
}

export async function assignRole(
  accountId: string,
  role: MemberRole,
  grantedBy?: string,
  options?: { expiresAt?: Date; skipAudit?: boolean }
): Promise<void> {
  const existing = await communityDb
    .select()
    .from(schema.roleAssignments)
    .where(
      and(
        eq(schema.roleAssignments.accountId, accountId),
        eq(schema.roleAssignments.role, role)
      )
    )
    .limit(1);

  if (existing[0]) {
    await communityDb
      .update(schema.roleAssignments)
      .set({
        isActive: true,
        grantedBy,
        grantedAt: new Date(),
        expiresAt: options?.expiresAt,
      })
      .where(eq(schema.roleAssignments.id, existing[0].id));
  } else {
    await communityDb.insert(schema.roleAssignments).values({
      accountId,
      role,
      grantedBy,
      expiresAt: options?.expiresAt,
    });
  }

  if (!options?.skipAudit) {
    await writeCommunityAuditLog({
      actorAccountId: grantedBy ?? accountId,
      action: "role.assigned",
      target: "role_assignment",
      targetId: accountId,
      after: { role },
    });
  }
}

export async function revokeRole(
  accountId: string,
  role: MemberRole,
  revokedBy?: string
): Promise<void> {
  await communityDb
    .update(schema.roleAssignments)
    .set({ isActive: false })
    .where(
      and(
        eq(schema.roleAssignments.accountId, accountId),
        eq(schema.roleAssignments.role, role)
      )
    );

  await writeCommunityAuditLog({
    actorAccountId: revokedBy,
    action: "role.revoked",
    target: "role_assignment",
    targetId: accountId,
    after: { role },
  });
}

export async function getActiveRoles(accountId: string): Promise<MemberRole[]> {
  const rows = await communityDb
    .select()
    .from(schema.roleAssignments)
    .where(
      and(
        eq(schema.roleAssignments.accountId, accountId),
        eq(schema.roleAssignments.isActive, true)
      )
    );

  const now = new Date();
  return rows
    .filter((r) => !r.expiresAt || r.expiresAt > now)
    .map((r) => r.role as MemberRole);
}

export async function acknowledgeConduct(accountId: string): Promise<void> {
  await communityDb
    .update(schema.accounts)
    .set({
      conductAcknowledgedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.accounts.id, accountId));

  await writeCommunityAuditLog({
    actorAccountId: accountId,
    action: "conduct.acknowledged",
    target: "account",
    targetId: accountId,
  });
}

export async function authenticateAccount(
  email: string,
  password: string
): Promise<AccountWithRelations | null> {
  const { verifyPassword } = await import("@/modules/identity/password");

  const data = await getAccountByEmail(email);
  if (!data?.account.passwordHash) return null;
  if (data.account.accountStatus === "suspended") return null;
  if (data.account.accountStatus === "archived") return null;
  if (data.account.accountStatus === "deactivated") return null;

  const valid = verifyPassword(password, data.account.passwordHash);
  return valid ? data : null;
}
