/**
 * Phase 9 — Practitioner Profile Service
 */

import { communityDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getAccountById } from "@/modules/identity/service";
import { writeCommunityAuditLog } from "@/lib/audit/community";

export interface UpdatePractitionerProfileInput {
  accountId: string;
  scopeOfPractice?: string;
  registrationBody?: string;
  registrationNumber?: string;
  specialisations?: string[];
  servicesOffered?: string[];
}

export async function getPractitionerProfile(accountId: string) {
  const [account, profileRows] = await Promise.all([
    getAccountById(accountId),
    communityDb
      .select()
      .from(schema.practitionerProfiles)
      .where(eq(schema.practitionerProfiles.accountId, accountId))
      .limit(1),
  ]);

  if (!account) return null;

  return {
    account: account.account,
    memberProfile: account.profile,
    practitionerProfile: profileRows[0] ?? null,
    roles: account.roles,
    membership: account.membership,
  };
}

export async function upsertPractitionerProfile(
  input: UpdatePractitionerProfileInput
): Promise<void> {
  const existing = await communityDb
    .select()
    .from(schema.practitionerProfiles)
    .where(eq(schema.practitionerProfiles.accountId, input.accountId))
    .limit(1);

  const values = {
    scopeOfPractice: input.scopeOfPractice,
    registrationBody: input.registrationBody,
    registrationNumber: input.registrationNumber,
    specialisations: input.specialisations ?? [],
    servicesOffered: input.servicesOffered ?? [],
    updatedAt: new Date(),
  };

  if (existing[0]) {
    await communityDb
      .update(schema.practitionerProfiles)
      .set(values)
      .where(eq(schema.practitionerProfiles.id, existing[0].id));
  } else {
    await communityDb.insert(schema.practitionerProfiles).values({
      accountId: input.accountId,
      ...values,
    });
  }

  await writeCommunityAuditLog({
    actorAccountId: input.accountId,
    action: "practitioner.profile_updated",
    target: "practitioner_profile",
    targetId: input.accountId,
  });
}

export async function getDirectoryListing(accountId: string) {
  const rows = await communityDb
    .select()
    .from(schema.directoryListings)
    .where(eq(schema.directoryListings.accountId, accountId))
    .limit(1);

  return rows[0] ?? null;
}
