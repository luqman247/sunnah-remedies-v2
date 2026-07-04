/**
 * Phase 9 — Practitioner Credentials Service
 */

import { communityDb, schema } from "@/db";
import { eq, desc } from "drizzle-orm";

export async function getVerificationStatus(accountId: string) {
  const rows = await communityDb
    .select()
    .from(schema.verificationRequests)
    .where(eq(schema.verificationRequests.accountId, accountId))
    .orderBy(desc(schema.verificationRequests.createdAt));

  return rows;
}

export async function getCertificates(accountId: string) {
  const account = await communityDb
    .select()
    .from(schema.accounts)
    .where(eq(schema.accounts.id, accountId))
    .limit(1);

  if (!account[0]?.personId) return [];

  const { db, schema: opsSchema } = await import("@/operations/db");

  return db
    .select()
    .from(opsSchema.certificates)
    .where(eq(opsSchema.certificates.personId, account[0].personId))
    .orderBy(desc(opsSchema.certificates.issuedAt));
}

export async function getDigitalCredentials(accountId: string) {
  const [verifications, certificates, practitionerProfile] = await Promise.all([
    getVerificationStatus(accountId),
    getCertificates(accountId),
    communityDb
      .select()
      .from(schema.practitionerProfiles)
      .where(eq(schema.practitionerProfiles.accountId, accountId))
      .limit(1),
  ]);

  const approvedVerification = verifications.find((v) => v.status === "approved");

  return {
    practitionerVerified: !!approvedVerification,
    verification: approvedVerification ?? null,
    verifiedUntil: practitionerProfile[0]?.verifiedUntil ?? approvedVerification?.expiresAt,
    certificates,
  };
}

export async function getCredentialVerificationCode(
  accountId: string
): Promise<string | null> {
  const profile = await communityDb
    .select()
    .from(schema.practitionerProfiles)
    .where(eq(schema.practitionerProfiles.accountId, accountId))
    .limit(1);

  if (!profile[0]?.verifiedAt) return null;

  return `SR-PRAC-${accountId.slice(0, 8).toUpperCase()}`;
}
