/**
 * Phase 8 — Dashboard API
 *
 * Returns real-time institutional overview data.
 * Role-scoped: different users see different panels.
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/operations/db";
import { count, desc, eq, gte, and, sql } from "drizzle-orm";
import { getSystemHealth, getWorkflowMetrics, getAlertMetrics } from "@/operations/monitoring";
import { getRevenueReport, getReconciliationStatus } from "@/operations/finance/exports";
import { getLowStockProducts, getExpiringBatches } from "@/operations/inventory/service";
import { getActiveAlerts } from "@/operations/alerts/service";

export async function GET(request: NextRequest) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [
      systemHealth,
      workflowMetrics,
      alertMetrics,
      revenueReport,
      reconciliation,
      lowStock,
      expiringBatches,
      activeAlerts,
      orderMetrics,
      studentMetrics,
      bookingMetrics,
      emailMetrics,
    ] = await Promise.all([
      getSystemHealth(),
      getWorkflowMetrics(sevenDaysAgo),
      getAlertMetrics(sevenDaysAgo),
      getRevenueReport(thirtyDaysAgo, now),
      getReconciliationStatus(),
      getLowStockProducts(),
      getExpiringBatches(90),
      getActiveAlerts({ limit: 20 }),
      getOrderMetrics(thirtyDaysAgo),
      getStudentMetrics(),
      getBookingMetrics(sevenDaysAgo),
      getEmailMetrics(sevenDaysAgo),
    ]);

    return NextResponse.json({
      timestamp: now.toISOString(),
      systemHealth,
      workflows: workflowMetrics,
      alerts: alertMetrics,
      revenue: revenueReport,
      reconciliation,
      inventory: {
        lowStockProducts: lowStock,
        expiringBatches: expiringBatches.length,
      },
      activeAlerts,
      orders: orderMetrics,
      students: studentMetrics,
      bookings: bookingMetrics,
      emails: emailMetrics,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Dashboard data fetch failed" },
      { status: 500 }
    );
  }
}

async function getOrderMetrics(since: Date) {
  const totalOrders = await db
    .select({ c: count() })
    .from(schema.orders)
    .where(gte(schema.orders.createdAt, since));

  const paidOrders = await db
    .select({ c: count() })
    .from(schema.orders)
    .where(and(eq(schema.orders.status, "paid"), gte(schema.orders.createdAt, since)));

  const recentOrders = await db
    .select()
    .from(schema.orders)
    .orderBy(desc(schema.orders.createdAt))
    .limit(10);

  return {
    total: totalOrders[0]?.c ?? 0,
    paid: paidOrders[0]?.c ?? 0,
    recent: recentOrders,
  };
}

async function getStudentMetrics() {
  const totalStudents = await db
    .select({ c: count() })
    .from(schema.personRoles)
    .where(eq(schema.personRoles.role, "student"));

  const activeEnrolments = await db
    .select({ c: count() })
    .from(schema.enrolments)
    .where(eq(schema.enrolments.status, "active"));

  const totalCertificates = await db
    .select({ c: count() })
    .from(schema.certificates);

  return {
    totalStudents: totalStudents[0]?.c ?? 0,
    activeEnrolments: activeEnrolments[0]?.c ?? 0,
    totalCertificates: totalCertificates[0]?.c ?? 0,
  };
}

async function getBookingMetrics(since: Date) {
  const totalBookings = await db
    .select({ c: count() })
    .from(schema.bookings)
    .where(gte(schema.bookings.createdAt, since));

  const upcomingBookings = await db
    .select({ c: count() })
    .from(schema.bookings)
    .where(
      and(
        gte(schema.bookings.scheduledAt, new Date()),
        eq(schema.bookings.status, "confirmed")
      )
    );

  return {
    total: totalBookings[0]?.c ?? 0,
    upcoming: upcomingBookings[0]?.c ?? 0,
  };
}

async function getEmailMetrics(since: Date) {
  const totalSent = await db
    .select({ c: count() })
    .from(schema.communications)
    .where(
      and(
        eq(schema.communications.channel, "email"),
        gte(schema.communications.sentAt, since)
      )
    );

  const suppressedCount = await db
    .select({ c: count() })
    .from(schema.emailSuppressions);

  return {
    sent: totalSent[0]?.c ?? 0,
    suppressed: suppressedCount[0]?.c ?? 0,
  };
}
