"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  timestamp: string;
  systemHealth: Array<{ service: string; status: string; latencyMs?: number }>;
  workflows: { successes: number; failures: number; averageDurationMs: number };
  alerts: { unacknowledgedCount: number; criticalCount: number; recentAlerts: Array<{ id: string; title: string; severity: string; message: string; createdAt: string }> };
  revenue: { period: string; total: { revenue: number; count: number; vat: number }; streams: Record<string, { revenue: number; count: number }> };
  inventory: { lowStockProducts: Array<{ productId: string; currentStock: number; reorderPoint: number }>; expiringBatches: number };
  orders: { total: number; paid: number };
  students: { totalStudents: number; activeEnrolments: number; totalCertificates: number };
  bookings: { total: number; upcoming: number };
  emails: { sent: number; suppressed: number };
  reconciliation: { unreconciled: number; reconciled: number };
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/operations/dashboard");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch {
        // Dashboard will show loading state
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="font-[family-name:var(--font-body)] text-sm text-emerald/50">
          Loading institutional data
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-[#8A4B3B]/20 bg-[#8A4B3B]/5 p-4">
        <p className="font-[family-name:var(--font-body)] text-sm text-[#8A4B3B]">
          Unable to load dashboard data. Verify database connection
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health */}
      <DashboardSection title="System Health">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.systemHealth.map((service) => (
            <StatusCard
              key={service.service}
              label={service.service}
              status={service.status}
              detail={service.latencyMs ? `${service.latencyMs}ms` : undefined}
            />
          ))}
        </div>
      </DashboardSection>

      {/* Key Metrics */}
      <DashboardSection title="Institution Overview">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Orders (30d)" value={data.orders.total} />
          <MetricCard label="Revenue (30d)" value={`£${data.revenue.total.revenue.toFixed(0)}`} />
          <MetricCard label="Students" value={data.students.totalStudents} />
          <MetricCard label="Active Enrolments" value={data.students.activeEnrolments} />
          <MetricCard label="Certificates Issued" value={data.students.totalCertificates} />
          <MetricCard label="Upcoming Bookings" value={data.bookings.upcoming} />
          <MetricCard label="Emails Sent (7d)" value={data.emails.sent} />
          <MetricCard label="Email Suppressions" value={data.emails.suppressed} />
        </div>
      </DashboardSection>

      {/* Revenue by Stream */}
      {Object.keys(data.revenue.streams).length > 0 && (
        <DashboardSection title="Revenue by Stream">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(data.revenue.streams).map(([stream, metrics]) => (
              <MetricCard
                key={stream}
                label={stream.charAt(0).toUpperCase() + stream.slice(1)}
                value={`£${metrics.revenue.toFixed(0)}`}
                detail={`${metrics.count} transactions`}
              />
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Workflows */}
      <DashboardSection title="Workflows (7d)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricCard label="Successful" value={data.workflows.successes} />
          <MetricCard
            label="Failed"
            value={data.workflows.failures}
            alert={data.workflows.failures > 0}
          />
          <MetricCard label="Avg Duration" value={`${Math.round(data.workflows.averageDurationMs)}ms`} />
        </div>
      </DashboardSection>

      {/* Inventory */}
      <DashboardSection title="Inventory">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Low Stock Items"
            value={data.inventory.lowStockProducts.length}
            alert={data.inventory.lowStockProducts.length > 0}
          />
          <MetricCard
            label="Expiring Batches"
            value={data.inventory.expiringBatches}
            alert={data.inventory.expiringBatches > 0}
          />
          <MetricCard label="Unreconciled" value={data.reconciliation.unreconciled} />
        </div>
      </DashboardSection>

      {/* Alerts */}
      <DashboardSection title="Operational Alerts">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-4">
          <MetricCard
            label="Critical"
            value={data.alerts.criticalCount}
            alert={data.alerts.criticalCount > 0}
          />
          <MetricCard
            label="Unacknowledged"
            value={data.alerts.unacknowledgedCount}
            alert={data.alerts.unacknowledgedCount > 0}
          />
        </div>

        {data.alerts.recentAlerts.length > 0 && (
          <div className="space-y-2">
            {data.alerts.recentAlerts.slice(0, 10).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border text-sm ${
                  alert.severity === "critical"
                    ? "border-[#8A4B3B]/30 bg-[#8A4B3B]/5"
                    : alert.severity === "warning"
                    ? "border-[#96763F]/30 bg-[#96763F]/5"
                    : "border-emerald/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-[family-name:var(--font-utility)] text-xs font-medium text-emerald">
                      {alert.title}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-xs text-emerald/60 mt-0.5">
                      {alert.message}
                    </p>
                  </div>
                  <span className="font-[family-name:var(--font-utility)] text-[10px] uppercase tracking-wider text-emerald/40 whitespace-nowrap">
                    {new Date(alert.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}

function DashboardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-[0.15em] text-emerald/50 mb-3">
        {title}
      </h2>
      <div className="border-t border-emerald/10 pt-4">{children}</div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  detail,
  alert,
}: {
  label: string;
  value: string | number;
  detail?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`p-3 border ${
        alert ? "border-[#8A4B3B]/30 bg-[#8A4B3B]/5" : "border-emerald/10"
      }`}
    >
      <p className="font-[family-name:var(--font-utility)] text-[10px] uppercase tracking-wider text-emerald/50">
        {label}
      </p>
      <p className={`font-[family-name:var(--font-display)] text-xl font-light mt-1 ${
        alert ? "text-[#8A4B3B]" : "text-emerald"
      }`}>
        {value}
      </p>
      {detail && (
        <p className="font-[family-name:var(--font-body)] text-[10px] text-emerald/40 mt-0.5">
          {detail}
        </p>
      )}
    </div>
  );
}

function StatusCard({
  label,
  status,
  detail,
}: {
  label: string;
  status: string;
  detail?: string;
}) {
  const statusColor = status === "healthy" ? "emerald" : status === "degraded" ? "#96763F" : "#8A4B3B";

  return (
    <div className="p-3 border border-emerald/10">
      <p className="font-[family-name:var(--font-utility)] text-[10px] uppercase tracking-wider text-emerald/50">
        {label}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        <span
          className="font-[family-name:var(--font-utility)] text-xs capitalize"
          style={{ color: statusColor }}
        >
          {status}
        </span>
      </div>
      {detail && (
        <p className="font-[family-name:var(--font-body)] text-[10px] text-emerald/40 mt-0.5">
          {detail}
        </p>
      )}
    </div>
  );
}
