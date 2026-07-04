/**
 * Phase 8 — Audit Logging
 *
 * Append-only audit trail for all privileged and gated actions.
 * Captures who, what, when, before/after, and justification.
 */

import { db, schema } from "../../db";
import { eq, desc, and, gte } from "drizzle-orm";

interface AuditEntry {
  staffUserId: string;
  action: string;
  resource: string;
  resourceId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  justification?: string;
  ipAddress?: string;
  correlationId?: string;
}

export async function writeAuditLog(entry: AuditEntry): Promise<string> {
  const result = await db
    .insert(schema.auditLog)
    .values({
      staffUserId: entry.staffUserId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      before: entry.before,
      after: entry.after,
      justification: entry.justification,
      ipAddress: entry.ipAddress,
      correlationId: entry.correlationId,
    })
    .returning({ id: schema.auditLog.id });

  return result[0].id;
}

export async function getAuditTrail(options: {
  resource?: string;
  resourceId?: string;
  staffUserId?: string;
  since?: Date;
  limit?: number;
}) {
  const conditions = [];

  if (options.resource) {
    conditions.push(eq(schema.auditLog.resource, options.resource));
  }
  if (options.resourceId) {
    conditions.push(eq(schema.auditLog.resourceId, options.resourceId));
  }
  if (options.staffUserId) {
    conditions.push(eq(schema.auditLog.staffUserId, options.staffUserId));
  }
  if (options.since) {
    conditions.push(gte(schema.auditLog.occurredAt, options.since));
  }

  return db
    .select()
    .from(schema.auditLog)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(schema.auditLog.occurredAt))
    .limit(options.limit ?? 50);
}

export async function getActivityHistory(
  resource: string,
  resourceId: string,
  limit = 25
) {
  return db
    .select()
    .from(schema.auditLog)
    .where(
      and(
        eq(schema.auditLog.resource, resource),
        eq(schema.auditLog.resourceId, resourceId)
      )
    )
    .orderBy(desc(schema.auditLog.occurredAt))
    .limit(limit);
}
