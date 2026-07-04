/**
 * Phase 8 — Feature Flags
 *
 * Every new workflow is feature-flagged for shadow-mode,
 * cutover, and rollback. Flags persist in the app DB.
 */

import { db, schema } from "../db";
import { eq } from "drizzle-orm";
import { redis } from "../queue";

const FLAG_CACHE_TTL = 300;

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const cached = await redis.get<boolean>(`flag:${key}`);
  if (cached !== null) return cached;

  const flags = await db
    .select()
    .from(schema.featureFlags)
    .where(eq(schema.featureFlags.key, key))
    .limit(1);

  const enabled = flags[0]?.enabled ?? false;
  await redis.set(`flag:${key}`, enabled, { ex: FLAG_CACHE_TTL });
  return enabled;
}

export async function setFeatureFlag(
  key: string,
  enabled: boolean,
  staffUserId?: string,
  description?: string
): Promise<void> {
  const existing = await db
    .select()
    .from(schema.featureFlags)
    .where(eq(schema.featureFlags.key, key))
    .limit(1);

  if (existing[0]) {
    await db
      .update(schema.featureFlags)
      .set({
        enabled,
        updatedBy: staffUserId,
        updatedAt: new Date(),
      })
      .where(eq(schema.featureFlags.key, key));
  } else {
    await db.insert(schema.featureFlags).values({
      key,
      enabled,
      description,
      updatedBy: staffUserId,
    });
  }

  await redis.set(`flag:${key}`, enabled, { ex: FLAG_CACHE_TTL });
}

export const FLAGS = {
  PUBLISHING_AUTOMATION: "workflow.publishing",
  PRODUCT_LAUNCH: "workflow.product_launch",
  COURSE_LAUNCH: "workflow.course_launch",
  JOURNEY_LAUNCH: "workflow.journey_launch",
  CONSULTATION: "workflow.consultation",
  CART_ABANDONMENT: "workflow.cart_abandonment",
  ORDER_PROCESSING: "workflow.order_processing",
  INVENTORY: "workflow.inventory",
  FINANCE: "workflow.finance",
  EDITORIAL: "workflow.editorial",
  EMAIL_TRANSACTIONAL: "email.transactional",
  EMAIL_LIFECYCLE: "email.lifecycle",
  CRM_SYNC: "crm.hubspot_sync",
  BOOKING_AUTOMATION: "booking.automation",
  ALERTS: "alerts.enabled",
  DASHBOARD: "dashboard.enabled",
} as const;
