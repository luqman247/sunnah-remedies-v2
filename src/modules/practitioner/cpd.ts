/**
 * Phase 9 — CPD Service
 *
 * One ledger shared with the Alumni Network (Part 8.4).
 */

import { communityDb, schema } from "@/db";
import { eq, and, desc, gte, lte, isNull } from "drizzle-orm";
import { writeCommunityAuditLog } from "@/lib/audit/community";

export type CpdCategory =
  | "clinical_practice"
  | "research"
  | "teaching"
  | "institutional_event"
  | "journal_club"
  | "external_activity"
  | "mentorship";

export interface LogCpdInput {
  accountId: string;
  activity: string;
  categoryKey: CpdCategory;
  credits: number;
  activityDate: Date;
  evidenceRef?: string;
  sourceType?: string;
  sourceId?: string;
}

export async function logCpdActivity(input: LogCpdInput): Promise<string> {
  const result = await communityDb
    .insert(schema.cpdRecords)
    .values({
      accountId: input.accountId,
      activity: input.activity,
      categoryKey: input.categoryKey,
      credits: input.credits,
      activityDate: input.activityDate,
      evidenceRef: input.evidenceRef,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
    })
    .returning({ id: schema.cpdRecords.id });

  const recordId = result[0].id;
  const year = input.activityDate.getFullYear();
  await accrueToCycle(input.accountId, year, input.credits);

  await writeCommunityAuditLog({
    actorAccountId: input.accountId,
    action: "cpd.logged",
    target: "cpd_record",
    targetId: recordId,
    after: { credits: input.credits, category: input.categoryKey },
  });

  return recordId;
}

async function accrueToCycle(
  accountId: string,
  year: number,
  credits: number
): Promise<void> {
  const existing = await communityDb
    .select()
    .from(schema.cpdCycles)
    .where(
      and(
        eq(schema.cpdCycles.accountId, accountId),
        eq(schema.cpdCycles.year, year)
      )
    )
    .limit(1);

  if (existing[0]) {
    await communityDb
      .update(schema.cpdCycles)
      .set({
        accruedCredits: existing[0].accruedCredits + credits,
        updatedAt: new Date(),
      })
      .where(eq(schema.cpdCycles.id, existing[0].id));
  } else {
    await communityDb.insert(schema.cpdCycles).values({
      accountId,
      year,
      accruedCredits: credits,
    });
  }
}

export async function getCpdRecords(accountId: string, limit = 50) {
  return communityDb
    .select()
    .from(schema.cpdRecords)
    .where(
      and(
        eq(schema.cpdRecords.accountId, accountId),
        isNull(schema.cpdRecords.archivedAt)
      )
    )
    .orderBy(desc(schema.cpdRecords.activityDate))
    .limit(limit);
}

export async function getCpdCycle(accountId: string, year?: number) {
  const targetYear = year ?? new Date().getFullYear();

  const rows = await communityDb
    .select()
    .from(schema.cpdCycles)
    .where(
      and(
        eq(schema.cpdCycles.accountId, accountId),
        eq(schema.cpdCycles.year, targetYear)
      )
    )
    .limit(1);

  if (rows[0]) return rows[0];

  const yearStart = new Date(targetYear, 0, 1);
  const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59);

  const records = await communityDb
    .select()
    .from(schema.cpdRecords)
    .where(
      and(
        eq(schema.cpdRecords.accountId, accountId),
        gte(schema.cpdRecords.activityDate, yearStart),
        lte(schema.cpdRecords.activityDate, yearEnd),
        isNull(schema.cpdRecords.archivedAt)
      )
    );

  const accrued = records.reduce((sum, r) => sum + r.credits, 0);

  return {
    accountId,
    year: targetYear,
    targetCredits: 20,
    accruedCredits: accrued,
    statementRef: null,
  };
}

export async function getCpdSummary(accountId: string) {
  const currentYear = new Date().getFullYear();
  const [cycle, recentRecords] = await Promise.all([
    getCpdCycle(accountId, currentYear),
    getCpdRecords(accountId, 5),
  ]);

  return { cycle, recentRecords };
}
