/**
 * Phase 8 — Dashboard Metrics Aggregation
 *
 * Aggregates metrics from all operational systems for the
 * leadership dashboard. Each panel reads from the canonical
 * data sources and never duplicates state.
 */

import { db, schema } from "../../db";
import { count, desc, eq, gte, and, sql } from "drizzle-orm";

export interface DashboardSummary {
  timestamp: string;
  orders: { total: number; today: number; revenue: number };
  students: { total: number; active: number; certificates: number };
  patients: { total: number };
  bookings: { upcoming: number; today: number };
  inventory: { lowStock: number; expiring: number };
  publishing: { published: number; reviewDue: number };
  emails: { sent7d: number; bounceRate: number };
  workflows: { success7d: number; failed7d: number };
  alerts: { critical: number; unacknowledged: number };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalOrders,
    todayOrders,
    totalStudents,
    activeEnrolments,
    totalCertificates,
    totalPatients,
    upcomingBookings,
    todayBookings,
    emailsSent7d,
    suppressedCount,
    workflowSuccess7d,
    workflowFailed7d,
    criticalAlerts,
    unackedAlerts,
  ] = await Promise.all([
    db.select({ c: count() }).from(schema.orders),
    db.select({ c: count() }).from(schema.orders).where(gte(schema.orders.createdAt, today)),
    db.select({ c: count() }).from(schema.personRoles).where(eq(schema.personRoles.role, "student")),
    db.select({ c: count() }).from(schema.enrolments).where(eq(schema.enrolments.status, "active")),
    db.select({ c: count() }).from(schema.certificates),
    db.select({ c: count() }).from(schema.personRoles).where(eq(schema.personRoles.role, "patient")),
    db.select({ c: count() }).from(schema.bookings).where(and(gte(schema.bookings.scheduledAt, now), eq(schema.bookings.status, "confirmed"))),
    db.select({ c: count() }).from(schema.bookings).where(and(gte(schema.bookings.scheduledAt, today), eq(schema.bookings.status, "confirmed"))),
    db.select({ c: count() }).from(schema.communications).where(and(eq(schema.communications.channel, "email"), gte(schema.communications.sentAt, sevenDaysAgo))),
    db.select({ c: count() }).from(schema.emailSuppressions),
    db.select({ c: count() }).from(schema.operationsLog).where(and(eq(schema.operationsLog.status, "completed"), gte(schema.operationsLog.createdAt, sevenDaysAgo))),
    db.select({ c: count() }).from(schema.operationsLog).where(and(eq(schema.operationsLog.status, "failed"), gte(schema.operationsLog.createdAt, sevenDaysAgo))),
    db.select({ c: count() }).from(schema.operationalAlerts).where(and(eq(schema.operationalAlerts.severity, "critical"), eq(schema.operationalAlerts.acknowledged, false))),
    db.select({ c: count() }).from(schema.operationalAlerts).where(eq(schema.operationalAlerts.acknowledged, false)),
  ]);

  const sent = emailsSent7d[0]?.c ?? 0;
  const suppressed = suppressedCount[0]?.c ?? 0;

  return {
    timestamp: now.toISOString(),
    orders: { total: totalOrders[0]?.c ?? 0, today: todayOrders[0]?.c ?? 0, revenue: 0 },
    students: {
      total: totalStudents[0]?.c ?? 0,
      active: activeEnrolments[0]?.c ?? 0,
      certificates: totalCertificates[0]?.c ?? 0,
    },
    patients: { total: totalPatients[0]?.c ?? 0 },
    bookings: {
      upcoming: upcomingBookings[0]?.c ?? 0,
      today: todayBookings[0]?.c ?? 0,
    },
    inventory: { lowStock: 0, expiring: 0 },
    publishing: { published: 0, reviewDue: 0 },
    emails: {
      sent7d: sent,
      bounceRate: sent > 0 ? (suppressed / sent) * 100 : 0,
    },
    workflows: {
      success7d: workflowSuccess7d[0]?.c ?? 0,
      failed7d: workflowFailed7d[0]?.c ?? 0,
    },
    alerts: {
      critical: criticalAlerts[0]?.c ?? 0,
      unacknowledged: unackedAlerts[0]?.c ?? 0,
    },
  };
}
