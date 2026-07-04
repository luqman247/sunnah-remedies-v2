/**
 * Phase 9 — Community Audit Logging
 *
 * Immutable audit trail for membership, role, and security-relevant actions.
 */

import { communityDb, schema } from "@/db";

export interface CommunityAuditEntry {
  actorAccountId?: string;
  action: string;
  target: string;
  targetId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  correlationId?: string;
}

export async function writeCommunityAuditLog(
  entry: CommunityAuditEntry
): Promise<string> {
  const result = await communityDb
    .insert(schema.communityAuditLog)
    .values({
      actorAccountId: entry.actorAccountId,
      action: entry.action,
      target: entry.target,
      targetId: entry.targetId,
      before: entry.before,
      after: entry.after,
      ipAddress: entry.ipAddress,
      correlationId: entry.correlationId,
    })
    .returning({ id: schema.communityAuditLog.id });

  return result[0].id;
}
