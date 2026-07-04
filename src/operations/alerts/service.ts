/**
 * Phase 8 — Alert Service
 *
 * Intelligent, routed, de-duplicated alerts. Each alert has an owner,
 * channel, severity, and a de-duplication key. Critical alerts escalate
 * if unacknowledged. Every alert links to the object and remediation.
 */

import { db, schema } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { logger } from "../logging";

interface CreateAlertOptions {
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  resource?: string;
  resourceId?: string;
  ownerId?: string;
  channel?: string;
  deduplicationKey?: string;
}

export async function createAlert(options: CreateAlertOptions): Promise<string | null> {
  if (options.deduplicationKey) {
    const existing = await db
      .select()
      .from(schema.operationalAlerts)
      .where(
        and(
          eq(schema.operationalAlerts.deduplicationKey, options.deduplicationKey),
          eq(schema.operationalAlerts.acknowledged, false)
        )
      )
      .limit(1);

    if (existing[0]) {
      logger.debug("Alert deduplicated — already exists", {
        deduplicationKey: options.deduplicationKey,
      });
      return null;
    }
  }

  const result = await db
    .insert(schema.operationalAlerts)
    .values({
      type: options.type,
      severity: options.severity,
      title: options.title,
      message: options.message,
      resource: options.resource,
      resourceId: options.resourceId,
      ownerId: options.ownerId,
      channel: options.channel ?? getDefaultChannel(options.severity),
      deduplicationKey: options.deduplicationKey,
    })
    .returning({ id: schema.operationalAlerts.id });

  const alertId = result[0].id;

  await routeAlert(options);

  logger.info("Alert created", {
    alertId,
    type: options.type,
    severity: options.severity,
    title: options.title,
  });

  return alertId;
}

export async function acknowledgeAlert(alertId: string, staffUserId: string): Promise<void> {
  await db
    .update(schema.operationalAlerts)
    .set({
      acknowledged: true,
      acknowledgedBy: staffUserId,
      acknowledgedAt: new Date(),
    })
    .where(eq(schema.operationalAlerts.id, alertId));
}

export async function resolveAlert(alertId: string): Promise<void> {
  await db
    .update(schema.operationalAlerts)
    .set({ resolvedAt: new Date() })
    .where(eq(schema.operationalAlerts.id, alertId));
}

export async function getActiveAlerts(options?: {
  severity?: "info" | "warning" | "critical";
  limit?: number;
}) {
  const conditions = [eq(schema.operationalAlerts.acknowledged, false)];
  if (options?.severity) {
    conditions.push(eq(schema.operationalAlerts.severity, options.severity));
  }

  return db
    .select()
    .from(schema.operationalAlerts)
    .where(and(...conditions))
    .orderBy(desc(schema.operationalAlerts.createdAt))
    .limit(options?.limit ?? 50);
}

export async function escalateUnacknowledgedAlerts(): Promise<number> {
  const criticalUnacked = await db
    .select()
    .from(schema.operationalAlerts)
    .where(
      and(
        eq(schema.operationalAlerts.severity, "critical"),
        eq(schema.operationalAlerts.acknowledged, false),
        eq(schema.operationalAlerts.escalated, false)
      )
    );

  let escalated = 0;
  const now = Date.now();

  for (const alert of criticalUnacked) {
    const ageMs = now - new Date(alert.createdAt).getTime();
    const ESCALATION_THRESHOLD_MS = 30 * 60 * 1000;

    if (ageMs > ESCALATION_THRESHOLD_MS) {
      await db
        .update(schema.operationalAlerts)
        .set({ escalated: true, escalatedAt: new Date() })
        .where(eq(schema.operationalAlerts.id, alert.id));

      logger.warn("Alert escalated", { alertId: alert.id, title: alert.title });
      escalated++;
    }
  }

  return escalated;
}

function getDefaultChannel(severity: "info" | "warning" | "critical"): string {
  switch (severity) {
    case "critical": return "slack+email";
    case "warning": return "slack";
    case "info": return "dashboard";
  }
}

async function routeAlert(options: CreateAlertOptions): Promise<void> {
  const channel = options.channel ?? getDefaultChannel(options.severity);

  if (channel.includes("slack")) {
    await sendSlackNotification(options);
  }

  if (channel.includes("email") && options.ownerId) {
    await sendEmailNotification(options);
  }
}

async function sendSlackNotification(options: CreateAlertOptions): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const emoji = options.severity === "critical" ? "🚨" : options.severity === "warning" ? "⚠️" : "ℹ️";

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${emoji} *${options.title}*\n${options.message}${options.resource ? `\n_${options.resource}: ${options.resourceId}_` : ""}`,
      }),
    });
  } catch (error) {
    logger.error("Failed to send Slack notification", {
      error: error instanceof Error ? error.message : "Unknown",
    });
  }
}

async function sendEmailNotification(options: CreateAlertOptions): Promise<void> {
  if (!options.ownerId) return;

  try {
    const { sendTransactionalEmail } = await import("../email/service/resend");
    const owner = await db
      .select()
      .from(schema.staffUsers)
      .where(eq(schema.staffUsers.id, options.ownerId))
      .limit(1);

    if (owner[0]) {
      await sendTransactionalEmail({
        to: owner[0].email,
        subject: `[${options.severity.toUpperCase()}] ${options.title}`,
        template: "system-alert",
        data: { ...options },
      });
    }
  } catch (error) {
    logger.error("Failed to send alert email", {
      error: error instanceof Error ? error.message : "Unknown",
    });
  }
}
