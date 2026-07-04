/**
 * Phase 8 — Monitoring & Health Checks
 *
 * System health, service checks, and performance monitoring.
 * Feeds the operational dashboard and alerting system.
 */

import { db, schema } from "../db";
import { logger } from "../logging";
import { eq, desc, count, and, gte, sql } from "drizzle-orm";

export interface HealthStatus {
  service: string;
  status: "healthy" | "degraded" | "down";
  latencyMs?: number;
  details?: string;
  checkedAt: string;
}

export async function checkServiceHealth(
  serviceName: string,
  checkFn: () => Promise<void>
): Promise<HealthStatus> {
  const start = Date.now();
  try {
    await checkFn();
    return {
      service: serviceName,
      status: "healthy",
      latencyMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`Health check failed: ${serviceName}`, {
      service: serviceName,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      service: serviceName,
      status: "down",
      latencyMs: Date.now() - start,
      details: error instanceof Error ? error.message : "Unknown error",
      checkedAt: new Date().toISOString(),
    };
  }
}

export async function getSystemHealth(): Promise<HealthStatus[]> {
  const checks = await Promise.allSettled([
    checkServiceHealth("database", async () => {
      await db.select({ c: count() }).from(schema.people);
    }),
    checkServiceHealth("redis", async () => {
      const { redis } = await import("../queue");
      await redis.ping();
    }),
  ]);

  return checks.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : {
          service: "unknown",
          status: "down" as const,
          details: "Check threw an unhandled error",
          checkedAt: new Date().toISOString(),
        }
  );
}

/* ── Workflow Metrics ───────────────────────────────────────────── */

export async function getWorkflowMetrics(since: Date) {
  const successCount = await db
    .select({ c: count() })
    .from(schema.operationsLog)
    .where(
      and(
        eq(schema.operationsLog.status, "completed"),
        gte(schema.operationsLog.createdAt, since)
      )
    );

  const failureCount = await db
    .select({ c: count() })
    .from(schema.operationsLog)
    .where(
      and(
        eq(schema.operationsLog.status, "failed"),
        gte(schema.operationsLog.createdAt, since)
      )
    );

  const avgDuration = await db
    .select({
      avg: sql<number>`avg(${schema.operationsLog.durationMs})`,
    })
    .from(schema.operationsLog)
    .where(
      and(
        eq(schema.operationsLog.status, "completed"),
        gte(schema.operationsLog.createdAt, since)
      )
    );

  const recentFailures = await db
    .select()
    .from(schema.operationsLog)
    .where(eq(schema.operationsLog.status, "failed"))
    .orderBy(desc(schema.operationsLog.createdAt))
    .limit(10);

  return {
    successes: successCount[0]?.c ?? 0,
    failures: failureCount[0]?.c ?? 0,
    averageDurationMs: avgDuration[0]?.avg ?? 0,
    recentFailures,
  };
}

/* ── Alert Metrics ──────────────────────────────────────────────── */

export async function getAlertMetrics(since: Date) {
  const unacknowledged = await db
    .select({ c: count() })
    .from(schema.operationalAlerts)
    .where(eq(schema.operationalAlerts.acknowledged, false));

  const critical = await db
    .select({ c: count() })
    .from(schema.operationalAlerts)
    .where(
      and(
        eq(schema.operationalAlerts.severity, "critical"),
        eq(schema.operationalAlerts.acknowledged, false)
      )
    );

  const recent = await db
    .select()
    .from(schema.operationalAlerts)
    .where(gte(schema.operationalAlerts.createdAt, since))
    .orderBy(desc(schema.operationalAlerts.createdAt))
    .limit(20);

  return {
    unacknowledgedCount: unacknowledged[0]?.c ?? 0,
    criticalCount: critical[0]?.c ?? 0,
    recentAlerts: recent,
  };
}
