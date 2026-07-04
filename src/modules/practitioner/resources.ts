/**
 * Phase 9 — Saved Resources Service
 */

import { communityDb, schema } from "@/db";
import { eq, and, desc } from "drizzle-orm";

export interface SaveResourceInput {
  accountId: string;
  targetType: string;
  targetId: string;
  title: string;
  href?: string;
  metadata?: Record<string, unknown>;
}

export async function saveResource(input: SaveResourceInput): Promise<string> {
  const existing = await communityDb
    .select()
    .from(schema.savedResources)
    .where(
      and(
        eq(schema.savedResources.accountId, input.accountId),
        eq(schema.savedResources.targetType, input.targetType),
        eq(schema.savedResources.targetId, input.targetId)
      )
    )
    .limit(1);

  if (existing[0]) return existing[0].id;

  const result = await communityDb
    .insert(schema.savedResources)
    .values({
      accountId: input.accountId,
      targetType: input.targetType,
      targetId: input.targetId,
      title: input.title,
      href: input.href,
      metadata: input.metadata ?? {},
    })
    .returning({ id: schema.savedResources.id });

  return result[0].id;
}

export async function removeSavedResource(
  accountId: string,
  targetType: string,
  targetId: string
): Promise<void> {
  await communityDb
    .delete(schema.savedResources)
    .where(
      and(
        eq(schema.savedResources.accountId, accountId),
        eq(schema.savedResources.targetType, targetType),
        eq(schema.savedResources.targetId, targetId)
      )
    );
}

export async function getSavedResources(accountId: string) {
  return communityDb
    .select()
    .from(schema.savedResources)
    .where(eq(schema.savedResources.accountId, accountId))
    .orderBy(desc(schema.savedResources.savedAt));
}

export async function searchSavedResources(
  accountId: string,
  query: string
) {
  const resources = await getSavedResources(accountId);
  const q = query.toLowerCase();
  return resources.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.targetType.toLowerCase().includes(q)
  );
}
